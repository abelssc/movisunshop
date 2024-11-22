<template>
	<view>
		<view class="nav-container">
			<view :class="'nav-item ' + (s=='all'?'on':'')" data-state='all' @tap="changeNav($event,'all')">
				<text>{{$L('全部')}}</text>
			</view>
			<view :class="'nav-item ' + (s=='1'?'on':'')" data-state="1" @tap="changeNav">
				<text>{{$L('待付款')}}</text>
			</view>
			<view :class="'nav-item ' + (s=='256'?'on':'')" data-state="256" @tap="changeNav">
				<text>{{$L('待发货')}}</text>
			</view>
			<view :class="'nav-item ' + (s=='1024'?'on':'')" data-state="1024" @tap="changeNav">
				<text>{{$L('待收货')}}</text>
			</view>
			<view :class="'nav-item ' + (s=='nocomment'?'on':'')" data-state="nocomment" @tap="changeNav">
				<text>{{$L('待评价')}}</text>
			</view>
		</view>

		<view class="my_order_list">
			<view class="H80">

			</view>
			<scroll-view scroll-y="true" @scroll="scroll" :scroll-top="scroll_height" @scrolltolower="loadMore">
				<view class="order" v-for="(order, order_index) in order_list" :key="order_index" :data-order-id="order.order_list[0].order_id">
					<view class="order-head">
						<view class="order-head__actions">
							<div v-if="(order.order_list[0].order_state != 10 && order.order_list[0].payment_code != 'offline')||(order.order_list[0].payment_code == 'offline' && order.order_list[0].order_state != 10 && order.order_list[0].order_state != 20)" class="bg-yellow">
								<a href="javascript:void(0)" :data-promotion-type="order.order_list[0].promotion_type" :data-promotions-id="order.order_list[0].extend_order_goods[0].promotions_id"
									:data-order-id="order.order_list[0].order_id" :data-order-index="order_index" @tap.stop="again_order">
									<div>{{$L('再来一单')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].order_state==10" class="bg-blue">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									:data-pay-sn="order.pay_sn" :data-price="order.order_list[0].order_amount" @tap.stop="go_pay">
									<div>{{$L('去支付')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].if_delete" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									:data-pay-sn="order.pay_sn" :data-price="order.order_list[0].order_amount" @tap.stop="del_order">
									<div>{{$L('删除订单')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].if_deliver" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="show_wuliu">
									<div>{{$L('物流信息')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].order_state==40&&order.order_list[0].evaluation_state==0" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="pinjia">
									<div>{{$L('评价订单')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].if_cancel" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="cancle_order">
									<div>{{$L('取消订单')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].if_refund_cancel" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="refund">
									<div>{{$L('申请退款')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].if_receive" class="bg-blue">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="confirm_order">
									<div>{{$L('确认收货')}}</div>
								</a>
							</div>

							<div v-if="order.order_list[0].order_state == 30 && order.order_list[0].if_refund_cancel==1" class="bg-white">
								<a href="javascript:void(0)" :data-order-id="order.order_list[0].order_id" :data-order-index="order_index"
									@tap.stop="refund">
									<div>{{$L('申请退货')}}</div>
								</a>
							</div>

							<view v-if="order.order_list[0].if_lock">{{$L('退款/退货中...')}}</view>
						</view>
						<view class="order-head__state" v-if="s=='all'">
							<block v-if="order.order_list[0].pin">
								<navigator :url="'../found/import?u=/pin_detail_xcx.html&id=' + order.order_list[0].pin.sld_team_id">
									<span>{{order.order_list[0].state_desc}}</span>
								</navigator>
							</block>
							<block v-else>
								<span>{{order.order_list[0].state_desc}}</span>
							</block>
						</view>
					</view>
					<view class="order-body" :data-order-id="order.order_list[0].order_id" @tap.stop="go_order_detail">
						<div class="order-body__items">
							<div class="order-body__items-item" v-for="(item, index) in order.order_list[0].extend_order_goods" :key="index">
								<image :src="item.goods_image_url"></image>
								<div>{{item.goods_name}}</div>
							</div>
						</div>
						<div class="order-body__toDetails">
							<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
						</div>
					</view>
				</view>
				<!--
				<view v-for="(item, order_index) in order_list" :key="order_index" class="gray-order-skin" :data-order-id="item.order_list[0].order_id">
					<view class="bbctouch-order-item" :data-order-id="item.order_list[0].order_id" @tap.stop="go_order_detail">
						<view class="bbctouch-order-item-head" :data-vid="item.order_list[0].vid" @tap.stop="go_vendor">
							<view :data-store-id="item.order_list[0].vid" class="store">
								<image class="icon" src="/static/images/store_b.png" mode="widthFix"></image>
								<text>{{item.order_list[0].store_name}}</text>
								<image class="arrow-r" src="/static/images/arrow_right_b.png" mode="widthFix"></image>
							</view>

							<view class="state">
								<block v-if="item.order_list[0].pin">
									<navigator :url="'../found/import?u=/pin_detail_xcx.html&id=' + item.order_list[0].pin.sld_team_id">
										<span class="ot-finish">{{item.order_list[0].state_desc}}</span>
									</navigator>
								</block>
								<block v-else>
									<span class="ot-finish">{{item.order_list[0].state_desc}}</span>
								</block>
							</view>
						</view>
						<div class="bbctouch-order-item-con">
							<div v-for="(item, index) in item.order_list[0].extend_order_goods" :key="index" class="goods-block">
								<a :data-goods-id="item.order_id" href="javascript:void(0)">
									<div class="goods-pic">
										<div class="goods-pic-middle">
											<image :src="item.goods_image_url"></image>
										</div>
									</div>
									<dl class="goods-info">
										<dt class="goods-name">{{item.goods_name}}</dt>
										<dd class="goods-type" v-if="item.goods_type_cn!=''">{{item.goods_type_cn}}</dd>
									</dl>
									<div class="goods-subtotal">
										<span class="goods-price">{{$L('￥')}}
											<em>{{item.goods_price}}</em>
										</span>
										<span class="goods-num">x{{item.goods_num}}</span>
									</div>
								</a>
							</div>


						</div>
						<div class="bbctouch-order-item-footer">
							<div class="store-totle">
								<div class="order_promotion_type">
									<span v-if="item.order_list[0].promotion_type_str">{{item.order_list[0].promotion_type_str}}</span>
									<span v-if="item.order_list[0].store_promotion_type_str">{{item.order_list[0].store_promotion_type_str}}</span>
								</div>
								<span>{{$L('合计')}}</span>
								<span class="sum flex_row_start_start">{{$L('￥')}}
									<em>{{item.order_list[0].order_amount}}</em>
								</span>
								<span class="freight">({{$L('含运费')}}{{$L('￥')}}{{item.order_list[0].shipping_fee}})</span>
							</div>
							<div class="handle">

								<div class="bottom-but" v-if="(item.order_list[0].order_state != 10 && item.order_list[0].payment_code != 'offline')||(item.order_list[0].payment_code == 'offline' && item.order_list[0].order_state != 10 && item.order_list[0].order_state != 20)">
									<a href="javascript:void(0)" :data-promotion-type="item.order_list[0].promotion_type" :data-promotions-id="item.order_list[0].extend_order_goods[0].promotions_id"
										:data-order-id="item.order_list[0].order_id" :data-order-index="order_index" @tap.stop="again_order" class=" sure-order">
										<div>{{$L('再来一单')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].order_state==10">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										:data-pay-sn="item.pay_sn" class="check-payment" :data-price="item.order_list[0].order_amount" @tap.stop="go_pay">
										<div>{{$L('去支付')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].if_delete">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										:data-pay-sn="item.pay_sn" class="check-payment" :data-price="item.order_list[0].order_amount" @tap.stop="del_order">
										<div>{{$L('删除订单')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].if_deliver">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="show_wuliu" class=" quxiao-order ">
										<div>{{$L('物流信息')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].order_state==40&&item.order_list[0].evaluation_state==0">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="pinjia" class=" quxiao-order ">
										<div>{{$L('评价订单')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].if_cancel">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="cancle_order" class="quxiao-order ">
										<div>{{$L('取消订单')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].if_refund_cancel">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="refund" class="quxiao-order ">
										<div>{{$L('申请退款')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].if_receive">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="confirm_order" class="sure-order">
										<div>{{$L('确认收货')}}</div>
									</a>
								</div>

								<div class="bottom-but" v-if="item.order_list[0].order_state == 30 && item.order_list[0].if_refund_cancel==1">
									<a href="javascript:void(0)" :data-order-id="item.order_list[0].order_id" :data-order-index="order_index"
										@tap.stop="refund" class="sure-order">
										<div>{{$L('申请退货')}}</div>
									</a>
								</div>

								<view class="refund_info" v-if="item.order_list[0].if_lock">{{$L('退款/退货中...')}}</view>

							</div>
						</div>
					</view>
				</view>
				-->
			</scroll-view>
			<view class="fix-block-r" @tap.stop="go_top" :hidden="show_go_top">
				<a href="javascript:void(0);" class="gotop-btn gotop" id="goTopBtn">
					<i :style="'background-image: url(' + (img_url+'gotop_b.png') + ');'"></i>
				</a>
			</view>
		</view>
		<view class="no_cart_goods" v-if="!order_list.length && isloading">
			<image :src="img_url+'cart.svg'"></image>
			<text>{{$L('抱歉！该分类暂无订单')}}</text>
		</view>
		<view class="error-tips" :hidden="is_show_tip==1?false:true">
			{{tip_content}}
		</view>

		<common :title="$L('我的订单')"></common>
	</view>
</template>

<script>
	import {
		confirm_order,
		cancle_order,
		del_order
	} from "../../utils/order";
	var is_load = true; //提示事件
	//提示事件
	var errorTipsShow = function(that, err_con) {
		that.setData({
			is_show_tip: 1,
			tip_content: err_con
		});
		setTimeout(function() {
			that.setData({
				is_show_tip: 0
			});
		}, 2000);
	}; //获取所有订单的方法
	

	export default {
		data() {
			return {
				key: '',
				page: 10,
				pn: 1,
				s: 'all',
				hasmore: true,
				show_go_top: true,
				scroll_height: 1,
				order_list: [],
				tip_content: '',
				//错误提示内容
				is_show_tip: 0,
				isloading: false,
				img_url: getApp().globalData.img_url, //图片地址
				scrren_height: "",
				ifOnShow:false,
				tab_type:'' //导航类型
			};
		},

		components: {},
		props: {},
		onHide(){
			this.ifOnShow = true
		},
		onShow(){
			if(this.ifOnShow){
				this.get_order();
			}
		},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('我的订单')
      });
			//获取token  如果没有跳转登录注册页 否则进入个人中心

			var key = uni.getStorageSync('token');

			if (key) {
				//将可以存到data里
				this.setData({
					key: key,
					s: options.s ? options.s : 'all'
				});
			} else {
				getApp().globalData.goLogin();
			} //获取滚动区域的高度


			var new_that = this;
			uni.getSystemInfo({
				success: function(res) {
					var scroll_height = res.windowHeight;
					new_that.setData({
						scrren_height: scroll_height
					});
				}
			}); //获取用户的所有订单

			this.get_order();
		},
		methods: {
			//获取所有订单的方法
			get_order(){
				let that = this;
				uni.showLoading({
					title: that.$L('加载中...')
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_list_state_xcx',
					data: {
						key: that.key,
						s: that.s == 'all' ? '' : that.s,
						page: that.page,
						pn: that.pn
					},
					dataType: 'json',
					success: function(result) {
						var pn = that.pn; //如果是初次加载，直接赋值，否则数据追加
			
						var data = [];
			
						if (pn == 1) {
							data = result.data.datas.order_group_list;
						} else {
							data = that.order_list.concat(result.data.datas.order_group_list);
						}
			
						if (result.data.hasmore) {
							pn = pn + 1;
							is_load = true;
						} else {
							is_load = false;
						} //如果hasmore为true，则
			
			
						that.setData({
							order_list: result.data.order_list,
							pn: pn,
							hasmore: result.data.hasmore,
							order_list: data,
							isloading: true
						});
						uni.hideLoading()
					}
				});
			},
			changeNav(e,type) {
				let news = e.currentTarget.dataset.state;
				let {
					s
				} = this;
				if (news == s) return;
				this.setData({
					s: news,
					pn: 1,
					hasmore: true,
					show_go_top: true,
					scroll_height: 0,
					tab_type:type
				});
				this.get_order();
			},

			//滚动监听的方法
			scroll: function(e) {
				var is_show = true;

				if (e.detail.scrollTop > 200) {
					is_show = false;
				}
				this.setData({
					show_go_top: is_show
				});
			},
			cancle_order: function(e) {
				var that = this;
				var order_index = e.currentTarget.dataset.orderIndex;
				let state = e.currentTarget
				var order_data = that.order_list;
				cancle_order(e, that, function() {
					//无需获取数据，直接更新当前状态即可
					order_data[order_index].order_list[0].state_desc = that.$L('已取消');
					order_data[order_index].order_list[0].order_state = 0;
					order_data[order_index].order_list[0].if_cancel = false;
					if(this.tab_type != 'all'){
						order_data.splice(order_index, 1);
					}
					
					that.setData({
						order_list: order_data
					});
				});
			},
			confirm_order: function(e) {
				var that = this;
				var order_index = e.currentTarget.dataset.orderIndex;
				var order_data = this.order_list;
				confirm_order(e, that, function() {
					if (!that.s) {
						order_data[order_index].order_list[0].state_desc = that.$L('已完成');
						order_data[order_index].order_list[0].order_state = 40;
						order_data[order_index].order_list[0].if_receive = false;
						order_data[order_index].order_list[0].if_delete = true;
						order_data[order_index].order_list[0].evaluation_state = 0;
					} else {
						order_data.splice(order_index, 1);
					}

					that.setData({
						order_list: order_data
					});
				});
			},
			//返回顶部事件
			go_top: function(e) {
				var that = this
				that.scroll_height = -1
				setTimeout(() => {
					that.scroll_height = 0
				}, 100)
				that.$forceUpdate();
			},

			//加载更多事件
			loadMore: function(e) {
				if (is_load) {
					is_load = false;
					this.get_order();
				}
			},
			//查看订单详情事件
			go_order_detail: function(e) {
				var orderid = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '../order_detail/order_detail?order_id=' + orderid
				});
			},
			// 查看物流信息
			show_wuliu: function(e) {
				var orderid = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '../order/wuliu?u=' + orderid
				});
			},

			pinjia(e) {
				var orderid = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '/pages/evaluating/evaluating?id=' + orderid
				});
			},

			//进入店铺事件
			go_vendor: function(e) {
				let vid = e.currentTarget.dataset.vid
				uni.navigateTo({
					url: '/pages/shopHomePage/shopHomePage?vid=' + vid
				});
			},

			//微信支付
			go_pay: function(e) {
				var that = this;
				var order_index = e.currentTarget.dataset.orderIndex;
				var order_id = e.currentTarget.dataset.orderId;
				var order_data = that.order_list;
				var pay_sn = e.currentTarget.dataset.paySn;
				var price = e.currentTarget.dataset.price;

				if (pay_sn) {
					uni.navigateTo({
						url: '/pages/pay/pay?sn=' + pay_sn + '&price=' + price + '&orderid=' + order_id+  '&payFrom=orderList'
					});
				}
			},

			// 再来一单
			again_order(e) {
				let order_id = e.currentTarget.dataset.orderId;
				let promotions_id = e.currentTarget.dataset.promotionsId;
				let promotion_type = e.currentTarget.dataset.promotionType;

				let bl_id = '';

				if (promotion_type == 'bundling') {
					bl_id = '&bl_id=' + promotions_id;
				}

				let key = this.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=buy&mod=buyagain',
					method: 'POST',
					data: {
						order_id: order_id,
						key: key
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.status == 200) {
							var data = JSON.parse(res.data.data)[0];
							uni.navigateTo({
								// url: '/pages/confirm_order/confirm_order?ifcart=1&type=buyagain&gid=' + data.gid +'&buynum='+data.num,
								url: '/pages/confirm_order/confirm_order?ifcart=1&type=buyagain&cart_id=' + res.data.data + bl_id
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			// 退款退货
			refund(e) {
				let order_id = e.currentTarget.dataset.orderId;
				uni.navigateTo({
					url: '/pages/order_detail/order_detail?order_id=' + order_id
				});
			},

			// 删除订单
			del_order(e) {
				let that = this;
				let order_id = e.currentTarget.dataset.orderId;
				del_order(e, that, function() {
					let order_list = that.order_list;
					order_list = order_list.filter(el => el.order_list[0].order_id != order_id);
					that.setData({
						order_list
					});
				});
			}

		}
	};
</script>
<style>
	page {
		background-color: #f0f2f5;
		/* background-color: #fff; */
		width: 750rpx;
		margin: 0 auto;
	}

	em {
		font-style: normal;
	}
	.H80 {
		height: 87rpx;
		width: 100%;
		background-color: white;
	}

	.my_order_list scroll-view {
		/* #ifdef MP-WEIXIN ||APP-PLUS */
		height: calc(100vh - 87rpx);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 168rpx);
		/* #endif */
		
		overflow: hidden;
		/* margin-top: 85rpx; */
	}

	.order_list li {
		margin-top: 18rpx;
		background: #fff;
		display: block;

	}

	.bbctouch-order-item {
		width: 100%;
		background-color: #fff;
		display: block;
	}

	.bbctouch-order-item-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		padding: 0 2.5%;
	}

	.bbctouch-order-item-head .store {
		display: flex;
		float: left;
		align-items: center;
		font-size: 28rpx;
	}

	.bbctouch-order-item-head .store .icon {
		width: 30rpx;
		height: 0;
	}

	.bbctouch-order-item-head .store text {
		margin: 0 8rpx 0 12rpx;
	}

	.bbctouch-order-item-head .store .arrow-r {
		width: 19rpx;
		height: 11rpx;
		opacity: 0.75;
	}

	.bbctouch-order-item-head .state {
		float: right;
		font-size: 28rpx;
		color: #ed5564;
	}

	.ot-finish {
		color: #f15353;
		padding: 10rpx 20rpx;
	}

	.bbctouch-order-item-con {
		padding: 0 2.5%;
		background: #f8f8f8;
		display: block;
	}

	.bbctouch-order-item-con .goods-block:nth-last-child(1) {
		border: none;
	}

	.bbctouch-order-item-con .goods-block {
		position: relative;
		z-index: 1;
		border-bottom: solid #eee 1rpx;
		display: block;
	}

	.bbctouch-order-item-con .goods-block a {
		display: block;
		color: #111;
	}

	.bbctouch-order-item-con .goods-pic {
		display: block;
		width: 130rpx;
		height: 130rpx;
		position: absolute;
		z-index: 1;
		top: 18rpx;
		left: 0;
	}

	.goods-pic .goods-pic-middle {
		width: 130rpx;
		height: 130rpx;
		display: table-cell;
		vertical-align: middle;
	}

	.bbctouch-order-item-con .goods-pic image {
		max-width: 130rpx;
		max-height: 130rpx;
	}

	.bbctouch-order-item-con .goods-info {
		display: block;
		height: 168rpx;
		padding: 18rpx 0;
		margin: 0 184rpx 0 142rpx;
		position: relative;
		z-index: 1;
		overflow: hidden;
	}

	.bbctouch-order-item-con .goods-info .goods-name {
		overflow: hidden;
		height: 70rpx;
		font-size: 26rpx;
		line-height: 35rpx;
		margin-bottom: 0rem;
		color: #333;
		display: -webkit-box !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.bbctouch-order-item-con .goods-info .goods-type {
		overflow: hidden;
		background-color: rgba(236, 55, 55, 1);
		color: #fff;
		font-size: 26rpx;
		padding: 4rpx 10rpx;
		border-radius: 6rpx;
		display: inline-block;
	}

	.bbctouch-order-item-con .goods-subtotal {
		display: block;
		position: absolute;
		z-index: 1;
		top: 50rpx;
		right: 0;
		width: 156rpx;
		text-align: right;
		overflow: hidden;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-price {
		display: block;
		font-size: 26rpx;
		line-height: 42rpx;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-price em {
		font-size: 26rpx;
		font-family: Helvetica;
		display: inline-block;
	}

	.bbctouch-order-item-con .goods-subtotal .goods-num {
		display: block;
		font-size: 26rpx;
		line-height: 42rpx;
		color: #999;
	}

	.bbctouch-order-item-footer .store-totle {
		min-height: 42rpx;
		padding: 23rpx 2.5%;
		font-size: 0;
		text-align: right;
		line-height: 42rpx;
		position: relative;
		display: block;
	}

	.bbctouch-order-item-footer .store-totle span {
		vertical-align: middle;
		display: inline-block;
		font-size: 26rpx;
		line-height: 42rpx;
		color: #252525;
	}

	.bbctouch-order-item-footer .store-totle .sum {
		font-size: 26rpx;
		color: #f15353;
		margin: 0 7rpx;
		line-height: 42rpx;
	}

	.bbctouch-order-item-footer .store-totle .sum em {
		font-size: 30rpx;
		font-family: Helvetica;
		display: inline-block;
	}

	.bbctouch-order-item-footer .store-totle .freight {
		font-size: 21rpx;
		color: #999;
		line-height: 42rpx;
		vertical-align: middle;
		display: inline-block;
	}

	.bbctouch-order-item-footer .handle {
		position: relative;
		z-index: 1;
		text-align: right;
		min-height: 60rpx;
		padding: 0 2.5% 18rpx;
		display: block;
	}

	.bottom-but {
		width: 25%;
		box-sizing: border-box;
		float: right;
	}

	.bottom-but a {
		width: 100%;
		height: 59rpx;
		float: right;
		margin-left: 16rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 14rpx;
	}

	.bottom-but div {
		width: 100%;
		height: 52rpx;
		color: #f23030;
		border: 1rpx solid #f23030;
		border-radius: 12rpx;
		background: #fff;
		font-size: 26rpx;
		line-height: 52rpx;
		text-align: center;
		display: inline-block;
	}

	.bbctouch-order-item-footer {
		display: block;
	}

	.fix-block-r {
		width: 88rpx;
		height: 88rpx;
		position: fixed;
		z-index: 5;
		right: 23rpx;
		bottom: 50rpx;
	}

	.fix-block-r a i {
		width: 100%;
		height: 100%;
		display: block;
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.fix-block-r a {
		display: block;
		width: 88rpx;
		height: 88rpx;
	}

	.gotop {
		right: 0rpx;
		height: 88rpx;
		top: 0rpx;
		width: 100rpx;
		display: inline-block;
		text-align: center;
	}

	.no_cart_goods {
		position: absolute;
		top: 50%;
		margin-top: -190rpx;
		align-items: center;
		left: 50%;
		/* margin-left: -144rpx; */
    transform: translateX(-50%);
	}

	.no_cart_goods image {
		width: 170rpx;
		height: 170rpx;
		display: block;
		text-align: center;
		margin: 0 auto;
	}

	.no_cart_goods text {
		display: block;
		text-align: center;
		color: #666;
		font-size: 32rpx;
		margin-top: 26rpx;
	}

	.error-tips {
		background-color: rgba(0, 0, 0, 0.8);
		padding: 20rpx 0;
		text-align: center;
		border-radius: 8rpx;
		position: fixed;
		z-index: 9999;
		top: 40%;
		left: 25%;
		right: 25%;
		color: #fff;
		font-size: 28rpx;
		line-height: 46rpx;
		box-shadow: 0 0 46rpx rgba(0, 0, 0, 0.15);
	}

	.refund_info {
		float: right;
		font-size: 26rpx;
		color: #f23030;
		padding-right: 20rpx;
		line-height: 56rpx;
	}

	.nav-container {
		position: fixed;
		top: 0;
		/* left: 0; */
		width: 750rpx;
		height: 87rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		z-index: 99;
	}

	/* #ifdef H5 */
	.nav-container {
		top: 84rpx
	}

	/* #endif */

	.nav-container .nav-item {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-item text {
		display: flex;
    align-items: center;
    word-break: break-all;
		color: #333;
		font-size: 25rpx;
    text-align: center;
		height: 100%;
		/* line-height: 86rpx; */
		border-bottom: 2rpx solid transparent;
	}

	.nav-item.on text {
		color: #f23030;
		border-bottom-color: #f23030;
	}

	a,
	a:hover,
	a:active,
	a:visited,
	a:link,
	a:focus {
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-tap-highlight-color: transparent;
		outline: none;
		background: none;
		text-decoration: none;
	}



	.order{
		background-color:#fff;
		margin: 30rpx 30rpx 0 30rpx;
		border-radius: 15rpx;
		overflow:hidden;
	}
	.order-head{
		display: flex;
		justify-content: space-between;
		align-items:center;
		font-size: 24rpx;
		color: #666;
		padding:20rpx;
		border-bottom: 1px solid #eee;
	}
	.order-head__state{

	}
	.order-head__actions{
		display: flex;
		gap: 10px;
		a{
			color: #666;
		}
	}

	.order-body{
		display: flex;
		padding: 20rpx;
		gap: 20rpx;
	}
	.order-body__items{
		flex: 1;
	}
	.order-body__items-item{
		display: flex;
		align-items: center;
		gap: 20rpx;

		image{
			flex: 180rpx 0 0;
			width: 180rpx;
			height: 180rpx
		}
	}
	.order-body__toDetails{
		flex: 0 0 30rpx;
		display: flex;
		justify-content: center;
		align-items:center;

		image{
			width: 30rpx;
			height: 30rpx;
		}
	}
	.bg-white{
		background-color: #fff;
		border-radius: 8px;
		padding: 4px 8px;
		border: 1px solid #eee;
		box-sizing: border-box;
		a{
			color: #666;
		}
	}
	.bg-blue{
		background-color: #6c7fd6;
		border-radius: 8px;
		padding: 4px 8px;
		border: 1px solid #eee;
		box-sizing: border-box;
		a{
			color: #fff;
		}
	}
	.bg-yellow{
		background-color: #ffd800;
		border-radius: 8px;
		padding: 4px 8px;
		border: 1px solid #eee;
		box-sizing: border-box;
		a{
			color: #666;
		}
	}


</style>
