import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(queryInfo) {
    let res = axios.get(`/goods/index/${queryInfo.currPage}/${queryInfo.pageSize}`, { params: { query: queryInfo.search } })
    return res
  },
  getGoodsByCat: function(queryInfo) {
    let res = axios.get(`/goods/cat/${queryInfo.currPage}/${queryInfo.pageSize}`, { params: { query: queryInfo.search } })
    return res
  },
  detail: function(goodsId) {
    let res = axios.get(`/goods/${goodsId}`)
    return res
  },
}
