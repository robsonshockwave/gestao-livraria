const { IsNull } = require('typeorm');
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

  const buscarPendentesComLivroComUsuario = async function () {
    const emprestimosPendentes = await typeormEmprestimosRepository.find({
      where: { data_devolucao: IsNull() },
      relations: ['livro', 'usuario'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        livro: {
          nome: true,
        },
        usuario: {
          nome_completo: true,
          CPF: true,
        },
      },
    });

    return emprestimosPendentes;
  };

  const existeLivroISBNEmprestadoPendenteUsuario = async function ({
    usuario_id,
    livro_id,
  }) {
    const emprestimosPendentes = await typeormEmprestimosRepository.count({
      where: {
        data_devolucao: IsNull(),
        livro_id,
        usuario_id,
      },
    });

    return emprestimosPendentes === 0 ? false : true;
  };

  const buscarEmprestimoComLivroComUsuarioPorID = async function (id) {
    const emprestimo = await typeormEmprestimosRepository.findOne({
      where: { id },
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true,
          email: true,
        },
        livro: {
          nome: true,
        },
      },
      relations: ['livro', 'usuario'],
    });

    return emprestimo;
  };

  return {
    emprestar,
    devolver,
    buscarPendentesComLivroComUsuario,
    existeLivroISBNEmprestadoPendenteUsuario,
    buscarEmprestimoComLivroComUsuarioPorID,
  };
};

module.exports = { emprestimosRepository, typeormEmprestimosRepository };
