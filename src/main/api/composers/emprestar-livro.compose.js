const emprestarLivroUseCase = require('../../../application/emprestar-livro.usecase');
const {
  emprestimosRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimos.repository');
const emprestarLivroController = require('../../../interface-adapters/controllers/emprestar-livro.controller');
const nodemailerService = require('../../../infra/email/nodemailer/index');

module.exports = async function emprestarLivroCompose(httpRequest) {
  const emprestimosRepositoryFn = emprestimosRepository();
  const emailServiceFn = nodemailerService();
  const emprestarLivroUseCaseFn = emprestarLivroUseCase({
    emprestimosRepository: emprestimosRepositoryFn,
    emailService: emailServiceFn,
  });
  const controller = await emprestarLivroController({
    emprestarLivroUseCase: emprestarLivroUseCaseFn,
    httpRequest,
  });

  return controller;
};
