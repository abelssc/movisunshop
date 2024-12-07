<template>
	<view>
		<view class="bbctouch-main-layout mb20">

			<div class="bbctouch-cart-block mt039">
				<div class="bbctouch-cart-add-default" @tap.stop="go_address_list">
					<a href="javascript:void(0);" id="list-address-valve">
						<view>
							<p id="true_name">{{user_address.true_name}}</p>
							<p id="mob_phone">{{user_address.mob_phone}}</p>
							<p id="user_address">{{user_address.address?user_address.address:''}} {{user_address.area_info?user_address.area_info:''}}</p>
						</view>
						<view>
							<image src="/static/images/arrow_right_b.png"></image>
						</view>
					</a>
				</div>
			</div>

			<!--付款方式Begin-->
			<div class="bbctouch-cart-block mt039" style="display:none">
				<a href="javascript:void(0);" class="posr" id="select-payment-valve" @tap.stop="showPayModeFun">
					<view class="let_tip">{{$L('支付方式：')}}</view>
					<div class="current-con">{{pay_mode=='online'?$L('在线付款'):$L('货到付款')}}</div>
					<i class="icon-arrow" v-if="ifshow_offpay">
						<image style="width:100%;height:100%;display:block;margin-top:4rpx;" src="/static/images/arrow_right_b.png"></image>
					</i>
				</a>
			</div>
			<!--付款方式End-->
		

			<!--选择付款方式Begin-->
			<div id="select-payment-wrapper" class="bbctouch-full-mask hide">
				<div class="bbctouch-full-mask-bg"></div>
				<div class="bbctouch-full-mask-block">
					<div class="header">
						<div class="header-wrap">
							<div class="header-l">
								<a href="javascript:void(0);">
									<i class="back"></i>
								</a>
							</div>
							<div class="header-title">
								<view>{{$L('选择支付方式')}}</view>
							</div>
						</div>
					</div>
					<div class="bbctouch-main-layout">
						<div class="bbctouch-sel-box">
							<view class="tit">{{$L('支付方式')}}</view>
							<div class="sel-con">
								<a href="javascript:void(0);" class="sel" id="payment-online">{{$L('在线支付')}}</a>
								<a href="javascript:void(0);" style="display:none;" id="payment-offline">{{$L('货到付款')}}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--选择付款方式End-->

			<view :class="'pay_mode_wrap ' + (showPayMode?'on':'')" id="pay_wrap" @tap="closePayMode">
				<view class="pay_mode">
					<view class="p_title">{{$L('选择支付方式')}}</view>
					<radio-group @change="changePayMode">
						<label for="online" class="p_item">
							<text>{{$L('在线支付')}}</text>
							<radio value="online" id="online" :checked="pay_mode=='online'"></radio>
						</label>
						<label for="offline" class="p_item">
							<text>{{$L('货到付款')}}</text>
							<radio value="offline" id="offline" :checked="pay_mode=='offline'"></radio>
						</label>
					</radio-group>
				</view>
			</view>

			<!-- 选择优惠券Begin -->
			<div v-if="detail_info.red && is_allow_show_red" class="bbctouch-cart-block mt039" @tap.stop="go_red">
				<a href="javascript:void(0);" class="posr" id="red-valve">
					<view class="let_tip">{{$L('平台优惠券：')}}</view>
					<div class="current-con">
						<p id="redContent">{{red_content}}</p>
					</div>
					<i class="icon-arrow">
						<image style="width:100%;height:100%;display:block;margin-top:4rpx;" src="/static/images/arrow_right_b.png"></image>
					</i>
				</a>
			</div>
			<!-- 选择优惠券End -->

			<!-- 积分抵扣 start -->
			<view class="points_pd" v-if="detail_info.member_points*1>0 && detail_info.points_max_use*1>0 && detail_info.allow_use_points==1">
				<view class="points-top">
					<view class="title">{{$L('积分折扣')}}
						<switch color="#48da64" @change="showUsePoints"></switch>
					</view>
					<view class="use-points" v-if="isUsePoints">
						<text>{{$L('使用')}}</text>
						<input type="number" style="font-size: 24rpx;height: 48rpx;" @input="usePointsChange" :placeholder="$L('请输入积分')" v-model="points_num"></input>
						<text>{{$L('积分')}} =</text>
						<text class="red-price">{{$L('￥')}}{{points_price}}</text>
					</view>
				</view>

				<view class="points-bottom" v-if="isUsePoints">
					{{$L('当前积分')}} <text>{{detail_info.member_points}}</text>
					{{$L('最多可使用')}} <text>{{pointsInfo.max_use_points}}</text>
					{{$L('抵用')}} <text>{{$L('￥')}}{{pointsInfo.pointsToMoney}}</text>
				</view>
			</view>
			<!-- 积分抵扣 end -->

			<!--商品列表Begin-->
			<div id="goodslist_before" class="mt039">
				<div id="deposit">
					<block v-for="(store_item, store_index) in detail_info.store_cart_list" :key="store_index">
						<div class="bbctouch-cart-container">
							<view class="cart-items">
								<view class="cart-title">
									{{store_item.goods_list.length}} producto(s)
								</view>
								<ul class="bbctouch-cart-item">
									<block v-for="(goods_item, goods_index) in store_item.goods_list" :key="goods_index">
										<li class="buy-item">
											<div class="goods-pic">
												<a href="javascript:void(0)">
													<image :src="goods_item.goods_image_url"></image>
												</a>
											</div>
											<view class="goods_desc">
												<dl class="goods-info">
													<dt class="goods-name">
														<a href="javascript:void(0)" class="goods-name-nowrap">{{goods_item.goods_name}}
														</a>
													</dt>
													<dd class="goods-type" v-if="detail_info.pin">[{{detail_info.pin.sld_team_count}}{{$L('人团')}}] | {{$L('已有')}}{{detail_info.pin.sales}}{{$L('人参与')}}</dd>
													<dd class="goods-type">{{goods_item.goods_spec}}</dd>
												</dl>
												<div class="goods-subtotal">
													<view class="goods-price">
														<view class="commodity_price" v-if="!goods_item.show_price && !goods_item.goods_price"><text>{{$L('￥')}}</text>0</view>
														<!-- <em>{{(goods_item.show_price || goods_item.show_price===0) ? goods_item.show_price : goods_item.goods_price}}</em> -->
														<!-- <em>{{goods_item.goods_price}}</em> -->
														<block v-if="goods_item.show_price">
															<view class="commodity_price" v-if="goods_item.promotion_type == 'xianshi' && goods_item.promotion_run_flag == 1  || goods_item.promotion_type == 'tuan' && goods_item.promotion_start_flag == 2 || goods_item.promotion_type=='pin_tuan' && goods_item.promotion_start_flag == 2 || goods_item.promotion_type=='p_mbuy'"><text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(goods_item.show_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(goods_item.show_price))[1]}}</text></view>
															<view class="commodity_price" v-else><text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(goods_item.show_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(goods_item.show_price))[1]}}</text></view>
														</block>
														<block v-if="!goods_item.show_price&&goods_item.goods_price">
															<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(goods_item.goods_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(goods_item.goods_price))[1]}}</text></view>
														</block>

														<span v-if="detail_info.pin">{{$L('省')}}{{$L('￥')}}{{(detail_info.pin.goods_price-detail_info.pin.sld_pin_price).toFixed(2)}}</span>
													</view>
													<view class="commodity_cant">
														Cant: {{goods_item.goods_num}}
													</view>
												</div>
												<!-- <div class="goods-num">
													<em>{{goods_item.goods_num}}*</em>
												</div> -->
												<view v-if="goods_item.gift_list">
													<block v-for="(gift_item, index) in goods_item.gift_list" :key="index">
														<div class="goods-gift">
															<span>
																<em>{{$L('赠品')}}</em>{{gift_item.gift_goodsname}}</span>
														</div>
													</block>
												</view>
												<div class="notransport transportId<%=v1.transport_id%>" style="display:none;">
													<p>{{$L('该商品不支持配送')}}</p>
												</div>
											</view>
										</li>
									</block>
								</ul>
							</view>
							<div class="bbctouch-cart-subtotal">
								<dl class="discount_wrap" v-if="store_item.goods_list[0].grade_discount">
									<dt class="discount">
										<view>{{$L('优惠折扣')}}</view>
										<view class="bg">
											<image :src="img_url+'V2@2x.png'"></image>
											<text style="height:auto;line-height: auto;" >{{$L('会员')}}{{store_item.goods_list[0].grade_discount}}{{$L('折')}}</text>
										</view>
									</dt>
								</dl>

								<dl v-if="store_item.red&&store_item.red.length">
									<dt>{{$L('店铺优惠券')}}</dt>
									<dd @tap="show_store_red" :data-index="store_index">
										{{store_item.store_red}}
									</dd>
								</dl>
								<!-- <dl wx:if="{{!detail_info.dian_list}}">
									<dt>物流配送</dt>
									<dd>运费
										<em id="storeFreight{{store_index}}">{{store_item.yunfei_price}}</em>元</dd>
									<dd class="store_yunfei_tip">
										<span id="yunfei_tip{{store_index}}">{{store_item.yunfei_info}}</span>
									</dd>
								</dl> -->

								<div class="bbctouch-cart-block mt039 shipping_method">
									<text class="shipping_method-title">Método de envío</text>
									<view class="shipping_method-content">
										<p class="shipping-price">{{Number(store_item.yunfei_price)>0?store_item.yunfei_price:'GRATIS'}}</p>
										<p>Entrega estándar</p>
										<p>Su pedido puede llegar entre 1-7 días habiles</p>
									</view>
								</div>

								<view class="dian-sel border-bottom-1px border-top-1px" style="display:none">
									<view class="dain-title">{{$L('配送方式')}}</view>
									<view class="ps-mode">
										<view :class=" dian_type=='exp'?'on ps-item':'ps-item'" data-type="exp" @click="changeDianType">{{$L('普通快递')}}</view>
										<view :class="dian_type=='self'?'on ps-item ':'ps-item '" data-type="self" @click="changeDianType" v-if="detail_info.dian_list">{{$L('上门自提')}}</view>
									</view>
									<view class="express-fee" v-if="store_item.yunfei_price && dian_type=='exp'">{{$L('普通快递')}} <text>{{$L('￥')}}{{store_item.yunfei_price}}</text></view>
									<view class="zt-tip zt-tip-title1" v-if="dian_type=='self'">{{$L('您可以选择离您最近的自提点上门提货，到店自提免运费')}}</view>
									<view class="zt-tip zt-tip-title2" v-if="dian_type=='self'">{{$L('已选自提点：')}}{{store_info.dian_name?store_info.dian_name:''}} <text @tap="showSelectTheme">{{$L('修改')}}</text></view>
								</view>

								<dd class="store-huodong" v-if="store_item.store_mansong_rule_list!= null && store_item.store_mansong_rule_list.desc != null">
									<em class='store-rule-text'>{{$L('满即送')}}</em>
									<text>{{store_item.store_mansong_rule_list.desc}}
										<text v-if="store_item.store_mansong_rule_list.desc.url">，{{$L('送')}}
											<image :src="store_item.store_mansong_rule_list.desc.url"></image>
										</text>
									</text>
								</dd>

								<div class="message">
									<textarea @input="getMessage" :data-vid="store_item.vid" :placeholder="$L('店铺订单留言')" :id="'storeMessage' + store_index"
									 auto-height="true" cursor-spacing="0"></textarea>
								</div>
								<!-- <div class="store-total">
									本店合计
									<span>
										<em id="storeTotal{{store_index}}">{{dian_type=='exp'?store_item.store_goods_total:store_item.store_goods_total-store_item.yunfei_price}}</em>
									</span>元
								</div> -->
							</div>
						</div>
						<view id="store_red_wrap" @tap="hide_store_red" v-if="store_item.red&&store_item.red.length && store_show_flag && select_red_index == store_index">
							<view class="store_red">
								<view class="title">{{$L('使用店铺优惠券')}}</view>
								<scroll-view scroll-y class="store_red_list">
									<view v-for="(reditem, index) in store_item.red" :key="index" class="ticket-item">
										<view class="circle_radio a" :for="'red_id_' + index" :data-id="index">
											<view class="red_item_wrap">
												<s v-if="reditem.red_type == 2"></s>
												<view class="red_h1">
													<text>{{reditem.redinfo_money}}</text> {{$L('元')}}</view>
												<view class="red_h2">
													<view>
														<block v-if="reditem.redinfo_money == reditem.redinfo_full">
															{{reditem.redinfo_full}}{{$L('元直减')}}
														</block>
														<block v-else>
															{{$L('满')}}{{reditem.redinfo_full}}{{$L('减')}}{{reditem.redinfo_money}}
														</block>
													</view>
													<view>
														{{reditem.redinfo_start_text}}-{{reditem.redinfo_end_text}}
													</view>
												</view>
												<view class="red_h3">
													<view class="red_h3_top">
														<image :src="img_url+'ok_w.png'"></image>
														<text>{{$L('您已领券')}}</text>
													</view>
													<view class="red_h3_bottom" :data-store="store_index" :data-name="reditem.redinfo_money" :data-id="reditem.id"
													 @tap="store_red">
														{{store_item.store_red_id==reditem.id?$L('已选择'):$L('点击使用')}}
													</view>
												</view>
											</view>
										</view>
										<view class="line_left"></view>
										<view class="line_right"></view>
										<view class="red_p">
											<text>{{reditem.str}}</text>
											<image :src="img_url+'more.png'"></image>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</block>

				</div>
			</div>
			<!--商品列表End-->

			<div class="bbctouch-cart-block mt039 payment_methods">
				<text class="payment_methods-title">Método de pago</text>
				<view class="payment_methods-content">
					<image style="height:33rpx;width:110rpx;" src="/static/images/payme.jpg"></image>
					<view>
						<text class="payme-bold">Pay-me</text>
						<text>Tarjeta de Crédito / Débito</text>
						<image style="height:33rpx;width:175rpx;" src="/static/images/payments.jpg"></image>
					</view>
				</view>
			</div>
			
			<!--发票信息Begin-->
			<div class="bbctouch-cart-block mt039" @tap.stop="go_inv">
				<a href="javascript:void(0);" class="posr" id="invoice-valve">
					<view class="let_tip">{{$L('发票信息：')}}</view>
					<div class="current-con">
						<p id="invContent" class="invoice_info">{{inv_content}}</p>
					</div>
					<i class="icon-arrow" style="background-image: url(/static/images/arrow_right_b.png);"></i>
				</a>
			</div>
			<!--发票信息End-->

			<!--红包使用Begin-->
			<div id="rptVessel" class="bbctouch-cart-block mt039" style="display: none;">
				<div class="input-box">
					<label>
						<input type="checkbox" class="checkbox" id="useRPT"></input> {{$L('平台红包')}}
						<span class="power">
							<i></i>
						</span>
					</label>
					<p id="rptInfo"></p>
				</div>
			</div>
			<!--红包使用End-->
			<!--底部总金额固定层Begin-->
			<div class="bbctouch-cart-bottom">
				<div class="total">
					<dl class="total-money">
						<dt>{{$L('合计总金额：')}}</dt>
						<!-- <dd>{{$L('￥')}}
					<em id="totalPrice">{{heji>0?heji:0}}</em>
				</dd> -->
						<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(heji)[0]}}</text>.<text>{{filters.toSplit(heji)[1]}}</text></view>
					</dl>
					<!-- <view class="express_money" wx:if="{{all_freight != 0.00}}">快递金额:{{$L('￥')}}{{all_freight}}</view>
			<view class="express_money" wx:else>快递金额:{{$L('￥')}}包邮</view> -->
				</div>
				<div class="check-out ok">
					<view href="javascript:void(0);" id="ToBuyStep2" :data-price="heji" @tap.stop="crear_order">{{$L('提交订单')}}</view>
				</div>
			</div>
			<!--底部总金额固定层End-->
		</view>
		<view class="error-tips" :hidden="is_show_tip==1?false:true">
			{{tip_content}}
		</view>

		<view :class="'select-theme ' + (selectTheme?'show':'')">
			<view class="theme-mask" @tap="hideSelectTheme" @touchmove="touchmove"></view>
			<view class="mask-content">
				<view class="mask-header border-bottom-1px">
					<text>{{$L('自提门店')}}</text>
					<view class="mask-close sld-img-center" @tap="hideSelectTheme">
						<image src="/static/images/pwclose.png" mode="aspectFit"></image>
					</view>
				</view>

				<scroll-view class="theme-main" scroll-y="true" @scrolltolower="getmore">

					<radio-group @change="selectDian" v-if="storeList.length">
						<view v-for="(item, index) in storeList" :key="index" class="theme-list">
							<view class="com-check">
								<radio :id="'theme' + index" :value="item.id" color="#FC1C1C" class="hide"></radio>
								<text :class="'iconfont sld_mxuanzekaobei- ' + (dian_id==item.id?'on':'')"></text>
							</view>
							<view class="border-bottom-1px">
								<label :for="'theme' + index">
									<view class="h4">
										<text>{{item.dian_name}}</text>
										<text class="dis">{{item.juli}}</text>
									</view>
									<view>{{$L('地址：')}}{{item.dian_address}}</view>
									<view v-if="item && item.dian_phone && item.dian_phone[0]">{{$L('电话：')}}{{item.dian_phone[0]}}</view>
								</label>

								<view class="show-map" :data-index="index" @tap="openMap">
									<text class="iconfont sld_mfanhui-"></text>
								</view>
							</view>
						</view>
					</radio-group>

					<view class="empty" v-else>
						<text>{{$L('暂无数据')}}</text>
					</view>

				</scroll-view>

				<button class="confirm-btn" @tap="confirmSel">{{$L('确认')}}</button>
			</view>
		</view>

		<common :title="$L('确认订单')"></common>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
	import {
		run_clock,
		objToStrMap,
		jsonToString,
		mapToJson
	} from "../../utils/common";
	import request from "../../utils/request";
	import {
		tsConfirmOrderInit
	} from "../../utils/tsInit";
	var offpay_hash = '';
	var offpay_hash_batch = ''; //提示事件
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
	}; //获取数据信息
	//获取数据信息
	var get_detail_info = function(goods_data) {
		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=buy&mod=confirm_xcx',
			data: {
				key: goods_data.key,
				cart_id: goods_data.cart_id,
				pin: goods_data.pin,
				team: goods_data.team,
				ifcart: goods_data.ifcart,
				is_bundling: goods_data.is_bundling,
				bl_id: goods_data.bl_id,
				suite: goods_data.suite,
				checked: goods_data.suite_checked,
				type: goods_data.type,
				seckill:goods_data.seckill,
			},
			method: 'GET',
			header: {
				'content-type': 'application/json' // 默认值

			},
			success: function(res) {
				if(res.data.state!=200){
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});
					setTimeout(function() {
						uni.navigateBack()
					}, 2000);
					return false;
				}
				if (res.data.detail_info.ifshow_offpay) {
					goods_data.setData({
						ifshow_offpay: res.data.detail_info.ifshow_offpay
					});
				}

				var total_data_info = goods_data.detail_info;
				var heji = 0;
				var city_id = 0;
				var area_id = 0;
				var has_address = 0; // 优惠券 是否允许使用

				var is_allow_show_red = res.data.detail_info.is_allow_show_red; // 拼团更新头部标题

				if (goods_data.pin) {
					var pin_title = goods_data.team ? goods_data.$L('参加拼团') : goods_data.$L('创建拼团');
					uni.setNavigationBarTitle({
						title: pin_title
					});
				}

				// if (res.data.detail_info.dian_list) {
				// 	goods_data.dainInit();
				// }
				goods_data.setData({
					is_allow_show_red: is_allow_show_red
				});

				if (res.data.detail_info.address_info.address_id > 0) {
					has_address = 1;
				} else {
					//用户没有设置收货地址的情况，点击确定 强制去添加收货地址，然后再返回这一页
					uni.showModal({
						title: '',
						content: goods_data.$L('您还没有收货地址，请先设置！'),
						cancelText:goods_data.$L('取消'),
						confirmText:goods_data.$L('确定'),
						success: function(res) {
							if (res.confirm) {
								//点击确定需要新增地址
								uni.navigateTo({
									url: '../addaddress/addaddress?form=1'
								});
							} else {
								uni.navigateBack({});
							}
						}
					});
					goods_data.setData({
						user_address: []
					});
				}

				var invoiceid = 0;

				if (typeof res.data.detail_info.inv_info.inv_id != "undefined") {
					invoiceid = res.data.detail_info.inv_info.inv_id;
				}

				var vathash = res.data.detail_info.vat_hash;
				var freighthash = res.data.detail_info.freight_hash;

				if (goods_data.city_id == 0) {
					goods_data.setData({
						user_address: res.data.detail_info.address_info
					});
				}

				let detail_info = res.data.detail_info;
			
				for (let i in detail_info.store_cart_list) {
					let el = detail_info.store_cart_list[i];
					el.store_red = goods_data.$L('点击选择');
					el.store_red_id = '';
				}
				goods_data.setData({
					detail_info: detail_info,
					go_address: has_address,
					invoice_id: invoiceid,
					vat_hash: vathash,
					freight_hash: freighthash
				}); // 推手相关处理

				let tsGids = []; //计算每个店铺的总结（总价-满减的优惠，再跟运费结合起来，最后要计算合计总金额）

				for (var t in res.data.detail_info.store_cart_list) {
					var storetotal_money = res.data.detail_info.store_cart_list[t].store_goods_total * 1; //如果有满送活动，如果满足了条件的话  就用商品总价减去满送的价格

					if (res.data.detail_info.store_cart_list[t].store_mansong_rule_list != null) {
						var mansong_info = goods_data.$L('满即送-满') + res.data.detail_info.store_cart_list[t].store_mansong_rule_list.price + '-' +
							res.data.detail_info.store_cart_list[t].store_mansong_rule_list.discount;
						res.data.detail_info.store_cart_list[t].mansong_info = mansong_info;
						storetotal_money = storetotal_money * 1 - parseFloat(res.data.detail_info.store_cart_list[t].store_mansong_rule_list
							.discount);
					}

					res.data.detail_info.store_cart_list[t].store_goods_total = storetotal_money.toFixed(2);

					if (res.data.detail_info.store_cart_list[t].freight == 0) {
						res.data.detail_info.store_cart_list[t].yunfei_info = res.data.detail_info.store_cart_list[t].freight_message;
					} //计算合计总金额


					heji += parseFloat(storetotal_money);
					res.data.detail_info.store_cart_list[t].goods_list.map(el => {
						tsGids.push(el.gid);
					});
				} // 推手相关处理


				tsConfirmOrderInit(tsGids, goods_data); //计算运费

				if (goods_data.area_id == 0) {
					city_id = res.data.detail_info.address_info.city_id;
					area_id = res.data.detail_info.address_info.area_id;
				} else {
					city_id = goods_data.city_id;
					area_id = goods_data.area_id;
				}

				goods_data.setData({
					area_id: area_id,
					city_id: city_id
				});

				if (has_address == 1) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=buy&mod=change_address_xcx',
						data: {
							key: goods_data.key,
							freight_hash: freighthash,
							city_id: city_id,
							area_id: area_id
						},
						dataType: 'json',
						success: function(result) {
							if (result.data.state == 200) {
								if (result.data.info.content) {
									for (var i in result.data.info.content) {
										res.data.detail_info.store_cart_list[i].yunfei_price = parseFloat(result.data.info.content[i]).toFixed(
											2); //如果运费大于0,且不为上门自提 则需要变动店铺的总价和合计的价格

										let {
											dian_type
										} = goods_data;

										if (parseFloat(result.data.info.content[i]).toFixed(2) > 0) {
											res.data.detail_info.store_cart_list[i].store_goods_total = res.data.detail_info.store_cart_list[i].store_goods_total *
												1 + parseFloat(result.data.info.content[i]).toFixed(2) * 1;
											heji += parseFloat(result.data.info.content[i]).toFixed(2) * 1;
										}
									}

									var all_freight = 0.00; //计算整个订单的总运费

									Object.keys(result.data.info.content).forEach(function(key) {
										all_freight += result.data.info.content[key];
										goods_data.setData({
											all_freight: parseFloat(all_freight).toFixed(2)
										});
									});
								}

								offpay_hash = result.data.info.offpay_hash;
								offpay_hash_batch = result.data.info.offpay_hash_batch; // 积分抵扣信息

								let points_max_use = res.data.detail_info.points_max_use * 1;
								let member_points = res.data.detail_info.member_points * 1;
								let points_purpose_rebate = res.data.detail_info.points_purpose_rebate * 1;
								let member_can_use_points = res.data.detail_info.member_can_use_points * 1;
								let pointsInfo = {
									points_max_use,
									// 积分转换货币 最大比例
									member_points,
									// 用户积分
									points_purpose_rebate,
									// 积分兑换金额比例
									member_can_use_points,
									member_max_decfee: res.data.detail_info.member_max_decfee
								};
								let total_price = heji / 100 * points_max_use;
								pointsInfo.max_use_points = member_points > total_price * points_purpose_rebate ? parseInt(
									member_can_use_points) : member_points; // 最多可使用积分

								pointsInfo.pointsToMoney = (pointsInfo.max_use_points / points_purpose_rebate).toFixed(2); //  最大抵扣金额
								// 切换地址后，积分开启的情况下计算积分

								if (goods_data.isUsePoints) {
									heji = heji - goods_data.points_price * 1;
								}

								goods_data.setData({
									detail_info: res.data.detail_info,
									heji: heji.toFixed(2),
									noredheji: heji,
									offpay_hash: offpay_hash,
									offpay_hash_batch: offpay_hash_batch,
									pointsInfo: pointsInfo,
									is_chage_addr: false
								});
								if (goods_data.is_allow_show_red && goods_data.detail_info && (uni.getStorageSync('use_red') >= 0 || uni
										.getStorageSync(
											'use_red') == 'none')) {
									goods_data.cacelPrice()
								}
							} else {
								errorTipsShow(goods_data, goods_data.$L('地址信息错误'));
							}
						}
					});
				}
			}
		});
	};

	export default {
		data() {
			return {
				key: '',
				//用户标识
				ifcart: '',
				//来源是否是购物车
				cart_id: '',
				//
				heji: 0.00,
				pay_name: 'online',
				go_address: 0,
				user_address: '',
				//提交订单使用的收货地址
				inv_content: this.$L('不需要发票'),
				red_content: this.$L('不使用'),
				invoice_id: 0,
				//发票id
				area_id: 0,
				city_id: 0,
				invoice_id: 0,
				vat_hash: '',
				freight_hash: '',
				heji: 0,
				//合计总金额
				noredheji: 0,
				// 不算优惠券的合计
				mansong_info: '',
				//用于页面显示的满送信息
				tip_content: '',
				//错误提示内容
				is_show_tip: 0,
				no_address: 0,
				red_current: 'none',
				is_allow_show_red: 1,
				is_bundling: 0,
				bl_id: 0,
				suite: 0,
				suite_checked: '',
				pin: 0,
				team: 0,
				ifshow_offpay: false,
				// 是否显示货到付款
				pay_mode: 'online',
				// 选择的支付方式
				showPayMode: false,
				store_show_flag: false,
				points_num: 0,
				// 使用的积分
				points_price: 0,
				isUsePoints: false,
				pointsInfo: {},
				// 关于使用积分的相关信息
				markgid: 0,
				// 推手的相关信息
				spreader: '',
				dian_id: '',
				// 自提选择的门店id
				dian_type: 'exp',
				// 门店选择的配送方式，exp：普通快递，self: 自提
				selectTheme: false,
				// 选择门店弹窗 控制
				selectItem: {},
				// 已选的门店信息
				msgList: {},
				live_id: '',
				// 直播id
				img_url: getApp().globalData.img_url,
				//图片地址
				is_chage_addr: false,
				//图片地址
				all_freight: 0.00 //总运费
					,
				detail_info: "",
				offpay_hash: "",
				offpay_hash_batch: "",
				gid: "",
				type: "",
				select_red_index: "",
				lng: "",
				lat: "",
				storeList: "",
				store_info:'',
				order_from:'',
				from:'',
				seckill:0,
				fromApply:false
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('确认订单')
      });
			var ifcart = 0;
			var cart_id = '';

			if (options.ifcart == 1) {
				ifcart = 1;
				cart_id = options.cart_id;
			} else {
				cart_id = options.gid + '|' + options.buynum;
			}
            if (options.from=='apply') {
				this.setData({
					fromApply: true
				});
			}
			if (options.markgid) {
				this.setData({
					markgid: options.markgid
				});
			}

			var type = '';

			if (options.cart_id) {
				cart_id = options.cart_id;
				type = options.type;
			}

			if (options.pin) {
				this.setData({
					pin: options.pin
				});

				if (options.team) {
					this.setData({
						team: options.team
					});
				}
			}

			if (options.gid) {
				this.setData({
					gid: options.gid
				});
			}

			if (options.live_id) {
				this.setData({
					live_id: options.live_id
				});
			} // 优惠套装 产品组合 


			if (options.bl_id) {
				this.setData({
					is_bundling: 1,
					bl_id: options.bl_id
				});
			} else if (options.suite && options.suite) {
				this.setData({
					suite: options.suite,
					suite_checked: options.checked
				});
			} //获取用户的key值


			var key = uni.getStorageSync('token');
			
			

			if (key) {
				//将可以存到data里
				this.setData({
					key: key,
					ifcart: ifcart,
					cart_id: cart_id,
					type: type
				});
			} else {
				getApp().globalData.goLogin();
			} // 获取店铺和商品的信息
            
			//立即秒杀
			if(options.seckill){
				this.seckill = options.seckill;
			}
             

			// get_detail_info(this);
		},
		onShow: function() {
			if(uni.getStorageSync('store_info')){
				this.dian_type='self'
				this.store_info=uni.getStorageSync('store_info')
			}
			get_detail_info(this)
			if (uni.getStorageSync('has_sele_inv') == 1) {
				var is_need_inv = uni.getStorageSync('is_need_inv');
				var con = '';
				let inv_id = '';

				if (is_need_inv == 1) {
					con = uni.getStorageSync('sele_inv_con');
					inv_id = uni.getStorageSync('sele_inv_id');
				} else {
					con = this.$L('不需要发票');
				}
				
				this.setData({
					inv_content: con,
					invoice_id: inv_id
				}); //必须要清空选择的地址的相关缓存

			} // 关于红包的处理
			this.cacelPrice()
			if (this.is_chage_addr) {
				// 选择完地址重新 获取店铺和商品的信息
				get_detail_info(this);
			}
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function(e) {
		},

		onUnload() {
			uni.removeStorage({
				key: 'use_red'
			});
			uni.removeStorage({
				key: 'use_red_con'
			});
		},

		methods: {
			//进入地址列表
			go_address_list: function() {
				uni.navigateTo({
					url: '../address/address?form=1&address_id=' + this.user_address.address_id
				});
			},
			//发票信息
			go_inv: function() {
				var zengzhi = 0;

				if (this.detail_info.vat_deny != 1) {
					zengzhi = 1;
				}

				uni.navigateTo({
					url: '../inv/inv?zengzhi=' + zengzhi
				});
			},
			getMessage: function(e) {
				const vid = e.currentTarget.dataset.vid;
				let {
					msgList
				} = this;
				msgList[vid] = e.detail.value;
				this.setData({
					msgList: msgList
				});
			},
			//提交订单（生成订单）
			crear_order: function(e) {
				uni.showLoading({
					title: this.$L('提交订单中'),
					mask:true
				})
				var creat_data = this;
				var cart_data = this;
				var now_red_lists = uni.getStorageSync('red_content_now');
				var red_index = creat_data.red_current;
				var item_use_red = now_red_lists[red_index] ? now_red_lists[red_index].id : '';
				var ifshow_offpay = this.ifshow_offpay;
				var pay_mode = this.pay_mode;
				var detail_info = this.detail_info.store_cart_list;
				var vred = [];
				let pay_message = '';
				const {
					msgList
				} = this;

				for (let i in msgList) {
					if (i && msgList[i]) {
						pay_message += `${i}|${msgList[i]},`;
					}
				}

				for (let k in detail_info) {
					let el = detail_info[k];

					if (el.store_red_id) {
						vred.push(Number(el.store_red_id));
					}
				}

				if (ifshow_offpay && pay_mode == 'offline') {
					uni.showModal({
						title: creat_data.$L('提示'),
						content: creat_data.$L('确认使用货到付款方式吗'),
						cancelText:creat_data.$L('取消'),
						confirmText:creat_data.$L('确定'),
						success: function(res) {
							if (res.confirm) {
								con(creat_data);
							}
						}
					});
				} else {
					con(creat_data);
				}

				function con(_this) {
					// #ifdef H5
					_this.order_from = 2
					_this.from='wap'
					// #endif
					
					// #ifdef APP-PLUS
					switch (uni.getSystemInfoSync().platform) {
						case 'android':
							_this.order_from = 5
							_this.from='andriod'
							break;
						case 'ios':
							_this.order_from = 4
							_this.from='ios'
							break;
						default:
							console.log('运行在开发者工具上')
							break;
					}
					// #endif
					
					// #ifdef MP
					_this.order_from = 3
					_this.from='weixin_xcx'
					// #endif
					let {
						live_id
					} = _this;
					if (creat_data.user_address.address_id > 0) {
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=buy&mod=submitorder_xcx',
							data: {
								key: creat_data.key,
								ifcart: creat_data.ifcart,
								cart_id: creat_data.cart_id,
								address_id: creat_data.user_address.address_id,
								vat_hash: creat_data.vat_hash,
								offpay_hash: creat_data.offpay_hash,
								offpay_hash_batch: creat_data.offpay_hash_batch,
								pay_name: cart_data.pay_mode,
								invoice_id: creat_data.invoice_id,
								voucher: '',
								pd_pay: 0,
								//是否使用预存款支付 1-使用 0-不使用
								password: '',
								//用户密码，启动预存款支付时需要提交
								fcode: '',
								rcb_pay: '',
								rpt: '',
								pay_message: '',
								red: item_use_red,
								is_bundling: creat_data.is_bundling,
								bl_id: creat_data.bl_id,
								suite: creat_data.suite,
								checked: creat_data.suite_checked,
								pin: creat_data.pin,
								team_id: creat_data.team,
								type: creat_data.type,
								vred: vred.join(','),
								markgid: creat_data.markgid,
								use_points: creat_data.points_num,
								points_pay: creat_data.isUsePoints ? 1 : 0,
								spreader: creat_data.spreader,
								dian_id: creat_data.dian_type == 'self' && creat_data.store_info.id ? creat_data.store_info.id : '',
								pay_message: pay_message,
								live_id: live_id,
								order_from : _this.order_from,
								from:_this.from,
								seckill:_this.seckill,
								is_spreader_buy:_this.fromApply?1:''
							},
							header: {
								'content-type': 'application/json' // 默认值

							},
							success: function(res) {
								if (res.data.state == 200) {
									uni.hideLoading()
									//成功的话去支付订单
									let price = e.currentTarget.dataset.price;
									let pay_sn = res.data.pay_sn;
									let pcode = res.data.payment_code;

									if (pcode == 'offline') {
										uni.redirectTo({
											url: '/pages/order/order'
										});
									} else {
										if (pay_sn) {
											let url = res.data.total == 0 ? '/pages/order/order' : '/pages/pay/pay?sn=' + pay_sn + '&price=' + price;
											uni.redirectTo({
												url: url
											});
										}
									}
								} else {
									uni.hideLoading()
									if (res.data.msg) {
										errorTipsShow(cart_data, res.data.msg);
									} else {
										errorTipsShow(cart_data, res.data.datas.error);
									}
								}
							}
						});
					} else {
						errorTipsShow(creat_data, creat_data.$L('收货地址不可为空！'));
					}
				}
			},
			// 使用红包界面
			go_red: function(e) {
				var key = this.key;
				var red_list = this.detail_info.red; // var red_list_json = jsonToString(mapToJson(objToStrMap(red_list)));

				var red_current = this.red_current; // 存储到本地

				var store_key_red_name = 'red_list_confrim';
				var store_key_current = 'current_confrim';
				uni.setStorageSync(store_key_red_name, red_list);
				uni.setStorageSync(store_key_current, red_current);
				uni.navigateTo({
					url: '../red/red_use'
				});
			},

			//货到付款
			showPayModeFun() {
				var offline = this.ifshow_offpay;
				if (!offline) return;
				this.setData({
					showPayMode: true
				});
			},

			changePayMode(e) {
				this.setData({
					pay_mode: e.detail.value,
					showPayMode: false
				});
			},

			// 店铺优惠券
			store_red(e) {
				let store = e.currentTarget.dataset.store;
				let id = e.currentTarget.dataset.id;
				let name = parseFloat(e.currentTarget.dataset.name);
				let store_cart_list = this.detail_info.store_cart_list;
				let heji = this.heji;
				if (store_cart_list[store].store_red_id == id) {
					store_cart_list[store].store_red_id = '';
					store_cart_list[store].store_red = this.$L('点击选择');
					store_cart_list[store].store_goods_total = parseFloat(store_cart_list[store].store_goods_total) + name;
				} else {
					let price = store_cart_list[store].old_store_goods_total ? store_cart_list[store].old_store_goods_total :
						store_cart_list[store].store_goods_total * 1;

					if (parseInt(name) > parseInt(price)) {
						uni.showToast({
							title: this.$L('该优惠券无法使用'),
							icon: 'none'
						});
						return;
					}
					store_cart_list[store].store_red_id = id;
					store_cart_list[store].store_red = `${name}${this.$L('元优惠券')}`;
					store_cart_list[store].old_store_goods_total = parseFloat(price).toFixed(2);
					store_cart_list[store].store_goods_total = (parseFloat(price) - name).toFixed(2);
				}
				this.setData({
					'detail_info.store_cart_list': store_cart_list,
					store_show_flag: false
				});
				this.cacelPrice();
			},

			// 店铺优惠券显示
			show_store_red(e) {
				//多店铺选择优惠券 显示当前
				let {
					index
				} = e.currentTarget.dataset;
				this.setData({
					store_show_flag: true,
					select_red_index: index
				});
			},

			// hide
			hide_store_red(e) {
				if (e.target.id == 'store_red_wrap') {
					this.setData({
						store_show_flag: false
					});
				}
			},

			closePayMode(e) {
				if (e.target.id == 'pay_wrap') {
					this.setData({
						showPayMode: false
					});
				}
			},

			// 切换收货地址
			addr(info) {
				let city_id = info.city_id;
				let area_id = info.area_id;
				this.setData({
					user_address: info,
					city_id,
					area_id,
					is_chage_addr: true
				});

				if (this.isUsePoints) {
					this.cacelPrice();
				}
			},

			// 显示 使用积分
			showUsePoints(e) {
				this.setData({
					isUsePoints: e.detail.value
				});
				this.cacelPrice();
			},

			// 使用积分
			usePointsChange(e) {
				let val = e.detail.value;
				const reg = /^[0-9]+$/;
				const {
					pointsInfo
				} = this;
				if (reg.test(val) && parseFloat(val.charAt(0)) > 0) {
					if (val >= pointsInfo.max_use_points) {
						val = pointsInfo.max_use_points;
					} else if (val <= 0) {
						val = 0;
					}
				} else {
					val = '';
				}
				let _this = this;
				setTimeout(() => {
					_this.points_num = val;
					_this.cacelPointsPrice();
				}, 0);
			},

			// 计算积分抵扣价格
			cacelPointsPrice() {
				const {
					pointsInfo,
					points_num
				} = this;
				let points_price = (points_num / pointsInfo.points_purpose_rebate).toFixed(2);
				this.setData({
					points_price: points_price
				});
				this.cacelPrice();
			},

			// 使用优惠券或积分之后重新计算价格
			cacelPrice() {
				let {
					points_price,
					detail_info,
					isUsePoints,
					pointsInfo,
					dian_type
				} = this; // 店铺优惠券

				let sum = 0;
				let freight = 0;
				let store_cart_list = detail_info.store_cart_list;
				for (let j in store_cart_list) {
					sum = (parseFloat(sum) + parseFloat(store_cart_list[j].store_goods_total)).toFixed(2);
					if (dian_type == 'self') {
						// 如果是上门自提，需要减去运费
						sum -= store_cart_list[j].yunfei_price * 1;
					}

					freight += store_cart_list[j].yunfei_price * 1;
				} // 平台优惠券
				var current = uni.getStorageSync('use_red');
				var con_data = uni.getStorageSync('use_red_con');
				uni.setStorageSync('red_content_now', con_data);
				if (current >= 0 && con_data[current]) {
					var con_data = uni.getStorageSync('use_red_con');
					var con = con_data[current].redinfo_money + this.$L('元优惠券');
					sum = sum - con_data[current].redinfo_money;
					sum = sum<0?0:sum;
				} else {
					var con = this.$L('不使用');
				}

				let s = (sum - freight) / 100 * pointsInfo.points_max_use;
				let max_use_points = s > pointsInfo.member_points ? pointsInfo.member_points : s > pointsInfo.member_can_use_points ?
					pointsInfo.member_can_use_points : Math.floor(s);
				max_use_points = max_use_points > 0 ? max_use_points : 0;
				let pointsToMoney = max_use_points / pointsInfo.points_purpose_rebate;
				pointsInfo.max_use_points = max_use_points;
				pointsInfo.pointsToMoney = pointsToMoney;

				if (sum - freight - points_price * 1 < 0) {
					let newP = Math.floor((sum - freight) * pointsInfo.points_purpose_rebate);
					newP = newP < 0 ? 0 : newP;
					points_price = newP / pointsInfo.points_purpose_rebate;
					this.setData({
						points_price: points_price,
						points_num: newP
					});
				} // 积分抵扣


				if (isUsePoints) {
					sum = sum - points_price;
				}

				sum = (sum * 1).toFixed(2);
				var that = this
				setTimeout(() => {
					that.red_content = con,
						that.red_current = current,
						that.heji = sum,
						that.pointsInfo = pointsInfo

				}, 0)
			},

			// 门店
			dainInit() {
				this.getLocation();
			},

			// 定位
			getLocation() {
				uni.getLocation({
					success: res => {
						let lng = res.longitude;
						let lat = res.latitude;
						this.setData({
							lng: lng,
							lat: lat
						});
						this.getStoreList();
					}
				});
			},

			// 获取门店列表
			getStoreList() {
				let {
					key,
					lng,
					lat,
					gid,
					detail_info
				} = this;
				if (!gid) {
					gid = [];

					for (let i in detail_info.store_cart_list) {
						let store = detail_info.store_cart_list[i];
						store.goods_list.forEach(el => {
							gid.push(el.gid);
						});
					}

					gid = gid.join(',');
				}

				let params = {
					page: 10,
					pn: this.pn,
					isgaode: 0,
					key: key,
					gid: gid
				};

				if (lng) {
					params.lng = lng;
				}

				if (lat) {
					params.lat = lat;
				}

				request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=get_dians_by_gid',
					data: params
				}).then(res => {
					if (res.code == 200) {
						let list = res.datas.data;

						if (this.pn != 1) {
							let {
								storeList
							} = this;
							list = storeList.concat(list);
						}

						this.setData({
							storeList: list
						});

						if (res.hasmore) {
							this.pn++;
						} else {
							this.hasmore = true;
						}
					}
				});
			},

			getmore() {
				if (this.hasmore) {
					this.getStoreList();
				}
			},

			changeDianType(e) {
				let {
					dian_type
				} = this;
				let new_type = e.currentTarget.dataset.type;
				
				if (dian_type == new_type) return;
                 console.log(new_type)
				if (new_type == 'self') {
					// this.showSelectTheme();
					if(this.type == 'buyagain') {
						let cart_again = JSON.parse(this.cart_id);
						if(!this.gid){
							this.gid = cart_again[0].gid;
						}
						
					}
					let id = this.gid ? this.gid : this.cart_id.split('|')[0];
					uni.navigateTo({
						url:'../selectStore/selectStore?gid='+id
					})
				} else {
					//删除本地门店信息缓存
					if(uni.getStorageSync('store_info')){
						uni.removeStorage({
							key:'store_info'
						})
					}
					this.setData({
						dian_type: new_type
					});
					this.dian_type=new_type
					this.cacelPrice();
				}
			},

			showSelectTheme() {
				uni.navigateTo({
					url:'../selectStore/selectStore?gid='+this.gid
				})
			},

			hideSelectTheme() {
				this.setData({
					selectTheme: false
				});
			},

			touchmove() {
				return false;
			},

			selectDian(e) {
				let id = e.detail.value;
				const {
					storeList
				} = this;
				let item = storeList.filter(el => el.id == id)[0];
				this.setData({
					dian_id: id,
					selectItem: item
				});
			},

			confirmSel() {
				if (this.dian_id) {
					this.setData({
						dian_type: 'self'
					});
					this.cacelPrice(); // 重新计算价格
				}

				this.hideSelectTheme();
			},

			openMap(e) {
				let index = e.currentTarget.dataset.index;
				const {
					storeList
				} = this;
				const target = storeList[index];
				uni.openLocation({
					latitude: target.dian_lat * 1,
					longitude: target.dian_lng * 1,
					name: target.dian_name,
					address: target.dian_address
				});
			}

		}
	};
