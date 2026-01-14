import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import pool from '../config/db.js'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null

const buildOAuthClient = () => {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!googleClientId || !clientSecret) throw new Error('Google OAuth is not fully configured.')
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${process.env.BACKEND_BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`
  return new OAuth2Client(googleClientId, clientSecret, redirectUri)
}

const signAuthToken = (user) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' },
  )
}

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('eg_auth', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const signup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, role = 'USER' } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' })

    const hashed = await bcrypt.hash(password, 12)
    const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER'

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) return res.status(409).json({ message: 'Account already exists.' })

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, provider) VALUES (?, ?, ?, ?)',
      [email, hashed, normalizedRole, 'password'],
    )

    const token = signAuthToken({ id: result.insertId, email, role: normalizedRole })
    setAuthCookie(res, token)
    res.status(201).json({ message: 'Signup successful.', token })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password, role = 'USER' } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })

    const [rows] = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials.' })

    const user = rows[0]
    const passwordOk = await bcrypt.compare(password, user.password_hash || '')
    if (!passwordOk) return res.status(401).json({ message: 'Invalid credentials.' })
    if (role === 'ADMIN' && user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access denied.' })

    const token = signAuthToken(user)
    setAuthCookie(res, token)
    res.json({ message: 'Login successful.', token })
  } catch (err) {
    next(err)
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body
    if (!googleClient || !googleClientId) {
      return res.status(500).json({ message: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID/SECRET.' })
    }
    if (!token) return res.status(400).json({ message: 'Google token is required.' })

    // Verify Google ID token to ensure authenticity
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: googleClientId })
    const payload = ticket.getPayload()
    const email = payload?.email
    if (!email) return res.status(400).json({ message: 'Google token missing email.' })

    const [rows] = await pool.query('SELECT id, email, role FROM users WHERE email = ?', [email])
    let user = rows[0]

    if (!user) {
      const [insert] = await pool.query(
        'INSERT INTO users (email, provider, role) VALUES (?, ?, ?)',
        [email, 'google', 'USER'],
      )
      user = { id: insert.insertId, email, role: 'USER' }
    }

    const authToken = signAuthToken(user)
    setAuthCookie(res, authToken)
    res.json({ message: 'Google login successful.', token: authToken })
  } catch (err) {
    next(err)
  }
}

export const googleOAuthStart = (req, res, next) => {
  try {
    const client = buildOAuthClient()
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'select_account',
      scope: ['openid', 'email', 'profile'],
    })
    res.redirect(authUrl)
  } catch (err) {
    next(err)
  }
}

export const googleOAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query
    if (!code) return res.status(400).json({ message: 'Missing authorization code.' })

    const client = buildOAuthClient()
    const { tokens } = await client.getToken(code)
    if (!tokens?.id_token) return res.status(400).json({ message: 'No ID token returned from Google.' })

    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: googleClientId })
    const payload = ticket.getPayload()
    const email = payload?.email
    if (!email) return res.status(400).json({ message: 'Google token missing email.' })

    const [rows] = await pool.query('SELECT id, email, role FROM users WHERE email = ?', [email])
    let user = rows[0]
    if (!user) {
      const [insert] = await pool.query(
        'INSERT INTO users (email, provider, role) VALUES (?, ?, ?)',
        [email, 'google', 'USER'],
      )
      user = { id: insert.insertId, email, role: 'USER' }
    }

    const authToken = signAuthToken(user)
    setAuthCookie(res, authToken)

    const redirectUrl = `${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}/welcome`
    res.redirect(redirectUrl)
  } catch (err) {
    next(err)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const [rows] = await pool.query('SELECT id, provider FROM users WHERE email = ?', [email])
    if (!rows.length) return res.json({ message: 'If the account exists, a reset link will be emailed.' })

    const user = rows[0]
    if (user.provider !== 'password') return res.json({ message: 'If the account exists, a reset link will be emailed.' })

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours to prevent timezone issues expiration

    await pool.query(
      'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    )

    const origin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'
    const resetLink = `${origin}/reset?token=${token}`

    // In production, use nodemailer. For dev/demo, log to console.
    console.log(`[RESET LINK] For ${email}: ${resetLink}`)

    res.json({ message: 'If the account exists, a reset link will be emailed.' })
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required.' })
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Find valid, unused token
    // DEBUG MODE: First find purely by hash
    const [tokens] = await pool.query(
      'SELECT pr.id, pr.user_id, pr.used, pr.expires_at FROM password_resets pr WHERE pr.token_hash = ?',
      [tokenHash]
    )

    console.log('[DEBUG-NODE] Tokens found for hash:', tokens)

    const validToken = tokens.find(t => {
      // Robust check for 'used' (handle number, boolean, or buffer)
      let isUsed = t.used === 1 || t.used === true
      if (Buffer.isBuffer(t.used)) isUsed = t.used[0] === 1

      const now = new Date()
      const expiresAt = new Date(t.expires_at)
      const isExpired = expiresAt <= now

      console.log(`[DEBUG-NODE] Checking token ${t.id}: UsedRaw=${t.used}, Used=${isUsed}, Expires=${expiresAt.toISOString()}, Now=${now.toISOString()}`)
      return !isUsed && !isExpired
    })

    if (!validToken) return res.status(400).json({ message: 'Invalid or expired reset link.' })
    const resetRecord = validToken

    const hashed = await bcrypt.hash(password, 12)

    // Update user password
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, resetRecord.user_id])

    // Mark token as used
    await pool.query('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id])

    res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    next(err)
  }
}
