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
});
