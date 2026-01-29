import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Minimal test to verify React is working
function TestApp() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: '#4F46E5' }}>✅ React is Working!</h1>
            <p>If you see this, the issue is in App.jsx or routing</p>
            <button
                onClick={() => window.location.href = '/index.html'}
                style={{
                    padding: '10px 20px',
                    background: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Restore Normal App
            </button>
        </div>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <TestApp />
    </StrictMode>,
)
