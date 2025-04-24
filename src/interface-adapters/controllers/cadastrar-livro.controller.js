const { z } = require('zod');
const httpResponse = require('../../shared/helpers/http.response');
const { AppError } = require('../../shared/errors');

const zodValidator = z.object({
  nome: z.string({
    required_error: 'Nome é obrigatório',
  }),
  genero: z.string({
    required_error: 'Genero é obrigatório',
  }),
  autor: z.string({
    required_error: 'Autor é obrigatório',
  }),
  ISBN: z.string({
    required_error: 'ISBN é obrigatório',
  }),
  quantidade: z.number({
    required_error: 'Quantidade é obrigatório',
  }),
});

module.exports = async function cadastrarLivroController({
  cadastrarLivroUseCase,
  httpRequest,
}) {
  if (!cadastrarLivroUseCase || !httpRequest || !httpRequest.body) {
    throw new AppError(AppError.dependencias);
  }

  const { nome, genero, autor, ISBN, quantidade } = zodValidator.parse(
    httpRequest.body
  );

  const output = await cadastrarLivroUseCase({
    nome,
    genero,
    autor,
    ISBN,
    quantidade,
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    (livro) => httpResponse(200, livro)
  );
};
