// src/components/Purchases/PurchaseForm.js
import React, { useState, useEffect } from 'react';
import { fetchProductos } from '../../api/api';
import './PurchaseForm.css';

const CompraForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        fechaDeCompra: '',
        cantidadComprada: '',
        precioDeCompra: '',
        tipoCambio: '',
        producto: { id: '' }
    });
    const [productos, setProductos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProductosList();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchProductosList = async () => {
        try {
            const data = await fetchProductos();
            setProductos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'productoId') {
            setFormData(prev => ({ ...prev, producto: { id: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({
                fechaDeCompra: '',
                cantidadComprada: '',
                precioDeCompra: '',
                tipoCambio: '',
                producto: { id: '' }
            });
            setSuccessMessage(initialData ? 'Compra actualizada exitosamente' : 'Compra creada exitosamente');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="compra-form">
            {successMessage && <div className="success-message">{successMessage}</div>}
            <input
                type="date"
                name="fechaDeCompra"
                value={formData.fechaDeCompra}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="cantidadComprada"
                value={formData.cantidadComprada}
                onChange={handleChange}
                placeholder="Cantidad"
                required
            />
            <input
                type="number"
                name="precioDeCompra"
                value={formData.precioDeCompra}
                onChange={handleChange}
                placeholder="Precio Unitario"
                required
            />
            <input
                type="number"
                name="tipoCambio"
                value={formData.tipoCambio}
                onChange={handleChange}
                placeholder="Tipo de cambio"
                step="0.01"
                required
            />
            <select
                name="productoId"
                value={formData.producto.id}
                onChange={handleChange}
                required
            >
                <option value="">Seleccione un producto</option>
                {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                    </option>
                ))}
            </select>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cargando...' : (initialData ? 'Actualizar' : 'Crear')}
            </button>
        </form>
    );
};

export default CompraForm;
