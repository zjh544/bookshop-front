<template>
    <!-- 布局容器 -->
    <el-container>
      <!-- 回到顶部 -->
      <el-backtop></el-backtop>
      <el-header>
        <nav-header></nav-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <nav-footer></nav-footer>
      </el-footer>
    </el-container>
</template>

<script>
// @ is an alias to /src
import NavHeader from '../components/NavHeader.vue'
import NavFooter from '../components/NavFooter.vue'

export default {
  name: 'Home',
  components: {
    NavHeader,
    NavFooter
  },
}
</script>
<style lang="less" scoped>
// .el-container {
//   height: 100%;
// }
// 布局容器
.el-header, .el-footer {
  color: #333;
  text-align: center;
  line-height: 57px;
  flex: 0 0 auto;
  background-color: #fff;
}

.el-main {
  background-color: #f4f4f4;
  color: #333;
  flex: 1 0 auto;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>