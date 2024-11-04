<template>
	<view>
		<common :title="$L('拼团')" :gids="gids" v-if="gids.length"></common>

		<scroll-view class="nav-container" scroll-x :style="{backgroundImage:'url('+ bgImg +')'}">
			<view :class="'item ' + (tid==0?'on':'')" data-id="0" @tap="changeNav">{{$L('首页')}}</view>
			<view v-for="(item, index) in NavData" :key="index" :class="'item ' + (tid==item.id?'on':'')" :data-id="item.id"
			 @tap="changeNav">{{item.sld_typename}}</view>
		</scroll-view>

		<view class="goods-list" v-if="goodsList.length" :style="'padding-bottom:'+bottomSateArea">
			<view v-for="(item, index) in goodsList" :key="index" class="item">
				<view class="goods-list-top">
					<view class="img">
						<image :src="item.sld_pic" mode="aspectFit"></image>
					</view>

					<view class="goods-info">
						<view class="info">
							<view class="goods_nameBox">
								<text class="goods_nameText">{{item.goods_name}}</text>
							</view>
							<view class="p">{{$L('已参与')}}{{item.incom_num}}{{$L('人')}}</view>
							<view class="goods_price_wrap">
								<view class="now_price">
									<text class="small_price">{{$L('￥')}}</text><text class="big_price">{{item.sld_pin_price.toFixed(2).toString().split('.')[0]}}.</text><text
									 class="small_price">{{item.sld_pin_price.toFixed(2).toString().split('.')[1]}}</text>
								</view>
								<view class="old_price">{{$L('￥')}}{{item.goods_price}}</view>
							</view>
							<navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.gid" hover-class="none">
								<view class="group_num_wrap">
									<image :src="iconImg" mode="" class="iconImg"></image>
									<text>{{item.sld_team_count}}{{$L('人团')}}</text>
								</view>
								<view class="go_to_group">{{$L('去拼团')}}</view>
							</navigator>
						</view>
					</view>
				</view>

				<view class="activity-info">
					<image :src="saveImg" mode="" class="save_img"></image>
					<text class="group_bottom_text">{{$L('拼团购买立省')}}{{item.sheng}},{{$L('团长返')}}{{item.sld_return_leader}}{{$L('元;单独购买价')}}{{item.goods_price}}</text>
				</view>
			</view>
		</view>

		<view class="empty" v-if="!goodsList.length && !isLoading">
			<view class="img">
				<image :src="img_url+'index/empty.png'" mode="widthFix"></image>
			</view>
			<view class="tip">{{$L('该分类暂无拼团活动')}}</view>
			<text>{{$L('选择其他分类试试吧！')}}</text>
		</view>

		<view class="top_wrap" v-show="isShowTopBtn == true">
			<image :src="topImg" mode="" @click="top"></image>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";

	export default {
		data() {
			return {
				key: '',
				tid: '',
				isLoading: true,
				NavData: "",
				goodsList: "",
				pn: 1,
				hasmore: true,
				img_url: getApp().globalData.img_url,
				bgImg: getApp().globalData.img_url + 'addons/group_bg.png',
				iconImg: getApp().globalData.img_url + 'addons/icon.png',
				saveImg: getApp().globalData.img_url + 'addons/save.png',
				topImg: getApp().globalData.img_url + 'addons/top.png',
				isShowTopBtn: false,
				bottomSateArea: getApp().globalData.bottomSateArea, //iphone手机底部一条黑线的高度
				gids: []
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('拼团列表')
      });
			var key = uni.getStorageSync('token') || '';

			this.setData({
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
				this.getNavData();
				this.getList();
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

			getList() {
				let {
					key,
					tid
				} = this;
				request({
					url: getApp().globalData.ser_url + `/index.php?app=index&mod=data&sld_addons=pin&tid=${tid}&pn=${this.pn}`,
					loading: this.pn == 1
				}).then(res => {
					if (res.code == 200) {
						let list = res.datas.goods;
						let gids = [];
						res.datas.goods.forEach(el => {
							gids.push(el.gid);
						});
						this.setData({
							gids
						});
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

					if (this.pn == 1) {
						this.setData({
							isLoading: false
						});
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

			changeNav(e) {
				let newTid = e.currentTarget.dataset.id;
				let {
					tid
				} = this;
				if (newTid == tid) return;
				this.pn = 1;
				this.hasmore = true;
				this.setData({
					tid: newTid
				});
				this.getList();
			},
			// 获取滚动距离
			onPageScroll(e) { //根据距离顶部距离是否显示回到顶部按钮
				if (e.scrollTop > 600) { //当距离大于600时显示回到顶部按钮
					this.isShowTopBtn = true
				} else { //当距离小于600时隐藏回到顶部按钮
					this.isShowTopBtn = false
				}
			},
			// 回到顶部
			top() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		}
	};
</script>
<style>
	/* integral/activity/pin_index/pin_index.wxss */

	page {
		background-color: #f5f5f5;
		/* padding-top: 90rpx; */
		width: 750rpx;
		margin: 0 auto;
	}

	/* #ifdef H5 */
	page {
		padding-top: 0rpx;
	}

	/* #endif */

	.nav-container {
		position: fixed;
		top: 0rpx;
		/* #ifdef H5 */
		top: 86rpx;
		/* #endif */
		left: 0;
		width: 750rpx;
		height: 88rpx;
		overflow: hidden;
		white-space: nowrap;
		z-index: 999;
		background-size: 100% 100%;
		right: 0;
		margin: 0 auto;
	}

	.nav-container .item {
		display: inline-block;
		color: #fff;
		font-size: 30rpx;
		margin: 0 30rpx;
		line-height: 40rpx;
		margin-top: 25rpx;

	}

	.nav-container .item.on {
		font-weight: bold;
		font-size: 32rpx;
		padding-bottom: 8rpx;
		box-sizing: border-box;
	}

	.goods-list {
		padding: 0 20rpx;
		position: relative;
	    top: 45px;
	}

	.goods-list .item {
		height: 382rpx;
		display: flex;
		flex-direction: column;
		border-radius: 15rpx;
		box-sizing: border-box;
		background-color: #fff;
		font-size: 24rpx;
		color: #999;
		margin-top: 20rpx;
		padding: 20rpx 20rpx 0 20rpx;
	}

	.goods-list-top .img {
		position: relative;
		width: 270rpx;
		height: 270rpx;
		margin-right: 20rpx;
		background-color: #f8f8f8;
		border-radius: 15rpx;
	}

	.img image {
		width: 270rpx;
		height: 270rpx;
		border-radius: 15rpx;
	}

	.img .activity-info {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		width: 120rpx;
		height: 80rpx;
		background-color: #EF1B21;
		border-radius: 4rpx;
		color: #fff;
		line-height: 30rpx;
		text-align: center;
	}

	.goods-list .item {
		display: flex;
		flex-direction: column;
	}

	.goods-list-top {
		display: flex;
	}

	.activity-info .t {
		display: block;
		margin: 6rpx;
		height: 36rpx;
		line-height: 36rpx;
		color: #EF1B21;
		background-color: #fff;
	}

	.goods-info {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.goods-info .info view {
		margin-bottom: 5rpx;
	}

	.goods-info .goods_price_wrap {
		display: flex;
		align-items: flex-end;
		margin-top: 30rpx;
	}

	.goods_price_wrap .now_price {
		/* display: flex; */
		font-size: 24rpx;
		font-weight: 600;
		color: #FC1C1C;
		font-weight: bold;
	}

	.now_price .big_price {
		font-size: 34rpx;

	}

	.goods-info .info .old_price {
		color: #9A9A9A;
		font-size: 20rpx;
		margin-left: 10rpx;
		text-decoration: line-through;
		padding-bottom: 4rpx;
	}

	.goods-info .info .p {
		font-size: 24rpx;
		color: #666;
		display: flex;
		align-items: center;
	}

	.goods-info .p .line {
		display: block;
		width: 1rpx;
		height: 20rpx;
		margin: 0 15rpx;
		background-color: #999;
	}

	.goods-info navigator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280rpx;
		height: 50rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 38rpx;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.group_num_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 150rpx;
		height: 46rpx;
		color: #FC1C1C;
		font-size: 25rpx;
		border-radius: 25rpx 0 0 25rpx;
		border: 1rpx solid #FC1C1C;
		padding-right: 10px;
	}

	.goods-info .iconImg {
		width: 31rpx;
		height: 27rpx;
		margin-right: 10rpx;
	}

	.go_to_group {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 148rpx;
		height: 50rpx;
		font-size: 26rpx;
		color: #fff;
		background-color: #FC1C1C;
		border-radius: 0 25rpx 25rpx 25rpx;
		margin-left: -30rpx;
	}

	.empty {
		display: flex;
		width: 750rpx;
		height: calc(100vh - 100rpx);
		flex-direction: column;
		align-items: center;
		/* justify-content: center; */
		margin-top: 200rpx;
	}

	.empty .img {
		width: 210rpx;
		height: 210rpx;
		background-color: #DDD;
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

	.goods_nameBox {
		margin-top: 20rpx;
	}

	.goods_nameText {
		color: #2E2E2E;
		font-size: 29rpx;
		font-weight: 600;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.activity-info {
		width: 100%;
		height: 70rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		margin-top: 20rpx;
		border-top: 1rpx solid #F2F2F2;
	}

	.activity-info .save_img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.top_wrap {
		position: fixed;
		right: 46rpx;
		bottom: 66rpx;
		width: 85rpx;
		height: 85rpx;
	}

	.top_wrap image {
		width: 85rpx;
		height: 85rpx;
	}

	.group_bottom_text {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
