// src/components/Purchases/PurchaseForm.js y src/components/Sales/SaleForm.js

import React, { useState, useEffect } from 'react';
import { fetchProductos } from '../../api/api';
import './SaleForm.css';

const Form = ({ onSubmit, initialData, formType }) => {
    const [formData, setFormData] = useState(initialData || {
        fechaDeVenta: '',
        cantidadVendida: '',
        precioDeVenta: '',
        tipoCambio: '',
        infoAdicional: '',
        producto: { id: '' }
    });
    const [productos, setProductos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [exchangeRate, setExchangeRate] = useState(null);

    useEffect(() => {
        fetchProductosList();
        fetchExchangeRate();
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

    const fetchExchangeRate = async () => {
        try {
            const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
            const data = await response.json();
            setExchangeRate(data.blue.value_sell);
        } catch (error) {
            console.error('Error al obtener el tipo de cambio:', error);
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
                fechaDeVenta: '',
                cantidadVendida: '',
                precioDeVenta: '',
                tipoCambio: '',
                infoAdicional: '',
                producto: { id: '' }
            });
            setSuccessMessage(initialData ? `${formType} actualizada exitosamente` : `${formType} creada exitosamente`);
        } catch (error) {
            console.error(`Error al enviar el formulario de ${formType}:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${formType}-form`}>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <input
                type="date"
                name={`fechaDe${formType}`}
                value={formData[`fechaDe${formType}`]}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name={`cantidad${formType === 'Compra' ? 'Comprada' : 'Vendida'}`}
                value={formData[`cantidad${formType === 'Compra' ? 'Comprada' : 'Vendida'}`]}
                onChange={handleChange}
                placeholder="Cantidad"
                required
            />
            <input
                type="number"
                name={`precioDe${formType}`}
                value={formData[`precioDe${formType}`]}
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
            {exchangeRate && (
                <span>Actual: ${exchangeRate}</span>
            )}
            <a href="https://www.ambito.com/contenidos/dolar-mep-historico.html" target="_blank" rel="noopener noreferrer">
                Ver histórico
            </a>
            <textarea
                name="infoAdicional"
                value={formData.infoAdicional}
                onChange={handleChange}
                placeholder="Información adicional (opcional)"
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

export default Form;