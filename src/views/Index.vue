<template>
  <div class="index">
    <!-- 走马灯 -->
    <el-carousel indicator-position="inside">
      <el-carousel-item v-for="(img,index) in sliderList" :key="index" @click.native="toDetails(img.url)" class="slider">
        <img :src="img.pic" width="100%" height="100%">
      </el-carousel-item>
    </el-carousel>
    <!-- 卡片 -->
    <el-card class="box-card" shadow="never" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>折扣</span>
        <el-button class="more" type="text" @click="toMore('折扣')">查看更多</el-button>
      </div>
      <div class="text item">
        <!-- Card卡片 -->
        <el-row :gutter="24">
          <el-col
            :span="6"
            v-for="item in discountGoodsList"
            :key="item.id"
            :offset="0"
             style="margin-bottom:20px"
          >
            <a v-bind:href="'/#/detail/'+item.id">
              <el-card shadow="hover">
                <img :src="item.pic" class="image"/>
                <div style="padding: 14px">
                  <span>{{item.name}}</span>
                  <div class="">
                    <time class="time">{{ item.author }} 著</time>
                  </div>
                  <span class="goods-price"><i>￥</i>{{item.price}}</span>
                  <span v-if="item.originalPrice!=null" class="original-price"><i>￥</i>{{item.originalPrice}}</span>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 卡片 -->
    <el-card class="box-card" shadow="never" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>新书上架</span>
        <el-button class="more" type="text">查看更多</el-button>
      </div>
      <div class="text item">
        <!-- Card卡片 -->
        <el-row :gutter="24">
          <el-col
            :span="6"
            v-for="item in goodsList"
            :key="item.id"
            :offset="0"
            style="margin-bottom:20px"
          >
            <a v-bind:href="'/#/detail/'+item.id">
              <el-card shadow="hover">
                <img :src="item.pic" class="image"/>
                <div style="padding: 14px">
                  <span>{{item.name}}</span>
                  <div class="">
                    <time class="time">{{ item.author }} 著</time>
                  </div>
                  <span class="goods-price"><i>￥</i>{{item.price}}</span>
                  <span v-if="item.originalPrice!=null" class="original-price"><i>￥</i>{{item.originalPrice}}</span>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import Goods from '../api/goods.js'
export default {
  name: "index",
  data() {
    return {
      queryInfo: {
        currPage: 1, // 当前页码
        pageSize: 8, // 每页条目数
        search: ''
      },
      queryDiscount: {
        currPage: 1, // 当前页码
        pageSize: 8, // 每页条目数
        search: '折扣'
      },
      goodsList: [], // 图书列表
      discountGoodsList: [], // 图书列表
      rows: 0, // 总条目数
      sliderList:[]
    };
  },
  created(){
    this.getGoodsList()
    this.getDiscountGoodsList()
    this.getSliderList()
  },
  methods:{
    async getGoodsList() {
      const res = await Goods.list(this.queryInfo)
      if (res.data.code === 20000) {
        this.goodsList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$notify({title: '获取图书失败', message: res.data.message, type: "error" });
      }
    },
    async getDiscountGoodsList() {
      const res = await Goods.list(this.queryDiscount)
      if (res.data.code === 20000) {
        this.discountGoodsList = res.data.data.rows
        this.rows = res.data.data.total
      } else {
        this.$notify({title: '获取图书失败', message: res.data.message, type: "error" });
      }
    },
    getSliderList() {
      this.axios.get('/slider').then(res => {
        this.sliderList = res.data.data.list
      })
    },
    toDetails(url){
      this.$router.push(url)
    },
    toMore(search){
      this.$router.push({
        path: '/search',
        query: {
          keyword: search
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.index{
  width: 1240px;
  margin: auto;
  text-align: center;
}
.slider:hover{
  cursor:pointer;
}
.goods-price {
  position: relative;
  display: inline-block;
  color: #c00;
  font-size: 22px;
  padding-left: 14px;
}
.goods-price i{
  position: absolute;
  left: 0;
  font-size: 14px;
  bottom: 3px;
  font-style:normal
}
.original-price{
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 8px;
  color: #666;
}
.more{
  float: right;
  padding: 76px 0 22px 0;
  color: #333;
}
.more:hover{
  color: #409EFF;
}
.more:after {
  content: "";
  display: inline-block;
  width: 18px;
  height: 14px;
  background: url(../assets/icon/icon03.svg) no-repeat;
  background-position: -48px 0;
  position: relative;
  top: 2px;
}

/* 卡片 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  background-color: #f4f4f4;
}
/* Card卡片 */
.time {
  font-size: 13px;
  color: #999;
  overflow: hidden;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card{
  border: hidden;
}
.el-card .clearfix span{
  float: left;
  font-size: 26px;
  margin: 65px 0 22px 0;
}
/* 深度作用选择器 */
.el-card /deep/ .el-card__header {
  padding: 0;
  border-bottom: 0;
}
.el-carousel /deep/ .el-carousel__container{
  height: 360px;
}
</style>