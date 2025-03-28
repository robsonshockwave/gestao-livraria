const { AppError } = require('../shared/errors');
const buscarEmprestimosPendentesUsecase = require('./buscar-emprestimos-pendentes.usecase');

describe('Buscar emprestimos pendentes UseCase', function () {
  const emprestimosRepository = {
    buscarPendentesComLivroComUsuario: jest.fn(),
  };

  test('Deve ser possível buscar os empréstimos pendentes', async function () {
    emprestimosRepository.buscarPendentesComLivroComUsuario.mockResolvedValue([
      {
        usuario: {
          nome: 'qualquer_nome_usuario',
          CPF: 'qualquer_cpf',
        },
        livro: {
          nome: 'qualquer_nome_livro',
        },
        data_saida: '2025-01-01',
        data_retorno: '2025-01-01',
      },
      {
        usuario: {
          nome: 'qualquer_nome_valido',
          CPF: 'qualquer_cpf_valido',
        },
        livro: {
          nome: 'qualquer_nome_livro_valido',
        },
        data_saida: '2025-01-01',
        data_retorno: '2025-01-04',
      },
    ]);

    const sut = buscarEmprestimosPendentesUsecase({ emprestimosRepository });
    const output = await sut();

    expect(output.right).toHaveLength(2);
    expect(output.right[0].usuario.nome).toBe('qualquer_nome_usuario');
    expect(output.right[0].usuario.CPF).toBe('qualquer_cpf');
    expect(output.right[0].livro.nome).toBe('qualquer_nome_livro');
    expect(output.right[0].data_saida).toBe('2025-01-01');
    expect(output.right[0].data_retorno).toBe('2025-01-01');
    expect(
      emprestimosRepository.buscarPendentesComLivroComUsuario
    ).toHaveBeenCalledWith();
    expect(
      emprestimosRepository.buscarPendentesComLivroComUsuario
    ).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o emprestimosRepository não for fornecido', function () {
    expect(() => buscarEmprestimosPendentesUsecase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });
});
