const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PortadaOtro', {
    CodigoPortadaOtro: {
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
    NombrePortadaOtro: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ColorNombrePortadaOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFondoNombrePortadaOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ColorDescripcion: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorDescripcionOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'PortadaOtro',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaPortadaOtro_CodigoPortadaOtro",
        unique: true,
        fields: [
          { name: "CodigoPortadaOtro" },
        ]
      },
    ]
  });
};
