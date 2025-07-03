const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteVista', {
    CodigoReporteVista: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NombreDiagrama: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    DireccionIp: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Navegador: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ReporteVista',
    schema: 'Re',
    timestamps: false,
    indexes: [
      {
        name: "Pk_ReReporteVista_CodigoReporteVista",
        unique: true,
        fields: [
          { name: "CodigoReporteVista" },
        ]
      },
    ]
  });
};
