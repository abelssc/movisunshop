<template>
	<view>
		<!-- #ifdef APP-PLUS  || MP -->
	<!-- 	<view class="status_bar"></view> -->
		<!-- #endif -->
		<!-- <view class="fixed_top_status_bar"></view> -->
		<!-- <view  style='height:60rpx;' v-if="Platform1=='iOS'|| Platform1=='devtools'"  > </view> -->
		<view class="cart_content">
			<view class="transparent_mask" v-if="transparent_mask" @tap="close_mask" catchtouchmove="ture"></view>
			<view id="cart-list-wp" @tap="handleTrans_mask">
				<block v-if="cart_list_show && isDataLoading && (cart_list.cart_num ||  cart_nums)">
					<!-- 平台判断 -->
					<view class="administration">
						<view class="free_ship">
							<image src="/static/images/icon-despacho.svg"></image>
							<text>Envío gratis</text>
						</view>
						<view class="batch_del" @tap="del_goods" data-type="batch">{{$L('删除')}}</view>
					</view>
					<view :class="!batchOpt ? 'cart_list_con' : 'cart_list_con1'">
						<!-- 购物车店铺商品 -->
						<view class="bbctouch-cart-container" v-if="cart_list.cart_list.length">
							<view v-for="(item, idstore) in cart_list.cart_list" :key="idstore" class="store_pre">
								<view class="store_pre_top" :data-store-id="item[0]" style="display:none">
									<!-- 不可选择 -->
									<image :src="img_url + 'site/cart_no_seleted.png'" data-type="store"
										class="store_select" v-if="item[4] == 2 && !batchOpt"></image>
									<!-- 可选择 -->
									<image
										:src="item[3]==1 ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'"
										data-type="store" :data-sele="item[3]" :data-store-index="idstore"
										class="store_select" @tap.stop="sel_checkbox" :data-storeid="item[0]"
										v-if="item[4] != 2 || batchOpt"></image>
									<view class="store_des" :data-store-id="item[0]" @tap.stop="go_vendor">
										<image class="store_des_image" :src="img_url + 'site/cart_store.png'"></image>
										<text class="store_des_text">{{item[1]}}</text>
										<image class="store_des_rightdown" :src="img_url + 'site/cart_right.png'">
										</image>
									</view>
								</view>
								<!-- 店铺中的商品 -->
								<view class="store_cart_list">
									<view v-for="(item1, idgoods) in item[2]" :key="idgoods" class="cart_list_pre"
										:cart_id="item1.cart_id" :gid="item1.gid">
										<!-- 库存充足 -->
										<image class="cart_list_pre_sel"
											:src="item1['is_check']==1 ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'"
											data-type="goods" :data-sele="item1['is_check']" :data-store-index="idstore"
											:data-gid="item1.gid" :data-goods-index="idgoods" @tap.stop="sel_checkbox"
											:data-cartid="item1.cart_id" v-if="item1.storage*1 > 0 || batchOpt"></image>
										<!-- 库存不足 -->
										<image class="cart_list_pre_sel" :src="img_url + 'site/cart_no_seleted.png'"
											v-if="$toNum(item1.storage) <= 0 && !batchOpt"></image>
										<view class="list_pre_img" :data-goods-id="item1.gid"
											:data-cart-id="item1.cart_id" @tap.stop="go_goods_detail"
											@longpress="handleLongTap">
											<image :src="item1.goods_image_url" mode="aspectFit"></image>
										</view>
										<view class="list_pre_des">
											<view
												:class="'list_pre_des_name ' + (item1.storage <= 0 ? 'list_pre_des_name1' : '')"
												:data-goods-id="item1.gid" @tap.stop="go_goods_detail"
												@longpress="handleLongTap">{{item1.goods_name}}</view>
											<!-- 价格的length 小于8 的显示方式 -->
												<view class="list_pre_des_bot"
												v-if="item1.goods_price.length < 8">
											
												<view
													:class="'list_pre_des_price ' + (item1.storage*1 <= 0 ? 'list_pre_des_price1' : '')">
													<text>{{$L('￥')}}</text>
													<text>{{$toSplit(item1.goods_price)[0]}}</text>.
													<text>{{$toSplit(item1.goods_price)[1]}}</text>
												</view>
												<view class="list_pre_des_num"
													v-if="item1.storage*1 > 0 && isPriceOptShow && !batchOpt">
													<text :data-cart-id="item1.cart_id||item1.gid"
														:data-store-index="idstore" :data-s2="item1.goods_storage"
														:data-storage="item1.storage" :data-goods-index="idgoods"
														data-type="minus" :data-gid="item1.gid" @tap.stop="cart_num"
														:data-value="item1.goods_num">-</text>
													<input type="number" :data-cart-id="item1.cart_id||item1.gid"
														:data-s2="item1.goods_storage" :data-storage="item1.storage"
														@blur="cart_num" :data-store-index="idstore"
														:data-gid="item1.gid" data-type="in" :data-goods-index="idgoods"
														v-model="item1.goods_num"></input>
													<text :data-cart-id="item1.cart_id||item1.gid" :data-gid="item1.gid"
														:data-s2="item1.goods_storage" :data-storage="item1.storage"
														:data-store-index="idstore" :data-goods-index="idgoods"
														data-type="add" @tap.stop="cart_num"
														:data-value="item1.goods_num">+</text>
												</view>
												<view v-if="item1.storage*1 <= 0" class="insufficient_stock1">{{$L('库存不足')}}
												</view>
											</view>
											<!-- 价格的length 大于等于8 的显示方式 -->
												<view class="list_pre_des_bot"	v-if="item1.goods_price.length >= 8">

											<!-- <view class="list_pre_des_bot"> -->

												<view
													:class="'list_pre_des_price ' + (item1.storage*1 <= 0 ? 'list_pre_des_price1' : '')"
													v-if="!item1.price_overrun">
													<text>{{$L('￥')}}</text>
													<text>{{$toSplit(item1.goods_price)[0]}}</text>.
													<text>{{$toSplit(item1.goods_price)[1]}}</text>
												</view>
												<view
													:class="'list_pre_des_price ' + (item1.storage*1 <= 0 ? 'list_pre_des_price1' : '')"
													v-else>
													<text>{{$L('￥')}}</text>
													<text>{{filters.toSubstring(($toSplit(item1.goods_price)[0]),0,3)}}</text>...
												</view>
												<view class="list_pre_des_num"
													v-if="item1.storage*1 > 0 && item1.price_overrun && !batchOpt">
													<text :data-cart-id="item1.cart_id||item1.gid"
														:data-store-index="idstore" :data-s2="item1.goods_storage"
														:data-storage="item1.storage" :data-goods-index="idgoods"
														data-type="minus" :data-gid="item.gid" @tap.stop="cart_num"
														:data-value="item1.goods_num">-</text>
													<input type="number" :data-cart-id="item1.cart_id||item1.gid"
														:data-s2="item1.goods_storage" :data-storage="item1.storage"
														@blur="cart_num" :data-gid="item.gid"
														:data-store-index="idstore" data-type="in"
														:data-goods-index="idgoods" v-model="item1.goods_num"></input>
													<text :data-cart-id="item1.cart_id||item1.gid"
														:data-s2="item1.goods_storage" :data-storage="item1.storage"
														:data-store-index="idstore" :data-goods-index="idgoods"
														data-type="add" :data-gid="item1.gid" @tap.stop="cart_num"
														:data-value="item1.goods_num">+</text>
												</view>
												<view class="cart_list_close1" v-if="item1.price_overrun && !batchOpt">
													<image :src="img_url + 'site/cart_list_close.png'"
														class="cart_list_close" @click="cartListClose"
														:data-cart-id="item1.cart_id"></image>
												</view>
												<view class="list_pre_num"
													v-if="item1.storage > 0 && !item1.price_overrun && !batchOpt"
													:data-cart-id="item1.cart_id" @click="priceOverrun">
													X{{item1.goods_num}}</view>
												<view v-if="item1.storage <= 0" class="insufficient_stock">{{$L('库存不足')}}</view>
											</view>
										</view>
										<!-- 单个商品操作 -->
										<view class="cart_list_pre_opt" v-if="item1.isOpen == true" @tap="hideOpt"
											:data-cart-id="item1.cart_id">
											<view class="move_favorites" v-if="key" @tap="batchCollection"
												:data-gid="item1.gid" :data-cartid="item1.cart_id" data-type="single">
												<text>{{$L('移至')}}</text>
												<text>{{$L('收藏夹')}}</text>
											</view>
											<view class="delete_goods" :data-cart-id="item1.cart_id"
												:data-gid="item1.gid" data-type="single" @tap.stop="del_goods"
												:data-storeid="item[0]">{{$L('删除')}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 失效商品 -->
						<view class="invalid_goods" v-if="cart_list.lose_cart_list.length">
							<view class="invalid_goods_top">
								<text>{{$L('失效商品')}}{{cart_list.lose_cart_list.length}}{{$L('件')}}</text>
								<text data-type="invalid" @tap.stop="del_goods">{{$L('清空失效商品')}}</text>
							</view>
							<view class="invalid_goods_list">
								<view v-for="(item, index) in cart_list.lose_cart_list" :key="index"
									class="invalid_goods_pre">
									<view class="invalid_tips"><text>{{$L('失')}}</text><text>{{$L('效')}}</text></view>
									<view class="invalid_des">
										<view class="invalid_des_img">
											<image :src="item.goods_image_url" mode="aspectFit"></image>
										</view>
										<view class="invalid_des_con">
											<view class="invalid_goods_name">{{item.goods_name}}</view>
											<view class="invalid_goods_buy">{{$L('商品已失效，无法购买')}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<!-- 购物车无数据-->
				<view class="no_cart_goods" v-if="!cart_list_show">
					<view class="empty">
						<image :src="img_url+'active4_m.png'"></image>
						<text class="cart-em">{{$L('购物车空空如也~')}}</text>
						<text>{{$L('去挑选中意的商品吧')}}</text>
					</view>
				</view>



				<!-- 推荐商品 -->
				<view class="pick_goods" v-if="tuijian_goods.length > 0 && isDataLoading && !batchOpt">
					<view class="pick_goods_top">
						<text>Productos Recomendados</text>
					</view>
					<view class="pick_list">
						<view v-for="(item, index) in tuijian_goods" :key="index" class="pick_list_pre">
							<image class="pick_list_pre_img" mode="aspectFit" :src="item.goods_img_url"
								:data-goods-id="item.gid" @tap.stop="go_goods_detail"></image>
							<view class="pick_list_pre_des">
								<view class="pick_list_pre_name" :data-goods-id="item.gid" @tap.stop="go_goods_detail">
									{{item.goods_name}}
								</view>
								<view class="pick_lsit_pre_bottom">
									<view class="pick_list_pre_price">
										<text>{{$L('￥')}}</text>
										<text>{{$toSplit(item.goods_price)[0]}}</text>.
										<text>{{$toSplit(item.goods_price)[1]}}</text>
									</view>
									<image class="add_cart_list" :src="img_url + 'site/add_cart_list.png'"
										@tap="add_cartList" :data-item="item" :data-gid="item.gid"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 合计结算 -->
				<view class="total_settlement" v-if="cart_list && cart_list.cart_list.length && !batchOpt">
					<view class="total_settlement_left">
						<image
							:src="cart_list.is_check==1 ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'"
							data-type="all" :data-sele="cart_list.is_check" @tap.stop="sel_checkbox"></image>
						<view class="total_settlement_price">
							<view class="total_settlement_price1">{{$L('合计')}}:<text>{{$L('￥')}}{{cart_list.sum ? cart_list.sum : 0}}</text>
							</view>
						</view>
					</view>
					<view class="total_settlement_right">
						<view class="total_settlement_text grey" v-if="cart_list.checked_num == 0">
							{{$L('结算')}}({{cart_list.checked_num}})</view>
						<view class="total_settlement_text" @tap.stop="go_confirm_order" v-else>
							{{$L('结算')}}({{cart_list.checked_num}})</view>
					</view>
				</view>
				<!-- 批量移至收藏夹，批量删除 -->
				<view class="total_settlement" v-if="cart_list && cart_list.cart_list.length && batchOpt">
					<view class="total_settlement_left">
						<image
							:src="cart_list.is_check==1 ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'"
							data-type="all" :data-sele="cart_list.is_check" @tap.stop="sel_checkbox"></image>
						<text>{{$L('全选')}}</text>
					</view>
					<view class="total_settlement_right">
						<view class="batch_move" @tap="batchCollection" v-if="key" data-type="batch">{{$L('移至收藏夹')}}</view>
						<view class="batch_del" @tap="del_goods" data-type="batch">{{$L('删除')}}</view>
					</view>
				</view>

				<!-- 库存不足的弹框 -->
				<view class="insufficient_stock" v-if="insufficient_stock">
					<view class="insufficient_stock_top">
						<view class="insufficient_stock_title">{{$L('商品库存不足')}}</view>
						<image class="insufficient_stock_close" @tap="close_mask"
							:src="img_url + 'site/insufficient_stock_close.png'"></image>
					</view>
					<scroll-view class="insufficient_stock_con" scroll-y>
						<view v-for="(item, index) in insufficient_stock_arr" :key="index"
							class="insufficient_stock_pre">
							<text class="insufficient_stock_name">{{item.goods_name}}</text>
							<text class="insufficient_stock_num">[{{$L('剩余库存')}}{{item.goods_storage}}{{$L('件')}}]</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<view class="error-tips" :hidden="is_show_tip==1?false:true">
			{{tip_content}}
		</view>

		<common :title="$L('购物车')" :gids="tuijian_gids" v-if="tuijian_gids.length"></common>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
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
	}; //获取购物车数据
	//获取购物车数据
	var get_cart_list = function(that, isfirst) {
		let key = uni.getStorageSync('token');
		let uuid = uni.getStorageSync('uuid');

		if (!key) {
			//未登录
			uni.request({
				url: getApp().globalData.ser_url + '/index.php?app=cache_cart&mod=cart_list',
				data: {
					key: uuid,
					cart_type: !that.batchOpt ? 'buy' : 'manage'
				},
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function(res) {
					if (res.data.code == 200) {
						that.setData({
							cart_list: res.data.datas,
							batchOpt: that.batchOpt ? true : false,
							//页面刚进入时，不显示批量操作
							isPriceOptShow: !that.batchOpt ? true : false
						});
						let list = res.data.datas;
						for(let i=0;i<list.cart_list.length;i++){
							let one=list.cart_list[i][2];
							for(let j=0;j<one.length;j++){
								if( one[j].storage*1 < one[j].goods_num*1 ){
									one[j].goods_num = one[j].storage;
									no_login_goods_num(uuid,one[j].cart_id,one[j].goods_num);
								}
							}
							list.cart_list[i][2]=one;
						}
						
						list.cart_list.map((item, index) => {
							item[2].map((item1, index1) => {
								that.$set(item1, 'isOpen', false)
							});
						});
						
						setTimeout(() => {
							that.cart_list = list
						}, 0)
						
						let cart_list_data = res.data.datas;

						if (cart_list_data && (cart_list_data.cart_list.length > 0 || cart_list_data
								.lose_cart_list.length > 0)) {
							if (that.batchOpt) {
								that.setData({
									cart_nums: cart_list_data.cart_num
								});
							}

							that.setData({
								cart_list_show: true
							});
						} else {
							that.setData({
								cart_list_show: false,
								batchOpt: false
							});
						}
					}
				},

				complete() { // wx.hideLoading();
				}

			});
		} else {
			//已登录
			uni.request({
				url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_list_store_new',
				data: {
					key: uni.getStorageSync('token'),
					cart_type: !that.batchOpt ? 'buy' : 'manage'
				},
				method: 'POST',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function(res) {
					if (res.data.code == 200) {
						if (res.data.datas.cart_list.length == 0) {
							that.setData({
								batchOpt: false
							});
						}
						let list = res.data.datas
						for(let i=0;i<list.cart_list.length;i++){
							let one=list.cart_list[i][2];
							for(let j=0;j<one.length;j++){
								if( one[j].storage*1 < one[j].goods_num*1 ){
									one[j].goods_num = one[j].storage;
									login_in_goods_num(uni.getStorageSync('token'),one[j].cart_id,one[j].goods_num);
								}
							}
							list.cart_list[i][2]=one;
						}
						that.setData({
							cart_list: list,
							batchOpt: that.batchOpt ? true : false,
							//页面刚进入时，不显示批量操作
							isPriceOptShow: !that.batchOpt ? true : false
						});
						list.cart_list.map((item, index) => {
							item[2].map((item1, index1) => {
								that.$set(item1, 'isOpen', false)
							});
						});
						setTimeout(() => {
							that.cart_list = list
						}, 0)
						let cart_list_data = list;

						if (cart_list_data && (cart_list_data.cart_list.length > 0 || cart_list_data
								.lose_cart_list.length > 0)) {
							if (that.batchOpt) {
								that.setData({
									cart_nums: cart_list_data.cart_num
								});
							}

							that.setData({
								cart_list_show: true
							});
						} else {
							that.setData({
								cart_list_show: false
							});
						}
						cal_total_price(that);
					}
				},

				complete() { // wx.hideLoading();
				}

			});
		}
	}; 
	
	//登录之后   购物车商品数量变更
	var login_in_goods_num = function(key,cart_id,tar_num) {
		uni.request({
			url: getApp().globalData.ser_url +
				'/index.php?app=cart&mod=cart_edit_quantity_xcx',
			data: {
				key: key,
				cart_id: cart_id,
				quantity: tar_num
			},
			header: {
				'content-type': 'application/json' // 默认值
							
			},
			success: function(res) {
				if (res.data.state == 200) {
				} else {
					errorTipsShow(cart_data, res.data.error);
				}
			}
		});
	}
	// 离线状态   购物车商品数量变更
	var no_login_goods_num = function(uuid,gid,tar_num){
		uni.request({
			url: getApp().globalData.ser_url +
				'/index.php?app=cache_cart&mod=cart_edit_quantity',
			data: {
				key: uuid,
				gid: gid,
				quantity: tar_num
			},
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
				if (res.data.code == 200) {
					
				} else {
					errorTipsShow(cart_data, res.data.error);
				}
			}
		});
		
	}
	
	
	//计算总价事件
	var cal_total_price = function(that) {
		var data = that.cart_list;
		var num = 0;
		var sel_num = 0;
		var cartIds = [];
		var gids = [];
		if (data.cart_list.length > 0) {
			for (var i = 0; i < data.cart_list.length; i++) {
				if (data.cart_list[i][2].length > 0) {
					for (var j = 0; j < data.cart_list[i][2].length; j++) {
						if (data.cart_list[i][2][j]['is_check'] > 0) {
							num = num + data.cart_list[i][2][j]['goods_price'] * data.cart_list[i][2][j]['goods_num'];
							sel_num += 1;
							cartIds.push(data.cart_list[i][2][j]['cart_id']);
							gids.push(data.cart_list[i][2][j]['gid']);
						}
					}
				}
			}
		}

		data.sum = parseFloat(num).toFixed(2);
		that.setData({
			cart_list: data,
			sel_num: sel_num,
			cartIds: cartIds,
			gids: gids
		}); //如果店铺下的商品库存不足，该商品就不能再勾选了

		that.cart_list && that.cart_list.cart_list && that.cart_list.cart_list.map((item, index) => {
			item[2].map((item1, index1) => {
				if (item1.storage <= 0) {
					item1.is_sele = 0;
				}
			});
		});
		that.setData({
			cart_list: that.cart_list
		});
		var length = 0;
		that.cart_list.cart_list.map(item => {
			length += item[2].length;
		});
		that.setData({
			settlement_button: !that.sel_num ? true : false,
			//如果结算的数量为0，则，结算按钮置灰
			all_goods_num: length //购物车列表中的总商品数量

		});
	};
	
	import common from "../../component/common/common";
	import { UpdateCart } from "@/utils/common.js";
	export default {
		data() {
			return {
				tip_content: '',
				//错误提示内容
				is_show_tip: 0,
				indicatorDots: false,
				autoplay: true,
				interval: 5000,
				duration: 1000,
				Platform1: '',
				//平台判断
				key: '',
				tuijian_goods: {},
				cart_list: '',
				isloading: true,
				img_url: getApp().globalData.img_url,
				//图片地址
				sel_num: 0,
				//结算，选中的商品总数
				batchOpt: false,
				//批量管理操作
				cartIds: [],
				//批量删除操作的数组
				gids: [],
				//批量移入收藏夹数组
				price_overrun: false,
				//价格是否超过8位
				transparent_mask: false,
				//透明蒙层
				settlement_button: false,
				//结算按钮是否置灰
				all_goods_num: 0,
				//购物车列表总数
				uuid: '',
				//未登录，前端自动生成用户唯一标识uuid
				isDataLoading: false,
				//购物车数据是否加载完毕
				isPriceOptShow: true,
				//商品加减的是否显示
				insufficient_stock: false,
				//点击结算库存不足的弹框
				insufficient_stock_arr: [],
				//点击结算，库存不足显示的弹框数据
				cart_list_show: true,
				//购物车列表无数据是否显示,
				cart_nums: 0 //管理状态下共几件商品
					,
				s: "",
				stat_end: 1, //终端，默认为1，pc端
				tuijian_gids: []
			};
		},

		components: {
			common
		},
		props: {},
		onLoad: function(options) {
      uni.setTabBarItem({
      	index: 0,
      	text: this.$L('首页')
      })
      uni.setTabBarItem({
      	index: 1,
      	text: this.$L('分类')
      })
      uni.setTabBarItem({
      	index: 2,
      	text:this.$L('发现')
      })
      uni.setTabBarItem({
      	index: 3,
      	text: this.$L('购物车')
      })
      uni.setTabBarItem({
      	index: 4,
      	text: this.$L('我的')
      })
      uni.setNavigationBarTitle({
          title: this.$L('购物车')
      });
			// 	生命周期函数--监听页面加载
			//获取token  如果没有跳转登录注册页 否则进入个人中心
			if (options.s) {
				this.setData({
					s: options.s
				});
			} // 获取用户唯一标识UUID(规则：客户端类型+下划线+36位唯一字符串uuid)
			//获取平台


			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					this.Platform1 = "android"
					break;
				case 'ios':
					this.Platform1 = "iOS"
					break;
				default:
					this.Platform1 = "devtools"
					break;
			}

			let key = uni.getStorageSync('token');
			let uuid = uni.getStorageSync('uuid');

			if (key) {
				this.setData({
					key: 'key'
				});
			} else if (!uuid) {
				let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app

				uni.setStorageSync('uuid', uuid);
			} else {
				let uuid = uni.getStorageSync('uuid');
				this.setData({
					uuid
				});
			} //获取购物车数据


			get_cart_list(this); // 获取推荐商品数据

			this.get_tuijian_goods(); //回到页面顶部

			this.goTop();
			this.setData({
				batchOpt: false //页面刚进入，都在结算页面下

			});
			this.getPlatform();

		},

		onShow() {
			var key = uni.getStorageSync('token');
			let uuid = uni.getStorageSync('uuid');

			if (key) {
				//将可以存到data里
				this.setData({
					key: key
				});
			} else if (uuid) {
				this.setData({
					uuid
				});
			} else {
				let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app

				uni.setStorageSync('uuid', uuid);
			}

			get_cart_list(this);
			this.get_tuijian_goods(); //回到页面顶部

			this.goTop();
			this.setData({
				batchOpt: false,
				//页面刚进入，都在结算页面下
				isPriceOptShow: true //数量编辑操作是否存在

			});
			this.getPlatform();
		},

		onHide() {
			this.setData({
				cart_list: '',
				isloading: true
			});
		},

		methods: {
			//获取当前终端的方法
			getPlatform() {
				//判断终端
				this.stat_end = 1;
				// #ifdef H5
				this.stat_end = 2;
				// #endif
				// #ifdef MP-WEIXIN
				this.stat_end = 3;
				// #endif
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == 'android') {
					this.stat_end = 5;
				} else if (uni.getSystemInfoSync().platform == 'ios') {
					this.stat_end = 4;
				}
				// #endif
			},
			onPageScroll(e) {
				this.cart_list && this.cart_list.cart_list && this.cart_list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						item1.isOpen = false;
					});
					this.setData({
						cart_list: this.cart_list
					});
				});
			},

			DataInit(data, num) {
				let cart_list = this.cart_list;
				let store = data.store_info;
				let goods_info = data.goods_info;
				goods_info.goods_num = num;
				goods_info.is_sele = 1;
				goods_info.goods_image_url = data.goods_image.split(',')[0];

				if (!cart_list) {
					cart_list = {
						cart_list: [
							[store.vid, store.store_name, [goods_info], 1]
						],
						sum: (parseFloat(goods_info.goods_price) * num).toFixed(2),
						total_sel: 1
					};
				} else {
					let vid = store.vid;
					let hasvid = false;

					for (var i = 0; i < cart_list.cart_list.length; i++) {
						let el = cart_list.cart_list[i];

						if (el[0] == vid) {
							el[2].push(goods_info);
							hasvid = true;
							break;
						}
					}

					if (!hasvid) {
						cart_list.cart_list.push([store.vid, store.store_name, [goods_info], 1]);
					}

					let sum = 0;
					cart_list.cart_list.map(el => {
						el[2].map(el2 => {
							sum = (parseFloat(sum) + parseFloat(el2.goods_price) * parseInt(el2.goods_num))
								.toFixed(2);
						});
					});
					cart_list.sum = sum;
				}

				this.setData({
					cart_list
				});
			},

			//商品删除
			del_goods: function(e) {
				var del_data = this;
				let DelData = del_data.cart_list.cart_list;
				let key = uni.getStorageSync('token');
				let uuid = uni.getStorageSync('uuid');
				let gid = !key ? e.currentTarget.dataset.gid : e.currentTarget.dataset.cartId;
				let storeid = e.currentTarget.storeid; //店铺id

				let source_type = e.currentTarget.dataset.type; //商品删除的来源： 单个： single   批量： batch   失效：invalid
				//批量选中状态的gid

				var DelGids = [];
				DelData.map(item => {
					let del_data_goods = item[2].filter(item1 => item1.is_check == 1);

					if (del_data_goods.length > 0) {
						if (!key) {
							del_data_goods.map(item2 => {
								DelGids.push(item2.gid);
							});
						} else {
							del_data_goods.map(item2 => {
								DelGids.push(item2.cart_id);
							});
						}
					}
				}); //失效商品一键清空 的 登录：cart_id 未登录：gid

				var invalidGids = [];
				let invalid_data = del_data.cart_list.lose_cart_list;
				invalid_data.map(item => {
					if (key) {
						invalidGids.push(item.cart_id);
					} else {
						invalidGids.push(item.gid);
					}
				});

				if (source_type == 'batch' && DelGids.toString() == '') {
					//无选中商品
					uni.showToast({
						title: del_data.$L('请先选中商品'),
						icon: 'none',
						duration: 500
					});
				} else {
					var params = {};

					if (!key) {
						params = {
							key: uuid,
							gid: source_type == 'single' ? gid : source_type == 'batch' ? DelGids.toString() :
								source_type == 'invalid' ?
								invalidGids.toString() : ''
						};
					} else {
						params = {
							key,
							cart_id: source_type == 'single' ? gid : source_type == 'batch' ? DelGids.toString() :
								source_type ==
								'invalid' ? invalidGids.toString() : ''
						};
					}

					var url = !key ? '/index.php?app=cache_cart&mod=cart_del' : '/index.php?app=cart&mod=cart_del_new';
					uni.request({
						url: getApp().globalData.ser_url + url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: params,
						success: function(res) {
							if (res.data.code == 200) {
								uni.showToast({
									title: del_data.$L('删除成功'),
									icon: 'none',
									duration: 500
								});
								UpdateCart()
								if (!del_data.batchOpt) {
									//重新获取数据
									get_cart_list(del_data);
								} else {
									del_data.del_opt(del_data, source_type, DelData, gid, DelGids);
								}
							} else {
								uni.showModal({
									title: '',
									content: res.data.error,
									showCancel: false,
									confirmColor: '#333',
									confirmText:this.$L('确定'),
								});
							}
						}
					});
				}
			},

			//管理模式下，单个删除，和批量删除  this,  类型来源，购物车列表数据 ，商品的gid或者cart_id,    批量操作选中的商品的gid和cart_id的数组
			del_opt(del_data, source_type, DelData, gid, DelGids) {
				let key = uni.getStorageSync('token');

				if (source_type == 'single') {
					//单个商品删除
					DelData.map((item, index) => {
						if (!key) {
							item[2].map((item1, index1) => {
								if (item1.gid == gid) {
									item[2].splice(index1, 1);
								}
							});

							if (item[2].length == 0) {
								//如果该店铺没有商品，就删除该店铺
								DelData.splice(index, 1);
							}
						} else {
							item[2].map((item1, index1) => {
								if (item1.cart_id == gid) {
									item[2].splice(index1, 1);
								}
							});

							if (item[2].length == 0) {
								//如果该店铺没有商品，就删除该店铺
								DelData.splice(index, 1);
							}
						}
					});
				} else if (source_type == 'batch') {
					//批量删除
					DelData.forEach(item => {
						DelGids.forEach(item3 => {
							item[2].forEach((item2, index2) => {
								if (!key && item2.gid == item3) {
									item[2].splice(index2, 1);
								} else if (key && item2.cart_id == item3) {
									item[2].splice(index2, 1);
								}
							});
						});
					});
					DelData = DelData.filter(item => {
						return item[2].length > 0;
					});
				} else if (source_type == 'invalid') {
					//清空失效商品
					//失效商品一键清空 
					let invalid_data = del_data.cart_list.lose_cart_list;
					invalid_data = [];
					del_data.cart_list.lose_cart_list = invalid_data; //失效商品赋值
				} //计算总数量


				let cart_nums = 0;
				let lose_list_length = 0;
				lose_list_length = del_data.cart_list.lose_cart_list.length; //失效商品的总数量

				cart_nums = DelData.map(item => {
					if (item.length > 0) {
						return cart_nums + item[2].length;
					}
				});

				if (lose_list_length > 0) {
					//如果有失效商品
					cart_nums = cart_nums.length + lose_list_length;
				} else {
					cart_nums = cart_nums.length;
				}

				del_data.setData({
					cart_nums: cart_nums
				}); //购物车中无商品以及无失效商品，就变为结算状态

				if (!DelData || DelData.length == 0 && lose_list_length == 0) {
					del_data.setData({
						cart_list_show: !true,
						batchOpt: false
					});
				}

				if (!DelData || DelData.length == 0 && lose_list_length > 0) {
					del_data.setData({
						cart_list_show: true,
						batchOpt: true
					});
					get_cart_list(del_data);
				}

				del_data.cart_list.cart_list = DelData; //购物车列表数据赋值

				del_data.setData({
					cart_list: del_data.cart_list
				});
			},

			//全选按钮 店铺 商品的复选框事件
			sel_checkbox: function(e) {
				let key = uni.getStorageSync('token');
				this.setData({
					key: key
				});
				let uuid = uni.getStorageSync('uuid'); //未登录需要传递uuid，用户的唯一标识

				let that = this;
				let optData = that.cart_list.cart_list;
				let is_check = e.currentTarget.dataset.sele; //是否选中

				let datatype = e.currentTarget.dataset.type; //复选框的来源，商品，店铺，全选  管理 完成

				if (datatype == "goods") {
					//单个商品
					if (!that.batchOpt) {
						var gid = !key ? e.currentTarget.dataset.gid : e.currentTarget.dataset
							.cartid; //单个商品的gid(未登录)   单个商品的cart_id（已登录)
					} else {
						var gid = !key ? e.currentTarget.dataset.gid : e.currentTarget.dataset
							.cartid; //单个商品的gid(未登录)   单个商品的cart_id（已登录)

						optData.map(item => {
							let selGid = item[2].filter(item1 => item1.gid == e.currentTarget.dataset.gid);

							if (selGid.length > 0) {
								selGid[0].is_check = selGid[0].is_check == 1 ? 0 : 1;
							}

							let sel_store = item[2].every(item1 => item1.is_check ==
								1); //如果该店铺下所有商品为选中，该店铺为选中状态

							item[3] = sel_store ? 1 : 0;
						}); //如果所有店铺为选中状态,则全选为选中状态

						let noSel = optData.every(item1 => item1[3] == 1);
						that.cart_list.is_check = noSel ? 1 : 0;
						that.cart_list.cart_list = optData;
						that.setData({
							cart_list: that.cart_list
						});
					}
				} else if (datatype == "store") {
					//选中店铺
					if (!that.batchOpt) {
						let storeid = e.currentTarget.dataset.storeid; //当前店铺id

						let cur_store_data = optData.filter(item => item[0] == storeid);

						if (cur_store_data.length > 0) {
							let cur_store_goods = cur_store_data[0][2];
							var gids = [];
							cur_store_goods.map((item, index) => {
								if (!key) {
									//未登录，传店铺商品的gid
									gids.push(item.gid);
								} else {
									//已登录，传店铺商品的cart_id
									gids.push(item.cart_id);
								}
							});
						}
					} else {
						let storeid = e.currentTarget.dataset.storeid; //当前店铺id

						let cur_store_data = optData.filter(item => item[0] == storeid);

						if (cur_store_data.length > 0) {
							let cur_store_goods = cur_store_data[0][2];
							var gids = [];
							cur_store_goods.map((item, index) => {
								if (!key) {
									//未登录，传店铺商品的gid
									gids.push(item.gid);
								} else {
									//已登录，传店铺商品的cart_id
									gids.push(item.cart_id);
								}
							});
						} // let storeid = e.currentTarget.dataset.storeid;


						optData.map(item => {
							if (item[0] == storeid) {
								item[2].map(item1 => {
									item1.is_check = item[3] == 0 ? 1 : 0;
								});
								item[3] = item[3] == 0 ? 1 : 0;
							}

							let noSel = optData.every(item1 => item1[3] == 1);
							that.cart_list.is_check = noSel ? 1 : 0;
						});
						that.cart_list.cart_list = optData;
						that.setData({
							cart_list: that.cart_list
						});
					}
				} else if (datatype == 'batchOpt') {
					//管理--》完成 0    完成--》管理 1
					that.setData({
						batchOpt: !that.batchOpt,
						isPriceOptShow: is_check == 1 ? false : true //商品数量加减的操作，是否显示， 完成页面无，管理页面有

					});
					get_cart_list(that);
					that.goTop(); // if(!that.data.batchOpt){
					//   get_cart_list(that);
					// }else{
					//   optData.map(item=>{
					//     item[2].map(item1=>{
					//       item1.is_check = 0;
					//       item1.price_overrun = false
					//     })
					//     item[3] = 0;
					//   })
					//   that.data.cart_list.is_check = 0;
					//   that.data.cart_list.cart_list = optData;
					//   that.setData({
					//     cart_list:that.data.cart_list
					//   })
					// }
				} else if (datatype == 'all') {
					if (!that.batchOpt) {
						var allGids = [];
						optData.map(item => {
							item[2].map(item1 => {
								if (!key) {
									allGids.push(item1.gid);
								} else {
									allGids.push(item1.cart_id);
								}
							});
						});
					} else {
						var allGids = [];
						optData.map(item => {
							item[2].map(item1 => {
								if (!key) {
									allGids.push(item1.gid);
								} else {
									allGids.push(item1.cart_id);
								}
							});
						});
						optData.map(item => {
							item[2].map(item1 => {
								item1.is_check = that.cart_list.is_check == 1 ? 0 : 1;
							});
							item[3] = that.cart_list.is_check == 1 ? 0 : 1;
						});
						that.cart_list.is_check = that.cart_list.is_check == 0 ? 1 : 0;
						that.setData({
							cart_list: that.cart_list
						});
					}
				} //单个商品的选中状态变更 goods    店铺的选中状态的变更  store 


				var params = {}; // if(!that.data.batchOpt){

				if (!key) {
					params = {
						key: uuid,
						gids: datatype == "goods" ? gid : datatype == "store" ? gids : datatype == 'all' ?
							allGids : '',
						is_check: is_check == 1 ? 0 : 1
					};
				} else {
					params = {
						key: key,
						cart_ids: datatype == "goods" ? gid : datatype == "store" ? gids : datatype == 'all' ?
							allGids : '',
						is_check: is_check == 1 ? 0 : 1
					};
				} // }


				if (params.gids || params.cart_ids) {
					var url = !key ? '/index.php?app=cache_cart&mod=cart_edit_check' :
						'/index.php?app=cart&mod=cart_edit_check';
					uni.request({
						url: getApp().globalData.ser_url + url,
						data: params,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							if (res.data.code == 200) {
								if (!that.batchOpt) {
									//重新获取数据
									get_cart_list(that);
								}
							} else {
								errorTipsShow(that, res.data.error);
							}
						}
					});
				}
			},
			//数量加减事件
			cart_num: function(e) {
				var cart_data = this;
				var cart_id = e.currentTarget.dataset.cartId;
				var ope_type = e.currentTarget.dataset.type;
				var tar_num = e.currentTarget.dataset.value;
				var storeindex = e.currentTarget.dataset.storeIndex;
				var goodsindex = e.currentTarget.dataset.goodsIndex;
				var now_input_num = cart_data.cart_list.cart_list[storeindex][2][goodsindex].goods_num;
				var g_s = parseInt(e.currentTarget.dataset.storage) || parseInt(e.currentTarget.dataset.s2);
				let key = uni.getStorageSync('token');
				let uuid = uni.getStorageSync('uuid');
				let gid = e.currentTarget.dataset.gid;

				if (ope_type == 'minus') {
					//减
					if (now_input_num != 1) {
						if (tar_num <= g_s) {
							tar_num = now_input_num * 1 - 1;
						} else {
							uni.showToast({
								title: cart_data.$L('库存不足'),
								icon: 'none',
								duration: 1000
							});
							tar_num = g_s;
						}
					} else {
						uni.showToast({
							title: cart_data.$L('不能低于最低购买数量'),
							icon: 'none',
							duration: 1000
						});
						tar_num = 1;
						return;
					}
				} else if (ope_type == 'in') {
					//输入
					tar_num = e.detail.value * 1;

					if (tar_num < 1) {
						tar_num = 1;
					} else if (tar_num < 999 && tar_num >= g_s) {
						uni.showToast({
							title: cart_data.$L('库存不足'),
							icon: 'none',
							duration: 1000
						});
						tar_num = g_s;
					} else if (tar_num < g_s && tar_num > 999) {
						uni.showToast({
							title: cart_data.$L('超过购买上限'),
							icon: 'none',
							duration: 1000
						});
						tar_num = 999;
					} else {
						tar_num = tar_num;
					}
				} else {
					//加
					if (tar_num >= 999) {
						uni.showToast({
							title: cart_data.$L('超过购买上限'),
							icon: 'none',
							duration: 1000
						});
						tar_num = 999;
					} else {
						if (tar_num < g_s) {
							tar_num = now_input_num * 1 + 1;
						} else {
							uni.showToast({
								title: cart_data.$L('库存不足'),
								icon: 'none',
								duration: 1000
							});
							tar_num = g_s;
						}
					}
				}
				var cart_list = cart_data.cart_list;
				cart_list.cart_list[storeindex][2][goodsindex]['goods_num'] = tar_num;
				cart_data.setData({
					cart_list: cart_list
				});
				if (tar_num <= g_s && tar_num <= 999) {
					if (!key) {
						// 离线状态    购物车商品数量变更
						uni.request({
							url: getApp().globalData.ser_url +
								'/index.php?app=cache_cart&mod=cart_edit_quantity',
							data: {
								key: uuid,
								gid: gid,
								quantity: tar_num
							},
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							success: function(res) {
								if (res.data.code == 200) {
									//更新数量
									var cart_list = cart_data.cart_list;
									cart_list.cart_list[storeindex][2][goodsindex]['goods_num'] = tar_num;
									cart_list.sum = res.data.datas.total_price;
									cart_data.setData({
										cart_list: cart_list
									});
								} else {
									errorTipsShow(cart_data, res.data.error);
								}
							}
						});
						return;
					} else {
						//登录之后
						uni.request({
							url: getApp().globalData.ser_url +
								'/index.php?app=cart&mod=cart_edit_quantity_xcx',
							data: {
								key: key,
								cart_id: cart_id,
								quantity: tar_num
							},
							header: {
								'content-type': 'application/json' // 默认值

							},
							success: function(res) {
								if (res.data.state == 200) {
									//更新数量
									var cart_list = cart_data.cart_list;
									cart_list.cart_list[storeindex][2][goodsindex]['goods_num'] = tar_num;
									cart_data.setData({
										cart_list: cart_list
									});
									cal_total_price(cart_data);
								} else {
									errorTipsShow(cart_data, res.data.error);
								}
							}
						});
					}
				} else {
					uni.showToast({
						title: cart_data.$L('超过购买上限'),
						icon: 'none',
						duration: 1000
					});
					tar_num = 999;
					var cart_list = cart_data.cart_list;
					cart_list.cart_list[storeindex][2][goodsindex]['goods_num'] = tar_num;
					cart_data.setData({
						cart_list: cart_list
					});
				}
			},
			get_input_num: function(e) {},
			//进入店铺事件
			go_vendor: function(e) {
				if (getCurrentPages().length > 8) {
					uni.redirectTo({
						url: '/pages/shopHomePage/shopHomePage?vid=' + e.currentTarget.dataset.storeId
					});
				} else {
					uni.navigateTo({
						url: '/pages/shopHomePage/shopHomePage?vid=' + e.currentTarget.dataset.storeId
					});
				}
			},
			//进入商品详情页事件
			go_goods_detail: function(e) {
				if (getCurrentPages().length > 8) {
					uni.redirectTo({
						url: '../goods_detail/goods_detail?gid=' + e.currentTarget.dataset.goodsId
					});
				} else {
					uni.navigateTo({
						url: '../goods_detail/goods_detail?gid=' + e.currentTarget.dataset.goodsId
					});
				}
			},
			//去结算事件
			go_confirm_order: function(e) {
				let key = uni.getStorageSync('token');
				let that = this;
				//删除本地门店信息缓存
				if (uni.getStorageSync('store_info')) {
					uni.removeStorage({
						key: 'store_info'
					})
				}
				if (!key) {
					getApp().globalData.goLogin();
					return;
				} else {
					let cart_list_data = that.cart_list.cart_list;
					var cart_ids = ''; //选中的商品cart_id

					cart_list_data.map(item => {
						item[2].map(item1 => {
							if (item1.is_check == 1) {
								if (cart_ids == '') {
									cart_ids = item1.cart_id + '|' + item1.goods_num;
								} else {
									cart_ids = cart_ids + ',' + (item1.cart_id + '|' + item1
										.goods_num);
								}
							}
						});
					});
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=buy&mod=checkBuyCart',
						data: {
							key: key,
							cart_id: cart_ids //格式：购物车id|商品数量,购物车id|商品数量，如768|1,761|1

						},
						header: {
							'content-type': 'application/json' // 默认值

						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.state == 'suc') {
								//成功，可以去结算
								var t = [];
								let gid = '';	//只有选择单个商品时进入下一页才能上门自提
								for (var i = 0; i < that.cart_list.cart_list.length; i++) {
									for (var j = 0; j < that.cart_list.cart_list[i][2].length; j++) {
										if (that.cart_list.cart_list[i][2][j].is_check == 1) {
											gid = that.cart_list.cart_list[i][2][j].gid;
											var a = that.cart_list.cart_list[i][2][j].cart_id;
											var e = parseInt(that.cart_list.cart_list[i][2][j].goods_num);
											var r = a + "|" + e;
											t.push(r);
										}
									}
								}
								if (t.length > 0) {
									var a = t.toString();
									uni.navigateTo({
										url: '../confirm_order/confirm_order?ifcart=1&cart_id=' + a + (t.length==1?'&gid='+gid:'')
									});
								} else {
									errorTipsShow(that, that.$L('请先选中商品'));
								}
							} else if (res.data.code == 200 && res.data.datas.error_code ==
								'storage_empty_error') {
								//有库存不足的商品
								that.setData({
									insufficient_stock: true,
									insufficient_stock_arr: res.data.datas.data,
									transparent_mask: true
								});
							} else if (res.data.code == 200 && res.data.datas.error_code ==
								'goods_error') {
								//商品信息发生了变化，请刷新购物车
								uni.showModal({
									title: that.$L('提示'),
									content: that.$L('商品信息发生变化，请刷新购物车重新结算'),
									cancelText:that.$L('取消'),
									confirmText:that.$L('确定'),
									showCancel: false,
									//不显示取消按钮
									confirmColor: '#FB1B1B',
									success: function(res) {
										if (res.confirm) {
											//获取购物车数据
											get_cart_list(that); // 获取推荐商品数据

											that.get_tuijian_goods();
										}
									}
								});
							}
						}
					});
				}
			},
			// 获取推荐商品数据
			get_tuijian_goods: function(e) {
				let key = uni.getStorageSync('token');
				var that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getRecGoodsList',
					data: {
						key: key
					},
					header: {
						'content-type': 'application/json' // 默认值

					},
					success: function(res) {
						if (res.data.code == 200) {
							var goods_list = res.data.datas.goods_list;
							that.setData({
								tuijian_goods: goods_list,
								isDataLoading: true //购物车数据是否加载完毕

							});
							let tuijian_gids = [];
							goods_list && goods_list.forEach(el => {
								tuijian_gids.push(el.gid);
							});
							that.setData({
								tuijian_gids
							})
						}
					}
				});
			},

			//价格超出
			priceOverrun(e) {
				let that = this;
				let cartId = e.currentTarget.dataset.cartId;
				that.cart_list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						if (item1.cart_id == cartId) {
							item1.price_overrun = true;
						} else {
							item1.price_overrun = false;
						}
					});
					that.setData({
						cart_list: that.cart_list
					});
					that.$forceUpdate()
				});
			},

			//关闭当前这个价格超出的数量加减的关闭按钮
			cartListClose(e) {
				let that = this;
				let cartId = e.currentTarget.dataset.cartId;
				that.cart_list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						if (item1.cart_id == cartId) {
							item1.price_overrun = false;
						} else {
							item1.price_overrun = false;
						}
					});
					that.setData({
						cart_list: that.cart_list
					});
					that.$forceUpdate();
				});
			},

			//点击透明蒙层，影藏透明蒙层，及单个商品呢的操作
			handleTrans_mask() {
				let that = this;
				that.cart_list && that.cart_list.cart_list && that.cart_list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						item1.isOpen = false;
					});
					that.setData({
						cart_list: that.cart_list
					});
				});
			},

			//长按事件, 操作单个商品：移至收藏夹 ，删除
			handleLongTap(e) {
				let that = this;
				let key = uni.getStorageSync('token');
				let cartId = e.currentTarget.dataset.cartId;
				let goodsId = e.currentTarget.dataset.goodsId;
				that.setData({
					key: key
				});
				let list = that.cart_list
				list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						if (item1.gid == goodsId) {
							item1.isOpen = true;
						} else {
							item1.isOpen = false;
						}
					});
				});
				setTimeout(() => {
					that.cart_list = list
				}, 0)
			},

			//隐藏单个商品的批量操作框
			hideOpt(e) {
				let that = this;
				let cartId = e.currentTarget.dataset.cartId;
				that.cart_list.cart_list.map((item, index) => {
					item[2].map((item1, index1) => {
						if (item1.cart_id == cartId) {
							item1.isOpen = false;
						} else {
							item1.isOpen = false;
						}
					});
					that.setData({
						cart_list: that.cart_list
					});
				});
			},

			//加入购物车
			add_cartList(e) {
				let that = this;
				let key = uni.getStorageSync('token');
				that.setData({
					key
				});
				let uuid = uni.getStorageSync('uuid');
				let gid = e.currentTarget.dataset.gid;
				var item = e.currentTarget.dataset.item;

				if (!key) {
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
							quantity: 1, //数量
							stat_end: that.stat_end

						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								}); //一键回到页面顶部
								UpdateCart();
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
				} else {
					//已登录
					let url = getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add';
					uni.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							is_from_live: '0',
							//是否来自直播：0否1是
							gid,
							quantity: 1, //数量
							stat_end: that.stat_end,
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == true) {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								}); //一键回到页面顶部
								UpdateCart();
								// that.goTop();
								get_cart_list(that);
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none',
									duration: 500
								});
							}
						}
					});
				}
			},

			//移至收藏夹   单个， 批量
			batchCollection(e) {
				let that = this;
				let key = uni.getStorageSync('token');
				let cartid = e.currentTarget.dataset.cartid; //单个商品cart_id

				let source_type = e.currentTarget.dataset.type; //批量商品cart_id

				let cartlistData = that.cart_list.cart_list;
				var batchCartIds = [];
				cartlistData.map(item => {
					let collection_data_goods = item[2].filter(item1 => item1.is_check == 1);
					collection_data_goods.map(item2 => {
						batchCartIds.push(item2.cart_id);
					});
				});

				if (source_type == 'batch' && batchCartIds.toString() == '') {
					//无选中商品
					uni.showToast({
						title: that.$L('请先选中商品'),
						icon: 'none',
						duration: 500
					});
				} else {
					let url = getApp().globalData.ser_url + '/index.php?app=cart&mod=followgoods';
					uni.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							cart_id: source_type == 'single' ? cartid : source_type == 'batch' ? batchCartIds
								.toString() : '',
							stat_end: that.stat_end
						},
						success: function(res) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none',
									duration: 500
								});
							}

							if (!that.batchOpt) {
								get_cart_list(that);
							} else {
								that.del_opt(that, source_type, cartlistData, cartid, batchCartIds);
							}

							if (source_type == 'batch') {
								that.goTop(); //回到顶部
							}
						}
					});
				}
			},

			//关闭弹出商品库存不足的蒙层
			close_mask() {
				this.setData({
					transparent_mask: false,
					insufficient_stock: false
				});
			},

			//一键回到页面顶部
			goTop() {
				//回到页面顶部
				if (uni.pageScrollTo) {
					uni.pageScrollTo({
						scrollTop: 0
					});
				} else {
					uni.showModal({
						title: this.$L('提示'),
						content: this.$L('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'),
						cancelText:that.$L('取消'),
						confirmText:that.$L('确定'),
					});
				}
			}

		}
	};
