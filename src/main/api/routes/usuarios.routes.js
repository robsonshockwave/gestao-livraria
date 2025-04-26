const { Router } = require('express');
const {
  usuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const cadastrarUsuarioUsecase = require('../../../application/cadastrar-usuario.usecase');
const cadastrarUsuarioController = require('../../../interface-adapters/controllers/cadastrar-usuario.controller');
const cadastrarUsuarioCompose = require('../composers/cadastrar-usuario.compose');

const usuariosRoutes = Router();

usuariosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const { statusCode, body } = await cadastrarUsuarioCompose(httpRequest);

  return res.status(statusCode).json(body);
});

module.exports = { usuariosRoutes };
