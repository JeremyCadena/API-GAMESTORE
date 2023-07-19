const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configura la conexión a la base de datos
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@1234567',
    database: 'gamestore',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('@1234567')
    }
});

// Conecta a la base de datos
conn.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Obtener todos los videojuegos
app.get('/videojuegos', (req, res) => {
    const query = 'SELECT * FROM VIDEOJUEGO';
    conn.query(query, (err, result) => {
    if (err) throw err;
        res.json(result);
    });
});

// Obtener un videojuego por su ID
app.get('/videojuegos/:videojuego_id', (req, res) => {
    const videojuegoId = req.params.videojuego_id;
    const query = `SELECT * FROM VIDEOJUEGO WHERE IDVI = '${videojuegoId}'`;
    conn.query(query, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        res.status(404).json({ error: 'No se encontró el videojuego' });
    } else {
        res.json(result[0]);
        }
    });
});

// Obtener videojuegos por nombre de plataforma
app.get('/videojuegos/plataforma/:plataforma_nombre', (req, res) => {
    const plataformaNombre = req.params.plataforma_nombre;
    const query = `SELECT V.* FROM VIDEOJUEGO V JOIN PERTENECE P ON V.IDVI = P.IDVI JOIN PLATAFORMA PLA ON P.IDPLA = PLA.IDPLA WHERE PLA.NOMBREPLA = '${plataformaNombre}'`;
    conn.query(query, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        res.status(404).json({ error: 'No se encontraron videojuegos para la plataforma especificada' });
    } else {
        res.json(result);
        }
    });
});

// Crear un nuevo videojuego
app.post('/videojuegos', (req, res) => {
    const videojuego = req.body;
    const query = 'INSERT INTO VIDEOJUEGO (IDVI, NOMBREVI, PRECIOVI, IMAGENVI, DESCRIPCIONVI, STOCKVI) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [videojuego.IDVI, videojuego.NOMBREVI, videojuego.PRECIOVI, videojuego.IMAGENVI, videojuego.DESCRIPCIONVI, videojuego.STOCKVI];
    conn.query(query, values, (err) => {
    if (err) throw err;
        res.json({ message: 'Videojuego creado correctamente' });
    });
});

// Actualizar un videojuego existente
// app.put('/videojuegos/:videojuego_id', (req, res) => {
//    const videojuegoId = req.params.videojuego_id;
//    const videojuego = req.body;
//    const query = 'UPDATE VIDEOJUEGO SET NOMBREVI = ?, PRECIOVI = ?, IMAGENVI = ?, DESCRIPCIONVI = ?, STOCKVI = ? WHERE IDVI = ?';
//    const values = [videojuego.NOMBREVI, videojuego.PRECIOVI, videojuego.IMAGENVI, videojuego.DESCRIPCIONVI, videojuego.STOCKVI, videojuegoId];
//    conn.query(query, values, (err) => {
//    if (err) throw err;
//        res.json({ message: 'Videojuego actualizado correctamente' });
//    });
//});

// Eliminar un videojuego
//app.delete('/videojuegos/:videojuego_id', (req, res) => {
//    const videojuegoId = req.params.videojuego_id;
//    const query = `DELETE FROM VIDEOJUEGO WHERE IDVI = '${videojuegoId}'`;
//    conn.query(query, (err) => {
//    if (err) throw err;
//        res.json({ message: 'Videojuego eliminado correctamente' });
//    });
//});

app.listen(port, () => {
    console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});