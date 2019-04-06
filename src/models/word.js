module.exports = (sequelize, DataTypes) => {

  return sequelize.define('word', {
    'name': DataTypes.STRING(50),
    'content': DataTypes.STRING(250),
    'book_id': DataTypes.INTEGER,
    'appear_times': DataTypes.INTEGER,
    'wrong_times': DataTypes.INTEGER,
    'wrong_rate': DataTypes.DOUBLE,
  })
}
