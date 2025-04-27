const {
  typeormEmprestimosRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimos.repository');
const {
  typeormLivrosRepository,
} = require('../../../infra/db/typeorm/repositories/livros.repository');
const {
  typeormUsuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const app = require('../app');
const request = require('supertest');

describe('Emprestimos Routes', function () {
  beforeEach(async function () {
    await typeormEmprestimosRepository.query('DELETE FROM emprestimos');
    await typeormLivrosRepository.query('DELETE FROM livros');
    await typeormUsuariosRepository.query('DELETE FROM usuarios');
  });

  const livroDTO = {
    nome: 'qualquer_nome',
    quantidade: 3,
    autor: 'qualquer_autor',
    genero: 'qualquer_genero',
    ISBN: 'qualquer_ISBN',
  };

  const usuarioDTO = {
    nome_completo: 'qualquer_nome',
    CPF: '123.123.123-12',
    telefone: 'qualquer_telefone',
    email: 'qualquer_email@email.com',
    endereco: 'qualquer_endereco',
  };

  test('Deve ser possivel emprestar um livro', async function () {
    const livro = await typeormLivrosRepository.save(livroDTO);
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);

    const { statusCode, body } = await request(app).post('/emprestimos').send({
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-04',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('Deve retornar 200 e uma mensagem de multa não aplicada', async function () {
    const livro = await typeormLivrosRepository.save(livroDTO);
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const emprestimo = await typeormEmprestimosRepository.save({
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-04',
    });

    const { statusCode, body } = await request(app)
      .put(`/emprestimos/devolver/${emprestimo.id}`)
      .send({
        data_devolucao: '2025-01-04',
      });

    expect(statusCode).toBe(200);
    expect(body).toBe('Multa por atraso: R$ 0');
  });

  test('Deve retornar 200 e uma mensagem de multa aplicada', async function () {
    const livro = await typeormLivrosRepository.save(livroDTO);
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const emprestimo = await typeormEmprestimosRepository.save({
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_saida: '2025-01-02',
      data_retorno: '2025-01-04',
    });

    const { statusCode, body } = await request(app)
      .put(`/emprestimos/devolver/${emprestimo.id}`)
      .send({
        data_devolucao: '2025-01-05',
      });

    expect(statusCode).toBe(200);
    expect(body).toBe('Multa por atraso: R$ 10,00');
  });
});
