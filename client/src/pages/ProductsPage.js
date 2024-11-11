import React, { useState, useEffect } from 'react';
import { fetchProductos, createProducto, updateProducto, deleteProducto } from '../api/api';
import ProductForm from '../components/Products/ProductForm';
import ProductList from '../components/Products/ProductList';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await fetchProductos();
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los productos:', err);
            setError('Error al cargar los productos. Por favor, intente de nuevo más tarde.');
            setLoading(false);
        }
    };

    const handleCreateProduct = async (productData) => {
        try {
            const existingProduct = products.find(p => p.nombre.toLowerCase() === productData.nombre.toLowerCase());
            if (existingProduct) {
                setError('Ya existe un producto con este nombre. Por favor, elija un nombre diferente.');
                return false;
            }
            const newProduct = await createProducto(productData);
            if (typeof newProduct === 'object' && newProduct.id) {
                setProducts(prevProducts => [...prevProducts, newProduct]);
            } else {
                await fetchProducts();
            }
            setError(null);
            return true;
        } catch (err) {
            console.error('Error al crear el producto:', err);
            setError('Error al crear el producto. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        try {
            const existingProduct = products.find(p => p.id !== id && p.nombre.toLowerCase() === productData.nombre.toLowerCase());
            if (existingProduct) {
                setError('Ya existe otro producto con este nombre. Por favor, elija un nombre diferente.');
                return false;
            }
            const result = await updateProducto(id, productData);
            if (result === "Producto modificado") {
                setProducts(prevProducts => prevProducts.map(product =>
                    product.id === id ? { ...product, ...productData } : product
                ));
            } else if (typeof result === 'object' && result.id) {
                setProducts(prevProducts => prevProducts.map(product =>
                    product.id === id ? result : product
                ));
            } else {
                await fetchProducts();
            }
            setError(null);
            return true;
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            setError('Error al actualizar el producto. Por favor, intente de nuevo.');
            return false;
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const result = await deleteProducto(id);
            if (result === "Producto eliminado") {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
            } else {
                await fetchProducts();
            }
            setError(null);
            return true;
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            setError('Error al eliminar el producto. Por favor, intente de nuevo.');
            return false;
        }
    };

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="page-container">
            <div className="content-container">
                <div className="form-column">
                    <ProductForm onSubmit={handleCreateProduct} />
                </div>
                <div className="list-column">
                    {error && <div className="error-message">{error}</div>}
                    <ProductList
                        products={products}
                        onUpdate={handleUpdateProduct}
                        onDelete={handleDeleteProduct}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;