const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Otro', {
    CodigoOtro: {
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
    NombreOtro: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    UrlImagen: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagen2: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Otro',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaOtro_CodigoOtro",
        unique: true,
        fields: [
          { name: "CodigoOtro" },
        ]
      },
    ]
  });
};
