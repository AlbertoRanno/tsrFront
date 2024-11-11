import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import './ProductList.css'

const ProductList = ({ products, onUpdate, onDelete }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [filterType, setFilterType] = useState('TODOS');
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

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

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'TODOS' || product.tipo === filterType;
        let matchesStock = true;
        switch (stockFilter) {
            case 'zero':
                matchesStock = product.stock <= 0;
                break;
            case 'lessThan3':
                matchesStock = product.stock > 0 && product.stock <= 3;
                break;
            case 'lessThan7':
                matchesStock = product.stock > 3 && product.stock <= 7;
                break;
            case 'moreThan7':
                matchesStock = product.stock > 7;
                break;
            default:
                matchesStock = true;
        }
        return matchesSearch && matchesType && matchesStock;
    });

    return (
        <div className="product-list">
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre<input
                                type="text"
                                placeholder="Buscar producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            /></th>
                            <th>Stock <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                            >
                                <option value="all">Todos los stocks</option>
                                <option value="zero">Sin stock</option>
                                <option value="lessThan3">Stock entre 1 y 3</option>
                                <option value="lessThan7">Stock entre 4 y 7</option>
                                <option value="moreThan7">Stock mayor a 7</option>
                            </select></th>
                            <th>Tipo<select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="TODOS">Todos los tipos</option>
                                <option value="SAHUMERIO">Sahumerio</option>
                                <option value="TE">Té</option>
                                <option value="JUGUETE">Juguete</option>
                                <option value="VARIOS">Varios</option>
                            </select></th>
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
                                                type="number"
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
            </div>
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