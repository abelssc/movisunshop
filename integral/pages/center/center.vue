<template>
	<view>
		<!--<import src="../template/not.wxml"></import>-->
		<footerBar :imgSrc="imgSrc" />

		<view class="center">
			<view class="integral">
				<image class="bg" :src="img_url+'integral/bg1.png'"></image>
				<text class="ruls" @tap="pointsRule">{{$L('积分规则')}}</text>

				<view>
					<image :src="img_url+'integral/jfen.png'"></image>
					<text>{{intergral}}</text>
				</view>
			</view>

			<view class="shop" data-url="/integral/pages/index/index" @tap="go">
				<image :src="img_url+'integral/bg2.png'" mode="widthFix"></image>
			</view>

			<view class="list">
				<view class="title">{{$L('积分明细')}}</view>
				<view class="nav">
					<text data-type :class="type==''?'on':''" @tap="changetype">{{$L('全部')}}</text>
					<text data-type="add" :class="type=='add'?'on':''" @tap="changetype">{{$L('收入')}}</text>
					<text data-type="desc" :class="type=='desc'?'on':''" @tap="changetype">{{$L('支出')}}</text>
				</view>
				<view class="detail_list">
					<block v-if="list.length && !noData">
						<view v-for="(item, index) in list" :key="index" class="item">
							<text class="jifen">{{item.points}}{{$L('积分')}}</text>
							<text class="ty">{{item.pl_desc}}</text>
							<text class="time">{{$L('领取时间：')}}{{item.time}}</text>
						</view>
					</block>
					<block v-if="noData">
						<block data-type="template" data-is="not" data-attr="img,content">
							<view class="nothasData">
								<view class="img">
									<image :src="img"></image>
								</view>
								<text>{{content}}</text>
							</view>
						</block>
					</block>
				</view>
			</view>
		</view>

		<common :title="$L('积分中心')"></common>
	</view>
</template>

<script>
	import footerBar from "@/integral/pages/template/footer.vue";

	export default {
		components: {
			footerBar,
		},
		data() {
			return {
				imgSrc: 'center',
				key: '',
				intergral: '',
				// 积分
				type: '',
				// 积分变更类型
				list: [],
				// 积分变更列表
				img: getApp().globalData.img_url + "order_w.png",
				content: this.$L('暂无数据...'),
				rules: [],
				img_url: getApp().globalData.img_url, //图片地址
				showModal: false,
				noData: false,
				pn:1,
			};
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('积分中心')
      });

			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.getUserIntegral(); // 获取积分

			this.getDetail(); // 获取积分变更详细
		},

		// 加载更多
		onReachBottom(e) {
			if (this.hasmore) {
				this.getDetail();
			}
		},

		methods: {
			go(e) {
				let url = e.currentTarget.dataset.url;

				if (url) {
					uni.navigateTo({
						url
					});
				}
			},

			jumpPage(e) {
				let url = e.currentTarget.dataset.url;

				if (url) {
					uni.redirectTo({
						url
					});
				}
			},

			// 获取用户积分
			getUserIntegral() {
				let that = this,
					key = that.key;
				uni.request({
					url: getApp().globalData.ser_url +
						'/index.php?app=points_member_center&mod=getUserMemberInfo&&sld_addons=points',
					method: 'GET',
					data: {
						key
					},
					success: function(res) {
						if (res.data.status == 200) {
							that.setData({
								intergral: res.data.data
							});
						}
					}
				});
			},

			// 切换
			changetype(e) {
				let type = e.currentTarget.dataset.type;
				let oldtype = this.type;

				if (oldtype != type) {
					this.setData({
						type,
						list: []
					});
					this.pn = 1;
					this.hasmore = true;
					this.getDetail();
				}
			},

			// 获取积分详细
			getDetail() {
				let that = this,
					key = that.key,
					type = that.type;
				uni.showLoading({
					title: that.$L('加载中...')
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_member_center&mod=getUserPointsDesc&sld_addons=points',
					method: 'GET',
					data: {
						key,
						type,
						page: 10,
						pn: that.pn
					},
					success: function(res) {
						if (res.data.status == 200) {
							if (res.data.data.list.length == 0) {
								that.noData = true;
							} else {
								that.noData = false;
								that.setData({
									list: that.list.concat(res.data.data.list)
								});

								if (res.data.data.ishasmore.hasmore) {
									that.pn++;
								} else {
									that.hasmore = false;
								}
							}
						}else{
							that.noData = true;
						}
					},
					complete: function() {
						uni.hideLoading();
					}
				});
			},

			pointsRule() {
				let that = this,
					key = that.key,
					type = that.type;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_member_center&mod=pointrules&sld_addons=points',
					method: 'GET',
					data: {
						key
					},
					success: function(res) {

						if (res.data.status === 200) {
							let result = res.data.data;
							that.setData({
								rules: result
							});
							let str = '';

							for (let i = 0; i < result.length; i++) {
								str += i + 1 + "、" + result[i] + "\n";
							}

							uni.showModal({
								title: that.$L('积分规则'),
								content: str,
								showCancel: false,
								confirmText: that.$L('我知道了'),
								confirmColor: "#E1251B",

								success(res) {}

							});
						}
					}
				});
			},

			//积分规则
			//http://site7.55jimu.com/cmobile/index.php?app=points_member_center&mod=pointrules&sld_addons=points&key=04cc104632ff8178d7054d153074b071
			hideModal() {
				this.setData({
					showModal: false
				});
			}

		}
	};
</script>
<style>
    page{
		width: 750rpx;
		margin: 0 auto;
	}
	.center {
		width: 750rpx;
		min-height: calc(100vh - 100rpx);
		padding-bottom: 100rpx;
		background-color: #f5f5f5;
	}

	.center .integral {
		position: relative;
		width: 100%;
		height: 188rpx;
		overflow: hidden;
		color: #fff;
	}

	.integral .bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}

	.integral .ruls {
		position: absolute;
		top: 28rpx;
		left: 32rpx;
		font-size: 24rpx;
	}

	.integral>view {
		position: absolute;
		top: 71rpx;
		left: 246rpx;
	}

	.integral view image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 31rpx;
	}

	.integral view text {
		font-size: 70rpx;
	}

	.shop {
		margin: 20rpx;
	}

	.shop image {
		width: 100%;
	}

	.list {
		background-color: #fff;
	}

	.list .title {
		color: #181818;
		font-size: 32rpx;
		padding: 35rpx 0 19rpx 30rpx;
		font-weight: 600;
	}

	.nav {
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 30rpx;
		color: #393939;
	}

	.nav text {
		padding: 0 30rpx;
		line-height: 57rpx;
		border-bottom: 2rpx solid transparent;
	}

	.nav text.on {
		border-bottom: 2rpx solid #f94b2e;
		color: #f94b2e;
	}

	.detail_list {
		padding-top: 11rpx;
	}

	.detail_list .item {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0 20rpx 30rpx;
		border-bottom: 1rpx solid #dadada;
	}

	.detail_list .item:last-child {
		border: none;
	}

	.detail_list .item text {
		display: block;
		margin-bottom: 20rpx;
		color: #616060;
		font-size: 28rpx;
	}

	.detail_list .item text:first-child {
		color: #EC9915;
		font-size: 34rpx;
	}

	.detail_list .item text:last-child {
		margin-bottom: 0;
		font-size: 24rpx;
	}

	.nothasData {
		padding-top: 0;
		padding-bottom: 150rpx;
		background-color: #f5f5f5;
	}

	.nothasData .img {
		margin-top: 120rpx;
	}
</style>
