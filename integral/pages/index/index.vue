<template>
	<view>
		<footerBar :imgSrc="imgSrc" />
		<fixture :home_info="home_info" :img_url="img_url"/>
		<view class="gift-title">
			<view class="title">{{$L('推荐礼品')}}</view>
			<navigator hover-class="none" url="../goods_list/goods_list">
				{{$L('查看更多礼品')}}
				<image src="/static/integral/images/crright.png" mode="widthFix"></image>
			</navigator>
		</view>

		<view class="content clearfix">
			<view v-for="(item, index) in list" :key="index" class="goods-item goods-small">
				<view class="navigator">
					<view class="goods-item-pic">
						<navigator :url="'../goods_detail/goods_detail?gid=' + item.pgid">
							<image :src="item.pgoods_image" alt></image>
						</navigator>
					</view>
					<view class="goods-item-name">{{item.pgoods_name}}</view>
					<view class="goods-item-price d2">
						<text class="bigprice">{{item.pgoods_points}}{{$L('积分')}}</text>
						<text class="bigprice2">{{$L('售价：')}}{{$L('￥')}}{{item.pgoods_price}}</text>
					</view>
					<view class="tbuy">
						<view :data-id="item.pgid" @tap="cart" class="tbuy_image">
							<image :src="img_url+'integral/cart.png'" mode="widthFix"></image>
						</view>
						<view :data-id="item.pgid" @tap="buy">
							{{$L('立即兑换')}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<sldMenu :nowPage="now_page" />
		<common :title="$L('积分商城')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>
	import footerBar from "@/integral/pages/template/footer.vue";
	import fixture from "@/integral/pages/template/fixture.vue";

	export default {
		components: {
			footerBar,
			fixture
		},
		data() {
			return {
				imgSrc: 'index',
				home_info: [],
				showErr: false,
				img_url: getApp().globalData.img_url,
				gids: [],
				list: [],
				key: "",
				now_page: 'points',
				pn: 1,
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('积分商城')
      });
			this.getInfo();
			this.getcommend();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getcommend();
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

			// 积分商城首页数据
			getInfo() {
				let that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&sld_addons=points',
					method: 'GET',
					success: function(res) {
						if (res.data.code == 200 && res.data.datas.tmp_data) {
							that.setData({
								home_info: res.data.datas.tmp_data
							});
							var home_info_data = res.data.datas.tmp_data;
							let gids = [];
							home_info_data.forEach(el => {
								if (el.type == 'tuijianshangpin') {
									gids = gids.concat(el.data.gid);
								} else if (el.type == 'dapei') {
									gids = gids.concat(el.data.gid);
								} else {
									if (Array.isArray(el.data)) {
										el.data.forEach(child => {
											if (child.url && child.url_type == 'url' && child.url_type_new != undefined && child.url_type_new == 'goods') {
												gids.push(child.url_new);
											} else if (child.url && child.url_type == 'goods') {
												gids.push(child.url);
											}
										});
									}
								}
							});
							that.setData({
								gids
							});
						} else {
							that.setData({
								showErr: true
							});
						}
					},
					error: function(err) {}
				});
			},

			getcommend() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=point_list&sld_addons=points',
					data: {
						is_commend: 1,
						page: 10,
						pn: this.pn
					},
					success: res => {
						if (res.data.state == 200) {
							let data = res.data.data.list;

							if (this.pn == 1) {
								this.setData({
									list: data
								});
							} else {
								let {
									list
								} = this;
								this.setData({
									list: list.concat(data)
								});
							}
							
							if (res.data.hasmore) {
								this.hasmore = true;
								this.pn++;
							} else {
								this.hasmore = false;
							}
							
							console.log(this.list,'llll')
						}

						
					}
				});
			},

			// 返回首页
			back() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},

			checkLogin(cb) {
				let key = uni.getStorageSync('token');

				if (key) {
					this.setData({
						key
					});
					cb && cb(key);
				} else {
					getApp().globalData.goLogin();
				}
			},

			// 单件购买
			buy(e) {
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.navigateTo({
						url: '/integral/pages/Integral_order/Integral_order?ifcart=0&cart_id=' + gid + '|1'
					});
				});
			},

			//加入购物车
			cart(e) {
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=addcart&sld_addons=points',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							num: 1,
							gid
						},
						success: function(res) {
							if (res.data.status == 200) {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									icon: 'none'
								});
								uni.reLaunch({
									url: '/integral/pages/cart/cart'
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				});
			},

			ReceiveCoupon(e) {
				let id = e.currentTarget.dataset.id;
				let key = uni.getStorageSync('token');

				if (!key) {
					getApp().globalData.goLogin();
					return;
				} else {
					if (id) {
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=red&mod=send_red&sld_addons=red',
							data: {
								key: key,
								red_id: id
							},
							success: res => {
								uni.showToast({
									title: res.data.datas,
									icon: 'none'
								});
							}
						});
					}
				}
			}

		}
	};
