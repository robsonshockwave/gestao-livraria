const { Router } = require('express');
const {
  usuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const cadastrarUsuarioUsecase = require('../../../application/cadastrar-usuario.usecase');
const cadastrarUsuarioController = require('../../../interface-adapters/controllers/cadastrar-usuario.controller');

const usuariosRoutes = Router();

usuariosRoutes.post('/', async (req, res) => {
  const httpRequest = {
    body: req.body,
  };

  const usuariosRepositoryFn = usuariosRepository();
  const cadastrarUsuarioUseCaseFn = cadastrarUsuarioUsecase({
    usuariosRepository: usuariosRepositoryFn,
  });
  const { statusCody, body } = cadastrarUsuarioController({
    cadastrarUsuarioUseCase: cadastrarUsuarioUseCaseFn,
    httpRequest,
  });

  return res.status(statusCody).json(body);
});

module.exports = { usuariosRoutes };
