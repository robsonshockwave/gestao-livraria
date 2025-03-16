const { Either, AppError } = require('./shared/errors');

module.exports = function cadastrarUsuarioUseCase({ usuariosRepository }) {
  if (!usuariosRepository) throw new AppError(AppError.dependencias);

  return async function ({ nome_completo, CPF, telefone, endereco, email }) {
    const checaCampos = nome_completo && CPF && telefone && endereco && email;

    const checaSeJaExisteUmUsuarioCadastradoComOCPF =
      await usuariosRepository.existePorCPF(CPF);
    const checaSeJaExisteUmUsuarioCadastradoComOEmail =
      await usuariosRepository.existePorEmail(email);

    if (checaSeJaExisteUmUsuarioCadastradoComOCPF)
      return Either.Left(Either.valorJaCadastrado('CPF'));

    if (checaSeJaExisteUmUsuarioCadastradoComOEmail)
      return Either.Left(Either.valorJaCadastrado('email'));

    if (!checaCampos)
      throw new AppError(AppError.parametrosObrigatoriosAusentes);

    await usuariosRepository.cadastrar({
      nome_completo,
      CPF,
      telefone,
      endereco,
      email,
    });

    return Either.Right(null);
  };
};
