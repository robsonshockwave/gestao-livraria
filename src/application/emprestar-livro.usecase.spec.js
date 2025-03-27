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
});
