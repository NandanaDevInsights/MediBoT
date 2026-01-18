// Default to Flask backend (http://localhost:5000/api). Override with VITE_API_URL in .env.local.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.message || 'Unexpected server error.'
    throw new Error(message)
  }
  return data
}

export const handleLogin = async (payload) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export const handleAdminLogin = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}


export const verifyOtp = async (payload) => {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export const handleSignup = async (payload) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export const handleLabSignup = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export const handleGoogleAuth = async (token) => {
  const res = await fetch(`${API_BASE}/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token }),
  })
  return parseResponse(res)
}

export const startGoogleOAuth = () => {
  window.location.href = `${API_BASE}/google/start`
}

export const requestPasswordReset = async (email) => {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return parseResponse(res)
}


export const resetPassword = async (payload) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}


export const getUserProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return parseResponse(res)
}

export const updateUserProfile = async (payload) => {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseResponse(res)
}

export const getUserReports = async () => {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return parseResponse(res)
}

export const getUserNotifications = async () => {
  const res = await fetch(`${API_BASE}/user/notifications`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return parseResponse(res)
}

