// const { resolve } = require('path');
require('dotenv').config();
const typeorm = require('typeorm');
const typeormProd = require('./typeorm.prod');

let typeormServer;

if (process.env.NODE_ENV === 'test') {
  typeormServer = new typeorm.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    dropSchema: true,
    entities: [
      require('./entities/Usuario.entity-typeorm'),
      require('./entities/Livro.entity-typeorm'),
      require('./entities/Emprestimo.entity-typeorm'),
    ],
    // entities: [resolve(__dirname, './entities/*.entity-typeorm.js')],
  });
} else if (process.env.NODE_ENV === 'integration') {
  typeormServer = new typeorm.DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE_TEST,
    synchronize: true,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    entities: [
      require('./entities/Usuario.entity-typeorm'),
      require('./entities/Livro.entity-typeorm'),
      require('./entities/Emprestimo.entity-typeorm'),
    ],
    // entities: [resolve(__dirname, './entities/*.entity-typeorm.js')],
  });
} else {
  typeormServer = new typeorm.DataSource({ ...typeormProd });
}

module.exports = { typeormServer };
