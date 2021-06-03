<template>
  <div class="user">
    <el-aside width="162px">
      <el-menu active-text-color="#409eff" text-color="#666"
      unique-opened router class="user-nav"
      :default-active="$route.path" >
        <el-menu-item :index="item.url" v-for="(item,index) in menuList" :key="index">
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main style="padding:0">
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
data() {
    return {
      // 左侧菜单列表
      menuList: [
        {
          name:'个人信息',
          url:'/profile'
        },
        {
          name:'收货地址',
          url:'/address'
        },
        {
          name:'我的订单',
          url:'/orders'
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.user{
  width: 1240px;
  margin: auto;
}
.user-nav{
  padding: 20px 20px;
}

// 去除子菜单右边框导致对不齐问题
.el-menu{
  border-right: 0;
}

// .el-main{
//   background-color: #fff;
// }
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
  float: left;
  margin-right: 20px;
}
</style>