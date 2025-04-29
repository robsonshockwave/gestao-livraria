require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { routes } = require('./routes');
const { ZodError } = require('zod');
const { typeormServer } = require('../../infra/db/typeorm/setup');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { sendMailQueue } = require('../../infra/queue/bull');

const app = express();

// QUEUE MONITOR
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

createBullBoard({
  queues: [new BullAdapter(sendMailQueue)],
  serverAdapter,
});

// CONFIGS
app.use(express.json());

typeormServer
  .initialize()
  .then(() => {
    // ROUTES
    app.use(routes);

    app.use('/queues', serverAdapter.getRouter());

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
