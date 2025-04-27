const { Either, AppError } = require('../shared/errors');
const emprestarLivroUseCase = require('./emprestar-livro.usecase');

describe('Emprestar Livro Use Case', function () {
  const emprestimosRepository = {
    existeLivroISBNEmprestadoPendenteUsuario: jest.fn(),
    emprestar: jest.fn(),
    buscarEmprestimoComLivroComUsuarioPorID: jest.fn(),
  };

  const emailService = {
    enviarEmail: jest.fn(),
  };

  test('Deve poder emprestar um livro', async function () {
    emprestimosRepository.emprestar.mockResolvedValue('qualquer_id');
    emprestimosRepository.buscarEmprestimoComLivroComUsuarioPorID.mockResolvedValue(
      {
        usuario: {
          nome_completo: 'qualquer_nome_usuario',
          CPF: 'qualquer_CPF',
          email: 'qualquer_email',
        },
        livro: {
          nome: 'qualquer_nome_livro',
        },
      }
    );

    const emprestarLivroDTO = {
      livro_id: 'qualquer_livro_id',
      usuario_id: 'qualquer_usuario_id',
      data_saida: new Date('2025-01-02'),
      data_retorno: new Date('2025-01-04'),
    };

    const sut = emprestarLivroUseCase({ emprestimosRepository, emailService });
    const output = await sut(emprestarLivroDTO);

    expect(output.right).toBeNull();
    expect(emprestimosRepository.emprestar).toHaveBeenCalledWith(
      emprestarLivroDTO
    );
    expect(emprestimosRepository.emprestar).toHaveBeenCalledTimes(1);
    expect(emailService.enviarEmail).toHaveBeenCalledWith({
      data_saida: emprestarLivroDTO.data_saida,
      data_retorno: emprestarLivroDTO.data_retorno,
      nome_usuario: 'qualquer_nome_usuario',
      CPF: 'qualquer_CPF',
      email: 'qualquer_email',
      nome_livro: 'qualquer_nome_livro',
    });
  });

  test('Deve retornar um Either.Left se a data de retorno for menor que a data de saída', async function () {
    const emprestarLivroDTO = {
      livro_id: 'qualquer_livro_id',
      usuario_id: 'qualquer_usuario_id',
      data_saida: new Date('2025-01-04'),
      data_retorno: new Date('2025-01-02'),
    };

    const sut = emprestarLivroUseCase({ emprestimosRepository, emailService });
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

    const sut = emprestarLivroUseCase({ emprestimosRepository, emailService });
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

  test('Deve retornar um throw AppError se o emprestimosRepository não for fornecido', function () {
    expect(() => emprestarLivroUseCase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw AppError se algum campo obrigatório não for fornecido', async function () {
    const sut = emprestarLivroUseCase({ emprestimosRepository, emailService });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    );
  });
});
