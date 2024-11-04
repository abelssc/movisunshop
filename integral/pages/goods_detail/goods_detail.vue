<template>
	<view>

		<view class="detail">
			<view class="detail_nav">
				<view class="nav">
					<text data-id="top" @tap="change" :class="scrollTo=='top'?'on':''">{{$L('商品')}}</text>
					<text data-id="more" @tap="change" :class="scrollTo=='more'?'on':''">{{$L('详情')}}</text>
				</view>
			</view>

			<scroll-view scroll-y class="detail_main" :scroll-into-view="scrollTo">
				<!-- 轮播图 -->
				<view class="swiper" id="top">
					<swiper :current="current" @change="swiperChange">
						<swiper-item v-for="(item, index) in 1" :key="index">
							<image :src="goods_info.goods_image" mode="aspectFit"></image>
						</swiper-item>
					</swiper>
					<view class="current">{{current+1}}/1</view>
				</view>
				<!-- 商品信息 -->
				<view class="goods_info margin20">
					<text class="border"></text>
					<view class="count">
						<text>{{$L('库存')}}{{goods_info.pgoods_storage}}</text>
						<text>{{$L('已售')}}{{goods_info.pgoods_salenum}}</text>
					</view>
					<view class="info">
						<view class="goods_name">
							<text>{{goods_info.pgoods_name}}</text>
						</view>
						<view class="goods_js">
							<text>{{$L('此礼品每单限兑')}}{{goods_info.pgoods_limitnum}}{{$L('个')}}</text>
						</view>
						<view class="price">
							<text>{{goods_info.pgoods_points}}{{$L('积分')}}</text>
							<text>{{$L('售价：')}}{{$L('￥')}}{{goods_info.pgoods_price}}</text>
						</view>
					</view>
				</view>
				<!-- 选择商品 -->
				<!-- <view class='choose margin20'>
      <text>规格数量选择</text>
      <image src='/integral/images/arrow_right_b.png' mode='widthFix'></image>
    </view> -->
				<!-- 商品详情 -->
				<view class="goods_detail margin20" id="more">
					<text class="border"></text>
					<view class="title">
						<view class="icon">
							<text></text>
							<text></text>
							<text></text>
						</view>
						<view>{{$L('商品详情')}}</view>
						<view class="icon">
							<text></text>
							<text></text>
							<text></text>
						</view>
					</view>
					<view class="content">
					<!-- 	<block v-if="goods_body">
							<block data-type="template" data-is="entry" data-attr="...article">
								<view :class="'h2w h2w-' + theme">
									<view class="h2w__main">
										<import src="./renderTemplate.wxml"></import>
										<block v-for="(item, index) in child" :key="index">
											<template is="m0" :data="item"></template>
										</block>
									</view>
								</view>
							</block>
						</block>
						<block v-else>
							<view class="not">暂无商品详情</view>
						</block> -->
						

						<jyf-parser :html="goods_info.pgoods_body" ref="description"></jyf-parser>
												
						<!--商品详情页没有数据的提示  -->
						<view class="not" :hidden="goods_info.pgoods_body?true:false">
							<text>{{$L('暂无商品详情')}}</text>
						</view>
					</view>
				</view>
				<!-- 推荐商品 -->
				<view class="recommend">
					<view class="r_title">
						<image :src="img_url+'integral/tuijian@2x.png'" mode="widthFix"></image>
					</view>
					<view class="r_content">
						<view v-for="(item, index) in tuijian" :key="pgid" class="item" :data-gid="item.pgid" @tap="detail">
							<view class="r_img">
								<image :src="item.pgoods_image" mode="widthFix"></image>
							</view>
							<view class="r_info">
								<view class="r_name">{{item.pgoods_name}}</view>
								<view class="r_price">
									<text>{{item.pgoods_points}}{{$L('积分')}}</text>
									<text>{{$L('售价：')}}{{$L('￥')}}{{item.pgoods_price}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 弹出层 -->
			<view :class="'popup ' + (show?'on':'')" id="wrap1" @tap="hidePayType">
				<view class="p_main">

					<view class="close">
						<image :src="img_url+'close.png'" mode="widthFix" id="wrap2" @tap.stop="hidePayType"></image>
					</view>

					<view class="p_top">
						<view class="img">
							<image :src="goods_info.goods_image" mode="aspectFit"></image>
						</view>
						<view class="p_info">
							<view>{{goods_info.pgoods_name}}</view>
							<view>{{goods_info.pgoods_points}}{{$L('积分')}}</view>
						</view>
					</view>

					<view class="num">
						<view>{{$L('数量')}}</view>
						<view>
							<view :class="'btn ' + (num<=1?'disable':'')" data-type="minus" @tap="changeNum">
								<text>-</text>
							</view>
							<view class="count">{{num}}</view>
							<view :class="'btn ' + (num>=goods_info.pgoods_limitnum?'disable':'')" data-type="add" @tap="changeNum">
								<text>+</text>
							</view>
						</view>
					</view>

					<button @tap="addcart" data-type="1">{{$L('立即购买')}}</button>

				</view>
			</view>

			<!-- 底部 -->
			<view class="footer">
				<view data-url="/integral/pages/cart/cart" @tap="go">
					<image :src="img_url+'integral/cart@2x.png'"></image>
					<text>{{cart_num}}</text>
				</view>
				<view class="btn" @tap="addcart" data-type="0">
					<text>{{$L('加入购物车')}}</text>
				</view>
				<view class="btn" @tap="showPayType">
					<text>{{$L('立即兑换')}}</text>
				</view>
			</view>
		</view>

		<common :title="$L('商品详情')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				scrollTo: 'top',
				current: 0,
				gid: '',
				goods_info: '', //商品信息
				goods_body: '',
				tuijian: '', // 推荐商品
				show: false, // 弹窗
				num: 1, // 购买数量
				cart_num: 0,
				gids: [],
				img_url: getApp().globalData.img_url, //图片地址
				key: "",
				article: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('积分商城')
      });
			//分享进入
			if (options.scene) {
				let url = decodeURIComponent(options.scene);
				options.gid = url.split('=')[1];
			}

			this.setData({
				gid: options.gid
			});
			let key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key
				});
				this.getCartList();
			}

			this.getGoodsInfo();
			this.getgoodsBody();
			this.tuijianFun();
		},
		methods: {
			go(e) {
				let url = e.currentTarget.dataset.url;

				if (url) {
					uni.reLaunch({
						url
					});
				}
			},

			change(e) {
				let id = e.currentTarget.dataset.id;

				if (id) {
					this.setData({
						scrollTo: id
					});
				}
			},

			// 轮播图
			swiperChange(e) {
				let current = e.detail.current;
				this.setData({
					current
				});
			},

			// 获取商品详情
			getGoodsInfo() {
				let that = this,
					gid = that.gid;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_goods&mod=goods_detail&sld_addons=points',
					method: 'GET',
					data: {
						gid
					},
					success: function(res) {
						if (res.data.status == 200) {
							that.setData({
								goods_info: res.data.data
							});
						}
					}
				});
			},

			// 商品body数据
			getgoodsBody() {
				let that = this,
					gid = that.gid;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_goods&mod=goods_body&sld_addons=points',
					method: 'GET',
					data: {
						gid
					},
					success: function(res) {
						if (res.statusCode == 200) {
							let article = res.data;

							if (article) {
								that.setData({
									article: article
								});
							}

							that.setData({
								goods_body: res.data
							});
						}
					}
				});
			},

			// 获取推荐商品
			tuijianFun() {
				let that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=points_goods&mod=points_goods_tuijian&sld_addons=points',
					method: 'GET',
					success: function(res) {
						if (res.data.status == 200) {
							let gids = [];
							res.data.data.forEach(el => {
								gids.push(el.pgid);
							});
							that.setData({
								tuijian: res.data.data,
								gids
							});
						} else {
						}
					}
				});
			},

			// 查看商品详情
			detail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					let page = getCurrentPages();
					let len = page.length;

					if (len > 4) {
						uni.redirectTo({
							url: '/integral/pages/goods_detail/goods_detail?gid=' + gid
						});
					} else {
						uni.navigateTo({
							url: '/integral/pages/goods_detail/goods_detail?gid=' + gid
						});
					}
				}
			},

			// 显示弹窗
			showPayType() {
				this.setData({
					show: true
				});
			},

			// 关闭弹窗
			hidePayType(e) {
				if (e.target.id == 'wrap1' || e.target.id == 'wrap2') {
					this.setData({
						show: false
					});
				} else {
					return;
				}
			},

			// 商品数量
			changeNum(e) {

				let type = e.currentTarget.dataset.type,
					num = this.num * 1,
					limit = this.goods_info.pgoods_limitnum * 1,
					newNum = 0;
				if (type == 'minus') {
					if (num <= 1) {
						return;
					} else {
						newNum = num - 1;
					}
				} else {
					if (limit > 0) {
						if (num >= limit) {
							return;
						}
					}
					newNum = num + 1;
				}

				this.setData({
					num: newNum
				});
			},

			// 添加商品到购物车
			addcart(e) {
				let that = this,
					num = that.num,
					key = uni.getStorageSync('token'),
					type = e.currentTarget.dataset.type,
					gid = that.gid;

				if (!key) {
					getApp().globalData.goLogin();
					return;
				}

				if (key && num && gid) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=addcart&sld_addons=points',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							num,
							gid
						},
						success: function(res) {
							if (res.data.status == 200) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});

								if (type == '1') {
									uni.reLaunch({
										url: '/integral/pages/cart/cart'
									});
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									});
									that.getCartList();
								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				}
			},

			// 获取购物车列表
			getCartList() {
				let that = this,
					key = that.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=cartlist&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key
					},
					success: function(res) {
						if (res.data.status == 200) {
							let num = res.data.data.length;
							num = num > 9 ? '9+' : num;
							that.setData({
								cart_num: num
							});
						} else {
						}
					}
				});
			}

		}
	};
