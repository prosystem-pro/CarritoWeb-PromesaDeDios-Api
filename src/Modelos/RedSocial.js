const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RedSocial', {
    CodigoRedSocial: {
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
    NombreRedSocial: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    UrlImagen: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Link: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    Orden: {
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
    tableName: 'RedSocial',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaRedSocial_CodigoRedSocial",
        unique: true,
        fields: [
          { name: "CodigoRedSocial" },
        ]
      },
    ]
  });
};
