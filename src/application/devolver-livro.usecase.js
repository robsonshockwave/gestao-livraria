const { Either, AppError } = require('../shared/errors');
const emprestimosEntity = require('../enterprise/entities/emprestimo.entity');

module.exports = function devolverLivroUseCase({ emprestimosRepository }) {
  if (!emprestimosRepository) {
    throw new AppError(AppError.dependencias);
  }

  return async function ({ emprestimo_id, data_devolucao }) {
    const checaCampos = emprestimo_id && data_devolucao;

    if (!checaCampos) {
      throw new AppError(AppError.parametrosObrigatoriosAusentes);
    }

    const { data_retorno } = await emprestimosRepository.devolver({
      emprestimo_id,
      data_devolucao,
    });

    const calcularMulta = emprestimosEntity.calcularMulta({
      data_retorno,
      data_devolucao,
    });

    return Either.Right(calcularMulta);
  };
};
