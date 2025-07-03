const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProductoPortada', {
    CodigoProductoPortada: {
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
    TextoBuscador: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    UrlImagenNavbar: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    TituloPortada: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorTituloPortada: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorFondoTItuloPortada: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorIconoRegresar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorIconoBasurero: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorIconoAgregar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    TextoAgregar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorTextoAgregar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorBotonAgregar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    UrlImagenCarrito: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    TextoRegresar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorTextoRegresar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorBotonRegresar: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    TextoIr: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    ColorTextoIr: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorFondoIr: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ColorFondoBotones: {
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
    tableName: 'ProductoPortada',
    schema: 'Ui',
    timestamps: false,
    indexes: [
      {
        name: "Pk_CaProductoPortada_CodigoProductoPortada",
        unique: true,
        fields: [
          { name: "CodigoProductoPortada" },
        ]
      },
    ]
  });
};
