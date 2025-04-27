const buscarLivrosPorNomeOuISBNUsecase = require('../../../application/buscar-livros-por-nome-ou-isbn.usecase');
const {
  livrosRepository,
} = require('../../../infra/db/typeorm/repositories/livros.repository');
const buscarLivrosPorNomeOuISBNController = require('../../../interface-adapters/controllers/buscar-livros-por-nome-ou-isbn.controller');

module.exports = async function buscarLivroPorNomeISBNCompose(httpRequest) {
  const livrosRepositoryFn = livrosRepository();
  const buscarLivroPorNomeISBNUseCaseFn = buscarLivrosPorNomeOuISBNUsecase({
    livrosRepository: livrosRepositoryFn,
  });
  const controller = await buscarLivrosPorNomeOuISBNController({
    buscarLivroPorNomeOuISBNUseCase: buscarLivroPorNomeISBNUseCaseFn,
    httpRequest,
  });

  return controller;
};
