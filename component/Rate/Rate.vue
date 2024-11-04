<template>
	<view class="rate" style="display:flex">
		<view v-for="(item, index) in 5" :key="index" class="rate-item" :style="'padding: 0 ' + padding + 'rpx;'" @tap="setScore"
		 :data-i="item+1">
			<image :src="score>=item?img_url+'star_r.png':img_url+'star_b.png'" :style="'opacity:' + (score>=item?1:0.3) + '; width: ' + size + 'rpx;height: ' + size + 'rpx;'"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
			};
		},

		components: {},
		props: {
			score: {
				// 分数
				type: Number,
				default: 5
			},
			size: {
				// 图标大小
				type: Number,
				default: 35
			},
			padding: {
				// 图标间隔
				type: Number,
				default: 10
			},
			disable: {
				// 是否不可操作
				type: Boolean,
				default: false
			},
			store_type: {
				// 父组件的store_type数据
				type: String,
				default: ''
			}
		},
		methods: {
			setScore(e) {
				let {
					disable,
					store_type
				} = this;
				if (disable) return;
				let i = e.currentTarget.dataset.i;
				this.$emit('change', {
					detail: i,
					storeType: store_type
				});
			}

		}
	};
</script>
<style>
	/* component/Rate/Rate.wxss */
	.rate {
		display: flex;
		align-items: center;
	}

	.rate .rate-item {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rate .rate-item image {
		width: 35rpx;
		height: 35rpx;
	}
</style>
