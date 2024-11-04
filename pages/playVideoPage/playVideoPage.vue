<template>
		<view class="video_con">
			<video id="myVideo"  :src="video_url" controls loop :poster='posterImage'></video>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				video_url:'',
				posterImage:''
			};
		},
	
		components: {},
		props: {},
	    onReady() {
	    	 // // 获取 video 上下文 videoContext 对象
	    	 //    this.videoContext = uni.createVideoContext('myVideo');
	    	 //    // 进入全屏状态
	    	 //    this.videoContext.requestFullScreen();
	    },
		onLoad(options) {
      uni.setNavigationBarTitle({
          title: this.$L('视频播放')
      });
        this.video_url=options.video_url
		this.posterImage=options.posterImage
		},
	
		methods: {

	
		}
	};
</script>

<style>
	page{
		width: 750rpx;
		margin: 0 auto;
		height: 100%;
	}
	.video_con{
		width: 750rpx;
		height: 100%;
	}
	video{
		width: 750rpx;
		height: 100%;
	}
</style>
