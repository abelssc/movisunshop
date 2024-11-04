<template>
	<view style="border:1px solid transparent">
		<scroll-view scroll-y class="comment_list">
			<!-- item -->
			<view class="comment">
				<view v-for="(item, index) in list" :key="index" class="com_item" :index="index">
					<view class="reply_info">
						<view @tap="goLiveUserCenter" class="avator" :style="'background:url('+item.member_avatar+');'"></view>
						<view class="content" @tap="replayComment(item)">
							<text class="reply_name">{{item.member_nickname}}</text>
							<text class="reply_con">{{item.content}}</text>
							<text class="reply_time">{{item.create_time}}</text>
						</view>
					</view>
					<image @tap="goVideoPlay(item)" class="video_img" :src="item.video_image"></image>
				</view>
			</view>
		</scroll-view>
		<!-- 数据加载完毕 -->
		<dataLoaded :showFlag="!hasmore&& list && list.length>0" />
		
		<!-- 数据加载中 -->
		<dataLoading :showFlag="hasmore&&loading" />
		
		<!-- 页面loading -->
		<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />
		
		<!-- 页面空数据 -->
		<emptyData :showFlag="!firstLoading&& list && !list.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />
		
		<view class="reply_mask" v-if="showInput" @tap="cancle_reply"></view>
		<view class="reply_view" v-if="showInput">
			<view class="reply_wrap">
				<view v-if="replyInfo" class="reply_tip">{{$L('回复')}}@<text class="reply_name">{{replyInfo.member_nickname}}</text></view>
				<input cursor-spacing="40" type="text" auto-focus="true" name="reply_con" class="reply_inp" placeholder-style="font-size:26rpx;color:#8A857C"
				 confirm-type="send" @confirm="replyCom" maxlength="100" :value="input_val" adjust-position="false"></input>
			</view>
		</view>
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
				list: '',
				//当前列表数据
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				pn: 1,
				//当前页
				pageSize: 15,
				//每页数据
				showInput: false,
				//不显示input框
				input_val: '',
				//输入框内容
				replyInfo: {}
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('评论列表')
      });
			this.getList();
		},
		methods: {
			// 获取订单列表
			getList() {
				let {
					pn,
					pageSize,
					hasmore,
					list,
					firstLoading
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=authorReply',
					data: {
						pageSize: pageSize,
						current: pn,
						key: uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.state == 200) {
						let temp_list = res.data.list;

						if (pn == 1) {
							list = temp_list;
						} else {
							list = list.concat(temp_list);
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
						list: list?list:[],
						firstLoading: firstLoading,
						pn: pn
					});
				});
			},
            //跳转直播
			goVideoPlay(video){
				uni.navigateTo({
					url: '../svideoPlay/svideoPlay?video_id=' + video.video_id  + '&author_id=' + video
						.from_author_id
				});
			},
			//回复评论事件
			replayComment(item) {
				let tmp_data = item;
				this.setData({
					showInput: true,
					replyInfo: tmp_data
				});
				this.$forceUpdate();
			},

			//取消评论事件
			cancle_reply() {
				this.setData({
					showInput: false
				});
			},

			//回复评论
			replyCom(e) {
				let {
					replyInfo
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=publishReply',
					method: 'POST',
					data: {
						comment_id: replyInfo.comment_id,
						to_author_id: replyInfo.from_author_id,
						video_id: replyInfo.video_id,
						content: e.detail.value,
						key: uni.getStorageSync('token')
					}
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});

					if (res.state == 200) {
						//评论成功，清空输入框内容，隐藏输入框
						this.setData({
							input_val: '',
							showInput: false
						});
					}
				});
			}

		}
	};
</script>
<style>
	page {
		background: #fff;
		width: 750rpx;
		margin: 0 auto;
	}
	.empty_data {	
		margin-top: calc(50vh - 222rpx)!important
	}
	.comment {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.comment .com_item {
		width: calc(750rpx - 20rpx);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 20rpx;
	}

	.comment .com_item:last-child {
		border-bottom: 0;
	}

	.comment .com_item .reply_info {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: 20rpx;
	}

	.comment .com_item .video_img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 15rpx;
		margin: 20rpx 20rpx 20rpx 47rpx;
	}

	.comment .com_item .reply_info .avator {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		background-size:contain!important;
		background-position:center center !important;
		background-repeat: no-repeat !important;
	}

	.comment .com_item .reply_info .content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		line-height: 36rpx;
	}

	.comment .com_item .reply_info .content .reply_name {
		color: #2D2D2D;
		font-size: 28rpx;
		margin-bottom: 15rpx;
	}

	.comment .com_item .reply_info .content .reply_con {
		color: #2D2D2D;
		font-size: 24rpx;
		margin-bottom: 16rpx;
	}

	.comment .com_item .reply_info .content .reply_time {
		color: #949494;
		font-size: 22rpx;
		margin-bottom: 10rpx;
	}

	.reply_view {
		width: 100%;
		height: 116rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
	}

	.reply_view .reply_wrap {
		width: 660rpx;
		border-radius: 35rpx;
		height: 70rpx;
		background: #E9E9E9;
		padding-left: 30rpx;
		margin-bottom: 23rpx;
		margin-top: 23rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.reply_view .reply_wrap .reply_inp {
		display: flex;
		flex: 1;
	}

	.reply_view .reply_wrap .reply_tip {
		color: #2d2d2d;
		font-size: 24rpx;
		padding: 0 15rpx;
	}

	.reply_view .reply_wrap .reply_name {
		color: #4d8efb;
	}

	.reply_mask {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		margin: 0 auto;
		width: 750rpx;
		z-index: 98;
		background: rgba(0, 0, 0, 0.6)
	}
</style>
