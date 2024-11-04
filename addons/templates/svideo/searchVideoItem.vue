<!-- 搜索页面 短视频item -->
<template name="searchVideoItem">
	<view class="search_video_list">
		<view v-for="(item, index) in videoList" :key="index" class="search_video_item" :data-videoId="item.video_id" @tap="goVideoPlay">
			<view class="left">
				<text class="video_name">{{item.video_name}}</text>
				<text class="desc">{{item.introdution}}</text>
				<view class="author">
					<view class="avator" :style="'background:url('+item.member_avatar+');' + bgStyle"></view>
					<text class="name">{{item.member_nickname}}</text>
				</view>
				<text class="goods">{{item.goods_num == 0 ? $L('暂无相关商品') : item.goods_num}}{{$L('件相关商品')}}</text>
			</view>
			<view class="right" :style="'background:url('+item.video_image+');' + bgStyle">
				<text>{{item.click_num}}{{$L('次播放')}}</text>
				<image :src="listPlayIcon"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "searchVideoItem",
		data() {
			return {}
		},
		props: {
			videoList: {
				type: Array,
				value: []
			},
			bgStyle: {
				type: String,
				value: ''
			},
			listPlayIcon: {
				type: String,
				value: ''
			},

		},
		methods: {
			//进入播放页面
			goVideoPlay(e) {
				let cur_video_id = e.currentTarget.dataset.videoid;
				uni.navigateTo({
					url: '/addons/pages/svideoPlay/svideoPlay?video_id=' + cur_video_id
				});
			}
		}
	}
</script>

<style>
	.search_video_list {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-left: 20rpx;
		border-radius: 14rpx;
	}

	.search_video_list .search_video_item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		width: 670rpx;
		height: 236rpx;
		background: #fff;
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 14rpx;
	}

	.search_video_list .search_video_item .left {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		flex: 1;
		margin-right: 29rpx;
	}

	.search_video_list .search_video_item .left .video_name {
		line-height: 40rpx;
		color: #2d2d2d;
		font-size: 28rpx;
		height: 80rpx;
		overflow: hidden;
		margin-top: 10rpx;
	}

	.search_video_list .search_video_item .left .desc {
		height: 50rpx;
		color: #949494;
		font-size: 24rpx;
		line-height: 50rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 300rpx;
	}

	.search_video_list .search_video_item .left .author {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		height: 42rpx;
		margin-top: 10rpx;
	}

	.search_video_list .search_video_item .left .author .avator {
		width: 42rpx;
		height: 42rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.search_video_list .search_video_item .left .author .name {
		color: #949494;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 300rpx;
	}

	.search_video_list .search_video_item .left .goods {
		color: #949494;
		font-size: 22rpx;
		margin-top: 22rpx;
	}

	.search_video_list .search_video_item .right {
		width: 236rpx;
		height: 236rpx;
		border-radius: 15rpx;
		position: relative;
	}

	.search_video_list .search_video_item .right text {
		color: #fff;
		font-size: 20rpx;
		background-color: rgba(0, 0, 0, 0.4);
		padding: 7rpx 13rpx;
		border-radius: 15rpx 0 15rpx 0;
		position: absolute;
		top: 0;
		left: 0;
	}

	.search_video_list .search_video_item .right image {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -24rpx;
		margin-top: -24rpx;
	}
</style>
