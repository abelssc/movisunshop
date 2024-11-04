<template>
	<view>
		<view class="navbar">
			<!-- <view :style="'height: ' + statusBarHeight + 'px'"></view> -->
			<view class="title-container" :style="'height: ' + titleBarHeight + 'px'">
				<view class="capsule" @tap="backHome">
					<image :src="img_url+'arrow_left_b.png'"></image>
				</view>
				<view class="title" @tap="backHome">{{text}}</view>
			</view>
		</view>

		<view :style="('height: ' + (statusBarHeight+titleBarHeight) + 'px') + ';background: white;'"></view>
	</view>
</template>

<script>
	const tabBarPage = ['/pages/index/index', '/pages/categroy/categroy', '/pages/found/found', '/pages/cart/cart',
		'/pages/user/user'
	];

	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight,
				titleBarHeight: getApp().globalData.titleBarHeight,
				img_url: getApp().globalData.img_url,
			};
		},

		components: {},
		
		props: {
			text: {
				type: String,
				default: 'Wechat'
			},
			url: {
				type: String,
				default: '/pages/user/user'
			}
		},
		methods: {
			backHome: function() {
				let url = this.url;
				if (url && tabBarPage.indexOf(url) > -1) {
					uni.switchTab({
						url: url
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			}
		}
	};
</script>
<style>
	.navbar {
		width: 750rpx;
		background-color: #fff;
		position: fixed;
		top: var(--status-bar-height);
		/* left: 0; */
		z-index: 999;
		/* margin: 0 auto; */
	}

	.title-container {
		display: flex;
		height: 88rpx;
		align-items: center;
		position: relative;
	}

	.capsule {
		margin-left: 10px;
		background: rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
	}

	.capsule image {
		width: 11px;
		height: 18px;
	}

	.title {
		color: #000;
		width: 200px;
		font-size: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 10px;
	}
</style>
