const {
  emprestimosRepository,
  typeormEmprestimosRepository,
} = require('./emprestimos.repository');
const { typeormUsuariosRepository } = require('./usuarios.repository');
const { typeormLivrosRepository } = require('./livros.repository');

describe('Emprestimos Repository Typeorm', function () {
  let sut;

  beforeAll(function () {
    sut = emprestimosRepository();
  });

  beforeEach(async function () {
    await typeormEmprestimosRepository.delete({});
    await typeormUsuariosRepository.delete({});
    await typeormLivrosRepository.delete({});
  });

  const usuarioDTO = {
    nome_completo: 'qualquer_nome',
    CPF: 'qualquer_CPF',
    telefone: 'qualquer_telefone',
    email: 'qualquer_email',
    endereco: 'qualquer_endereco',
  };

  const livroDTO = {
    nome: 'qualquer_nome',
    quantidade: 3,
    autor: 'qualquer_autor',
    genero: 'qualquer_genero',
    ISBN: 'qualquer_ISBN',
  };

  test('Deve retornar void ao criar um empréstimo', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    const emprestimoCriado = await sut.emprestar({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: new Date('2025-01-02'),
      data_retorno: new Date('2025-01-04'),
    });

    expect(emprestimoCriado).toBeUndefined();
  });

  test('Deve retornar a data de retorno salva no banco de dados corretamente', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    const emprestimo = await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-02',
    });

    const devolver = await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2025-01-02',
    });

    expect(devolver.data_retorno).toBe(emprestimo.data_retorno);
  });

  test('Deve atualizar a data de devolucao no banco de dados corretamente', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    const emprestimo = await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-02',
    });

    const devolver = await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2025-01-02',
    });

    const buscarEmprestimoPorID = await typeormEmprestimosRepository.findOneBy({
      id: emprestimo.id,
    });

    expect(buscarEmprestimoPorID.data_devolucao).toBe('2025-01-02');
  });

  test('Deve retornar os emprestimos pendentes', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    await typeormEmprestimosRepository.save([
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_saida: '2025-01-04',
        data_retorno: '2025-01-06',
        data_devolucao: '2025-01-06',
      },
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_saida: '2025-01-06',
        data_retorno: '2025-01-07',
      },
    ]);

    const emprestimosPendentes = await sut.buscarPendentesComLivroComUsuario();

    expect(emprestimosPendentes).toHaveLength(1);
    expect(emprestimosPendentes[0].id).toBeDefined();
    expect(emprestimosPendentes[0].data_saida).toBe('2025-01-06');
    expect(emprestimosPendentes[0].data_retorno).toBe('2025-01-07');
    expect(emprestimosPendentes[0].data_devolucao).toBeUndefined();
    expect(emprestimosPendentes[0].usuario.nome_completo).toBe('qualquer_nome');
    expect(emprestimosPendentes[0].livro.nome).toBe('qualquer_nome');
  });

  test('Deve retornar true se existir um emprestimo pendente para o usuario e o livro', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-02',
    });

    const existeEmprestimoPendenteLivroUsuario =
      await sut.existeLivroISBNEmprestadoPendenteUsuario({
        livro_id: livro.id,
        usuario_id: usuario.id,
      });

    expect(existeEmprestimoPendenteLivroUsuario).toBe(true);
  });

  test('Deve retornar false se não existir um emprestimo pendente para o usuario e o livro', async function () {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivrosRepository.save(livroDTO);

    const existeEmprestimoPendenteLivroUsuario =
      await sut.existeLivroISBNEmprestadoPendenteUsuario({
        livro_id: livro.id,
        usuario_id: usuario.id,
      });

    expect(existeEmprestimoPendenteLivroUsuario).toBe(false);
  });
});
