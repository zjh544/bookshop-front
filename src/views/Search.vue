<template>
  <div class="search">
    <!-- 卡片 -->
    <el-card class="box-card" shadow="never" :body-style="{ padding: '20px 0px' }">
      <el-cascader
          v-model="catIds"
          :options="categoryList"
          :props="{ checkStrictly: true, expandTrigger: 'hover', label: 'name', value: 'id'}"
          @change="searchByCat"
          clearable
          filterable>
      </el-cascader>
      <div v-if="showGoods" class="text item">
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
                <img :src="item.pic"/>
                <div style="padding: 14px">
                  <span>{{item.name}}</span>
                  <div class="goods-author">{{ item.author }} 著</div>
                  <span class="goods-price"><i>￥</i>{{item.price}}</span>
                  <span v-if="item.originalPrice!=null" class="original-price"><i>￥</i>{{item.originalPrice}}</span>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
      <!-- 分頁組件 -->
      <el-pagination
        class="pager"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currPage"
        :page-size="queryInfo.pageSize"
        background
        :hide-on-single-page="true"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
      <div v-if="!showGoods" class="empty clearfix">
        <div class="empty-tip">
          <div class="empty-tip-pic"></div>
          <div class="empty-tip-info">
            <h4>没有找到"{{this.queryInfo.search}}"相关产品</h4>
            <p>建议您尝试其他关键字</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Goods from '../api/goods.js'
import Category from '../api/category.js'
export default {
  data() {
    return {
      queryInfo: {
        currPage: 1, // 当前页码
        pageSize: 8, // 每页条目数
        search: this.$route.query.cat==null?this.$route.query.keyword:this.$route.query.cat
      },
      goodsList: [], // 图书列表,
      total: 0, // 总条目数
      categoryList: [],
      catIds: [],
      showGoods:true
    };
  },
  created(){
    this.getGoodsList()
    this.getCategoryList()
  },
  methods:{
    async getGoodsList() {
      if(this.$route.query.cat!=null){
        const res = await Goods.getGoodsByCat(this.queryInfo)
        if (res.data.code === 20000) {
          this.goodsList = res.data.data.rows
          this.total = res.data.data.total
        } else {
          this.$notify({title: '获取图书失败', message: res.data.message, type: "error" });
        }
      }else{
        const res = await Goods.list(this.queryInfo)
        if (res.data.code === 20000) {
          this.goodsList = res.data.data.rows
          this.total = res.data.data.total
        } else {
          this.$notify({title: '获取图书失败', message: res.data.message, type: "error" });
        }
      }
      if(this.total==0){
        this.showGoods=false
      }else{
        this.showGoods=true
      }
    },
    async getCategoryList() {
      const res = await Category.list(-1, -1, 3)
      if (res.data.code === 20000) {
        this.categoryList = res.data.data.rows
      } else {
        this.$notify({title: '获取分类失败', message: res.data.message, type: "error" });
      }
    },
    searchByCat(value) {
      if(value.length==1){
        this.$router.push({
          path: '/search',
          query: {
            cat: value[0]
          }
        })
      }else if(value.length==2){
        this.$router.push({
          path: '/search',
          query: {
            cat: value[1]
          }
        })
      }else{
        this.$router.push({
          path: '/search',
          query: {
            cat: value[2]
          }
        })
      }
    },
    // 當前頁切換
    handleCurrentChange(newCurrPage) {
      this.queryInfo.currPage = newCurrPage
      this.getGoodsList()
    },
  },
  watch: {
    '$route': function (to, from) {
      if(this.$route.query.cat!=null){
        this.queryInfo.search=this.$route.query.cat
      }else {
        this.queryInfo.search=this.$route.query.keyword
        this.catIds=[]
      }
      this.getGoodsList();
　　}
  },
}
</script>

<style lang="less" scoped>
.search{
  width: 1240px;
  margin: auto;
}
.goods-author {
  font-size: 13px;
  color: #999;
}
.goods-price {
  color: #c00;
  font-size: 22px;
}
.goods-price i{
  font-size: 14px;
}
.original-price{
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 8px;
  color: #666;
}
.empty {
  margin-top: 150px;
  text-align: center;
}
.empty .empty-tip {
  display: inline-flex;
  align-items: center;
  text-align: left;
  overflow: hidden;
}
.empty .empty-tip .empty-tip-pic {
  width: 171px;
  height: 155px;
  background: url(../assets/img/panda_empty-923d83c6d5.png) center no-repeat;
}
.empty .empty-tip .empty-tip-info {
  font-size: 18px;
  color: #666;
  margin-left: 10px;
}
.empty .empty-tip .empty-tip-info h4 {
  overflow: hidden;
  font-size: 30px;
  font-weight: 300;
  color: #409EFF;
}
.pager{
  float: right;
}

/* 卡片 */
.text {
  font-size: 14px;
  text-align: center;
}

.item {
  margin: 20px 0;
}

.box-card {
  background-color: #f4f4f4;
}

/* Card卡片 */
.el-card{
  border: hidden;
}
</style>