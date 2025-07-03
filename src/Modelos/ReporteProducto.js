const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteProducto', {
    CodigoReporteProducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoProducto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Producto',
        key: 'CodigoProducto'
      }
    },
    CantidadVendida: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DireccionIp: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Navegador: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CodigoSolicitud: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ReporteProducto',
    schema: 'Re',
    timestamps: false,
    indexes: [
      {
        name: "Pk_ReReporteProducto_CodigoReporteProducto",
        unique: true,
        fields: [
          { name: "CodigoReporteProducto" },
        ]
      },
    ]
  });
};
