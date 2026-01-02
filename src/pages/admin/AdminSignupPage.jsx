import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleLabSignup } from '../../services/api'
import '../LoginPage.css'

const AdminSignupPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        labName: '',
        adminName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [generatedPin, setGeneratedPin] = useState(null)

    const onInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError(null)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        setSubmitting(true)
        try {
            const result = await handleLabSignup({
                email: form.email,
                password: form.password,
                // We're passing extra data, backend needs to handle or ignore it
                labName: form.labName,
                adminName: form.adminName,
                phone: form.phone
            })
            setGeneratedPin(result.pin_code)
            setSubmitted(true)
        } catch (err) {
            setError(err.message || "Registration failed.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            {!submitted ? (
                <>
                    <p style={{ marginBottom: '20px', color: '#64748B', fontSize: '14px' }}>
                        Register your laboratory to access the Lab Admin Dashboard.
                    </p>

                    <div className="form-field">
                        <label>Laboratory Name</label>
                        <input name="labName" placeholder="Ex. City Diagnostics" value={form.labName} onChange={onInput} required />
                    </div>

                    <div className="form-field">
                        <label>Administrator Name</label>
                        <input name="adminName" placeholder="Your full name" value={form.adminName} onChange={onInput} required />
                    </div>

                    <div className="form-field">
                        <label>Business Email</label>
                        <input name="email" type="email" placeholder="contact@labname.com" value={form.email} onChange={onInput} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-field">
                            <label>Password</label>
                            <input name="password" type="password" placeholder="Create password" value={form.password} onChange={onInput} required />
                        </div>
                        <div className="form-field">
                            <label>Confirm</label>
                            <input name="confirmPassword" type="password" placeholder="Confirm" value={form.confirmPassword} onChange={onInput} required />
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Phone Number</label>
                        <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={onInput} required />
                    </div>

                    {error && <p className="status-text status-error">{error}</p>}

                    <button className="primary-btn" type="submit" disabled={submitting}>
                        {submitting ? 'Registering...' : 'Register Laboratory'}
                    </button>

                    <p className="footnote">
                        Already registered? <Link to="/admin/login">Admin Login</Link>
                    </p>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>Registration Successful</h3>
                    <p style={{ color: '#64748B', lineHeight: '1.5', marginBottom: '24px' }}>
                        Your Lab Admin account has been created.
                    </p>

                    {generatedPin && (
                        <div style={{ background: '#FEF3C7', padding: '16px', borderRadius: '12px', border: '1px solid #FCD34D', marginBottom: '24px' }}>
                            <p style={{ color: '#92400E', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                Your Access Pass Key
                            </p>
                            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '4px', color: '#B45309' }}>
                                {generatedPin}
                            </div>
                            <p style={{ fontSize: '12px', color: '#92400E', marginTop: '8px' }}>
                                SAVE THIS KEY! You will need it to verify your identity every time you log in.
                            </p>
                        </div>
                    )}

                    <Link to="/admin/login" className="ghost-btn" style={{ marginTop: '0' }}>Proceed to Login</Link>
                </div>
            )}
        </form>
    )
}

export default AdminSignupPage
