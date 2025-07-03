const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Empresa', {
    CodigoEmpresa: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NombreEmpresa: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "Uq_AdEmpresa_NombreEmpresa"
    },
    Direccion: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    Eslogan: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    Celular: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Empresa',
    schema: 'Ad',
    timestamps: false,
    indexes: [
      {
        name: "Pk_AdEmpresa_CodigoEmpresa",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
        ]
      },
      {
        name: "Uq_AdEmpresa_NombreEmpresa",
        unique: true,
        fields: [
          { name: "NombreEmpresa" },
        ]
      },
    ]
  });
};
