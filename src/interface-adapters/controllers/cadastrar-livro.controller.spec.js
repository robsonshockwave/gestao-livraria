const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const cadastrarLivroController = require('./cadastrar-livro.controller');

describe('Cadastrar livro controller', function () {
  const cadastrarLivroUseCase = jest.fn();

  test('Deve retornar um httpResponse 201 e null se o livro for cadastro com sucesso', async function () {
    cadastrarLivroUseCase.mockResolvedValue(Either.Right(null));

    const httpRequest = {
      body: {
        nome: 'qualquer_nome',
        genero: 'qualquer_genero',
        autor: 'qualquer_autor',
        ISBN: 'qualquer_ISBN',
        quantidade: 10,
      },
    };

    const response = await cadastrarLivroController({
      cadastrarLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(cadastrarLivroUseCase).toHaveBeenCalledWith(httpRequest.body);
    expect(cadastrarLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retorna um throw AppError se o cadastrarLivroUseCase e httpRequest não for fornecido', async function () {
    await expect(() => cadastrarLivroController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });
});
