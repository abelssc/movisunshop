<template>
	<view>
		<common :title="$L('拼团')" :gids="gids" v-if="gids.length"></common>
		<view class="nav-container-w">
			<scroll-view class="nav-container" scroll-x :style="{backgroundImage:'url('+ bgImg +')'}">
				<view :class="'item ' + (tid==0?'on':'')" data-id="0" @tap="changeNav">{{$L('首页')}}</view>
				<view v-for="(item, index) in NavData" :key="index" :class="'item ' + (tid==item.class_id?'on':'')" :data-id="item.class_id"
				 @tap="changeNav">{{item.class_name}}</view>
			</scroll-view>
		</view>
		<view class="list">
			<navigator v-for="(item, index) in list" :key="index" hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid"
			 class="item">
				<view class="img">
					<image :src="item.sld_pic" mode="aspectFit"></image>
				</view>

				<view class="info">
					<view class="goods-name">
						<image :src="iconImg" mode="" class="icon_img"></image>
						<text class="goods_name_txt">{{item.goods_name}}</text>
					</view>
					<view class="price">
						<view class="new-price">
							<text class="small_price">{{$L('￥')}}</text><text class="big_price">{{item.show_price.toFixed(2).toString().split('.')[0]}}.</text><text
							 class="small_price">{{item.show_price.toFixed(2).toString().split('.')[1]}}</text>
						</view>
						<view class="old-price">{{$L('￥')}}{{item.goods_price}}</view>
					</view>
					<view class="group_btn_wrap">
						<view class="group_btn">
							<text class="group_btn_left">{{$L('立省')}}{{item.sheng_money.split('.')[0]}}</text>
							<view class="group_btn_right" :style="{backgroundImage:'url('+ btn_bg +')'}">{{$L('立即团')}}</view>
						</view>
						<view class="group_num">{{$L('已团')}}{{item.buyed_quantity}}{{$L('件')}}</view>
					</view>
				</view>
			</navigator>
		</view>
		<view class="empty" :style="{height: 'calc(100vh - 220rpx)'}" v-if="!list.length&& !isLoading">
			<view class="img">
				<image :src="img_url+'index/empty.png'" mode="widthFix"></image>
			</view>
			<view class="tip">{{$L('该分类暂无团购活动')}}</view>
			<text>{{$L('选择其他分类试试吧！')}}</text>
		</view>
		<view class="top_wrap" v-show="isShowTopBtn == true">
			<image :src="topImg" mode="" @click="top"></image>
		</view>
	</view>
</template>

<script>
	import request from "../../../utils/request";

	export default {
		data() {
			return {
				home_data: [],
				list: [],
				key: "",
				img_url: getApp().globalData.img_url,
				iconImg: getApp().globalData.img_url + 'addons/icon3.png',
				btn_bg: getApp().globalData.img_url + 'addons/btn_bg.png',
				topImg: getApp().globalData.img_url + 'addons/top.png',
				isShowTopBtn: false,
				bgImg: getApp().globalData.img_url + 'addons/group_bg.png',
				marginT: 0,
				tid: '',
				pn: 1,
				isLoading: true,
				NavData: '',
				gids: []
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('团购')
      });
			let key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			}

			this.initData();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getList();
			}
		},

		methods: {
			initData() {
				this.getHomeData();
				this.getList();
				this.getNavData();
			},

			getHomeData() {
				request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=topic&activity_type=tuan'
				}).then(res => {
					if (res.code == 200) {
						this.setData({
							home_data: res.datas,
							marginT: 128
						});
					}
				});
			},
			getNavData() {
				let {
					key
				} = this;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=discount&mod=getGroupBuyType'
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
					tid
				} = this;
				request({
					url: getApp().globalData.ser_url + `/index.php?app=discount&mod=tuan_goods_list&tid=${tid}&pn=${this.pn}`
				}).then(res => {
					if (res.code == 200) {
						let data = res.datas.goods;
						let gids = [];
						res.datas.goods.forEach(el => {
							gids.push(el.gid);
						});
						this.setData({
							gids
						});
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
					}
					if (this.pn == 1) {
						this.setData({
							isLoading: false
						});
					}
					if (res.hasmore) {
						this.hasmore = true;
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
	/* integral/activity/tuan_index/tuan_index.wxss */
	page {
		background-color: #F5F5F5;
		width: 750rpx;
		margin: 0 auto;
	}

	.nav-container-w {
		position: fixed;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 750rpx;
		z-index: 999
	}

	.nav-container {
		margin-top: -1px;
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
		margin-top: 23rpx;
	}

	.nav-container .item.on {
		font-weight: bold;
		font-size: 32rpx;
		padding-bottom: 8rpx;
		box-sizing: border-box;
	}

	.list {
		padding: 80rpx 20rpx 20rpx 20rpx;

	}

	.list .item {
		width: 100%;
		height: 310rpx;
		display: flex;
		border-radius: 15rpx;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.item .img {
		width: 270rpx;
		height: 270rpx;
		margin-right: 20rpx;
	}

	.item .img image {
		width: 270rpx;
		height: 270rpx;
		border-radius: 15rpx;
	}

	.item .goods-name {
		font-size: 28rpx;
		color: #2D2D2D;
		font-weight: 600;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-top: 20rpx;
		line-height: 32rpx;
		position: relative;
	}

	.goods-name .icon_img {
		width: 100rpx;
		height: 30rpx;
		margin-right: 20rpx;
		position: absolute;
		left: 0;
	}

	.goods-name .goods_name_txt {
		padding-left: 110rpx;
		font-size: 28rpx;
		line-height: 38rpx;
	}

	.item .info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.info .price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		position: absolute;
		bottom: 82rpx;
		left: 0;
	}

	.info .price .new-price {
		/* display: flex;
		align-items: flex-end; */
	}

	.new-price {
		color: #FC1C1C;
		font-weight: bold;
	}

	.new-price .small_price {
		font-size: 24rpx;
	}

	.new-price .big_price {
		font-size: 34rpx;
	}

	.old-price {
		font-size: 20rpx;
		color: #999;
		text-decoration: line-through;
		margin-left: 10rpx;
		padding-bottom: 4rpx;
	}

	.group_btn_wrap {
		width: 100%;
		position: absolute;
		bottom: 20rpx;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.group_btn {
		display: flex;
		height: 50rpx;
	}

	.group_btn .group_btn_left {
		height: 50rpx;
		display: flex;
		padding-left: 18rpx;
		align-items: center;
		background: #FFE5BE;
		color: #FE545C;
		font-size: 22rpx;
		font-weight: bold;
		padding: 0 30rpx 0 20rpx;
		border-radius: 25rpx 0 0 25rpx;
		box-sizing: border-box;
	}

	.group_btn .group_btn_right {
		width: 132rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-size: 100% 100%;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		margin-left: -25rpx;
		padding-left: 14rpx;
		box-sizing: border-box;
	}

	.group_num {
		font-size: 24rpx;
		color: #666;
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

	.empty {
		display: flex;
		width: 750rpx;
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
</style>
