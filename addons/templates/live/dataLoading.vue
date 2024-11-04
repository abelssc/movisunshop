<!-- 数据加载中 -->
<template name="dataLoading">
  <view class="loading" v-if="showFlag">
    <view class="spinner">
      <text></text>
    </view>
  {{$L('数据加载中...')}}
  </view>
</template>

<script>
	export default {
		name: "dataLoading",
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

