module.exports = (sequelize, DataTypes) => {

  return sequelize.define('pet', {
    'user_id': DataTypes.INTEGER,
    'name': DataTypes.STRING(45),
    'pic': DataTypes.TEXT,
    'hunger': DataTypes.INTEGER,
    'cleanness': DataTypes.INTEGER,
    'health': DataTypes.INTEGER,
    'happiness': DataTypes.INTEGER,
  })
}
