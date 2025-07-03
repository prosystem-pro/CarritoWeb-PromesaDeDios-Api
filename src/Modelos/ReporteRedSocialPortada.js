const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteRedSocialPortada', {
    CodigoReporteRedSocialPortada: {
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
    tableName: 'ReporteRedSocialPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiReporteRedSocialPortada_CodigoReporteRedSocialPortada",
        unique: true,
        fields: [
          { name: "CodigoReporteRedSocialPortada" },
        ]
      },
    ]
  });
};
