<template>
	<view>
		<!-- 直播/短视频 个人中心 商品模块 -->
		<scroll-view class="live_user_tab_content_scroll" scroll-y="true" @scrolltolower="getMoreGoods">
			<view class="video_list">
				<view v-for="(item, index) in videoList" :key="index" class="item">
					<view class="top">
						<view class="base_info">
							<text class="time">{{item.publish_time}}</text>
							<text class="title">{{item.video_name}}</text>
							<text class="desc">{{item.introdution}}</text>
						</view>
						<block v-if="memberInfo.is_own==1&&(item.status == 1 || item.status == 3 || item.status == 5)">
							<block v-if="item.status == 1">
								<image class="status" :src="img_url+'svideo/s_com.png'"></image>
							</block>
							<block v-if="item.status == 3">
								<image class="status" :src="img_url+'svideo/s_err.png'"></image>
							</block>
							<block v-if="item.status == 5">
								<image class="status" :src="img_url+'svideo/s_hide.png'"></image>
							</block>
						</block>
					</view>
					<view class="video" :style="'background:url('+item.video_image+');background-size:cover;background-position:center center;background-repeat: no-repeat;'"
					 :data-videoId="item.video_id" @tap="goVideoPlay(item.video_id)">

						<image class="play_btn" :src="img_url+'svideo/play.png'"></image>

					</view>
					<view class="stat_num">
						<view class="left">
							<block v-if="memberInfo.is_own==1">
								<image :src="img_url+'svideo/del.png'" @tap="delVideo" :data-id="item.video_id"></image>
								<text @tap="delVideo" :data-id="item.video_id">{{$L('删除')}}</text>
							</block>
							<block v-if="memberInfo.is_own==1&&(item.status == 3 || item.status == 1)">
								<image class="ml_10" :src="img_url+'svideo/edit.png'" @tap="editVideo" :data-id="item.video_id"></image>
								<text @tap="editVideo" :data-id="item.video_id">{{$L('重新编辑')}}</text>
							</block>
						</view>
						<view class="right">
							<image :src="img_url+'svideo/watch.png'"></image>
							<text>{{item.click_num}}</text>
							<image class="ml_30" :src="img_url+'svideo/fav.png'"></image>
							<text>{{item.like_num}}</text>
							<image class="ml_30" :src="img_url+'svideo/comment.png'"></image>
							<text>{{item.comment_num}}</text>
						</view>
					</view>
					<block v-if="memberInfo.is_own==1&&(settingData.video_virtual_click_num_switch==1||settingData.video_virtual_like_num_switch==1)">
						<view class="detail_num">
							<block v-if="settingData.video_virtual_click_num_switch==1">
								<text>{{$L('播放量')}}</text>
								<text class="color_9">{{$L('(虚/实)：')}}</text>
								<text class="color_3 mr_30">{{item.virtual_click_num}}/{{item.real_click_num}}</text>
							</block>
							<block v-if="settingData.video_virtual_like_num_switch==1">
								<text>{{$L('点赞量')}}</text>
								<text class="color_9">{{$L('(虚/实)：')}}</text>
								<text class="color_3">{{item.virtual_like_num}}/{{item.real_like_num}}</text>
							</block>
						</view>
					</block>
				</view>
			</view>

			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&videoList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading&&!firstLoading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" :topVal="467" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&videoList.length==0" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

			<block v-if="settingData.live_switch == 1 && memberInfo.is_own == 1">
				<!-- #ifdef MP-WEIXIN -->
				<view style="height:161rpx;width:750rpx"></view>
				<!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<view style="height:240rpx;width:750rpx"></view>
				<!-- #endif -->
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
	let pn = 1; //当前页
	//当前页
	let pageSize = 10; //每页数据
	//每页数据
	let hasmore = true; //是否还有数据

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
				videoList: [],
				//动态列表数据
				addCartIcon: img_url + 'live/add_cart.png',
				eyeIcon: img_url + 'live/eye.png',
				hasmore: true,
				//是否还有数据，用于页面展示
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				img_url: getApp().globalData.img_url //图片地址

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
			this.getVideoList();
		},
        onShow() {
        	this.getVideoList();
        },
		methods: {
			//获取动态数据
			getVideoList() {
				this.setData({
					loading: true
				});
				let {
					author_id,
					firstLoading,
					videoList,
					pageSize,
					pn,
					hasmore
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getVideoList',
					data: {
						key: uni.getStorageSync('token'),
						author_id: author_id,
						pageSize: pageSize,
						current: pn
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.video;

						if (pn == 1) {
							videoList = list;
						} else {
							videoList = videoList.concat(list);
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
						videoList: videoList,
						firstLoading: firstLoading,
						pn: pn
					});
				});
			},

			getMoreGoods() {
				if (this.hasmore) {
					this.getVideoList();
				}
			},

			//进入播放页面
			goVideoPlay(videoId) {
				uni.navigateTo({
					url: '../svideoPlay/svideoPlay?video_id=' + videoId
				});
			},

			//删除短视频
			delVideo(e) {
				let video_id = e.currentTarget.dataset.id;
        let that = this
				uni.showModal({
					title: that.$L('提示'),
					content: that.$L('确定删除该视频吗?'),
					cancelText:this.$L('取消'),
					confirmText:this.$L('确定'),
					success: res => {
						if (res.confirm) {
							request({
								url: getApp().globalData.svideo_url + '/index.php?app=video&mod=delVideo',
								method: 'post',
								data: {
									key: uni.getStorageSync('token'),
									video_id
								}
							}).then(res => {
								if (res.state == 200) {
									this.setData({
										pn: 1
									});
									this.getVideoList();
									this.$emit('liveEvent', {
										detail: {}
									});
								}
							});
						}
					}
				});
			},

			//重新编辑功能
			editVideo(e) {
				let video_id = e.currentTarget.dataset.id;
				uni.navigateTo({
					url: '/addons/pages/svideoRelease/svideoRelease?video_id=' + video_id
				});
			}

		}
	};