</script>
<style>
	page {
		background-color: #F5F5F5;
		height: 100%;
		overflow-x: hidden;
		width: 750rpx;
		margin: 0 auto;
	}

	* {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	input,
	textarea {
		-webkit-user-select: auto;
	}

	.cart_content {
		overflow-x: hidden;
	}

	/* 透明遮罩 */
	.transparent_mask {
		width: 100%;
		display: fixed;
		width: 100%;
		height: 100%;
		position: fixed;
		background: rgb(0, 0, 0, 0.3);
		top: 0;
		left: 0;
		z-index: 100;
	}

	.bbctouch-cart-bottom {
		display: block;
		position: fixed;
		z-index: 1;
		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background-color: #fff;
	}

	.bbctouch-cart-bottom:before {
		height: 2rpx;
		content: '';
		width: 100%;
		border-top: 2rpx solid #e3e5e9;
		position: absolute;
		top: -2rpx;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.bbctouch-cart-bottom .total {
		display: block;
		float: left;
		text-align: right;
		width: 75%;
	}

	bbctouch-cart-bottom .check-out {
		display: block;
		float: right;
		width: 25%;
		height: 2.1rem;
		background-color: #bbb;
	}

	.bbctouch-cart-bottom .check-out.ok {
		background-color: #f23030;
		display: block;
		float: right;
		width: 25%;
		height: 100rpx;
	}

	.bbctouch-cart-bottom .check-out a {
		display: block;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		line-height: 100rpx;
	}

	.cart_list_con {
		padding-top: 80rpx;
		box-sizing: border-box;
	}

	.cart_list_con1 {
		padding-top: 80rpx;
		padding-bottom: 118rpx;
		box-sizing: border-box;
	}

	.bbctouch-cart-bottom .total-money dt {
		display: inline-block;
		font-size: 28rpx;
		color: #232326;
	}

	.bbctouch-cart-bottom .total-money dd {
		display: inline-block;
		font-size: 26rpx;
		color: #f23030;
	}

	.bbctouch-cart-bottom .total-money dd em {
		font-size: 42rpx;
	}

	.bbctouch-cart-bottom .total-money {
		height: 46rpx;
		margin-right: 46rpx;
		padding: 23rpx 0;
		font-size: 0;
		line-height: 46rpx;
		display: block;
	}

	#cart-list-wp {
		display: block;
		position: relative;
	}

	.bbctouch-cart-container {
		display: block;
		clear: both;
		position: relative;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.bbctouch-cart-store {
		display: block;
		position: relative;
		background: #fff;
	}

	.bbctouch-cart-store dt {
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
		height: 42rpx;
		padding: 23rpx;
		font-size: 28rpx;
		color: #252525;
	}

	.bbctouch-cart-store dt a {
		display: flex;
		align-items: center;
	}

	.bbctouch-cart-store dt .store-check {
		display: block;
		margin-right: 20rpx;
	}

	.bbctouch-cart-item {
		background-color: #fff;
	}

	.bbctouch-cart-item li {
		display: block;
		position: relative;
		z-index: 1;
		margin-left: 0;
		padding: 23rpx 0 23rpx 23rpx;
		background: #fff;
	}

	.bbctouch-cart-item li .goods-check {
		position: absolute;
		top: 75rpx;
	}

	.bbctouch-cart-item li .goods-pic {
		display: block;
		width: 126rpx;
		height: 126rpx;
		padding: 10rpx;
		position: absolute;
		z-index: 1;
		top: 23rpx;
		left: 74rpx;
		border-radius: 10rpx;
	}

	.bbctouch-cart-item li .goods-pic a image {
		max-width: 100%;
		max-height: 100%;
	}

	.bbctouch-cart-item li .goods-info {
		display: block;
		height: 102rpx;
		margin: 0 92rpx 0 208rpx;
		position: relative;
		z-index: 1;
	}

	.bbctouch-cart-item li .goods-info dt.goods-name {
		display: block;
	}

	.bbctouch-cart-item li .goods-info dt.goods-name a {
		display: block;
		height: 64rpx;
		font-size: 26rpx;
		color: #232326;
		line-height: 32rpx;
		overflow: hidden;
	}

	.bbctouch-cart-store dt .icon-store {
		display: inline-block;
		width: 37rpx;
		height: 0;
		opacity: 0.8;
		margin-right: 15rpx;
	}

	.bbctouch-cart-item li .goods-info dd.goods-type {
		overflow: hidden;
		white-space: nowrap;
		width: 70%;
		height: 42rpx;
		font-size: 21rpx;
		line-height: 42rpx;
		color: #999;
		text-overflow: ellipsis;
	}

	.bbctouch-cart-item li .goods-del {
		display: block;
		position: absolute;
		z-index: 1;
		top: 14rpx;
		right: 23rpx;
		width: 46rpx;
		height: 46rpx;
	}

	.bbctouch-cart-item li .goods-del a {
		display: block;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 60%;
		opacity: 0.8;
		text-align: center;
	}

	.bbctouch-cart-item li .goods-subtotal {
		display: block;
		height: 46rpx;
		margin: 0 23rpx 0 207rpx;
		line-height: 46rpx;
		font-size: 28rpx;
		position: relative;
		z-index: 1;
	}

	.bbctouch-cart-item li .goods-subtotal .goods-price {
		color: #f23030;
		font-size: 32rpx;
	}

	.bbctouch-cart-item li .goods-subtotal .goods-price em {
		font-size: 32rpx;
	}

	.bbctouch-cart-item li .goods-subtotal .goods-sale {
		display: inline-block;
		vertical-align: top;
		margin-right: 5rpx;
	}

	.bbctouch-cart-item li .value-box {
		position: absolute;
		z-index: 1;
		bottom: 3rpx;
		right: 0;
	}

	.value-box {
		display: inline-block;
		float: right;
		font-size: 0;
		border-radius: 10rpx;
	}

	.value-box span.minus {
		background-color: #fafafa;
		border-radius: 10rpx 0 0 10rpx;
	}

	.value-box span {
		display: inline-block;
		vertical-align: top;
		line-height: 0;
	}

	.value-box span.minus a {
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.value-box span a {
		display: block;
		width: 20rpx;
		height: 22rpx;
		margin: 14rpx;
		opacity: 0.65;
	}

	.value-box span {
		display: inline-block;
		vertical-align: top;
		line-height: 0;
	}

	.cart_edit_num {
		position: relative;
	}

	.cart_edit_num:before {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		width: 2rpx;
		height: 100rpx;
		border-right: 2rpx solid #cbcbcb;
		border-radius: 0;
		-webkit-border-radius: 0;
		transform: scaleX(0.5);
		-webkit-transform: scaleX(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
	}

	.value-box span .buy-num {
		width: 56rpx;
		height: 50rpx;
		padding: 0;
		font-size: 30rpx;
		font-weight: lighter;
		line-height: 50rpx;
		text-align: center;
		border-radius: 0;
	}

	.value-box span .buy-num {
		color: #232326;
		border: none;
	}

	.cart_edit_num:before {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		width: 2rpx;
		height: 50rpx;
		border-right: 2rpx solid #cbcbcb;
		border-radius: 0;
		-webkit-border-radius: 0;
		transform: scaleX(0.5);
		-webkit-transform: scaleX(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
	}

	.cart_edit_num:after {
		position: absolute;
		top: 0;
		right: 0;
		content: '';
		width: 2rpx;
		height: 50rpx;
		border-right: 2rpx solid #cbcbcb;
		border-radius: 0;
		-webkit-border-radius: 0;
		transform: scaleX(0.5);
		-webkit-transform: scaleX(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
	}

	.value-box span.add {
		background-color: #fafafa;
		border-radius: 0 10rpx 10rpx 0;
	}

	.value-box span.add a {
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.value-box:after {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		width: 200%;
		height: 200%;
		border: 2rpx solid #cbcbcb;
		border-radius: 8rpx;
		-webkit-border-radius: 8rpx;
		transform: scale(0.5);
		-webkit-transform: scale(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
		pointer-events: none;
	}

	.bbctouch-cart-store:after {
		height: 1px;
		content: '';
		width: 100%;
		border-top: 2rpx solid #e3e5e9;
		position: absolute;
		bottom: 0rpx;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.all-check {
		position: absolute;
		z-index: 1;
		top: 32rpx;
		left: 25rpx;
		width: 35rpx;
		height: 35rpx;
		background-color: #fff;
		border: 2rpx solid #ccc;
		-webkit-border-radius: 50%;
		border-radius: 50%;
		vertical-align: middle;
	}

	.all-check text {
		content: '';
		position: absolute;
		left: 5rpx;
		top: 7rpx;
		width: 20rpx;
		height: 10rpx;
		border-left: 3rpx solid #fff;
		border-bottom: 3rpx solid #fff;
		-webkit-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	.has_check {
		border: 2rpx solid #f23030 !important;
		background-color: #f23030 !important;
	}

	.fangcheck {
		position: relative;
		width: 34rpx;
		height: 34rpx;
		background-color: #fff;
		border: 2rpx solid #ccc;
		-webkit-border-radius: 50%;
		border-radius: 50%;
		vertical-align: middle;
	}

	.fangcheck text {
		position: absolute;
		left: 5rpx;
		top: 7rpx;
		width: 20rpx;
		height: 10rpx;
		border-left: 3rpx solid #fff;
		border-bottom: 3rpx solid #fff;
		-webkit-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	.bbctouch-cart-item li .goods-subtotal .goods-sale em {
		display: inline-block;
		vertical-align: top;
		height: 32rpx;
		padding: 0 5rpx;
		margin-top: 8rpx;
		font-size: 20rpx;
		color: #fff;
		line-height: 32rpx;
		background-color: #ed5564;
		border-radius: 7rpx;
		margin-left: 6rpx;
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

	.no_cart_goods .empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 150rpx 0;
		background-color: #fff;
	}

	.no_cart_goods .empty image {
		width: 210rpx;
		height: 210rpx;
	}

	.no_cart_goods .empty text {
		color: #949494;
		font-size: 24rpx;
	}

	.no_cart_goods .empty .cart-em {
		font-size: 28rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.cart-comment .cart-comment-title {
		margin: 41rpx 0 23rpx;
		text-align: center;
	}

	.cart-comment-title image {
		width: 427rpx;
		height: 48rpx;
	}

	.cart-comment .goods-list {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		box-sizing: border-box;
	}

	.goods-list navigator {
		width: 345rpx;
		margin-bottom: 20rpx;
		border-radius: 14rpx;
		margin-left: 20rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.goods-list .img {
		width: 345rpx;
		height: 345rpx;
	}

	.goods-list .img image {
		width: 100%;
		height: 100%;
	}

	.goods-list .goods-name {
		height: 78rpx;
		padding-top: 10rpx;
		line-height: 39rpx;
		color: #2d2d2d;
		font-size: 28rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding: 10rpx 20rpx;
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
	}

	.price-wrap .sale {
		margin-left: 10rpx;
		color: #949494;
		font-size: 24rpx;
	}

	.administration {
		padding: 20rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;
		position: absolute;
		z-index: 50;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items:center;
		background: #F5F5F5;
		top: 0;

		color: #2d2d2d;
		font-size: 24rpx;

		.free_ship{
			display: flex;
			gap: 10rpx;
			align-items:center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.store_pre {
		margin: 0 auto;
		width: 710rpx;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
	}

	.store_pre:nth-last-of-type(1) {
		margin-bottom: 0;
	}

	.store_pre_top {
		width: 100%;
		height: 93rpx;
		display: flex;
		align-items: center;
		padding-left: 30rpx;
		border-bottom: 1rpx solid #F2F2F2;
	}

	.store_select {
		width: 32rpx;
		height: 32rpx;
	}

	.store_des {
		margin-left: 30rpx;
		display: flex;
		align-items: center;
	}

	.store_des_image {
		width: 34rpx;
		height: 32rpx;
	}

	.store_des_text {
    max-width:500rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #2D2D2D;
		line-height: 42rpx;
		margin: 0 10rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	}

	.store_des_rightdown {
		width: 13rpx;
		height: 22rpx;
	}

	.store_cart_list {
		box-sizing: border-box;
	}

	.cart_list_pre {
		padding: 0 30rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		height: 200rpx;
		align-items: center;
		position: relative;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.cart_list_pre:nth-last-of-type(1) {
		margin-bottom: 0;
	}

	.cart_list_pre_sel {
		width: 32rpx;
		height: 32rpx;
		margin-right: 30rpx;
	}

	.list_pre_img {
		width: 180rpx;
		height: 180rpx;
		background: #F3F3F3;
		border-radius: 14rpx;
	}

	.list_pre_img image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 14rpx;
	}

	.list_pre_des {
		width: 356rpx;
		display: flex;
		flex-direction: column;
		margin-left: 32rpx;
	}

	.list_pre_des_name {
		font-size: 28rpx;
		color: #2d2d2d;
		line-height: 45rpx;
		width: 356rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.list_pre_des_name1 {
		color: #999999;
	}

	.list_pre_des_bot {
		display: flex;
		width: 356rpx;
		justify-content: space-between;
		align-items: flex-end;
	}

	.list_pre_des_price {
		color: #2d2d2d;
	}

	.list_pre_des_price1 {
		color: #333333;
	}

	.list_pre_des_num {
		display: flex;
		align-items: center;
		width: 182rpx;
		height: 50rpx;
		border: 1rpx solid #EBEBEB;
		border-radius: 6rpx;
	}

	.list_pre_des_num text:nth-child(1) {
		width: 51rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 400;
		color: #949494;
		line-height: 30rpx;
		border-right: 1rpx solid #EBEBEB;
	}

	.list_pre_des_num input {
		width: 78rpx;
		height: 50rpx;
		font-size: 24rpx;
		color: #2D2D2D;
		text-align: center;
		line-height: 50rpx;
	}

	.list_pre_des_num text:nth-child(3) {
		width: 51rpx;
		height: 50rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #2D2D2D;
		line-height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-left: 1rpx solid #EBEBEB;
	}

	.invalid_goods {
		margin: 0 auto;
		width: 710rpx;
		background: #FFFFFF;
		border-radius: 15rpx;
	}

	.invalid_goods_top {
		height: 89rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 30rpx;
		border-bottom: 1rpx solid #F5F5F5;
		box-sizing: border-box;
	}

	.invalid_goods_top text:nth-child(1) {
		font-size: 30rpx;
		font-weight: 600;
		color: #2D2D2D;
		line-height: 39rpx;
	}

	.invalid_goods_top text:nth-child(2) {
		font-size: 24rpx;
		font-weight: 500;
		color: #FC1C1C;
		line-height: 30rpx;
	}

	.invalid_goods_list {
		padding: 30rpx;
		box-sizing: border-box;
	}

	.invalid_goods_pre {
		width: 100%;
		height: 200rpx;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.invalid_goods_pre:nth-last-of-type(1) {
		margin-bottom: 0;
	}

	.invalid_tips {
		/* min-width: 31rpx; */
		padding: 0 5rpx;
		height: 67rpx;
		background: #999999;
		border-radius: 6rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}

	.invalid_tips text {
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
	}

	.invalid_des {
		display: flex;
		align-items: center;
	}

	.invalid_des_img {
		width: 200rpx;
		height: 200rpx;
		background: #F3F3F3;
		border-radius: 14rpx;
		margin-right: 30rpx;
	}

	.invalid_des_img image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 14rpx;
	}

	.invalid_des_con {
		width: 352rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.invalid_goods_name {
		font-size: 28rpx;
		font-weight: 500;
		color: #999999;
		line-height: 45rpx;
	}

	.invalid_goods_buy {
		font-size: 24rpx;
		font-weight: 500;
		color: #2D2D2D;
		line-height: 30rpx;
	}

	.pick_goods {
		padding: 0 20rpx 118rpx;
		box-sizing: border-box;
	}

	.pick_goods_top {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
		box-sizing: border-box;
		color: #666;
		font-size: 26rpx;
		text{
			position: relative;
			&:after,
			&:before {
				content: "";
				display: block;
				width: 150rpx;
				height: 1px;
				background: #ccc;
				position: absolute; /* Punto y coma agregado */
				top: 50%;
			}
			&:after {
				right: -20rpx;
				transform: translateX(100%);
			}
			&:before {
				left: -20rpx;
				transform: translateX(-100%);
			}

		}
	}

	.pick_goods_top image {
		width: 427rpx;
		height: 50rpx;
	}

	.pick_list {
		display: flex;
		flex-wrap: wrap;
	}

	.pick_list_pre {
		width: 345rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
		margin-right: 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		padding: 20rpx 0;
	}

	.pick_list_pre:nth-of-type(2n) {
		margin-right: 0;
	}

	.pick_list_pre_img {
		width: 300rpx;
		height: 300rpx;
		border-top-left-radius: 14rpx;
		border-top-right-radius: 14rpx;
		margin: 0 auto;
		display: block;
	}

	.pick_list_pre_des {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 20rpx;
		box-sizing: border-box;
	}

	.pick_list_pre_name {
		font-size: 28rpx;
		font-weight: 500;
		color: #2D2D2D;
		width: 298rpx;
		margin: 0 auto;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;

	}

	.pick_lsit_pre_bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 20rpx 20rpx 22rpx;
		box-sizing: border-box;
	}

	.pick_list_pre_price {
		font-size: 32rpx;
		color: #2d2d2d;
		line-height: 30rpx;
	}

	.add_cart_list {
		width: 42rpx;
		height: 42rpx;
	}

	.total_settlement {
		position: fixed;
		bottom: 0;
		z-index: 50;
		width: 750rpx;
		height: 98rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(86, 86, 86, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	/* #ifdef H5 */
	.total_settlement {
		bottom: var(--window-bottom);
	}

	/* #endif */

	.total_settlement_left {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.total_settlement_left image {
		width: 32rpx;
		height: 32rpx;
	}

	.total_settlement_left text {
		font-size: 26rpx;
		font-weight: 500;
		color: #949494;
		line-height: 30rpx;
		margin-left: 19rpx;
	}

	.total_settlement_right {
		display: flex;
		align-items: center;
	}

	.total_settlement_price {
		display: flex;
		flex-direction: column;
		align-items: start;
	}

	.total_settlement_price1 {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 30rpx;
	}

	.total_settlement_price text {
		font-size: 34rpx;
		font-weight: 600;
		color: #2d2d2d;
		line-height: 30rpx;
	}

	.total_settlement_freight {
		font-size: 20rpx;
		font-weight: 500;
		color: #949494;
		line-height: 30rpx;
	}

	.total_settlement_text {
		background: #FC1C1C;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #F8F8F8;
		text-align: center;
		padding: 10rpx 30rpx;
	}

	.grey {
		background: #666666;
	}

	.cart_list_pre_opt {
		position: absolute;
		top: 0;
		left: 0;
		width: 710rpx;
		height: 200rpx;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 150;
	}

	.move_favorites {
		width: 110rpx;
		height: 110rpx;
		background: #FFAB26;
		border-radius: 50%;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 80rpx;
	}

	.delete_goods {
		width: 110rpx;
		height: 110rpx;
		background: #FC1C1C;
		border-radius: 50%;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.batch_move {
		width: 170rpx;
		height: 60rpx;
		border: 1rpx solid #FFAB26;
		border-radius: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFAB26;
		line-height: 60rpx;
		text-align: center;
	}

	.batch_del {
	}

	.insufficient_stock1 {
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
		line-height: 30rpx;
	}

	.list_pre_num {
		width: 52rpx;
		height: 50rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.1);
		border-radius: 6rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #2D2D2D;
		line-height: 50rpx;
		text-align: center;
	}

	.cart_list_close1 {
		height: 50rpx;
		display: flex;
		align-items: center;
	}

	.cart_list_close {
		width: 30rpx;
		height: 30rpx;
	}

	.insufficient_stock {
		width: 580rpx;
		height: 773rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		position: fixed;
		z-index: 100;
		left: 50%;
		top: 50%;
		margin-left: -290rpx;
		margin-top: -386rpx;
	}

	.insufficient_stock_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		height: 80rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.insufficient_stock_title {
		font-size: 32rpx;
		font-weight: 500;
		color: #2D2D2D;
		line-height: 45rpx;
	}

	.insufficient_stock_close {
		width: 22rpx;
		height: 22rpx;
	}

	.insufficient_stock_con {
		width: 100%;
		height: 692rpx;
	}

	.insufficient_stock_pre {
		padding: 20rpx 31rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 40rpx;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.insufficient_stock_num {
		color: #FC1C1C;
		font-weight: 600;
		margin-left: 10rpx;
	}

	.status_bar {
		height: var(--status-bar-height);
		/* #ifdef MP */
		height: 40rpx;
		/* #endif */
		top: 0;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 9999;
	}

	.fixed_top_status_bar {
		position: fixed;
		/* #ifdef APP-PLUS */
		height: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		height: 0;
		/* #endif */
		/* #ifdef MP */
		height: 88rpx;
		/* #endif */
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background: #fff;
	}
</style>
