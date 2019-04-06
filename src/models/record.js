module.exports = (sequelize, DataTypes) => {

  return sequelize.define('record', {
    'user_id': DataTypes.INTEGER,
    'word_id': DataTypes.INTEGER,
    'remember': DataTypes.INTEGER,
    'mark_time': DataTypes.DOUBLE,
  })
}
