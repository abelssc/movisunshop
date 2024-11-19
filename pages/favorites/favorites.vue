<template>
	<view>
		<view class="favorites">
			<view class="favorites_top">
				<view class="favorites_nav">
					<text :class="type=='goods'?'on':''" data-type="goods" @tap="changeNav">{{$L('商品收藏')}}</text>
					<text :class="type=='store'?'on':''" data-type="store" @tap="changeNav">{{$L('店铺收藏')}}</text>
				</view>
			</view>

			<view class="goods-list" v-if="list.length && type=='goods'">
				<navigator v-for="(item, index) in list" :key="index" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid"
				 hover-class="none" class="goods-item bw">
					<view class="img">
						<image :src="item.goods_image_url" mode="aspectFit"></image>
					</view>
					<view class="goods-info">
						<view class="name">{{item.goods_name}}</view>
						<!--
						<view class="goods_jingle">{{item.goods_jingle}}</view>
						-->
						<view class="price bw">
							<text class="red">{{$L('￥')}}{{item.show_price}}</text>
						</view>
					</view>
					<view class="cancel-box">
						<text class="cancel-collect" :data-id="item.fav_id" @tap.stop="cancel">
							<image :src="img_url+'trash.svg'" mode="widthFix"></image>
						</text>
					</view>
				</navigator>
			</view>

			<view class="store-list" v-if="list.length && type=='store'">
				<navigator v-for="(item, index) in list" :key="index" hover-class="none" :url="'/pages/shopHomePage/shopHomePage?vid=' + item.vid"
				 class="store-item">
					<view class="img">
						<image :src="item.store_avatar_url" mode="aspectFit"></image>
					</view>
					<view class="store-info">
						<view class="store-name">{{item.store_name}}</view>
						<view class="info">
							{{$L('收藏人数：')}}
							<text>{{item.store_collect}}</text> {{$L('商品数：')}}
							<text>{{item.goods_count}}</text>
						</view>
					</view>
					<view class="del" :data-id="item.vid" @tap.stop="cancel_store">
						<image :src="img_url+'del_b.png'" mode="widthFix"></image>
					</view>
				</navigator>
			</view>

			<view class="noorder" v-if="!list.length && !isloading">
				<view :class="'noorder_content ' + (type!='goods'?'store-empty':'')">
					<view class="img">
						<image :src="img_url+'order_w.png'" mode="widthFix"></image>
					</view>
					<text>{{type=='store'?$L('您还没有关注任何店铺'):$L('您还没有关注任何商品')}}</text>
					<text>{{type=='store'?$L('可以去看看哪些店铺值得收藏'):$L('可以去看看哪些商品值得收藏')}}</text>
				</view>

				<view class="cart-comment" v-if="type==='goods'">
					<view class="goods-list">
						<navigator v-for="(item, index) in recGoods" :key="index" hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid">
							<view class="img">
								<image :src="item.goods_img_url" mode="aspectFit"></image>
							</view>

							<view class="goods-name">{{item.goods_name}}</view>

							<view class="price-wrap">
								<view class="price">{{$L('￥')}}
									<text>{{item.goods_price}}</text>
								</view>
								<view class="sale">{{item.goods_salenum}}{{$L('人付款')}}</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>
			<view class="cart-brand">
				<image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
			</view>
		</view>
		<common :title="$L('我的收藏')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>
	import request from "../../utils/request";

	export default {
		data() {
			return {
				type: 'goods',
				key: '',
				isloading: true,
				recGoods: [],
				img_url: getApp().globalData.img_url, //图片地址
				list: "",
				pn: 1,
				gids:[],
				hasmore: true,
				refresh: true
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('我的收藏')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.initData();
			// 获取推荐商品
			this.getRecGoods();
		},
		onShow(){
			this.initData();
			// 获取推荐商品
			this.getRecGoods();
		},
		onReachBottom: function() {
			if (this.hasmore) {
				this.initData();
			}
		},
		methods: {
			initData() {
				let {
					key,
					type,
					pn,
				} = this;
				let url = type == 'goods' ? getApp().globalData.ser_url + '/index.php?app=userfollow&mod=favorites_list&pn=' + pn : getApp().globalData
					.ser_url + '/index.php?app=vendorfollow&mod=flist'+ '&pn=' + pn ;
				if (pn == 1) {
					this.setData({
						isloading: true
					});
				}
				request({
					url: url,
					method: 'post',
					data: {
						key: key
					},
					loading: pn == 1
				}).then(res => {
					if (res.code == 200) {
						let data='';
						if (pn == 1) {
							data = res.datas.favorites_list;
						} else {
							data = this.list.concat(res.datas.favorites_list);
						}
						if (type === 'goods' && pn === 1 && data.length === 0) {
							// 获取推荐商品
							this.getRecGoods();
						}
						if (res.hasmore) {
							pn=pn+1;
						}
						this.setData({
							isloading: false,
							pn:pn,
							list:data,
							hasmore: res.hasmore || false
						});
					}else{
						this.setData({
							isloading: false
						});
					}
				}).catch(err => {
					this.setData({
						isloading: false
					});
				});
			},

			changeNav(e) {
				let newtype = e.currentTarget.dataset.type;
				let {
					type
				} = this;
				if (newtype == type) return;
				this.setData({
					list: [],
					type: newtype
				});
				this.pn = 1;
				this.hasmore = false;
				this.initData();
			},

			// 取消收藏 ---goods
			cancel(e) {
				let id = e.currentTarget.dataset.id;
				let {
					key
				} = this;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=userfollow&mod=favorites_del',
					method: 'post',
					data: {
						key: key,
						fav_id: id
					}
				}).then(res => {
					if (res.datas) {
						let {
							list
						} = this;
						let index = list.findIndex(el => el.fav_id == id);
						list.splice(index, 1);
						this.setData({
							list
						});
					}
				});
			},

			// 取消店铺收藏
			cancel_store(e) {
				let id = e.currentTarget.dataset.id;
				let {
					key
				} = this;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=vendorfollow&mod=fdel',
					method: 'post',
					data: {
						key: key,
						vid: id
					}
				}).then(res => {
					if (res.datas) {
						let {
							list
						} = this;
						let index = list.findIndex(el => el.vid == id);
						list.splice(index, 1);
						this.setData({
							list
						});
					}
				});
			},

			// 获取推荐商品
			getRecGoods() {
				request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getRecGoodsList'
				}).then(res => {
					if (res.code == 200) {
						let gids = [];
						res.datas.goods_list.forEach(el => {
							gids.push(el.gid);
						});
						this.setData({
							gids
						});
						this.setData({
							recGoods: res.datas.goods_list
						});
					}
				});
			}

		}
	};
