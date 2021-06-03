<template>
  <div class="detail">
    <!-- 布局 -->
    <el-row type="flex" justify="space-around">
      <el-col :span="8">
        <el-image class="goods-pic" :src="goodsInfo.goods.pic" ></el-image>
      </el-col>
      <el-col :span="9">
        <div class="detail-text">
          <h1>
            {{goodsInfo.goods.name}}
          </h1>
          <span class="detail-info">{{goodsInfo.goods.author}} 著</span>
          <el-divider direction="vertical" v-if="goodsInfo.goodsDetail.translator!=''"></el-divider>
          <span class="detail-info" v-if="goodsInfo.goodsDetail.translator!=''">{{goodsInfo.goodsDetail.translator}} 译</span>
          <p class="detail-info">
            {{goodsInfo.goodsDetail.introduction}}
          </p>
          <p class="detail-info">
            出版社：{{goodsInfo.publisher.name}}
          </p>
          <el-collapse v-model="activeName">
            <el-collapse-item title="详情" name="1">
              <div>
                ISBN：{{goodsInfo.goodsDetail.isbn}}
                <el-divider direction="vertical"></el-divider>
                页数：{{goodsInfo.goodsDetail.pages}}
                <el-divider direction="vertical"></el-divider>
                开本：{{goodsInfo.goodsDetail.format}}
              </div>
              <div>
                装帧：{{goodsInfo.goodsDetail.binding}}
                <el-divider direction="vertical"></el-divider>
                版次：{{goodsInfo.goodsDetail.edition}}
                <el-divider direction="vertical"></el-divider>
                印次：{{goodsInfo.goodsDetail.impression}}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <span class="goods-price"><i>￥</i>{{goodsInfo.goods.price}}</span>
          <span v-if="goodsInfo.goods.originalPrice!=null" class="original-price"><i>￥</i>{{goodsInfo.goods.originalPrice}}</span>
        </div>
        <el-button-group v-if="goodsInfo.goods.stock>0" class="btn-group">
          <!-- <el-button class="buy-btn" type="danger">立即购买</el-button> -->
          <el-button class="cart-btn" type="primary" @click="addCart">加入购物车</el-button>
        </el-button-group>
        <el-button v-else class="stock-btn" type="warning">缺货</el-button>
      </el-col>
    </el-row>
    <!-- 分隔条 -->
    <div class="split-bar"></div>
    <!-- 图片懒加载 -->
    <div class="demo-image__lazy">
      <el-image class="goods-content" v-for="url in goodsInfo.urls" :key="url" :src="url" lazy></el-image>
    </div>
  </div>
</template>

<script>
import Goods from '../api/goods.js'
import Cart from '../api/cart.js'
export default {
  name: "home",
  data() {
    return {
      goodsId: this.$route.params.id, // 获取图书ID
      queryInfo: {
        currPage: 1, // 当前页码
        pageSize: 5, // 每页条目数
        search: ''
      },
      goodsInfo: [], // 图书列表
      activeName: '1'
    };
  },
  created(){
    this.getGoodsInfo()
  },
  methods:{
    async getGoodsInfo() {
      const res = await Goods.detail(this.goodsId)
      if (res.data.code === 20000) {
        this.goodsInfo = res.data.data.data
      } else {
        this.$notify({title: '获取图书详情失败', message: res.data.message, type: "error" })
      }
    },
    async addCart() {
      if(window.sessionStorage.getItem('token')!=null){
        const res = await Cart.add(this.goodsId)
        if (res.data.code === 20000) {
          this.$router.push('/cart')
          this.$notify({title: '加入成功', message: '去结算吧', type: "success" });
        } else {
          this.$notify({title: '加入购物车失败', message: res.data.message, type: "error" })
        }
      }else{
        this.$notify({title: '请先登录', message: '如未注册请先注册', type: "info" })
        localStorage.setItem('goodsId',this.goodsId)
        this.$router.push('/login')
      }
    },
  }
};
</script>
<style lang="less" scoped>
.detail{
  width: 1240px;
  margin: auto;
  background-color: #fff;
  margin-top: 20px;
}
.goods-pic{
  margin-top: 30px;
  width: 500px;
  height: 500px;
}
.detail-text{
  padding-top: 70px;
  margin-bottom: 24px;
}
.detail-text h1 {
  margin-bottom: 14px;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 400;
  color: #333;
}
.detail-text .detail-info {
  font-size: 16px;
  color: #666;
  line-height: 26px;
  margin: 10px 0;
}
.detail-text h1 .el-divider {
  font-size: 16px;
  margin-bottom: -10px;
}
.goods-price{
  color: #e03d3d;
  font-size: 36px;
  line-height: 36px;
  font-weight: 400;
}
.goods-price i{
  font-style: normal;
  font-size: 24px;
}
.original-price{
  text-decoration: line-through;
  color: #666;
  font-size: 16px;
  margin-left: 20px;
}
.btn-group{
  margin-top: 22px;
  width: 100%;
}
.buy-btn{
  width: 60%;
  height: 50px;
}
.cart-btn{
  width: 100%;
  height: 50px;
}
.stock-btn{
  margin-top: 22px;
  width: 100%;
  height: 50px;
}
.goods-content{
  padding: 40px;
}
.split-bar{
  height: 65px;
  background-color: #f4f4f4;
}

/* 布局 */
.el-row {
  margin-bottom: 20px;
}

/* 图片懒加载 */
.el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
</style>