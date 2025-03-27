const { AppError } = require('../shared/errors');
const Either = require('../shared/errors/Either');

module.exports = function buscarLivrosPorNomeOuISBNUseCase({
  livrosRepository,
}) {
  if (!livrosRepository) {
    throw new AppError(AppError.dependencias);
  }

  return async function ({ valor }) {
    if (!valor) {
      throw new AppError(AppError.parametrosObrigatoriosAusentes);
    }

    const livros = await livrosRepository.buscarPorNomeOuISBN(valor);

    return Either.Right(livros);
  };
};
