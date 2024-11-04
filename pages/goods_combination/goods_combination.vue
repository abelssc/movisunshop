<template>
	<view>
		<view v-if="gids && gid && base_data && goods_list && suite_goods.length > 0">

			<!-- 导航栏Nav -->
			<scroll-view class="combination_nav" scroll-x="true" v-if="suite_data.length">
				<view v-for="(item, index) in suite_data" :key="index" :class="'combination_nav_pre ' + (currentIndex == index? 'active' : '')"
				 @tap="handleNav" :data-index="index">{{item.name}}</view>
			</scroll-view>

			<view class="list_con">
				<view class="list main_graph">
					<view class="dl">
						<view class="dt">
							<navigator :url="'../goods_detail/goods_detail?gid=' + base_data.gid">
								<image :src="goods_image"></image>
							</navigator>
						</view>
						<view class="goods_des">
							<view class="dd">{{base_data.goods_name}}</view>
							<view class="dd jingle">{{base_data.goods_jingle}}</view>
							<view class="main_graph_price">
								<view class="jer">
									<text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(base_data.show_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(base_data.show_price))[1]}}</text>
								</view>

								<div class="value-box">
									<span class="minus" data-type="minus" @tap.stop="cart_num" data-cart_item="base" :data-value="base_data.buy_num"
									 :data-goods_storge="base_data.goods_storage">-</span>
									<span class="cart_edit_num">
										<input type="number" class="buy-num buynum" disabled :value="base_data.buy_num" :data-goods_storge="base_data.goods_storage"></input>
									</span>
									<span class="add" data-type="add" @tap.stop="cart_num" data-cart_item="base" :data-value="base_data.buy_num"
									 :data-goods_storge="base_data.goods_storage">+</span>
								</div>
							</view>
						</view>
					</view>
				</view>
				<view v-for="(goods_item, i) in suite_goods" :key="i" class="list suite_goods">
					<view class="checked">
						<!-- <checkbox :checked="goods_item.is_selected" :data-cart_item="i" :data-checked="goods_item.is_selected" @tap.stop="sel_checkbox"></checkbox> -->
						<image class="store_select" :src="goods_item.is_selected ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'" :checked="goods_item.is_selected" :data-cart_item="i" :data-checked="goods_item.is_selected"  @tap.stop="sel_checkbox"></image>
					</view>
					<view class="dl">
						<view class="dt suite_dt">
							<navigator :url="'../goods_detail/goods_detail?gid=' + goods_item.gid">
								<image :src="goods_item.goods_image_url"></image>
							</navigator>
						</view>
						<view class="goods_des suite_des">
							<view class="dd">{{goods_item.goods_name}}</view>
							<view class="dd jingle">{{goods_item.goods_jingle}}</view>
							<view class="suite_price">
								<view class="jer">
									<text>{{$L('￥')}}</text><text>{{filters.toSplit(goods_item.goods_price)[0]}}</text>.<text>{{filters.toSplit(goods_item.goods_price)[1]}}</text>
								</view>
								<div class="value-box">
									<span class="minus" data-type="minus" @tap.stop="cart_num" :data-cart_item="i" :data-goods_storge="goods_item.goods_storage"
									 :data-value="goods_item.buy_num">-</span>
									<span class="cart_edit_num">
										<input type="number" class="buy-num buynum" disabled :value="goods_item.buy_num"></input>
									</span>
									<span class="add" data-type="add" @tap.stop="cart_num" :data-cart_item="i" :data-goods_storge="goods_item.goods_storage"
									 :data-value="goods_item.buy_num">+</span>
								</div>
							</view>
						</view>
					</view>
				</view>
				<view class="combined_total">
					<text class="combined_total_title">{{$L('组合金额')}}:</text>
					<view class="combined_total_price">
						<text>{{$L('￥')}}</text>
						<text>{{filters.toSplit(filters.toFix(total_price))[0]}}</text>.
						<text>{{filters.toSplit(filters.toFix(total_price))[1]}}</text>
					</view>
				</view>
				<view class="combined_num" v-if="suite_count > 0">{{$L('组合件数')}}:<text>{{suite_count}}</text></view>

			</view>

			<view class="js_btn">
				<view class="yf">{{$L('合计')}}:
					<text>{{$L('￥')}}</text>
					<text>{{filters.toSplit(filters.toFix(total_price))[0]}}</text>.
					<text>{{filters.toSplit(filters.toFix(total_price))[1]}}</text>
				</view>
				<view @tap="goToPay" class="ljzf">{{$L('立即结算')}}</view>
			</view>

		</view>
		<common :title="$L('推荐组合')"></common>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
	// pages/found/import.js
	const app = getApp();

	export default {
		data() {
			return {
				gids: '',
				gid: 0,
				all_checked: true,
				total_price: 0.00,
				base_data: {},
				goods_list: {},
				suite_data: {},
				suite_data_list: [],
				//组合列表
				suite_data_current: {},
				//当前组合
				suite_goods: [],
				//当前组合的组合列表
				currentIndex: 0,
				//导航栏当前点击的项，默认为 0
				goods_image: '' ,//商品主图
				suite_count:0,   //组合件数
				img_url: getApp().globalData.img_url,
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('推荐组合')
      });
			var gids = options.gids;
			var gid = options.gid;

			if (gids && gid) {
				this.setData({
					'gids': gids,
					'gid': gid
				}); // 获取当前产品组合信息

				// this.get_suite_data(); // 获取 当前商品的 其他产品组合信息

				// this.get_suite_other_data(); //商品详情

				this.get_goods_info();
				this.calc_total_price();
			} else {
				// 缺少参数 跳转首页
				uni.switchTab({
					url: '../index/index'
				});
			}
		},
		methods: {
			//导航栏切换
			handleNav(e) {
				let that = this;
				let currentIndex = e.target.dataset.index;
				that.setData({
					currentIndex
				});
				that.get_goods_info();
			},

			//获取商品详情页信息
			get_goods_info: function() {
				let that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_detail',
					data: {
						gid: that.gid,
						key: uni.getStorageSync('token')
					},
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							//组合列表
							let suite_data_list = res.data.datas.suite_data; //组合列表

							let base_data = res.data.datas.goods_info; //基础信息

							let goods_image = res.data.datas.goods_image.split(',')[0]; //商品主图图片
							
							let suite_data = res.data.datas.suite_data;

							let suite_data_current = {};
							suite_data_list.forEach((item, index) => {
								if (index == that.currentIndex) {
									suite_data_current = item;
								}
							});
							that.setData({
								suite_data_current,
								suite_data_list,
								goods_image,
								suite_data
							});
							base_data.buy_num = 1;
							base_data.is_selected = true;
							let suite_goods = that.suite_data_current.goods;
							let needData = [];
							suite_goods.forEach((item, index) => {
								needData.push(Object.assign({}, item, {
									'buy_num': '1',
									'is_selected': true
								}));
							});
							that.setData({
								suite_goods: needData,
								base_data: base_data,
								suite_data_current: suite_data_current
							});
							that.calc_total_price();
						}
					}
				});
			},
			// 获取当前产品组合信息
			get_suite_data: function() {
				var that = this;
				var gids = that.gids;
				var gid = that.gid;

				if (gids && gid) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getSuiteData',
						data: {
							gids: gids,
							gid: gid
						},
						dataType: 'json',
						success: function(result) {
							var data = result.data.datas;

							if (data.error_flag == false) {
								var base_data = data.base_data;
								base_data.buy_num = 1;
								base_data.is_selected = true;
								var goods_list = data.goods_list;
								goods_list.forEach(function(item, k) {
									item.buy_num = 1;
									item.is_selected = true;
								});
								that.setData({
									'base_data': base_data,
									'goods_list': goods_list
								});
								that.calc_total_price();
							} else {
								// 报错并执行跳转
								uni.showToast({
									title: data.error_msg,
									icon: "none",
									mask: true,
									duration: 2000,
									success: function() {
										uni.switchTab({
											url: '../index/index'
										});
									}
								});
							}
						}
					});
				}
			},
			// 产品组合前往结算页
			suite_item_buy: function(e) {
				var gids = e.currentTarget.dataset.gids;
				uni.navigateTo({
					url: '../goods_combination/goods_combination?gids=' + gids + '&gid=' + this.gid
				});
			},
			// 获取 当前商品的 其他产品组合信息
			get_suite_other_data: function() {
				var that = this;
				var gids = that.gids;
				var gid = that.gid;

				if (gids && gid) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getSuiteOtherData',
						data: {
							gids: gids,
							gid: gid
						},
						dataType: 'json',
						success: function(result) {
							var data = result.data.datas.goods_list;

							if (data) {
								that.setData({
									'suite_data': data
								});
							}
						}
					});
				}
			},
			// 去下单
			goToPay: function() {
				var that = this;
				var gid = that.gid;
				var goods_str = [];
				var base_data = that.base_data;
				goods_str.push(base_data.gid + '|' + base_data.buy_num);
				var suite_goods = that.suite_goods;
				suite_goods.forEach(function(item, k) {
					if (item.is_selected) {
						goods_str.push(item.gid + '|' + item.buy_num);
					}
				});
				var a = goods_str.toString();
				uni.navigateTo({
					url: '../confirm_order/confirm_order?suite=' + gid + '&checked=' + a
				});
			},
			// 全选
			sel_all_checkbox: function(e) {
				var that = this;
				var checked = that.all_checked;
				var change_to_val = checked ? false : true;
				var goods_list = that.goods_list;
				goods_list.forEach(function(item, k) {
					item.is_selected = change_to_val;
				}); // that.setData({
				//   'all_checked': change_to_val,
				// });

				that.setData({
					'goods_list': goods_list
				});
				that.calc_total_price();
			},
			// 商品选择
			sel_checkbox: function(e) {
				var that = this;
				var cart_item = e.currentTarget.dataset.cart_item;
				var checked = e.currentTarget.dataset.checked;
				let is_selected = true;

				if (checked) {
					// 更改为 未选中
					is_selected = false;
				} else {
					// 更改为 未选中
					is_selected = true;
				}

				var suite_goods = that.suite_goods;
				suite_goods[cart_item].is_selected = is_selected; // // 验证是否 全选中 或全取消
				// var all_count_num = goods_list.length;

				that.setData({
					'suite_goods': suite_goods
				});
				that.calc_total_price();
			},
			// 数量增减
			cart_num: function(e) {
				var that = this;
				var cart_type = e.currentTarget.dataset.type;
				var old_buy_num = e.currentTarget.dataset.value;
				var cart_item = e.currentTarget.dataset.cart_item;
				var goods_storge = cart_item == 'base' ? Number(e.currentTarget.dataset.goods_storge) : e.currentTarget.dataset.goods_storge;
				var buy_num = old_buy_num;

				if (cart_item == 'base') {
					//基础商品详情
					let {
						base_data
					} = that;

					switch (cart_type) {
						case 'add':
							if (buy_num < goods_storge) {
								base_data.buy_num = old_buy_num * 1 + 1;
							} else {
								uni.showToast({
									title: that.$L('不能超过最大库存'),
									icon: "none",
									duration: 500
								});
							}

							break;

						case 'minus':
							if (buy_num > 1) {
								base_data.buy_num = old_buy_num * 1 - 1;
							} else {
								uni.showToast({
									title: that.$L('最少购买数量为1'),
									icon: 'none',
									duration: 500
								});
							}

							break;
					}

					that.setData({
						'base_data': base_data
					});
				} else {
					//商品组合列表
					switch (cart_type) {
						case 'add':
							if (buy_num < goods_storge) {
								buy_num = old_buy_num * 1 + 1;
							} else {
								uni.showToast({
									title: that.$L('不能超过最大库存'),
									icon: "none",
									duration: 500
								});
							}

							break;

						case 'minus':
							if (buy_num > 1) {
								buy_num = old_buy_num * 1 - 1;
							} else {
								uni.showToast({
									title: that.$L('最少购买数量为1'),
									icon: 'none',
									duration: 500
								});
							}

							break;
					}

					let {
						suite_goods
					} = that;
					suite_goods[cart_item].buy_num = buy_num;
					that.setData({
						suite_goods
					});
				}

				that.calc_total_price();
			},
			// 计算当前总价格
			calc_total_price: function() {
				var that = this;
				var total_price = parseFloat(0.00);
				var base_data = that.base_data;
				total_price += parseFloat(base_data.show_price) * parseInt(base_data.buy_num);
				var suite_goods = that.suite_goods;
				suite_goods.forEach(function(item, k) {
					if (item.is_selected) {
						total_price += parseFloat(item.show_price) * parseInt(item.buy_num);
					}
				});
				var count = 0;
				suite_goods.map(item=>{
				  if(item.is_selected == true){
					count++;
				  }
				})
				that.setData({
					'total_price': total_price,
					suite_count:count
				});
			}
		}
	};
