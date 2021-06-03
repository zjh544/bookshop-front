import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  alipay: function(data) {
    let res = axios.post(`/pay`,{orderNo:data})
    return res
  },
}
