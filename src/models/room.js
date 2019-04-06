module.exports = (sequelize, DataTypes) => {

  return sequelize.define('room', {
    'user_id': DataTypes.INTEGER,
    'book_id': DataTypes.INTEGER,
  })
}
