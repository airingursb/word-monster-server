module.exports = (sequelize, DataTypes) => {

  return sequelize.define('book', {
    'name': DataTypes.STRING(45),
    'category': DataTypes.STRING(50),
    'price': DataTypes.INTEGER,
    'pic': DataTypes.STRING(125),
    'chapter': DataTypes.TEXT,
    'content': DataTypes.TEXT,
    'word_count': DataTypes.INTEGER,
    'description': DataTypes.STRING(500),
  })
}
