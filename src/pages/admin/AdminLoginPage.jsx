import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { handleLogin, verifyOtp, startGoogleOAuth, getUserProfile } from '../../services/api'
import '../LoginPage.css'

const InputField = ({ label, type = 'text', name, placeholder, value, onChange, error, icon }) => {
    return (
        <div className="form-field">
            <label htmlFor={name}>{label}</label>
            <div className={`input-shell ${error ? 'has-error' : ''}`}>
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <span className="input-icon" aria-hidden>
                    {icon}
                </span>
            </div>
            {error ? <p className="input-error">{error}</p> : null}
        </div>
    )
}

const AdminLoginPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [role, setRole] = useState('LAB_ADMIN')
    const [form, setForm] = useState({ email: '', password: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // OTP State
    const [showOtp, setShowOtp] = useState(false)
    const [otp, setOtp] = useState('')

    // PIN Lock State
    const [showPinScreen, setShowPinScreen] = useState(false)
    const [pin, setPin] = useState(['', '', '', ''])
    const [expectedPin, setExpectedPin] = useState(null)

    // Handle Google Login Redirect (PIN Check - Fallback or Direct)
    useEffect(() => {
        if (location.state?.verifyPin && location.state?.pinCode) {
            setExpectedPin(location.state.pinCode)
            setShowPinScreen(true)
        }
    }, [location.state])

    const onInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError(null)
    }

    const processLoginSuccess = (result) => {
        // Enforce Server-Side Role Check
        const serverRole = result.role;

        if (serverRole === 'LAB_ADMIN') {
            sessionStorage.setItem('auth_role', 'LAB_ADMIN');
            sessionStorage.removeItem('lab_admin_pin_verified');
            navigate('/lab-admin-dashboard', { replace: true });
        } else if (serverRole === 'SUPER_ADMIN') {
            sessionStorage.setItem('auth_role', 'SUPER_ADMIN');
            navigate('/super-admin-dashboard', { replace: true });
        } else {
            // If a regular user tries to log in, redirect them to the patient portal
            navigate('/welcome', { replace: true });
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (showOtp) {
            if (!otp) {
                setError('Please enter the OTP.')
                return
            }
            setSubmitting(true)
            try {
                // Verify OTP
                const result = await verifyOtp({ email: form.email, otp })
                // Success
                processLoginSuccess(result)
            } catch (err) {
                setSubmitting(false)
                setError(err.message || 'Invalid OTP.')
            }
            return
        }

        if (!form.email || !form.password) {
            setError('Please fill in all fields.')
            return
        }

        setSubmitting(true)
        try {
            const result = await handleLogin(form)
            setSubmitting(false)

            if (result.require_otp) {
                setShowOtp(true)
                // Optionally show a message that OTP was sent
            } else {
                processLoginSuccess(result)
            }
        } catch (err) {
            setSubmitting(false)
            setError(err.message || 'Login failed.')
        }
    }

    const handlePinChange = (element, index) => {
        const value = element.value.toUpperCase() // Normalize case
        if (value.length > 1) return

        const newPin = [...pin]
        newPin[index] = value
        setPin(newPin)

        // Focus next
        if (value && element.nextSibling) {
            element.nextSibling.focus()
        }

        // Check if complete
        if (newPin.join('').length === 4) {
            verifyPin(newPin.join(''))
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !pin[index] && e.target.previousSibling) {
            e.target.previousSibling.focus()
        }
    }

    const verifyPin = (enteredPin) => {
        // Dynamic check against backend provided PIN
        if (enteredPin === expectedPin) {
            // AUTHORIZE SESSION so dashboard doesn't ask again
            sessionStorage.setItem('lab_admin_pin_verified', 'true')
            navigate('/lab-admin-dashboard')
        } else {
            setError('Incorrect Security PIN')
            // Reset after delay
            setTimeout(() => {
                setPin(['', '', '', ''])
                setError(null)
                document.getElementById('pin-0')?.focus()
            }, 1000)
        }
    }

    if (showPinScreen) {
        return (
            <div className="auth-form" style={{ marginTop: 0, textAlign: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '3rem' }}>🔒</div>
                    <h2 style={{ color: '#0F172A', marginTop: '10px' }}>Security Check</h2>
                    <p style={{ color: '#64748B' }}>Enter your 4-letter pass key to continue.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handlePinChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            style={{
                                width: '50px', height: '50px', fontSize: '24px', textAlign: 'center',
                                borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none',
                                fontWeight: 'bold', color: '#0F172A', textTransform: 'uppercase'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                    ))}
                </div>

                {error && <p className="status-text status-error" style={{ marginBottom: '16px' }}>{error}</p>}
            </div>
        )
    }

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            {/* Role Selection */}
            {!showOtp && (
                <div className="role-switcher">
                    <button
                        type="button"
                        onClick={() => setRole('LAB_ADMIN')}
                        className={`role-btn ${role === 'LAB_ADMIN' ? 'active' : ''}`}
                    >
                        Lab Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('SUPER_ADMIN')}
                        className={`role-btn ${role === 'SUPER_ADMIN' ? 'active' : ''}`}
                    >
                        Super Admin
                    </button>
                </div>
            )}

            {!showOtp ? (
                <>
                    <InputField
                        label="Work Email"
                        name="email"
                        type="email"
                        placeholder={role === 'LAB_ADMIN' ? "admin@lab.com" : "sysadmin@medibot.com"}
                        value={form.email}
                        onChange={onInput}
                        icon={
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 3.22222L8.25 7.83333L15.5 3.22222M2.8 1H14.2C15.1941 1 16 1.79218 16 2.76471V11.2353C16 12.2078 15.1941 13 14.2 13H2.8C1.80589 13 1 12.2078 1 11.2353V2.76471C1 1.79218 1.80589 1 2.8 1Z"
                                    stroke="#4da3ff"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }
                    />

                    <div className="field-with-link">
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={onInput}
                            icon={
                                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="7" width="12" height="8" rx="1.6" stroke="#4da3ff" strokeWidth="1.2" />
                                    <path
                                        d="M6 7V5C6 2.79086 7.79086 1 10 1C12.2091 1 14 2.79086 14 5V7"
                                        stroke="#4da3ff"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            }
                        />
                        <Link className="inline-link" to="/admin/forgot">
                            Forgot Password?
                        </Link>
                    </div>
                </>
            ) : (
                <div className="form-field">
                    <label>Enter Verification Code</label>
                    <div className="input-shell">
                        <input
                            type="text"
                            placeholder="• • • • • •"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Check your email ({form.email}) for the code.
                    </p>
                </div>
            )}

            <p className={`status-text ${error ? 'status-error' : ''}`}>{error}</p>

            <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? 'Processing...' : showOtp ? 'Verify & Login' : `Login as ${role === 'LAB_ADMIN' ? 'Lab Admin' : 'Super Admin'} `}
            </button>

            <div className="divider" role="separator" aria-hidden />

            <button className="ghost-btn" type="button" onClick={startGoogleOAuth}>
                <span className="google-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                        <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                        <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                        <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                </span>
                Continue with Google
            </button>

            {role !== 'SUPER_ADMIN' && (
                <p className="footnote">
                    New Lab? <Link to="/admin/signup">Request Access</Link>
                </p>
            )}
        </form>
    )
}

export default AdminLoginPage
