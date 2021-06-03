import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function() {
    let res = axios.get(`/address`)
    return res
  },
  add: function(data) {
    let res = axios.post(`/address`,data)
    return res
  },
  update: function(data) {
    let res = axios.put(`/address`,data)
    return res
  },
  delete: function(id) {
    let res = axios.delete(`/address/${id}`)
    return res
  },
}
