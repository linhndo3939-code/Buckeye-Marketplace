import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');

    // If there is no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If there is a token, render the protected component (children)
    return children;
};

export default ProtectedRoute;