</script>
<style>
	/* pages/favorites/favorites.wxss */
   page{
   	width: 750rpx;
   	margin: 0 auto;
   }
	.favorites {
		width: 100%;
		min-height: 100vh;
		background-color: #fff;
	}

	.goods_jingle{
		font-size: 24rpx;
		color: #5f5f5f;
	}
	.favorites_top {
		background-color: #fff;
		box-sizing: border-box;
		padding: 10rpx 0;
		display: none;
	}

	.favorites_top .favorites_nav {
		display: flex;
		width: 480rpx;
		justify-content: center;
		align-items: center;
		margin: 10rpx auto;
		box-sizing: border-box;
		border: 2rpx solid #eee;
		border-radius: 6rpx;
		overflow: hidden;
	}

	.favorites_nav text {
		width: 240rpx;
		color: #333;
		font-size: 32rpx;
		text-align: center;
		padding: 10rpx 0;
	}
	/* #ifdef H5 */
	.favorites_nav text{
		width: 242rpx;
	}
	/* #endif */

	.favorites_nav text.on {
		background-color: #ff4d4d;
		color: #fff;
		
	}

	.noorder {
		width: 100%;
	}

	.noorder .noorder_content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10vh 0;
	}

	.noorder .store-empty {
		padding: 20vh 0;
	}

	.noorder .noorder_content .img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		background-color: #ddd;
		overflow: hidden;
		text-align: center;
	}

	.noorder .noorder_content .img image {
		width: 110rpx;
		height: 110rpx;
		margin-top: 20rpx;
	}

	.noorder .noorder_content text:nth-of-type(1) {
		font-size: 32rpx;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}

	.noorder .noorder_content text:nth-of-type(2) {
		font-size: 26rpx;
		color: #666;
	}

	.goods-list {
		padding: 0 20rpx;
		background-color: #fff;
	}

	.bw {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.goods-item {
		width: 100%;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #e2e2e2;
		font-size: 26rpx;
	}

	.goods-item:last-child {
		margin-bottom: 0;
	}

	.goods-item .img {
		flex: 0 0 212rpx;
		display: flex;
		align-content: center;
		justify-content: center;
		width: 212rpx;
		height: 212rpx;
		overflow: hidden;
		/* border: 1rpx solid #e2e2e2; */
		box-sizing: border-box;
	}

	.goods-item .img image {
		width: 212rpx;
		height: 212rpx;
	}

	.goods-item .goods-info {
		flex: 1;
		height: 180rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.goods-info .name {
		font-size: 26rpx;
		font-weight: bold;
		width: 100%;
		color: #333;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.goods-info .price {
		font-size: 28rpx;
		padding-bottom: 10rpx;
	}

	.price .red {
		color: #ff4d4d;
	}
	.cancel-box{
		height: 22px;
		line-height: 21px;
		padding: 0 5px;
		color: #686868;
		border: 1px solid #686868;
		border-radius: 3px;
		image{
			width: 20px;
			height: 20px;
		}
	}

	.store-list {
		padding: 0 20rpx;
		background-color: #fff;
		min-height: 400px;
	}

	.store-item {
		display: flex;
		align-items: center;
		height: 130rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.store-item .img {
		flex: 0 0 90rpx;
		width: 90rpx;
		height: 90rpx;
	}

	.store-item .img image {
		width: 90rpx;
		height: 90rpx;
	}

	.store-item .store-info {
		flex: 1;
		padding-left: 30rpx;
	}

	.store-item .store-info .store-name {
		color: #333;
		font-size: 28rpx;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 20rpx;
	}

	.store-item .store-info .info {
		display: flex;
		align-items: center;
		color: #888;
		font-size: 24rpx;
	}

	.store-info .info text {
		margin-right: 30rpx;
		color: #333;
	}

	.store-item .del {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 100rpx;
	}

	.store-item .del image {
		width: 30rpx;
	}

	.cart-brand {
		margin: 41rpx 0 23rpx;
		text-align: center;
	}

	.cart-brand image {
		width: 427rpx;
		height: 48rpx;
	}

	.cart-comment .goods-list {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		box-sizing: border-box;
		padding: 0;
		background-color: transparent;
	}

	.goods-list navigator {
		margin-bottom: 20rpx;
		/* border-radius: 14rpx; */
		/* margin-left: 20rpx; */
		overflow: hidden;
		background-color: #fff;
	}

	/* .goods-list .img {
  width: 345rpx;
  height: 345rpx;
} */

	/* .goods-list .img image {
  width: 100%;
  height: 100%;
} */

	.goods-list .goods-name {
		padding-top: 10rpx;
		line-height: 39rpx;
		color: #2d2d2d;
		font-size: 28rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding: 0 20rpx;
		margin-top: 10rpx;
		overflow: hidden;
		box-sizing: border-box;
	}

	.goods-list .price-wrap {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		padding: 0 20rpx 20rpx;
	}

	.price-wrap .price {
		color: #e1251b;
		font-size: 24rpx;
	}

	.price-wrap .price text {
		font-size: 38rpx;
		font-weight: bold;
	}

	.price-wrap .sale {
		margin-left: 10rpx;
		color: #949494;
		font-size: 24rpx;
	}

	/* 推荐商品样式 */

	.cart-comment .goods-list navigator {
		width: 345rpx;
		margin-bottom: 20rpx;
		border-radius: 14rpx;
		margin-left: 20rpx;
		overflow: hidden;
		background-color: #fff;

	}

	.cart-comment .goods-list .img {
		width: 345rpx;
		height: 345rpx;
	}

	.cart-comment .goods-list .img image {
		width: 100%;
		height: 100%;
	}
</style>