</script>
<style>
	@import "../templates/wxss/red.css";

	page {
		width: 750rpx;
		min-height: 100vh;
		background-color: #f0f2f5;
		margin: 0 auto;
	}

	.bbctouch-main-layout {
		display: block;
		width: 750rpx;
		min-height: 100vh;
		overflow-y: scroll;
		overflow-x: hidden;
		background-color: #f0f2f5;
	}

	.bbctouch-cart-add-default {
		width: 100%;
		display: block;
		a {
			display:flex;
			gap:20rpx;
			color: #2d2d2d;
			font-size: 24rpx;
			padding: 20rpx; 
		}
		#true_name{
			font-weight:bold;
			font-size: 32rpx;
		}
		#mob_phone {
			line-height: 50rpx;
		}
		#user_address{
		}
		image{
			width: 30rpx;
			height: 30rpx;
		}
	}
	.payment_methods{
		padding: 20rpx;
	}
	.payment_methods-title{
		color: #2d2d2d;
		font-weight: bold;
		font-size: 32rpx;	
	}
	.payment_methods-content{
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
		align-items:center;
		image{

		}
		text{
			display:block;
			font-size: 26rpx;
			color: #2d2d2d;
		}
		.payme-bold{
			font-weight:bold;
		}
	}
	.cart-items{
		background: #fff;
		padding: 20rpx;
	}
	.cart-title{
		color: #2d2d2d;
		font-weight: bold;
		font-size: 32rpx;	
	}

	.shipping_method{
		padding: 20rpx;
	}	
	.shipping_method-title{
		color: #2d2d2d;
		font-weight: bold;
		font-size: 32rpx;
	}
	.shipping_method-content{
		font-size: 26rpx;
		border: 1px solid #1e2a74;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}
	.shipping-price{
		font-weight: bold;
		color: #2d2d2d;
	}

	.hide {
		display: none !important;
	}

	.bbctouch-full-mask {
		position: fixed;
		z-index: 19;
		top: 0;
		bottom: 0;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		height: 100%;
	}

	.bbctouch-full-mask-bg {
		display: block;
		position: absolute;
		z-index: 11;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
	}

	.bbctouch-full-mask-block {
		display: block;
		position: absolute;
		z-index: 12;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f5f5f5;
		box-shadow: -12rpx 0 10rpx rgba(0, 0, 0, 0.2);
		overflow-y: scroll;
	}

	header,
	.header {
		background: #f8f8f8;
		height: 90rpx;
		position: absolute;
		z-index: 8;
		top: 0;
		left: 0;
		right: 0;
		bottom: auto;
		border-bottom: solid 0.05rem #eee;
	}

	.header-wrap {
		display: block;
		width: 750rpx;
		margin: 0 auto;
		text-align: center;
	}

	.header-wrap {
		position: relative;
	}

	.header-wrap {
		height: 90rpx;
		position: relative;
		background-size: 100% 88rpx;
		min-height: 88rpx;
	}

	.header-l {
		display: block;
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.header-l a {
		position: relative;
		z-index: 1;
		display: inline-block;
		width: 46rpx;
		height: 46rpx;
		padding: 22rpx;
	}

	.header-l a i.back {
		width: 80%;
		height: 80%;
		margin: 10%;
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: 100%;
		opacity: 0.75;
	}

	.header-title {
		display: inline-block;
		margin: 0 auto;
	}

	.header-title h1 {
		font-size: 33rpx;
		line-height: 90rpx;
		height: 90rpx;
		color: #252525;
	}

	.bbctouch-cart-add-list {
		background: #fff;
	}

	.mt10 {
		margin-top: 1rem !important;
	}

	.btn-l {
		display: inline-block;
		width: 90%;
		margin: 0 5%;
		font-size: 30rpx;
		line-height: 79rpx;
		text-align: center;
		color: #fff;
		background: #f23030;
		border-radius: 10rpx;
		margin-bottom: 46rpx;
	}

	.bbctouch-full-mask {
		position: fixed;
		z-index: 19;
		top: 0;
		bottom: 0;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		height: 100%;
	}

	.bbctouch-full-mask-bg {
		display: block;
		position: absolute;
		z-index: 11;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
	}

	.bbctouch-full-mask-block {
		display: block;
		position: absolute;
		z-index: 12;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f5f5f5;
		box-shadow: -12rpx 0 10rpx rgba(0, 0, 0, 0.2);
		overflow-y: scroll;
	}

	header,
	.header {
		background: #f8f8f8;
		height: 90rpx;
		position: absolute;
		z-index: 8;
		top: 0;
		left: 0;
		right: 0;
		bottom: auto;
		border-bottom: solid 1rpx #eee;
	}

	.mt039 {
		margin-top: 18rpx;
	}

	.bbctouch-cart-block {
		background: #fff;
		display: block;
		border-top: 1rpx solid #eee;
		position: relative;
	}

	.bbctouch-cart-block a {
		display: flex;
		overflow: hidden;
		justify-content: space-between;
		align-items: center;
	}

	.bbctouch-cart-block .let_tip {
		z-index: 1;
		display: block;
		min-width: 230rpx;
		font-size: 28rpx;
		color: #262629;
		padding: 23rpx;
	}

	.bbctouch-cart-block .current-con {
		display: block;
		margin: 0 69rpx 0 0rpx;
		padding: 23rpx 0;
		text-align: right;
		font-size: 28rpx;
		color: #333;
		max-width: 370rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.bbctouch-cart-block i.icon-arrow {
		position: absolute;
		z-index: 1;
		top: 50%;
		right: 23rpx;
		display: block;
		width: 23rpx;
		height: 23rpx;
		margin-top: -12rpx;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 100%;
		opacity: 0.5;
	}

	.error-tips {
		background-color: rgba(255, 255, 255, 0.95);
		border: solid 1rpx #ccc;
		padding: 37rpx 28rpx;
		text-align: center;
		border-radius: 10rpx;
		position: fixed;
		z-index: 9999;
		top: 40%;
		left: 15%;
		right: 15%;
		color: #333;
		font-size: 33rpx;
		line-height: 46rpx;
		box-shadow: 0 0 46rpx rgba(0, 0, 0, 0.15);
	}

	.bbctouch-cart-bottom {
		position: fixed;
		z-index: 50;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 0 auto;
		height: 98rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	.bbctouch-cart-bottom .total {
		display: block;
		float: left;
	}

	.bbctouch-cart-bottom .total-money {
		font-size: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
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

	.bbctouch-cart-bottom .check-out.ok {
		background-color: #000;
		padding: 10rpx 40rpx;
		border-radius: 20rpx;
	}

	.bbctouch-cart-bottom .check-out {
		background-color: #bbb;
	}

	.bbctouch-cart-bottom .check-out #ToBuyStep2 {
		font-size: 30rpx;
		color: #fff;
	}

	.bbctouch-cart-container {
		display: block;
		clear: both;
		margin-bottom: 18rpx;
		position: relative;
	}

	.bbctouch-cart-store {
		display: flex;
		position: relative;
	}

	.bbctouch-cart-store dt {
		position: relative;
		z-index: 1;
		display: block;
		height: 84rpx;
		padding: 23rpx;
		font-size: 28rpx;
		line-height: 42rpx;
		color: #252525;
	}

	.bbctouch-cart-store dt.flex-row {
		display: flex;
		align-items: center;
	}
	.bbctouch-cart-store .icon-store_dt{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 550rpx;
	}

	.bbctouch-cart-store dt .icon-store {
		width: 37rpx;
		height: 0;
		opacity: 0.8;
		margin-right: 15rpx;
	}

	.bbctouch-cart-store:after {
		height: 2rpx;
		content: '';
		width: 100%;
		border-top: 2rpx solid #e3e5e9;
		position: absolute;
		bottom: -2rpx;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.bbctouch-cart-item {
		background-color: #fff;
		display:flex;
		width:100%;
		flex-direction:column;
		gap: 20rpx;
	}

	.bbctouch-cart-item li {
	}
	.buy-item{
		display: flex;
		gap: 20rpx;
		align-items:center;
		box-sizing: border-box;
	}
	.bbctouch-cart-item .buy-item .goods-pic {
		left: 23rpx;
	}

	.bbctouch-cart-item li .goods-pic {
		display: block;
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		top: 23rpx;
		left: 74rpx;
	}

	.bbctouch-cart-item li .goods-pic a {
		display: block;
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		display: table-cell;
		vertical-align: middle;
		font-size: 0;
		line-height: 0;
	}

	.bbctouch-cart-item li .goods-pic a image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
	}

	/* .bbctouch-cart-item li .goods-pic:after {
  position: absolute;
  top: -1rpx;
  left: -1rpx;
  width: 200%;
  height: 200%;
  content: '';
  border: 2rpx solid #e3e5e9;
  border-radius: 12rpx;
  -webkit-border-radius: 6px;
  transform: scale(0.5);
  -webkit-transform: scale(0.5);
  -webkit-transform: scale(0.5);
  transform-origin: top left;
  -webkit-transform-origin: top left;
} */

	.bbctouch-cart-item li .goods-info {
		/* display: block;
  vertical-align: top;
  height: 102rpx; */
		/* margin: 0 92rpx 0 207rpx; */
		/* position: relative; */
		/* z-index: 1; */
	}

	.bbctouch-cart-item .buy-item .goods-info {
		/* margin: 0 23rpx 0 161rpx; */
	}

	.bbctouch-cart-item li .goods-info dt.goods-name {
		display: block;
	}

	.bbctouch-cart-item li .goods-info dt.goods-name a {
		display: block;
		font-size: 26rpx;
		color: #232326;
		line-height: 33rpx;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.bbctouch-cart-item li .goods-info dd.goods-type {
		overflow: hidden;
		white-space: nowrap;
		font-size: 21rpx;
		color: #999;
		text-overflow: ellipsis;
	}

	.bbctouch-cart-item .buy-item .goods-subtotal {
		/* margin: 0 23rpx 0 161rpx; */
		/* margin-top: 49rpx; */
	}

	.bbctouch-cart-item li .goods-subtotal {
		display: flex;
		gap: 20rpx;
		align-items: center;
		font-size: 28rpx;
		color: #2d2d2d;
	}

	.bbctouch-cart-item li .goods-subtotal .goods-price {
		
	}

	.bbctouch-cart-item li .goods-subtotal .goods-price em {
		
	}

	.bbctouch-cart-item li .goods-num {
		font-size: 28rpx;
		line-height: 46rpx;
		position: absolute;
		z-index: 1;
		top: 125rpx;
		right: 46rpx;
		color: #262629;
	}

	.bbctouch-cart-item li .goods-num em {
		font-size: 28rpx;
		color: #262629;
	}

	.bbctouch-cart-item .buy-item .notransport {
		position: absolute;
		z-index: 3;
		top: 0;
		left: -23rpx;
		right: 0;
		bottom: 0;
		display: none;
		text-align: center;
		filter: progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#E5F5F5F5', endColorstr='#E5F5F5F5');
		background: rgba(245, 245, 245, 0.9);
	}

	.bbctouch-cart-item .buy-item .notransport p {
		margin-top: 69rpx;
		font-size: 33rpx;
		line-height: 46rpx;
		color: #ed5564;
	}

	.bbctouch-cart-item li:last-child:after {
		content: '';
		width: 0;
		border-top: 0;
		position: absolute;
		bottom: 0px;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.bbctouch-cart-item li:after {
		height: 2rpx;
		content: '';
		width: 100%;
		border-top: 2rpx solid #e3e5e9;
		position: absolute;
		bottom: 0px;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.bbctouch-cart-subtotal dt {
		position: absolute;
		z-index: 1;
		top: -8rpx;
		left: 23rpx;
		display: block;
		width: 50%;
		height: 46rpx;
		font-size: 28rpx;
		color: #262629;
	}

	.bbctouch-cart-subtotal dl {
		position: relative;
		z-index: 1;
		padding: 19rpx 0 0;
		font-size: 0;
		display: block;
	}

	.bbctouch-cart-subtotal dd {
		height: 46rpx;
		/* margin: 0 23rpx 0 50%; */
		margin-right: 23rpx;
		text-align: right;
		font-size: 28rpx;
		line-height: 46rpx;
		color: #262629;
		display: block;
	}

	.bbctouch-cart-subtotal .message {
		position: relative;
		z-index: 1;
		display: block;
		/* height: 74rpx; */
		padding: 19rpx 0;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.bbctouch-cart-subtotal .message textarea {
		display: block;
		width: 91%;
		height: 72rpx!important;
		padding: 2%;
		margin: 0 2.5%;
		background-color: #f8f8f8;
		border: none;
		border-radius: 10rpx;
		line-height: 42rpx;
		font-size: 26rpx;
		color: #848689;
		overflow: auto;
	}

	.bbctouch-cart-subtotal .store-total {
		padding: 23rpx;
		text-align: right;
		font-size: 28rpx;
		line-height: 42rpx;
		color: #252525;
		display: block;
	}

	.bbctouch-cart-subtotal .store-total span {
		font-size: 21rpx;
		color: #db4453;
	}

	.bbctouch-cart-subtotal .store-total span em {
		font-size: 33rpx;
		color: #f23030;
		margin: 0 5rpx;
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

	/*-0------------确认订单满即送---------------------  */

	.store-huodong {
		font-size: 31rpx;
		padding-left: 26rpx;
		line-height: 28px;
	}

	.pay_mode_wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
		display: none;
	}

	.pay_mode_wrap.on {
		display: block;
	}

	.pay_mode_wrap .pay_mode {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -80%);
		width: 600rpx;
		padding: 15rpx 30rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.pay_mode .p_title {
		line-height: 60rpx;
		text-align: center;
		font-size: 30rpx;
		color: #333;
		margin-bottom: 10rpx;
	}

	.pay_mode radio-group {
		display: flex;
		flex-direction: column;
		font-size: 26rpx;
		color: #666;
	}

	.pay_mode .p_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
	}

	.discount_wrap {
		height: 42rpx;
	}

	.bbctouch-cart-subtotal .discount {
		display: flex;
		align-items: center;
		height: 42rpx;
		color: #333;
		font-size: 26rpx;
	}

	.discount .bg {
		position: relative;
		width: 125rpx;
		height: 30rpx;
	}

	.discount .bg image {
		width: 100%;
		height: 100%;
	}

	.discount .bg text {
		position: absolute;
		top: 0px;
		left: 3px;
		width: 125rpx;		
		line-height:30rpx;
		text-align: center;
		color: #504741;
		font-size: 20rpx;
	}

	#store_red_wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
		right: 0;
		margin: 0 auto;
	}

	.store_red {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 50vh;
		background-color: #fff;
		box-sizing: border-box;
	}

	.store_red .title {
		line-height: 110rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		color: #666;
	}

	.store_red_list {
		height: 470rpx;
		box-sizing: border-box;
		padding: 30rpx 30rpx 0;
	}

	.store_red_list .ticket-item {
		position: relative;
		display: block;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
	}

	.ticket-item .line_left,
	.ticket-item .line_right {
		position: absolute;
		top: 150rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #fff;
	}

	.ticket-item .line_left {
		left: -10rpx;
	}

	.ticket-item .line_right {
		right: -10rpx;
	}

	.store_red_list .ticket-item:last-child {
		margin: 0;
	}

	.store_red_list .circle_radio {
		display: flex;
		align-items: center;
		height: 160rpx;
		color: #fff;
		background: -webkit-gradient(linear, 25% 100%, 75% 100%, from(#ff8580), to(#ea5165));
	}

	.circle_radio .red_item_wrap {
		display: flex;
		width: 100%;
		padding: 0 30rpx 0 50rpx;
		align-items: center;
		justify-content: space-between;
	}

	.circle_radio .red_item_wrap .red_h1 {
		font-size: 26rpx;
	}

	.circle_radio .red_item_wrap .red_h1 em {
		font-size: 54rpx;
	}

	.circle_radio .red_item_wrap .red_h2 {
		font-size: 26rpx;
	}

	.circle_radio .red_item_wrap .red_h2 em {
		display: block;
	}

	.circle_radio .red_item_wrap .red_h2 em:nth-child(2) {
		font-size: 20rpx;
		padding-top: 10rpx;
	}

	.circle_radio .red_item_wrap .red_h3 .red_h3_top {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
	}

	.red_h3 .red_h3_top image {
		width: 20rpx;
		height: 20rpx;
		margin-right: 15rpx;
	}

	.circle_radio .red_item_wrap .red_h3 .red_h3_bottom {
		padding: 10rpx 15rpx;
		font-size: 28rpx;
		color: #ec5667;
		background-color: #f9ccd1;
		margin-top: 18rpx;
		border-radius: 6rpx;
	}

	.ticket-item .red_p {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		font-size: 26rpx;
		color: #84292b;
		background: -webkit-gradient(linear, 25% 100%, 75% 100%, from(#d6706b), to(#c44654));
		border-top: 3rpx dashed #fff;
	}

	.ticket-item .red_p image {
		width: 26rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}

	.points_pd {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.points_pd .points-top {
		display: flex;
		padding: 10rpx 0;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.points_pd .points-top .title {
		// flex: 0 0 260rpx;
	}

	.points-top .title switch {
		margin-left: 15rpx;
	}

	.points-top .use-points {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
	}

	.points-top .use-points input {
		width: 150rpx;
		border: 1px solid #ddd;
		margin: 0 8rpx;
		text-align: right;
		padding-right: 15rpx;
		border-radius: 6rpx;
	}

	.points-top .use-points .red-price {
		color: #f23030;
	}

	.points-bottom {
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 26rpx;
	}

	.points-bottom text {
		color: #f23030;
		margin: 0 8rpx;
	}

	.dian-sel {
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.dian-sel .dain-title {
		line-height: 80rpx;
	}

	.dian-sel .ps-mode {
		display: flex;
		align-items: center;
	}

	.dian-sel .ps-mode .ps-item {
		height: 50rpx;
		line-height: 50rpx;
		border: 1rpx solid #ddd;
		padding: 0 40rpx;
		border-radius: 6rpx;
		margin-right: 30rpx;
		box-sizing: border-box;
	}

	.dian-sel .ps-mode .ps-item.on {
		color: #f23030;
		border-color: #f23030;
	}

	.express-fee {
		line-height: 80rpx;
	}

	.express-fee text {
		font-size: 26rpx;
		font-weight: 500;
		color: #FC1C1C;
		line-height: 39rpx;
	}


	.select-theme {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -100;
	}

	.select-theme .theme-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -100;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.select-theme .mask-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		max-height: 50vh;
		background-color: #fff;
		padding-bottom: 40rpx;
		border-radius: 10rpx 10rpx 0 0;
		transform: translateY(100%);
		transition: all 0.3s;
	}

	.select-theme.show {
		z-index: 99;
	}

	.select-theme.show .mask-content {
		transform: translateY(0);
	}

	.select-theme .mask-content .mask-header {
		text-align: center;
		color: #333;
		font-size: 30rpx;
		line-height: 106rpx;
	}

	.select-theme .mask-content .mask-header .mask-close {
		position: absolute;
		top: 28rpx;
		right: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
	}

	.mask-header .mask-close image {
		width: 30rpx;
		height: 30rpx;
	}

	.select-theme .theme-main {
		height: calc(50vh - 200rpx);
		overflow: hidden;
	}

	.select-theme .theme-main .empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 26rpx;
	}

	.select-theme .theme-list {
		display: flex;
		align-items: center;
	}

	.select-theme .theme-list .com-check {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 72rpx;
	}

	.select-theme .theme-list .com-check text {
		color: #eee;
	}

	.select-theme .theme-list .com-check text.on {
		color: #fc1c1c;
	}

	.select-theme .theme-list view.border-bottom-1px {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}

	.select-theme .theme-list label {
		flex: 1;
	}

	.select-theme .theme-list .show-map {
		padding: 0 50rpx;
		color: #999;
		font-size: 26rpx;
	}

	.select-theme .theme-list label .h4 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
		font-size: 28rpx;
		line-height: 48rpx;
	}

	.select-theme .theme-list label view {
		color: #999;
		font-size: 24rpx;
		line-height: 40rpx;
	}

	.confirm-btn {
		display: block;
		width: 600rpx;
		height: 80rpx;
		border: none;
		background-color: #fc1c1c;
		border-radius: 40rpx;
		color: #fff;
		font-size: 34rpx;
		font-weight: bold;
		margin: 30rpx auto 40rpx;
	}

	.zt-tip {
		line-height: 28rpx;
		padding-top: 20rpx;
	}
    .zt-tip-title1{
		padding-top: 30rpx;
	}
	.zt-tip-title2{
		padding-bottom: 20rpx;
	}
	.zt-tip text {
		color: #f23030;
		margin-left: 15rpx;
	}

	#address {
		width: 600rpx;
		display: inline-block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.guige {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
	}

	.guige text {
		margin-top: 3rpx;
	}

	.goods_des {
		display: flex;
	}

	.goods_desc {
		display: flex;
		flex-direction: column;
		padding-top: 15rpx;
		padding-bottom: 18rpx;
		box-sizing: border-box;
	}

	.commodity_price {
		font-size: 30rpx;
		font-weight: bold;
	}
	.commodity_cant{
		font-size: 26rpx;
	}

	.full_gift {
		width: 64rpx;
		height: 40rpx;
		background: #f05269;
		border-radius: 5rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #FFFFFF;
		margin-left: 20rpx;
		margin: 22rpx;
	}

	.express_money {
		font-size: 22rpx;
		font-weight: 500;
		color: #2D2D2D;
		line-height: 32rpx;
		text-align: right;
	}

	.store-rule-text {
		display: inline-block;
		margin-right: 10rpx;
	}

	a {
		text-decoration: none;
	}

	em {
		font-style: normal;
	}
	.invoice_info{
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