</script>
<style>
	page {
		padding-bottom: 120rpx;
	}

	/* nav */
	/* nav */
	.combination_nav {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		line-height: 60rpx;
		position: fixed;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 90rpx;
		background: rgba(255, 255, 255, 1);
		z-index: 10;
		text-align: left;
		border-bottom: 20rpx solid #F5F5F5;
	}

	.combination_nav_pre {
		display: inline-block;
		white-space: normal;
		text-align: center;
		margin-right: 60rpx;
		line-height: 90rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 32rpx;
		position: relative;
	}

	.combination_nav_pre:nth-last-of-type(1),
	.combination_nav .active:nth-last-of-type(1) {
		margin-right: 0;
	}

	.combination_nav .active {
		display: inline-block;
		white-space: normal;
		text-align: center;
		margin-right: 60rpx;
		color: rgba(251, 27, 27, 1);
		font-weight: bold;
		line-height: 50rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		z-index: 20;
		border-bottom: 5rpx solid red;
	}

	.list_con {
		padding-top: 90rpx;
		padding-bottom: 20rpx;
	}

	.main_graph {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F2F2F2;
	}

	.title {
		padding: 31rpx 32rpx;
		border: 1px solid #eee;
		border-left: none;
		border-right: none;
	}

	.title span {
		display: inline-block;
		color: #F02C50;
		padding: 0 30rpx 0 12rpx;
	}

	.title em {
		display: inline-block;
		font-size: 20rpx;
		color: #f02c50;
		border: 1px solid #f02c50;
		border-radius: 8rpx;
		padding: 2rpx;
		line-height: 20rpx;
		position: relative;
		bottom: 8rpx;
	}

	.checked {
		transform: scale(0.6, 0.6);
	}

	.list .dl {
		display: flex;
		padding: 0 20rpx;
	}

	.goods_des {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.list .dl .dd {
		width: 448rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 39rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.list .dl .dd:nth-of-type(3) {
		color: #747474;
		font-size: 26rpx;
	}

	.list .dl .jingle {
		font-size: 25rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suite_des .jingle {
		width: 328rpx !important;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.list .dl .dt image {
		width: 240rpx;
		height: 240rpx;
		
		border-radius: 15rpx;
	}

	.list .num {
		position: absolute;
		right: 0;
		top: 0;
		color: #181818;
		font-size: 30rpx;
	}

	.list .jer {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(252, 28, 28, 1);
		line-height: 39rpx;
	}

	.jer text:nth-child(1),
	.jer text:nth-child(3) {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(251, 27, 27, 1);
		line-height: 39rpx;
	}

	.jer text:nth-child(2) {
		font-size: 34rpx;
	}

	.other {
		width: 750rpx;
	}

	.biaoti {
		width: 100%;
		text-align: center;
		line-height: 96rpx;
		height: 96rpx;
		border-bottom: 1px solid #eee;

	}

	.biaoti span {
		display: inline-block;
		width: 67rpx;
		height: 1rpx;
		background: #ccc;
		position: relative;
		bottom: 10rpx;
	}

	.biaoti em {
		margin: 0 22rpx;
	}

	.titlea {
		position: relative;
		border-bottom: 1rpx solid #eee;
		height: 190rpx;
	}

	.goodsBox {
		display: flex;
		height: 130rpx;
		line-height: 130rpx;
		padding-left: 31rpx;
		padding-right: 84rpx;
		padding-top: 30rpx;
		color: #929292;
		width: 464rpx;
	}

	.goodsBox image {
		border: 1rpx solid #eee;
	}

	.zhifu {
		position: absolute;
		right: 21rpx;
		top: 32rpx;
		font-size: 26rpx;
		text-align: right;
	}

	.zhifu p span {
		color: #F41919;
	}

	.zhifu view {
		margin-top: 25rpx;
		color: #F41919;
		border: 1rpx solid #F41919;
		border-radius: 17rpx;
		text-align: center;
		height: 34rpx;
		width: 127rpx;
		margin-left: 15rpx;
	}

	.js_btn {
		width: 100%;
		height: 99rpx;
		position: fixed;
		bottom: 0;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(85, 85, 85, 0.08);
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.yf {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.yf text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(251, 27, 27, 1);
		line-height: 32rpx;
	}

	.yf text:nth-of-type(2) {
		font-size: 34rpx;
	}

	.ljzf {
		margin: 0 20rpx;
		width: 180rpx;
		height: 60rpx;
		background: rgba(252, 28, 28, 1);
		border-radius: 30rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 60rpx;
		text-align: center;
	}

	/* 数量增减 */
	.suite_dt {
		/* width:294rpx;
  height:294rpx;
  border-radius:15rpx; */
		margin-right: 19rpx;
	}

	.suite_dt image {
		width: 240rpx;
		height: 240rpx;
		border-radius: 15rpx;
	}

	.suite_goods {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		align-items: center;
		border-bottom: 1rpx solid #F2F2F2;
	}

	.suite_goods .checked {
		width: 33rpx;
		height: 33rpx;
	}

	.suite_des {
		width: 395rpx;
	}

	.suite_des .dd {
		width: 395rpx !important;
	}

	.suite_price {
		display: flex;
		width: 395rpx;
		justify-content: space-between;
		align-items: center;
	}

	.value-box {
		display: flex;
		align-items: center;
		width: 182rpx;
		height: 50rpx;
		border: 1rpx solid #E9E9E9;
		border-radius: 6rpx;
	}

	.minus {
		width: 50rpx;
		height: 51rpx;
		line-height: 51rpx;
		text-align: center;
		border-right: 1rpx solid #E9E9E9;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(147, 147, 147, 1);
	}

	.cart_edit_num {
		width: 78rpx;
		height: 51rpx;
		text-align: center;
		line-height: 51rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}

	.buy-num {
		height: 51rpx;
	}

	.add {
		border-left: 1rpx solid #E9E9E9;
		width: 50rpx;
		height: 51rpx;
		line-height: 51rpx;
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(147, 147, 147, 1);
	}

	.main_graph {
		width: 100%;
	}

	.main_graph .dl {
		display: flex;
		align-items: center;
	}

	.main_graph .dt {
		width: 240rpx;
		height: 240rpx;
		border-radius: 15rpx;
	}

	.main_graph .dt image {
		width: 240rpx;
		height: 240rpx;
		border-radius: 15rpx;
	}

	.main_graph .goods_des {
		width: 448rpx;
		height: 240rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.main_graph_price {
		width: 449rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.main_graph .goods_des .dd {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 39rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.combined_total {
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 22rpx;
		box-sizing: border-box;
	}

	.combined_total .combined_total_title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.commodity_price {
		display: flex;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(251, 27, 27, 1);
		line-height: 32rpx;
	}

	.commodity_price text:nth-child(2) {
		font-size: 34rpx;
	}

	.combined_num {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		display: flex;
		justify-content: flex-end;
		padding-right: 22rpx;
		box-sizing: border-box;
		margin-top: 23rpx;
	}

	.combined_num text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(251, 27, 27, 1);
		line-height: 32rpx;
	}

	.combined_total_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(251, 27, 27, 1);
		line-height: 32rpx;
	}

	.combined_total_price text:nth-of-type(2) {
		font-size: 34rpx;
	}
	.store_select {
		width: 44rpx;
		height: 44rpx;
	}
</style>
