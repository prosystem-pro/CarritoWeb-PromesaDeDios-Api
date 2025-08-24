require('dotenv').config();
const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,            
    dialect: process.env.DB_DIALECT,
    directory: './src/Modelos',      
    caseModel: 'p',                   
    caseFile: 'c',                     
    noPluralize: true,                 
    additional: {
      timestamps: false,
    },
  }
);

auto.run((err) => {
  if (err) {
    console.error('❌ Error al generar modelos:', err);
    process.exit(1);
  }
});
