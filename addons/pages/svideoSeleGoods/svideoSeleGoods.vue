<template>
	<view>
		<view class="sele_goods">
			<view class="header" :style="'background:url('+img_url+'live/sel_goods_bg.png'+') no-repeat center;background-size:cover;'">
				<view class="header_nav">
					<view class="go_back_wrap" @tap="goBack">
						<image class="go_back" :src="img_url+'white_arrow_l.png'"></image>
					</view>
					<text class="title">{{$L('商品选择')}}</text>
				</view>
				<view class="search">
					<view class="left">
						<image :src="img_url+'live/search_icon.png'" mode="aspectFit"></image>
						<input confirm-type="search" class="sea_input" type="text" :value="goods_name" @input="input" :placeholder="$L('请输入关键词')"
						 placeholder-style="font-size:24rpx;color:#fff;" @confirm="inConfirm"></input>
					</view>
					<text v-if="!goods_name" class="search_text" @tap="inConfirm">{{$L('搜索')}}</text>
					<text v-if="goods_name" class="search_text" @tap="cancleSearch">{{$L('取消')}}</text>
				</view>
			</view>
			<scroll-view class="main mainh"  scroll-y @scrolltolower="getMoreData">
				<view class="main_wrap" v-if="list.length">
					<view v-for="(item, index) in list" :key="index" class="sel_goods_item" @tap="operateGoods(item)">
						<view class="goods_image" :style="'background:url('+item.goods_image+') no-repeat center;' + bgStyle"></view>
						<text class="goods_name">{{item.goods_name}}</text>
						<view class="goods_detail">
							<view class="goods_price">
								<text class="unit">{{$L('¥')}}</text>
								<text class="price_num">{{item.goods_price}}</text>
							</view>
							<image class="goods_sele" :src="img_url+(item.is_sel!=undefined&&item.is_sel?'live/goods_sel.png':'live/goods_unsel.png')"></image>
						</view>
					</view>
				</view>
				<!-- 数据加载完毕 -->
				<dataLoaded :showFlag="!hasmore&&list.length>0" />

				<!-- 数据加载中 -->
				<dataLoading :showFlag="!firstLoading&&hasmore&&loading" />

				<!-- 页面loading -->
				<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

				<!-- 页面空数据 -->
				<emptyData :showFlag="!firstLoading&&!list.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

				<view class="empty_h" v-if="goods_ids.length"></view>
			</scroll-view>

			<view class="footer" v-if="goods_ids.length">
				<view class="total_tip">
					<text class="total_tip_text">{{$L('已选')}}</text>
					<text class="total_tip_text total_num">{{goods_ids.length}}</text>
					<text class="total_tip_text">{{$L('件商品')}}</text>
					<text v-if="maxNum*1>0" class="total_tip_text">({{$L('最多可选')}}{{maxNum}}{{$L('件商品')}})</text>
				</view>
				<text class="confirm_btn" @tap="confirmSelGoods">{{$L('确认')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	import {
		checkPageHasMore,
		initNum
	} from "@/utils/live";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";

	const bus = getApp().globalData.bus;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
		},
		data() {
			return {
				img_url: getApp().globalData.img_url,
				//图片地址
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;',
				//背景图片样式
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				list: [],
				goods_name: '',
				// 搜索关键词
				goodsList: [],
				// 已选择的商品
				goods_ids: [],
				// 已选择的商品id
				maxNum: '',
				pn: 1,
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let params = JSON.parse(options.params);
			this.setData({
				maxNum: params.max_num,
				goods_ids: params.goods_ids
			});
			this.getList();
		},
		methods: {
			//获取商品列表
			getList() {
				this.setData({
					loading: true
				});
				let {
					list,
					hasmore,
					goods_name,
					firstLoading,
					goods_ids,
					goodsList
				} = this;
				let params = {
					pageSize: this.pageSize,
					current: this.pn,
					key: uni.getStorageSync('token'),
					pageSize: 10
				};

				if (goods_name) {
					params.goods_name = goods_name;
				}

				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getBindGoods',
					data: params
				}).then(res => {
					if (res.state == 200) {
						let tmp_list = res.data.list;

						if (this.pn == 1) {
							list = tmp_list;
						} else {
							list = list.concat(tmp_list);
						}

						goodsList = [];

						for (let i = 0; i < list.length; i++) {
							if (goods_ids.indexOf(list[i].gid) > -1) {
								list[i].is_sel = true;
								goodsList.push(list[i]);
							}
						}

						if (checkPageHasMore(res.data.pagination)) {
							this.pn++;
						} else {
							this.hasmore = false;
							hasmore = false;
						}
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						list: list,
						firstLoading: firstLoading,
						goodsList: goodsList,
						goods_ids: goods_ids
					});
				});
			},

			getMoreData: function() {
				if (this.hasmore) {
					this.getList();
				}
			},

			input(e) {
				this.setData({
					goods_name: e.detail.value
				});
			},

			//点击弹起的键盘按钮时触发
			inConfirm: function(e) {
				this.pn = 1;
				this.hasmore = true;
				this.setData({
					hasmore: true,
					firstLoading: true
				});
				this.getList();
			},

			//取消搜索
			cancleSearch() {
				this.setData({
					goods_name: ''
				});
				this.inConfirm();
			},

			// 选择商品
			operateGoods(item) {
				let {
					goodsList,
					goods_ids,
					maxNum,
					list
				} = this;
				let index = goods_ids.findIndex(el => el == item.gid);
				let index2 = goodsList.findIndex(el => el.gid == item.gid);
				let cur_goods = list.filter(el => el.gid == item.gid)[0];

				if (index > -1) {
					goods_ids.splice(index, 1);
					goodsList.splice(index2, 1);
					cur_goods.is_sel = false;
				} else {
					if (goods_ids.length >= maxNum && maxNum > 0) {
						uni.showToast({
							title: `${this.$L('最多能选择')}${maxNum}${this.$L('件商品')}`,
							icon: 'none'
						});
						return;
					}

					goods_ids.push(item.gid);
					goodsList.push(item);
					cur_goods.is_sel = true;
				}

				this.setData({
					goodsList,
					goods_ids,
					list
				});
			},

			//确认选择商品
			confirmSelGoods() {
				let {
					goodsList,
					goods_ids
				} = this;
				const pages = getCurrentPages(); //获取页面栈

				const beforePage = pages[pages.length - 2]; //前一个页面

				uni.navigateBack({
					success: function() {
						//调用前一个页面的方法updateData() 通知上一页更新选择的商品
						beforePage.$vm.updateData({
							goods_ids: goods_ids,
							goodsList: goodsList
						});
					}
				});
			},

			// 返回上级页面
			goBack() {
				uni.navigateBack({});
			}

		}
	};
