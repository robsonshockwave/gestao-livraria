const { AppError } = require('../../shared/errors');
const emprestimoEntity = require('./emprestimo.entity');

describe('Emprestimos Entity', function () {
  test('calcularMulta - sem atraso', function () {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2024-01-01',
      data_retorno: '2024-01-01',
    });

    expect(resultado).toBe('Multa por atraso: R$ 0');
  });

  test('calcularMulta - com atraso', function () {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2024-01-04',
      data_retorno: '2024-01-01',
    });

    expect(resultado).toBe('Multa por atraso: R$ 10,00');
  });

  test('calcularMulta - retornar um throw AppError se os campos obrigatórios não forem fornecidas', function () {
    expect(() => emprestimoEntity.calcularMulta({})).toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    );
  });
});
