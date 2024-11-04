<!-- 页面空数据 -->
<template name="emptyData">
	<view class="empty_data" v-if="showFlag">
		<image :src="emptyIcon" mode="aspectFit"></image>
		<text>{{$L('暂无数据')}}</text>
	</view>
</template>

<script>
	export default {
		name: "emptyData",
		data() {
			return {}
		},
		props: {
			showFlag: {
				type: Boolean,
				value: false
			},
			emptyIcon: {
				type: String,
				value: ''
			},
		},
		methods: {},
	}
</script>

<style>
	.empty_data {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: transparent;
		width: calc(750rpx - 40rpx);
		margin-top: calc(50vw - 200rpx);
		/* margin-top: 460rpx; */
	}

	.empty_data image {
		width: 179rpx;
		height: 140rpx;
	}

	.empty_data text {
		font-size: 28rpx;
		margin-top: 20rpx;
		color: #949494;
	}
</style>
