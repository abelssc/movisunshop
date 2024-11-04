<template>
<view>
<web-view :src="show_url" @message="bindGetMsg"></web-view>
<common :title="$L('申请')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      out_base_url: getApp().globalData.view_url,
      show_url: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('申请')
    });
    if (options.u) {
      var show_url = this.out_base_url + options.u + '?';

      for (let keys in options) {
        if (options.hasOwnProperty(keys)) {
          if (keys != 'u' && keys != 'no') {
            if (keys == 'enterinflag') {
              show_url += keys + '=' + options[keys].split('#')[0] + '&';
            } else {
              show_url += keys + '=' + options[keys] + '&';
            }
          }
        }
      }

      let key = uni.getStorageSync('token');
      show_url += 'key=' + key;

      if (options.enterinflag && options.enterinflag.indexOf('#nostep') > -1) {
        show_url += '#nostep';
      }

      if (options.no) {
        show_url += '#no';
      }

      this.setData({
        show_url: show_url
      });
    }
  },
  methods: {
    bindGetMsg: function (e) {
    }
  }
};
</script>
<style>
/* pages/Admission/Admission.wxss */
</style>