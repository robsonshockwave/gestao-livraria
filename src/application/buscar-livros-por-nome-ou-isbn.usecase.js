const Either = require('../shared/errors/Either');

module.exports = function buscarLivrosPorNomeOuISBNUseCase({
  livrosRepository,
}) {
  return async function ({ valor }) {
    const livros = await livrosRepository.buscarPorNomeOuISBN(valor);

    return Either.Right(livros);
  };
};
