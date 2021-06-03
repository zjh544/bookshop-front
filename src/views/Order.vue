<template>
  <div class="order">
    <div class="acc-col">
      <img class="shp-pm-img" src="../assets/img/shp-payment-symbol-b94617dda7.png"/>
      <div class="acc-ordt-text">
        <h2>{{orders.state|toState}}</h2>
        <p>
          订单号：{{orders.orderNo}}
          <span class="acc-ordt-date">{{orders.createTime|dateFormat}}</span>
        </p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="acc-row" v-if="orders.state==1">
      <label class="shp-chout-col1">物流信息</label>
      <div class="express-detail" v-if="orders.expressId==null">未发货</div>
      <div v-if="orders.expressId!=null">
        <div class="track-tpl-title">
          <el-image class="track-tpl-title-icon" :src="express.pic"></el-image>
          <div class="track-tpl-title-content">
            <p class="text-sm text-black">
            物流公司：{{express.name}}
            </p> 
            <p class="text-sm text-black">
            快递单号：{{orders.expressNo}}
            </p>
            <p class="text-sm text-black">
            发货时间：{{orders.deliveryTime|dateFormat}}
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-divider v-if="orders.state==1"></el-divider>
    <div class="acc-row">
      <label class="shp-chout-col1">配送信息</label>
      <el-card shadow="never" class="shp-checkout-address" :body-style="{ padding: '40px 20px' }">
        <p>
          <span class="address-receiver">{{addressVo.name}}</span>
          <span class="address-mobile">{{addressVo.phone}}</span>
        </p>
        <div class="details">
          <p class="detail">{{addressCodeToText(addressVo.area)}} {{addressVo.detail}}</p>
        </div>
      </el-card>
    </div>
    <el-divider></el-divider>
    <div class="acc-row">
      <label class="shp-chout-col1">图书清单<!-- vbsoft 地址选择页 --></label>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="orderGoodsList"
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
    <el-divider></el-divider>
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="6">
        <div class="shp-cartbar-total">
          <div class="cartbar-tota-price">
              <label><span>订单金额: </span></label>
              <strong><span class="rmb-symbol">￥</span><span id="List_Total_Price">{{orders.price | rounding}}</span></strong>
          </div>
        </div>
        <div v-if="orders.state==0">
          <el-button type="info" style="width: 116px;height: 38px" @click="cancelOrder()">取消订单</el-button>
          <el-button type="primary" style="width: 116px;height: 38px">立即支付</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Orders from '../api/orders.js'
import { CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      orderNo: this.$route.params.orderNo,
      addressVo: '', // 收货人地址
      orders: '', // 订单
      orderGoodsList: [],
      express:''
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    async getOrder() {
      const res = await Orders.getOrder(this.orderNo)
      if (res.data.code === 20000) {
        this.orders=res.data.data.vo.orders
        this.orderGoodsList=res.data.data.vo.orderGoodsList
        this.addressVo=res.data.data.vo.addressVo
        this.express=res.data.data.vo.express
      } else {
        this.$notify({title: '获取订单失败', message: res.data.message, type: "error" });
      }
    },
    addressCodeToText(code) {
      // var code=val.split(", ")
      return CodeToText[code[0]]+CodeToText[code[1]]+CodeToText[code[2]]
    },
    //取消订单
    async cancelOrder(){
      const res = await Orders.cancelOrder(this.orders.id)
      if (res.data.code === 20000) {
        this.$notify({title: '成功', message: '取消订单成功', type: "success" });
        this.getOrder()
      } else {
        this.$notify({title: '取消订单失败', message: res.data.message, type: "error" });
      }
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
.order{
  background-color: #fff;
  padding: 42px;
}
.acc-col {
  padding-top: 20px;
  display: flex;
  align-items: flex-end;
}
.shp-pm-img{
  width: 100px;
  height: 68px;
}
.acc-ordt-text {
  margin-left: 24px;
}
.acc-ordt-text h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #409EFF;
  font-weight: normal;
}
.acc-ordt-text p {
  line-height: 1;
  font-size: 14px;
}
.acc-ordt-date {
  color: #A0A0A0;
  margin-left: 122px;
  font-size: 14px;
}
.acc-row {
  display: flex;
  width: 100%;
}
.shp-chout-col1{
  height: 60px;
  line-height: 60px;
  width: 114px;
  min-width: 114px;
  color: #666;
  font-size: 14px;
}
.shp-checkout-address {
  width: 236px;
  overflow: hidden;
}
.address-receiver,.address-mobile {
  font-size: 16px;
  color: #333;
}
.address-mobile{
  padding-left: 16px;
}
.details{
  padding-top: 20px;
  overflow: hidden;
}
.detail{
  display: inline;
  font-size: 14px;
  line-height: 1.4;
  color: #666;
}
// 去掉table hover高亮
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
.el-table a{
  color: #333;
}
.row-bg {
  padding: 50px 0 20px 0;
}
.shp-cartbar-total {
  text-align: right;
}
.shp-cartbar-total .cartbar-tota-price {
  width: 100%;
  display: table;
  padding-bottom: 20px;
}
.shp-cartbar-total .cartbar-tota-price label {
  text-align: left;
  display: table-cell;
  color: #666;
  font-size: 16px;
}
.shp-cartbar-total .cartbar-tota-price strong {
  color: #333;
  font-weight: normal;
  font-size: 34px;
  display: table-cell;
  white-space: nowrap;
  overflow: hidden;
}
.express-detail{
  line-height: 60px;
  font-size: 14px;
}
.express-detail span{
  padding-right: 20px;
}
.track-tpl-title {
  padding: .4rem .8rem;
  display: flex;
  align-items: center;
}
.track-tpl-title-icon {
  display: block;
  width: 60px;
  height: 60px;
}
.track-tpl-title-content {
  -webkit-box-flex: 1;
  flex: 1;
  padding-left: 15px;
}
.text-sm {
  font-size: 14px;
  line-height: 1.7;
}
</style>