</script>
<style>
	page {
		padding-bottom: 100rpx;
		width: 750rpx;
		margin: 0 auto;
	}
	
	.home_lunbo image {
	  width: 100%;
	  height: 100%;
	}

	.home {
		position: fixed;
		right: 20rpx;
		bottom: 30vh;
		width: 50rpx;
		height: 50rpx;
		padding: 20rpx;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.home image {
		width: 100%;
	}

	.slide-image {
		width: 100%;
	}

	.not_data {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 300rpx;
	}

	.not_data .img {
		width: 243rpx;
		height: 243rpx;
		overflow: hidden;
	}

	.not_data .img image {
		width: 100%;
		height: 100%;
	}

	.not_data .tip {
		color: #999;
		font-size: 30rpx;
		margin-top: 41rpx;
	}

	.gift-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		background-color: #fff;
		padding: 0 20rpx;
	}

	.gift-title .title {
		position: relative;
		padding-left: 20rpx;
		color: #333333;
		font-size: 30rpx;
		font-weight: bold;
	}

	.gift-title .title::after {
		position: absolute;
		content: '';
		top: 4rpx;
		left: 0;
		width: 6rpx;
		height: 34rpx;
		background-color: #F14347;
	}

	.gift-title navigator {
		display: flex;
		align-items: center;
		color: #949494;
		font-size: 22rpx;
	}

	.gift-title navigator image {
		width: 9rpx;
		height: 0;
		margin-left: 10rpx;
	}

	.content {
		background: #f0f2f5;
		clear: both;
		overflow: hidden;
		display: block;
	}
	.goods .goods-small.goods-item:nth-child(2n) {
		margin-right: 10rpx;
	}
	
	.goods-small.goods-item {
		overflow: hidden;
		float: left;
		width: 360rpx;
		box-sizing: border-box;
		margin-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background-color: #fff;
		margin-left: 10rpx;
	}
	
	.goods-item .navigator {
		display: block;
		background: #fff;
	}
	
	.goods-item-pic {
		vertical-align: middle;
		line-height: 0;
		display: table-cell;
		text-align: center;
		width: 370rpx;
		height: 370rpx;
	}
	
	.goods-item-pic image {
		width: 367rpx;
		height: 367rpx;
	}
	
	.goods-small .goods-item-name {
		height: 66rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		color: #232326;
		margin-top: 10rpx;
		line-height: 33rpx;
		padding: 0 20rpx;
	}
	
	.goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
		margin-bottom: 20rpx;
	}
	
	.goods-item-price .yens {
		font-size: 26rpx;
	}
.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn .goods-tuan-btn-navigator span {
		margin: 0 0 0 11.5rpx;
	}


	.d2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 18rpx;
	}

	.d2 .bigprice {
		font-size: 26rpx;
	}
	.d2 .bigprice2 {
		color: #726F6F;
		font-size: 18rpx;
	}

	.tbuy {
		display: flex;
		align-items: center;
		width: 338rpx;
		height: 48rpx;
		border-radius: 25rpx;
		text-align: center;
		border: 1rpx solid #EE2328;
		margin: 0 auto 12rpx;
		overflow: hidden;
	}
	.tbuy_image{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tbuy>view {
		flex: 1;
	}

	.tbuy image {
		width: 30rpx;
	}

	.tbuy view:last-child {
		height: 100%;
		background-color: #EE2328;
		color: #fff;
		font-size: 24rpx;
		line-height: 48rpx;
	}
</style>
