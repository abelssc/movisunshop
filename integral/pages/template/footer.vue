<template name="footerBar">
			<view class="footer_bar" :style="'padding-bottom:'+bottomSateArea">
				<view class="footer_item" data-url="/integral/pages/index/index" @tap="jumpPage">
					<image :src="imgSrc=='index'?'/static/integral/images/11.png':'/static/integral/images/1.png'" mode="aspectFit"></image>
					<text :class="imgSrc=='index'?'on':''">{{$L('首页')}}</text>
				</view>

				<view class="footer_item" data-url="/integral/pages/cart/cart" @tap="jumpPage">
					<image :src="imgSrc=='cart'?'/static/integral/images/44.png':'/static/integral/images/4.png'" mode="aspectFit"></image>
					<text :class="imgSrc=='cart'?'on':''">{{$L('购物车')}}</text>
				</view>

				<view class="footer_item" data-url="/integral/pages/my_order/my_order" @tap="jumpPage">
					<image :src="imgSrc=='order'?'/static/integral/images/33.png':'/static/integral/images/3.png'" mode="aspectFit"></image>
					<text :class="imgSrc=='order'?'on':''">{{$L('订单')}}</text>
				</view>

				<view class="footer_item" data-url="/integral/pages/center/center" @tap="jumpPage">
					<image :src="imgSrc=='center'?'/static/integral/images/55.png':'/static/integral/images/5.png'" mode="aspectFit"></image>
					<text :class="imgSrc=='center'?'on':''">{{$L('我的')}}</text>
				</view> 
			</view>
</template>
<script>
	export default {
		name: "footerBar",
		data() {
			return {
				bottomSateArea:getApp().globalData.bottomSateArea,//iphone手机底部一条黑线的高度
			}
		},
		props: {
			imgSrc: {
				type: String,
				value: 'index'
			},
		},
		methods: {
			jumpPage(e) {
				let url = e.currentTarget.dataset.url;
				if (url) {
					uni.redirectTo({
						url
					});
				}
			},
		}
	}
</script>
<style>
	.footer_bar {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  display: flex;
	  justify-content: space-around;
	  align-items: center;
	  height: 98rpx;
	  background-color: #fff;
	  overflow: hidden;
	  box-shadow: 0 0 6rpx #ccc;
	  z-index: 99;
	  width: 750rpx;
	  margin: 0 auto;
	}
	
	.footer_bar .footer_item {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 0 30rpx;
	}
	
	.footer_bar image {
	  max-width: 126rpx;
	  height: 40rpx;
	}
	
	.footer_bar text {
	  font-size: 24rpx;
	  color: #5b5b5b;
	  margin-top: 10rpx;
		overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
	}
	
	.footer_bar text.on {
	  color: #ee2327;
	}
</style>
