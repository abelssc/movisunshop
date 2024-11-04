<template>
	<view>
		<!-- 直播/短视频 个人中心 商品模块 -->
		<scroll-view class="live_user_tab_content_scroll" scroll-y="true" @scrolltolower="getMoreGoods">
			<view>
				<view v-for="(item, index) in goodsData" :key="index" class="goods_item">
					<view class="goods_img" :data-gid="item.gid" @tap="goGoodsDetail">
						<image :src="item.goods_image" mode="aspectFit"></image>
					</view>
					<view class="right">
						<view class="top" :data-gid="item.gid" @tap="goGoodsDetail">
							<text class="name">{{item.goods_name}}</text>
							<text class="jingle">{{item.goods_jingle}}</text>
						</view>
						<view class="bottom">
							<view class="price">
								<text class="unit">{{$L('¥')}}</text>
								<text class="num">{{item.goods_price}}</text>
							</view>
							<view class="click_num">
							</view>
							<view class="click_num">
								<image class="add_cart" v-if="memberInfo.is_own!=1" :src="addCartIcon" mode="aspectFit" :data-gid="item.gid"
								 @tap="addCart"></image>
								<block v-if="memberInfo.is_own==1">
									<image class="img" :src="eyeIcon" mode="aspectFit"></image>
									<text>{{item.goods_click}}</text>
								</block>
							</view>
						</view>
					</view>
				</view>

				<!-- 数据加载完毕 -->
				<dataLoaded :showFlag="!hasmore&&goodsData.length>0" />

				<!-- 数据加载中 -->
				<dataLoading :showFlag="hasmore&&loading&&!firstLoading" />

				<!-- 页面loading -->
				<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" :topVal="467" />

				<!-- 页面空数据 -->
				<emptyData :showFlag="!firstLoading&&!goodsData.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

			</view>
			<block v-if="settingData.live_switch == 1 && memberInfo.is_own == 1">
				<view class="video_bottom"></view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import {
		checkPageHasMore
	} from "@/utils/live";
	import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	const img_url = getApp().globalData.img_url;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
		},
		data() {
			return {
				pn: 1,
				//当前页
				pageSize: 10,
				//每页数据
				loading: false,
				//数据加载状态
				goodsData: [],
				//商品数据
				addCartIcon: img_url + 'live/add_cart.png',
				eyeIcon: img_url + 'live/eye.png',
				hasmore: true,
				//是否还有数据，用于页面展示
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				img_url: getApp().globalData.img_url ,//图片地址
				stat_end:1,  //终端，默认为1，pc端
			};
		},
		props: {
			memberInfo: {
				// 用户信息
				type: Object
			},
			authorInfo: {
				// 作者信息
				type: Object
			},
			author_id: {
				// 作者id
				type: String,
				default: ''
			},
			settingData: {
				// 平台设置信息
				type: Object
			}
		},

		mounted() {
			this.getGoods();
			this.getPlatform();
		},

		methods: {
			//获取当前终端的方法
			   getPlatform(){
			    //判断终端
			    this.stat_end = 1;
			    // #ifdef H5
			    this.stat_end = 2;
			    // #endif
			    // #ifdef MP-WEIXIN
			    this.stat_end = 3;
			    // #endif
			    // #ifdef APP-PLUS
			    if(uni.getSystemInfoSync().platform == 'android'){
			     this.stat_end = 5;
			    }else if(uni.getSystemInfoSync().platform == 'ios'){
			     this.stat_end = 4;
			    }
			    // #endif
			   },
			//获取商品数据
			getGoods() {
				this.setData({
					loading: true
				});
				let {
					author_id,
					firstLoading,
					goodsData,
					pageSize,
					pn,
					hasmore
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getAuthorGoods',
					data: {
						key: uni.getStorageSync('token'),
						author_id: author_id,
						pageSize: pageSize,
						current: pn
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.goods;

						if (pn == 1) {
							goodsData = list;
						} else {
							goodsData = goodsData.concat(list);
						}

						if (checkPageHasMore(res.data.pagination)) {
							pn++;
						} else {
							hasmore = false;
						}
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						goodsData: goodsData,
						firstLoading: firstLoading,
						pn: pn
					});
				});
			},

			getMoreGoods() {
				if (this.hasmore) {
					this.getGoods();
				}
			},

			//跳转商品详情页
			goGoodsDetail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					let page = getCurrentPages();
					let len = page.length;

					if (len > 4) {
						uni.redirectTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					} else {
						uni.navigateTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					}
				}
			},

			//加入购物车事件
			addCart(e) {
				let gid = e.currentTarget.dataset.gid;
				let {
					author_id
				} = this;

				if (uni.getStorageSync('token')) {
					request({
						url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						method: 'POST',
						data: {
							to_auhtor_id: author_id,
							key: uni.getStorageSync('token'),
							gid: gid,
							quantity: 1,
							stat_end:this.stat_end
						}
					}).then(res => {
						if (res.datas.status) {
							uni.showToast({
								title: this.$L('加入购物车成功'),
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: res.datas.msg,
								icon: 'none'
							});
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: this.$L('需要登录才能操作'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: res => {
							if (res.confirm) {
								getApp().globalData.goLogin();
							}
						}
					});
				}
			}

		}
	};
</script>
<style>
	.live_user_tab_content_scroll {
		height: calc(100vh - 467rpx);
	}

	.goods_item {
		width: 670rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 14rpx;
		height: 236rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20rpx;
		margin-left: 20rpx;
		box-sizing: content-box;
	}

	.goods_item .goods_img {
		width: 236rpx;
		height: 236rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.goods_item .goods_img image {
		max-height: 100%;
		max-width: 100%;
		border-radius: 15rpx;
	}

	.goods_item .right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		height: 216rpx;
		padding: 10rpx 20rpx;
	}

	.goods_item .right .top {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.goods_item .right .top .name {
		color: #2d2d2d;
		font-size: 28rpx;
		line-height: 42rpx;
		height: 84rpx;
		width: 414rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.goods_item .right .top .jingle {
		color: #949494;
		font-size: 26rpx;
		line-height: 36rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 10rpx;
		width: 414rpx;
	}

	.goods_item .right .bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		width: 414rpx;
	}

	.goods_item .right .bottom .price .unit {
		color: #fc1c1c;
		font-size: 24rpx;
	}

	.goods_item .right .bottom .price .num {
		font-size: 36rpx;
		color: #fc1c1c;
		margin-left: 3rpx;
	}

	.goods_item .right .bottom .click_num {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.goods_item .right .bottom .click_num .add_cart {
		width: 42rpx;
		height: 42rpx;
	}

	.goods_item .right .bottom .click_num image {
		width: 42rpx;
		height: 42rpx;
	}

	.goods_item .right .bottom .click_num text {
		color: #949494;
		font-size: 22rpx;
	}
	
	.video_bottom {
		height:161rpx;width:750rpx
	}
	/* #ifdef H5 */
	.video_bottom{
		height:261rpx;
	}
	/* #endif */
	
</style>
