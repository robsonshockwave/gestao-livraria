const cadastrarUsuarioUseCase = require('./cadastrar-usuario.usecase');
const { AppError, Either } = require('../shared/errors');

describe('Cadastrar usuario UseCase', function () {
  const usuariosRepository = {
    cadastrar: jest.fn(),
    existePorCPF: jest.fn(),
    existePorEmail: jest.fn(),
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
    const sut = cadastrarUsuarioUseCase({ usuariosRepository });
    const output = await sut(usuarioDTO);

    // Assert (afirmação)
    expect(output.right).toBeNull();
    expect(usuariosRepository.cadastrar).toHaveBeenCalledWith(usuarioDTO);
    expect(usuariosRepository.cadastrar).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', function () {
    expect(() => cadastrarUsuarioUseCase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw AppError se os campos obrigatórios não forem fornecidos', async function () {
    const sut = cadastrarUsuarioUseCase({ usuariosRepository });

    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    );
  });

  test('Deve retornar um Either.Left se já existir um cadastro com o CPF', async function () {
    usuariosRepository.existePorCPF.mockResolvedValue(true);

    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_ja_cadastrado',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    const sut = cadastrarUsuarioUseCase({ usuariosRepository });
    const output = await sut(usuarioDTO);

    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.valorJaCadastrado('CPF'));
    expect(usuariosRepository.existePorCPF).toHaveBeenLastCalledWith(
      usuarioDTO.CPF
    );
    expect(usuariosRepository.existePorCPF).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um Either.Left se já existir um cadastro com o Email', async function () {
    usuariosRepository.existePorCPF.mockResolvedValue(false);
    usuariosRepository.existePorEmail.mockResolvedValue(true);

    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_ja_cadastrado',
    };

    const sut = cadastrarUsuarioUseCase({ usuariosRepository });
    const output = await sut(usuarioDTO);

    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.valorJaCadastrado('email'));
    expect(usuariosRepository.existePorEmail).toHaveBeenLastCalledWith(
      usuarioDTO.email
    );
    expect(usuariosRepository.existePorEmail).toHaveBeenCalledTimes(1);
  });
});
