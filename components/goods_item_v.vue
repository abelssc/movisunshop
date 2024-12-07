<!-- 商品组件：竖直方向
	点击进入商品详情页
	加入购物车事件
-->
<template name="goodsItemV">                                                                             
	<view class="goods_v_item flex_column_start_start" @click="goGoodsDetail(goods_info.gid)" :style="{width:'calc((750rpx - '+page_margin*4+'rpx - '+goods_margin*2+'rpx)/2)',border:border_style == 'border_eee'?'1rpx solid #eee':'',boxShadow:border_style == 'card-shadow'?'rgba(93, 113, 127, 0.08) 0px 2px 8px':'',marginRight:goods_margin+'px',borderRadius:border_radius+'px'}">
		<view class="goods-img" v-if='goods_info.goods_image_url' :style="{backgroundImage: 'url('+goods_info.goods_image_url+')',borderRadius:border_radius+'px',width:'calc((750rpx - '+page_margin*2+'rpx - '+goods_margin*2+'rpx)/2)'}"></view>
		<view class="goods-img" v-else :style="{backgroundImage: 'url('+goods_info.goods_image+')',width:'calc((450rpx - '+page_margin*2+'px - '+goods_margin*2+'rpx)/2)'}"></view>
		<text class="goods-name">{{goods_info.goods_name.toLowerCase()}}</text>
		<view :class="show_sale == true?'goods-price flex_row_between_center':'goods-price flex_row_between_center have_no_sale'">
			<view class="left">
				<text class="unit">{{$L('￥')}}</text>
				<text class="price_int">{{this.$getPartNumber(goods_info.goods_price,'int')}}</text>
				<text class="price_decimal">{{this.$getPartNumber(goods_info.goods_price,'decimal')}}</text>
			</view>
			<view :class="show_sale == true?'goods_item_bottom':''">
				<view class="have_sold_text" v-if="show_sale == true">{{$L('已售')}}{{goods_info.goods_salenum}}{{$L('件')}}</view>
				<image :src="img_url+'live/add_cart.png'" @click.stop="addCart(goods_info.gid)" v-if="icon_type == 1"></image>
				<image :src="icon2" @click.stop="addCart(goods_info.gid)" v-if="icon_type == 2"></image>
				<image :src="icon3" @click.stop="addCart(goods_info.gid)" v-if="icon_type == 3"></image>
				<image :src="icon4" @click.stop="addCart(goods_info.gid)" v-if="icon_type == 4"></image>
				<image :src="icon5" @click.stop="addCart(goods_info.gid)" v-if="icon_type == 5"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goodsItemV",
		data() {
			return {
				img_url: getApp().globalData.img_url,
				icon2:getApp().globalData.img_url+'index/add2.png',
				icon3:getApp().globalData.img_url+'index/add.png',
				icon4:getApp().globalData.img_url+'index/add3.png',
				icon5:getApp().globalData.img_url+'index/stop.png',
				icon_url:'',	//加车图标
				goods_pic:''  ,//商品图片
				stat_end:1,  //终端，默认为1，pc端
			}
		},
		props: {
			// 商品信息
			goods_info: {
				type: Object,
				value: {}
			},
			// 加车按钮类型
			icon_type:{
				type:Number,
			},
			// 是否展示销量
			show_sale:{
				type:Boolean
			},
			// 商品弧度
			border_radius:{
				type:Number
			},
			// 商品边框类型
			border_style:{
				type:String
			},
			// 商品边距
			goods_margin:{
				type:Number,
				default:10
			},
			// 页面边距
			page_margin:{
				type:Number,
				default:10
			}
		},
		onLoad(){
			this.getPlatform();
		},
		mounted(){
			this.getPlatform();
		},
		methods: {
			//获取当前终端的方法
			   getPlatform(){
			    //判断终端
			    this.stat_end = 1;
			    // #ifdef H5
			    this.stat_end = 2;
			    // #endif
			    // #ifdef MP-WEIXIN
			    this.stat_end = 3;
			    // #endif
			    // #ifdef APP-PLUS
			    if(uni.getSystemInfoSync().platform == 'android'){
			     this.stat_end = 5;
			    }else if(uni.getSystemInfoSync().platform == 'ios'){
			     this.stat_end = 4;
			    }
			    // #endif
			   },
			//进入商品详情页
			goGoodsDetail(gid) {
				uni.navigateTo({
					url: '/pages/goods_detail/goods_detail?gid=' + gid
				})
			},
			// 加入购物车
			addCart(gid){
				let uuid = uni.getStorageSync('uuid');
				let key = uni.getStorageSync('token');
        let that = this;
				if(key){
					uni.request({
						url:getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						data:{
							key:key,
							gid:gid,
							quantity:1,
							stat_end:this.stat_end
						},
						method:'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success:function(res){
							if(res.data.datas.status == true){
								uni.showToast({
									title: that.$L('加入购物车成功'),
									icon:'none'
								})
							}else{
								uni.showToast({
									title:res.data.datas.msg,
									icon:'none'
								})
							}
						}
					})
				}else{
					//未登录
					let url = getApp().globalData.ser_url + '/index.php?app=cache_cart&mod=cart_add';
					uni.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: uuid,
							is_from_live: '0',
							//是否来自直播：0否1是
							gid,
							quantity: 1 ,//数量
							stat_end:this.stat_end
					
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								}); //一键回到页面顶部
					
								// that.goTop();
								get_cart_list(that);
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									duration: 500,
									icon: 'none'
								});
							}
						}
					});
				}
			},
			changeImg(val){
				return val.mainImgUrl?val.mainImgUrl:val.goodsPic
			}
		},
	}
</script>

<style lang='scss'>
	.goods_v_item {
		/* width: calc((750rpx - 60rpx)/2); */
		/* height: 516rpx; */
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 22rpx;
		display: flex;
		flex-direction: column;
		&{
			margin-right:0 !important;
		}
		.goods-img {
			background-size: 100% 100%;
			background-position: center center;
			background-repeat: no-repeat;
			/* width: calc((750rpx - 60rpx)/2); */
			height: calc((450rpx - 60rpx)/2);
			overflow: hidden;
			background-color: #fff;
			margin: 0 auto;
		}

		.goods-name {
			margin: 20rpx auto 0;
			font-size: 26rpx;
			color: #666;
			line-height: 40rpx;
			max-height: 80rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			word-break: break-word;
			white-space: pre-line;
			padding: 0 40rpx;
			text-transform: capitalize;
			text-align: center;
		}

		.goods-price {
			padding: 0 40rpx;
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			margin-bottom: 60rpx;
			.left {
				width:100%;
				color: #2d2d2d;
				
				.unit,
				.price_decimal {
					font-size: 24rpx;
					margin-right: 3rpx;
					font-weight: 500;
				}
				.price_int {
					font-size: 34rpx;
					line-height: 34rpx;
					font-weight: 500;
				}
			}

			image {
				width: 42rpx;
				height: 42rpx;
			}
		}
	}
	.goods_item_bottom{
		width:100%;
		display: flex;
		justify-content: space-between;
		margin-top:20rpx;
		padding-bottom: 20rpx;
	}
	.have_sold_text{
		font-size:24rpx;
		color:#9a9a9a;
	}
	.have_no_sale{
		width: 100%;
		flex-direction: row !important;
		justify-content: space-between !important;
		padding:20rpx 40rpx !important;
	}
</style>
