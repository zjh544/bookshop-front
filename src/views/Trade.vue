<template>
  <div class="trade">
    <el-card shadow="never" class="border-hide" :body-style="{ padding: '30px 40px' }">
      <div class="display-flex">
        <label class="left-title">配送信息</label>
        <div class="flex1">
          <!-- 地址 -->
          <el-row>
            <el-col :span="7" v-for="(item,index) in addressList" :key="item.id">
              <el-card shadow="never" @click.native="setAddressId(item.id)" :class="{'click-border':addressId==item.id}" class="select-address" :body-style="{ padding: '40px 20px' }">
                <p>
                  <span class="address-receiver">{{item.name}}</span>
                  <span class="address-mobile">{{item.phone}}</span>
                </p>
                <div class="details">
                  <p class="detail">{{addressCodeToText(item.area)}} {{item.detail}}</p>
                </div>
                <i class="icon edit-icon iconfont icon-jianyi" @click="editAddressDialog(item)"></i>
              </el-card>
            </el-col>
            <el-col :span="7">
              <el-card shadow="never" class="select-address" :body-style="{ padding: '40px 20px' }" @click.native="addDialogVisible = true; addressDialogTitle = '添加地址'">
                <p class="add-address"><i class="add-icon iconfont icon-add"></i>添加新地址</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <!-- 分隔条 -->
    <div class="split-bar"></div>

    <el-card shadow="never" class="border-hide" :body-style="{ padding: '31px 40px' }">
      <div class="display-flex">
        <label class="left-title">图书清单</label>
        <div class="flex1">
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="selectedGoodsList"
            :show-header="false"
            :header-cell-style="{'font-size': '18px',color: '#333','font-weight':'normal'}">
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
                <span v-if="scope.row.originalPrice!=null" class="original-price"><i>￥</i>{{scope.row.originalPrice}}</span>
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
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="4">
          <div class="trade-total">
            <label><span>应付: </span></label>
            <strong><span class="rmb-symbol">￥</span><span id="List_Total_Price">{{cartTotalPrice | rounding}}</span></strong>
          </div>
          <el-button type="primary" @click="orderSubmit" class="cart-btn">提交订单</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加地址模态框 -->
    <el-dialog
      :title="addressDialogTitle"
      :visible.sync="addDialogVisible"
      width="50%" @close="resetForm('addressForm')">
      <el-form label-width="120px" :model="addressForm" :rules="rules" ref="addressForm">
        <el-form-item prop="id" label="ID：" hidden>
          <el-input v-model="addressForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名：">
          <el-input v-model="addressForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="addressForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="area" label="地区：">
            <el-cascader
              size="large"
              :options="options"
              v-model="addressForm.area"
              placeholder="请选择">
            </el-cascader>
        </el-form-item>
        <el-form-item prop="detail" label="详细地址：">
          <el-input v-model="addressForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddress()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
