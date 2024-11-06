// src/components/Sales/SaleList.js
import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../ConfirmationModal';

const VentaList = ({ ventas, onUpdate, onDelete }) => {
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

    const handleEdit = (venta) => {
        setEditingId(venta.id);
        setEditForm({
            fechaDeVenta: venta.fechaDeVenta,
            cantidadVendida: venta.cantidadVendida,
            precioDeVenta: venta.precioDeVenta,
            tipoCambio: venta.tipoCambio,
            producto: { id: venta.producto.id }
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
            setSuccessMessage('Venta actualizada exitosamente');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        const success = await onDelete(deleteConfirmation.id);
        if (success) {
            setDeleteConfirmation({ isOpen: false, id: null });
            setSuccessMessage('Venta eliminada exitosamente');
        }
    };

    if (!Array.isArray(ventas) || ventas.length === 0) {
        return <div>No hay ventas disponibles.</div>;
    }

    return (
        <div className="venta-list">
            {/*<h2>Lista de Ventas</h2>*/}
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
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            {editingId === venta.id ? (
                                <>
                                    <td>
                                        <input
                                            type="date"
                                            name="fechaDeVenta"
                                            value={editForm.fechaDeVenta}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>{venta.producto.nombre}</td>
                                    <td>
                                        <input
                                            type="number"
                                            name="cantidadVendida"
                                            value={editForm.cantidadVendida}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="precioDeVenta"
                                            value={editForm.precioDeVenta}
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
                                    <td>{new Date(venta.fechaDeVenta).toLocaleDateString()}</td>
                                    <td>{venta.producto.nombre}</td>
                                    <td>{venta.cantidadVendida}</td>
                                    <td>{venta.precioDeVenta}</td>
                                    <td>{venta.tipoCambio}</td>
                                    <td>
                                        <button onClick={() => handleEdit(venta)}>Editar</button>
                                        <button onClick={() => handleDeleteClick(venta.id)}>Eliminar</button>
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
                message="¿Está seguro de que desea eliminar esta venta?"
            />
        </div>
    );
};

export default VentaList;