<template>
	<view>
		<image class="bg" :src="img_url+'live/list_bg.png'"></image>
		<scroll-view scroll-y class="live_list" @scrolltolower="getMoreData">
			<view v-if="theme_img" class="rec_svideo">
				<image class="rec_img" :src="theme_img" mode="aspectFill">
				</image>
			</view>

			<!-- 短视频列表item -->
			<listVideoItem :videoList="videoList" :bgStyle="bgStyle" :listFavIcon="img_url+'svideo/fav.png'" :listPlayNum="img_url+'svideo/play_num.png'" />
			
			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&videoList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading" />
			
			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&!videoList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

			<view class="empty_h"></view>
		</scroll-view>
	</view>
</template>

<script>
	//短视频-推荐主题页面
	import {
		checkPageHasMore,
		initNum
	} from "../../../utils/live";
	import listVideoItem from "@/addons/templates/svideo/listVideoItem.vue";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import request from "../../../utils/request";

	export default {
		data() {
			return {
				theme_img: '',// 主题图片
				theme_id: '',
				videoList: [],//短视频列表
				img_url: getApp().globalData.img_url,//图片地址
				hasmore: true,//是否还有数据，用于页面展示
				loading: false,
				pn:1,
				bgStyle: 'background-size:cover;background-position:center center;background-repeat: no-repeat;',//背景图片样式
				firstLoading: true //是否初次加载，是的话展示页面居中的loading效果，
			};
		},

		components: {
			listVideoItem,
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
		},
		props: {},
		//是否还有数据

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('推荐主题')
      });
			this.setData({ ...options
			});

			if (options.title) {
				uni.setNavigationBarTitle({
					title: options.title
				});
			}

			this.getList(options.theme_id);
		},
		methods: {
			//获取短视频列表
			getList(theme_id) {
				this.setData({
					loading: true
				});
				let {
					videoList,
					hasmore,
					firstLoading,
					theme_img
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=themeList',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						theme_id: theme_id
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.video;
						if (this.pn == 1) {
							videoList = list;
							theme_img = res.data.theme.image;
						} else {
							videoList = videoList.concat(list);
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
						videoList: videoList,
						firstLoading: firstLoading,
						theme_img: theme_img
					});
				});
			},

			getMoreData() {
				if (this.hasmore) {
					this.getList(this.theme_id);
				}
			},

			//进入播放页面
			goVideoPlay(e) {
				let cur_video_id = e.currentTarget.dataset.videoid;
				uni.navigateTo({
					url: '../svideoPlay/svideoPlay?video_id=' + cur_video_id
				});
			}

		}
	};
</script>
<style>
	page {
		background-color: #f8f8f8;
	}

	.nav {
		position: fixed;
		top: 80rpx;
		left: 0;
		width: 750rpx;
		height: 80rpx;
		background-color: 'transpanrent';
		display: block;
		white-space: nowrap;
		overflow: hidden;
		z-index: 9999;
	}

	.empty_h {
		height: 20rpx;
		width: 100%;
		background-color: 'transpanrent';
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 468rpx;
		z-index: 0;
	}

	.live_list {
		width: 100%;
		height: 100vh;
		background-color: transparent;
		padding-top: 20rpx;
	}

	.rec_svideo {
		width: 750rpx;
		height: 345rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.rec_svideo .rec_img {
		width: 710rpx;
		height: 345rpx;
		border-radius: 15rpx;
	}
</style>
