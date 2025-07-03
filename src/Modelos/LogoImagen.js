const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LogoImagen', {
    CodigoLogoImagen: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoLogo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Logo',
        key: 'CodigoLogo'
      }
    },
    UrlImagen: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    Ubicacion: {
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
    tableName: 'LogoImagen',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiLogoImagen_CodigoLogoImagen",
        unique: true,
        fields: [
          { name: "CodigoLogoImagen" },
        ]
      },
    ]
  });
};
