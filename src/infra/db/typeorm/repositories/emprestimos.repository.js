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

  return { emprestar };
};

module.exports = { emprestimosRepository, typeormEmprestimosRepository };
