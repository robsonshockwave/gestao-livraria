const buscarLivrosPorNomeOuISBNUseCase = require('./buscar-livros-por-nome-ou-isbn.usecase');

describe('Buscar Livros Por Nome Ou ISBN Use Case', function () {
  const livrosRepository = {
    buscarPorNomeOuISBN: jest.fn(),
  };

  test('Deve retornar um livro válido ao buscar por nome ou ISBN existente', async function () {
    const nomeISBNDTO = {
      valor: 'valor_valido',
    };

    const outputDTO = [
      {
        id: 'id_valido',
        nome: 'nome_valido',
        autor: 'autor_valido',
        genero: 'genero_valido',
        ISBN: 'valor_valido',
      },
    ];

    livrosRepository.buscarPorNomeOuISBN.mockResolvedValue(outputDTO);

    const sut = buscarLivrosPorNomeOuISBNUseCase({ livrosRepository });
    const output = await sut(nomeISBNDTO);

    expect(output.right).toEqual(outputDTO);
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledWith(
      nomeISBNDTO.valor
    );
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledTimes(1);
  });
});
