// src/api/api.js
import API_BASE_URL from '../config';

// Funciones genéricas
const handleResponse = async (response) => {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

// Function to fetch all products:
export const fetchAllProducts = () => fetch(`${API_BASE_URL}/tsr/producto`).then(handleResponse);

// Funciones para Productos
export const fetchProductos = async () => {
    const response = await fetch(`${API_BASE_URL}/tsr/producto`);
    return handleResponse(response);
};
export const fetchProducto = (nombre) => fetch(`${API_BASE_URL}/tsr/producto/${nombre}`).then(handleResponse);
export const createProducto = async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/tsr/producto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
    });
    return handleResponse(response);
};

export const updateProducto = async (id, productoData) => {
    const response = await fetch(`${API_BASE_URL}/tsr/producto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
    });
    return handleResponse(response);
};

export const deleteProducto = async (id) => {
    const response = await fetch(`${API_BASE_URL}/tsr/producto/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};

// Funciones para Compras
export const fetchCompras = () => fetch(`${API_BASE_URL}/tsr/compra`).then(handleResponse);
export const fetchComprasPorPeriodo = (fechaInicio, fechaFin) =>
    fetch(`${API_BASE_URL}/tsr/compra/periodo/${fechaInicio}/${fechaFin}`).then(handleResponse);
export const createCompra = async (compra) => {
    console.log("Enviando compra al servidor:", compra);
    const response = await fetch(`${API_BASE_URL}/tsr/compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra),
    });
    return handleResponse(response);
};

export const updateCompra = async (id, compra) => {
    console.log("Enviando compra actualizada al servidor:", compra);
    const response = await fetch(`${API_BASE_URL}/tsr/compra/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra),
    });
    return handleResponse(response);
};

export const deleteCompra = (id) => fetch(`${API_BASE_URL}/tsr/compra/${id}`, { method: 'DELETE' }).then(handleResponse);

// Funciones para Ventas
export const fetchVentas = () => fetch(`${API_BASE_URL}/tsr/venta`).then(handleResponse);
export const fetchVentasPorPeriodo = (fechaInicio, fechaFin) =>
    fetch(`${API_BASE_URL}/tsr/venta/periodo/${fechaInicio}/${fechaFin}`).then(handleResponse);
export const createVenta = (venta) => fetch(`${API_BASE_URL}/tsr/venta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta)
}).then(handleResponse);
export const updateVenta = (id, venta) => fetch(`${API_BASE_URL}/tsr/venta/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta)
}).then(handleResponse);
export const deleteVenta = (id) => fetch(`${API_BASE_URL}/tsr/venta/${id}`, { method: 'DELETE' }).then(handleResponse);

// Funciones para Reportes
export const fetchTotalProfitability = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-total`).then(handleResponse);
export const fetchTotalProfitabilityUSD = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-total-usd`).then(handleResponse);
export const fetchCPVProfitability = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-cpv`).then(handleResponse);
export const fetchCPVProfitabilityUSD = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-cpv-usd`).then(handleResponse);
export const fetchProfitabilityByType = (type) => fetch(`${API_BASE_URL}/reportes/rentabilidad/${type}`).then(handleResponse);
export const fetchProfitabilityByTypeUSD = (type) => fetch(`${API_BASE_URL}/reportes/rentabilidad-usd/${type}`).then(handleResponse);
export const fetchProfitabilityByTypeAndPeriod = (type, startDate, endDate) =>
    fetch(`${API_BASE_URL}/reportes/rentabilidad/${type}/${startDate}/${endDate}`).then(handleResponse);
export const fetchProfitabilityByTypeAndPeriodUSD = (type, startDate, endDate) =>
    fetch(`${API_BASE_URL}/reportes/rentabilidad-usd/${type}/${startDate}/${endDate}`).then(handleResponse);
export const fetchCombinedTotalProfitability = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-total-combinado`).then(handleResponse);
export const fetchCombinedCPVProfitability = () => fetch(`${API_BASE_URL}/reportes/rentabilidad-cpv-combinado`).then(handleResponse);
export const fetchCombinedProfitabilityByType = (type) => fetch(`${API_BASE_URL}/reportes/rentabilidad-combinado/${type}`).then(handleResponse);
export const fetchCombinedProfitabilityByTypeAndPeriod = (type, startDate, endDate) =>
    fetch(`${API_BASE_URL}/reportes/rentabilidad-combinado/${type}/${startDate}/${endDate}`).then(handleResponse);
export const fetchTotalReport = () => fetch(`${API_BASE_URL}/reportes/informe-total`).then(handleResponse);