import { regionData,CodeToText } from 'element-china-area-data'
import Address from '../api/address.js'
import Cart from '../api/cart.js'
import Orders from '../api/orders.js'
export default {
  data () {
    var validateMobile = (rule, value, cb) => {
      if (/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        return cb()
      }
      cb(new Error('请填入正确格式的手机号'))
    }
    return {
      options: regionData,
      addressList: [], // 地址列表
      addressDialogTitle:'添加地址',
      addDialogVisible: false, // 添加地址框是否可见
      addressAdd:true,
      addressForm: {
        id: '',
        name: '',
        phone: '',
        area: [],
        detail: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' },
        ],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      selectedGoodsList: [], // 图书列表
      cartTotalPrice: 0.00, // 图书总金额
      count:0,
      addressId:''
    }
  },
  created() {
    this.getAddressList()
    this.getSelectedGoodsList()
  },
  methods: {
    async getSelectedGoodsList() {
      var res = await Cart.list()
      if (res.data.code === 20000) {
        res = res.data.data.data
        const list = res.cartGoodsVoList// 获取购物车中所有图书数据
        this.cartTotalPrice = res.cartTotalPrice// 图书总金额
        this.selectedGoodsList = list.filter(item => item.goodsSelected)
        this.selectedGoodsList.map((item) => {
          this.count += item.goodsNumber
        })
      } else {
        this.$notify({title: '获取选中图书失败', message: res.data.message, type: "error" })
      }
    },
    addressCodeToText(code) {
      var address=''
      code.forEach(element => {
        address=address+CodeToText[element]+' '
      });
      return address
    },
    // 获取地址列表
    async getAddressList() {
      const res = await Address.list()
      if (res.data.code === 20000) {
        this.addressList = res.data.data.list
      } else {
        this.$notify({title: '获取地址失败', message: res.data.message, type: "error" })
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.addressForm.id=''
      this.addressForm.name=''
      this.addressForm.phone=''
      this.addressForm.area=''
      this.addressForm.detail=''
    },
    // 添加/编辑地址
    addAddress () {
      this.$refs.addressForm.validate(async valid => {
        if (valid) {
          let res = {}
          if (this.addressAdd) {
            res = await Address.add(this.addressForm)
          } else {
            res = await Address.update(this.addressForm)
          }
          if (res.data.code === 20000) {
            this.$notify({title: '成功', message: this.addressAdd ? '添加地址成功' : '编辑地址成功', type: "success" });
            this.addDialogVisible = false
            this.getAddressList()
          } else {
            this.$notify({title: '失败', message: this.addressAdd ? '添加地址失败' : '编辑地址失败', type: "error" })
          }
        }
      })
    },
    // 地址编辑框
    editAddressDialog (row) {
      this.addDialogVisible = true
      this.addressAdd = false
      this.addressDialogTitle = '编辑地址'
      let temp = JSON.parse(JSON.stringify(row))
      this.addressForm = {
        id: temp.id,
        name: temp.name,
        phone: temp.phone,
        area: temp.area,
        detail: temp.detail,
      }
    },
    async deleteAddress(id){
      const res = await Address.delete(id)
      if (res.data.code === 20000) {
        this.$notify({title: '成功', message: '删除地址成功', type: "success" });
        this.getAddressList()
      } else {
        this.$notify({title: '失败', message: '删除地址失败', type: "error" })
      }
    },
    setAddressId(index){
      this.addressId=index
    },
    // 订单提交
    async orderSubmit() {
      if (this.addressId=='') {
        this.$notify({title: '提交订单失败', message: '请选择一个收货地址', type: "error" })
        return
      }else{
        const res = await Orders.submitOrder({
          addressId: this.addressId
        })
        if (res.data.code === 20000) {
          this.$notify({title: '提交订单成功', message: '请尽快支付', type: "success" });
          this.$router.push({
            path: '/pay',
            query: {
              orderNo: res.data.data.orderNo
            }
          })
        } else {
          this.$notify({title: '提交订单失败', message: res.data.message, type: "error" })
        }
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
<style lang="less" scoped>
.trade{
  width: 1240px;
  margin: auto;
}
.border-hide{
  border: hidden;
}
.display-flex{
  display: flex;
}
.flex1{
  flex: 1;
  width: 1%;
}
// 去掉table hover高亮
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
.el-table a{
  color: #333;
}
.left-title{
  padding-top: 20px;
  width: 116px;
  min-width: 116px;
  color: #666;
  font-size: 14px;
}
.click-border{
  border: 1px solid #409EFF;
}
.select-address {
  width: 283px;
  height: 176px;
  overflow: hidden;
  margin: 10px 0;
}
.select-address:hover{
  border: 1px solid #409EFF;
  cursor:pointer;
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
  height: 50px;
  overflow: hidden;
}
.detail{
  font-size: 14px;
  color: #666;
}
.icon:hover{
  color: #409EFF;
  cursor:pointer;
}
.icon{
  color: #828282;
}
.edit-icon{
  float: right;
}
.add-address{
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 16px;
  color: #666;
}
.add-icon{
  margin-right: 6px;
}
.original-price{
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}
.trade-total {
  width: 100%;
  display: table;
  padding-bottom: 20px;
  text-align: right;
}
.trade-total label {
  text-align: left;
  display: table-cell;
  color: #666;
  font-size: 14px;
}
.trade-total strong {
  color: #333;
  font-weight: normal;
  font-size: 34px;
  overflow: hidden;
}
.trade-total strong span.rmb-symbol {
  font-size: 21px;
}
.cart-btn{
  width:100%;
  height:60px;
}
.split-bar{
  height: 20px;
  background-color: #f4f4f4;
}

/* 布局 */
.row-bg {
  padding: 50px 0 20px 0;
}
</style>