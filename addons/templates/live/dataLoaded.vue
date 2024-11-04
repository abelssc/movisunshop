<!-- 数据加载完毕 -->
<template name="dataLoaded">
  <view class="no-has-more" v-if="showFlag" style="background-color: transparent">
  {{$L('数据加载完毕~')}}
  </view>
</template>

<script>
	export default {
		name: "dataLoaded",
		data() {
			return {}
		},
		props: {
			showFlag: {
				type: Boolean,
				value: false
			},
		},
		methods: {}
	}
</script>
<style>
.no-has-more {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  color: #949494;
  font-size: 22rpx;
}

.no-has-more::after, .no-has-more::before {
  position: absolute;
  content: '';
  width: 166rpx;
  height: 1rpx;
  background-color: rgba(0,0,0,0.1);
  top: 50%;
  transform: translateY(-50%) scaleY(0.5);
}

.no-has-more::after {
  right: 114rpx;
}

.no-has-more::before {
  left: 114rpx;
}
</style>
