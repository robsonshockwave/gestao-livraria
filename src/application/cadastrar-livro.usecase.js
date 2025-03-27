const { Either } = require('../shared/errors');

module.exports = function cadastrarLivroUseCase({ livrosRepository }) {
  return async function cadastrarLivro({
    nome,
    genero,
    autor,
    ISBN,
    quantidade,
  }) {
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
