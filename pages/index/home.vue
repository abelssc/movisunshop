<template>
	<view class="main">
		<code-elf-guide v-if="guidePages"></code-elf-guide>
	</view>
</template>

<script>
	import codeElfGuide from '@/components/code-elf-guide/code-elf-guide.vue'
	export default {
		components: {
			codeElfGuide
		},
		data() {
			return {
				guidePages: true
			}
		},
		onLoad() {
			this.loadExecution()
		},
    onShow() {
			uni.setNavigationBarTitle({
        title: this.$L('商城首页')
      });   
    },
		methods: {
			loadExecution: function() {
				console.info(23333333);
				/**
				 * 获取本地存储中launchFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				try {
					// 获取本地存储中launchFlag标识
					const value = uni.getStorageSync('launchFlag');
					if (value) {
						
						// launchFlag=true直接跳转到首页
						uni.switchTab({
							url: '/pages/index/index'
						});
					} else {
						// launchFlag!=true显示引导页
						this.guidePages = true
					}
				} catch (e) {
					// error 
					uni.setStorage({
						key: 'launchFlag',
						data: true,
						success: function() {
							console.log('error时存储launchFlag');
						}
					});
					this.guidePages = true
				}
			}
		}
	}
</script>

<style>
	page,.main{
	        width: 100vw;
	        height: 100vh;
	    }
</style>
