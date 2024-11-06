# TSR - Gestión de Productos, Compras y Ventas

## Descripción del Proyecto

Este proyecto es una aplicación web para la gestión de productos, compras y ventas de la empresa TSR. Permite a los usuarios administrar el inventario de productos, registrar compras y ventas, y visualizar información relevante sobre estas transacciones así como también analizar diferentes reportes sobre las ganancias registradas, tanto en la moneda local, como en relación al dolar.

## Estructura del Proyecto
tsr-project/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Products/
│       │   ├── Purchases/
│       │   └── Sales/
│       │   └── Reports/
│       ├── pages/
│       ├── api/
│       └── styles/
│
├── server/
│   └── server/
│
└── README.md


## Tecnologías Utilizadas

- Frontend: React.js
- Backend: Spring Boot
- Base de Datos: MySQL

## Características Principales

1. Gestión de Productos
   - Listado de productos
   - Creación de nuevos productos
   - Edición de productos existentes
   - Eliminación de productos

2. Gestión de Compras
   - Registro de nuevas compras
   - Visualización de historial de compras
   - Edición y eliminación de registros de compras

3. Gestión de Ventas
   - Registro de nuevas ventas
   - Visualización de historial de ventas
   - Edición y eliminación de registros de ventas

4. Reportes de Rentabilidad
   - Ganancia descontando el costo de los productos no vendidos
   - Ganancia de los productos vendidos
   - Por Tipo de Producto
   - Por Tipo de Producto y Período

## Estructura de Componentes

1. Productos
- ProductsPage: Página principal de gestión de productos
- ProductForm: Formulario para crear/editar productos
- ProductList: Lista de productos existentes

2. Compras
- ComprasPage: Página principal de gestión de compras
- CompraForm: Formulario para registrar/editar compras
- CompraList: Lista de compras realizadas

3. Ventas
- VentasPage: Página principal de gestión de ventas
- VentaForm: Formulario para registrar/editar ventas
- VentaList: Lista de ventas realizadas

4. Reportes
- ReportsPage: Página principal para la presentación de los reportes
