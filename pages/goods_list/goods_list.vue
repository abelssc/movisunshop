<template>
	<view>
		<!-- 占位状态栏 start -->
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"> </view>
		<!-- #endif -->
		<view class="fixed_top_status_bar" ></view>
		<!-- 占位状态栏 end -->
		<view class="header">
			<view class="top_w">
				<!-- #ifdef H5 ||APP-PLUS -->		
				<image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'" mode="widthFix"></image>
				<!-- #endif -->
				<view class="search" @tap="go_search">
					<image :src="img_url+'goods_list_search_icon.png'" mode="widthFix"></image>
					<text :class="{'empty_color':!keyword}">{{keyword!=''?keyword:$L('搜索商品')}}</text>
				</view>
			</view>

			<view class="sel-condition">
				<view class="filter">
					<view :class="'sel-item ' + ((seleindex==1||seleindex==5||seleindex==6||seleindex==7)?'current':'')" data-index="1"
					 @tap.stop="getGoodslist">
						<text class="txt">{{$L('综合')}}</text>
						<text class="iconfont sld_mxiala"></text>
					</view>
					<view :class="'sel-item ' + (seleindex==2?'current':'')" data-order="2" data-key="1" data-index="2" @tap.stop="getGoodslist">
						<text class="txt">{{$L('销量')}}</text>
					</view>
					<view :class="'sel-item sel-price ' + (seleindex==4?'current':'')" data-order="1" data-key="3" data-index="4"
					 @tap.stop="getGoodslist">
						<text class="txt">{{$L('价格')}}</text>
						<view class="icons">
							<text :class="'iconfont sld_mxiala up  ' + (order==1?'red':'')"></text>
							<text style="margin-top: 5rpx;" :class="'iconfont sld_mxiala down  ' + (order==2?'red':'')"></text>
						</view>
					</view>
					<view :class="'sel-item ' + (hasFilter?'current':'')" data-order data-index="3" @tap.stop="getGoodslist">
						<text class="txt">{{$L('筛选')}}</text>
						<text class="iconfont sld_mshaixuan"></text>
					</view>
				</view>

				<view class="toggle" @tap="toggleShowType">
					<image :src="showType=='list'?img_url+'show2.png':img_url+'show1.png'"></image>
				</view>
			</view>
		</view>

		<view class="pricearea" :hidden="pricearea" @tap.stop="closePri" id="pricearea-wrap" catchtouchmove="touchmove">

			<view class="pri-content">

				<view :class="'pri-item ' + (seleindex==5?'current':'')" data-order data-key data-index="5" @tap="getGoodslist">
					<text>{{$L('综合排序')}}</text>
					<image :src="img_url+'order_sel.png'" v-if="seleindex==5"></image>
				</view>

				<view :class="'pri-item ' + (seleindex==6?'current':'')" data-order="2" data-key="2" data-index="6" @tap="getGoodslist">
					<text>{{$L('人气排序从高到低')}}</text>
					<image :src="img_url+'order_sel.png'" v-if="seleindex==6"></image>
				</view>

				<view :class="'pri-item ' + (seleindex==7?'current':'')" data-order="1" data-key="2" data-index="7" @tap="getGoodslist">
					<text>{{$L('人气排序从低到高')}}</text>
					<image :src="img_url+'order_sel.png'" v-if="seleindex==7"></image>
				</view>

			</view>

		</view>

		<view :class="'goods-list ' + (showType=='list'?'show-list':'grid-list')" v-if="goods_list.length" style="overflow-x: hidden;">
			<view v-for="(item, index) in goods_list" :key="index" class="item">
				<navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid" class="img">
					<image :src="item.goods_image_url" mode="aspectFit"></image>
				</navigator>

				<view class="goods-info">
					<navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid" class="goods-name">
						{{item.goods_name}}
					</navigator>

					<view class="jingle">{{item.goods_jingle}}</view>

					<view class="goods-price">
						<view class="price">{{$L('￥')}}
							<text>{{item.show_price}}</text>
						</view>
						<view class="sale">{{item.goods_salenum}}{{$L('人付款')}}</view>
					</view>

					<view class="goods-type-wrap">
						<text class="goods-type jtt" v-if="item.promotion_type && item.promotion_type=='pin_ladder_tuan'">{{$L('阶梯团')}}</text>
						<text class="goods-type tuan" v-if="item.promotion_type && item.promotion_type=='tuan'">{{$L('团购')}}</text>
						<text class="goods-type xszk" v-if="item.promotion_type && item.promotion_type=='xianshi'">{{$L('限时折扣')}}</text>
						<text class="goods-type sjzx" v-if="item.promotion_type && item.promotion_type=='p_mbuy'">{{$L('手机专享')}}</text>
						<text class="goods-type pt" v-if="item.promotion_type && item.promotion_type=='pin_tuan'">{{$L('拼团')}}</text>
						<text class="goods-type ys" v-if="item.promotion_type && item.promotion_type=='sld_presale'">{{$L('预售')}}</text>
						<text class="goods-type speckill" v-if="item.promotion_type && item.promotion_type=='seckill'">{{$L('秒杀')}}</text>
					</view>

					<view class="store">
						<text class="store-name">{{item.store_name}}</text>
						<navigator hover-class="none" :url="'/pages/shopHomePage/shopHomePage?vid=' + item.vid">
							{{$L('去店铺')}}
							<image src="../../static/images/arrow_right_b.png" mode="" style="width: 24rpx;height: 24rpx;"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>

		<view class="no-has-more" v-if="!hasmore" :style="'background-color: ' + (showType=='list'?'#fff':'transparent')">
			<text class="iconfont sld_mbiaoqingwunai1-copy-copy"></text> {{$L('我也是有底线的~')}}
		</view>

		<view class="loading" v-if="hasmore">
			<view class="spinner">
				<text></text>
			</view>
			{{$L('商品数据读取中...')}}
		</view>

		<view class="go-top" @tap.stop="go_top" :hidden="show_go_top">
			<image :src="img_url+'gotop_b.png'" mode="widthFix"></image>
		</view>
		<view class="no_cart_goods" v-if="!goods_list.length && isloading">
			<image :src="img_url+'active4_m.png'"></image>
			<text>{{$L('没有搜索到相关产品~')}}</text>
		</view>
		<common :title="$L('商品列表')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>
	const scrollHeight = 600; //获取购物车列表的方法
	//获取购物车列表的方法
	let get_glist = function(that) {
		//组装请求的数据
		let {
			keyword,
			rows,
			gc_id,
			price_from,
			price_to,
			area_id,
			order,
			key,
			pn,
			red_id,
			own_shop
		} = that;
		let request_data = {
			keyword,
			rows,
			gc_id,
			price_from,
			price_to,
			area_id,
			order,
			key,
			pn,
			red_id,
			own_shop
		};
		let bid = uni.getStorageSync('city_site_bind_id') || 0;
		let isopen = uni.getStorageSync('city_site_open');

		if (isopen && bid != 0) {
			request_data.bid = bid;
		}

		if (pn == 1) {
			uni.showLoading({
				title: that.$L('加载中...')
			});
		}

		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_list_xcx',
			data: request_data,
			dataType: 'json',
			success: function(result) {
				//如果是初次加载，直接赋值，否则数据追加
				var data = [];
                let gids = [];
                result.data.datas.goods_list.forEach(el => {
                	gids.push(el.gid);
                });
                that.setData({
                	gids
                });
				if (pn == 1) {
					data = result.data.datas.goods_list;
				} else {
					data = that.goods_list.concat(result.data.datas.goods_list);
				}

				if (result.data.hasmore) {
					pn = pn + 1;
				} //如果hasmore为true，则


				that.setData({
					pn: pn,
					hasmore: result.data.hasmore || false,
					goods_list: data
				});
			},
			complete: () => {
				that.setData({
					isloading: true
				});
				uni.hideLoading();

				if (that.refresh) {
					uni.stopPullDownRefresh();
					that.setData({
						refresh: false
					});
				}
			}
		});
	};

	export default {
		data() {
			return {
				rows: 10,
				gc_id: '',
				keyword: '',
				price_from: '',
				price_to: '',
				area_id: '',
				pn: 1,
				hasmore: true,
				show_go_top: true,
				goods_list: [],
				order: '',
				key: '',
				seleindex: 5,
				pricearea: true,
				isloading: false,
				refresh: false,
				gids: [],
				showType: 'list',
				red_id: '',
				own_shop: '',
				area: '',
				isfilter: false,
				img_url: getApp().globalData.img_url, //图片地址
				type: "",
				hasFilter: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('商品列表')
      });
			this.setData({ ...options
			});
			this.saveSearchHistory(options); //获取商品列表
			get_glist(this);
		},

		onShow() {
			let {
				isfilter
			} = this;

			if (isfilter) {
				this.setData({
					isfilter: false
				});
				get_glist(this);
			}
		},

		onReachBottom() {
			if (this.hasmore) {
				get_glist(this);
			}
		},

		onPullDownRefresh() {
			this.setData({
				pn: 1,
				hasmore: true,
				refresh: true
			});
			get_glist(this);
		},

		methods: {
			saveSearchHistory(options) {
				if (options.keyword != undefined) {
					let keyword = options.keyword;
					this.setData({
						keyword: keyword
					});
					uni.setStorageSync('keyword', keyword);
					if (keyword.length > 30) return;
					let history_val = uni.getStorageSync('his_keyword');

					if (history_val) {
						let his_arr = history_val.split('~');
						his_arr.unshift(keyword); // 最多取30条，不重复且不为空的数据

						his_arr = his_arr.reduce((a, b) => {
							a.length <= 30 && b && a.indexOf(b) == -1 ? a.push(b) : null;
							return a;
						}, []);
						history_val = his_arr.join('~');
					} else {
						history_val = options.keyword;
					}

					uni.setStorage({
						key: "his_keyword",
						data: history_val
					});
				}
			},

			onPageScroll(e) {
				let scrollTop = e.scrollTop;

				if (scrollTop > scrollHeight && this.show_go_top) {
					this.setData({
						show_go_top: false
					});
				} else if (scrollTop < scrollHeight && !this.show_go_top) {
					this.setData({
						show_go_top: true
					});
				}
			},

			go_top() {
				uni.pageScrollTo({
					scrollTop: 0
				});
			},

			//跳转搜索页面
			go_search: function() {
				let page = getCurrentPages();
				let len = page.length;

				if (len > 1 && page[len - 2].route == "pages/search/search") {
					uni.navigateBack({});
				} else {
					uni.redirectTo({
						url: '../search/search'
					});
				}
			},
			go_back: function(e) {
				uni.navigateBack({})
			},
			inputHandle: function(e) {
				var type = e.currentTarget.dataset.type;
				this.setData({
					[type]: e.detail.value
				});
			},
			//排序事件
			getGoodslist: function(e) {
				let index = e.currentTarget.dataset.index;
				if (index != 1 && index != 4 && index != 3) {
					this.setData({
						order: e.currentTarget.dataset.order,
						key: e.currentTarget.dataset.key,
						pricearea: true,
						pn: 1,
						seleindex: index
					}); //获取商品列表
					get_glist(this);
				} else if (index == 4) {
					// 价格
					let {
						order
					} = this;
					this.setData({
						order: order == 1 ? 2 : 1,
						key: e.currentTarget.dataset.key,
						pricearea: true,
						pn: 1,
						seleindex: index
					}); //获取商品列表

					get_glist(this);
				} else if (index == 3) {
					// 筛选
					let {
						price_from,
						price_to,
						area_id,
						area,
						own_shop
					} = this;
					let params = {
						price_from,
						price_to,
						area_id,
						area,
						own_shop
					};
					let url = '/pages/filter/filter';

					for (let i in params) {
						if (url.indexOf('?') > -1) {
							url += `&${i}=${params[i]}`;
						} else {
							url += `?${i}=${params[i]}`;
						}
					}

					uni.navigateTo({
						url
					});
				} else {
					// 综合排序
					const { pricearea } = this;
					this.setData({
						pricearea: !pricearea
					});
				}
			},

			// 关闭筛选
			closePri(e) {
				if (e.target.id == 'pricearea-wrap') {
					this.setData({
						pricearea: true
					});
				}
			},

			//价格区间筛选商品
			getpricearea: function() {
				this.setData({
					pricearea: true
				});
				get_glist(this);
			},

			touchmove() {
				// 处理滚动穿透的
				return false;
			},

			// 切换展示方式
			toggleShowType() {
				const {
					showType
				} = this;
				this.setData({
					showType: showType == 'list' ? 'grid' : 'list'
				});
			},

			// 筛选
			filterData(e) {
				let hasFilter = false;

				for (let i in e) {
					if (e[i] || e[i] === 0) {
						hasFilter = true;
					}
				}

				this.setData({ ...e,
					pn: 1,
					isfilter: true,
					hasFilter: hasFilter
				});
			}

		}
	};
