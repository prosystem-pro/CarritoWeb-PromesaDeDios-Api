const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CarritoPortada', {
    CodigoCarritoPortada: {
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
    TextoNavbar: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    ColorNavbar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ImagenWhatsap: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    ColorBotonWhatsap: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    TextoBotonWhatsap: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'CarritoPortada',
    schema: 'Cc',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CcCarritoPortada_CodigoCarritoPortada",
        unique: true,
        fields: [
          { name: "CodigoCarritoPortada" },
        ]
      },
    ]
  });
};
