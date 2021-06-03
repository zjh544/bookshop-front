<template>
  <div class="pay">
    <el-card shadow="never" :body-style="{ padding: '32px 40px 100px 40px' }">
      <div class="pay-header">
        <img class="pay-header-img" src="../assets/img/shp-payment-symbol-b94617dda7.png"/>
        <div class="pay-header-title">
          <p>订单已提交，等待付款 <i data-price="5999.00">￥{{orders.price}}</i></p>
          <!-- <span> 30分钟内未付款将自动取消订单</span> -->
          <span>请尽快支付</span>
        </div>
      </div>
      <el-divider></el-divider>
      <label class="pay-left">配送信息</label>
      <el-card shadow="never" class="address" :body-style="{ padding: '40px 20px' }">
        <p>
          <span class="address-name">{{addressVo.name}}</span>
          <span class="address-phone">{{addressVo.phone}}</span>
        </p>
        <div class="detail">
          <p>{{addressCodeToText(addressVo.area)}} {{addressVo.detail}}</p>
        </div>
      </el-card>
      <el-divider></el-divider>
      <label class="pay-left">图书清单<!-- vbsoft 地址选择页 --></label>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="orderGoodsList"
        style="width: 1040px"
        :show-header="false"
        :header-cell-style="{'font-size': '18px',color: '#333','font-weight':'normal'}">
        <el-table-column width="120px" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.goodsPic"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.goodsPrice | rounding}}</span>
            <span v-if="scope.row.originalPrice!=null" class="original-price"><i>￥</i>{{scope.row.originalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            ×{{scope.row.goodsNumber}}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <label class="alipay-title">支付平台</label>
      <el-card shadow="never" class="alipay-btn" :body-style="{ padding: '0px' }" @click.native="toAlipay()">
        <i class="alipay-icon iconfont icon-alipay"></i>
        <span>支付宝</span>
      </el-card>
    </el-card>
    <!-- 订单已提交，等待付款￥{{orders.price}}
    <el-divider></el-divider>
    订单详情{{addressVo.name}}{{addressVo.phone}}{{addressCodeToText(addressVo.area)}}{{orderGoodsList[0].goodsName}}
    <el-divider></el-divider>
    支付平台
    <el-divider></el-divider> -->
  </div>
</template>

<script>
import { CodeToText } from 'element-china-area-data'
import Orders from '../api/orders.js'
export default {
  data() {
    return {
      orderNo:this.$route.query.orderNo,
      addressVo: '', // 收货人地址
      orders: '', // 订单
      orderGoodsList: []
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    async getOrder() {
      console.log(this.orderNo)
      const res = await Orders.payOrder(this.orderNo)
      if (res.data.code === 20000) {
        this.orders=res.data.data.vo.orders
        this.orderGoodsList=res.data.data.vo.orderGoodsList
        this.addressVo=res.data.data.vo.addressVo
      } else {
        this.$notify({title: '获取订单失败', message: res.data.message, type: "error" });
      }
    },
    addressCodeToText(code) {
      return CodeToText[code[0]]+CodeToText[code[1]]+CodeToText[code[2]]
    },
    toAlipay(){
      this.$router.push({
        path:'/alipay',
        query:{
          orderNo:this.orderNo
        }
      })
    }
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
.pay{
  width: 1240px;
  margin: auto;
}
.pay-header {
  padding: 20px 0 30px;
}
.pay-header-img {
  float: left;
  padding-left: 26%;
  padding-right: 25px;
}
.pay-header-title {
  padding-top: 25px;
}
.pay-header-title p {
  font-size: 26px;
}
.pay-header-title span {
  padding-top: 15px;
  color: #A0A0A0;
  display: block;
  font-size: 14px;
}
.pay-left{
  float: left;
  padding-top: 10px;
  min-width: 116px;
  font-size: 18px;
}
.address {
  width: 236px;
  overflow: hidden;
}
.address-name,.address-phone {
  font-size: 16px;
  color: #333;
}
.address-phone{
  padding-left: 16px;
}
.detail{
  padding-top: 20px;
  overflow: hidden;
}
.detail p{
  display: inline;
  font-size: 14px;
  color: #666;
}
.alipay-title {
  width: 115px;
  line-height: 44px;
  font-size: 18px;
  color: #333;
  float: left;
}
.alipay-btn{
  width: 236px;
  padding: 5px 0;
}
.alipay-btn:hover{
  border: 1px solid #409EFF;
  cursor:pointer;
}
.alipay-btn span{
  font-size: 16px;
  vertical-align: 32%;
}
.alipay-icon{
  color: #00a2eb;
  font-size: 32px;
  margin-right: 10px;
  margin-left: 72px;
}
// 去掉table hover高亮
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
</style>