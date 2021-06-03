let baseURL = ''
switch (process.env.NODE_ENV) {
  case 'production':
    baseURL = 'http://47.106.245.151:18080/bookshop'
    break
  case 'development':
    baseURL = 'http://47.106.245.151:18080/bookshop'
    break
  default:
    baseURL = 'http://47.106.245.151:18080/bookshop'
    break
}

export default {
  baseURL
}
