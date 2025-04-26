const { Router } = require('express');
const cadastrarUsuarioCompose = require('../composers/cadastrar-usuario.compose');
const buscarUsuarioPorCpfCompose = require('../composers/buscar-usuario-por-cpf.compose');

const usuariosRoutes = Router();

usuariosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const { statusCode, body } = await cadastrarUsuarioCompose(httpRequest);

  return res.status(statusCode).json(body);
});

usuariosRoutes.get('/cpf/:cpf', async (req, res) => {
  const httpRequest = {
    query: req.params,
  };

  const { statusCode, body } = await buscarUsuarioPorCpfCompose(httpRequest);

  return res.status(statusCode).json(body);
});

module.exports = { usuariosRoutes };
