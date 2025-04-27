const { Router } = require('express');
const cadastrarLivroCompose = require('../composers/cadastrar-livro.compose');
const buscarLivroPorNomeISBNCompose = require('../composers/buscar-livro-por-nome-isbn.compose');

const livrosRoutes = Router();

livrosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const { statusCode, body } = await cadastrarLivroCompose(httpRequest);

  return res.status(statusCode).json(body);
});

livrosRoutes.get('/', async (req, res) => {
  const httpRequest = {
    query: req.query,
  };

  const { statusCode, body } = await buscarLivroPorNomeISBNCompose(httpRequest);

  return res.status(statusCode).json(body);
});

module.exports = { livrosRoutes };
