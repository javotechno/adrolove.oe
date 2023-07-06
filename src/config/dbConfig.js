import mongoose from 'mongoose'
import config from './config.js';

// Usuario y clave del usuario adminw

const URI = config.mongoUrl;

// Conexion con el servidor de mongoose

mongoose.set("strictQuery", true);
mongoose.connect(URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Conectado a MongoDB");
  }
});