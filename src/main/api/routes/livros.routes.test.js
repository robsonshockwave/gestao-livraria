const request = require('supertest');
const {
  typeormLivrosRepository,
} = require('../../../infra/db/typeorm/repositories/livros.repository');
const app = require('../app');

describe('Livros Routes', function () {
  beforeEach(async function () {
    await typeormLivrosRepository.query('DELETE FROM livros');
  });

  test('Deve ser possível cadastrar um livro', async function () {
    const { statusCode, body } = await request(app).post('/livros').send({
      nome: 'qualquer_nome',
      quantidade: 1,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('Deve ser possível buscar um livro por nome', async function () {
    const livroDTO = {
      nome: 'qualquer_nome',
      quantidade: 4,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    };

    await typeormLivrosRepository.save(livroDTO);

    const { statusCode, body } = await request(app).get('/livros').query({
      valor: 'qualquer_nome',
    });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });

  test('Deve ser possível buscar um livro por ISBN', async function () {
    const livroDTO = {
      nome: 'qualquer_nome',
      quantidade: 4,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    };

    await typeormLivrosRepository.save(livroDTO);

    const { statusCode, body } = await request(app).get('/livros').query({
      valor: 'qualquer_ISBN',
    });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });

  test('Deve retornar um array vazio ao buscar um livro por nome ou ISBN e nada for encontrado', async function () {
    const { statusCode, body } = await request(app).get('/livros').query({
      valor: 'qualquer_ISBN',
    });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(0);
  });

  test('Deve retornar um erro se ao cadastrar um livro os campos obrigatorios estiverem ausentes', async function () {
    const { statusCode, body } = await request(app).post('/livros').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro na validação');
    expect(body.errors.fieldErrors).toEqual({
      nome: ['Nome é obrigatório'],
      quantidade: ['Quantidade é obrigatório'],
      autor: ['Autor é obrigatório'],
      genero: ['Genero é obrigatório'],
      ISBN: ['ISBN é obrigatório'],
    });
  });

  test('Deve retornar um erro so o campo obrigatório valor não for fornecido', async function () {
    const { statusCode, body } = await request(app).get('/livros').query({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro na validação');
    expect(body.errors.fieldErrors).toEqual({
      valor: ['Valor é obrigatório'],
    });
  });
});
