import express from 'express'

import {
  Pet,
  Store,
  Good,
} from '../models'

import {
  MESSAGE,
  validate,
} from '../config'

const router = express.Router()

router.post('/use', (req, res) => {

  const { uid, timestamp, token, pet_id, good_id } = req.body
  validate(res, true, uid, timestamp, token, pet_id, good_id)

  const response = async () => {

    const store = await Store.findOne({
      where: {
        user_id: uid, good_id
      }
    })

    if (!store || (store && +store.num <= 1)) {
      return res.json(MESSAGE.NOT_ENOUGH_GOOD)
    }

    await store.decrement('num')

    const good = await Good.findById(good_id)
    const pet = await Pet.findById(pet_id)

    switch (+good.category) {
      case 1: // 饥饿
        await pet.increment({ hunger: +good.effect })
        break
      case 2: // 清洁
        await pet.increment({ cleanness: +good.effect })
        break
      case 3: // 健康
        // 健康药：301
        if (+good.id === 301 && Math.random() > 0.8) {
          await pet.increment({ health: +good.effect })
        }
        // 复活药：302
        if (+good.id === 302) {
          pet.health = 80
          await pet.save()
        }
        break
      case 4: // 心情
        await pet.increment({ health: +good.effect })
        break
      case 5: // 装饰
        break
      default:
        break
    }
    return res.json({ ...MESSAGE.OK, data: pet })
  }

  response()
})

router.get('/info', (req, res) => {
  const { uid, timestamp, token, pet_id } = req.query
  validate(res, true, uid, timestamp, token, pet_id)

  const response = async () => {

    const data = await Pet.findById(pet_id)

    return res.json({ ...MESSAGE.OK, data })
  }

  response()
})

module.exports = router
