<template>
	<web-view :src="skip_url"></web-view>
</template>

<script>
	export default{
		data(){
			return {
				skip_url:''
			}
		},
		onLoad(option){
			this.skip_url = option.url
		}
	}
</script>

<style>
</style>
