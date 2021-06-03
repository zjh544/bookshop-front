<template>
  <div class="cart">
    <el-card shadow="never" class="border-hide" v-if="showCart===1" :body-style="{ padding: '31px 40px' }">
      <!-- 表格 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        :header-cell-style="{'font-size': '18px',color: '#333','font-weight':'normal'}">
        <el-table-column prop="date" align="center" sortable width="1px">
          <template slot-scope="scope" v-if="false">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column width="100px" label="购物车">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.goodsSelected" @change="updateCart(scope.row,$event,null)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center">
          <template slot-scope="scope">
            <a v-bind:href="'/#/detail/'+scope.row.goodsId">
              <el-image :src="scope.row.smallPic"></el-image>
            </a>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <a v-bind:href="'/#/detail/'+scope.row.goodsId">
              <p>{{scope.row.goodsName}}</p>
              <p>{{scope.row.author}} 著</p>
            </a>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.goodsPrice | rounding}}</span>
            <span v-if="scope.row.originalPrice!=null" class="original-price"><i>￥</i>{{scope.row.originalPrice | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.goodsNumber" @change="updateCart(scope.row,null,$event)" :min="1" :max="scope.row.goodsStock"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-delete" circle plain @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="4">
          <div class="cart-total">
            <label><span>应付: </span></label>
            <strong><span class="rmb-symbol">￥</span><span>{{cartTotalPrice | rounding}}</span></strong>
          </div>
          <el-button type="primary" @click="order" class="cart-btn">去结算</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" v-if="showCart===2">
      <div class="cart-empty">
        <div class="cart-empty-content">
          <div class="cart-empty-top"></div>
            <div class="cart-empty-title">
              购物车内还没有图书，赶紧去选购吧~
            </div>
            <el-button type="primary" plain @click="$router.push('/')">返回商城首页</el-button>
          </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Cart from '../api/cart.js'
export default {
  data() {
    return {
      totalPrice:0,
      goodsList: [], // 图书列表
      allChecked: false, // 是否全选
      cartTotalPrice: 0, // 图书总金额
      showCart:0,
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    // 获取购物车列表
    async getCartList() {
      const res = await Cart.list()
      if (res.data.code === 20000) {
        this.renderData(res.data.data.data)
      } else {
        this.$notify({title: '获取购物车失败', message: res.data.message, type: "error" })
      }
    },
    async updateCart(row,selected,number){
      if(selected==null){
        selected = true
      }else if(number==null){
        number = row.goodsNumber
      }
      const res = await Cart.update(row.goodsId, {
        number,
        selected
      })
      if (res.data.code === 20000) {
        this.renderData(res.data.data.data)
      } else {
        this.$notify({title: '更新购物车失败', message: res.data.message, type: "error" })
      }
    },
    async deleteGoods(row){
      const res = await Cart.delete(row.goodsId)
      if (res.data.code === 20000) {
        this.renderData(res.data.data.data)
        this.$notify({title: '成功', message: '删除成功', type: "success" });
      } else {
        this.$notify({title: '更新购物车失败', message: res.data.message, type: "error" })
      }
    },
    // 公共赋值
    renderData(res) {
      this.goodsList = res.cartGoodsVoList || []
      this.allChecked = res.selectedAll
      this.cartTotalPrice = res.cartTotalPrice
      if(this.goodsList.length==0){
        this.showCart=2
      }else{
        this.showCart=1
      }
    },
    // 购物车下单
    order() {
      const isCheck = this.goodsList.every(item => !item.goodsSelected)
      if (isCheck) {
        this.$message.warning('请选择一件图书')
      } else {
        this.$router.push('/trade')
      }
    }
  },
  filters: {
    rounding (value) {
      return value.toFixed(2)
    }
  }
}
</script>

<style lang="less" scope>
.cart{
  width: 1240px;
  margin: 20px auto;
}
.el-table a{
  color: #333;
}
// 去掉table hover高亮
.el-table tbody tr:hover>td { 
  background-color:#fff!important
}
.cart-empty {
  display: table;
  height: 500px;
  width: 100%;
  background-color: #fff;
}
.cart-empty .cart-empty-content {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.cart-empty .cart-empty-top {
  margin: auto;
  width: 100px;
  height: 114px;
  background-image: url(../assets/img/productNotFound-6d88bf93f8.png);
}
.cart-empty .cart-empty-title {
  font-size: 18px;
  font-weight: bolder;
  margin: 20px 0;
  color: #666;
}
.border-hide{
  border: hidden;
}
.original-price{
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}
.cart-total {
  width: 100%;
  display: table;
  padding-bottom: 20px;
  text-align: right;
}
.cart-total label {
  text-align: left;
  display: table-cell;
  color: #666;
  font-size: 14px;
}
.cart-total strong {
  color: #333;
  font-weight: normal;
  font-size: 34px;
  overflow: hidden;
}
.cart-total strong span.rmb-symbol {
  font-size: 21px;
}
.cart-btn{
  width:100%;
  height:60px;
}

/* 布局 */
.row-bg {
  padding: 50px 0 40px 0;
}
</style>