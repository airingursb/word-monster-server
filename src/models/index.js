const db = require('../config/sequelize').dbConnect()

// 模型文档：https://www.yuque.com/oh-bear/elephant-fridge/models

const User = db.import('./user')
const Book = db.import('./book')
const Word = db.import('./word')
const Pet = db.import('./pet')
const Good = db.import('./good')
const Store = db.import('./store')
const Room = db.import('./room')
const Record = db.import('./record')

User.hasOne(Pet, { foreignKey: 'user_id' })
Pet.belongsTo(User)

Book.hasMany(Word, { foreignKey: 'book_id'})
Word.belongsTo(Book)

User.belongsToMany(Good, { through: Store, foreignKey: 'user_id'})
Good.belongsToMany(User, { through: Store, foreignKey: 'good_id'})

User.belongsToMany(Book, { through: Room, foreignKey: 'user_id'})
Book.belongsToMany(User, { through: Room, foreignKey: 'book_id'})

Word.belongsTo(User, { through: Record, foreignKey: 'word_id'})
User.belongsTo(Word, { through: Record, foreignKey: 'user_id'})

db.sync()

module.exports = {
  User,
  Book,
  Word,
  Pet,
  Good,
  Store,
  Room,
  Record
}
