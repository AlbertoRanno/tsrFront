const express = require('express');
const path = require('path');
const app = express();

// Sirve los archivos estáticos desde la carpeta build de React
app.use(express.static(path.join(__dirname, '../client/build')));

// Maneja cualquier solicitud que no coincida con los archivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});