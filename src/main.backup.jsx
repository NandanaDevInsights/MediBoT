import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'

// Minimal test component
function TestPage() {
    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h1 style={{ color: '#4F46E5' }}>✅ React & Router Working!</h1>
            <div style={{
                background: '#f0f0f0',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '20px'
            }}>
                <h2>Navigation Test</h2>
                <nav style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <Link to="/" style={{
                        padding: '10px 20px',
                        background: '#4F46E5',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}>Home</Link>
                    <Link to="/login" style={{
                        padding: '10px 20px',
                        background: '#10B981',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}>Login</Link>
                </nav>
            </div>
            <div style={{
                marginTop: '30px',
                padding: '20px',
                background: '#FEF3C7',
                borderRadius: '8px'
            }}>
                <h3>⚠️ Temporary Diagnostic Mode</h3>
                <p>This is a minimal test version. If you see this, React is working!</p>
                <p>The issue is likely in one of the complex components (LabAdminDashboard, LandingPage, etc.)</p>
                <button
                    onClick={() => {
                        console.log('✅ Event handlers working');
                        alert('JavaScript events are functional!');
                    }}
                    style={{
                        padding: '10px 20px',
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Test Click Event
                </button>
            </div>
        </div>
    )
}

// Minimal App
function MinimalApp() {
    return (
        <Routes>
            <Route path="/*" element={<TestPage />} />
        </Routes>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <MinimalApp />
        </BrowserRouter>
    </StrictMode>,
)
