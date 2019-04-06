const Sequelize = require('sequelize')

const SQL_USER = 'root' // 数据库用户账号
const SQL_PASSWORD = '' // 数据库用户密码

exports.dbConnect = function() {
  return new Sequelize('feedme', SQL_USER, SQL_PASSWORD,
    {
      'dialect': 'mysql',
      'dialectOptions': {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      'host': 'localhost',
      'port': 3306,
      'define': {
        'underscored': true // 字段以下划线（_）来分割（默认是驼峰命名风格）
      }
    }
  )
}
