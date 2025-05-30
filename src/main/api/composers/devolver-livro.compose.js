const devolverLivroUsecase = require('../../../application/devolver-livro.usecase');
const {
  emprestimosRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimos.repository');
const devolverLivroController = require('../../../interface-adapters/controllers/devolver-livro.controller');

module.exports = async function devolverLivroCompose(httpRequest) {
  const emprestimosRepositoryFn = emprestimosRepository();
  const devolverLivroUseCaseFn = devolverLivroUsecase({
    emprestimosRepository: emprestimosRepositoryFn,
  });
  const controller = await devolverLivroController({
    devolverLivroUseCase: devolverLivroUseCaseFn,
    httpRequest,
  });

  return controller;
};
