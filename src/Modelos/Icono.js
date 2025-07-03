const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Icono', {
    CodigoIcono: {
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
      }
    },
    NombreIcono: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "Uq_CaIcono_NombreIcono"
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Icono',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaIcono_CodigoIcono",
        unique: true,
        fields: [
          { name: "CodigoIcono" },
        ]
      },
      {
        name: "Uq_CaIcono_NombreIcono",
        unique: true,
        fields: [
          { name: "NombreIcono" },
        ]
      },
    ]
  });
};
