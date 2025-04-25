const buscarPendentesFixture = require('../../../tests/fixtures/buscar-pendentes');
const { Either } = require('../../shared/errors');
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
});
