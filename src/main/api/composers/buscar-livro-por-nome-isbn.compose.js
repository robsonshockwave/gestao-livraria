const buscarLivrosPorNomeOuIsbnUsecase = require('../../../application/buscar-livros-por-nome-ou-isbn.usecase');
const {
  livrosRepository,
} = require('../../../infra/db/typeorm/repositories/livros.repository');
const buscarLivrosPorNomeOuIsbnController = require('../../../interface-adapters/controllers/buscar-livros-por-nome-ou-isbn.controller');

module.exports = async function buscarLivroPorNomeISBNCompose(httpRequest) {
  const livrosRepositoryFn = livrosRepository();
  const buscarLivroPorNomeIsbnUseCaseFn = buscarLivrosPorNomeOuIsbnUsecase({
    livrosRepository: livrosRepositoryFn,
  });
  const controller = buscarLivrosPorNomeOuIsbnController({
    buscarLivroPorNomeIsbnUseCase: buscarLivroPorNomeIsbnUseCaseFn,
    httpRequest,
  });

  return controller;
};
