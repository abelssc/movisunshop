<template>
	<view>
		<view class="tip">{{$L('对我们的商城，产品，服务您还有什么建议呢？您希望在')}}{{siteName}}{{$L('上买到什么？请告诉我们...')}}</view>

		<view class="content">
			<textarea :placeholder="$L('请填写反馈内容...')" @input="inputHandle"></textarea>
		</view>

		<button @tap="submit">{{$L('提交反馈')}}</button>

		<common :title="$L('意见反馈')"></common>
	</view>
</template>

<script>
	import request from "../../utils/request";

	export default {
		data() {
			return {
				key: '',
				siteName: "",
				content: ""
			};
		},

		components: {},
		props: {},

		onLoad() {
      uni.setNavigationBarTitle({
          title: this.$L('意见反馈')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.initData();
		},

		methods: {
			initData() {
				request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getSiteInfo&key=' + this.key
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							siteName: res.data.site_name
						});
					}
				});
			},

			inputHandle(e) {
				this.setData({
					content: e.detail.value
				});
			},

			submit() {
				let {
					key,
					content
				} = this;

				if (!content) {
					uni.showToast({
						title: this.$L('请填写反馈内容'),
						icon: 'none'
					});
					return;
				}

				request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=user_feedback',
					method: 'post',
					data: {
						key,
						content
					}
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res.datas.msg
						});
						//返回上级页面
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					}
				});
			}

		}
	};
</script>
<style>
	/* pages/Feedback/Feedback.wxss */
	page {
		background-color: #f3f3f3;
		width: 750rpx;
		margin: 0 auto;
	}

	.tip {
		padding: 40rpx 30rpx;
		color: #181818;
		font-weight: 300;
		line-height: 46rpx;
		font-size: 28rpx;
	}

	.content {
		width: 750rpx;
		height: 320rpx;
		background-color: #fff;
		font-size: 26rpx;
		color: #333;
	}

	.content textarea {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 30rpx;
		line-height: 45rpx;
	}

	button {
		height: 90rpx;
		margin: 20rpx 30rpx;
		background-color: #fff;
		color: #000;
		border: 0;
		line-height: 90rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
	}

	button::after {
		border-radius: 0;
		border: none;
	}
</style>