</script>
<style>
	.live_user_tab_content_scroll {
		height: calc(100vh - 467rpx);
	}

	.video_list {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.video_list .item {
		width: 690rpx;
		padding-left: 30rpx;
		background: #fff;
		margin-bottom: 20rpx;
		padding: 30rpx 30rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		box-sizing: content-box;
	}

	.video_list .item .top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
	}

	.video_list .item .top .base_info {
		width: 550rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.video_list .item .top .status {
		width: 100rpx;
		height: 77rpx;
	}

	.video_list .item .top .base_info .time {
		color: #949494;
		font-size: 22rpx;
		line-height: 32rpx;
	}

	.video_list .item .top .base_info .title {
		color: #2d2d2d;
		font-size: 30rpx;
		line-height: 40rpx;
		padding: 10rpx 0;
	}

	.video_list .item .top .base_info .desc {
		width: 550rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #949494;
		font-size: 26rpx;
	}

	.video_list .item .video {
		width: 690rpx;
		height: 690rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
	}

	.video_list .item .video .play_btn {
		width: 100rpx;
		height: 100rpx;
	}

	.video_list .item .stat_num {
		width: 100%;
		height: 76rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 0;
		margin-top: 0;
	}

	.video_list .item .stat_num .left,
	.video_list .item .stat_num .right {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.video_list .item .stat_num .left image,
	.video_list .item .stat_num .right image {
		width: 43rpx;
		height: 43rpx;
	}

	.video_list .item .stat_num .left text,
	.video_list .item .stat_num .right text {
		color: #666;
		font-size: 22rpx;
	}

	.video_list .item .detail_num {
		width: 100%;
		height: 64rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	.video_list .item .detail_num text {
		color: #666;
		font-size: 24rpx;
	}

	.video_list .item .detail_num .color_9 {
		color: #999;
	}

	.video_list .item .detail_num .color_3 {
		color: #333;
	}

	.ml_30 {
		margin-left: 30rpx;
	}

	.ml_10 {
		margin-left: 10rpx;
	}

	.mr_30 {
		margin-right: 30rpx;
	}
</style>
