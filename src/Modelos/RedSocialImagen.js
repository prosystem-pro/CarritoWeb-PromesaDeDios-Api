const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RedSocialImagen', {
    CodigoRedSocialImagen: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoRedSocial: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'RedSocial',
        key: 'CodigoRedSocial'
      }
    },
    UrlImagen: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    Ubicacion: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'RedSocialImagen',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiRedSocialImagen_CodigoRedSocialImagen",
        unique: true,
        fields: [
          { name: "CodigoRedSocialImagen" },
        ]
      },
    ]
  });
};
