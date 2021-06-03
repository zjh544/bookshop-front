<template>
  <div class="footer">
    <!-- 布局 -->
    <el-row type="flex" justify="end">
      <el-col :span="6">
        <i class="iconfont phone-icon icon-002dianhua">
        <span>15016080813</span>
        </i>
        <el-divider direction="vertical"></el-divider>
        <el-popover
            placement="top"
            trigger="hover">
          <i slot="reference" class="iconfont icon icon-weixin"></i>
          <img src="../assets/img/wx.jpg" width="150px">
        </el-popover>
        <el-popover
            placement="top"
            trigger="hover">
          <i slot="reference" class="iconfont icon icon-qq"></i>
          <img src="../assets/img/wx.jpg" width="150px">
        </el-popover>
        <a href="">
          <i class="iconfont icon icon-weibo"></i>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'nav-footer'
}
</script>

<style lang="less" scoped>
/* 布局 */
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.phone-icon {
  color: #409eff;
  vertical-align: middle;
  >span{
    font-size: 16px;
    margin: 5px;
    vertical-align: middle;
  }
}
.icon:hover{
  color: #000;
}
.icon{
  color: #828282;
  padding: 10px;
  vertical-align: middle;
  cursor:pointer;
}
.footer{
  width: 1240px;
  margin: auto;
}
</style>
