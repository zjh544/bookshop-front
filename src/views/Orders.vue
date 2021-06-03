<template>
  <div class="orders">
    <div>
      <el-card shadow="never" v-for="item in userOrders" :key="item.orders.id" class="orders-box" :body-style="{ padding: '0px' }">
        <div class="orders-content orders-order">
          <div class="orders-header">
            <span class="orders-no">
              订单号：
              <a v-bind:href="'/#/orders/'+item.orders.orderNo">{{item.orders.orderNo}}</a>
            </span>
            <el-divider direction="vertical"></el-divider>
            <span class="orders-date">{{item.orders.createTime|dateFormat}}</span>
            <strong class="orders-state">{{item.orders.state|toState}}</strong>
          </div>
          <el-divider></el-divider>
          <div class="orders-goods">
            <label class="orders-goods-title">图书清单</label>
            <div class="orders-goods-list">
              <!-- 表格 -->
              <el-table
                ref="multipleTable"
                :data="item.orderGoodsList"
                :show-header="false"
                :header-cell-style="{'font-size': '18px',color: '#333','font-weight':'normal'}">
                <el-table-column width="120px" align="center">
                  <template slot-scope="scope">
                    <a v-bind:href="'/#/detail/'+scope.row.goodsId">
                      <el-image :src="scope.row.goodsPic"></el-image>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <a v-bind:href="'/#/detail/'+scope.row.goodsId">
                      <p>{{scope.row.goodsName}}</p>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <p>￥{{scope.row.goodsPrice | rounding}}</p>
                  </template>
                </el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    ×{{scope.row.goodsNumber}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="orders-total">
            <div class="orders-total">
              <label class="orders-total-title">
              <span>订单金额</span>
            </label>
            <span class="orders-total-price">￥{{item.orders.price | rounding}}</span>
            </div>
            <div v-if="item.orders.state==0" class="unpaid">
              <el-button type="info" style="width: 116px;height: 38px" @click="cancelOrder(item.orders.id)">取消订单</el-button>
              <el-button type="primary" style="width: 116px;height: 38px" @click="toAlipay(item.orders.orderNo)">立即支付</el-button>
            </div>
          </div>
          <!-- <div class="unpaid">
            <el-button type="primary">主要按钮</el-button>
            <el-button type="info">信息按钮</el-button>
          </div> -->
        </div>
        <!-- 分隔条 -->
        <div class="split-bar"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Orders from '../api/orders.js'
export default {
  data(){
    return{
      userOrders:[],
    }
  },
  created() {
    this.getUserOrders()
  },
  methods:{
    async getUserOrders() {
      const res = await Orders.userOrders()
      if (res.data.code === 20000) {
        this.userOrders = res.data.data.list
      } else {
        this.$notify({title: '获取订单失败', message: res.data.message, type: "error" });
      }
    },
    //取消订单
    async cancelOrder(id){
      const res = await Orders.cancelOrder(id)
      if (res.data.code === 20000) {
        this.$notify({title: '成功', message: '取消订单成功', type: "success" });
        this.getUserOrders()
      } else {
        this.$notify({title: '取消订单失败', message: res.data.message, type: "error" });
      }
    },
    toAlipay(orderNo){
      this.$router.push({
        path:'/alipay',
        query:{
          orderNo:orderNo
        }
      })
    }
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    },
    toState (value) {
      var state
      if(value==0){
        state='未支付'
      }
      if(value==1){
        state='已支付'
      }
      if(value==2){
        state='已取消'
      }
      return state
    }
  }
}
</script>

<style lang="less" scoped>
.orders{
  background-color: #fff;
}
.split-bar{
  height: 20px;
  background-color: #f4f4f4;
}
.orders-box{
  border: none;
}
.orders-content {
  padding: 42px;
}
.orders-header {
  position: relative;
}
span.orders-no {
  padding-right: 12px;
  font-size: 15px;
}
span.orders-no a {
  color: #409EFF;
}
.orders-header span {
  vertical-align: middle;
  line-height: 18px;
}
.orders-header span.orders-date {
  padding-left: 12px;
  color: #A0A0A0;
  font-size: 15px;
}
.orders-state {
  font-weight: normal;
  position: absolute;
  right: 0;
  font-size: 18px;
}
.orders-goods {
  display: flex;
}
.orders-goods-title {
  line-height: 60px;
  min-width: 114px;
  color: #666;
  font-size: 15px;
}
.orders-goods-list {
  flex: 1;
}
// 去掉table hover高亮
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
.el-table a{
  color: #333;
}
.orders-total {
  display: flex;
  width: 100%;
}
.orders-total-title {
  width: 100px;
  color: #666;
  font-size: 15px;
}
.orders-total-price {
  font-size: 16px;
}
.unpaid{
  flex: 1;
  display: flex;
}
</style>