</script>
<style>
	page {
		font-size: 26rpx;
		color: #2d2d2d;
		background-color: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
	}

	.header {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		left: 0;
		width: 750rpx;
		background-color: #fff;
		z-index: 9;
		margin: 0 auto;
		right: 0;
	}

	.header .search {
		flex: 1;
		display: flex;
		align-items: center;
		height: 65rpx;
		border-radius: 32.5rpx;
		background-color: #f5f5f5;
		color: #333;
		margin: 10rpx 40rpx;
		padding-right: 10rpx;
	}

	/* #ifdef H5 ||APP-PLUS */
	.header .search {
		margin: 10rpx 40rpx 10rpx 0;
		
	}
	/* #endif */
	 .header .search text {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		flex: 1;
	}

	.header .search .empty_color {
		color: #999 !important;
		font-size: 24rpx;
	}

	.header .search image {
		width: 30rpx;
		height: 30rpx !important;
		height: 0;
		margin: 0 15rpx 0 20rpx;
		flex-shrink: 0;
	}

	.header .sel-condition {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 74rpx;
		padding: 0 20rpx 10rpx;
	}

	.sel-condition .filter {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 74rpx;
	}

	.sel-condition .toggle {
		position: relative;
		width: 83rpx;
		flex: 0 0 83rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.sel-condition .toggle::after {
		position: absolute;
		top: 6rpx;
		left: 0;
		width: 1rpx;
		height: 36rpx;
		background-color: #e5e5e5;
		content: '';
		transform: scaleX(0.5);
	}

	.sel-condition .toggle image {
		width: 48rpx;
		height: 48rpx;
	}

	.sel-condition .icons {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 0.6;
	}

	.sel-condition .icons .up {
		transform: rotate(180deg);
	}

	.header .sel-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		text-align: center;
		/* line-height: 70rpx; */
		font-size: 28rpx;
		color: #2d2d2d;
	}

	.sld_mshaixuan {
		font-size: 26rpx !important;
	}

	.header .sel-item.current {
		color: #E1251B;
	}

	.header .sel-item .txt {
		margin-right: 9rpx;
	}

	.header .sel-item .iconfont {
		font-size: 20rpx;
	}

	.sel-price.current .iconfont {
		color: #2d2d2d;
	}

	.sel-price.current .iconfont.red {
		color: #E1251B;
	}

	.show-list {
		/* #ifdef MP || H5 */
		margin-top: 190rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: 200rpx;
		/* #endif */
		background-color: #fff;
	}

	.grid-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 170rpx;
	}

	.show-list .item {
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx 0;
	}

	.grid-list .item {
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 14rpx;
		margin-left: 20rpx;
	}

	.item .img {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.show-list .item .img {
		flex: 0 0 294rpx;
		width: 294rpx;
		height: 294rpx;
	}

	.grid-list .item .img {
		width: 345rpx;
		height: 345rpx;
	}

	.item .img image {
		width: 100%;
		height: 100%;
	}

	.show-list .item .goods-info {
		flex: 1;
		height: 294rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 20rpx;
	}

	.grid-list .item .goods-info {
		padding: 20rpx;
	}

	.item .goods-name {
		width: 100%;
		font-size: 26rpx;
		line-height: 39rpx;
		overflow: hidden;
	}

	.show-list .item .goods-name {
		height: 78rpx;
		padding-top: 10rpx;
		width: 405rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.grid-list .item .goods-name {
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item .jingle {
		height: 30rpx;
		color: #949494;
		font-size: 24rpx;
		width: 300rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.item .goods-price {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
	}

	.item .goods-price .price {
		color: #e1251b;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.goods-price .price text {
		font-size: 34rpx;
		font-weight: bold;
	}

	.item .goods-price .sale {
		color: #949494;
		font-size: 22rpx;
	}

	.item .goods-type-wrap {
		display: flex;
		align-items: center;
		height: 30rpx;
		margin-top: 15rpx;
	}

	.item .goods-type-wrap .goods-type {
		display: flex;
		align-items: center;
		height: 30rpx; 
		/*line-height: 30rpx; */
		/* vertical-align: middle;*/
		border-radius: 15rpx;
		padding: 0 8rpx;
		color: #fff;
		font-size: 22rpx;
		margin-right: 10px;
	}

	.goods-type-wrap .goods-type.jtt {
		background: linear-gradient(to right, #fc1c1c, #ff5539);
	}

	.goods-type-wrap .goods-type.tuan {
		background: linear-gradient(to right, #ff2a00, #ff0042);
	}

	.goods-type-wrap .goods-type.xszk {
		background: linear-gradient(to right, #ff6c00, #ffc053);
	}

	.goods-type-wrap .goods-type.sjzx {
		background: linear-gradient(to right, #6a4dff, #6269fe);
	}

	.goods-type-wrap .goods-type.pt {
		background: linear-gradient(to right, #ff6000, #ff9c00);
	}

	.goods-type-wrap .goods-type.ys {
		background: linear-gradient(to right, #a62fcd, #ff006c);
	}
	
	.goods-type-wrap .goods-type.speckill {
		background: linear-gradient(to right, #fc5300, #ff1353);
	}

	.item .store {
		display: flex;
		align-items: center;
		color: #666;
		font-size: 24rpx;
		margin-top: 15rpx;
	}

	.grid-list .store .store-name {
		width: 160rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.item .store navigator {
		display: flex;
		align-items: center;
		color: #2d2d2d;
		margin-left: 10rpx;
	}

	.item .store navigator text {
		display: inline-block;
		font-size: 20rpx;
		transform: rotate(180deg);
	}

	.pricearea {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		left: 0;
		width: 750rpx;
		height: 100vh;
		padding-top: 159rpx;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 8;
	}

	.pricearea .pri-content {
		padding: 25rpx 25rpx 15rpx 36rpx;
		background-color: #F8F8F8;
		border-radius: 0 0 14rpx 14rpx;
	}

	.pricearea .pri-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60rpx;
		color: #2D2D2D;
		font-size: 28rpx;
	}

	.pricearea .pri-item.current {
		color: #E1251B;
	}

	.pricearea .pri-item.current image {
		width: 23rpx;
		height: 16rpx;
	}

	.go-top {
		position: fixed;
		right: 30rpx;
		bottom: 80rpx;
		width: 114rpx;
		z-index: 7;
	}

	.go-top image {
		width: 114rpx;
		height: 0;
	}

	.no_cart_goods {
		width: 750rpx;
		height: calc(100vh - 84rpx);
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.no_cart_goods image {
		width:210rpx;
		height: 210rpx;
		margin-top: 300rpx;
		color: #949494;
		font-size: 24rpx;
	}

	.no_cart_goods text {
		margin-top: 15rpx;
	}

	.no-has-more {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		color: #999;
	}

	.no-has-more text {
		color: #E1251B;
		margin-right: 10rpx;
	}

	.no-has-more::after,
	.no-has-more::before {
		position: absolute;
		content: '';
		width: 166rpx;
		height: 1rpx;
		background-color: #999;
		top: 50%;
		transform: translateY(-50%) scaleY(0.5);
	}

	.no-has-more::after {
		right: 68rpx;
	}

	.no-has-more::before {
		left: 68rpx;
	}

	.top_w {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.top_w_b {
		height: 30rpx;
		width: 30rpx;
		margin: 0 20rpx;
		display: block;
	}	
	.fixed_top_status_bar{
	 	position: fixed;
	 	/* #ifdef APP-PLUS */
	 	height: var(--status-bar-height);
	 	/* #endif */
	 	/* #ifndef APP-PLUS */
	 	height: 0;
	 	/* #endif */
	 	top: 0; 
	 	left: 0;
	 	right: 0;
	 	z-index: 99;
	 	background: #fff;
	 }
	 .status_bar{
	 	height: var(--status-bar-height);
	 	width: 100%;
	 	background-color: #FFFFFF;
	 }
</style>
