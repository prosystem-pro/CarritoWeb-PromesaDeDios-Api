const { Sequelize } = require('sequelize');

const Sequelice = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, 
  dialect: 'mssql', 
  dialectOptions: {
    options: { encrypt: false } 
  },
  logging: false 
});

Sequelice.authenticate()
  .then(() => console.log('Conectado a SQL Server'))
  .catch(err => console.error('Error al conectar la base de datos:', err));

module.exports = Sequelice;
