<!-- 短视频列表item -->
<template name="listVideoItem">
    <view class="video_list">
        <view v-for="(item, index) in videoList" :key="index" class="video_item" :data-videoId="item.video_id" @tap="goVideoPlay(item.video_id)">
            <view class="play_num_bg" :style="'background:url('+listPlayNum+');' + bgStyle">
                <text class="play_num">{{item.click_num}}</text>
            </view>
            <view class="video_img" :style="'background:url('+item.video_image+');' + bgStyle"></view>
            <text class="name">{{item.video_name}}</text>
            <view class="author">
                <view class="author_info">
                    <view class="avator" :style="'background:url('+item.member_avatar+');' + bgStyle"></view>
                    <text>{{item.member_nickname}}</text>
                </view>
                <view class="fav">
                    <image :src="listFavIcon"></image>
                    <text>{{item.like_num}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
		name: "listVideoItem",
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
			listFavIcon: {
				type: String,
				value: ''
			},
			listPlayNum: {
				type: String,
				value: ''
			},
			curLabelId: {
				type: Number,
				value: 0
			},//当前标签id
			authorId: {
				type: String,
				value: ''
			},//当前作者id
		},
		methods: {
			//进入播放页面
			goVideoPlay(videoId) {
				uni.navigateTo({
					url: '../svideoPlay/svideoPlay?video_id=' + videoId + '&label_id=' + this.curLabelId + '&author_id=' + this
						.authorId
				});
			},
		}
	}
</script>

<style>
.video_list{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap:wrap;
	margin-top:20rpx;
}

.video_list .video_item {
    width: 345rpx;
    height: 507rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 20rpx;
    background: #fff;
    border-radius: 14rpx;
    margin-bottom: 20rpx;
    position: relative;
}

.video_list .video_item .play_num_bg{
    width: 108rpx;
    height: 38rpx;
    top: 20rpx;
    left: 20rpx;
    border-radius: 19rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    z-index: 2;
}

.video_list .video_item .play_num {
    color: #fff;
    font-size: 24rpx;
    padding-left: 40rpx;
}

.video_list .video_item .video_img {
    width: 345rpx;
    height: 345rpx;
    border-radius: 14rpx 14rpx 0 0;
    overflow: hidden;
}

.video_list .video_item .name {
    height: 72rpx;
    color: #2d2d2d;
    font-size: 26rpx;
    line-height: 36rpx;
    margin-top: 20rpx;
    margin-left: 20rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
}

.video_list .video_item .author {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 13rpx;
    margin-left: 20rpx;
    width:315rpx;
}

.video_list .video_item .author .author_info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 200rpx;
    overflow: hidden;
    text-overflow: ellipsis;
}

.video_list .video_item .author .author_info .avator {
    width: 42rpx;
    height: 42rpx;
    border-radius: 50%;
}

.video_list .video_item .author .author_info text {
    color: #949494;
    font-size: 22rpx;
    margin-left: 10rpx;
    white-space: nowrap;
    width: 148rpx;
    overflow: hidden;
    text-overflow: ellipsis;
}

.video_list .video_item .author .fav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.video_list .video_item .author .fav image {
    width: 42rpx;
    height: 42rpx;
}

.video_list .video_item .author .fav text {
    font-size: 24rpx;
    color: #949494;
    margin-left: 0rpx;
}

</style>