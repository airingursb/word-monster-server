import express from 'express'

import {
  User,
  Pet,
  Code,
  Record,
  Store,
  Room,
  Book,
  Good,
  Word
} from '../models'

import md5 from 'md5'

import https from 'https'
import querystring from 'querystring'

import {
  MESSAGE,
  KEY,
  YUNPIAN_APIKEY,
  validate,
  md5Pwd,
} from '../config'

const router = express.Router()

/* users/code */
router.post('/code', (req, res) => {

  const { account } = req.body
  const region = req.query.region || 'china'
  validate(res, false, account)

  const now = Date.now()
  const code = Math.floor(Math.random() * 8999 + 1000)

  const postData = {
    mobile: account,
    text: region === 'china' ? ('【双生日记】您的验证码是' + code) : ('【2Life】Your SMS Verification Code:' + code),
    apikey: YUNPIAN_APIKEY
  }

  const content = querystring.stringify(postData)
  const options = {
    host: 'sms.yunpian.com',
    path: '/v2/sms/single_send.json',
    method: 'POST',
    agent: false,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': content.length
    }
  }

  const model = {
    account,
    code,
    timestamp: now,
    used: false
  }

  const sendMsg = async () => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
    })
    req.write(content)
    req.end()
    return true
  }

  const response = async () => {
    const results = await Code.findAll({ where: { account, used: false } })
    if (results[0] !== undefined) {
      if (now - results[0].timestamp < 600000) {
        return res.json(MESSAGE.REQUEST_ERROR)
      }
    }
    await Code.create(model)
    await sendMsg()
    return res.json({ ...MESSAGE.OK, data: { timestamp: now } })
  }

  response()
})

/* users/register */
router.post('/register', (req, res) => {

  const { account, password, code, timestamp } = req.body
  validate(res, false, account, password, code, timestamp)

  const findCode = async () => {
    return await Code.findOne({ where: { code, timestamp } })
  }

  const response = async () => {
    const code = await findCode()
    if (code) {
      const user = await User.findOne({ where: { account } })
      // TODO: 未知 bug
      // await Code.update({ used: true }, { where: { account, code, timestamp } })
      if (user) {
        return res.json(MESSAGE.USER_EXIST)
      } else {
        // TODO: 注册时送宠物还是以后再送？
        const userinfo = {
          account,
          password: md5(password),
          sex: 0,
          name: account,
          face: 'https://airing.ursb.me/image/twolife/male.png'
        }
        await User.create(userinfo)
        return res.json({ ...MESSAGE.OK, data: userinfo })
      }
    }
    return res.json(MESSAGE.CODE_ERROR)
  }

  response()
})

/* users/login */
router.post('/login', (req, res) => {

  const { account, password } = req.body
  validate(res, false, account, password)

  const response = async () => {
    const user = await User.findOne({ where: { account }, include: [Pet] })
    if (!user) return res.json(MESSAGE.USER_NOT_EXIST)

    if (user.password !== md5(password))
      return res.json(MESSAGE.PASSWORD_ERROR)

    const timestamp = Date.now()
    const token = md5Pwd((user.id).toString() + timestamp.toString() + KEY)

    return res.json({
      ...MESSAGE.OK,
      data: {
        user: { ...user.dataValues, password: 0 },
        key: { uid: user.id, token, timestamp },
      }
    })
  }

  response()
})

/* users/learn */
router.post('/learn', (req, res) => {

  const { uid, timestamp, token, word_id, score } = req.body
  validate(res, true, uid, timestamp, token, word_id, score)

  const response = async () => {

    const record = await Record.findOne({
      where: {
        user_id: uid, word_id
      }
    })

    if (!record) {
      await Record.create({
        user_id: uid, word_id, remember: +score + 50, mark_time: Date.now()
      })
    } else {
      record.mark_time = Date.now()
      await record.save()
      await record.increment({ remember: +score })
    }

    return res.json(MESSAGE.OK)
  }

  response()
})

/* users/buy_good */
router.post('/buy_good', (req, res) => {

  const { uid, timestamp, token, good_id } = req.body
  validate(res, true, uid, timestamp, token, good_id)

  const response = async () => {

    const good = await Good.findById(good_id)

    const user = await User.findById(uid)

    if (+user.coins < +good.price) {
      return res.json(MESSAGE.NOT_ENOUGH_MONEY)
    }

    await user.decrement({ 'coins': +good.price })

    const store = await Store.findOne({
      where: {
        user_id: uid, good_id
      }
    })

    if (!store) {
      await Store.create({
        user_id: uid,
        good_id,
        num: 1
      })
    } else {
      await store.increment('num')
    }

    return res.json(MESSAGE.OK)
  }

  response()
})

/* users/buy_book */
router.post('/buy_book', (req, res) => {

  const { uid, timestamp, token, book_id } = req.body
  validate(res, true, uid, timestamp, token, book_id)

  const response = async () => {

    const book = await Book.findById(book_id)

    const user = await User.findById(uid)

    if (+user.coins < +book.price) {
      return res.json(MESSAGE.NOT_ENOUGH_MONEY)
    }

    await user.decrement({ 'coins': +book.price })

    const room = await Room.findOne({
      where: {
        user_id: uid, book_id
      }
    })

    if (!room) {
      await Room.create({
        user_id: uid,
        book_id,
      })
    } else {
      return res.json(MESSAGE.ALREADY_HAVE_BOOK)
    }
    return res.json(MESSAGE.OK)
  }

  response()
})

/* users/books */
router.get('/books', (req, res) => {

  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    // const books = await Book.findAll({ attributes: ['id', 'name', 'category', 'price', 'pic', 'word_count', 'description'] })

    const books = await Book.findAll()

    return res.json({ ...MESSAGE.OK, data: books })
  }

  response()
})

/* users/goods */
router.get('/goods', (req, res) => {

  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const data = await Good.findAll()
    return res.json({ ...MESSAGE.OK, data })
  }

  response()
})

/* users/records */
router.get('/records', (req, res) => {

  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const data = await Record.findAll({
      where: {
        user_id: uid
      },
      include: [Word]
    })
    return res.json({ ...MESSAGE.OK, data })
  }

  response()
})

/* users/words */
router.get('/words', (req, res) => {

  const { uid, timestamp, token, book_id } = req.query
  validate(res, true, uid, timestamp, token, book_id)

  const response = async () => {
    const data = await Word.findAll({
      where: {
        book_id
      }
    })
    return res.json({ ...MESSAGE.OK, data })
  }

  response()
})

module.exports = router
