const { Either } = require('../shared/errors');
const emprestarLivroUseCase = require('./emprestar-livro.usecase');

describe('Emprestar Livro Use Case', function () {
  const emprestimosRepository = {
    existeLivroISBNEmprestadoPendenteUsuario: jest.fn(),
    emprestar: jest.fn(),
  };

  test('Deve poder emprestar um livro', async function () {
    const emprestarLivroDTO = {
      livro_id: 'qualquer_livro_id',
      usuario_id: 'qualquer_usuario_id',
      data_saida: new Date('2025-01-02'),
      data_retorno: new Date('2025-01-04'),
    };

    const sut = emprestarLivroUseCase({ emprestimosRepository });
    const output = await sut(emprestarLivroDTO);

    expect(output.right).toBeNull();
    expect(emprestimosRepository.emprestar).toHaveBeenCalledWith(
      emprestarLivroDTO
    );
    expect(emprestimosRepository.emprestar).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um Either.Left se a data de retorno for menor que a data de saída', async function () {
    const emprestarLivroDTO = {
      livro_id: 'qualquer_livro_id',
      usuario_id: 'qualquer_usuario_id',
      data_saida: new Date('2025-01-04'),
      data_retorno: new Date('2025-01-02'),
    };

    const sut = emprestarLivroUseCase({ emprestimosRepository });
    const output = await sut(emprestarLivroDTO);

    expect(output.left).toEqual(Either.dataRetornoMenorQueDataSaida);
  });

  test('Não deve permitir o empréstimo de um livro com o mesmo ISBN para o mesmo usuário antes que o livro anterior tenha side devolvido', async function () {
    emprestimosRepository.existeLivroISBNEmprestadoPendenteUsuario.mockResolvedValue(
      true
    );

    const emprestarLivroDTO = {
      livro_id: 'qualquer_livro_id',
      usuario_id: 'qualquer_usuario_id',
      data_saida: new Date('2025-01-02'),
      data_retorno: new Date('2025-01-04'),
    };

    const sut = emprestarLivroUseCase({ emprestimosRepository });
    const output = await sut(emprestarLivroDTO);

    expect(output.left).toEqual(Either.livroComISBNJaEmprestadoPendenteUsuario);
    expect(
      emprestimosRepository.existeLivroISBNEmprestadoPendenteUsuario
    ).toHaveBeenCalledWith({
      livro_id: emprestarLivroDTO.livro_id,
      usuario_id: emprestarLivroDTO.usuario_id,
    });
    expect(
      emprestimosRepository.existeLivroISBNEmprestadoPendenteUsuario
    ).toHaveBeenCalledTimes(1);
  });
});
