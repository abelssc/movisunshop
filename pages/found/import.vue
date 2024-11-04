<template>
<view>
<!--pages/found/import.wxml-->
<web-view :src="show_url" @message="bindGetMsg"></web-view>
<common></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      out_base_url: getApp().globalData.view_url,
      show_url: '',
      u: '',
      tgurl: '',
      tgsrc: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var key = uni.getStorageSync('token');

    if (!key) {
      getApp().globalData.goLogin();
      return;
    }

    if (options.u) {
      var show_url = this.out_base_url + options.u; // 参数追加

      if (options.id || options.order_id || options.gid) {
        if (options.order_id) {
          show_url += '?key=' + key + '&order_id=' + options.order_id;
        } else if (options.gid) {
          show_url += '?key=' + key + '&gid=' + options.gid;
        } else {
          show_url += '?key=' + key + '&id=' + options.id;
        }
      }

      if (options.bid) {
        show_url += '&bid=' + options.bid;
      }

      this.setData({
        show_url: show_url,
        u: options.u
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {},
  onShareTimeline: function (res) {},
  methods: {
    bindGetMsg: function (e) {}
  }
};

</script>
<style>
/* pages/found/import.wxss */
</style>