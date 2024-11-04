<template>
	<view>
		<!-- <DiyPage :sourceData="home_info" v-if="home_info.length"></DiyPage> -->
		
		<!-- <scroll-view class="nav-container" scroll-x :style="{backgroundImage:'url('+ bgImg +')'}">
			<view :class="'item ' + (tid==0?'on':'')" data-id="0" @tap="changeNav">首页</view>
			<view v-for="(item, index) in NavData" :key="index" :class="'item ' + (tid==item.id?'on':'')" :data-id="item.id"
			 @tap="changeNav">{{item.sld_typename}}</view>
		</scroll-view> -->
		<view class="goods-list" v-if="goodsList.length" :style="'padding-bottom:'+bottomSateArea">
			<navigator v-for="(item, index) in goodsList" :key="index" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid"
			 hover-class="none" class="item">
				<view class="img">
					<image :src="item.goods_image_url" mode="aspectFit"></image>
				</view>
				<view class="info">
					<view class="goods-name">{{item.goods_name}}</view>
					<view class="other">
						<view class="zk">
							<view :style="{backgroundImage:'url(' +img_url + 'addons/limited_discount.png)'}" class="dis">{{$L('限时折扣')}}</view>
							<text class="discount_text">{{item.xianshi_discount}}</text>
						</view>
						<view class="price">
							<view class="discount_price_wrap">
								<view class="now_price">
									<text class="small_price">{{$L('￥')}}</text>
									<text class="big_price">{{item.promotion_price.split('.')[0]}}.</text>
									<text class="small_price">{{item.promotion_price.split('.')[1]}}</text>
								</view>
								<view class="del">{{$L('￥')}}{{item.goods_marketprice}}</view>
							</view>
							<view class="buy-btn">{{$L('马上抢')}}</view>
						</view>
					</view>
				</view>
			</navigator>
		</view>

		<view class="empty" v-if="!goodsList.length && !isLoading">
			<view class="img">
				<image :src="img_url+'index/empty.png'" mode="widthFix"></image>
			</view>
			<view class="tip">{{$L('没有找到限时折扣活动')}}</view>
		</view>
		<view class="top_wrap" v-show="isShowTopBtn == true">
			<image :src="topImg" mode="" @click="top"></image>
		</view>
		<common :title="$L('限时折扣')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>
	import request from "../../../utils/request";

	export default {
		data() {
			return {
				key: '',
				isLoading: true,
				NavData: "",
				home_info: [],
				goodsList: "",
				pn: 1,
				hasmore: true,
				img_url: getApp().globalData.img_url,
				bgImg:getApp().globalData.img_url+'addons/presale_bg.png',
				topImg:getApp().globalData.img_url+'addons/top.png',
				isShowTopBtn:false,
				bottomSateArea: getApp().globalData.bottomSateArea, //iphone手机底部一条黑线的高度
				gids:[]
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('限时折扣')
      });
			var key = uni.getStorageSync('token') || '';

			this.setData({ ...options,
				key
			});
			this.initData();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getList();
			}
		},

		methods: {
			initData() {
				this.getList();
				this.getNavData();
				// this.getDiyData();
			},
			getNavData() {
				let {
					key
				} = this;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=index&sld_addons=pin'
				}).then(res => {
					if (res.code == 200) {
						this.setData({
							NavData: res.datas.types
						});
					}
				});
			},
			getDiyData() {
				request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=topic&activity_type=xianshi'
				}).then(res => {
					if (res.datas.length) {
						this.setData({
							home_info: res.datas
						});
					}
				});
			},

			getList() {
				request({
					url: getApp().globalData.ser_url + '/index.php?app=discount&mod=xianshi_goods_list&pn=' + this.pn
				}).then(res => {

					if (res.code == 200) {
						if (this.pn == 1) {
							this.setData({
								isLoading: false
							});
						}
                        let gids = [];
						res.datas.goods.forEach(el => {
							gids.push(el.gid);
						});
						this.setData({
							gids
						});
						let list = res.datas.goods;

						if (this.pn == 1) {
							this.setData({
								goodsList: list
							});
						} else {
							let {
								goodsList
							} = this;
							this.setData({
								goodsList: goodsList.concat(list)
							});
						}
					}

					if (res.hasmore) {
						this.pn++;
					} else {
						this.hasmore = false;
					}
				}).catch(err => {
					if (this.pn == 1) {
						this.setData({
							isLoading: false
						});
					}
				});
			},
			// 获取滚动距离
			onPageScroll(e){ //根据距离顶部距离是否显示回到顶部按钮
				if(e.scrollTop>600){ //当距离大于600时显示回到顶部按钮
					this.isShowTopBtn = true
				}else{ //当距离小于600时隐藏回到顶部按钮
					this.isShowTopBtn = false
				}
			},
			// 回到顶部
			top(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		}
	};
