<template>
  <div class="login">
    <div class="title">注册账号</div>
    <el-form
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
      status-icon
    >
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="registerForm.username"clearable autocomplete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password" show-password clearable autocomplete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input type="password" v-model="registerForm.confirmPwd" show-password clearable autocomplete="off" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="register('registerForm')">注册</el-button>
      </el-form-item>
      <el-form-item>
        <el-link href="/#/login" type="primary" :underline="false">登录</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import User from '../api/user.js'
export default {
  data() {
    var validateUsername = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        const res = await User.validate(value)
        if (res.data.code===20000) {
          return callback()
        }
        callback(new Error('该账号已经存在'))
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.confirmPwd !== '') {
          this.$refs.registerForm.validateField('confirmPwd');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        confirmPwd:'',
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, message: '至少包含6个字符', trigger: 'blur' }
          ],
        confirmPwd: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    register(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await User.register(this.registerForm)
          if (res.data.code === 20000) {
            this.$notify({title: '注册成功', message: '请登录', type: "success" });
            this.$router.push('/login')
          }else{
            this.$notify({title: '注册失败', message: res.data.message, type: "error" });
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
  margin-top: 60px;
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