const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactanosPortada', {
    CodigoContactanosPortada: {
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
      unique: "Uq_UiContactanosPortada_NombreContactanosPortada"
    },
    NombreContactanosPortada: {
      type: DataTypes.STRING(32),
      allowNull: true,
      unique: "Uq_UiContactanosPortada_NombreContactanosPortada"
    },
    ColorNombreContactanosPortada: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFondoNombreContactanosPortada: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorContornoNombreContactanosPortada: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenContactanosPortada: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ColorFondoRedSocial: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorContornoRedSocial: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoRedSocial: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorIconoAgregar: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TextoComoLlegar: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTextoComoLlegar: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorBotonComoLlegar: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenHorario: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlMapaComoLlegar: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlMapa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ContactanosPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_UiContactanosPortada_CodigoContactanosPortada",
        unique: true,
        fields: [
          { name: "CodigoContactanosPortada" },
        ]
      },
      {
        name: "Uq_UiContactanosPortada_NombreContactanosPortada",
        unique: true,
        fields: [
          { name: "CodigoEmpresa" },
          { name: "NombreContactanosPortada" },
        ]
      },
    ]
  });
};
