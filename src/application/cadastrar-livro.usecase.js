const { Either, AppError } = require('../shared/errors');

module.exports = function cadastrarLivroUseCase({ livrosRepository }) {
  if (!livrosRepository) {
    throw new AppError(AppError.dependencias);
  }

  return async function ({ nome, genero, autor, ISBN, quantidade }) {
    const checaCampos = nome && genero && autor && ISBN && quantidade;

    if (!checaCampos) {
      throw new AppError(AppError.parametrosObrigatoriosAusentes);
    }

    await livrosRepository.cadastrar({
      nome,
      genero,
      autor,
      ISBN,
      quantidade,
    });

    return Either.Right(null);
  };
};
