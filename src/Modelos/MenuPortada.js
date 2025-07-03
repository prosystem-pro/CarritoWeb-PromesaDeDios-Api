const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MenuPortada', {
    CodigoMenuPortada: {
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
    UrlImagenNavbar: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenPortadaIzquierdo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenPortadaDerecho: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    TituloMenu: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    ColorTituloMenu: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    UrlImagenMenu: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ColorContornoImagenClasificacion: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorNombreClasificacion: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorFondoNombreClasificacion: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    UrlImagenPresentacion: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'MenuPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiMenuPortada_CodigoMenuPortada",
        unique: true,
        fields: [
          { name: "CodigoMenuPortada" },
        ]
      },
    ]
  });
};
