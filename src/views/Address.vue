<template>
  <div class="address">
    <el-row class="account-content-addr">
      <el-col :span="12" v-for="(item,index) in addressList" :key="item.id">
        <el-card shadow="never" :body-style="{ padding: '20px' }" class="shp-checkout-address">
          <p>
            <span class="address-receiver">{{item.name}}</span>
            <span class="address-mobile">{{item.phone}}</span>
          </p>
          <div class="details">
            <p class="detail">{{addressCodeToText(item.area)}} {{item.detail}}</p>
          </div>
          <i class="icon edit-icon iconfont icon-delete" @click="deleteAddress(item.id)"></i>
          <i class="icon edit-icon iconfont icon-jianyi" @click="editAddressDialog(item)"></i>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="hover-border shp-checkout-address" :body-style="{ padding: '20px' }" @click.native="addDialogVisible = true; addressDialogTitle = '添加地址'">
          <p class="add-address"><i class="add-icon iconfont icon-add"></i>添加新地址</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加地址模态框 -->
    <el-dialog
      :title="addressDialogTitle"
      :visible.sync="addDialogVisible"
      width="50%" @close="reset">
      <el-form label-width="120px" :model="addressForm" :rules="addFormRules" ref="addAddressFormRef">
        <el-form-item label="ID：" hidden>
          <el-input v-model="addressForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名：">
          <el-input v-model="addressForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="addressForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地区：">
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
export default {
  data(){
    var validMobile = (rule, value, cb) => {
      if (/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        return cb()
      }
      cb(new Error('请填入正确格式的手机号'))
    }
    return{
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
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' },
        ],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getAddress()
  },
  methods:{
    // 获取地址列表
    async getAddress() {
      const res = await this.$http.get('/address')
      if (res.data.code === 20000) {
        this.addressList = res.data.data.list
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    addressCodeToText(code) {
      var address=''
      code.forEach(element => {
        address=address+CodeToText[element]+' '
      });
      return address
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
    // 添加/编辑地址
    addAddress () {
      this.$refs.addAddressFormRef.validate(async valid => {
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
            this.getAddress()
          } else {
            this.$notify({title: '失败', message: this.addressAdd ? '添加地址失败' : '编辑地址失败', type: "error" })
          }
        }
      })
    },
    async deleteAddress(id){
      const res = await this.$http.delete(`/address/${id}`)
      if (res.data.code === 20000) {
        this.$message.success("删除成功")
        this.getAddress()
      } else {
        this.$message({ 'message': res.data.message,
          'type': 'info'
        })
      }
    },
    // 重置表单
    reset () {
      this.$refs.addAddressFormRef.resetFields()
      this.addressForm.id = ''
    },
  }
}
</script>

<style lang="less" scoped>
.address{
  background-color: #fff;
}
.account-content-addr {
  min-height: 360px;
  padding: 40px;
}
.shp-checkout-address {
  height: 140px;
  overflow: hidden;
  margin: 10px;
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
  height: 34px;
  overflow: hidden;
}
.detail{
  display: inline;
  font-size: 14px;
  line-height: 1.4;
  color: #666;
}
.icon:hover{
  cursor:pointer;
}
.icon{
  color: #828282;
}
.edit-icon{
  float: right;
  padding-left: 20px;
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
  vertical-align: -2.9%;
}
.hover-border:hover{
  border: 1px solid #409EFF;
  cursor:pointer;
}
</style>