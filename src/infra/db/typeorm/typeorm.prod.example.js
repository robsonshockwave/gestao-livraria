// const { resolve } = require('path');

module.exports = {
  type: '',
  host: '',
  database: '',
  synchronize: false,
  port: 5432,
  username: '',
  password: '',
  entities: [
    require('./entities/Usuario.entity-typeorm'),
    require('./entities/Livro.entity-typeorm'),
    require('./entities/Emprestimo.entity-typeorm'),
  ],
  // entities: [resolve(__dirname, './entities/*.entity-typeorm.js')],
};
