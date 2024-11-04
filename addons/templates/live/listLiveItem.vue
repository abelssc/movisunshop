<!-- 直播列表item -->
<template name="listLiveItem">
	<view>
		<view v-for="(item, index) in liveList" :key="index" :class="'live_list_item ' + (index==0?'live_list_item_first':'')"
		 :data-liveId="item.live_id" @tap="goLivePlay(item.live_id)">
			<view class="left" :style="'background:url('+item.live_image_url+');' + bgStyle">
				<view class="left_top">
					<view class="left_top_icon">
						<block v-if="item.status == 2">
							<image class="back_img" :src="listPlayBackIcon" mode="aspectFit"></image>
						</block>
						<block v-else>
							<image class="back_img_living" :src="listLivingIcon" mode="aspectFit"></image>
						</block>
					</view>
					<text class="watch_num_text left_top_num">{{item.click_num}}{{$L('观看')}}</text>
				</view>
				<view class="right_bottom" v-if="item.like_num!='0'">
					<image class="heart_icon" :src="heartIcon" mode="aspectFit"></image>
					<text class="watch_num_text bottom_right">{{item.like_num}}</text>
				</view>
			</view>

			<view class="right">
				<text class="live_name">{{item.live_name}}</text>
				<view class="member_info">
					<image class="avator" :src="item.member_avatar" mode="aspectFit"></image>
					<text class="nickname">{{item.member_nickname}}</text>
				</view>
				<block v-if="item.goods_list&&item.goods_list.length">
					<view class="goods_info">
						<view class="first_goods" :style="'background:url('+item.goods_list[0].goods_image+');' + bgStyle">
							<text class="goods_price">{{$L('¥')}}{{item.goods_list[0].goods_price}}</text>
						</view>
						<block v-if="item.goods_list&&item.goods_list.length>1">
							<view class="second_goods" :style="'background:url('+item.goods_list[1].goods_image+');' + bgStyle">
								<view class="second_goods_wrap">
									<text class="total">{{item.goods_num>99?'99+':item.goods_num}}</text>
									<text class="total">{{$L('宝贝')}}</text>
								</view>
							</view>
						</block>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		name: "listLiveItem",
		data() {
			return {}
		},
		props: {
			liveList: {
				type: Array,
				value: []
			},
			bgStyle: {
				type: String,
				value: ''
			},
			listPlayBackIcon: {
				type: String,
				value: ''
			},
			listLivingIcon: {
				type: String,
				value: ''
			},
			heartIcon: {
				type: String,
				value: ''
			},
		},
		methods: {
			//进入播放页面
			goLivePlay(live_id) {
				uni.navigateTo({
					url: '/addons/pages/livePlay/livePlay?live_id=' + live_id,
				});
			}
		}
	}
</script>

<style>
	.live_list_item {
		width: 670rpx;
		height: 360rpx;
		background-color: #fff;
		/* margin-top: 20rpx; */
		margin: 20rpx auto;
		border-radius: 15rpx;
		overflow: hidden;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		left: 50%;
		transform: translateX(-375rpx);
	}

	.live_list_item_first {
		margin-top: 0 !important;
	}

	.live_list_item .left {
		width: 300rpx;
		height: 300rpx;
		border-radius: 15rpx;
		background-repeat: no-repeat;
		/* background-size:100%;  */
		position: relative;
	}

	.live_list_item .left .left_top {
		position: absolute;
		top: 0;
		left: 0;
		padding-right: 10rpx;
		height: 36rpx;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom-right-radius: 15rpx;
		border-top-left-radius: 15rpx;
	}

	.live_list_item .left .left_top .left_top_icon {
		width: 46rpx;
		height: 36rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 15rpx 0;
		background: linear-gradient(-21deg, rgba(250, 113, 153, 1) 0%, rgba(245, 90, 114, 1) 0%, rgba(255, 20, 86, 1) 0%, rgba(255, 111, 33, 1) 100%);
	}

	.left .left_top .back_img {
		width: 40rpx;
		height: 40rpx;
	}

	.left .left_top .back_img_living {
		width: 32rpx;
		height: 32rpx;
		margin-left: 5rpx;
		margin-right: 5rpx;
		margin-bottom: 3rpx;
	}

	.left .watch_num_text {
		color: #fff;
		font-size: 20rpx;
		line-height: 28rpx;
		display: inline-block;
		font-weight: 600;
	}

	.live_list_item .left .right_bottom {
		position: absolute;
		bottom: 10rpx;
		right: 5rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.left .watch_num_text.left_top_num {
		margin-left: 10rpx;
	}

	.left .watch_num_text.bottom_right {
		margin-right: 14rpx;
		font-weight: 600;
	}

	.left .right_bottom .heart_icon {
		width: 100rpx;
		height: 300rpx;
	}

	.left .right_bottom text {
		margin-right: 10rpx;
	}

	.live_list_item .right {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 0 20rpx;
		height: 300rpx;
	}

	.right .live_name {
		height: 72rpx;
		color: '#2D2D2D';
		font-size: 26rpx;
		line-height: 36rpx;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.right .member_info,
	.right .goods_info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-top: 20rpx;
	}

	.right .member_info .avator {
		width: 46rpx;
		height: 46rpx;
		border-radius: 50%;
	}

	.right .member_info .nickname {
		color: '#949494';
		font-size: 23rpx;
		margin-left: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.right .goods_info .first_goods,
	.right .goods_info .second_goods {
		width: 140rpx;
		height: 140rpx;
		border-radius: 15rpx;
		overflow: hidden;
		margin-right: 10rpx;
		background-repeat: no-repeat;
		background-size: contain;
	}

	.right .goods_info .second_goods {
		margin-right: 0;
	}

	.right .goods_info .first_goods .goods_price {
		display: flex;
		width: 140rpx;
		height: 120rpx;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		color: #fff;
		margin-top: 20rpx;
		background: -webkit-linear-gradient(top, rgba(221, 221, 221, 0), rgba(221, 221, 221, 0), #000);
		font-size: 22rpx;
		line-height: 44rpx;
		border-radius: 0 0 15rpx 15rpx;
		font-weight: 600;
	}

	.right .goods_info .second_goods .second_goods_wrap {
		display: flex;
		width: 140rpx;
		height: 140rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.3);
		font-size: 24rpx;
		color: #fff;
		border-radius: 15rpx;
		line-height: 32rpx;
		font-weight: 600;
	}
</style>
