/**
 * @description: ANTEÇÃO, esta classe não deve ser instanciada diretamente, use um dos métodos Left ou Right
 */

module.exports = class Either {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  static Left(left) {
    return new Either(left, null);
  }

  static Right(right) {
    return new Either(null, right);
  }

  static valorJaCadastrado(valor) {
    return { message: `${valor} já cadastrado.` };
  }

  fold(leftFn, rightFn) {
    return this.left !== null ? leftFn(this.left) : rightFn(this.right);
  }

  static dataRetornoMenorQueDataSaida = {
    message: 'Data de retorno menor que a data de saída.',
  };

  static livroComISBNJaEmprestadoPendenteUsuario = {
    message: 'Livro com ISBN já emprestado ao usuário e ainda não devolvido.',
  };
};
