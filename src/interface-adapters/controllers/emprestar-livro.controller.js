const { z } = require('zod');
const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

const zodValidator = z.object({
  usuario_id: z.number({
    required_error: 'Usuário é obrigatório',
  }),
  livro_id: z.number({
    required_error: 'Livro é obrigatório',
  }),
  data_saida: z.string({
    required_error: 'Data saída é obrigatório',
  }),
  data_retorno: z.string({
    required_error: 'Data retorno é obrigatório',
  }),
});

module.exports = async function emprestarLivroController({
  emprestarLivroUseCase,
  httpRequest,
}) {
  if (!emprestarLivroUseCase || !httpRequest || !httpRequest.body) {
    throw new AppError(AppError.dependencias);
  }

  const { usuario_id, livro_id, data_saida, data_retorno } = zodValidator.parse(
    httpRequest.body
  );

  const output = await emprestarLivroUseCase({
    usuario_id,
    livro_id,
    data_saida: new Date(data_saida),
    data_retorno: new Date(data_retorno),
  });

  return output.fold(
    (error) => httpResponse(400, error.message),
    () => httpResponse(201, null)
  );
};
