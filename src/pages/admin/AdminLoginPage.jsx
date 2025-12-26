import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../LoginPage.css' // Reuse existing styles

const AdminLoginPage = () => {
    const navigate = useNavigate()
    const [role, setRole] = useState('LAB_ADMIN')
    const [form, setForm] = useState({ email: '', password: '' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const onInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError(null)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            setError('Please fill in all fields.')
            return
        }

        setSubmitting(true)

        // Simulate Admin Login (Integration would go here)
        setTimeout(() => {
            setSubmitting(false)
            if (role === 'LAB_ADMIN') {
                navigate('/lab-admin-dashboard')
            } else {
                navigate('/super-admin-dashboard')
            }
        }, 800)
    }

    return (
        <form className="auth-form" onSubmit={onSubmit} style={{ marginTop: 0 }}>
            {/* Role Selection */}
            <div style={{ marginBottom: '24px', background: '#F1F5F9', padding: '4px', borderRadius: '12px', display: 'flex' }}>
                <button
                    type="button"
                    onClick={() => setRole('LAB_ADMIN')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600,
                        background: role === 'LAB_ADMIN' ? 'white' : 'transparent',
                        boxShadow: role === 'LAB_ADMIN' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'LAB_ADMIN' ? '#0F172A' : '#64748B',
                        transition: 'all 0.2s'
                    }}
                >
                    Lab Admin
                </button>
                <button
                    type="button"
                    onClick={() => setRole('SUPER_ADMIN')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600,
                        background: role === 'SUPER_ADMIN' ? 'white' : 'transparent',
                        boxShadow: role === 'SUPER_ADMIN' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        color: role === 'SUPER_ADMIN' ? '#0F172A' : '#64748B',
                        transition: 'all 0.2s'
                    }}
                >
                    Super Admin
                </button>
            </div>

            <div className="form-field">
                <label>Work Email</label>
                <div className="input-shell">
                    <input
                        name="email"
                        type="email"
                        placeholder={role === 'LAB_ADMIN' ? "admin@lab.com" : "sysadmin@medibot.com"}
                        value={form.email}
                        onChange={onInput}
                    />
                </div>
            </div>

            <div className="form-field">
                <label>Password</label>
                <div className="input-shell">
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={onInput}
                    />
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <Link to="/admin/forgot" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
            </div>

            {error && <p className="status-text status-error">{error}</p>}

            <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? 'Authenticating...' : `Login as ${role === 'LAB_ADMIN' ? 'Lab Admin' : 'Super Admin'}`}
            </button>

            <div className="divider"></div>

            <p className="footnote">
                New Lab? <Link to="/admin/signup">Request Access</Link>
            </p>
        </form>
    )
}

export default AdminLoginPage
