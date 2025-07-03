const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Footer', {
    CodigoFooter: {
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
    TextoInicio: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoInicio: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoMenu: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoMenu: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoContacto: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoContacto: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoTelefonoOficina: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoTelefonoOficina: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorNoCelular: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoSuscripcion: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ColorTextoSuscripcion: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoRedesSociales: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ColorTextoRedesSociales: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoCorreo: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ColorTextoCorreo: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoBotonSuscribirte: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoBotonSuscribirte: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorBotonSuscribirte: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    DerechoDeAutor: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    ColorDerechosDeAutor: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFooter: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlLogo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Footer',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiFooter_CodigoFooter",
        unique: true,
        fields: [
          { name: "CodigoFooter" },
        ]
      },
    ]
  });
};
