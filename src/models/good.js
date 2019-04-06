module.exports = (sequelize, DataTypes) => {

  return sequelize.define('good', {
    'name': DataTypes.STRING(45),
    'category': DataTypes.INTEGER,
    'price': DataTypes.INTEGER,
    'pic': DataTypes.INTEGER,
    'effect': DataTypes.INTEGER,
    'description': DataTypes.STRING(250),
  })
}
