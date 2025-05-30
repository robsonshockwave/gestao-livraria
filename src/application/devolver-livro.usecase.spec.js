const { AppError } = require('../shared/errors');
const devolverLivroUseCase = require('./devolver-livro.usecase');

describe('Devolver livro UseCase', function () {
  const emprestimosRepository = {
    devolver: jest.fn(),
  };

  test('Deve ser possível devolver um livro sem multa', async function () {
    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2025-01-01'),
    });

    const devolverLivroDTO = {
      emprestimo_id: 'qualquer_id',
      data_devolucao: new Date('2025-01-01'),
    };

    const sut = devolverLivroUseCase({ emprestimosRepository });
    const output = await sut(devolverLivroDTO);

    expect(output.right).toBe('Multa por atraso: R$ 0');
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(
      devolverLivroDTO
    );
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1);
  });

  test('Deve ser possível devolver um livro com multa', async function () {
    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2025-01-01'),
    });

    const devolverLivroDTO = {
      emprestimo_id: 'qualquer_id',
      data_devolucao: new Date('2025-01-04'),
    };

    const sut = devolverLivroUseCase({ emprestimosRepository });
    const output = await sut(devolverLivroDTO);

    expect(output.right).toBe('Multa por atraso: R$ 10,00');
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(
      devolverLivroDTO
    );
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o emprestimosRepository não for fornecido', function () {
    expect(() => devolverLivroUseCase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw AppError se algum campo obrigatório não for fornecido', async function () {
    const sut = devolverLivroUseCase({ emprestimosRepository });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    );
  });
});
