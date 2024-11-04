<!-- 作者个人中心关注/粉丝页面item -->
<template name="liveFollow">
	<view class="fllow_list">
		<navigator v-for="(item, index) in list" :key="index">
			<view class="fllow_list_item">
				<view class="left">
					<view :data-authorId="item.author_id" @tap="goLiveUserCenter" class="avator" :style="'background:url('+item.member_avatar+');' + bgStyle"></view>
					<view :data-authorId="item.author_id" @tap="goLiveUserCenter" class="mem_info">
						<text class="name">{{item.member_nickname}}</text>
						<text class="desc">{{item.introduction&&item.introduction!=null?item.introduction:$L('暂无简介')}}</text>
					</view>
				</view>
				<view class="right">
					<text @tap="collectAuthor" :data-index="index" :data-authorId="item.author_id" :class="'fllow ' + (item.is_follow == 1 ? 'has_fllow' : '')">{{item.is_follow == 1 ? $L('已关注') : $L('关注')}}</text>
					<text v-if="showFans" class="fans_num">{{item.fans_num}}{{$L('粉丝')}}</text>
				</view>
			</view>
			<view v-if="list.length-index > 1" class="line_marginl_20"></view>
		</navigator>
	</view>
</template>
<script>
	export default {
		name: "liveFollow",
		data() {
			return {}
		},
		props: {
			list: {
				type: Array,
				value: []
			},
			bgStyle: {
				type: String,
				value: ''
			},
			showFans: {
				type: Boolean,
				value: false
			},
		},
		methods: {
			//进入作者页面
			goLiveUserCenter(e) {
				let author_id = e.currentTarget.dataset.authorid;
				let page = getCurrentPages();
				let len = page.length;

				if (len > 4) {
					uni.redirectTo({
						url: '/addons/pages/liveUserCenter/liveUserCenter?author_id=' + author_id
					});
				} else {
					uni.navigateTo({
						url: '/addons/pages/liveUserCenter/liveUserCenter?author_id=' + author_id
					});
				}
			},

			//关注、取消关注事件
			collectAuthor(e) {
				let author_id = e.currentTarget.dataset.authorId;
				this.$emit('collect', {
					author_id: author_id,
					index: e.currentTarget.dataset.index
				});
			}
		}
	}
</script>


<style>
	.fllow_list {
		width: 750rpx;
		margin: 0 auto;
		border-top: 1px solid #eee;
	}
	.fllow_list_item {
		height: 140rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: #fff;
	}

	.line_marginl_20 {
		border-bottom: 1px solid #eee;
		width: 710rpx;
		margin-left: 20rpx;
	}

	.fllow_list_item .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		height: 100rpx;
	}

	.fllow_list_item .right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.fllow_list_item .right .fans_num {
		color: #949494;
		font-size: 22rpx;
		margin-top: 12rpx;
	}

	.fllow_list_item .left .avator {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
	}

	.fllow_list_item .left .mem_info {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		height: 85rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
	}

	.fllow_list_item .left .name {
		color: #2D2D2D;
		font-size: 26rpx;
	}

	.fllow_list_item .left .desc {
		color: #949494;
		font-size: 22rpx;
		white-space: nowrap;
		max-width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fllow_list_item .fllow {
		width: 128rpx;
		height: 50rpx;
		border-radius: 25rpx;
		background: #FC1C1C;
		color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 22rpx;
	}

	.fllow_list_item .fllow.has_fllow {
		background: #DDDDDD;
		color: #2D2D2D;
	}
</style>
