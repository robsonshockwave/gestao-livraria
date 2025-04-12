const { usuariosRepository } = require('./usuarios.repository');

describe('Usuarios Repository', function () {
  test('Deve retornar void ao criar um usuario', async function () {
    const sut = usuariosRepository();
    const usuarioCriado = await sut.cadastrar({
      nome_completo: 'nomve_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    });

    expect(usuarioCriado).toBeUndefined();
  });
});
