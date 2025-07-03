const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Logo', {
    CodigoLogo: {
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
      unique: "Uq_CaLogo_NombreLogoEmpresa"
    },
    NombreLogoEmpresa: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "Uq_CaLogo_NombreLogoEmpresa"
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Logo',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaLogo_CodigoLogo",
        unique: true,
        fields: [
          { name: "CodigoLogo" },
        ]
      },
      {
        name: "Uq_CaLogo_NombreLogoEmpresa",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
          { name: "NombreLogoEmpresa" },
        ]
      },
    ]
  });
};
