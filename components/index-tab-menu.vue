<template>
	<view class="sort_wrap" @click="toSortPage">
		<image :src="sortImg" mode=""></image>
	</view>
</template>

<script>
	import {
		checkPageHasMore
	} from "@/utils/live";
	export default{
		name:'tabMenu',
		data(){
			return {
				icon:getApp().globalData.img_url+'index/icon.png',
				sortImg:getApp().globalData.img_url+'menu.svg',
				currIndex:0,
				gc_id: '',
				pn: 1,
				hasmore: false
			}
		},
		props: ['backGround','tabInfo'],
		methods:{
			changeTab(index,gc_id){
				this.currIndex = index;
				this.gc_id = gc_id;
				this.pn = 1;
				if(index>0){
					this.get_list();
				}else{
					this.$emit('getChildList',null,index)
				}
			},
			get_list(){
				let site_id = uni.getStorageSync('city_site_site_id');
				const { gc_id, currIndex } = this;
				let param = {}
				param.method = 'GET'
				param.url = getApp().globalData.ser_url + '/index.php?app=goods_cat&mod=get_seccat&gc_id='+ gc_id + '&pn=' + this.pn+'&sld_city_site_id='+site_id
				uni.request(param).then(res=>{
					let tmpRes = res.filter(item=>{
						return item
					})
					let result = tmpRes[0]
					if(result.data.state == 200){
						this.$emit('getChildList',result.data,currIndex);
						result.data.pagination.pageSize = 10;
						if(checkPageHasMore(result.data.pagination)){
							this.pn++;
							this.hasmore = true;
						}else{
							this.hasmore = false;
						}
					}
				})
				
			},
			toSortPage(){
				uni.switchTab({
					url:`/pages/categroy/categroy`
				})
			},
			getMoreData(){
				if(this.hasmore){
					this.get_list();
				}
			}
		}
	}
</script>

<style lang='scss'>
	.sort_wrap{
		image{
			width:50rpx;
			height:50rpx;
			padding: 15rpx;
		}
	}
</style>
