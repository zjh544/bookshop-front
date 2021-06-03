<template>
  <div class="login">
    <div class="title">使用账号 登录官网</div>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="loginForm.username"clearable autocomplete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" show-password clearable autocomplete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="login('loginForm')">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-link href="/#/register" type="primary" :underline="false">注册</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import User from '../api/user.js'
import Cart from '../api/cart.js'
export default {
  data() {
    return {
      loginForm: {
        username: "zjh",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: "blur" }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await User.login(this.loginForm)
          if (res.data.code === 20000) {
            const { username, token } = res.data.data;
            window.sessionStorage.setItem("token", token);
            const goodsId=localStorage.getItem('goodsId')
            if(goodsId==null){
              this.$notify({title: '欢迎', message: username, type: "success" });
              this.$router.push('/index')
            }else{
              const res = await Cart.add(goodsId)
              if (res.data.code === 20000) {
                localStorage.removeItem('goodsId')
                this.$router.push('/cart')
                this.$notify({title: '加入成功', message: '去结算吧', type: "success" });
              } else {
                this.$notify({title: '加入购物车失败', message: res.data.message, type: "error" })
              }
            }
          }else{
            this.$notify({title: '登录失败', message: res.data.message, type: "error" });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 400px;
  margin: auto;
  background-color: #FFF;
  margin-top: 100px;
  padding: 72px 35px 20px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}
.title{
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
}
.btn{
  width: 100%;
  margin-top: 22px;
}
</style>