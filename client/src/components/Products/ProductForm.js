// src/components/Products/ProductForm.js
import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        nombre: '',
        tipo: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({ nombre: '', tipo: '' });
            setSuccessMessage(initialData ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            {successMessage && <div className="success-message">{successMessage}</div>}
            <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
            />
            <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
            >
                <option value="">Seleccione un tipo</option>
                <option value="SAHUMERIO">Sahumerio</option>
                <option value="TE">Té</option>
                <option value="JUGUETE">Juguete</option>
            </select>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cargando...' : (initialData ? 'Actualizar' : 'Crear')}
            </button>
        </form>
    );
};

export default ProductForm;