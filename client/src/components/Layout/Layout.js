// src/components/Layout/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <nav>
                    <ul>
                        <li><Link href="/user-preferences" className="nav-logo">
                            TSR
                        </Link></li>
                        <li><Link to="/">Productos</Link></li>
                        <li><Link to="/purchases">Compras</Link></li>
                        <li><Link to="/sales">Ventas</Link></li>
                        <li><Link to="/reports">Reportes</Link></li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; 2024 Tres Simples Razones. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Layout;