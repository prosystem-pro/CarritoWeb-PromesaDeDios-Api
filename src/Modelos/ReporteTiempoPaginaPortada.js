const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteTiempoPaginaPortada', {
    CodigoReporteTiempoPaginaPortada: {
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
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ReporteTiempoPaginaPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiReporteTiempoPaginaPortada_CodigoReporteTiempoPaginaPortada",
        unique: true,
        fields: [
          { name: "CodigoReporteTiempoPaginaPortada" },
        ]
      },
    ]
  });
};