</script>
<style>
	/* integral/activity/discount/discount.wxss */

	page {
		background-color: #f5f5f5;
		width: 750rpx;
		margin: 0 auto;
	}
	.nav-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 88rpx;
		overflow: hidden;
		white-space: nowrap;
		z-index: 999;
		background-size: 100% 100%;
	}
	
	.nav-container .item {
		display: inline-block;
		color: #fff;
		font-size: 30rpx;
		margin: 0 30rpx;
		line-height: 40rpx;
		margin-top:20rpx;
	}
	
	.nav-container .item.on {
		font-weight: bold;
		border-bottom: 4rpx solid #fff;
		padding-bottom:8rpx;
		box-sizing: border-box;
	}
	.goods-list {
		padding:0 20rpx;
	}

	.item {
		width:100%;
		height:310rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		margin-top:20rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.item .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 270rpx;
		height: 270rpx;
		border-radius: 15rpx;
	}

	.item .img image {
		width: 100%;
		height: 100%;
		border-radius: 15rpx;
	}

	.item .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 270rpx;
		padding-left: 20rpx;
	}

	.item .info .goods-name {
		height: 84rpx;
		font-weight: 600;
		margin-top:20rpx;
		line-height: 42rpx;
		color: #232326;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.item .other .zk {
		display: flex;
		align-items: center;
		height: 40rpx;
		line-height: 38rpx;
		text-align: center;
		overflow: hidden;
	}
	.discount_price_wrap{
		display: flex;
		flex-direction: column;
	}
	.now_price{
		font-size: #9818FB;
		font-weight: bold;
	}
	.now_price .big_price{
		font-size:34rpx;
	}
	.now_price .small_price{
		font-size:24rpx;
	}
	.other .zk .dis {
		width: 126rpx;
		height: 40rpx;
		background-size: 100% 100%;
		font-size: 24rpx;
		text-align: center;
		color: #fff;
		border-radius: 20rpx 0 0 20rpx;
		line-height: 40rpx;
	}

	.other .zk .discount_text {
		width: 102rpx;
		height: 40rpx;
		font-size:24rpx;
		color: #C901DB;
		box-sizing: border-box;
		border:1rpx solid #C901DB;
		border-left: none;
		border-radius: 0 20rpx 20rpx 0;
		margin-left: -15rpx;
		line-height: 40rpx;
	}

	.other .price {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		color: #ac1fe0;
		font-size: 32rpx;
	}

	.buy-btn {
		width: 130rpx;
		height: 50rpx;
		border-radius: 30rpx;
		background-color: #9917FA;
		font-size: 26rpx;
		color: #fff;
		text-align: center;
		line-height: 50rpx;
		margin-top: 15rpx;
	}

	.other .price .del {
		color:#999999;
		font-size: 24rpx;
		text-decoration: line-through;
	}

	.empty {
		display: flex;
		width: 750rpx;
		height: 100vh;
		flex-direction: column;
		align-items: center;
		/* justify-content: center; */
		margin-top: 200rpx;
	}

	.empty .img {
		width: 210rpx;
		height: 210rpx;
		background-color: #ddd;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty .img image {
		width: 210rpx;
		height: 210rpx;
	}

	.empty .tip {
		color: #000;
		font-size: 30rpx;
		margin: 30rpx 0;
	}

	.empty text {
		font-size: 26rpx;
		color: #999;
	}
	.top_wrap{
		position: fixed;
		right:46rpx;
		bottom:66rpx;
		width:85rpx;
		height:85rpx;
	}
	.top_wrap image{
		width:85rpx;
		height:85rpx;
	}
</style>
