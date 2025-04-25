const buscarPendentesFixture = require('../../../tests/fixtures/buscar-pendentes');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarEmprestimosPendentesController = require('./buscar-emprestimos-pendentes.controller');

describe('Buscar emprestimos pendentes Controller', function () {
  const buscarEmprestimosPendentesUseCase = jest.fn();

  test('Deve retornar um httpResponse 200 e os emprestimos pendentes', async function () {
    buscarEmprestimosPendentesUseCase.mockResolvedValue(
      Either.Right(buscarPendentesFixture)
    );

    const response = await buscarEmprestimosPendentesController({
      buscarEmprestimosPendentesUseCase,
    });

    expect(response).toEqual(httpResponse(200, buscarPendentesFixture));
    expect(buscarEmprestimosPendentesUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um httpResponse 400 e message se o buscarEmprestimosPendentesUseCase falhar', async function () {
    buscarEmprestimosPendentesUseCase.mockResolvedValue(
      Either.Left({ message: 'validacao_invalida' })
    );

    const response = await buscarEmprestimosPendentesController({
      buscarEmprestimosPendentesUseCase,
    });

    expect(response).toEqual(httpResponse(400, 'validacao_invalida'));
    expect(buscarEmprestimosPendentesUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um erro se o buscarEmprestimosPendentesUseCase nao for fornecido', async function () {
    await expect(() =>
      buscarEmprestimosPendentesController({})
    ).rejects.toThrow(new AppError(AppError.dependencias));
  });
});
