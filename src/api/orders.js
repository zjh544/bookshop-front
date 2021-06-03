import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  getOrder: function(data) {
    let res = axios.get(`/orders/${data}`)
    return res
  },
  submitOrder: function(data) {
    let res = axios.post(`/orders`,data)
    return res
  },
  userOrders: function() {
    let res = axios.get(`/orders/user`)
    return res
  },
  payOrder: function(data) {
    let res = axios.get(`/orders/${data}`)
    return res
  },
  cancelOrder: function(data) {
    let res = axios.get(`/orders/cancel/${data}`)
    return res
  },
}
