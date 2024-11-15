import React, { useState, useEffect, useMemo } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import './SaleList.css';

const VentaList = ({ ventas, onUpdate, onDelete }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'fechaDeVenta', direction: 'descending' });
    const [searchTerm, setSearchTerm] = useState('');

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
            infoAdicional: venta.infoAdicional,
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredVentas = useMemo(() => {
        let filteredItems = ventas.filter(venta =>
            venta.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredItems.sort((a, b) => {
            if (sortConfig.key === 'fechaDeVenta') {
                const dateA = new Date(a.fechaDeVenta);
                const dateB = new Date(b.fechaDeVenta);
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
    }, [ventas, sortConfig, searchTerm]);

    if (!Array.isArray(ventas) || ventas.length === 0) {
        return <div>No hay ventas disponibles.</div>;
    }

    return (
        <div className="venta-list">
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('fechaDeVenta')}>
                                Fecha {sortConfig.key === 'fechaDeVenta' &&
                                    (sortConfig.direction === 'ascending' ? '▲' : '▼')}
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
                            <th>Info Adicional</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredVentas.map((venta) => (
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
                                            <textarea
                                                name="infoAdicional"
                                                value={editForm.infoAdicional}
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
                                        <td>{new Date(venta.fechaDeVenta + 'T00:00:00').toLocaleDateString()}</td>
                                        <td>{venta.producto.nombre}</td>
                                        <td>{venta.cantidadVendida}</td>
                                        <td>{venta.precioDeVenta}</td>
                                        <td>{venta.tipoCambio}</td>
                                        <td>{venta.infoAdicional}</td>
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
            </div>
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