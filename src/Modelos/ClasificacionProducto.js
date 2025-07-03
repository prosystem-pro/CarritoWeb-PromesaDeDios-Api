const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ClasificacionProducto', {
    CodigoClasificacionProducto: {
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
      },
      unique: "Uq_CaClasificacionProducto_NombreClasificacionProducto"
    },
    NombreClasificacionProducto: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: "Uq_CaClasificacionProducto_NombreClasificacionProducto"
    },
    UrlImagen: {
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
    tableName: 'ClasificacionProducto',
    schema: 'Ca',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaClasificacionProducto_CodigoClasificacionProducto",
        unique: true,
        fields: [
          { name: "CodigoClasificacionProducto" },
        ]
      },
      {
        name: "Uq_CaClasificacionProducto_NombreClasificacionProducto",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
          { name: "NombreClasificacionProducto" },
        ]
      },
    ]
  });
};
