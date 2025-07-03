const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EmpresaPortada', {
    CodigoEmpresaPortada: {
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
    ColorNombreEmpresa: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorFondoNombreEmpresa: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenPortada: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenPortadaIzquierdo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    UrlImagenPortadaDerecho: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    TitutloQuienesSomos: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTituloQuienesSomos: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    DescripcionQuienesSomos: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    ColorDescripcionQuienesSomos: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    TituloMision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTituloMision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    DescripcionMision: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    ColorDescripcionMision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenMision: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    TituloVision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ColorTituloVision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    DescripcionVision: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    ColordescripcionVision: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    UrlImagenVision: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ColorEslogan: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    Urlvideo: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    Estatus: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'EmpresaPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_AdEmpresaPortada_CodigoEmpresaPortada",
        unique: true,
        fields: [
          { name: "CodigoEmpresaPortada" },
        ]
      },
    ]
  });
};
