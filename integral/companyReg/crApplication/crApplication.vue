<template>
	<view>

		<view class="bg-wrap" :style="'background: url(' + bg + ') no-repeat 0 0 #e72233; background-size: 100%;'">
			<view class="main">
				<button :class="isAgree?'':'next-btn'" @tap="nextHandle" :disabled="!isAgree">{{$L('立即入驻')}}</button>

				<view class="read">
					<checkbox-group @change="agreeXy">
						<checkbox :checked="isAgree" value="1"></checkbox>
					</checkbox-group>
					<text class="xy" @tap="AgreementToggle">{{$L('已阅读入驻协议')}}</text>
				</view>
			</view>
		</view>

		<view class="content" :hidden="show">
			<view class="con_wrap">
				<view class="title">
					<text>{{$L('商户入驻协议')}}</text>
					<view class="close" @tap="AgreementToggle">
						<image :src="img_url+'integral/close_xy.png'"></image>
					</view>
				</view>
				<view class="text-content">
					<view v-html="article"></view>
				</view>
			</view>
		</view>

	<common :title="$L('入驻申请')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article: '',
				// 协议内容
				show: true,
				isAgree: false,
				bg: getApp().globalData.img_url + this.$L('crbg.png'),
				img_url: getApp().globalData.img_url //图片地址
					,
				key: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('入驻申请')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			let isAgree = uni.getStorageSync('enterinflag');

			if (isAgree) {
				this.setData({
					isAgree: isAgree ? true : false
				});
			}

			this.getDocOfEnterin();
		},
		methods: {
			// 获取入驻协议
			getDocOfEnterin() {
				let {
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=getDocOfEnterin',
					data: {
						key: key,
						reapply: 0
					},
					success: res => {
						if (res.data.code == 200) {
							this.setData({
								article: res.data.datas.agreement
							});
						}
					}
				});
			},

			// 立即入驻
			nextHandle() {
				let {
					isAgree
				} = this;

				if (!isAgree) {
					uni.showToast({
						title: this.$L('请同意入驻协议'),
						icon: 'none'
					});
					return;
				}

				uni.setStorage({
					key: 'enterinflag',
					data: '1'
				});
				uni.navigateTo({
					url: '/integral/companyReg/crSelectType/crSelectType'
				});
			},

			// 同意协议
			agreeXy(e) {
				this.setData({
					isAgree: e.detail.value[0] ? true : false
				});
			},

			// 显示、隐藏协议
			AgreementToggle() {
				this.setData({
					show: !this.show
				});
			}

		}
	};
</script>
<style>
	@import "../../../pages/templates/wxss/red.css";

	.main .next-btn {
		background-color: #fff;
	}

	.bg-wrap {
		position: relative;
		width: 750rpx;
		height: 100vh;
		background-color: #e72233;
		margin: 0 auto;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		z-index: 1;
	}

	.bg-wrap .main {
		position: absolute;
		bottom: 100rpx;
		width: 750rpx;
		text-align: center;
		z-index: 2;
	}

	.main button {
		width: 597rpx;
		height: 103rpx;
		line-height: 103rpx;
		margin: 50rpx auto;
		text-align: center;
		color: #C31C32;
		font-size: 40rpx;
		border-radius: 8rpx;
		background-color: #FCF02A;
	}

	.main .read {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 24rpx;
	}

	.main .read checkbox {
		margin-right: 10rpx;
		transform: scale(0.7);
	}

	.content {
		position: fixed;
		top: 88rpx;
		/* bottom: 88rpx; */
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 750rpx;
		height: calc(100vh - 88rpx);
		background-color: rgba(0, 0, 0, .5);
		z-index: 99;
	}

	.content .con_wrap {
		position: absolute;
		top: 50rpx;
		left: 50rpx;
		right: 50rpx;
		bottom: 50rpx;
		background-color: #fff;
		padding: 10rpx 20rpx;
		font-size: 26rpx;
	}

	.content .con_wrap .title {
		position: relative;
		text-align: center;
		line-height: 60rpx;
		color: #333;
		font-size: 28rpx;
	}

	.con_wrap .title .close {
		position: absolute;
		top: 0;
		right: 0;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.con_wrap .close image {
		width: 45rpx;
		height: 45rpx;
	}

	.con_wrap .text-content {
		height: calc(100vh - 268rpx);
		overflow-y: auto;
	}
</style>
