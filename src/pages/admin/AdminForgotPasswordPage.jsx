import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../LoginPage.css'

const AdminForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            {!submitted ? (
                <>
                    <p style={{ marginBottom: '24px', color: '#64748B', fontSize: '14px' }}>
                        Enter your registered admin email address. We'll send you a secure link to reset your administrative credentials.
                    </p>

                    <div className="form-field">
                        <label>Admin Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="admin@organization.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button className="primary-btn" type="submit">Send Reset Link</button>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Link to="/admin/login" style={{ color: '#64748B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Back to Login</Link>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>Check your email</h3>
                    <p style={{ color: '#64748B', lineHeight: '1.5' }}>
                        If an admin account exists for <strong>{email}</strong>, you will receive password reset instructions momentarily.
                    </p>
                    <button
                        type="button"
                        className="ghost-btn"
                        style={{ marginTop: '24px' }}
                        onClick={() => setSubmitted(false)}
                    >
                        Try another email
                    </button>
                </div>
            )}
        </form>
    )
}

export default AdminForgotPasswordPage
