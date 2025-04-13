const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Livro',
  tableName: 'livros',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    nome: {
      type: 'varchar',
    },
    quantidade: {
      type: 'int',
    },
    autor: {
      type: 'varchar',
    },
    genero: {
      type: 'varchar',
    },
    ISBN: {
      type: 'varchar',
      unique: true,
    },
  },
});
