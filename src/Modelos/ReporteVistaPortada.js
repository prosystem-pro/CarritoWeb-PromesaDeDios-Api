const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteVistaPortada', {
    CodigoReporteVistaPortada: {
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
    tableName: 'ReporteVistaPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiReporteVistaPortada_CodigoReporteVistaPortada",
        unique: true,
        fields: [
          { name: "CodigoReporteVistaPortada" },
        ]
      },
    ]
  });
};
