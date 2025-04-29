require('express-async-errors');
const express = require('express');
const { routes } = require('./routes');
const { ZodError } = require('zod');
const { typeormServer } = require('../../infra/db/typeorm/setup');
const app = express();

// CONFIGS
app.use(express.json());

typeormServer
  .initialize()
  .then(() => {
    // ROUTES
    app.use(routes);

    app.use(function (err, req, res, next) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro na validação',
          errors: err.flatten(),
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        console.error(err);
      }

      return res.status(500).json({
        message: 'Erro interno do servidor',
      });
    });
  })
  .catch((err) => {
    console.error('Erro durante a inicialização do servidor', err);
  });

module.exports = app;
