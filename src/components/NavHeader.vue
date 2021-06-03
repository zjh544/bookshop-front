<template>
  <div class="header-box">
    <!-- 卡片 -->
        <el-row type="flex" justify="space-around">
          <el-col :span="8">
            <!-- <el-card shadow="never" :body-style="{ padding: '0px' }" style="border-style:none"> 从不显示 </el-card> -->
            <a class="logo" v-bind:href="'/'">
              <i class="iconfont icon-book"></i>
              <span>文城书店</span>
            </a>
          </el-col>
          <el-col :span="8">
              <!-- 搜索 -->
              <div>
                <el-input
                  placeholder="请输入内容"
                  v-model="search"
                  class="input-with-select"
                  v-if="noSearch!='/pay'"
                >
                  <el-button slot="append" icon="el-icon-search" @click="searchGoods(search)"></el-button>
                </el-input>
              </div>
          </el-col>
          <el-col :span="2.5">
              <!-- 导航菜单 -->
              <el-menu
                :default-active="$route.path"
                class="el-menu-demo"
                mode="horizontal"
                router
              >
                <el-menu-item index="/user">
                  <i class="iconfont icon icon-user11"></i>
                </el-menu-item>
                <el-menu-item index="/cart">
                  <i class="iconfont icon icon-books"></i>
                </el-menu-item>
              </el-menu>
          </el-col>
        </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { removeStore, getStore, setStore } from "../utils/storage";

export default {
  data() {
    return {
      noSearch:'',
      search:'',
    };
  },
  computed: {
    ...mapState(["login", "userInfo", "cartList", "showCart"]),
    totalNum() {
      return (
        this.cartList &&
        this.cartList.reduce((total, item) => {
          total += item.productNum;
          return total;
        }, 0)
      );
    },
    totalPrice(){
      return (
        this.cartList &&
        this.cartList.reduce((total, item) => {
          total += item.productNum * item.salePrice;
          return total;
        }, 0)
      );
    }
  },
  mounted() {
    const params = this.$route.params
    if (params && params.from === 'login') {
      this.getCartCount()
    }
  },
  methods: {
    ...mapMutations(["SHOWCART", "INITBUYCART"]),
    cartShowState(state) {
      this.SHOWCART({
        showCart: state
      });
    },
    getCartCount() {
      this.axios.get('/carts/products/sum').then((res = 0) => {
        this.$store.dispatch('saveCartCount', res.data.data.data)
      })
    },
    logout() {
      removeStore("token");
      removeStore("buyCart");
      window.location.href = "/";
    },
    searchGoods(search){
      this.$router.push({
        path: '/search',
        query: {
          keyword: search
        }
      })
      this.search=''
    },
  },
  created() {
  },
  watch:{
    $route(to,from){
      this.noSearch=to.path
    }
  },
};
</script>

<style lang="less" scoped>
.header-box{
  width: 1240px;
  margin: auto;
}
.logo{
  float: left;
}
.logo:hover{
  cursor:pointer;
}
.logo i{
  font-size: 40px;
  color: #409EFF;
}
.logo span{
  font-size: 24px;
  padding-left: 10px;
  color: #409EFF;
  vertical-align: 12%;
}
.icon:hover{
  color: #000;
}
/* 搜索 */
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>