const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const emprestarLivroController = require('./emprestar-livro.controller');

describe('Emprestar livro Controller', function () {
  const emprestarLivroUseCase = jest.fn();

  test('Deve retornar um httpResponse 201 e null se o livro for emprestado com sucesso', async function () {
    emprestarLivroUseCase.mockResolvedValue(Either.Right(null));

    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_saida: '2025-01-02',
        data_retorno: '2025-01-04',
      },
    };

    const response = await emprestarLivroController({
      emprestarLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(emprestarLivroUseCase).toHaveBeenCalledWith({
      usuario_id: 1,
      livro_id: 1,
      data_saida: expect.any(Date),
      data_retorno: expect.any(Date),
    });
    expect(emprestarLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um httpResponse 400 e message se o emprestimo não for realizado com sucesso por lógica do useCase', async function () {
    emprestarLivroUseCase.mockResolvedValue(
      Either.Left({ message: 'validacao_invalida' })
    );

    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_saida: '2025-01-02',
        data_retorno: '2025-01-04',
      },
    };

    const response = await emprestarLivroController({
      emprestarLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, 'validacao_invalida'));
    expect(emprestarLivroUseCase).toHaveBeenCalledWith({
      usuario_id: 1,
      livro_id: 1,
      data_saida: expect.any(Date),
      data_retorno: expect.any(Date),
    });
    expect(emprestarLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o emprestarLivroUseCase e httpRequest não forem fornecidos', async function () {
    await expect(() => emprestarLivroController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um erro do Zod validator se os campos obrigatórios nao forem fornecidos', async function () {
    const httpRequest = {
      body: {},
    };

    await expect(() =>
      emprestarLivroController({ emprestarLivroUseCase, httpRequest })
    ).rejects.toBeInstanceOf(ZodError);
  });
});
