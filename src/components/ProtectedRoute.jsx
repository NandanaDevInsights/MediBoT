import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = sessionStorage.getItem('auth_role');
    const location = useLocation();

    if (!role) {
        // Determine where to redirect based on the requested path or allowed roles
        if (allowedRoles.includes('LAB_ADMIN') || allowedRoles.includes('SUPER_ADMIN')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // If logged in but wrong role, redirect to appropriate home
        if (role === 'USER') {
            return <Navigate to="/" replace />;
        } else if (role === 'LAB_ADMIN') {
            return <Navigate to="/lab-admin-dashboard" replace />;
        } else if (role === 'SUPER_ADMIN') {
            return <Navigate to="/super-admin-dashboard" replace />;
        }
        // Fallback
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
