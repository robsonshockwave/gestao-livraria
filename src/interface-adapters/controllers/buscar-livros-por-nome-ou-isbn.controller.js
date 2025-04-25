const { z } = require('zod');
const httpResponse = require('../../shared/helpers/http.response');

const zodValidator = z.object({
  valor: z.string({
    required_error: 'Valor é obrigatório',
  }),
});

module.exports = async function buscarLivroPorNomeOuISBNController({
  buscarLivroPorNomeOuISBNUseCase,
  httpRequest,
}) {
  if (!buscarLivroPorNomeOuISBNUseCase || !httpRequest || !httpRequest.params) {
    throw new AppError(AppError.dependencias);
  }

  const { valor } = zodValidator.parse(httpRequest.params);

  const output = await buscarLivroPorNomeOuISBNUseCase({ valor });

  return output.fold(
    (error) => httpResponse(400, error.message),
    (livros) => httpResponse(200, livros)
  );
};
