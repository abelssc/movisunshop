<template>
	<view>
		<view class="shop_list">

			<!-- 占位状态栏 start -->
			<!-- #ifdef H5 || APP-PLUS -->
			<view class="status_bar"> </view>
			<!-- #endif -->
			<view class="fixed_top_status_bar"></view>
			<!-- 占位状态栏 end -->


			<!-- 透明遮罩层 -->
			<view class="transparent_mask" v-if="transparent_mask" @tap="hideMask"></view>
			<!-- 搜索 -->
			<view class="search" v-if="searchShow">
				<!-- #ifdef H5 ||APP-PLUS -->
				<image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'" mode="widthFix"></image>
				<!-- #endif -->
				<view class="search_input">
					<input :placeholder="$L('请输入店铺名称')" :value="searchVal" @input="searchInput" @confirm="search"></input>
					<image class="cancel" :src="img_url+'guanbi.png'" @tap="cancel"></image>
				</view>
				<view class="search_text" @tap="search">{{$L('搜索')}}</view>
			</view>
			<view class="search" v-else>
				<!-- #ifdef H5 ||APP-PLUS -->
				<image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'" mode="widthFix"></image>
				<!-- #endif -->
				<view class="search_input" @tap="goSearch">
					<image :src="img_url+'shop_list_search.png'"></image>
					<input :placeholder="$L('请输入店铺名称')" disabled="true"></input>
				</view>
				<view class="more_tips">
					<image class="more" :src="img_url+'more_black.png'" @tap="moreTips"></image>
					<block v-if="tips_show">
						<view class="triangle-up"> </view>
						<view class="tips">
							<view v-for="(item, index) in tips" :key="index" class="tips_pre" @tap="handleLink" :data-link="item.tips_link">
								<image :src="item.tips_img"></image>
								<text>{{item.tips_name}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 内容区 -->
			<view class="content" v-if="store_list.length">
				<!-- 选项卡 -->
				<view class="select_nav">
					<block v-for="(item, index) in [$L('综合'),$L('销量'),$L('信用'),$L('人气')]" :key="index">
						<view :class="'nav_item ' + (currentTabIndex == index ? 'active' : '')" @tap="onTabItemChange" :data-index="index">{{item}}</view>
					</block>
				</view>
				<!-- 店铺列表 -->
				<view class="shop_lists">
					<view class>
						<view v-for="(item, index) in store_list" :key="index" class="shop_pre">
							<view class="pre_top" @tap="handleShopHomePage" :data-vid="item.vid">
								<view class="shop_left">
									<view class="shop_avatar_img">
										<image class="shop_avatar" mode="aspectFill" :src="item.store_label"></image>
									</view>
									<view class="shop_des">
										<view class="des_top">
											<text class="shop_name">{{item.store_name}}</text>
											<text class="shop_type" v-if="item.is_own_shop == 1">{{$L('自营')}}</text>
											<text v-else></text>
										</view>
										<view class="des_bottom">
											<text class="popularity">{{$L('人气')}}{{item.store_collect}}</text>
											<text class="line">|</text>
											<text class="payer_number">{{$L('已付款')}}{{item.num_sales_jq}}{{$L('人')}}</text>
										</view>
									</view>
								</view>
								<view class="go_shop">{{$L('进店')}}</view>
							</view>
							<view class="pre_content" v-if="item.search_list_goods.length">
								<view v-for="(item1, index2) in item.search_list_goods" :key="index2" class="commodity" v-if="index2 < 3"
								 :data-gid="item1.gid" @tap="goods_detail">
									<view class="commodity_images">
										<image :src="item1.goods_image_url" mode="aspectFit" class="commodity_img"></image>
									</view>
									<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(item1.goods_price)[0]}}</text>.<text>{{filters.toSplit(item1.goods_price)[1]}}</text></view>
								</view>
							</view>
						</view>
						<view class="is_more">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
					</view>

				</view>
			</view>
			<!-- 暂无相关店铺 -->
			<view class="no_content" v-if="no_content_shop">
				<image :src="img_url+'noshop.png'"></image>
				<text>{{$L('暂无相关店铺')}}</text>
			</view>
		</view>
		<common :title="$L('店铺列表')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
	let img_url = getApp().globalData.img_url; //引用全局变量 图片域名

	export default {
		data() {
			return {
				bid: '',
				vid: '',
				store_list: [],
				searchVal: '',
				//搜索框内的值
				searchList: [],
				show: false,
				searchShow: false,
				pn: '1',
				transparent_mask: false,
				//透明遮罩
				currentTabIndex: 0,
				//选项卡，默认综合排序
				no_content_shop: false,
				//暂无相关店铺
				hasmore: true,
				//有无更多
				tips_show: false,
				//三点分享更多按钮
				tips: [{
					tips_img: img_url + 'site/shouye.png',
					tips_name: this.$L('首页'),
					tips_link: '/pages/index/index'
				}, {
					tips_img: img_url + 'site/leimupinleifenleileibie1.png',
					tips_name: this.$L('分类'),
					tips_link: '/pages/categroy/categroy'
				}, {
					tips_img: img_url + 'site/cart.png',
					tips_name: this.$L('购物车'),
					tips_link: '/pages/cart/cart'
				}, {
					tips_img: img_url + 'site/gerenzhongxin.png',
					tips_name: this.$L('个人中心'),
					tips_link: '/pages/user/user'
				}],
				img_url: getApp().globalData.img_url, //图片地址
				city_site_open: "",
				sc_id: "",
				gids:[]
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('店铺列表')
      });
			let city_site_open = uni.getStorageSync('city_site_open');

			if (city_site_open) {
				let city_site_bind_id = uni.getStorageSync('city_site_bind_id');
				let sc_name = options.sc_name;
				let sc_id = options.sc_id;
				this.setData({
					bid: city_site_bind_id,
					city_site_open: city_site_open,
					searchVal: sc_name,
					sc_id: sc_id
				});

				if (sc_name) {
					this.searchShow = true;
					this.setData({
						searchShow: true
					});
				}
			}

			this.getShopList();
		},

		// 加载更多
		onReachBottom(e) {
			if (this.hasmore) {
				this.getShopList();
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(options) {
			return {
				title: this.$L('分享'),
				path: '/pages/index/index'
			};
		},
		onShareTimeline: function(options) {
			return {
				title: this.$L('分享'),
				path: '/pages/index/index'
			};
		},
		methods: {
			//点击去搜索
			goSearch(e) {
				uni.navigateTo({
					url: '/pages/shopSearch/shopSearch'
				});
			},

			//清空搜索输入框内容
			cancel() {
				this.searchVal = '';
				this.searchShow = false;
				this.setData({
					searchVal: '',
					searchShow: false
				});
				this.getShopList();
			},

			//三点更多分享
			moreTips() {
				let {
					tips_show
				} = this;
				this.setData({
					tips_show: !tips_show,
					transparent_mask: true
				});
			},

			//隐藏透明遮罩层
			hideMask() {
				this.setData({
					transparent_mask: false,
					tips_show: false
				});
			},

			//三点分享链接
			handleLink(e) {
				let link = e.currentTarget.dataset.link;
				uni.switchTab({
					url: link
				});
			},

			// 获取商铺列表
			getShopList() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open;
				let data = {
					page: 10,
					pn: that.pn,
					key: key,
					sort_type: that.currentTabIndex == 1 ? '2' : that.currentTabIndex == 2 ? '3' : that.currentTabIndex == 3 ? '4' : '',
					category_id: that.sc_id || '' //二级店铺分类

				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				if (this.searchVal) {
					data.keyword = this.searchVal;
				}

				;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=store&mod=lists',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.store_list.length == 0) {
								that.setData({
									no_content_shop: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								let gids = [];
								res.data.datas.store_list.forEach(goodlist=>{
									goodlist.search_list_goods.forEach(goodItem=>{
										gids.push(goodItem.gid)
									})
								})
								that.setData({
									gids
								});
								if (that.pn == 1) {
									let store_list = res.data.datas.store_list;
									that.setData({
										store_list
									});
								} else {
									let store_list = res.data.datas.store_list;
									that.setData({
										store_list: that.store_list.concat(store_list)
									});
								}

								if (res.data.hasmore) {
									that.pn++;
									that.setData({
										hasmore: true
									});
								} else {
									that.setData({
										hasmore: false
									});
								}
							}
						}
					},
					error: function(err) {},
					complete: function() {
						uni.hideLoading();
					}
				});
			},

			//选项卡切换
			onTabItemChange(e) {
				this.setData({
					//用当前索引并动态改变
					currentTabIndex: e.target.dataset.index,
					pn: '1'
				});
				this.getShopList();
			},

			// 商铺详情
			vender_detail(e) {
				let vid = e.currentTarget.dataset.vid;
				uni.navigateTo({
					url: '/pages/shopHomePage/shopHomePage?vid=' + vid
				});
			},

			//进入店铺首页
			handleShopHomePage(e) {
				let vid = e.currentTarget.dataset.vid;
				uni.navigateTo({
					url: '/pages/shopHomePage/shopHomePage?vid=' + vid
				});
			},

			// 商品详情
			goods_detail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					uni.navigateTo({
						url: '/pages/goods_detail/goods_detail?gid=' + gid
					});
				}
			},

			// 收藏-取消收藏
			collect(e) {
				let key = uni.getStorageSync('token');

				if (!key) {
					getApp().globalData.goLogin();
					return;
				}

				let that = this;
				let {
					show,
					store_list,
					searchList
				} = this;
				let vid = e.currentTarget.dataset.vid;
				let iscollect = e.currentTarget.dataset.col;

				if (vid) {
					let url = getApp().globalData.ser_url + '/index.php?app=vendorfollow';

					if (iscollect) {
						url += '&mod=fdel';
					} else {
						url += '&mod=fadd';
					}

					uni.request({
						url: url,
						method: 'POST',
						data: {
							vid,
							key
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							if (res.data.datas == '1') {
								let list = show ? searchList : store_list;

								for (let i = 0; i < list.length; i++) {
									let el = list[i];

									if (el.vid == vid) {
										if (iscollect) {
											el.is_fav = 0;
											el.store_collect = parseInt(el.store_collect) - 1;
										} else {
											el.is_fav = 1;
											el.store_collect = parseInt(el.store_collect) + 1;
										}

										if (show) {
											searchList = list;
										} else {
											store_list = list;
										}

										that.setData({
											store_list: store_list,
											searchList: searchList
										});
										break;
									}
								}
							} else {
								uni.showToast({
									title: res.data.datas.error,
									icon: 'none'
								});
							}
						},
						error: function(err) {
						}
					});
				}
			},

			//获取搜索框内的值
			searchInput(e) {
				this.setData({
					searchVal: e.detail.value
				}); // this.getShopList();
			},
			go_back: function(e) {
				uni.navigateBack({})
			},
			//搜索
			search() {
				this.getShopList();
			},

			getmore() {
				let that = this;

				if (!that.flag && that.search_hasmore) {
					that.search();
				}
			},

			back() {
				this.setData({
					searchList: [],
					show: false
				});
				this.searchPn = 1;
				this.search_hasmore = true;
			}

		}
	};
