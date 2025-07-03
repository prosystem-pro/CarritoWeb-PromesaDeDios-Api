const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AlertaEstilo', {
    CodigoAlertaEstilo: {
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
      unique: "Uq_UiAlertaEstilo_TipoAlerta"
    },
    TipoAlerta: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: "Uq_UiAlertaEstilo_TipoAlerta"
    },
    Icono: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    ColorFondo: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorTexto: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    Texto: {
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
    tableName: 'AlertaEstilo',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiAlertaEstilo_CodigoAlertaEstilo",
        unique: true,
        fields: [
          { name: "CodigoAlertaEstilo" },
        ]
      },
      {
        name: "Uq_UiAlertaEstilo_TipoAlerta",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
          { name: "TipoAlerta" },
        ]
      },
    ]
  });
};