</script>
<style>

	.detail {
		width: 750rpx;
		background-color: #f5f5f5;
		padding-bottom: 105rpx;
		margin: 0 auto;
	}

	.detail .detail_nav {
		height: 77rpx;
		padding-top: 19rpx;
		background-color: #fff;
	}

	.detail_nav .nav {
		display: flex;
		align-items: center;
		width: 280rpx;
		height: 56rpx;
		margin: 0 auto;
		border: 1rpx solid #7f7f7f;
		border-radius: 8rpx;
	}

	.detail_nav .nav text {
		display: block;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
		flex: 1;
		font-size: 30rpx;
		color: #2d2d2d;
	}

	.detail_nav .nav text.on {
		background-color: #2d2d2d;
		color: #fff;
	}

	.detail_main {
		height: calc(100vh - 198rpx);
		overflow: hidden;
	}

	.detail_main .swiper {
		position: relative;
	}

	.detail_main swiper {
		padding: 0;
		width: 750rpx;
		height: 750rpx;
		overflow: hidden;
	}

	.detail_main swiper-item {
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.detail_main .swiper .current {
		position: absolute;
		right: 54rpx;
		bottom: 22rpx;
		width: 60rpx;
		height: 36rpx;
		line-height: 36rpx;
		color: #707070;
		text-align: center;
		font-size: 30rpx;
		border: 1rpx solid #b0b0b0;
	}

	.detail_main swiper image {
		width: 750rpx;
		height: 750rpx;
	}

	.goods_info {
		background-color: #fff;
		color: #707070;
		font-size: 30rpx;
		padding: 0 30rpx;
	}

	.goods_info .count {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		/* border-bottom: 1rpx solid #CDCDCD; */
	}

	.goods_info .goods_name {
		color: #141414;
		font-size: 34rpx;
		padding: 20rpx 0;
		font-weight: 600;
	}

	.goods_info .goods_js {
		padding-bottom: 20rpx;
	}

	.goods_info .price {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
	}

	.price text:nth-child(1) {
		color: #ba1418;
		font-size: 40rpx;
		margin-right: 44rpx;
	}

	.price text:nth-child(2) {
		text-decoration: line-through;
	}

	.detail_main .choose {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #141414;
		height: 100rpx;
		background-color: #fff;
	}

	.detail_main .choose image {
		width: 20rpx;
	}

	.detail_main .goods_detail {
		background-color: #fff;
	}

	.goods_detail .title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120rpx;
		color: #181818;
		font-size: 36rpx;
		/* border-bottom: 1rpx solid #cdcdcd; */
	}

	.title .icon {
		display: flex;
		margin: 0 20rpx;
		align-items: center;
		justify-content: center;
	}

	.title .icon text {
		display: block;
		width: 4rpx;
		height: 4rpx;
		background-color: #bfbfbf;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 5rpx;
	}

	.goods_detail .content {
		display: inline-block;
	}

	.goods_detail .content .not {
		font-size: 28rpx;
		color: #666;
		text-align: center;
		padding: 50rpx 0;
	}

	.recommend .r_title {
		overflow: hidden;
	}

	.recommend .r_title image {
		width: 100%;
	}

	.recommend .r_content {
		display: flex;
		padding: 0 30rpx;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.r_content .item {
		width: 330rpx;
		background-color: #fff;
		margin-bottom: 30rpx;
		border-radius: 8rpx;
		box-shadow: 0 0 8rpx #999;
	}

	.item .r_img {
		display: flex;
		align-items: center;
		width: 100%;
		height: 330rpx;
		overflow: hidden;
	}

	.item .r_img image {
		width: 100%;
	}

	.item .r_info {
		padding: 20rpx 0 30rpx 10rpx;
		color: #6d6d6d;
		font-size: 22rpx;
	}

	.item .r_info .r_price {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
	}

	.r_info .r_price text:nth-child(1) {
		color: #e62c2e;
		font-size: 26rpx;
		margin-right: 20rpx;
	}

	.r_info .r_price text:nth-child(2) {
		color: #999;
		text-decoration: line-through;
	}

	.margin20 {
		position: relative;
		margin-bottom: 20rpx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 750rpx;
		height: 98rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 0 5rpx #ccc;
		background-color: #fff;
		z-index: 9;
	}

	.footer view {
		/* display: flex; */
		height: 100%;
		/* justify-content: center; */
		/* align-items: center; */
		text-align: center;
		line-height: 98rpx;
		color: #393939;
		font-size: 24rpx;
	}

	.footer view:nth-child(1) {
		flex: 1;
		position: relative;
		border-right: 1rpx solid #e5e5e5;
	}

	.footer view:nth-child(1) text {
		position: absolute;
		display: block;
		width: 24rpx;
		height: 24rpx;
		overflow: hidden;
		border-radius: 50%;
		top: 20rpx;
		left: 93rpx;
		font-size: 18rpx;
		color: #ee2328;
		border: 1rpx solid #ee2328;
		text-align: center;
		line-height: 24rpx;
		background-color: #fff;
	}

	.footer view.btn {
		flex: 0 0 280rpx;
		width: 280rpx;
		background-color: #ffb629;
		color: #fff;
		font-size: 32rpx;
		text-align: center;
	}

	.footer view.btn:last-child {
		background-color: #ee2328;
	}

	.footer image {
		width: 49rpx;
		height: 37rpx;
		margin-right: 32rpx;
		transform: translateY(10rpx);
	}

	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		z-index: -1;
		background-color: rgba(0, 0, 0, 0);
		transition: all 0.3s ease;
	}

	.popup.on {
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 99;
	}

	.popup .p_main {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		transform: translateY(100%);
		color: #181818;
		font-size: 32rpx;
		transition: all 0.3s ease;
	}

	.popup.on .p_main {
		transform: translateY(0);
	}

	.p_main .p_top {
		display: flex;
		align-items: center;
		padding: 45rpx;
	}

	.p_main .p_top .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 210rpx;
		height: 210rpx;
		margin-right: 30rpx;
	}

	.p_main .p_top .img image {
		height: 100%;
	}

	.p_main .p_info view:first-child {
		width: 350rpx;
		margin-bottom: 30rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.p_main .p_info view:last-child {
		font-size: 36rpx;
		color: #ba1418;
	}

	.p_main .close {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		display: flex;
		width: 40rpx;
		height: 40rpx;
		padding: 10rpx;
	}

	.p_main .close image {
		width: 100%;
	}

	.p_main .num {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 45rpx;
		margin-bottom: 160rpx;
	}

	.num>view:last-child {
		display: flex;
		align-items: center;
	}

	.num .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		overflow: hidden;
		color: #333;
		font-size: 36rpx;
		font-weight: 600;
		border: 2rpx solid #333;

	}

	.num .btn text {
		font-size: 36rpx;
		line-height: 32rpx;
		padding: 0;
		height: 36rpx;

	}

	.num .count {
		width: 76rpx;
		text-align: center;
	}

	.p_main button {
		height: 98rpx;
		background-color: #ee2327;
		font-size: 32rpx;
		color: #fff;
		line-height: 98rpx;
		border-radius: 0;
		letter-spacing: 5rpx;
	}

	.btn.disable {
		color: #b7b7b7;
		border-color: #b7b7b7;
	}

	.border {
		position: absolute;
		height: 1rpx;
		background-color: #cdcdcd;
		transform: scaleY(0.1);
	}

	.goods_info .border {
		width: calc(750rpx - 60rpx);
		top: 80rpx;
		left: 30rpx;
	}

	.goods_detail .border {
		width: 100%;
		top: 120rpx;
		left: 0;
	}
</style>
