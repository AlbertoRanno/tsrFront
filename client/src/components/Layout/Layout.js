// src/components/Layout/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    return (
        <div className="layout">
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/user-preferences" className="nav-logo">
                                TSR
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className={isActive('/')}>
                                Productos
                            </Link>
                        </li>
                        <li>
                            <Link to="/purchases" className={isActive('/purchases')}>
                                Compras
                            </Link>
                        </li>
                        <li>
                            <Link to="/sales" className={isActive('/sales')}>
                                Ventas
                            </Link>
                        </li>
                        <li>
                            <Link to="/reports" className={isActive('/reports')}>
                                Reportes
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; 2024 Tres Simples Razones. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;