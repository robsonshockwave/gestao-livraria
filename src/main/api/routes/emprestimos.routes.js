const { Router } = require('express');
const emprestarLivroCompose = require('../composers/emprestar-livro.compose');

const emprestimosRoutes = Router();

emprestimosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const { statusCode, body } = await emprestarLivroCompose(httpRequest);

  return res.status(statusCode).json(body);
});

module.exports = { emprestimosRoutes };
