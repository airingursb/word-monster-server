import md5 from 'md5'

export const MESSAGE = {
  OK: {
    code: 0,
    message: '请求成功',
  },
  PASSWORD_ERROR: {
    code: 300,
    message: '密码错误',
  },
  USER_EXIST: {
    code: 302,
    message: '用户已存在',
  },
  TOKEN_ERROR: {
    code: 403,
    message: 'TOKEN失效',
  },
  USER_NOT_EXIST: {
    code: 404,
    message: '用户不存在',
  },
  CODE_ERROR: {
    code: 405,
    message: '验证码错误',
  },
  PARAMETER_ERROR: {
    code: 422,
    message: '参数错误',
  },
  REQUEST_ERROR: {
    code: 501,
    message: '请求失败',
  },
  QUICK_REQUEST: {
    code: 502,
    message: '请求间隔过短',
  },
}

export const KEY = ''
export const SQL_USER = ''
export const SQL_PASSWORD = ''
export const YUNPIAN_APIKEY = '' // 云片APIKEY
export const QINIU_ACCESS = '' // 七牛ACCESS
export const QINIU_SECRET = '' // 七牛SECRET
export const BUCKET = '' // 七牛BUCKET
export const ADMIN_USER = ''
export const ADMIN_PASSWORD = ''
export const NLP_ID = ''
export const NLP_SECRET = ''
export const WXP_APPID = '' // 小程序 ID
export const WXP_SECRET = '' // 小程序 KEY
export const WX_APP_APPID = '' // 开放平台 APP ID
export const WX_APP_APPSECRET = '' // 开放平台 APPSECRET
export const GITHUB_TOKEN = '' // Github token

export const IS_CHECKING = false

export const md5Pwd = (password) => {
  const salt = ''
  return md5(md5(password + salt))
}

export const validate = (res, check, ...params) => {

  for (let param of params) {
    if (typeof param === 'undefined' || param === null) {
      return res.json(MESSAGE.PARAMETER_ERROR)
    }
  }

  if (check) {
    const uid = params[0]
    const timestamp = params[1]
    const token = params[2]

    if (token !== md5Pwd(uid.toString() + timestamp.toString() + KEY))
      return res.json(MESSAGE.TOKEN_ERROR)
  }
}
