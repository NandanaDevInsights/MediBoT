import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../LoginPage.css'

const AdminSignupPage = () => {
    const [form, setForm] = useState({ labName: '', adminName: '', email: '', phone: '' })
    const [submitted, setSubmitted] = useState(false)

    const onInput = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const onSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            {!submitted ? (
                <>
                    <p style={{ marginBottom: '20px', color: '#64748B', fontSize: '14px' }}>
                        Strictly for laboratory registration. Your request will be reviewed by a Super Admin.
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

                    <div className="form-field">
                        <label>Phone Number</label>
                        <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={onInput} required />
                    </div>

                    <button className="primary-btn" type="submit">Submit Request</button>

                    <p className="footnote">
                        Already registered? <Link to="/admin/login">Admin Login</Link>
                    </p>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>Request Submitted</h3>
                    <p style={{ color: '#64748B', lineHeight: '1.5' }}>
                        Thank you, {form.adminName}. Our team will contact {form.email} within 24 hours to verify your laboratory details.
                    </p>
                    <Link to="/admin/login" className="ghost-btn" style={{ marginTop: '24px' }}>Back to Login</Link>
                </div>
            )}
        </form>
    )
}

export default AdminSignupPage