</script>
<style>
	page {
		background: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
	}

	.sele_goods {
		width: 750rpx;
		height: 100vh;
		position: relative;
	}

	.sele_goods .header {
		position: absolute;
		z-index: 2;
		width: 750rpx;
		height: calc(var(--status-bar-height) + 200rpx);
	}

	.header_nav {
		position: absolute;
		top: calc(var(--status-bar-height) + 30rpx);
		left: 20rpx;
		right: 0;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80rpx;
	}

	.header_nav .go_back_wrap {
		position: absolute;
		left: 0;
		width: 80rpx;
		height: 47rpx;
	}

	.header_nav .go_back {
		width: 45rpx;
		height: 47rpx;
	}

	.header_nav .title {
		color: #fff;
		font-size: 34rpx;
		font-weight: bold;
	}

	.search {
		position: absolute;
		/* position: fixed; */
		top: calc(var(--status-bar-height) + 120rpx);
		left: 0;
		width: 710rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0 20rpx;
		background: transpanrent;
	}

	.search .left {
		width: 639rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background: rgba(255, 255, 255, 0.2);
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.search .left image {
		width: 50rpx;
		height: 50rpx;
		margin-top: 2rpx;
		margin-left: 10rpx;
	}

	.search .left .sea_input {
		color: #fff;
		font-size: 24rpx;
		margin-top: -2rpx;
		width: 540rpx;
	}

	.search .search_text {
		font-size: 26rpx;
		color: #fff;
	}

	.main {
		position: fixed;
		z-index: 2;
		/* #ifdef H5 */
		top: 220rpx;
		/* #endif */
		/* #ifdef MP */
		top: 250rpx;
		/* height: calc(100vh - 290rpx); */
		/* #endif */
		/* #ifdef APP-PLUS */
		top: 280rpx;
		/* #endif */
		width: calc(750rpx - 40rpx);
		padding: 0 20rpx;
	}
	.mainh{
		/* #ifdef H5 */
		height: calc(100vh - 260rpx);
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		height: calc(100vh - 290rpx);
		/* #endif */
	}

	.main .main_wrap {
		width: 710rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.main .sel_goods_item {
		width: 345rpx;
		height: 474rpx;
		background: #fff;
		border-radius: 14rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: 20rpx;
	}

	.main .sel_goods_item .goods_image {
		width: 345rpx;
		height: 345rpx;
		border-radius: 14rpx 14rpx 0 0;
	}

	.main .sel_goods_item .goods_name {
		color: #2d2d2d;
		font-size: 26rpx;
		line-height: 36rpx;
		padding: 0 20rpx;
		width: 305rpx;
		height: 72rpx;
		margin-top: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.main .sel_goods_item .goods_detail {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 10rpx 0 20rpx;
		width: 315rpx;
	}

	.main .sel_goods_item .goods_detail .goods_price {
		color: #e1251b;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		letter-spacing: 2rpx;
	}

	.main .sel_goods_item .goods_detail .goods_price .unit {
		font-size: 24rpx;
	}

	.main .sel_goods_item .goods_detail .goods_price .price_num {
		font-weight: bold;
		font-size: 34rpx;
	}

	.main .sel_goods_item .goods_detail .goods_sele {
		width: 50rpx;
		height: 50rpx;
	}

	.sele_goods .footer {
		width: 750rpx;
		height: 205rpx;
		position: absolute;
		/* position: fixed; */
		z-index: 3;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0px 0px 9px 1px rgba(86, 86, 86, 0.2);
		border-radius: 15rpx 15px 0 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background: #fff;
	}

	.sele_goods .footer .total_tip {
		width: 690rpx;
		height: 110rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.sele_goods .footer .total_tip .total_tip_text {
		color: #2D2D2D;
		font-size: 28rpx;
	}

	.sele_goods .footer .total_tip .total_tip_text.total_num {
		color: #FC1C1C;
	}

	.sele_goods .footer .confirm_btn {
		letter-spacing: 5rpx;
		width: 580rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(255, 36, 67, 1) 0%, rgba(255, 122, 0, 1) 100%);
		box-shadow: 0px 3rpx 10rpx 0px rgba(255, 13, 0, 0.26);
		border-radius: 35rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
	}

	.empty_h {
		height: 185rpx;
		width: 100%;
		background-color: 'transpanrent';
	}
</style>
