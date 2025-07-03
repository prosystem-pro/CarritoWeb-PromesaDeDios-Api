const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LoginPortada', {
    CodigoLoginPortada: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UrlImagenPortada: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenDecorativaIzquierda: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenDecorativaDerecha: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Color: {
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
    tableName: 'LoginPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiLoginPortada_CodigoLoginPortada",
        unique: true,
        fields: [
          { name: "CodigoLoginPortada" },
        ]
      },
    ]
  });
};
