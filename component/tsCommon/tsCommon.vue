<template>
<!--component/tsCommon/tsCommon.wxml-->
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.check_Jurisdiction();
    },

    check_Jurisdiction() {
      let key = uni.getStorageSync('ssys_key');
      if (!key) {
        //  登录
        // uni.reLaunch({
        //   url: '/addons/pages/tsLogin/tsLogin'
        // });
      } else {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=index&mod=check_Jurisdiction&sld_addons=spreader',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            ssys_key: key
          },
          success: res => {
            if (res.data.status != 200) {
              uni.reLaunch({
                url: '/addons/pages/tsApplyFor/tsApplyFor'
              });
            }
          }
        });
      }
    }

  }
};
</script>
<style>
/* component/tsCommon/tsCommon.wxss */
</style>