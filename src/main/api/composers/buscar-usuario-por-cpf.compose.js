const buscarUsuarioPorCPFUsecase = require('../../../application/buscar-usuario-por-cpf.usecase');
const {
  usuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const buscarUsuarioPorCPFController = require('../../../interface-adapters/controllers/buscar-usuario-por-cpf.controller');

module.exports = async function buscarUsuarioPorCPFCompose(httpRequest) {
  const usuariosRepositoryFn = usuariosRepository();
  const buscarUsuarioPorCPFUseCaseFn = buscarUsuarioPorCPFUsecase({
    usuariosRepository: usuariosRepositoryFn,
  });
  const controller = buscarUsuarioPorCPFController({
    buscarUsuarioPorCPFUseCase: buscarUsuarioPorCPFUseCaseFn,
    httpRequest,
  });

  return controller;
};
