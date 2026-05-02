import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#ba0c2f' }}>
            <div className="container">
                {/* Brand is already white, but let's make it ALL CAPS to match your screenshot */}
                <Link className="navbar-brand fw-bold text-white" to="/">
                    BUCKEYE MARKETPLACE
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {/* Added 'text-white' here */}
                            <Link className="nav-link text-white" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            {/* Change '/checkout' to '/cart' to match your App.jsx routes */}
                            <Link className="nav-link text-white" to="/cart">🛒 Checkout</Link>
                        </li>
                        <li className="nav-item">
                            {/* Added 'text-white' here */}
                            <Link className="nav-link text-white" to="/history">📜 Order History</Link>
                        </li>
                        {token ? (
                            <li className="nav-item">
                                <button className="btn btn-outline-light ms-lg-3" onClick={handleLogout}>Logout</button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                {/* Login often looks better as a text link or a specific button style */}
                                <Link className="nav-link text-white" to="/login">👤 Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;