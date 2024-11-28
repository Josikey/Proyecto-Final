const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3037;

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '123456', // Cambia esto por tu contraseña de MySQL
    database: 'usuarios_db'
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL.');
});

// Servir archivos estáticos desde el directorio 
app.use(express.static(__dirname));

// Rutas para las páginas HTML
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/agregar', (req, res) => {
    res.sendFile('agregar.html', { root: __dirname });
});

app.get('/editar', (req, res) => {
    res.sendFile('editar.html', { root: __dirname });
});

app.get('/eliminar', (req, res) => {
    res.sendFile('eliminar.html', { root: __dirname });
});

// Rutas para la API de usuarios
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta para agregar un usuario (POST)
app.post('/api/agregar', (req, res) => {
    const { nombre, correo, fecha } = req.body;

    const query = 'INSERT INTO usuarios (nombre, correo, fecha) VALUES (?, ?, ?)';
    db.query(query, [nombre, correo, fecha], (err, results) => {
        if (err) {
            console.error('Error al agregar usuario:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.send('Usuario agregado exitosamente');
        }
    });
});

// Ruta para editar un usuario (PUT)
app.put('/api/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, fecha } = req.body;

    const query = 'UPDATE usuarios SET nombre = ?, correo = ?, fecha = ? WHERE id = ?';
    db.query(query, [nombre, correo, fecha, id], (err, results) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.send('Usuario actualizado exitosamente');
        }
    });
});

// Ruta para eliminar un usuario (DELETE)
app.delete('/api/eliminar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.send('Usuario eliminado exitosamente');
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
