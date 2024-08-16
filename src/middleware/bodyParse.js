import express from 'express';

const bodyParserMiddleware = (app) => {
  app.use(express.urlencoded({ extended: true })); // Analiza cuerpos de solicitudes codificadas en URL
  app.use(express.json()); // Analiza cuerpos de solicitudes en formato JSON
};

export default bodyParserMiddleware;
