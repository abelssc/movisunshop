<template>
	<view>
		<web-view :src="show_url"  style="width: 750rpx; margin: 0 auto;"></web-view>
		<common></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show_url: ''
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('聊天详情')
      });
			var key = uni.getStorageSync('token');

			if (!key) {
				getApp().globalData.goLogin();
			}

			var op = decodeURIComponent(options.op);
			if (op) {
				op = JSON.parse(op);
				var show_url = getApp().globalData.view_url + '/cwap_chat_datail_xcx.html?key=' + key;

				for (var i in op) {
					show_url += '&' + i + '=' + op[i];
				}
				this.setData({
					show_url: encodeURI(show_url)
				});
			}
		},
		methods: {}
	};
</script>
<style>
	/* pages/im/im.wxss */
	page {
		width: 750rpx;

	}
</style>
