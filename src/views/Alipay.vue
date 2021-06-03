<template>
  <div class="ali-pay">
    <div class="form" v-html="content"></div>
  </div>
</template>
<script>
import Pay from '../api/pay.js'
export default {
  name: 'alipay',
  data() {
    return {
      // orderId: this.$route.query.orderId,
      orderNo:this.$route.query.orderNo,
      content: '',
    }
  },
  created() {
    this.paySubmit()
  },
  methods: {
    // paySubmit() {
    //   this.axios.post('/pay', {
    //     orderId: this.orderId,
    //     orderName: '二手商城订单',
    //     amount: 0.01, // 单位元
    //     payType: 1 // 1支付宝，2微信
    //   }).then((res) => {
    //     this.content = res.content
    //     setTimeout(() => {
    //       document.forms[0].submit()
    //     }, 100)
    //   })
    // },
    async paySubmit() {
      const res = await Pay.alipay(this.orderNo)
      if (res.data.code === 20000) {
        this.content = res.data.data.content
        setTimeout(() => {
          document.forms[0].submit()
        }, 100)
      }else{
        this.$notify({title: '跳转支付宝失败', message: res.data.message, type: "error" });
      }
    },
  }
}
</script>
