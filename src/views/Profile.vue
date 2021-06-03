<template>
  <div class="profile">
    <form style="padding: 20px 0 60px 0;">
      <div class="index_root__1Lvph">
        <div class="index_label__tc-SQ">账号</div>
        <div class="index_control__3-nPy">
          <div class="index_root__1T3uj">{{profile.username}}</div>
        </div>
      </div>
      <div class="index_root__1Lvph">
        <div class="index_label__tc-SQ">性别</div>
        <div class="index_control__3-nPy">
          <div class="index_root__1T3uj">{{profile.sex|toSex}}</div>
        </div>
      </div>
      <div class="index_root__1Lvph">
        <div class="index_label__tc-SQ">手机号</div>
        <div class="index_control__3-nPy">
          <div class="index_root__1T3uj">{{profile.phone}}</div>
        </div>
      </div>
      <div class="index_root__1Lvph">
        <div class="index_label__tc-SQ">邮箱</div>
        <div class="index_control__3-nPy">
          <div class="index_root__1T3uj">{{profile.email}}</div>
        </div>
      </div>
      <div style="padding-left: 153px;"></div>
      <div class="index_root__1Lvph">
        <div class="index_label__tc-SQ">&nbsp;</div>
        <div class="index_control__3-nPy">
          <el-button-group>
            <el-button type="primary" style="width:180px;height:60px" @click="editDialogVisible = true">编辑</el-button>
            <el-button type="info" style="width:180px;height:60px" @click="logout">退出</el-button>
          </el-button-group>
        </div>
      </div>
    </form>

    <!-- 添加地址模态框 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="editDialogVisible"
      width="50%" @close="reset">
      <el-form label-width="120px" :model="profile" :rules="editFormRules" ref="editProfileFormRef">
        <el-form-item label="ID：" hidden>
          <el-input v-model="profile.id"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="账号：">
          <el-input v-model="profile.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input type="password" v-model="profile.password" @focus="removePassword()" @blur="addPassword()"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别：">
          <el-radio-group v-model="profile.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        </el-form-item>
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="profile.phone"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input v-model="profile.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProfile(profile)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import User from '../api/user.js'
export default {
  data() {
    var validMobile = (rule, value, cb) => {
      if (/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        return cb()
      }
      cb(new Error('请填入正确格式的手机号'))
    }
    return {
      profile: '',
      editDialogVisible: false,
      profileForm: {
        id: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        sex: '',
      },
      password:'',
      editFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { min: 6, message: '至少包含6个字符', trigger: 'blur' }
          ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    getProfile() {
      this.axios.get(`/user/profile`).then((res) => {
        this.profile=res.data.data.profile
      })
    },
    // 重置表单
    reset () {
      this.$refs.editProfileFormRef.resetFields()
    },
    editProfile(profile){
      this.axios.put('/user/profile', profile).then(res => {
        if (res.data.code === 20000) {
          this.$message.success('修改个人信息成功')
          this.editDialogVisible = false
          this.getProfile()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    removePassword(){
      if(this.password==this.profile.password||this.password==''){
        this.password=this.profile.password
        this.profile.password=''
      }
    },
    addPassword(){
      if(this.profile.password==''){
        this.profile.password=this.password
      }
    },
    async logout(){
      const res = await User.logout()
      if (res.data.code === 20000) {
        this.$notify({title: '成功', message: '退出成功', type: "success" });
        window.sessionStorage.clear()
        this.$router.push('/login')
      }else{
        this.$notify({title: '退出失败', message: res.data.message, type: "error" });
      }
    }
  },
  filters: {
    toSex (value) {
      var sex
      if(value==0){
        sex='保密'
      }
      if(value==1){
        sex='男'
      }
      if(value==2){
        sex='女'
      }
      return sex
    }
  }
}
</script>

<style lang="less" scoped>
.profile{
  background-color: #fff;
}
.index_root__1Lvph {
  zoom: 1;
  padding: 20px;
  height: 60px;
  font-size: 17px;
  color: #333;
}
.index_label__tc-SQ {
  float: left;
  line-height: 60px;
  width: 114px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
.index_control__3-nPy {
  width: 360px;
  margin-left: 20px;
  float: left;
}
.index_root__1T3uj {
  line-height: 60px;
  padding: 0 20px;
  font-size: 17px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>