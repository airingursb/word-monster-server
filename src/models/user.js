module.exports = (sequelize, DataTypes) => {

  return sequelize.define('user', {
    'account': DataTypes.STRING(45),
    'password': DataTypes.STRING(125),
    'name': DataTypes.STRING(25),
    'sex': DataTypes.INTEGER,
    'coins': DataTypes.INTEGER,
    'face': DataTypes.STRING(125),
    'check_times': DataTypes.INTEGER,
    'check_days': DataTypes.INTEGER,
  })
}
