<template>
	<view>

		<image class="bg" :src="img_url+'live/list_bg.png'"></image>
		<view class="search" @tap="goSearch">
			<view class="left">
				<image :src="img_url+'live/search_icon.png'" mode="aspectFit"></image>
				<text>{{$L('请输入关键词')}}</text>
			</view>
			<text class="search_text">{{$L('搜索')}}</text>
		</view>
		<scroll-view scroll-x class="nav" v-if="labelList&&labelList.length">
			<view v-for="(item, index) in labelList" :key="index" :class="'nav_item ' + (curLabelId==item.label_id?'on':'')"
			 @tap="changeLabel" :data-id="item.label_id">
				<text>{{item.label_name}}</text>
			</view>
		</scroll-view>
		<scroll-view scroll-y class="live_list" v-if="labelList&&labelList.length" @scrolltolower="getMoreData">

			<!-- 直播列表item -->
			<listLiveItem :liveList="liveList" :bgStyle="bgStyle" :listPlayBackIcon="img_url+'live/list_playback.png'"
			 :listLivingIcon="img_url+'live/list_living.gif'" :heartIcon="img_url+'live/live_list_heart.gif'" />

			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&liveList&&liveList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="!firstLoading&&hasmore&&loading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&liveList&&!liveList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />


			<view class="empty_h"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		checkPageHasMore,
		initNum
	} from "@/utils/live";
	import request from "@/utils/request";
	const bus = getApp().globalData.bus;
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import listLiveItem from "@/addons/templates/live/listLiveItem.vue";

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			listLiveItem
		},
		data() {
			return {
				labelList: [],
				//标签列表
				liveList: [],
				//直播列表
				curLabelId: '',
				//当前选中的标签id
				img_url: getApp().globalData.img_url,
				//图片地址
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;',
				//背景图片样式
				firstLoading: true, //是否初次加载，是的话展示页面居中的loading效果，
				pageSize: 10,
				pn: 1
			};
		},	

		props: {},
		//是否还有数据

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('直播列表')
      });
			this.getLabelList();
		},
		onShow: function() {
			this.getLabelList();
			let _this = this; //直播结束直接从列表中移除
			bus.on('updateLiveList', data => {
				let {
					liveList
				} = this;

				if (data.type == 'live_stop') {
					let index = liveList.findIndex(el => el.live_id == data.live_id);
					liveList.splice(index, 1);
					this.setData({
						liveList: _this.liveList
					});
				}
			});
			bus.on('downLive',() => {
				let {curLabelId} = this;
				this.getLiveList(curLabelId);
			});
		},
		methods: {
			// 获取直播分类
			getLabelList() {
				let {
					curLabelId
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getValidLabel&type=2'
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.label; //获取第一个分类下的数据

						if (list.length > 0) {
							curLabelId = list[0].label_id;
							this.getLiveList(curLabelId);
						}

						this.setData({
							labelList: list,
							curLabelId: curLabelId
						});
					}
				});
			},

			//获取直播列表
			getLiveList(label_id) {
				this.setData({
					loading: true
				});
				let {
					liveList,
					hasmore,
					firstLoading
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=index',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						label_id: label_id
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.list;

						if (this.pn == 1) {
							liveList = list;
						} else {
							liveList = liveList.concat(list);
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
						liveList: liveList,
						firstLoading: firstLoading
					});
				});
			},

			//标签点击事件
			changeLabel(e) {
				let id = e.currentTarget.dataset.id;
				let {
					curLabelId
				} = this;
				if (curLabelId == id) return;
				this.setData({
					curLabelId: id,
					firstLoading: true,
					liveList: []
				});
				this.pn = 1;
				this.hasmore = true;
				this.getLiveList(id);
			},

			getMoreData: function() {
				if (this.hasmore) {
					this.getLiveList(this.curLabelId);
				}
			},
			//跳转搜索页面
			goSearch: function() {
				uni.navigateTo({
					url: '../liveSearch/liveSearch'
				});
			},

		}
	};
</script>
<style>
	page {
		background-color: #f2f2f2;
		width: 750rpx;
		margin: 0 auto;
	}

	.nav {
		position: fixed;
		/* #ifdef H5 */
		top: 160rpx;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		top: 80rpx;
		/* #endif */
		left: 0;
		width: 750rpx;
		height: 80rpx;
		background-color: 'transpanrent';
		display: block;
		white-space: nowrap;
		overflow: hidden;
		z-index: 9999;
		right: 0;
		margin: 0 auto;
	}

	.empty_h {
		height: 170rpx;
		width: 100%;
		background-color: 'transpanrent';
	}

	.search {
		position: fixed;
		/* #ifdef H5 */
		top: 100rpx;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		top: 20rpx;
		/* #endif */
		left: 0;
		width: 710rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 20rpx 0 20rpx;
		background: transpanrent;
		right: 0;
		margin: 0 auto;
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

	.search .left text {
		color: #fff;
		font-size: 24rpx;
		margin-top: -2rpx;
	}

	.search .search_text {
		font-size: 26rpx;
		color: #fff;
	}

	.nav_item {
		display: inline-block;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		padding: 0 25rpx;
		font-weight: 600;
	}

	.nav_item.on text {
		display: inline-block;
		line-height: 76rpx;
		border-bottom: 4rpx solid #fff;
		font-weight: 700;
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 468rpx;
		z-index: 0;
		right: 0 ;
		margin: 0 auto;
	}

	.live_list {
		width: 750rpx;
		background-color: transparent;
		position: fixed;
		/* #ifdef H5 */
		height: calc(100vh - 100rpx);
		top: 260rpx;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		height: 100vh;
		top: 180rpx;
		/* #endif */
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0 auto;
	}
</style>
