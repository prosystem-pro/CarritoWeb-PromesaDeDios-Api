const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteTiempoPagina', {
    CodigoReporteTiempoPagina: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TiempoPromedio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Fecha: {
      type: DataTypes.DATE,
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
    NombreDiagrama: {
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
    tableName: 'ReporteTiempoPagina',
    schema: 'Re',
    timestamps: false,
    indexes: [
      {
        name: "Pk_ReReporteTiempoPagina_CodigoReporteTiempoPagina",
        unique: true,
        fields: [
          { name: "CodigoReporteTiempoPagina" },
        ]
      },
    ]
  });
};
