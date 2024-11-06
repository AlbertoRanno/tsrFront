// src/components/Purchases/PurchaseList.js
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../ConfirmationModal';

const CompraList = ({ compras, onUpdate, onDelete }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

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

    if (!Array.isArray(compras) || compras.length === 0) {
        return <div>No hay compras disponibles.</div>;
    }

    return (
        <div className="compra-list">
            {/*<h2>Lista de Compras</h2>*/}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Tipo de Cambio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.map((compra) => (
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
                                {/* Ajuste debido a un problema de conversión de zonas horarias, al aplicarle la conversión de formato, se mostraba bien el formato, pero el día anterior. */}
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