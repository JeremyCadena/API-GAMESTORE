// Reemplaza los paquetes y módulos de MySQL por Mongoose
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conectarse a MongoDB Atlas
const mongoUri = 'mongodb+srv://jjcadena2:Jejocad12@gamestore.mzmncxu.mongodb.net/gamestore';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a MongoDB Atlas establecida correctamente.');
    })
    .catch((err) => {
        console.error('Error al conectar a MongoDB Atlas:', err);
    });

// Definir el esquema y el modelo de Videojuego
const videojuegoSchema = new mongoose.Schema({
    IDVI: String,
    NOMBREVI: String,
    PRECIOVI: Number,
    IMAGENVI: String,
    DESCRIPCIONVI: String,
    STOCKVI: Number
});

const Videojuego = mongoose.model('Videojuego', videojuegoSchema);

// Obtener todos los videojuegos
app.get('/videojuegos', async (req, res) => {
  try {
    const videojuegos = await Videojuego.find();
    res.json(videojuegos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los videojuegos.' });
  }
});

// Obtener un videojuego por su ID
app.get('/videojuegos/:videojuego_id', async (req, res) => {
  const { videojuego_id } = req.params;
  try {
    const videojuego = await Videojuego.findById(videojuego_id);
    if (!videojuego) {
      return res.status(404).json({ message: 'No se encontró el videojuego.' });
    }
    res.json(videojuego);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el videojuego.' });
  }
});

// Obtener videojuegos por nombre de plataforma
app.get('/videojuegos/plataforma/:plataforma_nombre', async (req, res) => {
  const { plataforma_nombre } = req.params;
  try {
    const videojuegos = await Videojuego.find({ NOMBREPLA: plataforma_nombre });
    if (videojuegos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron videojuegos para la plataforma especificada' });
    }
    res.json(videojuegos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los videojuegos para la plataforma especificada.' });
  }
});

// Crear un nuevo videojuego
//app.post('/videojuegos', (req, res) => {
//    const videojuego = req.body;
//    const query = 'INSERT INTO VIDEOJUEGO (IDVI, NOMBREVI, PRECIOVI, IMAGENVI, DESCRIPCIONVI, STOCKVI) VALUES (?, ?, ?, ?, ?, ?)';
//    const values = [videojuego.IDVI, videojuego.NOMBREVI, videojuego.PRECIOVI, videojuego.IMAGENVI, videojuego.DESCRIPCIONVI, videojuego.STOCKVI];
//    conn.query(query, values, (err) => {
//    if (err) throw err;
//        res.json({ message: 'Videojuego creado correctamente' });
//    });
//});

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

// Configurar el puerto de escucha
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${PORT}`);
});
