<template>
	<view class="container_box">
		<view class="seckill_top_wrap" :style="{backgroundImage:'url('+ top_bg +')',height:swiper_list.length>0?'358rpx' : nav_list.length == 0 ? '88rpx' : '160rpx'}">
				<view class="seckill_top">
					<image :src="img_url+'addons/to_back.png'" mode="" class="to_back_icon" @click="toPrev"></image>
					<view class="seckill_title" >{{$L('限时秒杀')}}</view>
				</view>

			<view class="nav_list_wrap">
				<view class="nav_list">
					<view :class="current == index?'nav_item active':'nav_item'" v-for="(item,index) in nav_list" :key="index" @click="changeSort(index,item.id)">{{item.label_name}}</view>
				</view>
			</view>
			<view class="swiper_wrap" v-if="is_show_banner" :style="{paddingTop:is_show_banner?'10rpx':'150rpx'}">
				<swiper class="carousel" circular @change="swiperChange" autoplay="true">
					<swiper-item class="carousel_item" v-for="(swiperItem,swiperIndex) in swiper_list" :key="swiperIndex" @click="$linkTo(swiperItem.link_type, swiperItem.link_value, swiperItem.info)">
						<image :src="swiperItem.imgUrl" class="carousel_item"/>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view :style="{marginTop:is_show_banner?'86rpx':'10rpx'}">
			<view :class="is_fixed_nav?'fixed_nav seckill_time_wrap':'seckill_time_wrap'" :style="{marginTop:swiper_list.length>0?'0':'10rpx'}" v-if="time_list.length>0">
				<view class="seckill_icon_wrap">
					<image :src="img_url+'addons/seckill_icon.png'" mode="" class="seckill_icon"></image>
				</view>
				
				<view class="seckill_time">
					<view class="seckill_time_item" v-for="(item,index) in time_list" :key="index" @click="changeList(index,item.id)">
						<view :class="currIndex == index?'active_time time_item':'time_item'">{{item.time}}</view>
						<view :class="currIndex == index?'active_time_text time_text':'time_text'">{{item.tips}}</view>
					</view>
				</view>
			</view>
			
			<view class="goods_wrap" :style="{paddingTop:is_fixed_nav?'160rpx':'0'}">
				<view class="goods_item" v-for="(item,index) in goods_list" :key="index" @click="toGoodsDetail(item.sld_gid)"> 
					<view class="goods_img_wrap">
						<image :src="item.goods_image" mode="" class="goods_img"></image>
					</view>
					
					<view class="goods_item_wrap">
						<view class="goods_name">{{item.goods_name}}</view>
						<view class="goods_bottom_wrap">
							<view class="goods_bottom_left">
								<view class="goods_price">
									<text class="small_price">{{$L('￥')}}</text>
									<text class="big_price">{{$getPartNumber(item.seckill_price,'int')}}</text>
									<text class="small_price">{{$getPartNumber(item.seckill_price,'decimal')}}</text>
								</view>
								<view class="old_price">{{$L('￥')}}{{item.goods_price}}</view>
							</view>
							<!-- 进行中去抢购 -->
							<view class="goods_bottom_right" :style="{backgroundImage:'url('+ purchase_url +')'}" v-if="item.state == 2 && item.sale_rate !='100%'">
								<text class="to_buy">{{$L('去抢购')}}</text>
								<view class="progress-box">
									<progress :percent="$formatPercent(item.sale_rate)" stroke-width="3" backgroundColor="rgba(0,0,0,0)" border-radius="5" activeColor="#fff"/>
								</view>
								<text class="have_buy_percent">{{$L('已抢')}}{{item.sale_rate}}</text>
							</view>
							<!-- 进行中已抢完 -->
							<view class="sold_out_wrap" v-if="item.state == 2 && item.sale_rate =='100%'">
								<view class="sold_out_btn" @click.stop="haveSoldOut">{{$L('已抢完')}}</view>
								<view class="sold_out_num">{{item.seckill_stock}}{{$L('件已抢完')}}</view>
							</view>
							<!-- 即将开始设置/取消提醒 -->
							<view class="remind_wrap" v-if="item.state == 1">
								<view class="set_remind_btn remind_btn" v-if="item.is_notice == 1" @click.stop="setRemind(item.id)">{{$L('设置提醒')}}</view>
								<view class="cancel_remind_btn remind_btn" v-if="item.is_notice != 1" @click.stop="setRemind(item.id)">{{$L('取消提醒')}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="is_more" v-if="goods_list.length > 0">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
			</view>
			
			<!-- 无秒杀空页面 -->
			<view class="empty_page" v-if="is_show_empty">
				<image :src="img_url+'index/empty.png'" mode="" class="empty_img"></image>
				<view class="empty_text">{{$L('今日无秒杀')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const key = uni.getStorageSync('token')
	export default{
		data(){
			return {
				img_url:getApp().globalData.img_url,
				top_bg:getApp().globalData.img_url+'addons/top_bg2.png',
				top_bg2:getApp().globalData.img_url+'addons/top_bg2.png',
				purchase_url:getApp().globalData.img_url+'addons/purchase_bg.png',
				nav_list:[],
				swiper_list:[],
				time_list:[],
				goods_list:[],
				current:0,
				swiperCurrent:0,
				currIndex:0,
				label_id:'', //分类id
				session_id:'', //场次id
				pn:1,
				has_more:true,
				activity_id:'',
				is_show_banner:true,
				is_show_empty:false,
				banner_height:'358rpx',
				is_fixed_nav:false, //是否固定场次
			}
		},
		onLoad(option){
			this.activity_id = option.activity_id
			this.getSeckillList(this.activity_id)
		},
		onPageScroll(e){
			if(this.is_show_banner){ //有轮播图
				if(e.scrollTop > 179){
					this.top_bg = getApp().globalData.img_url+'addons/top_bg2.png'
					this.is_fixed_nav = true
				}else{
					this.top_bg = this.is_show_banner?getApp().globalData.img_url+'addons/top_bg.png':getApp().globalData.img_url+'addons/top_bg2.png',
					this.is_fixed_nav = false
				}
			}else{ //没有轮播图
				if(e.scrollTop > 44){
					this.is_fixed_nav = true
				}else{
					this.is_fixed_nav = false
				}
			}
		},
		onReachBottom(){
			if(this.hasmore){
				this.getActivityGoods()
			}
		},
		methods:{
			toPrev(){
				uni.navigateBack({
					delta:1
				})
			},
			// 获取顶部分类、轮播图
			getSeckillList(activity_id){
				let _this = this
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=getActivityInfo&sld_addons=seckill&activity_id='+this.activity_id,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.state == 200) {
							let result = res.data.data
							if(result.label_list.length > 0){
								_this.nav_list = result.label_list
								_this.label_id = _this.label_id == ''?_this.nav_list[0].id:_this.label_id
								_this.currIndex = 0
							}else{
								_this.is_show_empty = true
							}
							
							if(result.activity_info.banner != ''){
								_this.swiper_list = JSON.parse(result.activity_info.banner)
								_this.swiper_list = _this.swiper_list.filter(item=>{
									return item.imgUrl != ''
								})
								if(_this.swiper_list.length == 0){
									_this.top_bg = getApp().globalData.img_url+'addons/top_bg2.png'
									_this.is_show_banner = false
								}else{
									_this.top_bg = getApp().globalData.img_url+'addons/top_bg.png'
									_this.is_show_banner = true
								}
							}else{
								_this.top_bg = getApp().globalData.img_url+'addons/top_bg2.png'
								_this.is_show_banner = false
							}
							
							_this.getSessionList()
						}else if(res.data.state == 255){
							_this.is_show_empty = true
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					}
				});
			},
			// 获取场次列表
			getSessionList(label_id,session_id){
				let _this = this
				session_id = session_id == undefined?this.label_id:session_id
				label_id = label_id == undefined ? this.label_id : label_id
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=getSessionList&sld_addons=seckill&activity_id=' + _this.activity_id + '&label_id=' + label_id + '&session_id=' + session_id,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.state == 200) {
							let result = res.data.data
							if(result.session_list != null && result.session_list.length>0){
								_this.time_list = result.session_list
								_this.session_id = _this.time_list[_this.currIndex].id
								_this.getActivityGoods(this.label_id,_this.session_id)
							}else{
								_this.is_show_empty = true
							}
						}else if(res.data.state == 255){
							_this.is_show_empty = true
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					}
				});
			},
			// 获取商品列表activitySession
			getActivityGoods(label_id,session_id){
				let _this = this
				session_id = session_id == undefined?'':session_id
				label_id = label_id == undefined ? this.label_id : label_id
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=getGoodsList&sld_addons=seckill&label_id=' + label_id + '&session_id=' + session_id + '&key=' + key + '&current='+this.pn+'&activity_id='+ this.activity_id,
					method: 'GET',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.state == 200) {
							let result = res.data.data
							_this.is_show_empty = _this.time_list.length == 0?true:false
							if(_this.pn == 1){
								_this.goods_list = result.list
							}else{
								_this.goods_list = _this.goods_list.concat(result.list)
							}
							let page = result.pagination
							if(page.current < Math.ceil(page.total/page.pageSize)){
								_this.hasmore = true
							}else{
								_this.hasmore = false
							}
							if(_this.hasmore){
								_this.pn ++
							}
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					}
				});
			},
			// 切换分类
			async changeSort(index,id){
				this.current = index
				this.label_id = id
				this.currIndex = 0
				await this.getSessionList(this.label_id,this.session_id)
			},
			// 切换场次
			async changeList(index,id){
				this.currIndex = index
				this.session_id = id
				await this.getActivityGoods(this.label,this.session_id)
			},
			swiperChange(e){
				this.swiperIndex = e.detail.current
			},
			// 设置/取消提醒
			setRemind(prepare_id){
				if(key){
					let param = {
						prepare_id
					}
					let _this = this
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=seckill&mod=prepareNotice&sld_addons=seckill&key='+key,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: param,
						success: function(res) {
							if (res.data.state == 200) {
								uni.showToast({
									title:res.data.msg
								})
								setTimeout(()=>{
									_this.getSeckillList()
								},1500)
							}else{
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
						}
					});
				}else{
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
			},
			toGoodsDetail(gid){
				uni.navigateTo({
					url:'/pages/goods_detail/goods_detail?gid='+gid
				})
			},
			// 已抢完
			haveSoldOut(){
				uni.showToast({
					title:this.$L('该商品已抢完，去看看别的吧！'),
					icon:'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
	}
	.container_box{
		width:750rpx;
		margin:0 auto;
		.seckill_top_wrap{
			width:750rpx;
			height:358rpx;
			background-size: 100% 100%;
			.seckill_top{
				width:750rpx;
				height:88rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: fixed;
				top:0;
				left:50%;
				transform: translateX(-50%);
				z-index:1000;
				background-color: #E31719;
				.to_back_icon{
					width: 17rpx;
					height:29rpx;
					position:absolute;
					left:20rpx;
					top:32rpx;
				}
				.seckill_title{
					font-size: 36rpx;
					color:#fff;
				}
			}
			.nav_list_wrap{
				width:100%;
				box-sizing: border-box;
				margin-right: 20rpx;
				padding-top:88rpx;
				.nav_list{
					height:50rpx;
					display: flex;
					align-items: center;
					overflow-x: scroll;
					padding-left:20rpx;
					box-sizing: border-box;
					margin-right: 20rpx;
					.nav_item{
						white-space: nowrap;
						font-size:32rpx;
						color:#fff;
						margin-right:53rpx;
					}
				}
			}
			.swiper_wrap{
				padding:10rpx 20rpx 0 20rpx;
				height:300rpx;
				.carousel{
					width:100%;
					height:300rpx;
					.carousel_item{
						width:100%;
						height:300rpx;
					}
				}
			}
		}
		
		.seckill_time_wrap{
			width:750rpx;
			padding:0 20rpx;
			height:137rpx;
			display: flex;
			align-items: center;
			margin-top:82rpx;
			box-sizing: border-box;
			.seckill_icon_wrap{
				width:64rpx;
				height:94rpx;
				margin-right:25rpx;
				.seckill_icon{
					width:64rpx;
					height:94rpx;
				}
			}
			.seckill_time{
				width: 100%;
				display: flex;
				overflow-x: scroll;
				.seckill_time_item{
					margin-right:40rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.time_item{
						font-size:32rpx;
						color:#333;
						font-weight: bold;
					}
					.time_text{
						font-size:24rpx;
						color:#666;
						white-space: nowrap;
						padding:0 10rpx;
					}
				}
			}
			.seckill_time view:last-child{
				margin-right:0;
			}
		}
		
		.goods_wrap{
			width:750rpx;
			padding:0 20rpx;
			box-sizing: border-box;
			.goods_item{
				width:100%;
				height:310rpx;
				background-color: #fff;
				border-radius: 15rpx;
				display: flex;
				padding:20rpx;
				box-sizing: border-box;
				margin-bottom:20rpx;
				.goods_img_wrap{
					width:270rpx;
					height:270rpx;
					border-radius: 15rpx;
					margin-right:20rpx;
					background-color: #f8f8f8;
					.goods_img{
						width:270rpx;
						height:270rpx;
						border-radius: 15rpx;
					}
				}
				.goods_item_wrap{
					width:100%;
					position: relative;
					.goods_name{
						font-size:28rpx;
						color:#2D2D2D;
						font-weight: 600;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						word-break: break-word;
						margin-top:20rpx;
					}
					.goods_bottom_wrap{
						width:100%;
						position: absolute;
						bottom:0;
						left:0;
						display: flex;
						justify-content: space-between;
						.goods_bottom_left{
							padding-top: 10rpx;
							box-sizing: border-box;
							.goods_price{
								color:#FC1C1C;
								font-weight: bold;
								.small_price{
									font-size:24rpx;
								}
								.big_price{
									font-size:34rpx;
								}
							}
							.old_price{
								font-size:20rpx;
								color:#999;
								text-decoration: line-through;
							}
						}
						.sold_out_wrap{
							.sold_out_btn{
								width: 138rpx;
								height: 50rpx;
								font-size:26rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								color:#fff;
								background: #999999;
								border-radius: 25rpx;
							}
							.sold_out_num{
								font-size: 22rpx;
								color:#666;
								margin-top:14rpx;
							}
						}
						.goods_bottom_right{
							width:129rpx;
							height:86rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							background-size: 100% 100%;
							.to_buy{
								font-size:26rpx;
								color:#fff;
								margin:6rpx 0;
							}
							.progress-box{
								width:90rpx;
							}
							.have_buy_percent{
								font-size: 20rpx;
								color:#fff;
								transform: scale(0.8);
								font-weight: 400;
							}
						}
						.remind_wrap{
							height:86rpx;
							display: flex;
							align-items: flex-end;
							.set_remind_btn{
								color: #fff;
								background: linear-gradient(90deg, #FCE000 0%, #FF6B23 0%, #FF133A 100%);
							}
							.cancel_remind_btn{
								color:#333;
								border: 1rpx solid #A6A6A6;
								box-sizing: border-box;
							}
							.remind_btn{
								width: 138rpx;
								height: 50rpx;
								font-size:26rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-radius: 25rpx;
							}
						}
					}
				}
			}
		}
	}
	.active{
		font-size:32rpx !important;
		font-weight: bold;
	}
	.active_time{
		font-size:32rpx;
		font-weight: bold;
		color:#EC2116 !important;
	}
	.active_time_text{
		padding:2rpx 10rpx;
		background-color: #EC2116;
		color:#fff !important; 
		border-radius: 17rpx;
	}
	.progress-box /deep/ .uni-progress /deep/ .uni-progress-bar{
		border:1rpx solid #fff;
		height:4rpx !important;
		border-radius: 3rpx;
	}
	.empty_page{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top:200rpx;
		.empty_img{
			width:210rpx;
			height: 210rpx;
			margin-bottom:32rpx;
		}
		.empty_text{
			font-size: 26rpx;
			color:#666;
		}
	}
	/* 加载更多，没有更多 */
	.is_more {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999999;
		line-height: 22rpx;
		padding: 10rpx 0 30rpx;
		background: #F5F5F5;
	}
	.fixed_nav{
		position:fixed;
		top:78rpx;
		left:50%;
		transform: translateX(-50%);
		z-index:999;
		background-color: #f5f5f5;
	}
	
</style>
