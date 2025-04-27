const nodemailer = require('nodemailer');

module.exports = function nodemailerService() {
  const enviarEmail = async function ({
    data_saida,
    data_retorno,
    nome_usuario,
    CPF,
    email,
    nome_livro,
  }) {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      pot: 465,
      auth: {
        user: '80c6454dbf09e6',
        pass: '3744d69da039dd',
      },
    });

    const data_saida_BR = data_saida.toLocaleString('pt-BR', {
      timeZone: 'UTC',
    });
    const data_retorno_BR = data_retorno.toLocaleString('pt-BR', {
      timeZone: 'UTC',
    });

    await transporter.sendMail({
      from: '"Biblioteca UNI" <contato@uni.com>',
      to: email,
      subject: 'Novo livro emprestado',
      text: `Olá ${nome_usuario}(${CPF}), você pegou o livro ${nome_livro} emprestado dia ${data_saida_BR} e deverá ser devolvido no dia ${data_retorno_BR}.\n\nBoa leitura!`,
    });
  };

  return { enviarEmail };
};
