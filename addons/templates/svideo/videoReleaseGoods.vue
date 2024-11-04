<template>
	<view class="live_user_tab_content">
		<template name="videoReleaseGoods">
			<block v-for="(item, index) in goodsData" :key="index">
				<view class="line_marginl_20"></view>
				<view class="goods_item" :style="goodsData.length-index==1?'border-radius:0 0 14rpx 14rpx':'border-radius:0'">
					<view class="goods_img" :data-gid="item.gid">
						<image :src="item.goods_image" mode="aspectFit"></image>
						<text>{{index+1}}</text>
					</view>
					<view class="right">
						<view class="top" :data-gid="item.gid">
							<text class="name">{{item.goods_name}}</text>
							<text class="jingle">{{item.goods_jingle}}</text>
						</view>
						<view class="bottom">
							<view class="price">
								<text class="unit">{{$L('¥')}}</text>
								<text class="num">{{item.goods_price}}</text>
							</view>
							<text :data-gid="item.gid" class="del_goods" @tap="delGoods">{{$L('删除')}}</text>
						</view>
					</view>
				</view>
			</block>
		</template>
	</view>
</template>

<script>
	export default {
		name: "videoReleaseGoods",
		data() {
			return {}
		},
		props: {
			goodsData: {
				type: Array,
				value: []
			},
			addCartIcon: {
				type: String,
				value: ''
			},
			eyeIcon: {
				type: String,
				value: ''
			},

		},
		methods: {
			//删除商品
			delGoods(e) {
				let gid = e.currentTarget.dataset.gid;
				this.$emit('delGoods', {
					gid: gid,
				});
			},
		}
	}
</script>

<style>
	.live_user_tab_content .goods_item {
		width: 670rpx;
		padding: 20rpx;
		height: 246rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin: 0 20rpx;
		background: #fff;
	}

	.live_user_tab_content .goods_item .goods_img {
		width: 246rpx;
		height: 246rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.live_user_tab_content .goods_item .goods_img image {
		max-height: 100%;
		max-width: 100%;
		border-radius: 15rpx;
	}

	.live_user_tab_content .goods_item .goods_img text {
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		font-size: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 15rpx;
		border-radius: 15rpx 0 15rpx 0;
		background: linear-gradient(45deg, rgba(255, 0, 0, 1) 0%, rgba(255, 122, 24, 1) 100%);
	}

	.live_user_tab_content .goods_item .right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		height: 226rpx;
		padding: 10rpx 0 10rpx 20rpx;
	}

	.live_user_tab_content .goods_item .right .top {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.live_user_tab_content .goods_item .right .top .name {
		color: #2d2d2d;
		font-size: 28rpx;
		line-height: 42rpx;
		height: 84rpx;
		width: 404rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.live_user_tab_content .goods_item .right .top .jingle {
		color: #949494;
		font-size: 26rpx;
		line-height: 36rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 10rpx;
		width: 404rpx;
	}

	.live_user_tab_content .goods_item .right .bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		width: 404rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .price .unit {
		color: #fc1c1c;
		font-size: 24rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .price .num {
		font-size: 36rpx;
		color: #fc1c1c;
		margin-left: 3rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .click_num {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.live_user_tab_content .goods_item .right .bottom .click_num .add_cart {
		width: 42rpx;
		height: 42rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .click_num image {
		width: 42rpx;
		height: 42rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .click_num text {
		color: #949494;
		font-size: 22rpx;
	}

	.line_marginl_20 {
		border-bottom: 1px solid #eee;
		width: 690rpx;
		margin-left: 40rpx;
	}

	.live_user_tab_content .goods_item .right .bottom .del_goods {
		width: 90rpx;
		height: 40rpx;
		border: 1px solid rgba(0, 0, 0, 0.7);
		border-radius: 20rpx;
		color: #2d2d2d;
		font-size: 24rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
