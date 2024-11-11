// src/pages/VentasPage.js
import React, { useState, useEffect } from 'react';
import { fetchVentas, createVenta, updateVenta, deleteVenta } from '../api/api';
import VentaForm from '../components/Sales/SaleForm';
import VentaList from '../components/Sales/SaleList';

const VentasPage = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVentasList();
    }, []);

    const fetchVentasList = async () => {
        try {
            setLoading(true);
            const data = await fetchVentas();
            setVentas(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar las ventas:', err);
            setError('Error al cargar las ventas. Por favor, intente de nuevo más tarde.');
            setVentas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVenta = async (ventaData) => {
        try {
            const newVenta = await createVenta(ventaData);
            if (typeof newVenta === 'object' && newVenta.id) {
                setVentas(prevVentas => [...prevVentas, newVenta]);
            } else {
                await fetchVentasList();
            }
            return true;
        } catch (err) {
            console.error('Error al crear la venta:', err);
            setError('Error al crear la venta. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleUpdateVenta = async (id, ventaData) => {
        try {
            const result = await updateVenta(id, ventaData);
            if (result === "Venta modificada") {
                setVentas(prevVentas => prevVentas.map(venta => 
                    venta.id === id ? { ...venta, ...ventaData } : venta
                ));
            } else if (typeof result === 'object' && result.id) {
                setVentas(prevVentas => prevVentas.map(venta => 
                    venta.id === id ? result : venta
                ));
            } else {
                await fetchVentasList();
            }
            return true;
        } catch (err) {
            console.error('Error al actualizar la venta:', err);
            setError('Error al actualizar la venta. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleDeleteVenta = async (id) => {
        try {
            const result = await deleteVenta(id);
            if (result === "Venta eliminada") {
                setVentas(prevVentas => prevVentas.filter(venta => venta.id !== id));
            } else {
                await fetchVentasList();
            }
            return true;
        } catch (err) {
            console.error('Error al eliminar la venta:', err);
            setError('Error al eliminar la venta. Por favor, intente de nuevo.');
            return false;
        }
    };

    return (
        <div className="page-container">
            <div className="content-container">
                <div className="form-column">
                    <VentaForm onSubmit={handleCreateVenta} />
                </div>
                <div className="list-column">
                    {error && <div className="error-message">{error}</div>}
                    {loading ? (
                        <div>Cargando ventas...</div>
                    ) : (
                        <VentaList
                            ventas={ventas}
                            onUpdate={handleUpdateVenta}
                            onDelete={handleDeleteVenta}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VentasPage;