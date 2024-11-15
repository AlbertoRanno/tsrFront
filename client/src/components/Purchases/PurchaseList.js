// src/components/Purchases/PurchaseList.js
import React, { useState, useEffect, useMemo } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import './PurchaseList.css';

const CompraList = ({ compras, onUpdate, onDelete }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'fechaDeCompra', direction: 'descending' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleEdit = (compra) => {
        setEditingId(compra.id);
        setEditForm({
            fechaDeCompra: compra.fechaDeCompra,
            cantidadComprada: compra.cantidadComprada,
            precioDeCompra: compra.precioDeCompra,
            tipoCambio: compra.tipoCambio,
            producto: { id: compra.producto.id }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'productoId') {
            setEditForm(prev => ({ ...prev, producto: { id: value } }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(editingId, editForm);
        if (success) {
            setEditingId(null);
            setSuccessMessage('Compra actualizada exitosamente');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        const success = await onDelete(deleteConfirmation.id);
        if (success) {
            setDeleteConfirmation({ isOpen: false, id: null });
            setSuccessMessage('Compra eliminada exitosamente');
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredCompras = useMemo(() => {
        let filteredItems = compras.filter(compra =>
            compra.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredItems.sort((a, b) => {
            if (sortConfig.key === 'fechaDeCompra') {
                const dateA = new Date(a.fechaDeCompra);
                const dateB = new Date(b.fechaDeCompra);
                return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
            }
            if (sortConfig.key === 'producto') {
                const compareResult = a.producto.nombre.localeCompare(b.producto.nombre);
                return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
            }
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [compras, sortConfig, searchTerm]);

    if (!Array.isArray(compras) || compras.length === 0) {
        return <div>No hay compras disponibles.</div>;
    }

    return (
        <div className="compra-list">
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('fechaDeCompra')}>
                                Fecha {sortConfig.key === 'fechaDeCompra' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => requestSort('producto')}>
                                Producto {sortConfig.key === 'producto' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Tipo de Cambio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredCompras.map((compra) => (
                            <tr key={compra.id}>
                                {editingId === compra.id ? (
                                    <>
                                        <td>
                                            <input
                                                type="date"
                                                name="fechaDeCompra"
                                                value={editForm.fechaDeCompra}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>{compra.producto.nombre}</td>
                                        <td>
                                            <input
                                                type="number"
                                                name="cantidadComprada"
                                                value={editForm.cantidadComprada}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="precioDeCompra"
                                                value={editForm.precioDeCompra}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="tipoCambio"
                                                value={editForm.tipoCambio}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={handleSubmit}>Guardar</button>
                                            <button onClick={() => setEditingId(null)}>Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{new Date(compra.fechaDeCompra + 'T00:00:00').toLocaleDateString()}</td>
                                        <td>{compra.producto.nombre}</td>
                                        <td>{compra.cantidadComprada}</td>
                                        <td>{compra.precioDeCompra}</td>
                                        <td>{compra.tipoCambio}</td>
                                        <td>
                                            <button onClick={() => handleEdit(compra)}>Editar</button>
                                            <button onClick={() => handleDeleteClick(compra.id)}>Eliminar</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={handleDeleteConfirm}
                message="¿Está seguro de que desea eliminar esta compra?"
            />
        </div>
    );
};

export default CompraList;