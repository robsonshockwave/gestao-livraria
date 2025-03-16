const cadastrarUsuarioUsecase = require('./cadastrar-usuario.usecase');
const AppError = require('./shared/errors/AppError');

describe('Cadastrar usuario UseCase', function () {
  const usuariosRepository = {
    cadastrar: jest.fn(),
    existePorCPF: jest.fn(),
  };

  // Triple AAA

  // Arrange (preparação)
  test('Deve poder cadastrar um usuario', async function () {
    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    // ACT (ação)
    const sut = cadastrarUsuarioUsecase({ usuariosRepository });
    const output = await sut(usuarioDTO);

    // Assert (afirmação)
    expect(output).toBeUndefined();
    expect(usuariosRepository.cadastrar).toHaveBeenCalledWith(usuarioDTO);
    expect(usuariosRepository.cadastrar).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', function () {
    expect(() => cadastrarUsuarioUsecase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw AppError se os campos obrigatórios não forem fornecidos', async function () {
    const sut = cadastrarUsuarioUsecase({ usuariosRepository });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    );
  });

  test('Deve retornar um throw AppError se já existir um cadastro com o CPF', function () {
    usuariosRepository.existePorCPF.mockResolvedValue(true);

    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_ja_cadastrado',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    const sut = cadastrarUsuarioUsecase({ usuariosRepository });

    expect(() => sut(usuarioDTO)).rejects.toThrow(
      new AppError('CPF já cadastrado')
    );
  });
});
