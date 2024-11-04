<template>
	<view class="content">
		<image class="img" src="../../static/app-plus/laucher/1080x1882.png" mode="aspectFill"></image>
		<view class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				autoplay: false,
				duration: 500,
				jumpover: this.$L('跳过'),
				experience: this.$L('立即体验')
			}
		},
		mounted() {
				setTimeout(()=>{
					this.launchFlag()
				},4000)
		},
		methods: {
			launchFlag: function(){
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
						key: 'launchFlag',
						data: true,
				});
				uni.switchTab({
					url: '/pages/index/index'
				});
				
			}
		}
	}
</script>
<style>
	page,
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	
	.jump-over,.experience{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}
	.jump-over{
		right: 45upx;
		top: 125upx;
	}
	.experience{
		right: 50%;
		margin-right: -105upx;
		bottom: 0;
	}
</style>
