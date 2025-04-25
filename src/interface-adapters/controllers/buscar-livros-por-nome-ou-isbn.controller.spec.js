const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarLivrosPorNomeOuIsbnController = require('./buscar-livros-por-nome-ou-isbn.controller');

describe('Buscar livro por nome ou ISBN controller', function () {
  const buscarLivroPorNomeOuISBNUseCase = jest.fn();

  test('Deve retornar um httpResponse 200 e os livros se forem encontrados com o valor informado', async function () {
    const livroDTO = [
      {
        id: 'qualquer_id',
        nome: 'qualquer_nome',
        quantidade: 3,
        autor: 'qualquer_autor',
        genero: 'qualquer_genero',
        ISBN: 'qualquer_ISBN',
      },
    ];

    const httpRequest = {
      query: {
        valor: 'qualquer_nome',
      },
    };

    buscarLivroPorNomeOuISBNUseCase.mockResolvedValue(Either.Right(livroDTO));

    const response = await buscarLivrosPorNomeOuIsbnController({
      buscarLivroPorNomeOuISBNUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, livroDTO));
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledWith(
      httpRequest.query
    );
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um httpResponse 200 e um array vazio se o livro não forem encontrados livros com o valor informado', async function () {
    buscarLivroPorNomeOuISBNUseCase.mockResolvedValue(Either.Right([]));

    const httpRequest = {
      query: {
        valor: 'qualquer_nome',
      },
    };

    const response = await buscarLivrosPorNomeOuIsbnController({
      buscarLivroPorNomeOuISBNUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, []));
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledWith(
      httpRequest.query
    );
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o buscarLivroPorNomeOuISBNUseCase e httpRequest não forem fornecidos', async function () {
    await expect(() => buscarLivrosPorNomeOuIsbnController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um erro do Zod validator se os campos obrigatórios nao forem fornecidos', async function () {
    const httpRequest = {
      query: {},
    };

    await expect(
      buscarLivrosPorNomeOuIsbnController({
        buscarLivroPorNomeOuISBNUseCase,
        httpRequest,
      })
    ).rejects.toBeInstanceOf(ZodError);
  });
});
