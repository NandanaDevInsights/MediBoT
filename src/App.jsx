import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import heroImage from './assets/Bg.jpg'
import logoImage from './assets/Logo.png'
import LabAdminDashboard from './pages/LabAdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminAuthLayout from './pages/admin/AdminAuthLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminSignupPage from './pages/admin/AdminSignupPage'
import AdminForgotPasswordPage from './pages/admin/AdminForgotPasswordPage'
import './App.css'

const AuthLayout = ({ children, heading, subheading }) => {
  const location = useLocation()
  const isLogin = location.pathname === '/' || location.pathname === '/login'

  return (
    <div className="auth-shell">
      <div className="hero-side">
        <img src={heroImage} alt="MediBot Healthcare" />
        <div className="hero-copy">
          <p className="hero-title">Healthcare Intelligence</p>
          <p className="hero-sub">Access your AI-powered healthcare management system.</p>
        </div>
      </div>

      <div className="form-side">
        <div className="admin-chip">
          <Link to="/admin/login">Admin panel</Link>
        </div>
        <div className="brand-row">
          <img src={logoImage} alt="MediBot Logo" style={{ width: 40, height: 'auto' }} />
          <span className="brand-name">MediBot</span>
        </div>
        <div className="intro">
          <h2>{heading || (isLogin ? 'Welcome back' : 'Join MediBot')}</h2>
          <p className="sub-text">{subheading || 'Please enter your details to continue.'}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />
      <Route
        path="/login"
        element={
          <AuthLayout heading="Welcome back" subheading="Please enter your details to access your account.">
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout heading="Create Account" subheading="Sign up with your work email to access MediBot.">
            <SignupPage />
          </AuthLayout>
        }
      />
      <Route
        path="/forgot"
        element={
          <AuthLayout heading="Forgot Password" subheading="Enter your account email to receive reset instructions.">
            <ForgotPasswordPage />
          </AuthLayout>
        }
      />
      <Route path="/welcome" element={<LandingPage />} />
      <Route
        path="/reset"
        element={
          <AuthLayout heading="Set a new password" subheading="Enter a strong password for your MediBot account.">
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route path="/lab-admin-dashboard" element={<LabAdminDashboard />} />
      <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />

      {/* Admin Auth Routes */}
      <Route
        path="/admin/login"
        element={
          <AdminAuthLayout heading="Admin Access">
            <AdminLoginPage />
          </AdminAuthLayout>
        }
      />
      <Route
        path="/admin/signup"
        element={
          <AdminAuthLayout heading="Request Access">
            <AdminSignupPage />
          </AdminAuthLayout>
        }
      />
      <Route
        path="/admin/forgot"
        element={
          <AdminAuthLayout heading="Reset Password">
            <AdminForgotPasswordPage />
          </AdminAuthLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