</script>
<style>
	/* pages/shopSearch/shopSearch.wxss */
	page {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		position: relative;
		display: flex;
		justify-content: center;
	}

	/* 透明遮罩层 */
	.transparent_mask {
		width: 100%;
		height: 100%;
		position: fixed;
		background-color: #FFFFFF;
		top: 0;
		left: 0;
		opacity: 0;
		z-index: 0;
	}

	.shop_list {
		width: 750rpx;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #FFFFFF;
	}

	/* 搜索框 */

	.search {
		width: 750rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 35rpx;
		box-sizing: border-box;
		position: fixed;
		/* #ifdef MP-WEIXIN*/
		top: 0;
		/* #endif */
		/* #ifdef H5 || APP-PLUS*/
		top: var(--status-bar-height);
		/* #endif */
		background: #FFFFFF;
		z-index: 50;
	}


	.search_input {
		width: 570rpx;
		height: 65rpx;
		border: 2rpx solid rgba(225, 37, 27, 1);
		border-radius: 33rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.search_input image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.search_input .cancel {
		width: 47rpx;
		height: 47rpx;
	}

	.search input {
		width: 515rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(148, 148, 148, 1);
		line-height: 32rpx;
	}

	.search_text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	/* 三点更多分享 */
	.more_tips {
		position: relative;
	}

	.more {
		width: 50rpx;
		height: 50rpx;
	}

	.triangle-up {
		position: absolute;
		right: 15rpx;
		width: 0;
		height: 0;
		border-left: 15rpx solid transparent;
		border-right: 15rpx solid transparent;
		border-bottom: 20rpx solid #fcfcfc;
		/* transform: rotate(120deg); */
		transform: rotate(0deg);
		box-shadow: -2rpx 2rpx -1rpx 0rpx rgba(102, 102, 102, 0.1);
		z-index: 21;
	}

	.tips {
		position: absolute;
		z-index: 20;
		top: 77rpx;
		right: 0;
		width: 226rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 10rpx 0px rgba(102, 102, 102, 0.2);
		opacity: 0.94;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
	}

	.tips_pre {
		width: 100%;
		height: 88rpx;
		display: flex;
		align-items: center;
		border-bottom: #e6e6e6;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.tips_pre image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 8rpx;
	}

	.tips_pre text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}

	.content {
		/* margin-top: 88rpx; */
	}

	/* 选项卡 */
	.select_nav {
		width: 750rpx;
		height: 98rpx;
		display: flex;
		align-items: center;
		padding: 0 45rpx 0 49rpx;
		box-sizing: border-box;
		justify-content: space-between;
		box-sizing: border-box;
		background: #FFFFFF;
		position: fixed;
		/* #ifdef MP-WEIXIN*/
		top: 84rpx;
		/* #endif */

		/* #ifdef H5 || APP-PLUS*/
		top: calc(var(--status-bar-height) + 84rpx);
		/* #endif */
		z-index: 100;
	}

	.nav_item {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
		/* width: 59rpx; */
		padding: 15rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.active {
		border-bottom: 5rpx solid #FF0000;
		color: #FB1B1B;
		font-weight: 600;
	}

	.shop_lists {
		margin-top: 182rpx;
		width: 100%;
		background: #F5F5F5;
		padding: 20rpx 0;
		box-sizing: border-box;
		height: 100%;
	}

	.shop_pre {
		width: 710rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		margin: 0 auto;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		padding: 0 21rpx;
	}

	.pre_top {
		display: flex;
		width: 100%;
		padding: 20rpx 0;
		/* height: 140rpx; */
		justify-content: space-between;
		align-items: center;
	}

	.shop_left {
		display: flex;
		align-items: center;
	}

	.shop_avatar_img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		background: #F8F8F8;
	}

	.shop_avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.shop_des {
		display: flex;
		flex-direction: column;
	}

	.des_top {
		display: flex;
		flex-wrap: wrap;
	}

	.shop_name {
		max-width: 323rpx;
		font-size: 30rpx;
		margin-bottom: 20rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.shop_type {
		height: 30rpx;
		padding: 0 10rpx;
		margin-bottom: 20rpx;
		background: #FB1B1B;
		border-radius: 15rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 10rpx;
	}

	.des_bottom {
		display: flex;
	}

	.popularity {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #999999;
		line-height: 32rpx;
	}

	.line {
		height: 24rpx;
		color: #999999;
		font-size: 24rpx;
		margin: 0 15rpx;
	}

	.payer_number {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #999999;
		line-height: 32rpx;
	}

	.go_shop {
		width: 100rpx;
		min-height: 50rpx;
		border: 1rpx solid #FF0000;
		border-radius: 25rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #FB1B1B;
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pre_content {
		display: flex;
	}

	.commodity {
		width: 216rpx;
		height: 216rpx;
		position: relative;
		margin-right: 10rpx;
		margin-bottom: 21rpx;
		background: #F5F5F5;
		border-radius: 10rpx;
	}

	.commodity:nth-of-type(3) {
		margin-right: 0;
	}

	.commodity_images {
		width: 216rpx;
		height: 216rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		background: #F8F8F8;
	}

	.commodity_img {
		width: 216rpx;
		height: 216rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.commodity_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 24rpx;
		position: absolute;
		width: 100%;
		bottom: 0;
		z-index: 10;
		text-align: center;
		height: 36rpx;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0 0 10rpx 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.commodity_price text:nth-child(1),
	.commodity_price text:nth-last-child(1) {
		font-size: 20rpx;
	}

	.no_content {
		margin: 295rpx auto 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.no_content image {
		width: 223rpx;
		height: 187rpx;
	}

	.no_content text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		line-height: 32rpx;
		margin-top: 22rpx;
	}

	/* 搜索记录 */
	.search_content {
		width: 100%;
		background: #F5F5F5;
		padding: 39rpx 0;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
	}

	.historical_records {
		width: 100%;
	}

	.records_title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.records_title text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.records_title image {
		width: 31rpx;
		height: 33rpx;
	}

	.record_lists {
		display: inline-table;
		margin-top: 21rpx;
	}

	.record_pre {
		margin-right: 10rpx;
		float: left;
		padding: 12rpx 27rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 25rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		margin-bottom: 20rpx;
	}

	/* 店铺分类 */
	.store_classification {
		width: 100%;
	}

	.classify_title {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.classification_content {
		width: 710rpx;
		/* height:723rpx; */
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		padding: 0 29rpx 0 34rpx;
		box-sizing: border-box;
		margin-top: 33rpx;
	}

	.classification_pre {
		border-bottom: 1rpx solid #fbfbfb;
		padding: 30rpx 0;
	}

	.classify_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.classify_top text {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.classify_top image {
		width: 13rpx;
		height: 22rpx;
	}

	.classify_con {
		display: inline-table;
	}

	.classify_pre {
		padding: 13rpx 27rpx;
		box-sizing: border-box;
		background: rgba(245, 245, 245, 1);
		border-radius: 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		line-height: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 加载更多，没有更多 */
	.is_more {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999999;
		line-height: 22rpx;
		margin: 30rpx 0 10rpx;
	}

	.fixed_top_status_bar {
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

	.top_w_b {
		height: 34rpx;
		width: 34rpx;
		display: block;
	}

	.search {
		/* #ifdef H5||APP-PLUS */
		padding-left: 20rpx
			/* #endif */
	}
</style>
