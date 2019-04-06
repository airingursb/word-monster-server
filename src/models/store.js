module.exports = (sequelize, DataTypes) => {

  return sequelize.define('store', {
    'user_id': DataTypes.INTEGER,
    'good_id': DataTypes.INTEGER,
    'num': DataTypes.INTEGER,
  })
}
