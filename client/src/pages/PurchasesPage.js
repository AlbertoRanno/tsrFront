// src/pages/ComprasPage.js
import React, { useState, useEffect } from 'react';
import { fetchCompras, createCompra, updateCompra, deleteCompra } from '../api/api';
import CompraForm from '../components/Purchases/PurchaseForm';
import CompraList from '../components/Purchases/PurchaseList';

const ComprasPage = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComprasList();
    }, []);

    const fetchComprasList = async () => {
        try {
            setLoading(true);
            const data = await fetchCompras();
            setCompras(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar las compras:', err);
            setError('Error al cargar las compras. Por favor, intente de nuevo más tarde.');
            setCompras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCompra = async (compraData) => {
        try {
            const newCompra = await createCompra(compraData);
            if (typeof newCompra === 'object' && newCompra.id) {
                setCompras(prevCompras => [...prevCompras, newCompra]);
            } else {
                await fetchComprasList();
            }
            return true;
        } catch (err) {
            console.error('Error al crear la compra:', err);
            setError('Error al crear la compra. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleUpdateCompra = async (id, compraData) => {
        try {
            const result = await updateCompra(id, compraData);
            if (result === "Compra modificada") {
                setCompras(prevCompras => prevCompras.map(compra => 
                    compra.id === id ? { ...compra, ...compraData } : compra
                ));
            } else if (typeof result === 'object' && result.id) {
                setCompras(prevCompras => prevCompras.map(compra => 
                    compra.id === id ? result : compra
                ));
            } else {
                await fetchComprasList();
            }
            return true;
        } catch (err) {
            console.error('Error al actualizar la compra:', err);
            setError('Error al actualizar la compra. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleDeleteCompra = async (id) => {
        try {
            const result = await deleteCompra(id);
            if (result === "Compra eliminada") {
                setCompras(prevCompras => prevCompras.filter(compra => compra.id !== id));
            } else {
                await fetchComprasList();
            }
            return true;
        } catch (err) {
            console.error('Error al eliminar la compra:', err);
            setError('Error al eliminar la compra. Por favor, intente de nuevo.');
            return false;
        }
    };

    if (loading) return <div>Cargando compras...</div>;

    return (
        <div>
            {/*<h1>Gestión de Compras</h1>*/}
            {error && <div className="error-message">{error}</div>}
            <CompraForm onSubmit={handleCreateCompra} />
            <CompraList
                compras={compras}
                onUpdate={handleUpdateCompra}
                onDelete={handleDeleteCompra}
            />
        </div>
    );
};

export default ComprasPage;