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
		<view class="nav" v-if="labelList.length">
			<view class="nav_mine">
				 <view v-for="(item, index) in labelList" :key="index" :class="'nav_item ' + (curLabelId==item.label_id?'on':'')" @tap="changeLabel" :data-id="item.label_id">
					   <text>{{item.label_name}}</text>
				</view>
			</view>
		</view>	
		
		<scroll-view scroll-y class="live_list" v-if="labelList.length">
			<swiper v-if="themeList.length > 0" class="rec_svideo" autoplay circular>
				<swiper-item v-for="(item, index) in themeList" :key="index">
					<image :data-themeId="item.theme_id" :data-themeName="item.theme_name" class="rec_img" :src="item.carousel_image_url"
					 mode="aspectFill" @tap="goRecTopic">
					</image>
				</swiper-item>
			</swiper>

			<!-- 短视频列表item -->
			<listVideoItem :videoList="videoList" :bgStyle="bgStyle" :listFavIcon="img_url+'svideo/fav.png'" :listPlayNum="img_url+'svideo/play_num.png'"
			 :curLabelId="curLabelId*1" :authorId="author_id" />

			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&videoList&&videoList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="!firstLoading&&hasmore&&loading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&!videoList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

			<view class="empty_h" :style="'height:'+bottomSateArea" ></view>
		</scroll-view>
		<!-- 进入短视频个人主页入口 -->
		<view class="personal_homepage" @tap="goLiveUserCenter" data-curTab="video">
			<view class="personal_avator">
				<image :src="member_avatar"></image>
			</view>
			<view class="my_video">{{$L('我的视频')}}</view>
		</view>
	</view>
</template>

<script>
	import {
		checkPageHasMore,
		initNum
	} from "@/utils/live";
	import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import listVideoItem from "@/addons/templates/svideo/listVideoItem.vue";

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			listVideoItem
		},
		data() {
			return {
				labelList: [],
				//标签列表
				videoList: [],
				//短视频列表
				themeList: [],
				//主题列表
				curLabelId: '',
				//当前选中的标签id
				img_url: getApp().globalData.img_url,
				//图片地址
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				bgStyle: 'background-size:cover;background-position:center center;background-repeat: no-repeat;',
				//背景图片样式
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				author_id: '',
				//作者id
				key: '',
				//登录的key值
				member_avatar: '', //默认作者头像
				pageSize: 10,
				pn: 1,
				bottomSateArea:getApp().globalData.bottomSateArea,//iphone手机底部一条黑线的高度
			};
		},

		props: {},
		//是否还有数据

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('短视频列表')
      });
			this.getLabelList();
			let key = uni.getStorageSync('token');
			this.setData({
				key
			});
		},
		onShow: function() {
			this.getLabelList();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.getVideoList(this.curLabelId);
			}
		},

		methods: {
			// 获取短视频分类
			getLabelList() {
				let {
					curLabelId
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getValidLabel'
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.label; //获取第一个分类下的数据

						if (list.length > 0) {
							curLabelId = list[0].label_id;
							this.getVideoList(curLabelId);
						}

						this.setData({
							labelList: list,
							curLabelId: curLabelId
						});
					}
				});
			},

			//获取短视频列表
			getVideoList(label_id) {
				this.setData({
					loading: true
				});
				let {
					videoList,
					hasmore,
					firstLoading,
					themeList,
					key
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=index',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						label_id: label_id,
						key
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.video;

						if (this.pn == 1) {
							videoList = list;
							themeList = res.data.theme;
						} else {
							videoList = videoList.concat(list);
						}

						if (checkPageHasMore(res.data.pagination)) {
							this.pn++;
						} else {
							this.hasmore = false;
							hasmore = false;
						} //作者头像


						this.setData({
							member_avatar: res.data.member_info.member_avatar
						});
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						videoList: videoList,
						firstLoading: firstLoading,
						themeList: themeList
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
					videoList: []
				});
				this.pn = 1;
				this.hasmore = true;
				this.getVideoList(id);
			},

			//跳转搜索页面
			goSearch: function() {
				uni.navigateTo({
					url: '../svideoSearch/svideoSearch'
				});
			},

			//进入推荐主题页面
			goRecTopic(e) {
				let tmp_data = e.currentTarget.dataset;
				uni.navigateTo({
					url: '../svideoRecTopic/svideoRecTopic?theme_id=' + tmp_data.themeid + '&title=' + tmp_data.themename
				});
			},

			//进入直播个人中心
			goLiveUserCenter(e) {
				var curTab = e.currentTarget.dataset.curtab;
				let key = uni.getStorageSync('token');

				if (!key) {
					uni.showModal({
						title: this.$L('提示'),
						content: this.$L('未登录，请先登录'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: function(res) {
							if (res.cancel) { //点击了取消
							} else {
								uni.switchTab({
									url: '/pages/user/user'
								});
							}
						}
					});
				} else {
					uni.navigateTo({
						url: '/addons/pages/liveUserCenter/liveUserCenter?curTab=' + curTab
					});
				}
			}

		}
	};
</script>
<style>
	page {
		background-color: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
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
		right: 0;
		margin: 0 auto;
	}

	.empty_h {
		/* height: 170rpx; */
		width: 100%;
		background-color: 'transpanrent';
	}

	.search {
		position: fixed;
		/* #ifdef H5 */
		top:100rpx !important;
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		top: 20rpx;
		/* #endif */
		left: 0;
		right: 0;
		width: 710rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 20rpx 0 20rpx;
		background: transpanrent;
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
		right: 0;
		margin: 0 auto;
	}

	.live_list {
		width: 750rpx;
		/* #ifdef H5 */
		height: calc(100vh - 273rpx);
		/* #endif */
		/* #ifdef MP || APP-PLUS */
		height: calc(100vh - 185rpx);
		/* #endif */
		background-color: #fff;
		position: fixed;
		top: 180rpx;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0 auto;
	}

	.rec_svideo {
		width: 750rpx;
		height: 345rpx;
		margin-bottom: 20rpx;
	}

	.rec_svideo swiper-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.rec_svideo swiper-item .rec_img {
		width: 710rpx;
		height: 345rpx;
		border-radius: 15rpx;
	}

	.personal_homepage {
		width: 148rpx;
		height: 80rpx;
		background: linear-gradient(45deg, #FF2020, #FF7D1E);
		border-radius: 40rpx 0 0 40rpx;
		display: flex;
		align-items: center;
		position: fixed;
		right: 0;
		bottom: 208rpx;
		z-index: 10;
		padding: 0 20rpx 0 8rpx;
		box-sizing: border-box;
	}

	.personal_avator {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 8rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid #FFFFFF;
	}

	.personal_avator image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.my_video {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
	}
	/* #ifdef H5 */
	.nav{
			top:168rpx
	}
	.search{
		top: 88rpx;
	}
	.live_list{
		top:268rpx
	}
	
	/* #endif */
	.nav{
	  overflow-y: hidden;
	}    
	.nav_mine {	
	 overflow-x: scroll;
	 box-sizing: border-box;
	 overflow-y: hidden;
	 -webkit-overflow-scrolling: touch;
	 padding-bottom: 25px;	   
	}
	.nav_mine::-webkit-scrollbar 
	{display:none}
</style>
