const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Carrusel', {
    CodigoCarrusel: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Empresa',
        key: 'CodigoEmpresa'
      },
      unique: "Uq_CaCarrusel_NombreCarrusel"
    },
    NombreCarrusel: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "Uq_CaCarrusel_NombreCarrusel"
    },
    Descripcion: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    Ubicacion: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Carrusel',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaCarrusel_CodigoCarrusel",
        unique: true,
        fields: [
          { name: "CodigoCarrusel" },
        ]
      },
      {
        name: "Uq_CaCarrusel_NombreCarrusel",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
          { name: "NombreCarrusel" },
        ]
      },
    ]
  });
};
