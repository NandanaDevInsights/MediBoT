import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = sessionStorage.getItem('auth_role');
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(!role);
    const [isVerified, setIsVerified] = React.useState(!!role);

    React.useEffect(() => {
        if (!role) {
            // Attempt to recover session from backend
            fetch(`${API_BASE}/profile`, { credentials: 'include' })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Not authenticated');
                })
                .then(data => {
                    // Recovered!
                    sessionStorage.setItem('auth_role', data.role);
                    setIsVerified(true);
                })
                .catch(() => {
                    setIsVerified(false);
                })
                .finally(() => setIsLoading(false));
        }
    }, [role]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner"></div> {/* Use simple text or spinner */}
                <span style={{ marginLeft: '10px', color: '#64748b' }}>Verifying session...</span>
            </div>
        );
    }

    // Role check after loading
    const currentRole = sessionStorage.getItem('auth_role');

    if (!currentRole) {
        // Not logged in
        if (allowedRoles.includes('LAB_ADMIN') || allowedRoles.includes('SUPER_ADMIN')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        // Wrong role
        if (currentRole === 'USER') return <Navigate to="/" replace />;
        if (currentRole === 'LAB_ADMIN') return <Navigate to="/lab-admin-dashboard" replace />;
        if (currentRole === 'SUPER_ADMIN') return <Navigate to="/super-admin-dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
