const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Navbar', {
    CodigoNavbar: {
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
    ColortextoOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFondoOtro: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoReporte: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextextoReporte: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoBuscador: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    ColorTextoBuscador: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFondoBuscador: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenBuscador: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenCarrito: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ColorFondoNavbar: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlLogo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Navbar',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiNavbar_CodigoNavbar",
        unique: true,
        fields: [
          { name: "CodigoNavbar" },
        ]
      },
    ]
  });
};
