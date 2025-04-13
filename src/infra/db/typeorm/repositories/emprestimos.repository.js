const { typeormServer } = require('../setup');

const typeormEmprestimosRepository = typeormServer.getRepository('Emprestimo');

const emprestimosRepository = function () {
  const emprestar = async function ({
    usuario_id,
    livro_id,
    data_saida,
    data_retorno,
  }) {
    await typeormEmprestimosRepository.save({
      usuario_id,
      livro_id,
      data_saida,
      data_retorno,
    });
  };

  const devolver = async function ({ emprestimo_id, data_devolucao }) {
    await typeormEmprestimosRepository.update(emprestimo_id, {
      data_devolucao,
    });

    const { data_retorno } = await typeormEmprestimosRepository.findOneBy({
      id: emprestimo_id,
    });

    return { data_retorno };
  };

  return { emprestar, devolver };
};

module.exports = { emprestimosRepository, typeormEmprestimosRepository };
