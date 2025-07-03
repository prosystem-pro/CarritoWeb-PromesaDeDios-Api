const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AlertaEstiloBoton', {
    CodigoAlertaEstiloBoton: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodigoAlertaEstilo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'AlertaEstilo',
        key: 'CodigoAlertaEstilo'
      }
    },
    TextoBoton: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorTextoBoton: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorBoton: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'AlertaEstiloBoton',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiAlertaEstiloBoton_CodigoAlertaEstiloBoton",
        unique: true,
        fields: [
          { name: "CodigoAlertaEstiloBoton" },
        ]
      },
    ]
  });
};
