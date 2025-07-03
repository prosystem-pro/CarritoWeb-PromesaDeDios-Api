const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReporteRedSocial', {
    CodigoReporteRedSocial: {
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
    tableName: 'ReporteRedSocial',
    schema: 'Re',
    timestamps: false,
    indexes: [
      {
        name: "Pk_ReReporteRedSocial_CodigoReporteRedSocial",
        unique: true,
        fields: [
          { name: "CodigoReporteRedSocial" },
        ]
      },
    ]
  });
};
