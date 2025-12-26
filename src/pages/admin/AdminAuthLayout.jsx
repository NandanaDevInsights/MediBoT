import { Link, useLocation } from 'react-router-dom'
import heroImage from '../../assets/Bg.jpg'
import logoImage from '../../assets/Logo.png'
import '../../App.css'

const AdminAuthLayout = ({ children, heading, subheading }) => {
    return (
        <div className="auth-shell">
            <div className="hero-side">
                <img src={heroImage} alt="MediBot Healthcare" />
                <div className="hero-copy">
                    <p className="hero-title">Admin Portal</p>
                    <p className="hero-sub">Secure access for Laboratory and System Administrators.</p>
                </div>
            </div>

            <div className="form-side">
                <div className="admin-chip">
                    <Link to="/login">Patient Portal</Link>
                </div>
                <div className="brand-row">
                    <img src={logoImage} alt="MediBot Logo" style={{ width: 40, height: 'auto' }} />
                    <span className="brand-name">MediBot Admin</span>
                </div>
                <div className="intro">
                    <h2>{heading}</h2>
                    <p className="sub-text">{subheading || 'Please enter your credentials to access the dashboard.'}</p>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AdminAuthLayout
