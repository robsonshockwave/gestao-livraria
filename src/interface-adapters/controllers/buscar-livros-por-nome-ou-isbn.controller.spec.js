const { Either } = require('../../shared/errors');
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
});
