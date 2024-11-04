<!-- 页面loading -->
<template name="pageLoading">
  <view class="page_loading" v-if="firstLoading">
    <image :src="loadingIcon"></image>
  </view>
</template>

<script>
	export default {
		name: "pageLoading",
		data() {
			return {}
		},
		props: {
			firstLoading: {
				type: Boolean,
				value: false
			},
			loadingIcon: {
				type: String,
				value: ''
			},
		},
		methods: {}
	}
</script>

<style>
.page_loading{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: calc(100vh / 4);
  background-color: transparent;
}

.page_loading image{
  width: 60rpx;
  height: 60rpx;
}
</style>