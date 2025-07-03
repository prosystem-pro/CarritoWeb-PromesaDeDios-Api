const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CarruselImagen', {
    CodigoCarruselImagen: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoCarrusel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Carrusel',
        key: 'CodigoCarrusel'
      }
    },
    NombreCarruselImagen: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    UrlImagen: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    Orden: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'CarruselImagen',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiCarruselImagen_CodigoCarruselImagen",
        unique: true,
        fields: [
          { name: "CodigoCarruselImagen" },
        ]
      },
    ]
  });
};
