import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function() {
    let res = axios.get(`/cart`)
    return res
  },
  add: function(goodsId) {
    let res = axios.post(`/cart/${goodsId}`)
    return res
  },
  update: function(goodsId,data) {
    let res = axios.put(`/cart/${goodsId}`,data)
    return res
  },
  delete: function(goodsId) {
    let res = axios.delete(`/cart/${goodsId}`)
    return res
  },
}
