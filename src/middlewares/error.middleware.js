// este middleware va al final de las rutas
export default errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
  
  app.use(errorHandler);