// src/components/Products/ProductList.js
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import './ProductList.css'

const ProductList = ({ products, onUpdate, onDelete }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [filterType, setFilterType] = useState('TODOS');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditForm(product);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(editingId, editForm);
        if (success) {
            setEditingId(null);
            setSuccessMessage('Producto actualizado exitosamente');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        const success = await onDelete(deleteConfirmation.id);
        if (success) {
            setDeleteConfirmation({ isOpen: false, id: null });
            setSuccessMessage('Producto eliminado exitosamente');
        }
    };

    const filteredProducts = filterType === 'TODOS'
        ? products
        : products.filter(product => product.tipo === filterType);

    return (
        <div className="product-list">
            {/*<h2>Lista de Productos</h2>*/}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div>
                <label htmlFor="filterType">Filtrar por tipo: </label>
                <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="TODOS">Todos</option>
                    <option value="SAHUMERIO">Sahumerio</option>
                    <option value="TE">Té</option>
                    <option value="JUGUETE">Juguete</option>
                    <option value="VARIOS">Varios</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            {editingId === product.id ? (
                                <>
                                    <td>
                                        <input
                                            name="nombre"
                                            value={editForm.nombre}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="stock"
                                            value={editForm.stock}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="tipo"
                                            value={editForm.tipo}
                                            onChange={handleChange}
                                        >
                                            <option value="SAHUMERIO">Sahumerio</option>
                                            <option value="TE">Té</option>
                                            <option value="JUGUETE">Juguete</option>
                                            <option value="VARIOS">Varios</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={handleSubmit}>Guardar</button>
                                        <button onClick={() => setEditingId(null)}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{product.nombre}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.tipo}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product)}>Editar</button>
                                        <button onClick={() => handleDeleteClick(product.id)}>Eliminar</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={handleDeleteConfirm}
                message="¿Está seguro de que desea eliminar este producto?"
            />
        </div>
    );
};

export default ProductList;