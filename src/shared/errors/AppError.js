module.exports = class AppError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }

  static dependencias = 'Alguma dependência obrigatória não foi fornecida';
  static parametrosObrigatoriosAusentes =
    'Algum parametro obrigatório não foi fornecido';
};
