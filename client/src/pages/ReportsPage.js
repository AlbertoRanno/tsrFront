import React, { useState, useEffect } from 'react';
import {
    fetchTotalReport,
    fetchCombinedTotalProfitability,
    fetchCombinedCPVProfitability,
    fetchCombinedProfitabilityByType,
    fetchCombinedProfitabilityByTypeAndPeriod
} from '../api/api';

const ReportsPage = () => {
    const [totalReport, setTotalReport] = useState(null);
    const [combinedTotalProfitability, setCombinedTotalProfitability] = useState(null);
    const [combinedCPVProfitability, setCombinedCPVProfitability] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [profitabilityByType, setProfitabilityByType] = useState(null);
    const [profitabilityByTypeAndPeriod, setProfitabilityByTypeAndPeriod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const [totalReportData, combinedTotalProfitabilityData, combinedCPVProfitabilityData] = await Promise.all([
                fetchTotalReport(),
                fetchCombinedTotalProfitability(),
                fetchCombinedCPVProfitability()
            ]);
            setTotalReport(totalReportData);
            setCombinedTotalProfitability(combinedTotalProfitabilityData);
            setCombinedCPVProfitability(combinedCPVProfitabilityData);
        } catch (err) {
            setError('Error al cargar los reportes');
        }
        setLoading(false);
    };

    const handleTypeChange = async (e) => {
        const type = e.target.value;
        setSelectedType(type);
        if (type) {
            try {
                const data = await fetchCombinedProfitabilityByType(type);
                setProfitabilityByType(data);
            } catch (err) {
                setError('Error al cargar la rentabilidad por tipo');
            }
        }
    };

    const handleDateSubmit = async (e) => {
        e.preventDefault();
        if (selectedType && startDate && endDate) {
            try {
                const data = await fetchCombinedProfitabilityByTypeAndPeriod(selectedType, startDate, endDate);
                setProfitabilityByTypeAndPeriod(data);
            } catch (err) {
                setError('Error al cargar la rentabilidad por tipo y período');
            }
        }
    };

    if (loading) return <div>Cargando reportes...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Reportes de Rentabilidad</h1>
            {/* Mostraría el endpoint acotado que hice de prueba 
            <h2>Informe Total</h2>
            {totalReport && (
                <ul>
                    {Object.entries(totalReport).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
            )}
            */}
            <h2>Ganancia descontando el costo de los productos no vendidos</h2>
            {combinedTotalProfitability && (
                <ul>
                    <li>En Pesos: {combinedTotalProfitability.rentabilidadPesos}</li>
                    <li>En Dólares: {combinedTotalProfitability.rentabilidadDolares}</li>
                </ul>
            )}

            <h2>Ganancia de los productos vendidos</h2>
            {combinedCPVProfitability && (
                <ul>
                    <li>En Pesos: {combinedCPVProfitability.rentabilidadCPVPesos}</li>
                    <li>En Dólares: {combinedCPVProfitability.rentabilidadCPVDolares}</li>
                </ul>
            )}

            <h2>Por Tipo de Producto</h2>
            <select value={selectedType} onChange={handleTypeChange}>
                <option value="">Seleccione un tipo</option>
                <option value="SAHUMERIO">Sahumerio</option>
                <option value="TE">Té</option>
                <option value="JUGUETE">Juguete</option>
            </select>
            {profitabilityByType && (
                <ul>
                    <li>En Pesos: {profitabilityByType.rentabilidadPorTipoPesos}</li>
                    <li>En Dólares: {profitabilityByType.rentabilidadPorTipoDolares}</li>
                </ul>
            )}

            <h2>Por Tipo de Producto y Período</h2>
            <form onSubmit={handleDateSubmit}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
                <button type="submit">Buscar</button>
            </form>
            {profitabilityByTypeAndPeriod && (
                <ul>
                    <li>En Pesos: {profitabilityByTypeAndPeriod.rentabilidadPorTipoPeriodoPesos}</li>
                    <li>En Dólares: {profitabilityByTypeAndPeriod.rentabilidadPorTipoPeriodoDolares}</li>
                </ul>
            )}
        </div>
    );
};

export default ReportsPage;