<template>
	<view class="content" :style="{background:backGround}">
		<view class="nav_wrap">
			<view class="nav_item" v-for="(item,index) in tabInfo" :key="index" @click="changeTab(index,item.gc_id)">
				<view :class="currIndex == index?'active_nav nav_text':'nav_text'">{{item.gc_name}}</view>
				<image :src="icon" mode="" class="nav_icon" v-if="currIndex == index"></image>
			</view>
		</view>
		<view class="gap_line"></view>
		<view class="sort_wrap" @click="toSortPage">
			<image :src="sortImg" mode=""></image>
			<text>{{$L('分类')}}</text>
		</view>
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
				sortImg:getApp().globalData.img_url+'index/sort.png',
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
	.content{
		position:fixed;
		top:0;
		/* left:0; */
		width:750rpx;
		padding:0 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding-top:88rpx;
		background: linear-gradient(90deg, #FC1D1C 0%, #FF7A18 100%);
		z-index: 1000;
		/* #ifndef H5 */
		left: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
		top:var(--status-bar-height);
		/* #endif */
		.nav_wrap{
			width:580rpx; 
			height:70rpx;
			display:flex;
			overflow-x: scroll;
			float: left;
			.nav_item{
				margin-right:35rpx;
				display:flex;
				flex-direction: column;
				align-items: center;
				padding-top:12rpx;
				box-sizing: border-box;
				flex-shrink: 0;
				.nav_text{
					font-size:32rpx;
					color:#fff;
					white-space: nowrap;
					line-height: 38rpx;
				}
				.nav_icon{
					width:27rpx;
					height:9rpx;
				}
			}	
		}
		.gap_line{
			width:13rpx;
			height:30rpx;
			background: linear-gradient(-90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
			opacity: 0.8;
			float: left;
			margin-right:6rpx;
			margin-left: 4rpx;
			// align-self: end;
			// margin-top: 17rpx;
		}
		.sort_wrap{
			font-size:30rpx;
			color:#fff;
			display: flex;
			justify-content: flex-start;
			box-sizing: border-box; 
			float: right;
			text-align: right;
			width: max-content;
			// margin-top: -9rpx;
			image{
				width:32rpx;
				height:26rpx;
				margin:0 7rpx 0 7rpx;
			}
			text{
				line-height:30rpx;
			}
		}
	}
	.active_nav{
		font-weight: bold;
		margin-bottom:6rpx;
	}
</style>
