<template>
	<view>
		<view  v-if="isDataLoading == true">
			
			<!--底部 购物车  加车 立即购买功能  -->
			<div class="goods-detail-foot" :style="'height:' + (bottomSateArea?'122rpx':'')">
				<div class="otreh-handle footer_btn">
					<view class="footer_btn_pre store_btn" @tap="go_vendor">
						<image :src="img_url + 'site/dianpu.png'"></image>
						<text>{{$L('店铺')}}</text>
					</view>
					<view class="footer_btn_pre customer_service" @tap="kefu">
						<image :src="img_url + 'site/kefu.png'"></image>
						<text>{{$L('客服')}}</text>
					</view>
					<view class="footer_btn_pre goods_cart_btn" @tap.stop="go_cart">
						<image :src="img_url + 'site/gouwuche.png'"></image>
						<text>{{$L('购物车')}}</text>
						<view class="goods_cart_num" v-if="cart_count">{{cart_count*1>99?'99+':cart_count}}</view>
					</view>
				</div>
				<div class="buy-handle group_shopping">
					<!-- 拼团购买 按钮 -->
					<block v-if="data_info.goods_info.promotion_type == 'pin_tuan' && data_info.goods_info.promotion_start_flag == 2">
						<view class="group_shopping_alone" @tap.stop="switchSpecifications" data-type="separately_buy">
							<view class="group_alone_price">{{$L('￥')}}{{data_info.goods_info.goods_price*1}}</view>
							<view class="group_alone_title">{{$L('单独买')}}</view>
						</view>
						<view class="go_group" @tap.stop="switchSpecifications" data-type="go_league">
							<view class="go_group_price">{{$L('￥')}}{{data_info.pin.sld_pin_price}}</view>
							<view class="go_group_title">{{data_info.pin.pinging?$L('拼团中'):$L('去开团')}}</view>
						</view>
					</block>

					<!-- 预售按钮 start  promotion_type=='sld_presale' && !showDefaultBtn && presaleInfo.pre_run_flag == 2-->
					<block v-else-if="promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2">
						<view @tap="switchSpecifications" class="presale_btn">
							<view class="pre_price">
								<view class="despoit_pay_now">{{$L('立即支付定金')}}</view>
								<view class="despoit_pay_price"><text>{{$L('￥')}}</text>{{presaleInfo.pre_deposit_price}}</view>
							</view>
						</view>
					</block>
					<!-- 预售按钮 end -->
					<!-- 阶梯团 start -->
					<block v-else-if="promotion_type=='pin_ladder_tuan' && !showDefaultBtn">
						<view @tap.stop="switchSpecifications" :class="'ladder_btn ' + (ladderPinInfo.pay_status==2 || ladderPinInfo.pay_status==4 ? 'no_ladder_btn' : '')"
						 data-type="jtt">
							{{ladderPinInfo.pay_status==1?$L('立即付定金'): ladderPinInfo.pay_status== 2 ? $L('待付尾款'): ladderPinInfo.pay_status==3 ? $L('去付尾款'):$L('已付尾款')}}
						</view>
					</block>
					<!-- 阶梯团 end -->
					<!-- 手机专享   团购  限时活动-->
					<block v-else-if="data_info.goods_info.promotion_type=='p_mbuy' || data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2 || data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag == 1">
						<view class="mobile_buy_now" @tap.stop="switchSpecifications" data-type="buy">{{$L('立即购买')}}</view>
					</block>

					<!-- 秒杀活动  立即秒杀 已抢完 start -->
					<block v-else-if="data_info.goods_info.promotion_type=='seckill' && secKillInfo.activity_state == 2">
						<view class="mobile_buy_now" @tap.stop="switchSpecifications" data-type="second_kill" v-if="secKillInfo.seckill_storage > 0">{{$L('立即秒杀')}}</view>
						<view class="mobile_buy_now seckill_finished" @tap.stop="switchSpecifications" data-type="second_kill" v-else>{{$L('已抢完')}}</view>
					</block>
					<!-- 秒杀活动 立即秒杀 已抢完 end -->
						
					<!-- 正常商品 start -->
					<block v-else>
						<a class="add-cart add_cart" @tap="switchSpecifications" data-type="add">{{$L('加入购物车')}}</a>
						<a href="javascript:void(0);" class="buy-now buy_now" @tap.stop="switchSpecifications" data-type="buy">{{$L('立即购买')}}</a>
					</block>
					<!-- 正常商品 end -->
					
				</div>
			</div>
			
			<!-- 选择规格弹框 -->
			<view class="specifications" v-if="Specifications" @touchmove.stop.prevent="moveHandle">
				<view class="specifications_con">
					<view class="specifications_des">
						<view class="specifications_des_left">
							<image :src="rotationChartImage[0]" class="specification_des_image"></image>
							<view class="specifications_des_pre">
								<view class="specifications_des_price">
									<!-- 拼团单独买 -->
									<view class="des_spec_price" v-if="data_info.goods_info.promotion_type=='pin_tuan' && data_info.goods_info.promotion_start_flag == 2 && switchSpecifications_add == '3'">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(data_info.goods_info.goods_price)[0]}}</text>.
										<text>{{filters.toSplit(data_info.goods_info.goods_price)[1]}}</text>
									</view>
									<view class="des_spec_price" v-else-if="data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag == 1 || data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2 || data_info.goods_info.promotion_type=='pin_tuan' && data_info.goods_info.promotion_start_flag == 2 && switchSpecifications_add == '4'">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(data_info.goods_info.promotion_price)[0]}}</text>.
										<text>{{filters.toSplit(data_info.goods_info.promotion_price)[1]}}</text>
									</view>
									<!-- 预售进行中 -->
									<view class="des_spec_price" v-else-if="promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(presaleInfo.pre_sale_price)[0]}}</text>.
										<text>{{filters.toSplit(presaleInfo.pre_sale_price)[1]}}</text>
									</view>
									<!-- 手机专享进行中 -->
									<view class="des_spec_price" v-else-if="data_info.goods_info.promotion_type=='p_mbuy'">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(data_info.goods_info.mobile_price)[0]}}</text>.
										<text>{{filters.toSplit(data_info.goods_info.mobile_price)[1]}}</text>
									</view>
									<!-- 立即秒杀进行中 -->
									<view class="des_spec_price" v-else-if="data_info.goods_info.promotion_type=='seckill' && secKillInfo.activity_state == 2">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(secKillInfo.seckill_price)[0]}}</text>.
										<text>{{filters.toSplit(secKillInfo.seckill_price)[1]}}</text>
									</view>
									<view class="des_spec_price" v-else>
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(data_info.goods_info.show_price)[0]}}</text>.
										<text>{{filters.toSplit(data_info.goods_info.show_price)[1]}}</text>
									</view>
									<text class="mobile_phone_tips" v-if="data_info.goods_info.promotion_type=='p_mbuy'">{{$L('手机专享')}}</text>
									<text class="pre_sale_tips" v-if="data_info.goods_info.promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2">{{$L('预售')}}</text>
									<text class="limited_activities_tips" v-if="data_info.goods_info.promotion_type=='xianshi' && data_info.goods_info.promotion_run_flag == 1">{{$L('限时折扣')}}</text>
									<text class="make_group_tips" v-if="data_info.goods_info.promotion_type=='pin_tuan' && data_info.goods_info.promotion_start_flag == 2 && switchSpecifications_add != '3'" >{{$L('拼团')}}</text>
									<text class="group_buying_tips" v-if="data_info.goods_info.promotion_type=='tuan' && data_info.goods_info.promotion_start_flag == 2">{{$L('团购')}}</text>
									<text class="ladder_regiment_tips" v-if="data_info.goods_info.promotion_type=='pin_ladder_tuan' && !showDefaultBtn">{{$L('阶梯团')}}</text>
									<text class="sec_kill_tips" v-if="data_info.goods_info.promotion_type=='seckill' && secKillInfo.activity_state == 2">{{$L('限时秒杀')}}</text>
								</view>
								<view class="specifications_des_store">
									{{$L('库存：')}}{{data_info.goods_info.promotion_type=='sld_presale'?presaleInfo.goods_stock: data_info.goods_info.promotion_type=='pin_ladder_tuan' ?
									ladderPinInfo.sld_stock : data_info.goods_info.promotion_type=='pin_tuan' && switchSpecifications_add != '3' ? data_info.pin.sld_stock : data_info.goods_info.promotion_type=='seckill' && secKillInfo.activity_state == 2?
									secKillInfo.seckill_storage :  data_info.goods_info.goods_storage}}
								</view>
								<view class="specifications_des_txt">
									<view v-if="data_info.goods_info.goods_spec" class="specifications_des_view">
										{{$L('已选：')}}
										<block v-for="(specval, specid) in data_info.goods_info.goods_spec" :key="specid">
											<text v-if="specval!=null">{{specval}}</text>
										</block>
			
									</view>
									<text v-if="!data_info.goods_info.goods_spec">{{$L('默认')}}</text>
								</view>
							</view>
						</view>
						<view class="model_close_image" @tap="hidden_mask" style="margin-right: 20rpx;">
							<image :src="img_url + 'site/close.png'"></image>
						</view>
					</view>
			
					<scroll-view class="spec_content" scroll-y="true">
						<view class="spec_con">
							<view class="sepc_con_pre">
								<view v-for="(item, index) in data_info.goods_map_spec" :key="index" class="specifications_size">
									<view class="spec_size_title">{{item.goods_spec_name}}</view>
									<view class="size_list">
										<view v-for="(item1, index1) in item.goods_spec_value" :key="index1" :data-spec-title-index="index"
										 :data-spec-detail-index="index1" :data-spec-det-value-id="item1.specs_value_id" :class="'size_list_pre ' + (item1.default == 1 ? 'size_pre_active' : '')"
										 @tap.stop="sele_spec">{{item1.specs_value_name}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="specifications_buynum">
							<view class="specifications_buynum_left">
								<text>{{$L('购买数量')}}</text>
								<!-- 拼团 -->
								<text v-if="data_info.goods_info.promotion_type == 'pin_tuan' && data_info.goods_info.promotion_start_flag == 2 && switchSpecifications_add != '3'">({{$L('限购')}}{{data_info.pin.sld_max_buy}}{{$L('件')}})</text>
								<!-- 团购 -->
								<text v-if="data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2">({{$L('限购')}}{{data_info.goods_info.upper_limit}}{{$L('件')}})</text>
								<!-- 阶梯团 -->
								<text v-if="promotion_type=='pin_ladder_tuan' && !showDefaultBtn && ladderPinInfo && ladderPinInfo.sld_max_buy">({{$L('限购')}}{{ladderPinInfo.sld_max_buy}}{{$L('件')}})</text>
								<!-- 预售 -->
								<text v-if="promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2">({{$L('限购')}}{{presaleInfo.pre_max_buy}}{{$L('件')}})</text>
								<!-- 立即秒杀 -->
								<text v-if="promotion_type=='seckill' && secKillInfo.activity_state == 2">({{$L('限购')}}{{secKillInfo.upper_limit}}{{$L('件')}})</text>
							</view>
							<view class="specifications_buynumber">
								<text data-type="minus" @tap.stop="cart_num">-</text>
								<input type="number" class="uni-input buy-num" @blur="BuyNumEdit" id="buynum" v-model="buy_num" :adjust-position="false" cursor-spacing="0"></input>
								<text data-type="add" @tap.stop="cart_num">+</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="specification_bottom_btn">
					<!-- 拼团活动，规格选择  -->
					<view class="specification_btn1" v-if="data_info.goods_info.promotion_type == 'pin_tuan' && switchSpecifications_add == '0' && data_info.goods_info.promotion_start_flag == 2">
						<view class="specification_add" @tap="go_to_buy_pin">
							<text>{{$L('￥')}}{{data_info.pin.sld_pin_price}}</text>
							<text>{{$L('拼团中')}}</text>
						</view>
						<view class="specification_buy" @tap="go_bug">
							<text>{{$L('￥')}}{{data_info.goods_info.goods_price*1}}</text>
							<text>{{$L('单独买')}}</text>
						</view>
					</view>
					<!-- 秒杀活动 底部栏的 立即秒杀 已抢完  start -->
					<view class="specifications_bottom_btn1" v-else-if="promotion_type=='seckill' && secKillInfo.activity_state == 2 && secKillInfo.seckill_storage > 0"  @tap="go_bug">
						<text>{{$L('立即秒杀')}}</text>
					</view>
					<view class="spec_bot_sekill_finshed" v-else-if="promotion_type=='seckill' && secKillInfo.activity_state == 2 && secKillInfo.seckill_storage == 0">
						<text>{{$L('已抢完')}}</text>
					</view>
					<!-- 秒杀活动 底部栏的 立即秒杀 已抢完 end -->
					<!-- 阶梯团，立即付定金   等，活动进行中 -->
					<view v-else-if="promotion_type=='pin_ladder_tuan' && !showDefaultBtn" @tap="deposit_pay_ladder" :class="'specifications_btn2 ' + (ladderPinInfo.pay_status==2 || ladderPinInfo.pay_status==4 ? 'no_ladder_btn' : '')">
						<text>{{ladderPinInfo.pay_status==1?$L('立即付定金'): ladderPinInfo.pay_status== 2 ? $L('待付尾款'): ladderPinInfo.pay_status==3 ? $L('去付尾款'):$L('已付尾款')}}</text>
					</view>
					<!-- 预售 立即付定金 活动进行中 -->
					<view class="specifications_btn3" v-else-if="promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2"
					 @tap="deposit_pay">
						<text>{{$L('立即付定金')}}</text>
					</view>
					<!-- 手机专享 团购 进行中 ； 限时折扣 进行中 ；拼团 进行中 -->
					<view class="specifications_btn4" v-else-if="data_info.goods_info.promotion_type=='p_mbuy' || data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2 || data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag == 1"
					 @tap="go_bug">
						<text>{{$L('立即购买')}}</text>
					</view>
					<!-- 底部栏的 加入购物车 按钮点击之后的弹框 -->
					<view class="specifications_bottom_btn" v-else-if="switchSpecifications_add == '1'" @tap="add_cart">
						<text>{{$L('加入购物车')}}</text>
					</view>
					<!-- 底部栏的 立即购买 按钮点击之后的弹框 -->
					<view class="specifications_bottom_btn1" v-else-if="switchSpecifications_add == '2'" @tap="go_bug">
						<text>{{$L('立即购买')}}</text>
					</view>
					<!-- 拼团 底部栏的 单独买 -->
					<view class="specifications_bottom_btn3" v-else-if="switchSpecifications_add == '3'" @tap="go_bug">
						<text>{{$L('￥')}}{{data_info.goods_info.goods_price*1}}</text>
						<text>{{$L('单独买')}}</text>
					</view>
					<!-- 拼团 底部栏的 去开团 -->
					<view class="specifications_bottom_btn4" v-else-if="switchSpecifications_add == '4'" @tap="go_to_buy_pin">
						<text>{{$L('￥')}}{{data_info.pin.sld_pin_price}}</text>
						<text>{{data_info.pin.pinging?$L('拼团中'):$L('去开团')}}</text>
					</view>
					<!-- 拼团，参与别人发起的拼单，弹出的弹框 -->
					<view class="specifications_btn" @tap="pick_team" v-else-if="switchSpecifications_add == '5'">
						<text>{{$L('确定')}}</text>
					</view>	
					<!-- 无活动时，选择规格，加入购物车，立即购买 活动未开始 -->
					<view class="specification_btn1" v-else>
						<view class="specification_add" @tap="add_cart">{{$L('加入购物车')}}</view>
						<view class="specification_buy" @tap="go_bug">{{$L('立即购买')}}</view>
					</view>
				</view>
			</view>
			
			<scroll-view :style="'height:' + systemInfo.windowHeight + 'px;width:750rpx'" scroll-y="true" :scroll-into-view="toView" @scroll="scroll">
				<view>
					<!-- #ifndef MP-WEIXIN -->
					<view class="go_back" @click="goBack()">
						<image :src="img_url + 'site/back.jpg'" mode=""></image>
					</view>
					<!-- #endif -->
					<!-- 透明遮罩层 -->
					<view class="transparent_mask" v-if="transparent_mask" @tap="hideMask"></view>
					<!-- 遮罩蒙层 -->
					<view class="mask" @tap="hidden_mask" v-if="showMask" @touchmove.stop.prevent="moveHandle"></view>
					<!-- #ifdef APP-PLUS -->
					<view class="fixed_top_status_bar"></view>
					<!-- #endif -->
					<!-- 导航条 -->
					<view class="detail_nav" v-if="Nav">
						<!-- #ifndef MP-WEIXIN  -->
						<view class="go_back_nav flex_row_center_center" @click="goBack()">
							<image :src="img_url + 'site/go_back.jpg'" mode=""></image>
						</view>
						<!-- #endif -->
						<view :class="'nav_pre ' + (NavIndex == 0 ? 'active' : '')" @tap="handleNav" data-hash="hash1" data-index="0">{{$L('商品')}}</view>
						<view :class="'nav_pre ' + (NavIndex == 1 ? 'active' : '')" @tap="handleNav" data-hash="hash2" data-index="1">{{$L('评价')}}</view>
						<view :class="'nav_pre ' + (NavIndex == 2 ? 'active' : '')" @tap="handleNav" data-hash="hash3" data-index="2">{{$L('推荐')}}</view>
						<view :class="'nav_pre ' + (NavIndex == 3 ? 'active' : '')" @tap="handleNav" data-hash="hash4" data-index="3">{{$L('详情')}}</view>
						<view class="more_tips" @tap="tipsShow">
							<image class="more" :src="img_url + 'site/good_det_more.png'"></image>
							<block v-if="tips_show">
								<view class="triangle-up"> </view>
								<view class="tips">
									<button v-for="(item, index) in tips" :key="index" class="tips_pre" @tap="handleLink" :data-link="item.tips_link"
									 :open-type="item.type" :data-type="item.type" plain="true">
										<image :src="item.tips_img"></image>
										<text>{{item.tips_name}}</text>
									</button> 
								</view>
							</block>
						</view>
					</view>
					<!-- 轮播图 -->
					<view class="goods_lunbo" id="hash1" v-if="rotationChartImage !== undefined  && rotationChartImage &&rotationChartImage.length > 0">
					<uni-swiper-dot :info="rotationChartImage_all" :current="current" :showControls='showControls' field="content" :mode="mode">
					    <swiper  class="swiper-box" @change="change">
							<!-- #ifdef H5 || APP-PLUS -->
							<block v-if="data_info.goods_info.video_url">
								<swiper-item>
									<image :src="rotationChartImage[0] + ' '" class="slide-image"></image>
									<image :src="img_url+'play.png'" class="play_btn" @click="toPlayPage"></image>
								</swiper-item>
							</block>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<block v-if="data_info.goods_info.video_url">
								<swiper-item>
									<video controls @play='playVideo' @ended='endVideo'  :src="data_info.goods_info.video_url" loop class="video_btn"  :poster="rotationChartImage[0]">
									</video>
								</swiper-item>
							</block>
							<!-- #endif -->
					      <block v-for="(item, index) in rotationChartImage" :key="index">
					      		<swiper-item class="swiper_item">
					      			<image :src="item + ' '" class="slide-image" :data-img="item" @tap="previewImage"></image>
					      		</swiper-item>		
					      </block>
					    </swiper>
					</uni-swiper-dot>
						<!-- 直播按钮 -->
						<view class="detail_top_radio" style="background-image: url({img_url}}detail_radio.pn);" v-if="data_info.goods_info.replay_live_id>0"
						 @tap="go_huifnag">
							<image :src="img_url + 'musicGig.gif'" class="detail_radio_zhibo_musicGig"></image>
							<view class="detail_top_radio_text">{{$L('精彩讲解')}}</view>
						</view>
						<view class="detail_radio_zhibo" v-if="data_info.is_live_open==1 && data_info.vendor_liveing.live_id" @tap="goVideo">
							<image :src="data_info.vendor_liveing.live_image_url" class="detail_radio_zhibo_avator"></image>
							<text class="detail_radio_zhibo_text ellipsis">{{data_info.vendor_liveing.live_name}}</text>
							<image :src="img_url + 'detail_jiantou.png'" class="detail_radio_zhibo_jiantou"></image>
						</view>

						<!-- end 直播按钮 -->
					</view>
					<!--商品信息介绍  -->
					
					
					<!-- 秒杀活动 start -->
					<view class="second_kill"  v-if="data_info.goods_info.promotion_type == 'seckill' && (secKillInfo.activity_state == 1 || secKillInfo.activity_state == 2)">
						<!-- 秒杀活动  secKillInfo.activity_state ：1未开始   2进行中 3结束-->
						<!-- 秒杀活动进行中 start -->
						<view class="second_kill_con" :style="'background-image:url('+img_url+'site/second_kill_bg.png);background-size:100% 100%;background-repeat:no-repeat;'">
							<!-- 活动进行中 start -->
							<view class="second_kill_left" v-if="secKillInfo.activity_state == 2">
								<!-- 在售价 -->
								<view class="second_kill_goods_price" v-if="filters.toSplit(secKillInfo.seckill_price)[0] && filters.toSplit(secKillInfo.seckill_price)[1]">
									<text>{{$L('￥')}}</text><text>{{filters.toSplit(secKillInfo.seckill_price)[0]}}</text>.<text>{{filters.toSplit(secKillInfo.seckill_price)[1]}}</text>
								</view>
								<!-- 秒杀价 -->
								<view class="second_kill_price">
									<text>{{$L('原价')}}:{{$L('￥')}}{{secKillInfo.goods_price}}</text>
								</view>
							</view>
							<!-- 活动进行中 end -->
							<!-- 活动未开始 start -->
							<view class="second_kill_left" v-else>
								<!-- 在售价 -->
								<view class="second_kill_goods_price" v-if="filters.toSplit(secKillInfo.goods_price)[0] && filters.toSplit(secKillInfo.goods_price)[1]">
									<text>{{$L('￥')}}</text><text>{{filters.toSplit(secKillInfo.goods_price)[0]}}</text>.<text>{{filters.toSplit(secKillInfo.goods_price)[1]}}</text>
								</view>
								<!-- 秒杀价 -->
								<view class="second_kill_price">
									<text>{{$L('秒杀价')}}:{{$L('￥')}}{{secKillInfo.seckill_price}}</text>
								</view>
							</view>
							<!-- 活动未开始 end -->
							
							<view class="second_kill_right">
								<view class="second_kill_text">
									{{secKillInfo.activity_state == 1 ? $L('距开始') : secKillInfo.activity_state == 2 ? $L('距结束') : ''}}
								</view>
								<view class="sec_kill_countdown">
									<text class="day" v-if="secKillDay != '00'">{{secKillDay}}天</text>
									<text class="time">{{secKillHr}}</text>
									<text class="time_tips">:</text>
									<text class="time">{{secKillMin}}</text>
									<text class="time_tips">:</text>
									<text class="time">{{secKillSec}}</text>
								</view>
							</view>
						</view>
						<!-- 秒杀活动进行中 end -->
						<view class="sec_kill_preview" v-if="secKillInfo.activity_state == 1">
							<view class="sec_kill_preview_left">
								{{$L('秒杀预告：')}}{{secKillInfo.start_date + $L('开始')}}
							</view>
							<view class="sec_kill_preview_right" v-if="secKillInfo.is_notice == 1" @click="secKillPreview">
								<image :src="img_url + 'site/time.png'" mode=""></image>
								<text>{{$L('提醒我')}}</text>
							</view>
							<view class="cancel_preview" v-if="secKillInfo.is_notice == 0"  @click="secKillPreview">
								{{$L('取消提醒')}}
							</view>
						</view>
					</view>
					<!-- 秒杀活动 end -->

		
					<!-- 预售 start -->
					<view :class="presaleInfo.pre_run_flag == 1 ? 'presale1' : 'presale2'" v-if="promotion_type=='sld_presale' && presaleInfo"
					 :style="'background-image:url('+img_url+'site/pre_salse_bg.png);background-size:100% 100%;background-repeat:no-repeat;margin-top:-26rpx;position:relative'">
						<view class="presale1_left">
							<!-- 未开始 -->
							<view class="presale1_price" v-if="presaleInfo.pre_run_flag == 1">
								<view class="presale1_title">{{$L('预售价：')}}</view>
								<view class="presale1_price1">
									<view class="presale1_prices" v-if="presaleInfo.pre_sale_price">{{$L('￥')}}{{presaleInfo.pre_sale_price}}</view>
								</view>
								<view class="presale_oragin_price">{{$L('原价：')}}{{presaleInfo.goods_price}}</view>
							</view>
							<!-- 进行中 -->
							<view class="presale1_price" v-else-if="presaleInfo.pre_run_flag == 2">
								<view class="presale1_title">{{$L('预售价：')}}</view>
								<view class="presale1_price1 presale1_price2">
									<image :src="img_url + 'site/yushouhuore.png'"></image>
									<view>
										<view class="presale1_prices" v-if="presaleInfo.pre_sale_price">{{$L('￥')}}{{presaleInfo.pre_sale_price}}</view>
										<view class="presale_oragin_price">{{$L('原价：')}}{{presaleInfo.goods_price}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="presale1_right">
							<view class="collect_deposit">
								<text>{{$L('预售定金')}}</text>
								<text>{{$L('￥')}}{{presaleInfo.pre_deposit_price}}</text>
							</view>
							<view class="presale1_start_time" v-if="presaleInfo.pre_run_flag == 1">{{$L('活动开始时间：')}}{{filters.getDateTime1(presaleInfo.pre_start_time)}}</view>
							<view class="presale1_start_time1" v-else-if="presaleInfo.pre_run_flag == 2">{{$L('活动结束时间：')}}{{filters.getDateTime1(presaleInfo.pre_end_time)}}</view>
						</view>
					</view>
					<!-- 预售 end -->

					<!-- 阶梯团 start -->
					<view class="ladder" v-if="promotion_type=='pin_ladder_tuan' && ladderPinInfo && ladderPinInfo.sld_sheng_time && ladderPinInfo.sld_sheng_time>0">
						<view class="ladder_bg" :style="'background-image:url('+img_url+'site/ladder_regiment_end1.png);background-size:100% 100%;background-repeat:no-repeat;'">
							<view class="ladder_left">
								<view class="ladder_deposit">
									<view class="deposit_text">{{$L('定金')}}</view>
									<view class="deposit" v-if="ladderPinInfo && ladderPinInfo.sld_ding_price"><text>{{$L('￥')}}</text><text>{{ladderPinInfo.sld_ding_price}}</text></view>
								</view>
								<view class="deposit_price">
									<text v-if="ladderPinInfo && ladderPinInfo.sld_now_price">{{$L('现价：')}}{{ladderPinInfo.sld_now_price}}</text>
									<text v-if="ladderPinInfo && ladderPinInfo.goods_price">{{$L('原价：')}}{{ladderPinInfo.goods_price}}</text>
								</view>
							</view>
							<view class="jtt_right">
								<view class="activity_not_started" v-if="showDefaultBtn">{{$L('活动未开始')}}</view>
								<view class="activity_not_started" v-else-if="ladderPinInfo.pay_status==1">{{$L('活动进行中')}}</view>
								<view class="activity_not_started" v-else>{{$L('已参团')}}{{ladderPinInfo.sld_already_num}}{{$L('人')}}</view>
								<view class="pro_wrap">
									<view class="pro" :style="'width: ' + ladderPinInfo.pro + '%;'"></view>
								</view>
								<view class="djs">
									<text class="count_down_title">{{showDefaultBtn?$L('距开始'):$L('距结束')}}</text>
									<text class="count_down_day ">{{ladderRegimentDay*1>0?ladderRegimentDay:'00'}}天</text>
									<text class="count_down_hours limited_discount_hours ladder_text">{{ladderRegimentHour*1>0?ladderRegimentHour:'00'}}</text>
									<text class="count_down_flag">:</text>
									<text class="count_down_minutes limited_discount_minutes ladder_text">{{ladderRegimentMinute*1>0?ladderRegimentMinute:'00'}}</text>
									<text class="countdown-break-flag">:</text>
									<text class="count_down_seconds limited_discount_seconds ladder_text">{{ladderRegimentSecond*1>0?ladderRegimentSecond:'00'}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 阶梯团 end -->

					<!--------------------限时折扣-------------------------  -->
					<block v-if="data_info.goods_info.promotion_type">
						<view class="youhui" v-if="data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag!=-1"
						 :style="'background: url(' + img_url + 'site/show_discount_bg.png) no-repeat;background-size:100% 100%;'">
							<!--未开始  -->
							<block v-if="data_info.goods_info.promotion_run_flag == 0">
								<view class="youhui-left">
									<view class="jge" v-if="filters.toSplit(data_info.goods_info.promotion_price)[0] && filters.toSplit(data_info.goods_info.promotion_price)[1]">
										<text>{{$L('￥')}}</text><text>{{filters.toSplit(data_info.goods_info.promotion_price)[0]}}</text>.<text>{{filters.toSplit(data_info.goods_info.promotion_price)[1]}}</text>
									</view>
									<view class="zekou111">
										<view class="zhekou1"><text>{{data_info.goods_info.remark?data_info.goods_info.remark:$L('限时折扣')}}</text><text>{{data_info.goods_info.xianshi_discount}}</text></view>
										<view class="zhekou_origin_price">
											<!-- <text wx:if="{{filters.toLength(data_info.goods_info.goods_price) < 8}}">原价:</text> -->
											<text>{{data_info.goods_info.goods_price}}</text>
										</view>
									</view>
								</view>
								<view class="right">
									<view class="rtop">
										{{$L('活动未开始')}}
									</view>
									<view class="dime">
										<view class="dime_text" v-if="hours< '00' || minutes < '00' || seconds < '00'">{{$L('已结束')}}</view>
										<view v-else class="count_down1">
											<text class="count_down_title">{{$L('距开始')}}</text>
											<div class="countdown" :data-end_time_str="data_info.goods_info.promotion_start_time">
												<text class="count_down_day ">{{day}}{{$L('天')}}</text>
												<text class="count_down_hours limited_discount_hours">{{hours}}</text>
												<text class="count_down_flag">:</text>
												<text class="count_down_minutes limited_discount_minutes">{{minutes}}</text>
												<text class="countdown-break-flag">:</text>
												<text class="count_down_seconds limited_discount_seconds">{{seconds}}</text>
											</div>
										</view>
									</view>
								</view>
							</block>
							<!-- 进行中 -->
							<block v-if="data_info.goods_info.promotion_run_flag == 1">
								<view class="youhui-left">
									<view class="jge" v-if="filters.toSplit(data_info.goods_info.promotion_price)[0] && filters.toSplit(data_info.goods_info.promotion_price)[1]">
										<text>{{$L('￥')}}</text><text>{{filters.toSplit(data_info.goods_info.promotion_price)[0]}}</text>.<text>{{filters.toSplit(data_info.goods_info.promotion_price)[1]}}</text>
									</view>
									<view class="zekou111">
										<view class="zhekou1"><text>{{data_info.goods_info.remark?data_info.goods_info.remark:$L('限时折扣')}}</text><text>{{data_info.goods_info.xianshi_discount}}</text></view>
										<view class="zhekou_origin_price">
											<text>{{data_info.goods_info.goods_price}}</text>
										</view>
									</view>
								</view>
								<view class="right">
									<view class="rtop">
										{{$L('最少购买')}}{{data_info.goods_info.lower_limit}}{{$L('件')}}
									</view>
									<view class="dime">
										<view class="dime_text" v-if="hours< '00' || minutes < '00' || seconds < '00'">{{$L('已结束')}}</view>
										<view v-else class="count_down1">
											<text class="count_down_title">{{$L('距结束')}}</text>
											<view class="countdown" :data-end_time_str="data_info.goods_info.promotion_end_time">
												<text class="count_down_day ">{{day}}{{$L('天')}}</text>
												<text class="count_down_hours limited_discount_hours">{{hours}}</text>
												<text class="count_down_flag">:</text>
												<text class="count_down_minutes limited_discount_minutes">{{minutes}}</text>
												<text class="countdown-break-flag">:</text>
												<text class="count_down_seconds limited_discount_seconds">{{seconds}}</text>
											</view>
										</view>
									</view>
								</view>
							</block>
						</view>
						<!----------------------团购-----------------------------  -->
						<view class="pingtuan1" v-if="data_info.goods_info.promotion_type == 'tuan'" :style="'background: url(' + img_url + 'site/group_buying_bg.png) no-repeat;background-size:100% 100%;'">
							<view class="tuangou_left">
								<view class="establish_province" v-if="data_info.goods_info.sheng_price">{{$L('立省')}}{{$L('￥')}}{{data_info.goods_info.sheng_price}}</view>
								<view class="tuangou_price">
									<view class="tuangou_discount_price">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(data_info.goods_info.promotion_price)[0]}}</text>.
										<text>{{filters.toSplit(data_info.goods_info.promotion_price)[1]}}</text>
									</view>
									<view class="tuangou_original_price" v-if="filters.toLength(data_info.goods_info.show_price) < 6">{{data_info.goods_info.goods_price}}</view>
								</view>
							</view>
							<!-- 团购活动未开始 -->
							<view class="tuangou_right" v-if="data_info.goods_info.promotion_start_flag == 1">
								<view class="rganized_units_num">{{$L('活动未开始')}}</view>
								<view class="tuangou_time">
									<view class="count_down1">
										<text class="count_down_title">{{$L('距开始')}}</text>
										<view class="countdown" :data-end_time_str="data_info.goods_info.promotion_start_time">
											<text class="count_down_day">{{day}}{{$L('天')}}</text>
											<text class="count_down_hours">{{hours}}</text>
											<text class="count_down_flag">:</text>
											<text class="count_down_minutes">{{minutes}}</text>
											<text class="countdown-break-flag">:</text>
											<text class="count_down_seconds">{{seconds}}</text>
										</view>
									</view>
								</view>
							</view>
							<!-- 团购活动进行中 -->
							<view class="tuangou_right" v-if="data_info.goods_info.promotion_start_flag == 2">
								<view class="rganized_units_num">{{$L('已团')}}{{data_info.goods_info.saled_num}}{{$L('件')}}</view>
								<view class="tuangou_time">
									<view v-if="hours< '00' || minutes < '00' || seconds < '00'">
										<em class="over">{{$L('已结束')}}</em>
									</view>
									<view v-else class="count_down1">
										<text class="count_down_title">{{$L('距结束')}}</text>
										<div class="countdown" :data-end_time_str="data_info.goods_info.promotion_end_time">
											<text class="count_down_day">{{day}}{{$L('天')}}</text>
											<text class="count_down_hours">{{hours}}</text>
											<text class="count_down_flag">:</text>
											<text class="count_down_minutes">{{minutes}}</text>
											<text class="countdown-break-flag">:</text>
											<text class="count_down_seconds">{{seconds}}</text>
										</div>
									</view>
								</view>
							</view>
						</view>

						<!----------------------拼团-----------------------------  -->
						<view class="pingtuanA" v-if="data_info.goods_info.promotion_type == 'pin_tuan' && data_info.pin" :style="'background: url(' + img_url + 'site/group_bg.png) no-repeat;background-size:100% 100%;'">
							<view class="pintuan_left">
								<view class="pintuan_left_price" v-if="data_info.goods_info.promotion_price">{{$L('￥')}}{{data_info.goods_info.promotion_price}}</view>
								<view class="pintuan_left_group">
									<view class="pintuan_left_num">
										<image :src="img_url + 'site/pintuan.png'"></image>
										<text>{{data_info.pin.sld_team_count}}{{$L('人团')}}</text>
									</view>
									<view class="group_return_regiment">
										{{$L('团长返')}}{{$L('￥')}}{{data_info.pin.sld_return_leader}}
									</view>
								</view>
							</view>
							<!-- promotion_start_flag   1未开始 0结束 2进行中-->
							<!-- 进行中 -->
							<view class="pintuan_right" v-if="data_info.goods_info.promotion_start_flag == 2">
								<view class="pintuan_right_num">{{$L('已拼')}}{{data_info.pin.sales}}{{$L('件')}}</view>
								<view v-if="day && hours && minutes && seconds">
									<text style="font-size: 26rpx;">{{$L('距结束')}}</text>
									<div class="countdown" style="display: inline-block;width: auto;" :data-end_time_str="data_info.goods_info.promotion_end_time">
										<div class="countdown_group">
											<text>{{day}}{{$L('天')}}</text>
											<text class="countdown1">{{hours}}</text>
											<text class="countdown2">:</text>
											<text class="countdown1">{{minutes}}</text>
											<text class="countdown2">:</text>
											<text class="countdown1">{{seconds}}</text>
										</div>
									</div>
								</view>
							</view>
							<!-- 未开始 -->
							<view class="pintuan_right" v-if="data_info.goods_info.promotion_start_flag == 1">
								<view class="pintuan_right_num">{{$L('活动未开始')}}</view>
								<view v-if="day && hours && minutes && seconds">{{$L('距开始')}}
									<div class="countdown" style="display: inline-block;width: auto;" :data-end_time_str="data_info.goods_info.promotion_end_time">
										<div class="countdown_group">
											<text>{{day}}{{$L('天')}}</text>
											<text class="countdown1">{{hours}}</text>
											<text class="countdown2">:</text>
											<text class="countdown1">{{minutes}}</text>
											<text class="countdown2">:</text>
											<text class="countdown1">{{seconds}}</text>
										</div>
									</div>
								</view>
							</view>
						</view>
					</block>
					<!--*--------------------------  -->

					<view class="goods_detail_instro">
						<block v-if="(promotion_type == 'seckill') || (promotion_type=='pin_ladder_tuan') || (promotion_type == 'tuan') || (promotion_type == 'xianshi') || (promotion_type=='sld_presale' && presaleInfo) ||(promotion_type == 'pin_tuan' && data_info.pin.length > 0)">
							<!-- 预售进行中,  显示付尾款时间,和发货时间 -->
							<view class="Payment_Delivery" v-if="promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2">
								<view class="Payment_time">{{$L('付尾款时间')}} : {{presaleInfo.pre_weikuan_time_str}}</view>
								<view class="Delivery_time">{{$L('发货时间')}} : {{$L('付尾款后7天内发货')}}</view>
							</view>
							<!-- 商品的具体详细信息 -->
							<view class="goods-detail-price">
								<!-- 商品名称和商品介绍 -->
								<view class="goods-detail-name">
									<dl>
										<view style="display:flex;justify-content:space-between;">
											<text class="goods_name_new">{{data_info.goods_info.goods_name}}</text>
											<!-- 商品价格 -->
											<view class="goods_price_new goods_price_new1">
												<view class="goods_opt">
													<view class="collection" @tap="favorate">
														<image :src="data_info.is_favorate ? img_url + 'site/shoucang.png' : img_url + 'site/shoucang2.png'"></image>
														<text>{{data_info.is_favorate ? $L('已收藏') : $L('收藏')}}</text>
													</view>
													<view class="share" @tap="showShare">
														<image :src="img_url + 'site/fenxiang.png'"></image>
														<text>{{$L('分享')}}</text>
													</view>
												</view>
											</view>
										</view>
										<view class="goods-jingle1" v-if="data_info.goods_info.goods_jingle">{{data_info.goods_info.goods_jingle}}</view>

									</dl>
								</view>
								<!-- 会员查看权益 -->
								<!-- 如下活动进行中，也不让其显示
                注：不能有会员等级折扣的活动：手机专享，限时折扣，团购，拼团，阶梯团，预售，优惠套装
                    可以公用：产品组合，满送，店铺优惠券，平台优惠券
                -->
								<block v-if="!data_info.goods_info.promotion_type =='p_mbuy' || !(data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2) || !(data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag == 1) ||!(promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2) || !(promotion_type=='pin_ladder_tuan' && !showDefaultBtn) || !(data_info.goods_info.promotion_type == 'pin_tuan') || !data_info.has_bundling_data">
									<view style="width:100%;padding-bottom:30rpx;margin-top:10rpx;" v-if="data_info.grade_info !== undefined && data_info.grade_info.length && filters.toNum(data_info.goods_info.grade_discount) > 0">
										<view class="view_benefits">
											<view class="view_benefits_title">
												<text>{{$L('会员尊享专属权益，购物享')}}</text>
												<text>{{data_info.goods_info.grade_discount}}</text>
												<text>{{$L('折~')}}</text>
											</view>
											<view class="go_look" @tap="handle_benefits">
												<text>{{$L('查看权益')}}</text>
												<image :src="img_url + 'site/right_down.png'"></image>
											</view>
										</view>
									</view>
								</block>
							</view>
						</block>
						<block v-else>
							<!-- 商品的具体详细信息 -->
							<div class="goods-detail-price">
								<!-- 商品价格 -->
								<view class="goods_price_new">
									<view class="price_new">
										<view class="new_show_price" v-if="filters.toSplit(filters.toFix(data_info.goods_info.show_price))[0] && filters.toSplit(filters.toFix(data_info.goods_info.show_price))[1] && data_info.goods_info.promotion_type!='p_mbuy'"><text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(data_info.goods_info.show_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(data_info.goods_info.show_price))[1]}}</text></view>
										<view class="new_show_price" v-if="filters.toSplit(filters.toFix(data_info.goods_info.mobile_price))[0] && filters.toSplit(filters.toFix(data_info.goods_info.mobile_price))[1] && data_info.goods_info.promotion_type=='p_mbuy'"><text>{{$L('￥')}}</text><text>{{filters.toSplit(data_info.goods_info.mobile_price)[0]}}</text>.<text>{{filters.toSplit(data_info.goods_info.mobile_price)[1]}}</text></view>
										<view class="new_goods_marketprice" v-if="data_info.goods_info.goods_price"><text>{{$L('原价：')}}</text><text>{{data_info.goods_info.goods_marketprice}}</text></view>
									</view>
									<view class="goods_opt">
										<view class="collection" @tap="favorate">
											<image :src="data_info.is_favorate ? img_url + 'site/shoucang.png' : img_url + 'site/shoucang2.png'"></image>
											<text>{{data_info.is_favorate ? $L('已收藏') : $L('收藏')}}</text>
										</view>
										<view class="share" @tap="showShare">
											<image :src="img_url + 'site/fenxiang.png'"></image>
											<text>{{$L('分享')}}</text>
										</view>
									</view>
								</view>

								<!-- 商品名称和商品介绍 -->
								<view class="goods-detail-name">
									<view :class="!data_info.goods_info.goods_jingle ? 'padding_bottom20' : 'limit_line2'">
										<!-- 手机专享 start -->
										<image v-if="data_info.goods_info.promotion_type=='p_mbuy'" class="exclusive_mobile_phone" :src="img_url + 'site/exclusive_mobile_phone.png'"></image>
										{{data_info.goods_info.goods_name}}
										<!-- 手机专享 end -->
										<!-- <text class="goods_names1">{{data_info.goods_info.goods_name}}</text> -->
									</view>
									<view class="goods-jingle1" v-if="data_info.goods_info.goods_jingle">{{data_info.goods_info.goods_jingle}}</view>
								</view>
								<!-- 会员查看权益 -->
								<!-- 如下活动进行中，也不让其显示
                注：不能有会员等级折扣的活动：手机专享，限时折扣，团购，拼团，阶梯团，预售，优惠套装
                    可以公用：产品组合，满送，店铺优惠券，平台优惠券
            -->
								<block v-if="!data_info.goods_info.promotion_type=='p_mbuy' || !(data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.promotion_start_flag == 2)|| !(data_info.goods_info.promotion_type == 'xianshi' && data_info.goods_info.promotion_run_flag == 1) ||!(promotion_type=='sld_presale' && presaleInfo.pre_run_flag == 2) || !(promotion_type=='pin_ladder_tuan' && !showDefaultBtn) || !(data_info.goods_info.promotion_type == 'pin_tuan') || !data_info.has_bundling_data">
									<view style="width:100%;padding-bottom:30rpx;margin-top:10rpx;" v-if="data_info.grade_info !== undefined && data_info.grade_info.length && filters.toNum(data_info.goods_info.grade_discount) > 0">
										<view class="view_benefits">
											<view class="view_benefits_title">
												<text>{{$L('会员尊享专属权益，购物享')}}</text>
												<text>{{data_info.goods_info.grade_discount}}</text>
												<text>{{$L('折~')}}</text>
											</view>
											<view class="go_look" @tap="handle_benefits">
												<text>{{$L('查看权益')}}</text>
												<image :src="img_url + 'site/right_down.png'"></image>
											</view>
										</view>
									</view>
								</block>
							</div>
						</block>

						<!-- 阶梯团 进度 start -->
						<view class="program" v-if="promotion_type=='pin_ladder_tuan' && ladderPinInfo && ladderPinInfo.sld_sheng_time && ladderPinInfo.sld_sheng_time>0">
							<view class="p_prev">
								<image :src="img_url+'prtl.png'" class="p_img"></image>
							</view>
							<scroll-view class="p_content" :scroll-into-view="scrollTo" scroll-with-animation="true" scroll-x>
								<view>
									<view v-for="(item, index) in ladderInfo" :key="index" class="p_item" :id="(ladder_jt==(index+1))?'scrollTo':''">
										<view class="p_tem_main">
											<view class="p_item_top">
												<view :class="'ladder_jt_price1 ' + ((ladder_jt>=index+1)?'on1':'')">
													<text>{{$L('￥')}}</text>
													<text>{{filters.toSplit(item.pay_money)[0]}}</text>.
													<text>{{filters.toSplit(item.pay_money)[1]}}</text>
												</view>
												<text :class="'ladder_num1 ' + ((ladder_jt>=index+1)?'on2':'')">{{$L('满')}}{{item.people_num}}{{$L('人参团')}}</text>
											</view>
											<view :class="'p_item_bottom ' + ((ladder_jt>=index+1)?'on':'')">
												<view class="p_line">
													<text>{{index+1}}</text>
													<view class="p_line_left_wrap">
														<view class="p_line_left" :style="'width: ' + item.left_pro + '%'"></view>
													</view>
													<view class="p_line_right_wrap">
														<view class="p_line_left" :style="'width: ' + item.right_pro + '%'"></view>
													</view>
												</view>
												<view class="p_item_txt">{{$L('阶梯')}}{{filters.toReplace(index)}}</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
							<view class="p_next">
								<image :src="img_url+'pltr.png'" class="p_img"></image>
							</view>
						</view>
						<!-- 阶梯团 进度 end -->
						<block v-if="data_info.goods_info.promotion_type">
							<block v-if="data_info.goods_info.promotion_type != 'xianshi' && data_info.goods_info.promotion_type != 'tuan' && data_info.goods_info.promotion_type != 'pin_tuan'">
								<div class="goods-detail-price" v-if="!promotion_type">
									<dl>
										<dl>
											<dt>{{$L('￥')}}
												<em>{{data_info.goods_info.show_price}}</em>
											</dt>
											<dd>{{$L('￥')}}{{data_info.goods_info.goods_marketprice}}</dd>
										</dl>

									</dl>
									<span v-if="data_info.goods_info.promotion_type == 'p_mbuy'" class="huodong huodong-mbuy">{{$L('移动专享')}}</span>
								</div>
							</block>

						</block>
						<view @tap.stop="show_spec">
							<div class="goods-detail-item" id="goods_spec_selected" style="display:flex;justify-content:space-between;" @tap="switchSpecifications">
								<div class="itme-name">{{$L('已选')}}</div>
								<div class="item-con" v-if="data_info.goods_info.goods_spec">
									<dl class="goods-detail-sel">
										<dt>
											<span v-for="(specval, specid) in data_info.goods_info.goods_spec" :key="specid" :class="'def_' + specid">{{specval}}</span>
										</dt>
									</dl>
								</div>
								<div class="item-con specification_default" v-else>{{$L('默认')}}</div>
								<view class="item-r-more">
									<image :src="img_url + 'site/right1.png'" mode="widthFix" style="width:12rpx;height:20rpx;"></image>
								</view>

							</div>
						</view>

						<!-- 发货，门店自提 -->
						<view class="deliver_goods">
							<!-- 发货 -->
							<view class="deliver_good">
								<!-- 有发货地时 -->
								<block v-if="data_info.goods_info.city_name">
									<view class="deliver_goods_left">
										<text>{{$L('发货')}}</text>
										<image :src="img_url + 'site/dizhi.png'" mode="aspectFit"></image>
										<text>{{data_info.goods_info.city_name}}</text>
									</view>
									<!-- <view class="express_fee">快递：{{data_info.goods_info.goods_freight == '0.00' ? '包邮' : data_info.goods_info.goods_freight}}</view> -->
                  <view class="express_fee">{{$L('快递')}}</view>
								</block>
								<!-- 无发货地时 -->
								<block v-else>
									<view class="deliver_goods_left">
										<text>{{$L('发货')}}</text>
										<image :src="img_url + 'site/dizhi.png'" mode="aspectFit"></image>
									<!-- 	<view class="express_fee">快递：{{data_info.goods_info.goods_freight == '0.00' ? '包邮' : data_info.goods_info.goods_freight}}</view> -->
                    <view class="express_fee">{{$L('快递')}}</view>
									</view>
								</block>
								<!-- <view class="deliver_goods_sold">{{$L('已售')}}{{data_info.goods_info.goods_salenum}}</view> -->
							</view>
							<!-- 门店自提 -->
							<view class="store_pick_up" v-if="data_info.dian_list > 0" @tap="goStoreInfo">
								<view class="store_pick_left">
									<text>{{$L('门店自提')}}</text>
									<text>{{$L('附近有')}}{{data_info.dian_list}}{{$L('个门店')}}</text>
								</view>
								<image :src="img_url + 'site/right_down1.png'"></image>
							</view>
						</view>

						<!-- 拼团 查看更多 start  拼单-->
						<div class="goods-detail-team teams" v-if="data_info.pin !== undefined && data_info.pin.team !== undefined &&  data_info.pin.team.length > 0">
							<view class="make_group">
								<text class="make_group_num">{{data_info.pin.team.length}}{{$L('人正在拼单，可直接参与')}}</text>
								<view class="make_groip_more" @tap="make_group_more_fun">
									<text>{{$L('查看更多')}}</text>
									<image :src="img_url + 'site/right.png'"></image>
								</view>
							</view>
							<block v-for="(pin_team_item, i) in data_info.pin.team" :key="i">
								<block v-if="!data_info.pin.pinging && pin_team_item.id==data_info.pin.team_id">
									<div :data-time="pin_team_item.endd" v-if="i<=1" class="make_group_content">
										<view class="make_group_content_left">
											<view class="make_group_content_left">
												<image :src="pin_team_item.avatar" :data-id="pin_team_item.id" class="make_group_avator"></image>
												<view :data-id="pin_team_item.id" class="make_group_name">{{pin_team_item.member_name}}</view>
											</view>
										</view>
										<view class="make_group_right">
											<view class="make_group_right1" :data-id="pin_team_item.id">
												<div class="make_group_right1" :data-id="pin_team_item.id">
													<span class="make_group_missing">{{$L('还差')}}<text>{{pin_team_item.sheng}}</text>{{$L('人')}}</span>
													<view class="make_group_end">{{$L('距结束')}}<text>{{pin_team_item.end_time}}</text></view>
												</div>
											</view>
											<view class="make_group_right2" v-if="pin_team_item.is_own" @tap="handleJoinGroup" :data-teamid="pin_team_item.id"
											 :data-isown="pin_team_item.is_own ? true : false">{{$L('我的团')}}</view>
											<view class="make_group_right2" v-else @tap="handleJoinGroup" :data-teamid="pin_team_item.id" :data-isown="pin_team_item.is_own ? true : false">{{$L('去参团')}}</view>
										</view>
									</div>
								</block>
								<block v-else>
									<view :data-time="pin_team_item.endd" v-if="i<=1" class="make_group_content" :tid="pin_team_item.id">
										<view class="make_group_content_left">
											<image :src="pin_team_item.avatar" :data-id="pin_team_item.id" class="make_group_avator"></image>
											<view :data-id="pin_team_item.id" class="make_group_name">{{pin_team_item.member_name}}</view>
										</view>
										<view class="make_group_right">
											<view class="make_group_right1" :data-id="pin_team_item.id">
												<span class="make_group_missing">{{$L('还差')}}<text>{{pin_team_item.sheng}}</text>{{$L('人')}}</span>
												<view class="make_group_end">{{$L('距结束')}}<text>{{pin_team_item.end_time}}</text></view>
											</view>
											<view class="make_group_right2" v-if="pin_team_item.is_own" @tap="handleJoinGroup" :data-teamid="pin_team_item.id"
											 :data-isown="pin_team_item.is_own ? true : false">{{$L('我的团')}}</view>
											<view class="make_group_right2" v-else @tap="handleJoinGroup" :data-teamid="pin_team_item.id" :data-isown="pin_team_item.is_own ? true : false">{{$L('去参团')}}</view>
										</view>
									</view>
								</block>
							</block>
						</div>

						<!-- 拼团 查看更多 end -->

						<!--商品扩展 数据展示  -->
						<view id="goodsExtends">
							<view class="extend-item border-bottom-1px" v-if="(data_info.red !== undefined  &&  data_info.red.length) || (data_info.mansong_info !== undefined && data_info.mansong_info && data_info.mansong_info.rules && data_info.mansong_info.rules.length>0)">
								<text class="label">{{$L('活动')}}</text>
								<view class="item-left">
									<!-- 领券 -->
									<view :class="'activity_con ' + (data_info.mansong_info && data_info.mansong_info.rules && data_info.mansong_info.rules.length>0 ? 'margin_bottom20' : '')"
									 data-model_id="red" @tap.stop="showModal" v-if="data_info.red && data_info.red.length">
										<view class="collect_coupons">
											<text class="label1">{{$L('领券')}}</text>
											<!-- <text class="item-left-con">{{data_info.red.length}}个可领取</text> -->
											<view class="red-show">
												<block v-if="data_info.red.length>2">
													<view v-for="(item, index) in 2" :key="index" class="red-item">
														<image :src="img_url+'goods_detail_red.png'"></image>
														<text v-if="data_info.red[item].redinfo_full > 0">{{$L('满')}}{{data_info.red[item].redinfo_full}}{{$L('减')}}{{data_info.red[item].redinfo_money}}</text>
														<text v-else>{{data_info.red[item].redinfo_money}}{{$L('元优惠券')}}</text>
													</view>
												</block>
												<block v-else>
													<view v-for="(item, index) in data_info.red" :key="index" class="red-item">
														<image :src="img_url+'goods_detail_red.png'"></image>
														<text v-if="item.redinfo_full > 0">{{$L('满')}}{{item.redinfo_full}}{{$L('减')}}{{item.redinfo_money}}</text>
														<text v-else>{{item.redinfo_money}}{{$L('元优惠券')}}</text>
													</view>
												</block>
											</view>
										</view>
										<image style="width:12rpx;height:20rpx;" :src="img_url + 'site/right_down1.png'"></image>
									</view>
									<!-- 满减优惠 -->
									<view class="full_discount" v-if="data_info.mansong_info && data_info.mansong_info.rules && data_info.mansong_info.rules.length>0" @tap="fullGiftBox">
										<text class="full_discount_title">{{$L('满赠')}}</text>
										<view class="full_discount_con">
											<!------------------------------满减--start.-------------------------------  -->
											<view class style="width:458rpx;display:flex;">
												<div class="reduction" :id="Open" v-if="data_info.mansong_info && data_info.mansong_info.rules!=null && data_info.mansong_info.rules.length>0">
													<block v-for="(m_rules_item, idx) in data_info.mansong_info.rules" :key="idx">
														<div class="manjian_goods" v-if="idx < 1">
															<view class="manjian_des_con">
																<block v-if="m_rules_item.price">
																	{{$L('满')}}{{m_rules_item.price}}
																</block>
																<block v-if="m_rules_item.discount">
																	<span>{{$L('减')}}{{m_rules_item.discount}}{{$L('元')}}</span>
																</block>
																<block v-else>
																	;
																</block>

																<block v-if="m_rules_item.gid && m_rules_item.gid > 0 && m_rules_item.mansong_goods_name">,{{$L('赠')}}{{m_rules_item.mansong_goods_name}}{{$L('一个')}}</block>
															</view>
														</div>
													</block>
												</div>
											</view>
											<image style="width:12rpx;height:20rpx;" :src="img_url + 'site/right_down1.png'"></image>
										</view>
									</view>
								</view>
							</view>

							<view class="extend-item border-bottom-1px points_des" v-if="data_info.red.length && data_info.goods_info.max_point > 0">
								<view class="jifen">
									<text class="label">{{$L('积分')}}</text>
									<text class="highest_points">{{$L('购买最高得')}}{{data_info.goods_info.max_point}}{{$L('积分')}}</text>
								</view>
							</view>

							<!-- 服务 -->
							<view class="fuwu_con_des" data-model_id="tag" @tap.stop="showModal" v-if="data_info.goods_info.goods_label && data_info.goods_info.goods_label.length > 0">
								<view class="fuwu_left">
									<view class="fuwu_left_title">{{$L('服务')}}</view>
									<view class="fuwu_left_list">
										<view v-for="(goods_label_value, goods_label_index) in data_info.goods_info.goods_label" :key="goods_label_index"
										 class="fuwu_list_pre" v-if="goods_label_index < 2">
											<image class="fuwu_sel" :src="img_url + 'site/yes.png'"></image>
											<text>{{goods_label_value.label_name}}</text>
										</view>
									</view>
								</view>
								<image class="fuwu_more" :src="img_url + 'site/right1.png'"></image>
							</view>
						</view>

						<!----------优惠套装--------------------------------  -->
						<view :class="kaiguan" v-if="data_info.has_bundling_data">
							<view class="biaoti">
								<span>{{$L('优惠套装')}}</span>
								<em>({{$L('共')}}{{data_info.bundling_data.bundling_count}}{{$L('套')}})</em>
							</view>

							<view v-for="(bl_item, i) in data_info.bundling_data.bundling_array" :key="i" class="titlea" v-if="i < 1">
								<view class="goodsBox Discount">
									<block v-for="(b_goods_array_item, j) in data_info.bundling_data.b_goods_array[bl_item.id]" :key="j" v-if="j < 3">
										<navigator :url="'../goods_detail/goods_detail?gid=' + b_goods_array_item.id" hover-class="none">
											<image style="width:160rpx;height:160rpx;border-radius:15rpx;" :src="b_goods_array_item.image"></image>
										</navigator>
										<block v-if="data_info.bundling_data.b_goods_array[bl_item.id].length < 3">
											<span v-if="j != data_info.bundling_data.b_goods_array[bl_item.id].length-1">+</span>
										</block>
										<block v-else-if="j != data_info.bundling_data.b_goods_array[bl_item.id].length - 1">
											<span>+</span>
										</block>

									</block>
								</view>
								<view class="combination_More" :data-bl_id="bl_item.id" @tap="gmBtn" style="margin-top:20rpx;width:64rpx;">
									<image class="ellipsis_image" :src="img_url + 'site/png.png'" v-if="data_info.bundling_data.b_goods_array[bl_item.id].length > 3"></image>
									<image class="more_image" :src="img_url + 'site/taozhuang_rightdown.png'"></image>
								</view>

							</view>
						</view>
						<!----------------优惠套装---------------------------  -->
						<!--------------------推荐组合---------------------------  -->
						<view :class="kaiguanA" v-if="data_info.has_suite_data">
							<view class="tuijianzuhe">
								<text>{{$L('推荐组合')}}</text>
								<text>（{{$L('组合价：')}}{{$L('￥')}}{{data_info.suite_data[0].total_price}}）</text>
							</view>
							<view v-for="(suite_item, i) in data_info.suite_data" :key="i" class="titlea" v-if="i < 1">
								<view class="recommended_com_con">
									<view class="recommended_combination">
										<block v-for="(suite_goods_item, j) in suite_item.goods" :key="j" v-if="j < 3">
											<navigator :url="'../goods_detail/goods_detail?gid=' + suite_goods_item.gid">
												<view class="combination">
													<image class="combination_image" :src="suite_goods_item.goods_image_url"></image>
													<view class="combination_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(suite_goods_item.goods_marketprice)[0]}}</text>.<text>{{filters.toSplit(suite_goods_item.goods_marketprice)[1]}}</text></view>
												</view>
											</navigator>
											<block v-if="suite_item.goods !== undefined">
												<block v-if="suite_item.goods.length < 3">
													<image class="combination_add" v-if="j != suite_item.goods.length-1" :src="img_url + 'site/add.png'"></image>
												</block>
												<block v-else-if="j != suite_item.goods.length-1">
													<image class="combination_add" :src="img_url + 'site/add.png'"></image>
												</block>
											</block>
										</block>
									</view>
									<view class="combination_More" :data-gids="suite_item.gids" @tap="suite_item_buy" style="margin-top:20rpx;width:64rpx;height: 64rpx;">
										<image class="ellipsis_image" :src="img_url + 'site/png.png'" v-if="suite_item.goods && suite_item.goods.length > 3"></image>
										<image class="more_image" :src="img_url + 'site/taozhuang_rightdown.png'"></image>
									</view>

								</view>
							</view>

						</view>

						<!----------------------推荐组合---------------------------  -->

						<!--商品评价入口  -->
						<view @tap.stop="go_comment" style="overflow: hidden;" id="hash2">
							<div class="goods-detail-comment" id="goodsEvaluation1">
								<div class="title">

									<a id="goodsEvaluation1" href="javascript:void(0);">{{$L('商品评价')}}
										<!-- 有评价 -->
										<block v-if="data_info.comment && data_info.comment.length > 0">
											<block v-if="data_info.comment.length>999" style="font-size:28rpx">(999+)</block>
											<block v-else style="font-size:28rpx">({{data_info.total_comment.all}})</block>
											<span class="rate">{{$L('好评率')}}
												<em>{{data_info.total_comment.good_percent}}%</em>
											</span>
										</block>
										<!-- 无评价 -->
										<block v-else>
											<span class="rate">{{$L('好评率暂无')}}</span>
										</block>

									</a>
									<div class="item-more">
										<text>{{$L('查看更多')}}</text>
										<image :src="img_url + 'site/right.png'" mode="widthFix"></image>
									</div>
								</div>
								
								<div class="content">
									<block v-if="data_info.comment && data_info.comment.length > 0">
										<block v-for="(commentitem, index) in data_info.comment" :key="index">
											<div class="comment-item" v-if="index==0">
												<div class="item-user">
													<div class="user-avatar">
														<image :src="commentitem.member_avatar"></image>
													</div>
													<div class="user-name">
														{{commentitem.geval_frommembername}}
													</div>
													<Rate :disable="true" :score="commentitem.geval_scores*1" :size="25" :padding="5"></Rate>
												</div>

												<div class="item-content">
													<div class="item-text">
														{{commentitem.geval_content}}
													</div>

													<div class="item-reply" v-if="commentitem.geval_explain!=undefined && commentitem.geval_explain.length>0">
														<div class="item-reply-content">
															<span class="item-reply-title">{{$L('回复：')}}</span>
															<span class="item-reply-main">
																{{commentitem.geval_explain}}
															</span>
														</div>
													</div>
												</div>
											</div>
										</block>
									</block>
								</div>
							</div>
						</view>

						<!-- 商品买家秀 -->
						<view class="buy_show" v-if="comment && comment.length > 0">
							<view class="buy_show_top">
								<view class="show_left">
									{{$L('商品买家秀')}}<text>({{commentLength}})</text>
								</view>
								<view class="show_right" @tap="go_buy_show" :data-length="commentLength">
									<text>{{$L('查看更多')}}</text>
									<image :src="img_url + 'site/right.png'"></image>
								</view>
							</view>
							<view class="buy_show_con" :class="comment.length == 1 ? 'buy_show_con1' : ''">
								<block v-for="(item, index) in comment" :key="index">
									<image :src="item.geval_images[0]" v-if="index<4"  mode="aspectFit"></image>
								</block>
							</view>
						</view>
						<!--店铺入口  -->
						<div class="goods-detail-store">
							<view class="goods_detail_store">
								<view class="goods_store_top">
									<view class="goods_store_tl">
										<image class="avatar" :src="data_info.store_info.avatar" mode="aspectFill"></image>
										<view class="goods_store_des">
											<view class="goods_store_name">{{store_name_show}}</view>
											<view class="goods_store_service">
												<text>{{$L('综合体验:')}}</text>
												<view class="star_rating">
													<Rate :disable="true" :score="data_info.store_comment.store_credit_average*1" :size="25" :padding="5"></Rate>
												</view>
											</view>
										</view>
									</view>
									<view class="go_vendor" :data-vid="data_info.store_info.vid" @tap.stop="go_vendor">{{$L('进店逛逛')}}</view>
								</view>
								<view class="goods_store_bottom">
									<view class="gooods_bottom_pre">
										<text>{{data_info.store_comment.store_credit.store_desccredit.text}}</text>
										<text>{{data_info.store_comment.store_credit.store_desccredit.credit}}{{$L('分')}}</text>
										<image :src="data_info.store_comment.store_credit.store_desccredit.credit > 4 ? img_url + 'site/hight.png' : data_info.store_comment.store_credit.store_desccredit.credit < 2 ? img_url + 'site/low.png' : img_url + 'site/middle.png'"></image>
									</view>
									<view class="gooods_bottom_pre">
										<text>{{data_info.store_comment.store_credit.store_servicecredit.text}}</text>
										<text>{{data_info.store_comment.store_credit.store_servicecredit.credit}}{{$L('分')}}</text>
										<image :src="data_info.store_comment.store_credit.store_servicecredit.credit > 4 ? img_url + 'site/hight.png' : data_info.store_comment.store_credit.store_servicecredit.credit < 2 ? img_url + 'site/low.png' : img_url + 'site/middle.png'"></image>
									</view>
									<view class="gooods_bottom_pre">
										<text>{{data_info.store_comment.store_credit.store_deliverycredit.text}}</text>
										<text>{{data_info.store_comment.store_credit.store_deliverycredit.credit}}{{$L('分')}}</text>
										<image :src="data_info.store_comment.store_credit.store_deliverycredit.credit > 4 ? img_url + 'site/hight.png' : data_info.store_comment.store_credit.store_deliverycredit.credit < 2 ? img_url + 'site/low.png' : img_url + 'site/middle.png'"></image>
									</view>
								</view>
							</view>
						</div>
						<view class="tuigoods" id="hash3">
							<view class="tuititle">
								<text class="tui_title_txt">{{$L('店铺推荐')}}</text>
								<view class="tui_title_more" @tap="goShopHomePage">
									<text>{{$L('查看更多')}}</text>
									<image :src="img_url + 'site/right.png'"></image>
								</view>
							</view>
							<view class="tuigoodslist">
								<view v-for="(item, index) in data_info.goods_commend_list" :key="index" class="goods_item" :data-id="item.gid"
								 @tap="goodsDetail">
									<view class="img">
										<image :src="item.goods_image_url"></image>
									</view>
									<view style="display:flex;flex-direction:column;justify-content:space-between;height:122rpx;">
										<text class="goods_name">{{item.goods_name}}</text>
										<view class="g_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(item.show_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(item.show_price))[1]}}</text></view>
									</view>
								</view>
							</view>
						</view>

						<!-- 商品详情页 -->
						<view class="goods_detail_des" >
							<!-- 商品详情标题 -->
							<view class="detail_title">
								<image :src="img_url + 'site/detail_left.png'"></image>
								<text>{{$L('详情')}}</text>
								<image :src="img_url + 'site/detail_right.png'"></image>
							</view>
							<jyf-parser :html="show_rich_text" ref="description" ></jyf-parser>
						
							<!--商品详情页没有数据的提示  -->
							<view class="no_cart_goods" :hidden="show_rich_text?true:false">
								<image :src="img_url+'no_order_list.png'"></image>
								<text>{{$L('抱歉！商家未传详情')}}</text>
							</view>
						</view>

						<!--页面操作提示  -->
						<view class="error-tips" :hidden="is_show_tip==1?false:true"> 
							{{tip_content}}
						</view>

						<view class="goods-err" v-if="data_info.goods_info.goods_state!=1">{{data_info.goods_info.goods_state_str}}</view>

					</view>

					<!-- 服务 标签 展开 窗口  -->
					<view :class="'container-column buydes-dialog-container ' + (showModalStatus_Tag?'on':'')">
						<view class="buydes-dialog-container-top" @tap="hideModal"></view>
						<view :class="'container-column buydes-dialog-container-bottom ' + (showModalStatus_Tag?'on':'')">
							<div class="bbctouch-bottom-mask-top goods-tags-intro-top">
								<text>{{$L('服务')}}</text>
								<view class="model_close_image" @tap="hideModal">
									<image :src="img_url + 'site/close.png'"></image>
								</view>
							</div>
							<div class="bbctouch-bottom-mask-rolling" id="product_tags_roll">
								<div class="goods-tags-intro-list">
									<div v-for="(goods_label_value, goods_label_index) in data_info.goods_info.goods_label" :key="goods_label_index"
									 class="goods-tags-intro-item">
										<div class="tags-item-name">{{goods_label_value.label_name}}</div>
										<div class="tags-item-intro">{{goods_label_value.label_desc}}</div>
									</div>
								</div>
							</div>
						</view>
					</view>

					<!-- 优惠券 展开 窗口  -->
					<view :class="'container-column buydes-dialog-container  ' + (showModalStatus_Red?'on':'')">
						<view class="buydes-dialog-container-top" @tap="hideModal"></view>
						<view :class="'container-column buydes-dialog-container-bottom  ' + (showModalStatus_Red?'on':'') + ' get_pou'">
							<div class="bbctouch-bottom-mask-top goods-tags-intro-top">
								<text>{{$L('领取优惠券')}}</text>
								<view class="model_close_image" @tap="hideModal" style="margin-right: 0;">
									<image :src="img_url + 'site/close.png'"></image>
								</view>
							</div>
							<div class="bbctouch-bottom-mask-rolling" id="product_red_roll">
								<div class="goods-red-intro-list">
									<div class="bbctouch-red-list">
										<scroll-view scroll-y="true" style="height: 810rpx;">
											<ul class="bbctouch-tickets" id="red-list" v-if="data_info.red">
												<li v-for="(reditem, index) in data_info.red" :key="index" class="ticket-item">
													<a class="a" href="javascript:void(0)">
														<div style="display:flex;justify-content:space-between;padding-right:20rpx;box-sizing:border-box;">
															<view style="display:flex;">
																<span class="red_h1"><em>{{reditem.redinfo_money}}</em></span>
																<block v-if="reditem.redinfo_money == reditem.redinfo_full">
																	<span class="red_h2">
																		<em>{{reditem.redinfo_full}}{{$L('元直减')}}</em>
																		<text>{{reditem.redinfo_start_text}}-{{reditem.redinfo_end_text}}</text>
																	</span>
																</block>
																<block v-else>
																	<span class="red_h2">
																		<em v-if="reditem.redinfo_full > 0">{{$L('满')}}{{reditem.redinfo_full}}{{$L('减')}}{{reditem.redinfo_money}}</em>
																		<em v-else>{{reditem.redinfo_money}}{{$L('元优惠券')}}</em>
																		<text>{{reditem.redinfo_start_text}}-{{reditem.redinfo_end_text}}</text>
																	</span>
																</block>
															</view>
															<view class="go_use have_finished" v-if="reditem.red_hasget == reditem.red_limit" data-type="1" @tap="have_finished">{{$L('已抢完')}}</view>
															<view class="go_use get_now" v-else-if="reditem.have < reditem.red_rach_max" @tap.stop="get_red_one"
															 :data-id="reditem.id">{{$L('立即领取')}}</view>
															<view class="go_use" v-else data-type="2" @tap="have_finished">{{$L('已领取')}}</view>
														</div>
													</a>
													<!-- </block> -->
													<p>
														<text :class="(reditem_more && reditem_current == index ? 'reditem_str1' : filters.toLength(reditem.str) < 21 && !reditem_more ? 'reditem_str' : 'reditem_str') + ' '">{{$L('使用规则')}}:{{reditem.str}}</text>
														<image class="reditem_img" :src="reditem_more && reditem_current == index ? img_url + 'site/coupon_down.png' : img_url + 'site/coupon_up.png'"
														 @tap="reditem_more_fun" :data-index="index"></image>
													</p>
													<text class="arc_left" style="width:30rpx;height:30rpx;position:absolute;left:3rpx;top:180rpx;background:#F5F5F5;border-radius:50%;"></text>
													<text class="arc_right" style="width:30rpx;height:30rpx;position:absolute;right:3rpx;top:180rpx;background:#F5F5F5;border-radius:50%;"></text>
												</li>

											</ul>
										</scroll-view>
									</div>
								</div>
							</div>
						</view>
					</view>

					<!-- 分享 -->
					<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap">
						<view class="share-mode">
							<view class="share-img" @tap="prevImg">
								<image :src="shareImg" mode="widthFix"></image>
							</view>
                           <!-- #ifdef  MP-WEIXIN -->
                            <view class="ul">
                            	<view class="item" @tap="downloadImg">
                            		<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
                            		<text>{{$L('下载海报')}}</text>
                            	</view>
                            </view>
							<view class="close" @tap="closeShare">
								<image src="../../static/images/share_close2.png"></image>
							</view>
                           <!-- #endif -->
						   
						   <!-- #ifdef  APP-PLUS -->
						    <view class="ul">
						    	<view class="item" @tap="downloadImg">
						    		<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
						    		<text>{{$L('保存海报')}}</text>
						    	</view>
								<view class="item" @tap="sldShare(2,'WXSceneSession')">
									<image :src="img_url + 'wx_share.png'" mode="widthFix"></image>
									<text>{{$L('微信好友')}}</text>
								</view>
								<view class="item" @tap="sldShare(2,'WXSenceTimeline')">
									<image :src="img_url + 'pyq_share.png'" mode="widthFix"></image>
									<text>{{$L('微信朋友圈')}}</text>
								</view>
						    </view>
							<view class="close" @tap="closeShare">
								<image src="../../static/images/share_close2.png"></image>
							</view>
						   <!-- #endif -->
						   
						<!-- #ifdef H5 -->
						 <view  class="ul">
							<view class="item" @tap="downloadImg">
								<view  class="share_h5_operate_img">
									<image  class="share_h5" :src="img_url + 'zh_cn_hb_tip2.png'" mode="scaleToFill"></image>
								</view>			
								<view  class="share_h5_close_img" @tap="closeShare">
									 <image  class="share_h5" :src="img_url + 'share_close.png'" mode="scaleToFill"></image>	
								</view>	
								<view  class="share_h5_img_bottom">
								</view>
							</view>
						 </view>
						<!-- #endif -->												

						</view>
					</view>

					<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2">
						<view class="share-mode">
							<!-- #ifdef H5 -->
                            <view class="is_h5_public_share" v-if="showWeiXinBrowerTip"  @tap="closeShare">
                            	<image :src="img_url+'wx_share_tip.png'" mode="widthFix"></image>
                            </view>
							<!-- #endif -->
							<view class="share-img"></view>

							<view class="ul">
								<!-- #ifdef H5 -->
								<button  @tap.stop="sldShareBrower" class="item"  v-if="isWeiXinBrower" >
									<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
									<text>{{$L('微信好友')}}</text>
								</button>
								<!-- #endif -->
								
								<!-- #ifdef MP-WEIXIN -->
								<button open-type="share" class="item" >
									<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
									<text>{{$L('微信好友')}}</text>
								</button>
								<!-- #endif -->
								
								<!-- #ifdef APP-PLUS-->
								<button @tap.stop="sldShare(0,'WXSceneSession')" class="item" >
									<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
									<text>{{$L('微信好友')}}</text>
								</button>
								<button @tap.stop="sldShare(0,'WXSenceTimeline')" class="item" >
									<image :src="img_url+'pyq_share.png'" mode="widthFix"></image>
									<text>{{$L('微信朋友圈')}}</text>
								</button>
								<!-- #endif -->
							
								<view class="item" @tap="createhb">
									<image :src="img_url+'createhb.png'" mode="widthFix"></image>
									<text>{{$L('生成海报')}}</text>
								</view>
							</view>

							<view class="close" @tap="closeShare">
								<image src="../../static/images/share_close2.png"></image>
							</view>

						</view>
					</view>

					<view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
							<view class="wx_brower_share_top_wrap">
								<image :src="img_url+'wx_share_tip.png'" mode="widthFix" @tap="closeShare" class="wx_brower_share_img"></image>
						</view>
					</view>

					<view class="team-more-wrap" :hidden="!showMoreGroup" @tap.stop="hideGroup">
						<view class="team-more-group" @tap.stop="emptyHandle">
							<view class="title">{{$L('已发起的团')}}</view>

							<scroll-view class="goods-detail-team" scroll-y v-if="data_info.pin!=undefined">
								<div v-for="(pin_team_item, i) in data_info.pin.team" :key="i" :data-time="pin_team_item.endd" :class="'teams_a ' + pin_team_item.sele_class + ' team_' + pin_team_item.id"
								 :tid="pin_team_item.id">
									<navigator :url="'../found/import?u=/pin_detail_xcx.html&id=' + pin_team_item.id">
										<image mode="widthFix" :src="pin_team_item.avatar" :data-id="pin_team_item.id" @tap></image>
										<div :data-id="pin_team_item.id" @tap class="fl">
											<span class="team_item_h2">{{pin_team_item.member_name}}</span>
											<span class="team_item_h3" v-if="pin_team_item.member_areainfo">{{pin_team_item.member_areainfo}}</span>
										</div>
									</navigator>
									<block v-if="data_info.pin.pinging">
										<block v-if="pin_team_item.is_own">
											<span :data-id="pin_team_item.id" :data-sele_class="pin_team_item.sele_class" :data-pin_ping="data_info.pin.pinging"
											 @tap="pick_team" class="team_item_h6 own"></span>
										</block>
										<block v-else>
											<span :data-id="pin_team_item.id" :data-sele_class="pin_team_item.sele_class" :data-pin_ping="data_info.pin.pinging"
											 @tap="pick_team" class="team_item_h6 oth"></span>
										</block>
									</block>
									<block v-else>
										<span :data-id="pin_team_item.id" :data-sele_class="pin_team_item.sele_class" :data-pin_ping="data_info.pin.pinging"
										 @tap="pick_team" class="team_item_h6"></span>
									</block>
									<navigator :url="'../found/import?u=/pin_detail_xcx.html&id=' + pin_team_item.id">
										<div class="fr" :data-id="pin_team_item.id" @tap>
											<span class="team_item_h4">{{$L('还差')}}{{pin_team_item.sheng}}{{$L('人成团')}}</span>
											<span class="team_item_h5">{{pin_team_item.end_time}} {{$L('后结束')}}</span>
										</div>
									</navigator>
								</div>
							</scroll-view>
						</view>
					</view>

					<!-- 会员权益弹框 -->
					<view v-if="benefits_model" class="benefits_model" @touchmove.stop.prevent="moveHandle">
						<view class="benefts_model_top">
							<text>{{$L('会员专属权益')}}</text>
							<view class="model_close_image" @tap="hidden_mask">
								<image :src="img_url + 'site/close.png'" style="margin-right: 20rpx;"></image>
							</view>
						</view>
						<scroll-view scroll-y="true" v-if="data_info.grade_info" class="grader_list">
							<view class="grader_title">{{$L('会员专属价')}}</view>
							<view class="grade_price_list">
								<view v-for="(item, index) in grade_info_list" :key="index" class="grader_price_pre">
									<image :src="img_url + 'site/member_bg.png'"></image>
									<view class="grader_pre_con">
										<view class="grader_pre_top">
											<text class="grade_name">{{item.grade_name}}{{$L('会员尊享会员价')}}</text>
											<view class="goods_price">
												<text>{{$L('￥')}}</text><text>{{filters.toSplit(filters.toFix(item.goods_price))[0]}}</text>.<text>{{filters.toSplit(filters.toFix(item.goods_price))[1]}}</text>
											</view>
										</view>
										<view class="grader_pre_bottom">{{$L('可享受最高级别会员权益，购物享')}}{{item.grade_discount / 10}}{{$L('折')}}</view>
									</view>
									<image class="grader_img1" :src="item.grade_img"></image>
								</view>
							</view>
							<view class="grader_tips">
								<image :src="img_url + 'site/care.png'"></image>
								<text>{{$L('实际优惠价格以结算中心结果为准')}}</text>
							</view>
						</scroll-view>
					</view>
					<!-- 满赠弹框 -->
					<view v-if="full_gift_box" class="full_gift_box" @touchmove.stop.prevent="moveHandle">
						<view class="full_gift_title">
							<text>{{$L('满赠')}}</text>
							<view class="model_close_image" @tap="hidden_mask">
								<image :src="img_url + 'site/close.png'"></image>
							</view>
						</view>
						<scroll-view class="full_gift_con" v-if="data_info.mansong_info && data_info.mansong_info.rules && data_info.mansong_info.rules.length"
						 scroll-y="true">
							<view class="full_gift_tips">
								<text>{{$L('活动时间：')}}{{filters.getDateTime(data_info.mansong_info.start_time)}}{{$L('至')}}{{filters.getDateTime(data_info.mansong_info.end_time)}}</text>
							</view>
							<view class="full_gift_list">
								<view v-for="(item, index) in data_info.mansong_info.rules" :key="index" class="full_gift_pre" @tap="handleGoodsDetail(item,$event)"
								 :data-gid="item.gid">
									<view class="gift_tips"></view>
									<view class="gift_goods_name">
										{{$L('满')}}{{item.price}}{{$L('减')}}<text>{{item.discount}}</text>
										<block v-if="item.gid && item.gid > 0 && item.mansong_goods_name">
											<text>,{{item.mansong_goods_name}}；</text>
										</block>
									</view>
									<view class="line1"></view>
									<image :src="item.goods_image_url" class="gify_goods_image"></image>
								</view>
							</view>
							<view :class="'full_tips_bottom ' + (filters.toLength(data_info.mansong_info.remark) > 50 ? 'full_tips_bottom1' : '') + ' '">{{data_info.mansong_info.remark}}</view>
						</scroll-view>
					</view>

					<!-- 参与拼单弹框 -->
					<view class="join_group" v-if="join_group" @touchmove.stop.prevent="moveHandle">
						<view class="join_group_title">
							<text>{{isown ? $L('我的拼团') : $L('参与拼单')}}</text>
							<image :src="img_url + 'site/close.png'" @tap="hidden_mask"></image>
						</view>
						<view class="join_group_content">
							<view class="join_group_des">
								<view class="group_des_title">{{$L('参与')}}{{GroupInfo.buyer_name}}{{$L('的拼单')}}</view>
								<view class="group_des_miss">{{$L('还差')}}<text>{{GroupInfo.cha}}</text>人</view>
							</view>
							<view class="join_group_time">
								<text>{{$L('距离结束')}}</text>
								<text>{{single_player}}</text>
							</view>
							<view class="join_group_pro">
								<view v-for="(item, index) in GroupList" :key="index" class="join_group_pre" v-if="index < 1">
									<image :src="item.avatar"></image>
									<text v-if="item.leader == 1">{{$L('团长')}}</text>
								</view>
								
									<view class="add_group" @tap.stop="showShare" v-if="!isown">
										<image :src="img_url + 'site/add_group.png'"></image>
									</view>
							</view>
							<image class="handleAddGroup" v-if="!isown" :data-id="GroupInfo.id" @tap="switchSpecifications" data-type="join_group"
							 :src="img_url + 'site/join_group.png'"></image>
						</view>
					</view>

					<!-- 正在拼单--查看更多弹框 -->
					<view class="make_order_more" v-if="make_group_more && groupMoreList && groupMoreList.length > 0" @touchmove.stop.prevent="moveHandle">
						<view class="make_order_title">
							<text>{{$L('正在拼单')}}</text>
							<image :src="img_url + 'site/close.png'" @tap="hidden_mask"></image>
						</view>
						<scroll-view class="make_order_content" scroll-y>
							<view v-for="(pin_team_item, index) in groupMoreList" :key="index" class="make_order_pre">
								<view class="make_order_pre_left">
									<image class="make_order_image" :src="pin_team_item.avatar"></image>
									<view class="make_order_des">
										<view class="make_order_des_top">
											<text>{{pin_team_item.member_name}}</text>
											<text>{{$L('还差')}}{{pin_team_item.sheng}}{{$L('人')}}</text>
										</view>
										<view class="make_order_des_bot">
											{{$L('剩余')}} <text id="make_order_des_pre">{{pin_team_item.gTime}}</text>
										</view>
									</view>
								</view>
								<view class="my_group" v-if="pin_team_item.is_own" :data-pinging="groupMoreInfo.pinging" @tap="handleJoinGroup"
								 :data-teamid="pin_team_item.id" :data-isown="pin_team_item.is_own ? true : false">{{$L('我的团')}}</view>
								<view class="my_group" v-else @tap="handleJoinGroup" :data-pinging="groupMoreInfo.pinging" :data-teamid="pin_team_item.id"
								 :data-isown="pin_team_item.is_own ? true : false">{{$L('去参团')}}</view>
							</view>
						</scroll-view>
						<view class="group_pre_num">{{$L('仅显示10个正在拼单的人')}}</view>
					</view>

				</view>
			</scroll-view>
		</view>
		<common title="$L('商品详情')" :gid="gid*1" :gids="gids"></common>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
	import {
		tsGoodsInit
	} from '../../utils/tsInit.js';
	import jyfParser from "@/components/jyf-parser/jyf-parser";

	// 加载js
	import {
		run_clock,
		getSceneParam
	} from "../../utils/common";
	import Rate from "../../component/Rate/Rate";
	import uniSwiperDot from "@/components/uni-swiper-dot.vue";
	var graceRichText = require("../../libs/richText.js");

	// 内容 模板 高度
	let animationShowHeight = 200;
	let img_url = getApp().globalData.img_url; //引用全局变量 图片域名

	//提示事件
	var errorTipsShow = function(that, err_con) {
		that.setData({
			is_show_tip: 1,
			tip_content: err_con
		});
		setTimeout(function() {
			that.setData({
				is_show_tip: 0
			})
		}, 2000);
	};
	var get_goods_info = function(that) {
		let {
			intervalId
		} = that;
		wx.request({
			url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_detail',
			data: {
				gid: that.gid,
				key: wx.getStorageSync('token') ? wx.getStorageSync('token') : wx.getStorageSync('uuid'),
			},
			dataType: 'json',
			success: function(result) {
				if (result.data.code == 200) {
					if(result.data.datas.error){
						uni.showToast({
							title:result.data.datas.error,
							icon:'none',
							duration:1000
						})
						setTimeout(function(){
							uni.navigateBack()
						},15000)
					}else{
						that.setData({
							isDataLoading: true
						})
						//获取店铺id
						that.setData({
							vid: result.data.datas.goods_info.vid
						})
						
						that.setData({
							grade_info_list: result.data.datas.grade_info.reverse()
						})
						//轮播图
						let goods_image = result.data.datas.goods_image;
						let rotationChartImage = goods_image.split(',');
						let rotationChartImage_all = goods_image.split(',');
						if(result.data.datas.goods_info.video_url){
							rotationChartImage_all.push(rotationChartImage[0]);
						}
						that.setData({
							rotationChartImage: rotationChartImage,
							rotationChartImage_all:rotationChartImage_all
						})
						
						// 限时折扣活动，添加倒计时 进行中
						if (result.data.datas.goods_info.promotion_type == 'xianshi' && result.data.datas.goods_info.promotion_run_flag ==
							1) {
							intervalId.push(run_clock(that, result.data.datas.goods_info.promotion_end_time));
						}
						// 限时折扣未开始
						if (result.data.datas.goods_info.promotion_type == 'xianshi' && result.data.datas.goods_info.promotion_run_flag ==
							0) {
							intervalId.push(run_clock(that, result.data.datas.goods_info.promotion_start_time));
						}
						
						// 拼团 已成团 数据改动 添加 选中状态
						var pin_tuan_data = result.data.datas.pin;
						if (pin_tuan_data != undefined) {
							if (pin_tuan_data && pin_tuan_data.team && pin_tuan_data.team.length > 0 && !pin_tuan_data.pin_ping) {
								pin_tuan_data.team.forEach(function(item, key) {
									if (item.id == that.team_id) {
										item.sele_class = 'on';
									} else {
										item.sele_class = 'off';
									}
								});
								if (that.team_id) {
									pin_tuan_data.team_id = that.team_id;
									pin_tuan_data.sld_tuan_status = 0;
								}
							}
						}
						
						
						let data_info = result.data.datas;
						if (data_info.goods_info.video_url) {
							let base = getApp().globalData.ser_url.replace('/cmobile', '');
							data_info.goods_info.video_url = data_info.goods_info.video_url;
							that.setData({
								autoplay: false
							})
						}
						
						//购物车商品数量
						that.setData({
							cart_count: result.data.datas.cart_count
						});
						
						// 触发倒计时
						if ((result.data.datas.goods_info.promotion_type == 'xianshi' && result.data.datas.goods_info.promotion_run_flag ==
								1) ||
							result.data.datas.goods_info.promotion_type == 'tuan' ||
							result.data.datas.goods_info.promotion_type == 'pin_tuan'
						) {}
						
						//团购活动时间倒计时
						if (result.data.datas.goods_info.promotion_type == 'tuan') {
							if (result.data.datas.goods_info.promotion_start_flag == 1) { //未开始
								intervalId.push(run_clock(that, result.data.datas.goods_info.promotion_start_time));
							} else if (result.data.datas.goods_info.promotion_start_flag == 2) { //进行中
								intervalId.push(run_clock(that, result.data.datas.goods_info.promotion_end_time));
							}
						}
						
						//拼团倒计时
						if (result.data.datas.goods_info.promotion_type == 'pin_tuan' && data_info.pin != undefined && data_info.pin) {
							if (data_info.pin.team && data_info.pin.team.length > 0) {
								let team_date = data_info.pin.team;
								team_date.map(item => {
									let date = new Date(item.endd);
									let tmp_interval_id = setInterval(function() {
										let nowtime = new Date();
										let time = date - nowtime;
										let day = parseInt(time / 1000 / 60 / 60 / 24);
										let hour = parseInt(time / 1000 / 60 / 60 % 24);
										let minute = parseInt(time / 1000 / 60 % 60);
										let seconds = parseInt(time / 1000 % 60);
										if (day.toString() && day.toString().length < 2) {
											day = '0' + day;
										}
										if (hour.toString() && hour.toString().length < 2) {
											hour = '0' + hour;
										}
										if (seconds.toString() && seconds.toString().length < 2) {
											seconds = '0' + seconds;
										}
										if (minute.toString() && minute.toString().length < 2) {
											minute = '0' + minute;
										}
										let gtime = '';
										gtime += day + ':' + hour + ':' + minute + ':' + seconds
										item.end_time = gtime;
										that.setData({
											data_info,
										})
									}, 1000);
									that.intervalId.push(tmp_interval_id)
									that.setData({
										intervalId: that.intervalId,
									});
								})
							}
						
							// 拼团距结束倒计时
							var endtime = new Date(data_info.pin.sld_end_time);
							var starttime = new Date(data_info.pin.sld_start_time * 1000);
							var type = 1; //活动未开始
							var ddd = setInterval(function() {
								var nowtime = new Date();
								var time = starttime - nowtime;
								if (time < 0) {
									type = 2; //活动进行中
									starttime = endtime;
									time = starttime - nowtime;
								}
								var day = parseInt(time / 1000 / 60 / 60 / 24);
								var hour = parseInt(time / 1000 / 60 / 60 % 24);
								// hour = hour + day * 24;
								var minute = parseInt(time / 1000 / 60 % 60);
								var seconds = parseInt(time / 1000 % 60);
								day = day > 9 ? day : '0' + day;
								hour = hour > 9 ? hour : '0' + hour;
								minute = minute > 9 ? minute : '0' + minute;
								seconds = seconds > 9 ? seconds : '0' + seconds;
						
								that.setData({
									day: day,
									hours: hour,
									minutes: minute,
									seconds: seconds,
								})
							}, 1000);
							that.intervalId.push(ddd)
							that.setData({
								intervalId: that.intervalId,
							});
						}
						
						//商品曝光
						let gids = [];
						data_info.goods_commend_list.forEach(el => {
							gids.push(el.gid);
						});
						that.setData({
							gids
						});
						that.setData({
							data_info,
							store_name_show: data_info.store_info.store_name
						});
						var red_list = result.data.datas.red;
						if (red_list) {
							// 优惠券倒计时
							let {
								intervalId
							} = that;
							for (var i = 0; i < red_list && red_list.length; i++) {
								var red_item_end_str = red_list[i].red_receive_end_text;
								var clock_i = 'red_clock.' + red_list[i].id;
								intervalId.push(run_clock(that, red_item_end_str, clock_i));
							}
							that.setData({
								intervalId
							});
						}
						
						let promotion_type = result.data.datas.goods_info.promotion_type;
						let gid = that.gid;
						if (promotion_type) {
							that.setData({
								promotion_type: promotion_type
							})
						}
						// 预售 start
						if (promotion_type == 'sld_presale') {
							getPresaleInfo(that, gid);
						}
						// 预售 end
						
						// 阶梯团 start
						if (promotion_type == 'pin_ladder_tuan') {
							getLadderInfo(that, gid);
						}
						// 阶梯团 end
						if (promotion_type == 'xianshi') {
							let num = Number(result.data.datas.goods_info.lower_limit);
							that.setData({
								buy_num: num,
								lower_limit: num
							})
						}
						
						// 秒杀活动 start
						if(promotion_type == 'seckill'){
							that.secKillInfo = result.data.datas.seckill;
							if(that.secKillInfo.activity_state == 2){
								that.isSeckill = 1;
							}else{
								that.isSeckill = 0;
							}
							that.secCountDown();
						}
						// 秒杀活动 end
						
					}
				} else {
					//如果查不到商品，则跳转到上一页
					wx.showModal({
						title: that.$L('操作提示'),
						content: result.data.datas.error,
						showCancel: false,
						confirmColor: '#333',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack({
									delta: 1
								})
							}
						}
					})
				}
			},
			complete: (res) => {
				wx.hideLoading();
				// 加入统计信息
				let vid = res.data.datas.store_info.vid;
				flowstat(vid, that.gid);
			}
		})

	}

	function flowstat(vid, gid) {
		let url = getApp().globalData.ser_url
		wx.request({
			url: url + '/index.php?app=vendor&mod=ajax_flowstat_record',
			data: {
				vid,
				gid,
				app_param: 'goods',
				mod_param: 'index'
			},
			success: function(res) {}
		})
	}

	// 预售获取商品详情
	function getPresaleInfo(that, gid) {
		wx.request({
			url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_detail&sld_addons=presale',
			data: {
				gid: gid,
			},
			success: res => {
				if (res.data.status == 200) {
					let showDefaultBtn = true;
					let start_time = res.data.data.pre_start_time;
					showDefaultBtn = isStart(start_time);
					that.setData({
						presaleInfo: res.data.data,
						showDefaultBtn: showDefaultBtn,
						max_num: res.data.data.pre_max_buy,
						activity_goods_storage: res.data.data.goods_stock
					})
				} else {
					wx.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				}
			}
		})
	}

	// 阶梯团获取商品详情
	let jtt_tiem = 0;
	let jtt_timer = null;

	function getLadderInfo(that, gid) {
		wx.request({
			url: getApp().globalData.ser_url + '/index.php?app=index&mod=goods_detail&sld_addons=pin_ladder',
			data: {
				gid: gid,
				key: that.key,
			},
			success: res => {
				if (res.data.status == 200) {
					let ladderPinInfo = res.data.data.pin_info;
					let all_num = ladderPinInfo && ladderPinInfo.sld_all_num ? parseInt(ladderPinInfo.sld_all_num) : 0;
					let already_num = ladderPinInfo && ladderPinInfo.sld_already_num ?  parseInt(ladderPinInfo.sld_already_num) : 0;
					let pro = all_num > already_num ? (already_num / all_num) * 100 : 100; // 参团进度
					jtt_tiem = ladderPinInfo && ladderPinInfo.sld_sheng_time ? parseInt(ladderPinInfo.sld_sheng_time) : '';
					

					let ladderInfo = res.data.data.ladder_info;
					let jt = 0; // 进行到的阶梯
					for (var i = 0; i < ladderInfo && ladderInfo.length; i++) {
						var el = ladderInfo[i];
						if (already_num >= el.people_num) {
							jt = i + 1;
						} else {
							break;
						}
					}

					let prev = 0;
					ladderInfo.forEach((el, i) => {
						let now = parseInt(el.people_num);
						el.left_pro = (jt >= i + (jt == 0 ? 0 : 1)) ? (already_num >= now ? 100 : ((already_num - prev) / now) * 100) :
							0;
						el.right_pro = jt >= i + 1 ? (already_num > now ? 100 : 0) : 0;
						prev = now;
					})

					let showDefaultBtn = true;
					let start_time = ladderPinInfo.start_time;
					showDefaultBtn = isStart(start_time);

					if (ladderPinInfo && ladderPinInfo.sld_sheng_time && ladderPinInfo.sld_sheng_time < 0) {
						is_show_default_btn = true
					}

					if (showDefaultBtn) {
						that.jtt_start_time = start_time
						that.jtt_start_time_out();
					} else {
						if (jtt_tiem > 0) {
							that.jtt_time_out();
						}
					}

					ladderPinInfo.pro = pro;
					that.setData({
						ladderPinInfo: ladderPinInfo,
						ladderInfo: ladderInfo,
						ladder_jt: jt,
						scrollTo: 'scrollTo',
						showDefaultBtn: showDefaultBtn,
						max_num: res.data.data.pin_info.sld_max_buy,
						activity_goods_storage: res.data.data.pin_info.sld_stock
					})
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			}
		})
	}

	function isStart(time) {
		let now = new Date().getTime();
		let start_time = new Date(time * 1000).getTime();
		return start_time > now;
	}

	var ify = true;
	var ifyA = true;
	var open = true;
	var isClickKeFu = false;
	export default {
		components: {
			Rate,
			uniSwiperDot,
			jyfParser
		},
		data() {
			return {
				ladderPinInfo:'',
				isWeiXinBrower:false,//是否微信浏览器
				showWeiXinBrowerTip:false,//微信浏览器分享的提示操作
				show_rich_text: '', //商品详情富文本展示
				store_name_show: '',
				indicatorDots: false, //是否显示指示点
				autoplay: false, //轮播图是否自动滚动
				interval: 5000,
				duration: 1000,
				userInfo: {},
				gid: 0,
				goods_detail_info: '',
				is_show_spec: false,
				buy_num: 1,
				key: '',
				is_show_tip: 0,
				tip_content: '', //错误提示内容
				cart_count: 0, //购物车数量
				animationData: "", //动画 数据
				showModalStatus: false, //是否展示 服务标签 内容 窗口
				cktext: this.$L('查看更多'),
				cktextA: this.$L('查看更多'),
				// 倒计时
				day: '00',
				hours: '00',
				minutes: '00',
				seconds: '00',
				sanjiao: 'rotate',
				kaiguan: 'other',
				sanjiaoA: 'rotateA',
				kaiguanA: 'otherA',
				Open: '',
				team_id: 0,
				getPresaleInfo: '',
				jtt_time_txt: '00:00:00',
				scrollTo: '',
				lower_limit: '',
				showDefaultBtn: true,
				max_num: 0, // 最大购买限制
				activity_goods_storage: 0, // 活动库存
				shareWrap: false, // 展示分享弹层
				shareWrap2: false, // 展示分享弹层
				shareImg: '', // 分享图片
				img_url: getApp().globalData.img_url,
				showMoreGroup: false,
				live_id: '', // 直播id
				isIphoneX: 0,
				intervalId: [], //定时器id数组
				presaleInfo: '',
				benefits_model: false, //查看权益弹框
				comment: [], //评论
				commentLength: 0,
				systemInfo: {}, //用于存储窗口信息 windowHeight 、 windowWidth等
				scrollToHeight: 0, //scroll-view的高度
				toView: 'default', //用于存储跳转的id
				NavIndex: 0, //nav默认选中第一个,
				Nav: false, //Nav是否显示
				vid: '', //店铺id
				ladderRegimentDay: 0, //天
				ladderRegimentHour: 0, //时
				ladderRegimentMinute: 0, //分钟
				ladderRegimentSecond: 0, //秒
				full_gift_box: false, //满赠弹框，
				join_group: false, //参与拼团弹框
				make_group_more: false, //正在拼单--查看更多弹框
				teamId: '', //拼团，团id
				GroupInfo: {}, //当前拼团基信息
				GroupList: [], //当前拼团列表信息
				isown: false, //是否为发起人，即 我的团
				groupMoreList: [], //正在拼单更多
				systimestamp: 0, //倒计时,
				Specifications: false, //选择规格弹框
				tips_show: false, //三点分享更多按钮
				single_player: '', //拼单弹框中的倒计时
				rotationChartImage: [], //轮播图数组
				rotationChartImage_all:[],//主要用做计算轮播图的数量
				switchSpecifications_add: '0', //通过点击页面底栏，加入购物车，立即购买等，显示规格弹框
				isNav: false, //默认未被点击
				reditem_more: false, //优惠券更多规则
				reditem_current: -1, //当前点击优惠券更多规则的下标
				rectTop1: -1, //评价元素到页面顶部的top值
				rectTop2: -1, //推荐元素到页面顶部的top值
				rectTop3: -1, //详情元素到页面顶部的top值
				groupid: -1, //参团的团id
				groupMoreInfo: {}, //拼团的查看更多的拼团信息
				isDataLoading: false, //详情页数据是否加载完毕
				uuid: '', //用户唯一标识， 未登录
				tips: [{
						tips_img: img_url + 'site/shouye.png',
						tips_name: this.$L('首页'),
						tips_link: '/pages/index/index',
						type: 'switchTab'
					},
					{
						tips_img: img_url + 'site/cart.png',
						tips_name: this.$L('购物车'),
						tips_link: '/pages/cart/cart',
						type: 'switchTab'
					},
					{
						tips_img: img_url + 'site/gerenzhongxin.png',
						tips_name: this.$L('个人中心'),
						tips_link: '/pages/user/user',
						type: 'switchTab'
					}
				],
				showMask: false, //蒙层遮罩层
				spec_loading: false,
				data_info: {},
				grade_info_list: [],
				transparent_mask: false, //透明遮罩蒙层
				jtt_start_timer: null,
				showModalStatus_Tag: false,
				showModalStatus_Red: false,
				promotion_type: '',
				current:0,
				mode:'nav',	
				bottomSateArea:getApp().globalData.bottomSateArea?'122rpx':'',//iphone手机底部一条黑线的高度
				stat_end:1,  //终端，默认为1，pc端
				showControls:true,//是否显示轮播角标
				secKillInfo:{}, //秒杀活动信息
				secKillDay:'00', //秒杀活动天
				secKillHr:'00', //秒杀活动时
				secKillMin:'00', //秒杀活动分
				secKillSec:'00' ,//秒杀活动秒
				secInterval:'', //定时器
				isSeckill:0 , //是否是秒杀活动
				gids:[]
			}
		},

		
		onLoad: function(option) {		
			uni.setNavigationBarTitle({
        title: this.$L('商品详情')
      });
			/**
			*判断推手分享进入详情 
			* @ww 11-14
			*/
			// #ifdef MP
			if (option.scene) {
				let url = decodeURIComponent(option.scene);
				if (getSceneParam(url, 'gid')) {
					option.gid = getSceneParam(url, 'gid');
				}
				if (getSceneParam(url, 's')) {
					option.shareId = getSceneParam(url, 's');
					this.setData({
						shareId: option.shareId
					})
					tsGoodsInit(option.gid, option.shareId) // 推手的相关处理
				}
			}
			// #endif
			// #ifdef H5||MP-WEIXIN
			  if (option.s) {
			  	this.setData({
			  		shareId: option.s
			  	});
				tsGoodsInit(option.gid, option.s) // 推手的相关处理
			  }
			// #endif
			
			
			
			this.setData({
				gid: option.gid,
				isIphoneX: false
			});
			if (option.team_id) {
				this.setData({
					team_id: option.team_id
				});
			}

			if (option.live_id) {
				this.setData({
					live_id: option.live_id
				})
			}
			wx.showLoading({
				title: this.$L('加载中'),
			})

			let key = wx.getStorageSync('token');
			if (!key) {
				let uuid = wx.getStorageSync('uuid');
				if (uuid) {
					this.setData({
						uuid: uuid
					})
				} else {
					let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app
					wx.setStorageSync('uuid', uuid)
				}
			} else {
				this.setData({
					key: wx.getStorageSync('token')
				})
			}
			
			// 类似锚点效果
			let that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.setData({
						systemInfo: res //给systemInfo赋值   高度
					})
				}
			})
			this.getPlatform();
		},
		onReady: function() {
			var key = wx.getStorageSync('token')
			if (key) {
				//将可以存到data里
				this.setData({
					key: key,
				})
			}
			// 页面初次渲染完成
			//获取商品的详细图片展示
			var that = this;
			wx.request({
				url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_body_xcx',
				data: {
					gid: that.gid,
				},
				dataType: 'json',
				success: function(result) {
					if (result.data.state == 200) {
						that.setData({
							goods_detail_info: result.data.goods_detail.goods_body,
							show_rich_text: result.data.goods_detail.goods_body
						});
					}
					// if (result.data.state == 200) {
					//       console.info(result.data.goods_detail.goods_body);
					//       let body = result.data.goods_detail.goods_body;
					//       body = body.replace(/<br \/>/g,'');
					//       console.info(body);
					//       that.setData({
					//        goods_detail_info: result.data.goods_detail.goods_body,
					//        show_rich_text: body
					//       });
					//      }
				}
			});
			
			//添加历史记录（只有用户登录的情况下才可以）
			var history_data = this;
			if (history_data.key) {
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=addUserBrowserGoods_xcx',
					data: {
						gid: history_data.gid,
						'key': key
					},
					dataType: 'json',
					success: function(result) {}
				});
			}
			this.getShareImg();
			this.get_comments();

		},
		onShow: function() {
			get_goods_info(this);
			// #ifdef H5			
			this.isWeiXinBrower = this.$isWeiXinBrower();
			// #endif
			this.getPlatform();
		},
		methods: {
			//秒杀活动，倒计时： 秒转换为天时分秒，并倒计时 start
			secCountDown(){
				var that = this;
				let countTime = 0;
				if(that.secKillInfo.activity_state == 1){	//距离开始时间，活动未开始
					countTime = that.secKillInfo.distince_start_time;	//活动开始时间	秒
				}else if(that.secKillInfo.activity_state == 2){
					countTime = that.secKillInfo.distince_end_time; //活动结束时间	秒
				}
				that.secInterval = setInterval(()=>{
					if(countTime == 0){
						//倒计时结束，清除倒计时
						clearInterval(that.secInterval);
						get_goods_info(that);
					}else{
						countTime--;
						let day = parseInt(countTime / 60 / 60 / 24);
						let hr = parseInt(countTime / 60 / 60 % 24);
						let min = parseInt(countTime / 60 % 60);
						let sec = parseInt(countTime % 60);
						that.secKillDay = day > 9 ? day : '0' + day;
						that.secKillHr = hr > 9 ? hr : '0' + hr;
						that.secKillMin = min > 9 ? min : '0' + min;
						that.secKillSec = sec > 9 ? sec : '0' + sec;
					}
				},1000)
			},
			// 秒杀活动倒计时 end
			// 秒杀活动，提醒我,及取消提醒 start
			secKillPreview(){
				var that = this;
				let key = wx.getStorageSync('token');
				if (!key) {
					getApp().globalData.goLogin();
					return;
				}else{
					wx.request({
						url: getApp().globalData.ser_url + '/index.php?app=seckill&mod=prepareNotice&sld_addons=seckill',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							prepare_id:that.secKillInfo.id,
							key:key
						},
						dataType: 'json',
						success: function(result) {
							if (result.data.state == 200) {
								wx.showToast({
									title:result.data.msg,
									icon:'none',
									duration:700
								})
								that.secKillInfo.is_notice = result.data.data.is_notice;
							}else{
								wx.showToast({
									title:result.data.msg,
									icon:'none',
									duration:700
								})
							}
						}
					})
				}
			},
			// 秒杀活动，提醒我,及取消提醒 end
			//视频播放事件，控制轮播角标隐藏
			playVideo(){
				this.showControls=false
			},
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
			onShareAppMessage: function() {
				return {
					title: this.data_info.goods_info.goods_name,
					path: '/pages/goods_detail/goods_detail?gid='+this.gid,
					imageUrl: this.rotationChartImage[0]
				};
			},
			onShareTimeline: function() {
				return {
					title: this.data_info.goods_info.goods_name,
					path: '/pages/goods_detail/goods_detail?gid='+this.gid,
					imageUrl: this.rotationChartImage[0]
				};
			},
			//浏览器分享
			  sldShareBrower() {
				  this.showWeiXinBrowerTip = true;
				  this.shareWrap2 = false;
				 this.$weiXinBrowerShare(1,{
				 	 title:this.data_info.goods_info.goods_name,
				 	 desc:this.data_info.goods_info.goods_jingle,
				 	 link:this.data_info.share_url,
				 	 imgUrl:this.rotationChartImage[0],
				 });
			  },
			 
			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare: function(type,scene) {
				let shareData = {};
				if(type == 0){
					shareData.href = this.data_info.share_url;
					shareData.title = this.data_info.goods_info.goods_name;
					shareData.summary = this.data_info.goods_info.goods_jingle;
					shareData.imageUrl = this.data_info.goods_info.share_goods_img;
				}else if(type == 2){
					shareData.imageUrl = this.shareImg;
				}
				this.$weiXinAppShare(type,scene,shareData);
				this.closeShare();//关闭分享
			},
				
			change: function(e) {
				this.current = e.detail.current
				if(this.data_info.goods_info.video_url&&e.detail.current==0){
					this.showControls=false
				}else{
					this.showControls=true
				}
			},
			//执行以下函数后跳转到固定位置
			handleNav: function(e) {
				let that = this;
				let hash = e.target.dataset.hash //获取传过来的data-hash参数
				let NavIndex = e.target.dataset.index; //获取当前index
				that.setData({
					toView: hash,
					NavIndex: NavIndex,
					isNav: NavIndex == 0 ? false : true, //nav被点击了，重新设置锚点需要滚动的高度
				})
			},
			//页面滚动，控制导航条的显示及隐藏
			scroll: function(e) {
				let that = this;
				if (e.detail.scrollTop > 100) { //让导航条切换
					that.setData({
						Nav: true
					})
				} else {
					that.setData({
						Nav: false
					})
				}
				//#ifdef MP-WEIXIN
				//获取页面元素到顶部的高度
				wx.createSelectorQuery().in(this).select('#hash2').boundingClientRect(function(rect) {
					var rectTop1 = rect.top;
					that.setData({
						rectTop1
					})
				}).exec()
				wx.createSelectorQuery().in(this).select('#hash3').boundingClientRect(function(rect) {
					var rectTop2 = rect.top;
					that.setData({
						rectTop2
					})
				}).exec()
				wx.createSelectorQuery().in(this).select('#hash4').boundingClientRect(function(rect) {
					var rectTop3 = rect != null ? rect.top : 0;
					that.setData({
						rectTop3
					})
				}).exec()

				let {
					rectTop1,
					rectTop2,
					rectTop3
				} = that;
				if (e.detail.scrollTop > rectTop1 && e.detail.scrollTop < rectTop2) {
					that.setData({
						NavIndex: 1
					})
				} else if (e.detail.scrollTop > rectTop2 && e.detail.scrollTop < rectTop3) {
					that.setData({
						NavIndex: 2
					})
				} else if (e.detail.scrollTop > rectTop3) {
					that.setData({
						NavIndex: 3
					})
				} else {
					that.setData({
						NavIndex: 0
					})
				}
				//#endif
			},


			get_comments() {
				var that = this;
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getGoodsDetailComments_xcx',
					data: {
						gid: that.gid,
						commenttype: 'g_img',
						pn: that.pn,
						rows: that.rows
					},
					dataType: 'json',
					success: function(result) {
						if (result.data.code == 200) {
							that.setData({
								comment: result.data.datas.comment,
								commentLength: result.data.datas.total_comment,
							})
						}
					}
				})
			},


			onHide: function() {
				if (this.intervalId && this.intervalId.length > 0) {
					this.intervalId.map(item => {
						clearInterval(item)
					});
					this.setData({
						intervalId: []
					});
				}
				if(this.secInterval){
					clearInterval(this.secInterval);
				}
			},

			showMore() {
				this.setData({
					showMoreGroup: true
				})
			},

			hideGroup() {
				this.setData({
					showMoreGroup: false
				})
			},

			emptyHandle() {
				return;
			},

			getShareImg() {
				let {
					gid
				} = this;
				let systemType = '';
				//#ifdef APP-PLUS || H5
				systemType = '';
				//#endif
				//#ifdef MP-WEIXIN
				systemType = 'wx_xcx';
				//#endif
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=goods&mod=shareimg',
					data: {
						gid,
						client: systemType
					},
					success: res => {
						if (res.data.status == 200) {
							this.setData({
								shareImg: res.data.img
							})
						}
					}
				})
			},
			sele_spec: function(e) {
         
				if (this.intervalId && this.intervalId.length > 0) {
					this.intervalId.map(item => {
						clearInterval(item)
					});
					this.setData({
						intervalId: []
					});
				}
				//选择规格的效果
				var spec_index = e.currentTarget.dataset.specTitleIndex;
				var detail_index = e.currentTarget.dataset.specDetailIndex;
				var new_data = this.data_info;
				var data = this.data_info.goods_map_spec[spec_index].goods_spec_value;
				for (var i = 0; i <data.length; i++) {
					if (i == detail_index) {
						data[i].default = 1;
					} else {
						data[i].default = 0;
					}
				}
				new_data.goods_map_spec[spec_index].goods_spec_value = data;
				this.setData({
					data_info: new_data,
				});
				//排序获取gid
				var a = [];
				for (var i = 0; i < new_data.goods_map_spec.length; i++) {
					for (var j = 0; j < new_data.goods_map_spec[i].goods_spec_value.length; j++) {
						if (new_data.goods_map_spec[i].goods_spec_value[j].default == 1) {
							a.push(new_data.goods_map_spec[i].goods_spec_value[j].specs_value_id);
						}
					}
				}
				//对获取到的资料进行排序
				var i = a.sort(function(e, t) {
					return e - t
				}).join("|");
				//根据gid获取商品信息
				var gid = new_data.spec_list[i];
				this.setData({
					gid: gid
				});
				get_goods_info(this);
			},
			//进入评价页面
			go_comment: function(e) {
				uni.navigateTo({
					url: '../goods_comment/goods_comment?gid=' + this.gid
				})
			},
			//进入店铺事件
			go_vendor: function(e) {
				let that = this;
				if (getCurrentPages() && getCurrentPages().length > 8) {
					wx.redirectTo({
						url: '../shopHomePage/shopHomePage?vid=' + that.vid
					})
				} else {
					uni.navigateTo({
						url: '../shopHomePage/shopHomePage?vid=' + that.vid
					})
				}
			},
			//详细规格模块的展示与隐藏
			show_spec: function(e) {
				this.setData({
					is_show_spec: !this.is_show_spec
				});
			},
			// 服务的展示
			showModal: function(e) {
				var show_flag = e.currentTarget.dataset.model_id;
				// 显示遮罩层  
				var animation = wx.createAnimation({
					duration: 200,
					timingFunction: "ease",
					delay: 0
				})
				this.animation = animation
				animation.translateY(animationShowHeight).step()
				animation.backgroundColor('rgba(15, 15, 26, 0.7)').step()
				this.setData({
					animationData: animation.export(),
					showModalStatus: true
				});
				switch (show_flag) {
					case 'tag':
						this.setData({
							showModalStatus_Tag: true
						});
						break;
					case 'red':
						this.setData({
							showModalStatus_Red: true
						});
						break;
				}
				setTimeout(function() {
					animation.translateY(0).step()
					this.setData({
						animationData: animation.export()
					})
				}.bind(this), 200)
			},
			hideModal: function() {
				// 隐藏遮罩层  
				var animation = wx.createAnimation({
					duration: 200,
					timingFunction: "linear",
					delay: 0
				})
				this.animation = animation;
				animation.translateY(animationShowHeight).step()
				this.setData({
					animationData: animation.export(),
				})
				setTimeout(function() {
					animation.translateY(0).step()
					this.setData({
						animationData: animation.export()
					});
					this.setData({
						showModalStatus_Tag: false,
						showModalStatus_Red: false,
					});
				}.bind(this), 0)
			},
			// 获取 优惠券
			get_red_one: function(e) {
				var that = this;
				if (!that.key) {
					getApp().globalData.goLogin();
					return
				}
				var red_id = e.currentTarget.dataset.id;
				wx.request({
					url: getApp().globalData.ser_url + "/index.php?app=red&mod=send_red&sld_addons=red",
					data: {
						key: that.key,
						red_id: red_id
					},
					dataType: 'json',
					success: function(result) {
						if (result.data.code == 200) {
							if (result.data.datas == 1) {
								wx.showToast({
									title: that.$L('领取成功'),
									icon: "none",
									mask: true,
									duration: 2000,
									complete: function() {
										if (that.intervalId && that.intervalId.length > 0) {
											that.intervalId.map(item => {
												clearInterval(item)
											});
											that.setData({
												intervalId: []
											});
										}
										get_goods_info(that)
									}
								});
							} else {
								// if (that.key) {
								// 	uni.showToast({
								// 		title: result.data.datas.msg,
								// 		icon: 'none',
								// 		duration: 500
								// 	})
								// 	that.setData({
								// 		showModalStatus_Red: false
								// 	});
								// } else {
									uni.showModal({
										title: that.$L('提示'),
										content: result.data.datas,
										success: function(res) {
											if (res.confirm) {
												// getApp().globalData.goLogin();
												that.setData({
													showModalStatus_Red: false
												});
											} else if (res.cancel) {
												that.setData({
													showModalStatus_Red: false
												});
											}
										}
									})
								// }
							}
						}
					}
				});

			},
			//购买数量事件
			cart_num: function(e) {
        var that = this
				var tar_num = this.buy_num;
				if (e.currentTarget.dataset.type == 'minus') {
					if (this.promotion_type == 'xianshi') {
						let lower_limit = this.lower_limit;
						if (tar_num <= lower_limit) {
							wx.showToast({
								title: `${that.$L('当前商品最低购买')}${lower_limit}${this.$L('件')}`,
								icon: 'none'
							})
							return;
						}
					}
					if (tar_num != 1) {
						tar_num = tar_num * 1 - 1;
					} else {
						wx.showToast({
							title: `${that.$L('当前商品最低购买1件')}`,
							icon: 'none'
						})
					}
				} else {
					
					const {
						buy_num,
						data_info,
						max_num,
						activity_goods_storage,
						secKillInfo
					} = this;	
					if(data_info.goods_info.promotion_type=='seckill'){	
						if(secKillInfo.activity_state == '2'){	//进行中
							if(secKillInfo.upper_limit < secKillInfo.seckill_storage){
								if(tar_num >= secKillInfo.upper_limit){
									wx.showToast({
										title: that.$L('限购') + secKillInfo.upper_limit + that.$L('件') ,
										duration: 500,
										icon: 'none'
									})
									tar_num = secKillInfo.upper_limit;
								}else{
									tar_num = parseFloat(tar_num) + 1;
								}
							}else{
								if(tar_num < secKillInfo.seckill_storage){
									if(tar_num >= 999){
										wx.showToast({
											title: that.$L('超过购买上限') ,
											duration: 500,
											icon: 'none'
										})
										tar_num = 999;
									}else{
										tar_num = parseFloat(tar_num) + 1;
									}
								}else{
									if(tar_num > secKillInfo.seckill_storage){
										tar_num = secKillInfo.seckill_storage;
										uni.showToast({
											title: that.$L('库存不足'),
											icon: 'none'
										})
									}
								}
							}
						}else{
							if(tar_num < secKillInfo.seckill_storage){
								if(tar_num >= 999){
									wx.showToast({
										title: that.$L('超过购买上限') ,
										duration: 500,
										icon: 'none'
									})
									tar_num = 999;
								}else{
									tar_num = parseFloat(tar_num) + 1;
								}
							}else{
								if(tar_num > secKillInfo.seckill_storage){
									tar_num = secKillInfo.seckill_storage;
									uni.showToast({
										title: that.$L('库存不足'),
										icon: 'none'
									})
								}
							}
						}
					}else if (data_info.goods_info.promotion_type == 'pin_tuan' && data_info.pin && data_info.pin.sld_max_buy != 0) {
						if(this.switchSpecifications_add == '3' || data_info.goods_info.promotion_start_flag != 2){   //单独买
							if(tar_num >= data_info.goods_info.goods_storage){
								uni.showToast({
									title: that.$L('库存不足'),
									icon: 'none'
								})
								tar_num = data_info.goods_info.goods_storage;
							}else{
								tar_num = parseFloat(tar_num) + 1;
							}
						}else{  //团购
							if (tar_num >= data_info.pin.sld_max_buy || tar_num >= data_info.pin.sld_stock) {
								tar_num = Math.min(data_info.pin.sld_max_buy, data_info.pin.sld_stock);
								wx.showToast({
									title: that.$L('限购') + data_info.pin.sld_max_buy + that.$L('件'),
									icon: 'none'
								})
							}else{
								tar_num = parseFloat(tar_num) + 1;
							}
						}
					} else if (data_info.goods_info.promotion_type == 'pin_ladder_tuan') {
						if (max_num == 0) { // 0为不限制
							tar_num = parseFloat(tar_num) + 1;
						} else if (max_num != 0) {
							tar_num = parseFloat(tar_num) + 1;
							if (tar_num >= max_num) {
								tar_num = max_num;
								wx.showToast({
									title: that.$L('限购') + max_num + that.$L('件'),
									icon: 'none'
								})
							}

						} else {
							if (tar_num >= activity_goods_storage) {
								tar_num = activity_goods_storage;
							}
						}
					} else if (data_info.goods_info.promotion_type == 'sld_presale') {
						if (max_num == 0) { // 0为不限制
							tar_num = parseFloat(tar_num) + 1;
						} else if (max_num != 0) {
							tar_num = parseFloat(tar_num) + 1;
							if (tar_num > max_num) {
								tar_num = max_num;
								wx.showToast({
									title: that.$L('限购') + max_num + that.$L('件'),
									icon: 'none'
								})
							}
						} else {
							if (tar_num >= activity_goods_storage) {
								tar_num = activity_goods_storage;
							}
						}
					} else if (data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.goods_storage * 1 > 0) {
						if(data_info.goods_info.promotion_start_flag == 2){
							wx.showToast({
								title: that.$L('限购') + data_info.goods_info.upper_limit + that.$L('件'),
								icon: 'none'
							})
							tar_num = data_info.goods_info.upper_limit * 1;
						}else{
							if (tar_num >= data_info.goods_info.goods_storage * 1) {
								wx.showToast({
									title: that.$L('限购') + data_info.goods_info.goods_storage + that.$L('件'),
									icon: 'none'
								})
								tar_num = data_info.goods_info.goods_storage * 1;
							} else {
								tar_num = tar_num * 1 + 1;
							}
						}
					} else if (tar_num < data_info.goods_info.goods_storage) {
						if (tar_num >= 999) {
							wx.showToast({
								title: that.$L('超过购买上限'),
								duration: 500,
								icon: 'none'
							})
						} else {
							tar_num = tar_num * 1 + 1;
						}
					} else {
						wx.showToast({
							title: that.$L('库存不足'),
							icon: 'none'
						})
					}

				}
				this.setData({
					buy_num: tar_num
				});
			},

			// 购买输入框事件
			BuyNumEdit(e) {
				let num = (e.detail.value) * 1;
				const {
					buy_num,
					data_info,
					max_num,
					activity_goods_storage,
					secKillInfo
				} = this;
				let buy = num;
				if (num > data_info.goods_info.goods_storage){
					buy = data_info.goods_info.goods_storage;
					wx.showToast({
						title: this.$L('库存不足'),
						duration: 500,
						icon: 'none'
					})
				}
				if (num > 999 && buy > 999) {
					wx.showToast({
						title: this.$L('超过购买上限'),
						duration: 500,
						icon: 'none'
					})
					buy = 999
				}
				if (num < 1) {
					if (data_info.goods_info.lower_limit) {
						buy = parseInt(data_info.goods_info.lower_limit);
					} else {
						buy = 1;
					}
				} else {
					if(data_info.goods_info.promotion_type=='seckill'){	
						if(secKillInfo.activity_state == '2'){	//进行中
							if(secKillInfo.upper_limit < secKillInfo.seckill_storage){
								if(num > secKillInfo.upper_limit){
									wx.showToast({
										title: this.$L('限购') + secKillInfo.upper_limit + this.$L('件') ,
										duration: 500,
										icon: 'none'
									})
									buy = secKillInfo.upper_limit;
								}else{
									buy = num;
								}
							}else{
								if(num < secKillInfo.seckill_storage){
									if(num > 999){
										wx.showToast({
											title: this.$L('超过购买上限') ,
											duration: 500,
											icon: 'none'
										})
										buy = 999
									}else{
										buy = num;
									}
								}else{
									if(tar_num > secKillInfo.seckill_storage){
										buy = secKillInfo.seckill_storage;
										uni.showToast({
											title: this.$L('库存不足'),
											icon: 'none'
										})
									}
								}
							}
						}else{
							if(num < secKillInfo.seckill_storage){
								if(num > 999){
									wx.showToast({
										title: this.$L('超过购买上限') ,
										duration: 500,
										icon: 'none'
									})
									buy = 999
								}else{
									buy = num;
								}
							}else{
								if(tar_num > secKillInfo.seckill_storage){
									buy = secKillInfo.seckill_storage;
									uni.showToast({
										title: this.$L('库存不足'),
										icon: 'none'
									})
								}
							}
						}
					}else if (data_info.pin && data_info.pin.sld_max_buy != 0) {
						if(this.switchSpecifications_add == '3'){   //单独买
							if(num > data_info.pin.sld_stock){
								if(num > 999){
									wx.showToast({
										title: this.$L('超过购买上限'),
										duration: 500,
										icon: 'none'
									})
									buy = 999
								}else{
									buy = data_info.pin.sld_stock;
									uni.showToast({
										title: this.$L('库存不足'),
										icon: 'none'
									})
								}
							}else{
								buy = num;
							}
						}else{  //团购
							if (num >= data_info.pin.sld_max_buy || num >= data_info.pin.sld_stock) {
								buy = Math.min(data_info.pin.sld_max_buy, data_info.pin.sld_stock);
								wx.showToast({
									title: this.$L('限购') + data_info.pin.sld_max_buy + this.$L('件'),
									icon: 'none'
								})
							}
						}
					} else if (data_info.goods_info.promotion_type == 'pin_ladder_tuan') {
						if (max_num != 0) {
							if (num >= max_num) {
								buy = max_num;
							}
						} else {
							if (num >= activity_goods_storage) {
								buy = activity_goods_storage;
							}
						}
					} else if (data_info.goods_info.promotion_type == 'sld_presale') {
						if (max_num != 0) {
							if (num >= max_num) {
								buy = max_num;
							}
						} else {
							if (num >= activity_goods_storage) {
								buy = activity_goods_storage;
							}
						}
					} else if (data_info.goods_info.promotion_type == 'tuan' && data_info.goods_info.goods_storage > 0) {
						if (num >= data_info.goods_info.goods_storage) {
							wx.showToast({
								title: this.$L('限购') + data_info.goods_info.goods_storage + this.$L('件'),
								icon: 'none'
							})
							buy = data_info.goods_info.goods_storage;
						}
					} else if (data_info.goods_info.promotion_type == 'xianshi') {
						var lower_limit = parseInt(data_info.goods_info.lower_limit);
						if (lower_limit > 1 && num <= lower_limit) {
							wx.showToast({
								title: this.$L('本商品最低购买') + lower_limit + this.$L('件'),
								icon: 'none'
							})
							buy = lower_limit;
						}
					} else {
						let storage = data_info.goods_info.goods_storage;
						if (num > storage) {
							buy = storage;
						}
					}
				}
				let that = this
				setTimeout(() => {
					that.buy_num = buy
				}, 0)
				// this.setData({
				// 	buy_num: buy
				// })
			},

			//加入购物车事件
			add_cart: function(e) {
				var acart_data = this;
				let key = wx.getStorageSync('token');
				if (key) {
					//已登录
					let url = getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add';
					uni.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: acart_data.key,
							gid: acart_data.gid,
							quantity: acart_data.buy_num,
							is_from_live: '0',
							//是否来自直播：0否1是
							stat_end:acart_data.stat_end,
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == true) {
								uni.showToast({
									title:this.$L('加入购物车成功'),
									icon:'none',
									duration:500
								})
								acart_data.setData({
									cart_count: res.data.datas.cart_goods_num
								})
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none',
									duration: 500
								});
							}
						}
					});
				} else { //未登录
					let uuid = wx.getStorageSync('uuid')
					let url = getApp().globalData.ser_url + '/index.php?app=cache_cart&mod=cart_add';
					wx.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: uuid,
							is_from_live: '0', //是否来自直播：0否1是
							gid: acart_data.gid,
							quantity: acart_data.buy_num ,//数量
							stat_end:acart_data.stat_end,
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								wx.showToast({
									title: this.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								})
								acart_data.setData({
									cart_count: res.data.datas.cart_goods_num
								})
							} else {
								wx.showToast({
									title: res.data.datas.msg,
									duration: 500,
									icon: 'none'
								})
							}
						}
					})
				}
				//关闭页面弹框
				this.setData({
					showMask: false,
					Specifications: false,
					join_group: false,
				})
			},
			//进入购物车事件
			go_cart: function(e) {
				if (getCurrentPages() && getCurrentPages().length > 8) {
					wx.switchTab({
						url: '../cart/cart'
					})
				} else {
					wx.switchTab({
						url: '../cart/cart'
					})
				}

			},
			//立即购买事件
			go_bug: function() {
				//删除本地门店信息缓存
				if(uni.getStorageSync('store_info')){
					uni.removeStorage({
						key:'store_info'
					})
				}
				let {
					live_id
				} = this;
				if (!this.key) {
					const page = getCurrentPages();
					let url = page[page.length - 1].route;
					const options = page[page.length - 1].options;
					for (let i in options) {
						if (url.indexOf('?') > -1) {
							url += `&${i}=${options[i]}`;
						} else {
							url += `?${i}=${options[i]}`;
						}
					}
					url = '/' + url;
					wx.setStorageSync('fromurl', url);
					wx.switchTab({
						url: '/pages/user/user',
					})
				} else {
					//判断购买数量是否在合理的范围内
					if (this.buy_num < 1) {
						// errorTipsShow(this, '购买数量最小为1');
					} else if (this.buy_num > this.data_info.goods_info.goods_storage && this.data_info.goods_info.promotion_type !== 'seckill') {
						// errorTipsShow(this, '不可超出最大库存');
					} else {
						//执行购买操作
						var buy_data = this;
						var cart_id = buy_data.gid + '|' + buy_data.buy_num;
						wx.request({
							url: getApp().globalData.ser_url + '/index.php?app=buy&mod=confirm_xcx',
							data: {
								'key': buy_data.key,
								'cart_id': cart_id
							},
							dataType: 'json',
							success: function(result) {
								if (result.data.state == 200) {
									if (result.data.login == 0) {
										errorTipsShow(acart_data, result.data.datas.error);
									} else {
										setTimeout(()=>{
											uni.navigateTo({
												url:'/pages/confirm_order/confirm_order?gid=' + buy_data.gid + '&buynum=' + buy_data.buy_num + '&live_id=' + live_id + '&seckill=' + buy_data.isSeckill
											})
										},300)
									}
								} else {
									if (result.data.login == 0) {
										errorTipsShow(buy_data, result.data.datas.error);
									} else {
										if(result.data.datas.error!=undefined&&result.data.datas.error){
											errorTipsShow(buy_data, result.data.datas.error);
										}else{
											errorTipsShow(buy_data, result.data.msg);
										}
									}
								}
							}
						})
					}
				}
				//关闭页面弹框
				this.setData({
					showMask: false,
					Specifications: false,
					join_group: false,
				})

			},
			wxParseTagATap: function(e) {
				var n_url = e.currentTarget.dataset.src;

				if (n_url) {
					// 商品详情页内的链接 可进行正则匹配 进行更改跳转
				}
			},

			// 拼团购买 开团
			go_to_buy_pin: function() {
				var that = this;
				var pin_id = that.data_info.pin.id;
				var team_id = that.data_info.pin.team_id ? that.data_info.pin.team_id : that.team_id;
				var buy_num = that.buy_num;
				var pinging = that.data_info.pin.pinging
				if (pinging) {
					wx.showToast({
						title: this.$L('您正在拼团中！'),
						icon: 'none'
					})
				} else {
					let {
						live_id
					} = this;

					if (!this.key) {
						getApp().globalData.goLogin();
					} else {
						//判断购买数量是否在合理的范围内
						if (buy_num < 1) {
							errorTipsShow(that, that.$L('购买数量最小为1'));
						} else if (buy_num > that.data_info.goods_info.goods_storage) {
							errorTipsShow(that, that.$L('不可超出最大库存'));
						} else if (buy_num > that.data_info.pin.sld_max_buy && that.data_info.pin.sld_max_buy > 0) {
							errorTipsShow(that, that.$L('限购') + that.data_info.pin.sld_max_buy + that.$L('件'));
						} else {

							var cart_id = that.gid + '|' + buy_num;
							//执行购买操作
							wx.request({
								url: getApp().globalData.ser_url + '/index.php?app=buy&mod=confirm_xcx',
								data: {
									'key': that.key,
									'cart_id': cart_id,
									'pin': pin_id,
									'team': team_id
								},
								dataType: 'json',
								success: function(result) {
									if (result.data.state == 200) {
										if (result.data.login == 0) {
											errorTipsShow(buy_data, result.data.datas.error);
										} else {
											uni.navigateTo({
												url: '../confirm_order/confirm_order?gid=' + that.gid + '&buynum=' + that.buy_num + '&pin=' + pin_id +
													'&team=' + team_id + '&live_id=' + live_id
											})
										}
									} else {
										if (result.data.login == 0) {
											errorTipsShow(buy_data, result.data.datas.error);
										} else {
											if(result.data.datas.error!=undefined&&result.data.datas.error){
												errorTipsShow(buy_data, result.data.datas.error);
											}else{
												errorTipsShow(buy_data, result.data.msg);
											}
										}
									}
								}
							})
						}
						//关闭页面弹框
						this.setData({
							showMask: false,
							Specifications: false,
							join_group: false,
						})

					}
				}
			},
			// 优惠套装前往结算页
			gmBtn: function(e) {
				var bl_id = e.currentTarget.dataset.bl_id;;
				uni.navigateTo({
					url: '../preferential_suit/cart?bl_id=' + bl_id + '&gid=' + this.gid
				});
			},
			// 产品组合前往结算页
			suite_item_buy: function(e) {
				var gids = e.currentTarget.dataset.gids;;
				uni.navigateTo({
					url: '../goods_combination/goods_combination?gids=' + gids + '&gid=' + this.gid
				});
			},
			// ----------------优惠套装--------------------
			xcxClick: function() {
				if (ify == true) {
					this.setData({
						cktext: this.$L('收起'),
						sanjiao: 'setRotate',
						kaiguan: 'setother'
					});

					ify = false;
				} else {
					this.setData({
						cktext: this.$L('查看更多'),
						sanjiao: 'rotate',
						kaiguan: 'other'
					});
					ify = true;
				}
			},
			WxClick: function() {
				if (ifyA == true) {
					this.setData({
						cktextA: this.$L('收起'),
						sanjiaoA: 'setRotate',
						kaiguanA: 'setother'
					});

					ifyA = false;
				} else {
					this.setData({
						cktextA: this.$L('查看更多'),
						sanjiaoA: 'rotateA',
						kaiguanA: 'otherA'
					});
					ifyA = true;
				}

			},
			Open_the: function() {
				if (open == true) {
					this.setData({
						Open: 'Open'
					});
					open = false;
				} else {
					this.setData({
						Open: ''
					});
					open = true;
				}
			},

			kefu() {
				var key = wx.getStorageSync('token')
				if (!key) {
					getApp().globalData.goLogin();
					return;
				}
				if (isClickKeFu) {
					return;
				}
				isClickKeFu = true;
				var gid = this.gid;
				var store_info = this.data_info.store_info,
					business_id = store_info.seller_name,
					store_name = store_info.store_name,
					store_avatar = store_info.avatar,
					vid = store_info.vid;
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo_xcx',
					data: {
						'key': key
					},
					dataType: 'json',
					success: res => {
						if (res.data.state == 200) {
							isClickKeFu = false;
							var member_info = res.data.member_info,
								visiter_id = member_info.member_id,
								username = member_info.member_name,
								avatar = member_info.avator;
							var from1 = 'xcx_' + gid;
							var options = {
								business_id,
								visiter_id,
								username,
								avatar,
								gid,
								vid,
								store_avatar,
								from1,
								store_name
							}
							uni.navigateTo({
								url: '/pages/im/im?op=' + encodeURIComponent(JSON.stringify(options)),
							})
						}
					}
				})

			},
			goodsDetail(e) {
				let id = e.currentTarget.dataset.id;
				if (id) {
					let page = getCurrentPages();

					if (page && page.length > 8) {
						wx.redirectTo({
							url: '/pages/goods_detail/goods_detail?gid=' + id,
						})
					} else {
						uni.navigateTo({
							url: '/pages/goods_detail/goods_detail?gid=' + id,
						})
					}
				}
			},
			favorate() {
				let is_favorate = this.data_info.is_favorate;
				let that = this;
				let key = wx.getStorageSync('token');
				let gid = this.gid;
				if (!key) {
					getApp().globalData.goLogin();
					return;
				} else {
					let url = is_favorate ? getApp().globalData.ser_url + '/index.php?app=userfollow&mod=favorites_del' : getApp().globalData
						.ser_url +
						'/index.php?app=userfollow&mod=favorites_add';
					let data = {}
					if(is_favorate){//取消收藏
						data={
							key,
							fav_id:gid
						}
					}else{
						data={
							key,
							gid,
							stat_end:that.stat_end,
						}
					}
				
					wx.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: data,
						success: function(res) {
							if (res.data.code == 200) {
								that.data_info.is_favorate = !is_favorate;
								that.data_info = JSON.parse(JSON.stringify(that.data_info));
								that.setData({
									['data_info.is_favorate']: !is_favorate
								})
								wx.showToast({
									title: !is_favorate ? that.$L('收藏成功') : that.$L('取消收藏'),
									icon: 'none',
									duration: 500
								})
							}
						}
					})
				}
			},

			// 预售
			deposit_pay() {
				const key = wx.getStorageSync('token');
				var that = this
				if (!key) {
					getApp().globalData.goLogin();
				} else {
					let {
						data_info
					} = that;
					if (data_info.is_can_buy_presale == 0) {
						wx.showModal({
							title: that.$L('提示'),
							showCancel: false,
							content: that.$L('您已参加过此活动，不能重复参加'),
						})
					} else {
						const {
							buy_num,
							presaleInfo,
							gid
						} = that;
						uni.navigateTo({
							url: `/addons/pages/preConfirm/preConfirm?gid=${gid}&num=${buy_num}&id=${presaleInfo.pre_id}`,
						})
					}
				}
				//关闭页面弹框
				this.setData({
					showMask: false,
					Specifications: false,
					join_group: false,
				})
			},

			// 阶梯团 
			jtt_time_out() {
				if (jtt_timer) {
					clearTimeout(jtt_timer);
				}
				let d = parseInt(jtt_tiem / 60 / 60 / 24);
				let h = parseInt(jtt_tiem / 60 / 60 % 24);
				let m = parseInt(jtt_tiem / 60 % 60);
				let s = parseInt(jtt_tiem % 60);
				if (jtt_tiem > 0) {

					// h = h > 999 ? 999 : (h > 9 ? h : '0' + h);   
					d = d > 9 ? d : '0' + d;
					h = h > 9 ? h : '0' + h;
					m = m > 9 ? m : '0' + m;
					s = s > 9 ? s : '0' + s;

					this.setData({
						jtt_time_txt: `${d}${this.$L('天')}${h}:${m}:${s}`
					})
					this.setData({
						ladderRegimentDay: this.jtt_time_txt.split(":")[0].split(this.$L('天'))[0], //天
						ladderRegimentHour: this.jtt_time_txt.split(":")[0].split(this.$L('天'))[1], //时
						ladderRegimentMinute: this.jtt_time_txt.split(":")[1], //分钟
						ladderRegimentSecond: this.jtt_time_txt.split(":")[2], //秒
					})
					jtt_tiem--;
					jtt_timer = setTimeout(this.jtt_time_out, 1000);
				} else {
					this.setData({
						jtt_time_txt: `${this.$L('已结束')}`
					})
				}
			},


			jtt_start_time_out() {
				if (this.jtt_start_timer) {
					clearTimeout(this.jtt_start_timer);
				}
				let diff = Math.floor((this.jtt_start_time * 1000 - new Date().getTime()) / 1000);
				let d = parseInt(diff / 60 / 60 / 24);
				let h = parseInt(diff / 60 / 60 % 24);
				// let h = parseInt(diff / 60 / 60);
				let m = parseInt(diff / 60 % 60);
				let s = parseInt(diff % 60);
				if (diff > 0) {
					// h = h > 999 ? 999 : (h > 9 ? h : '0' + h);
					d = d > 9 ? d : '0' + d;
					h = h > 9 ? h : '0' + h;
					m = m > 9 ? m : '0' + m;
					s = s > 9 ? s : '0' + s;
					this.setData({
						jtt_time_txt: `${d}${this.$L('天')}${h}:${m}:${s}`
					})
					this.setData({
						ladderRegimentDay: this.jtt_time_txt.split(":")[0].split(this.$L('天'))[0], //天
						ladderRegimentHour: this.jtt_time_txt.split(":")[0].split(this.$L('天'))[1], //时
						ladderRegimentMinute: this.jtt_time_txt.split(":")[1], //分钟
						ladderRegimentSecond: this.jtt_time_txt.split(":")[2], //秒
					})
					this.jtt_start_timer = setTimeout(this.jtt_start_time_out, 1000);
				} else {
					let {
						gid
					} = this;
					getLadderInfo(this, gid);
				}
			},

			// 
			deposit_pay_ladder() {
				const key = wx.getStorageSync('token');
				if (!key) {
					getApp().globalData.goLogin();
				} else {
					const {
						buy_num,
						ladderPinInfo,
						gid
					} = this;
					if (ladderPinInfo.pay_status == 2) {
						//页面提示
						uni.showToast({
							title: this.$L('未到付尾款时间'),
							icon: 'none'
						});
						return;
					}
					uni.navigateTo({
						url: `/addons/pages/ladderConfirm/ladderConfirm?gid=${gid}&num=${buy_num}&id=${ladderPinInfo.id}`,
					})
				}
				//关闭页面弹框
				this.setData({
					showMask: false,
					Specifications: false,
					join_group: false,
				})
			},

			//图片预览
			previewImage(e) {
				let url = e.currentTarget.dataset.img;
				let urls = this.rotationChartImage;
				uni.previewImage({
					urls: urls,
					current: url,
					indicator:'number'
				})
			},

			touchmoveshare() {
				return false;
			},
			closeShare() {
				this.setData({
					shareWrap: false,
					shareWrap2: false,
					showWeiXinBrowerTip:false
				})
			},
			showShare() {
				this.setData({
					shareWrap2: true
				})
			},
			createhb() {
				this.setData({
					shareWrap: true,
					shareWrap2: false
				})
				//微信浏览器分享海报
				this.$weiXinBrowerShare(2,{
					 link:getApp().globalData.h5_url + "pages/goods_detail/goods_detail?gid=" + this.gid,
					 imgUrl:this.shareImg,
				});
			},
			downloadImg() {
				let {
					shareImg
				} = this;
				wx.downloadFile({
					url: shareImg,
					success: res => {
						if (res.statusCode == 200) {
							wx.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: result => {
									if (result.errMsg == 'saveImageToPhotosAlbum:ok') {
										wx.showToast({
											title: this.$L('已保存到本地'),
										})
										this.closeShare();
									} else {
										wx.showToast({
											title: this.$L('保存失败'),
											icon: 'none'
										})
									}
								}
							})
						} else {
							wx.showToast({
								title: this.$L('下载失败'),
								icon: 'none'
							})
						}
					}
				})
			},
			prevImg() {
				wx.previewImage({
					urls: [this.shareImg],
				})
			},

			//直播回放
			go_huifnag() {
				let live_id = this.data_info.goods_info.replay_live_id;
				let hour = this.data_info.goods_info.replay_start_time_hour;
				let minute = this.data_info.goods_info.replay_start_time_minute;
				let second = this.data_info.goods_info.replay_start_time_second;
				let initial_time = Number(hour * 3600) + Number(minute * 60) + Number(second);
				uni.navigateTo({
					url: `/addons/pages/livePlay/livePlay?live_id=${live_id}&initial_time=${initial_time}`,
				})
			},

			goVideo() {
				let live_id = this.data_info.vendor_liveing.live_id;
				uni.navigateTo({
					url: `/addons/pages/livePlay/livePlay?live_id=${live_id}`,
				})
			},
		   /*
		   by ww 11.17
		   h5跳转新页面播放视频
             */
			toPlayPage(){
				uni.navigateTo({
					url: '/pages/playVideoPage/playVideoPage?video_url='+this.data_info.goods_info.video_url+'&posterImage='+this.rotationChartImage[0],
				});
			},
			//蒙层遮罩
			hidden_mask() {
				this.setData({
					showMask: false,
					benefits_model: false, //查看权益弹框
					full_gift_box: false, //满赠弹框
					join_group: false, //参与拼单弹框
					make_group_more: false, //正在拼单弹框
					Specifications: false, //选择规格
					switchSpecifications_add: '0', //显示默认的
				})
			},
			//查看会员权益
			handle_benefits() {
				this.setData({
					showMask: true,
					benefits_model: true, //查看权益弹框
				})
				get_goods_info(this);
			},
			//去门店信息页面
			goStoreInfo() {
				let that = this;
				let gid = that.gid
				uni.navigateTo({
					url:'/pages/store/store?gid=' + gid,
				})
			},
			//去商品买家秀页面
			go_buy_show(e) {
				let length = e.currentTarget.dataset.length;
				uni.navigateTo({
					url: '/pages/buyShow/buyShow?gid=' + this.gid + '&length=' + length,
				})
			},
			//满赠弹框
			fullGiftBox() {
				let that = this;
				that.setData({
					full_gift_box: true,
					showMask: true
				})
			},
			// 去参团
			handleJoinGroup(e) {
				let that = this;
				let teamId = e.currentTarget.dataset.teamid; //团id
				let isown = e.currentTarget.dataset.isown; //当前拼团自己是否为发起人
				if (isown == true) {
					//自己是发起人，   我的团
					that.setData({
						isown: true,
					})
				} else {
					that.setData({
						isown: false,
					})
				}
				that.setData({
					join_group: true,
					showMask: true,
					teamId: teamId,
					make_group_more: false,
				})
				that.handleGroupDetail();
			},
			//正在拼单-查看更多
			make_group_more_fun() {
				let that = this;
				if (that.key == '') {
					wx.showToast({
						title: that.$L('未登录'),
						duration: 500,
						icon: 'none'
					})
					setTimeout(() => {
						wx.switchTab({
							url: '/pages/user/user',
						})
					}, 700)
				} else {
					that.handleGroupMoreList();
					setTimeout(function(){
						that.setData({
							showMask: true,
							make_group_more: true
						})
					},800)
				}
			},
			//拼单详情  我的团，参与团，弹框信息
			handleGroupDetail() {
				let that = this;
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=team&mod=detail&sld_addons=pin',
					data: {
						key: that.key,
						team_id: that.teamId
					},
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							let GroupInfo = res.data.datas.info;
							let GroupList = res.data.datas.list;
							that.setData({
								GroupInfo,
								GroupList
							})
						}
						//去参团 ，我的团 弹框 倒计时
						var timere = setInterval(function() {
							let nowtime = new Date(); //当前时间
							let date = new Date(that.GroupInfo.sld_end_datetime); //当前拼单的结束时间
							let time = date - nowtime;
							if (time <= 0) {
								clearInterval(timere) //清除定时器
							}
							let day = parseInt(time / 1000 / 60 / 60 / 24);
							let hour = parseInt(time / 1000 / 60 / 60 % 24);
							let minute = parseInt(time / 1000 / 60 % 60);
							let seconds = parseInt(time / 1000 % 60);
							day = day > 9 ? day : '0' + day;
							hour = hour > 9 ? hour : '0' + hour;
							minute = minute > 9 ? minute : '0' + minute;
							seconds = seconds > 9 ? seconds : '0' + seconds;
							let gTime = day + ':' + hour + ':' + minute + ':' + seconds
							that.setData({
								single_player: gTime
							})
						}, 1000)
					}
				})
			},
			//正在拼单查看更多 列表
			handleGroupMoreList() {
				let that = this;
				wx.request({
					url: getApp().globalData.ser_url + '/index.php?app=team&mod=team_list&sld_addons=pin',
					data: {
						pn: 1,
						gid: that.gid,
						key: that.key
					},
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200) {
							let groupMoreList = res.data.datas.list;
							let groupMoreInfo = res.data.datas.pin_info;
							that.setData({
								groupMoreList: groupMoreList,
								groupMoreInfo: groupMoreInfo
							})
						}
						//拼团列表，查看更多列表
						that.groupMoreList.map((item, index) => {
							var timer1 = setInterval(function() {
								var nowtime = new Date(); //当前时间
								var date = new Date(item.endd); //当前拼单的结束时间
								var time = date - nowtime;
								if (time <= 0) {
									clearInterval(timer1) //清除定时器
								}
								var day = parseInt(time / 1000 / 60 / 60 / 24);
								var hour = parseInt(time / 1000 / 60 / 60 % 24);
								var minute = parseInt(time / 1000 / 60 % 60);
								var seconds = parseInt(time / 1000 % 60);
								day = day > 9 ? day : '0' + day;
								hour = hour > 9 ? hour : '0' + hour;
								minute = minute > 9 ? minute : '0' + minute;
								seconds = seconds > 9 ? seconds : '0' + seconds;
								let gTime = day + ':' + hour + ':' + minute + ':' + seconds
								item.gTime = gTime
								that.setData({
									groupMoreList: that.groupMoreList
								})
							}, 1000)
						})
					}
				})
			},

			//选择规格
			switchSpecifications(e) {

				let that = this;
				let type = e.currentTarget.dataset.type;
				if (type == 'add') { //加入购物车
					that.setData({
						switchSpecifications_add: '1', //点击了底部栏的加入购物车
					})
				} else if (type == 'buy') {
					that.setData({
						switchSpecifications_add: '2', //点击了底部栏的立即购买
					})
				} else if (type == 'separately_buy') {
					that.setData({
						switchSpecifications_add: '3', //点击了底部栏的单独买
					})
				} else if (type == 'go_league') {
					that.setData({
						switchSpecifications_add: '4', //点击了底部栏的去开团
					})
				} else if (type == 'join_group') { //去参团
					that.setData({
						switchSpecifications_add: '5', //点击了底部栏的去参团 确定
					})
				} else if(type == 'second_kill'){
					that.setData({
						switchSpecifications_add: '6', //点击了底部栏的立即秒杀
					})
				} else if (type == 'jtt') { //阶梯团
					if (that.ladderPinInfo.pay_status == 2) {
						//页面提示
						uni.showToast({
							title: that.$L('未到付尾款时间'),
							icon: 'none'
						});
						return;
					}
				} else {
					that.setData({
						switchSpecifications_add: '0', //默认值
					})
				}
				that.setData({
					showMask: true,
					Specifications: true,
					join_group: false,
				})
			},
			// 拼团 参团选择
			pick_team: function() {
				let that = this;
				var id = that.teamId; //参团id
				var pin_ping = that.groupMoreInfo.pinging || that.data_info.pin.pinging;
				var pin_tuan_data = that.groupMoreInfo;

				if (pin_ping) {
					// 拼团中
					wx.showToast({
						title: that.$L('此商品您正在拼团'),
						icon: "none",
						mask: true,
						duration: 2000,
						success: function() {}
					});
				} else {
					pin_tuan_data.team_id = id;
					that.setData({
						team_id: id,
					})
					pin_tuan_data.sld_tuan_status = 0;
					that.setData({
						data_info: that.data_info
					});
					this.go_to_buy_pin();
				}

			},
			//分享链接的弹框展示
			tipsShow() {
				let {
					tips_show,
					transparent_mask
				} = this;
				this.setData({
					tips_show: !tips_show,
					transparent_mask: !transparent_mask,
				})
			},
			//三点分享链接
			handleLink(e) {
				let link = e.currentTarget.dataset.link;
				let type = e.currentTarget.dataset.type;
				if (type != 'share') {
					wx.switchTab({
						url: link
					});
				}
				this.setData({
					tips_show: false
				})
			},
			//隐藏透明遮罩层
			hideMask() {
				this.setData({
					transparent_mask: false,
					tips_show: false
				})
			},
			//店铺推荐，查看更多，去店铺首页
			goShopHomePage() {
				uni.navigateTo({
					url: '/pages/shopHomePage/shopHomePage?vid=' + this.vid + '&source=1',
				})
			},
			//满赠活动，点击商品，去商品详情页
			handleGoodsDetail(item,e) {
				let gid = e.currentTarget.dataset.gid;
				if(item.mansong_goods_name){
					uni.navigateTo({
						url: '/pages/goods_detail/goods_detail?gid=' + gid,
					})
				}
			},
			//优惠券已抢完,已领取过
			have_finished(e) {
				let type = e.currentTarget.dataset.type;
				wx.showToast({
					title: type == 1 ? this.$L('优惠券已抢完!') : this.$L('您已领取过该优惠券!'),
					icon: 'none',
					duration: 500
				})
			},
			//查看更多优惠券规则
			reditem_more_fun(e) {
				let that = this;
				let reditem_current = e.currentTarget.dataset.index;
				let {
					reditem_more
				} = that;
				that.setData({
					reditem_more: !reditem_more,
					reditem_current: reditem_current
				})
			},
			moveHandle(){
				
			},
			//返回上一页
			goBack(){
				// #ifdef H5
				const pages = getCurrentPages();
				//有返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面，无法继续返回
				if(pages.length > 1){
					uni.navigateBack(1)
					return;
				}
				//vue router 可以返回uni.navigateBack失败的页面，但是会重新加载
				let a = this.$router.go(-1);
				//router.go失败之后则重定向到首页
				if(a == undefined){
					uni.reLaunch({
						url:'/pages/index/index'
					})
				}
				return;
				// #endif
				uni.navigateBack({
					delta:1
				})
			}


		},

	}
</script>
<style>
	@import "../templates/wxss/red.css";

	/*-----------------------------限时折扣------------------------ */

	page {
		width: 750rpx;
		overflow-x: hidden;
		margin: 0 auto;
		position: relative;
		display: flex;
		justify-content: center;
		padding-bottom: 98rpx;
		/* margin-top: calc(44px + env(safe-area-inset-top)); */
	}
	.go_back{
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		/* #ifdef H5 */
		top: 28rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		top: calc(var(--status-bar-height) + 28rpx);
		/* #endif */
		left: 25rpx;
		z-index: 99999999;
	}
	.go_back image{
		width: 50rpx;
		height: 50rpx;
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
		background: rgba(255, 255, 255, 1);
		opacity: 0.9;
	}
	.fixed_top_status_bar_no_opcity{
		background: #FFFFFF;
	}
	

	.page_con {
		height: calc(100% - 87rpx);
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	page>view {
		max-width: 750rpx;
		overflow-x: hidden;
	}

	.video_btn::after {
		content: '';
		/* position: absolute; */
		background-size: 90rpx 90rpx;
		background-position: center center;
	}

	.youhui {
		width: 100%;
		height: 140rpx;
		color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx 0 33rpx;
		box-sizing: border-box;
	}

	.youhui-left {
		display: flex;
		flex-direction: column;
		padding-bottom: 15rpx;
		box-sizing: border-box;
	}

	.youhui-left .jge {
		font-size: 60rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.youhui-left .jge text:nth-of-type(1),
	.youhui-left .jge text:nth-of-type(3) {
		font-size: 44rpx;
	}

	.zekou111 {
		display: flex;
		align-items: center;
	}

	.zekou111 .zhekou1 {
		width: 212rpx;
		height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
	}

	.zhekou1 text:nth-child(1) {
		width: 124rpx;
		height: 40rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 20rpx 0 0 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(191, 0, 254, 1);
		text-align: center;
		line-height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
	}

	.zhekou1 text:nth-child(2) {
		width: 88rpx;
		height: 40rpx;
		border-radius: 0 24rpx 24rpx 0;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 40rpx;
	}

	.zhekou_origin_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		text-decoration: line-through;
		color: rgba(254, 254, 254, 1);
		opacity: 0.7;
		margin-left: 10rpx;
	}




	.right {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.right .rtop {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin-bottom: 22rpx;
	}

	.dime {
		display: flex;
	}

	.dime_text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.rtop {
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 8rpx;
	}

	/*----------------------------团购---------------------------------------------- */

	.pingtuan {
		background: #fff;
		height: 100rpx;
		background: #f31367;
		color: #fff;
		overflow: hidden;
	}

	.left {
		width: 60%;
		display: inline-block;
		float: left;
	}

	.left .jge {
		font-size: 46rpx;
		padding-left: 21rpx;
	}

	.left .jge span {
		font-size: 31rpx;
		margin-right: 8rpx;
	}

	.zekou {
		padding-left: 21rpx;
		line-height: 30rpx;
		position: relative;
		bottom: 8rpx;
		overflow: hidden;
	}

	.pingtuan .zekou p {
		font-size: 20rpx;
		position: relative;
		bottom: 2rpx;
		padding: 0 19rpx;
		border: none;
		border-radius: 15rpx;
		background: #c20f52;
	}

	.pingtuan .zekou p span {
		font-size: 18rpx;
		background: transparent;
		color: #fff;
		height: 100%;
		display: inline-block;
		margin-right: 10rpx;
	}

	.zekou>span {
		font-size: 20rpx;
		text-decoration: line-through;
		margin-left: 10rpx;
	}

	.dime {
		font-size: 20rpx;
		display: flex;
		align-items: center;
	}

	.dime image {
		display: inline-block;
		width: 26rpx;
		height: 26rpx;
	}

	.dime em {
		margin: 0 8rpx;
	}

	.pingtuan .dime span {
		margin: 0 5rpx;
		display: inline-block;
		width: 34rpx;
		height: 24rpx;
		text-align: center;
		line-height: 24rpx;
		background: #fdc0d5;
	}

	.pingtuan .dime span:nth-child(2n) {
		padding: 0;
		width: 1rpx;
		height: 1rpx;
	}

	.rtop {
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 8rpx;
	}

	.over {
		padding-left: 67rpx;
	}

	/*----------------------------拼团--------------------------------------------- */

	.pingtuanA {
		background-size: 100% 100%;
		width: 100%;
		height: 140rpx;
		display: flex;
		align-items: center;
		padding: 0 26rpx 0 31rpx;
		box-sizing: border-box;
		color: #FFFFFF;
		justify-content: space-between;
	}

	.pingtuanA .left {
		width: 60%;
		height: 100%;
		line-height: 100rpx;
		display: inline-block;
		float: left;
		overflow: hidden;
	}

	.left .jge {
		font-size: 51rpx;
		padding-left: 21rpx;
	}

	.tuanfan {
		float: right;
		font-size: 20rpx;
		width: 150rpx;
		height: 83rpx;
		line-height: 37rpx;
		padding-top: 17rpx;
	}

	.usertuan p {
		background: #b20a10;
		margin-top: 2rpx;
		padding: 0 12rpx;
		border-radius: 32rpx;
	}

	.usertuan image {
		width: 23rpx;
		height: 19rpx;
		margin-right: 5rpx;
	}

	.left .jge span {
		font-size: 32rpx;
		margin-right: 8rpx;
	}

	.pingtuanA .right {
		display: inline-block;
		width: 40%;
		height: 100%;
		background: transparent;
		padding: 12rpx 0 0 0;
		color: #65540f;
	}

	.dime {
		/* padding-left: 50rpx; */
		font-size: 20rpx;
		display: flex;
		align-items: center;
	}

	.dime image {
		display: inline-block;
		width: 26rpx;
		height: 26rpx;
	}

	.dime em {
		margin: 0 8rpx;
	}

	.pingtuanA .dime span {
		margin: 0 5rpx;
		display: inline-block;
		width: 34rpx;
		height: 24rpx;
		text-align: center;
		line-height: 24rpx;
		background: #d0b340;
	}

	.pingtuanA .dime span:nth-child(2n) {
		padding: 0;
		width: 1rpx;
		height: 1rpx;
	}

	.rtop {
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 8rpx;
	}

	/*-----------------手机专享----------------------------------------  */

	.zhuanxiang {
		float: right;
		font-size: 25rpx;
		color: #ee1b21;
		border: 1rpx solid #ee1b21;
		border-radius: 5rpx;
	}

	/*-------优惠套装------------------------  */

	.other {
		width: 100%;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	}

	.lisheng {
		border: none !important;
		margin-top: 8rpx !important;
	}

	.yhtz {
		margin-top: 8rpx !important;
	}

	.setother {
		width: 750rpx;
		background-color: #fff;
		margin-top: 30rpx;
		overflow: hidden;
		position: relative;
		height: auto;
		padding-bottom: 20rpx;
	}

	.biaoti {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.biaoti span {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
	}

	.biaoti em {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
		margin-left: 5rpx;
	}

	.titlea {
		background-color: #fff;
		display: flex;
		justify-content: space-between;
	}

	.goodsBox {
		display: flex;
		padding-left: 31rpx;
		padding-right: 84rpx;
		padding-top: 30rpx;
		color: #929292;
		width: 464rpx;
		align-items: center;
	}

	.goodsBox span {
		margin: 0 20rpx;
	}


	.zhifu {
		position: absolute;
		right: 21rpx;
		top: 32rpx;
		font-size: 26rpx;
		text-align: right;
	}

	.zhifu p span {
		color: #f41919;
	}

	.zhifu .yhtz {
		margin-top: 25rpx;
		color: #fff;
		background: #f41919;
		border-radius: 17rpx;
		text-align: center;
		height: 34rpx;
		width: 127rpx;
		margin-left: 15rpx;
	}

	.gengduo {
		width: 100%;
		text-align: center;
		height: 56rpx;
		line-height: 56rpx;
		background: #fff;
		position: absolute;
		bottom: 0;
		font-size: 30rpx;
		color: #6d6d6d;
	}

	.gengduo em {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
	}

	.rotate {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
		top: -8rpx;
	}

	.setRotate {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
		transform: rotate(-134deg);
		top: 3rpx;
	}

	/*---------------------------------------------------------------------------------------------------------  */

	/*------推荐组合------------------------------------------------------------------------------------------------------  */

	.otherA {
		width: 750rpx;
		background-color: #fff;
		margin-top: 20rpx;
		overflow: hidden;
		position: relative;
		/* height: 351rpx;
    padding-bottom: 20rpx; */
	}

	.setotherA {
		width: 750rpx;
		background-color: #fff;
		margin-top: 30rpx;
		overflow: hidden;
		position: relative;
		height: auto;
		padding-bottom: 20rpx;
	}

	.tuijianzuhe {
		width: 100%;
		display: flex;
		padding: 30rpx 0 10rpx 20rpx;
		box-sizing: border-box;
	}

	.tuijianzuhe text:nth-child(1) {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
	}

	.tuijianzuhe text:nth-child(2) {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(251, 27, 27, 1);
		line-height: 45rpx;
		margin-left: 10rpx;
	}

	.goodsBox {
		display: flex;
		padding-left: 31rpx;
		padding-right: 84rpx;
		padding-top: 30rpx;
		color: #929292;
		width: 484rpx;
		box-sizing: border-box;
	}

	.Discount {
		padding: 0;
		margin-top: 20rpx;
		box-sizing: border-box;
	}

	/* 推荐组合 */
	.recommended_com_con {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx 30rpx;
		box-sizing: border-box;
		width: 100%;
	}

	.recommended_combination {
		display: flex;
		align-items: center;
	}

	.combination {
		position: relative;
	}

	.combination_price {
		width: 160rpx;
		height: 36rpx;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0 0 15rpx 15rpx;
		position: absolute;
		text-align: center;
		left: 0;
		bottom: 9rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(254, 254, 254, 1);
		line-height: 36rpx;
		z-index: 10;
	}

	.combination_price text:nth-child(2) {
		font-size: 24rpx;
	}


	.combination_image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 15rpx;
	}

	.combination_add {
		width: 16rpx;
		height: 16rpx;
		margin: 0 20rpx;
	}

	.combination_More {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.combination_More .ellipsis_image {
		width: 18rpx;
		height: 4rpx;
		margin-right: 31rpx;
	}

	.combination_More .more_image {
		width: 12rpx;
		height: 20rpx;
	}

	.zhifu {
		position: absolute;
		right: 21rpx;
		top: 32rpx;
		font-size: 26rpx;
		text-align: right;
	}

	.zhifu p span {
		color: #f41919;
	}

	.zhifu view {
		margin-top: 25rpx;
		color: #f41919;
		border: 1rpx solid #f41919;
		border-radius: 17rpx;
		text-align: center;
		height: 34rpx;
		width: 127rpx;
		margin-left: 15rpx;
	}

	.gengduo {
		width: 100%;
		text-align: center;
		height: 56rpx;
		line-height: 56rpx;
		background: #fff;
		position: absolute;
		bottom: 0;
		font-size: 30rpx;
		color: #6d6d6d;
	}

	.gengduo em {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
	}

	.rotateA {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
		top: -8rpx;
	}

	.setRotateA {
		position: relative;
		transition-timing-function: linear;
		transition: 0.5s;
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border: 1px solid #676767;
		border-top: none;
		border-left: none;
		transform: rotate(-134deg);
		top: 3rpx;
	}

	/*------------------------------------------------------------------------------------------------------------------------------------  */

	/*-------------------满减-------------------------------------*/

	.reduction {
		position: relative;
		background: #fff;
		display: block;
		font-size: 26rpx;
		overflow: hidden;
		transition-timing-function: linear;
		transition: 5s;
	}

	.reduction .manjian_goods p {
		width: 458rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	#Open {
		height: auto;
	}

	#Open .manjian_goods p {
		width: 458rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.manjian {
		display: block;
		position: relative;
		/*height: 0.521rem;*/
		line-height: 23.966rpx;
		color: #333;
	}

	em.chuxiao {
		position: absolute;
		color: #f00;
		left: 23rpx;
		top: 4.2rpx;
		height: 20rpx;
		line-height: 20rpx;
		font-size: 18.64rpx;
		border-radius: 3px;
		padding: 0.1rem;
		padding-top: 0.05rem;
		border: 1px solid #f00;
	}

	.btn_open {
		position: absolute;
		right: -0.3rem;
		top: -0.6rem;
		padding: 28rpx 40rpx;
		/* z-index: 1000; */
	}

	.radius {
		display: block;
		width: 0.4rem;
		height: 0.4rem;
		border: 1px solid #676767;
		transition-timing-function: linear;
		transition: 0.5s;
		transform: rotate(45deg);
		border-top: none;
		border-left: none;
	}

	.manjian_goods {
		display: block;
		position: relative;
		color: #333;
	}

	.manjian_goods dl {
		display: block;
		padding-bottom: 33.994rpx;
		clear: both;
		padding-top: 16rpx;
		border-bottom: 1px solid #e1e1e1;
	}

	.manjian_goods:last-child dl:last-child {
		border: none;
	}

	.manjian_goods dl dt {
		float: left;
		display: block;
		width: 89.7rpx;
		height: 89.7rpx;
		margin-right: 14.076rpx;
	}

	.manjian_goods dl dt image {
		width: 90rpx;
		height: 90rpx;
		border: 1px solid #eee;
	}

	.manjian_goods dl dd {
		font-size: 21.998rpx;
		color: #999;
		display: block;
		line-height: 32.199rpx;
		padding-right: 59.954rpx;
	}

	.manjian_goods dl dd strong {
		color: #ff1f1f;
	}

	.manjian_box {
		position: relative;
		display: block;
	}

	.first_goods {
		position: relative;
		display: block;
	}

	/*-----满减---end---------------------------  */

	page {
		background-color: #f0f2f5;
	}

	.goods_lunbo {
		/* position: relative; */
	}

	.goods_detail_swiper {
		width: 100%;
		height: 750rpx;
	}

	.goods_detail_swiper swiper-item {
		/* position: relative; */
		width: 100%;
		height: 750rpx;
	}
	.uni-swiper-dot,.swiper-box,.video_btn,.swiper_item,.slide-image{
		width: 100%;
		height: 750rpx;
	}
	

	.goods_detail_swiper swiper-item video {
		width: 100%;
		height: 750rpx;
	}

	.goods_detail_swiper swiper-item image {
		width: 100%;
		height: 750rpx;
	}

	.goods_detail_swiper swiper-item text {
		position: fixed;
		bottom: 31rpx;
		right: 29rpx;
		width: 60rpx;
		height: 32rpx;
		background: rgba(0, 0, 0, 1);
		opacity: 0.2;
		border-radius: 16rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		z-index: 10;
		text-align: center;
		line-height: 32rpx;
	}

	.goods_detail_swiper image {
		width: 700rpx;
		height: 700rpx;
	}

	.goods-detail-name {
		display: block;
		padding: 0 20rpx 0;
		background-color: #fff;
		position: relative;
		font-weight: bold;
	}

	.goods-detail-name:before {
		height: 2rpx;
		content: '';
		width: 100%;
		position: absolute;
		top: -2rpx;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.goods-detail-name dt {
		display: block;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1) !important;
		line-height: 32rpx;
		width: 701rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		/* margin-bottom: 18rpx; */
	}

	.goods_names1 {
		width: 100%;
		font-size: 34rpx;
		font-weight: 600;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.goods-detail-name dd {
		display: flex;
		justify-content: space-between;
		margin-top: 14rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(85, 85, 85, 1);
		line-height: 36rpx;
		width: 701rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-detail-name dd .goods-jingle {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-jingle1 {
		width: 681rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #555555;
		line-height: 36rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		margin-top: 19rpx;
	    padding-bottom: 10px;
		margin-bottom: 20rpx;
	}

	.goods-detail-name dd .share {
		flex: 0 0 84rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 84rpx;
		height: 84rpx;
	}

	.goods-detail-name dd .share image {
		width: 54rpx;
		height: 54rpx;
	}

	.goods-detail-price {
		position: relative;
		z-index: 1;
		display: block;
		background-color: #fff;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.goods-detail-price dl {
		display: inline-block;
	}

	.goods-detail-price dt {
		color: #f23030;
		line-height: 46rpx;
	}

	.goods-detail-price dt em {
		font-size: 55.2rpx;
		font-weight: 700;
		margin: 0 10rpx 0 4rpx;
		margin: 0 10rpx 0 0;
		display: inline-block;
	}

	.goods-detail-price dd {
		display: inline-block;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(85, 85, 85, 1);
		line-height: 36rpx;
	}

	.goods-detail-price .sold {
		position: absolute;
		z-index: 1;
		top: 12rpx;
		right: 35rpx;
		display: block;
		font-size: 26rpx;
		line-height: 46rpx;
		height: 46rpx;
	}

	.goods-detail-price .sale_num {
		position: absolute;
		z-index: 1;
		top: 12rpx;
		right: 35rpx;
		display: block;
		font-size: 26rpx;
		line-height: 46rpx;
		height: 46rpx;
	}

	.goods_detail_instro {
		background-color: #f0f2f5;
	}

	.goods-detail-item {
		position: relative;
		z-index: 1;
		padding: 23rpx;
		background: #fff;
	}

	.goods-detail-item {
		position: relative;
		z-index: 1;
		padding: 17rpx 23rpx;
		background: #fff;
		display: block;
		margin-top: 20rpx;
	}

	.goods-detail-item .itme-name {
		// position: absolute;
		z-index: 1;
		top: 17rpx;
		left: 23rpx;
		display: block;
		height: 42rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
	}

	.goods-detail-item .item-con {
		display: block;
		margin-left: 50rpx;
		padding-right: 10rpx;
		flex: 1;
	}

	.goods-detail-item .item-con dl {
		display: block;
		line-height: 42rpx;
	}

	.goods-detail-item .item-con dt {
		font-size: 28rpx;
		color: #333;
	}

	.specification_default {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 45rpx;
	}

	.goods-detail-sel dt span {
		display: inline-block;
		height: 42rpx;
		margin: 0 14rpx 0rpx 0;
		padding: 0 10rpx;
		position: relative;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.goods-detail-sel dt span em {
		color: #81838e;
	}

	.item-more {
		display: flex;
		align-items: center;
	}

	.item-more text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 40, 31, 1);
		line-height: 45rpx;
	}

	.item-more image {
		display: block;
		width: 12rpx;
		height: 20rpx;
		margin-left: 18rpx;
	}

	.bbctouch-bottom-mask-rolling {
		min-height: 88rpx;
		overflow: hidden;
		position: relative;
		z-index: 1;
		display: block;
		background: #fff;
	}

	.goods-options-stock {
		padding: 14rpx 23rpx;
		display: block;
		position: relative;
	}

	.goods-options-stock .speclist_title {
		display: block;
		height: 42rpx;
		padding: 5rpx 0;
		font-size: 28rpx;
		color: #888;
		line-height: 42rpx;
	}

	.goods-options-stock dd {
		display: block;
		font-size: 0;
	}

	.goods-options-stock dd .specdetail:first-child {
		margin-left: 0;
	}

	.goods-options-stock dd .specdetail.current {
		color: #fff;
		background: #f15353;
		border: none;
	}

	.goods-options-stock dd .specdetail {
		display: inline-block;
		height: 42rpx;
		padding: 12rpx 20rpx;
		margin-left: 14rpx;
		margin-bottom: 14rpx;
		font-size: 25rpx;
		color: #272726;
		line-height: 42rpx;
		background: #fff;
		background: #f3f2f8;
		border-radius: 7rpx;
	}

	.goods-option-value {
		display: block;
		height: 56rpx;
		padding: 23rpx;
		line-height: 56rpx;
		font-size: 28rpx;
		color: #232326;
		position: relative;
		background: #fff;
		margin-top: 20rpx;
	}

	.bbctouch-bottom-mask-rolling:before {
		height: 2rpx;
		content: '';
		width: 100%;
		position: absolute;
		top: 0;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.goods-option-value:before {
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

	.value-box {
		display: inline-block;
		float: right;
		font-size: 0;
		border-radius: 10rpx;
		position: relative;
		height: 50rpx;
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
		background-repeat: 50% 50%;
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
		height: 50rpx;
		border-right: 2rpx solid #cbcbcb;
		border-radius: 0;
		-webkit-border-radius: 0;
		transform: scaleX(0.5);
		-webkit-transform: scaleX(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
	}

	.value-box span .buy-num {
		color: #232326;
		border: none;
	}

	.value-box span .buy-num {
		width: 70rpx;
		height: 50rpx;
		font-size: 30rpx;
		font-weight: lighter;
		line-height: 50rpx;
		text-align: center;
		border-radius: 0;
		padding: 0;
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

	.value-box span {
		display: inline-block;
		vertical-align: top;
		line-height: 0;
	}

	.value-box span.add a {
		background-repeat: no-repeat;
		background-repeat: 50% 50%;
		background-size: 100%;
	}

	.value-box span a {
		display: block;
		width: 20rpx;
		height: 22rpx;
		margin: 14rpx;
		opacity: 0.65;
	}

	.value-box:after {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		width: 200%;
		height: 200%;
		border: 1px solid #cbcbcb;
		border-radius: 8rpx;
		-webkit-border-radius: 8rpx;
		transform: scale(0.5);
		-webkit-transform: scale(0.5);
		transform-origin: top left;
		-webkit-transform-origin: top left;
		pointer-events: none;
	}

	.spec {
		display: block;
	}

	/* 商品买家秀 */
	.buy_show {
		width: 100%;
		background: #fff;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
	}

	.buy_show_top {
		width: 100%;
		height: 80rpx;
		padding-top: 31rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.show_left {
		display: flex;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.show_left text {
		font-size: 28rpx;
	}

	.show_right {
		display: flex;
		align-items: center;
	}

	.show_right text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 40, 31, 1);
		line-height: 45rpx;
	}

	.show_right image {
		width: 12rpx;
		height: 20rpx;
		margin-left: 18rpx;
	}

	.buy_show_con {
		display: flex;
		margin-top: 20rpx;
	}

	.buy_show_con image {
		width: 177rpx;
		height: 177rpx;
		margin-right: 1rpx;
	}
	
	.buy_show_con image:nth-last-of-type(1){
		border-radius: 0 15rpx 15rpx 0;
	}
	
	.buy_show_con image:nth-child(1) {
		border-radius: 15rpx 0 0 15rpx;
	}
	.buy_show_con1 image{
		border-radius: 15rpx!important;
	}
	

	.buy_show_bottom {
		width: 100%;
		height: 85rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.buy_show_bottom .line {
		width: 160rpx;
		height: 1rpx;
		background: #F9F9F9;
	}

	.buy_show_bottom text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 39rpx;
		margin: 0 15rpx;
	}

	/* 进入店铺 */
	.goods-detail-store {
		display: block;
		margin-top: 20rpx;
	}

	.goods_detail_store {
		width: 100%;
		height: 212rpx;
		background: #fff;
	}

	.goods_store_top {
		width: 100%;
		height: 159rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.goods_store_tl {
		display: flex;
		align-items: center;
	}

	.goods_store_tl .avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 15rpx;
	}

	.goods_store_des {
		margin-left: 21rpx;
		display: flex;
		flex-direction: column;
	}

	.goods_store_name {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.goods_store_service {
		display: flex;
		align-items: center;
		height: 31rpx;
		background: #F8F8F8;
		border-radius: 16rpx;
		box-sizing: border-box;
		margin-top: 19rpx;
		width: 290rpx;
		justify-content: center;
	}

	.goods_store_service text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-right: 12rpx;
		overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
	}

	.star_rating {
		display: flex;
		width: 156rpx;
	}

	.star_rating image {
		width: 24rpx;
		height: 23rpx;
	}

	.go_vendor {
		width: 140rpx;
		height: 48rpx;
		background: linear-gradient(45deg, rgba(252, 28, 28, 1) 0%, rgba(255, 114, 10, 1) 100%);
		border-radius: 24rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 48rpx;
		text-align: center;
	}

	.goods_store_bottom {
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.gooods_bottom_pre {
		display: flex;
		align-items: center;
		height: 30rpx;
		border-right: 1rpx solid #F0F3F8;
		box-sizing: border-box;
	}

	.gooods_bottom_pre:nth-of-type(1),
	.gooods_bottom_pre:nth-of-type(2) {
		width: 228rpx;
	}

	.gooods_bottom_pre:nth-of-type(3) {
		border-right: none;
	}

	.gooods_bottom_pre text:nth-of-type(1) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(85, 85, 85, 1);
		line-height: 45rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.gooods_bottom_pre text:nth-of-type(2) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 40, 31, 1);
		line-height: 45rpx;
		margin: 0 9rpx;
	}

	.gooods_bottom_pre image {
		width: 30rpx;
		height: 30rpx;
	}



	.goods-detail-store .store-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 46rpx;
		padding: 23rpx 0 12rpx 0;
		font-size: 28rpx;
		line-height: 46rpx;
		color: #222;
	}

	.goods-detail-store .store-name .store_logo {
		display: flex;
		align-items: center;
	}

	.goods-detail-store .store-name .store_logo image {
		width: 46rpx;
		height: 46rpx;
		margin-right: 15rpx;
	}

	.goods-detail-store .store-name .store_right {
		display: flex;
		align-items: center;
	}

	.goods-detail-store .store-name .store_right image {
		width: 40rpx;
		height: 30rpx;
	}

	.goods-detail-store .store-name .store_right image.more {
		width: 20rpx;
		height: 0;
		opacity: 0.4;
		margin-left: 10rpx;
	}

	.goods-detail-store .store-rate {
		height: 35rpx;
		padding: 19rpx 0 23rpx 0;
		font-size: 0;
		position: relative;
		display: block;
	}

	.goods-detail-store .store-rate:before {
		height: 1px;
		content: '';
		width: 100%;
		border-top: 1px solid #e3e5e9;
		position: absolute;
		top: 0;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.goods-detail-store .store-rate span {
		display: inline-block;
		width: 33.33%;
		height: 33rpx;
		font-size: 26rpx;
		line-height: 33rpx;
		color: #888;
	}

	.goods-detail-store .store-rate span em {
		color: #f15353;
	}

	.goods-detail-store .store-rate span em {
		display: inline-block;
		vertical-align: middle;
		font-size: 28rpx;
	}

	.goods-detail-store .store-rate span i {
		display: inline-block;
		vertical-align: middle;
		width: 33rpx;
		height: 33rpx;
		font-size: 21rpx;
		line-height: 33rpx;
		font-style: normal;
		text-align: center;
		border-radius: 5rpx;
		padding: 2rpx 6rpx;
	}

	.goods-detail-store .store-rate span i {
		color: #fff;
		background-color: #f15353;
	}

	.item-down {
		position: absolute;
		z-index: -1;
		top: 26rpx;
		right: 23rpx;
		display: block;
		width: 25rpx;
		height: 21rpx;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 80%;
		opacity: 0.8;
	}

	.item-up {
		position: absolute;
		z-index: -1;
		top: 26rpx;
		right: 23rpx;
		display: block;
		width: 25rpx;
		height: 21rpx;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 80%;
		opacity: 0.8;
	}

	.fix-block-r {
		width: 88rpx;
		height: 88rpx;
		position: fixed;
		z-index: 5;
		right: 23rpx;
		bottom: 115rpx;
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
		width: 70rpx;
		height: 70rpx;
	}

	.gotop {
		right: 0rpx;
		height: 88rpx;
		top: 0rpx;
		width: 100rpx;
		display: inline-block;
		text-align: center;
	}

	.fix-block-r a.gotop-btn {
		margin-top: 12rpx;
	}

	.goods-detail-comment {
		background-color: #fff;
		padding: 0 20rpx 0rpx 20rpx;
		margin-top: 18rpx;
		display: block;
	}

	.goods-detail-comment .title {
		display: flex;
		justify-content: space-between;
	}

	.goods-detail-comment .title a {
		display: flex;
		position: relative;
		z-index: 1;
		padding: 23rpx 0;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.goods-detail-comment .title span {
		font-size: 26rpx;
		margin-left: 19rpx;
		color: #f15353;
	}

	.goods-detail-comment .title .rate-num {
		position: absolute;
		z-index: 1;
		top: 23rpx;
		right: 46rpx;
		color: #888;
		font-size: 26rpx;
	}

	.goods-detail-comment .title .rate {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
	}

	.goods-detail-comment .title .rate view {
		display: inline-block;
	}

	.goods-detail-comment .title .item-more {
		right: 0;
	}

	.goods_storage {
		float: right;
		font-size: 26rpx;
		margin-left: 16rpx;
	}

	.goods-detail-foot {
		position: fixed;
		z-index: 150;
		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
		height: 92rpx;
		filter: progid:DXImageTransform.Microsoft.gradient(enabled='true', startColorstr='#F2F5F5F5', endColorstr='#F2F5F5F5');
		background: #FFFFFF;
		/* min-width: px; */
		/* max-width: 640px; */
		/* width: 100%; */
		width: 750rpx;
		margin: 0 auto;
		box-shadow: 0 0 10rpx 0 rgba(155, 143, 143, 0.6);
		display: flex;
		padding-right: 20rpx;
		box-sizing: border-box;
	}

	/* .goods-detail-foot .otreh-handle, .goods-option-foot .otreh-handle {
    float: left;
    width: 35%;
    font-size: 0;
    line-height: 0;
} */

	.goods-detail-foot .otreh-handle a.kefu,
	.goods-option-foot .otreh-handle a.kefu {
		width: 44%;
	}

	.goods-detail-foot .otreh-handle a,
	.goods-option-foot .otreh-handle a {
		position: relative;
		z-index: auto;
		display: inline-block;
		height: 90rpx;
		text-align: center;
		color: #333;
	}

	.goods-detail-foot .otreh-handle a.cart,
	.goods-option-foot .otreh-handle a.cart {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 50%;
	}

	.otreh-handle {
		display: flex;
		align-items: center;
	}

	.otreh-handle .cart {
		border-right: 1rpx solid #e2e2e2;
	}

	.otreh-handle .cart:last-child {
		border: none;
	}

	.goods-detail-foot .otreh-handle a p,
	.goods-option-foot .otreh-handle a p {
		display: block;
		height: 37rpx;
		color: #2d2d2d;
		font-size: 20rpx;
		line-height: 37rpx;
		margin-top: 1rpx;
	}

	.goods-detail-foot .buy-handle,
	.goods-option-foot .buy-handle {
		display: flex;
		align-items: center;
		/* height: 98rpx; */
	}

	.goods-detail-foot .buy-handle a,
	.goods-option-foot .buy-handle a {
		/* flex: 1;
    display: block;
    height: 92rpx;
    font-size: 30rpx;
    line-height: 92rpx;
    color: #fff;
    text-align: center; */
	}

	.goods-detail-foot .buy-handle a.buy-now,
	.goods-option-foot .buy-handle a.buy-now {
		background-color: #f4133d;
	}

	.buy-now {
		background: #f4133d;
	}

	.goods-detail-foot .buy-handle a.add-cart,
	.goods-option-foot .buy-handle a.add-cart {
		float: right;
		/* width: 50%; */
		background-color: #ffb03f;
	}

	.goods-detail-foot .otreh-handle a i,
	.goods-option-foot .otreh-handle a i {
		display: inline-block;
		width: 30rpx;
		margin: 15rpx auto 3rpx auto;
	}

	.no_cart_goods {
		height: 500rpx;
		margin-top: 185rpx;
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
		width: 375rpx;
		margin: 0 auto;
	}

	.goods-detail-foot .otreh-handle a sup,
	.goods-option-foot .otreh-handle a sup {
		position: absolute;
		z-index: 1;
		top: 10rpx;
		left: 70rpx;
		min-width: 22rpx;
		height: 22rpx;
		font-size: 18rpx;
		line-height: 20rpx;
		color: #e1251b;
		padding: 0 5rpx;
		border: solid 1rpx #e1251b;
		border-radius: 11rpx;
		background: #fff;
		box-sizing: border-box;
	}

	sup {
		vertical-align: text-top;
	}

	#goodsExtends {
		/* padding-top: 34rpx; */
		background: #FFF;
		margin-top: 20rpx;
	}

	#goodsExtends .extend-item {
		display: flex;
		background-color: #fff;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	}
	.points_des{
		padding: 0 20rpx!important;
		box-sizing: border-box;
	}

	#goodsExtends .extend-item .label {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		margin-right: 38rpx;
		flex-shrink: 0;
	}

	#goodsExtends .extend-item .jifen {
		display: flex;
		width: 100%;
		height: 90rpx;
		align-items: center;
	}

	#goodsExtends .extend-item .jifen .label {
		margin-right: 39rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
	}

	.extend-item_fuwu {
		border-top: 20rpx solid #F5F5F5;
	}

	#goodsExtends .extend-item .fuwu {
		display: flex;
		width: 100%;
		padding: 34rpx 0 30rpx;
		box-sizing: border-box;
		justify-content: space-between;
	}

	#goodsExtends .extend-item .fuwu .fuwu_con {
		display: flex;
		width: 718rpx;
	}

	#goodsExtends .extend-item .fuwu .label {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
		width: 106rpx;
	}

	.fuwu_sel {
		width: 24rpx;
		height: 24rpx;
		margin-right: 6rpx;
	}


	/* 服务 */
	.fuwu_con_des {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 90rpx;
		background: #FFFFFF;
		justify-content: space-between;
	}

	.fuwu_left {
		display: flex;
	}

	.fuwu_left_title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		line-height: 90rpx;
		margin-right: 37rpx;
	}

	.fuwu_left_list {
		width: 500rpx;
		white-space: nowrap;
		height: 90rpx;
		display: flex;
	}

	.fuwu_list_pre {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		height: 90rpx;
	}

	.fuwu_list_pre image {
		width: 24rpx;
		height: 24rpx;
	}

	.fuwu_list_pre text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #555555;
		line-height: 90rpx;
	}

	.fuwu_more {
		width: 12rpx;
		height: 20rpx;
	}


	#goodsExtends .extend-item .item-left {
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		/* padding-bottom: 29rpx; */
		box-sizing: border-box;
	}

	#goodsExtends .extend-item .item-left .label {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
	}

	#goodsExtends .extend-item .item-left .label1 {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 45, 45, 1);
		line-height: 39rpx;
	}

	.extend-item .item-left .item-left-con {
		display: flex;
		align-items: center;
		width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
		margin-left: 15rpx;
	}

	.highest_points {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 45rpx;
	}

	.extend-item .item-left-con text {
		margin-right: 10rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(85, 85, 85, 1);
		line-height: 45rpx;
	}

	.extend-item .item-r-more image {
		width: 20rpx;
		height: 0;
		opacity: 0.4;
	}

	/*服务标签 内容 模板  */

	.buydes-dialog-container {
		width: 750rpx;
		height: 100%;
		justify-content: space-between;
		/* background-color:rgba(15, 15, 26, 0.7);   */
		background-color: transparent;
		position: fixed;
		top: 0;
		z-index: -1;
		transition: all 0.3s;
	}

	.buydes-dialog-container.on {
		background-color: rgba(15, 15, 26, 0.5);
		z-index: 999;
	}

	.buydes-dialog-container-top {
		flex-grow: 1;
		height: 100%;
	}

	.buydes-dialog-container-bottom {
		width: 100%;
		display: block;
		position: absolute;
		z-index: 22;
		height: 900rpx;
		bottom: 0;
		left: 0;
		right: 0;
		/* min-height: 700rpx; */
		background: #fff;
		transform: translateY(100%);
		transition: all 0.3s;
		border-radius: 15rpx 15rpx 0 0;
	}

	.buydes-dialog-container-bottom.on {
		transform: translateY(0);
	}

	.goods-tags-intro-top {
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx 0 30rpx;
		align-items: center;
		height: 89rpx;
		border-radius: 15rpx 15rpx 0 0;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.goods-tags-intro-top text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}

	.model_close_image {
		width: 46rpx;
		height: 46rpx;
		margin-right: -24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.model_close_image image {
		width: 22rpx;
		height: 20rpx;
	}


	.goods-tags-intro-list {
		padding: 20rpx;
		display: block;
		box-sizing: border-box;
	}

	.goods-tags-intro-item {
		padding: 30rpx 0;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f2f2f2;
	}

	.goods-tags-intro-list .goods-tags-intro-item .tags-item-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
	}

	#product_tags_roll {
		max-height: 782rpx;
		overflow-x: hidden;
		overflow-y: scroll;
		display: block;
	}

	.goods-tags-intro-list .goods-tags-intro-item .tags-item-intro {
		display: block;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 45rpx;
	}

	/*详情页活动标示  */

	.goods-detail-price .huodong {
		font-size: 20.7rpx;
		line-height: 27.6rpx;
		vertical-align: middle;
		display: inline-block;
		height: 27.6rpx;
		padding-right: 4.6rpx;
		margin-top: 2.3rpx;
		margin-left: 3rpx;
		border: solid #ec5464 2.3rpx;
		color: #ec5464;
	}

	.goods-detail-price .huodong.huodong-tuan {
		border: 0;
		background-color: #ec5f40;
		padding: 0.1rem 0.2rem;
		color: #fff;
		border-radius: 0.1rem;
	}

	.goods-detail-price .huodong.huodong-xianshi {
		border: 0;
		background-color: #ac20de;
		padding: 0.1rem 0.2rem;
		color: #fff;
		border-radius: 0.1rem;
	}

	.goods-detail-price .huodong.huodong-mbuy {
		border: 0;
		background-color: #67beef;
		padding: 0.1rem 0.2rem;
		color: #fff;
		border-radius: 0.1rem;
	}

	.goods-detail-price .huodong.huodong-pin {
		border: 0;
		background-color: #ec5f40;
		padding: 0.1rem 0.2rem;
		color: #fff;
		border-radius: 0.1rem;
	}

	.goods-detail-price .yu-sale {
		float: right;
		font-size: 20.7rpx;
		line-height: 59.8rpx;
		margin-top: 2.3rpx;
		height: 27.6rpx;
		display: inline-block;
		color: #333;
	}

	.goods-detail-price .yu-sale em {
		color: #e2984d;
	}

	/* 限时购 详情 */

	.xianshi-div {
		overflow: hidden;
		height: 115rpx;
	}

	.xianshi-div.ready-start {
		background-color: #fec286;
	}

	.xianshi-div.started {
		background: linear-gradient(90deg, #fee0a8, #fda63b);
	}

	.xianshi-div.ready-start .xianshi-div-left,
	.xianshi-div.started .xianshi-div-left {
		display: inline-block;
		line-height: 110.4rpx;
		float: left;
		box-sizing: border-box;
		padding: 0 23rpx;
	}

	.xianshi-div.ready-start .xianshi-div-left {
		width: 65%;
	}

	.xianshi-div.started .xianshi-div-left {
		width: 55%;
	}

	.xianshi-div .xianshi-div-left .goods-price em {
		padding: 0 0 0 9.2rpx;
	}

	.xianshi-div .xianshi-div-left .goods-price {
		font-size: 55.2rpx;
		font-weight: bolder;
		color: #b71820;
	}

	.xianshi-div .xianshi-div-left .goods-market-price {
		font-size: 32.2rpx;
		line-height: 115rpx;
		display: inline-block;
		vertical-align: top;
		text-decoration: line-through;
		color: #fff;
		margin: 0 0 0 13.8rpx;
	}

	.xianshi-div .xianshi-div-right {
		display: inline-block;
		float: left;
		font-size: 27.6rpx;
		font-weight: normal;
		position: relative;
		padding: 13.8rpx 0 0 46rpx;
		height: 115rpx;
		overflow: hidden;
		box-sizing: border-box;
	}

	.xianshi-div.ready-start .xianshi-div-right {
		width: 30%;
		color: #cd7f2b;
	}

	.xianshi-div.started .xianshi-div-right {
		width: 45%;
		color: #fff;
	}

	.xianshi-div.ready-start .xianshi-div-right div {
		line-height: 46rpx;
		height: 46rpx;
	}

	.xianshi-div.ready-start .xianshi-div-right:before {
		height: 161rpx;
		content: '';
		width: 1px;
		border-right: 1px solid #cd7f2b;
		position: absolute;
		bottom: -23rpx;
		left: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.xianshi-div .countdown .countdown-num {
		background-color: #c68f40;
		padding: 0 4.6rpx;
		font-weight: bold;
		font-size: 27.6rpx;
	}

	.countdown-break-flag {
		margin: 9rpx;
	}

	.xianshi-div .countdown .countdown-break-flag {
		margin: 0 9rpx;
	}

	.xianshi-div .scheduleMod {
		margin: 0 32.2rpx 0 0;
	}

	.xianshi-div .scheduleMod .scheduleModCont {
		background: #fcd4ad;
		text-align: center;
		color: #fff;
		border-radius: 32.2rpx;
		position: relative;
		height: 32.2rpx;
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
	}

	.xianshi-div .scheduleMod .scheduleModCont em {
		font-size: 26rpx;
		height: 32.2rpx;
		line-height: 32.2rpx;
		color: #fff;
		position: absolute;
		top: 0;
		left: 4px;
		z-index: 8;
	}

	.xianshi-div .scheduleMod .scheduleModCont .scheduleleft {
		font-size: 26rpx;
		color: #fff;
		background: #ff9428;
		position: absolute;
		top: 0;
		left: 0;
		width: 0%;
		height: 32.2rpx;
		border-radius: 32.2rpx;
		text-align: center;
	}

	.xianshi-div .scheduleMod .scheduleModCont .scheduleNum {
		position: absolute;
		top: 0;
		right: 6px;
		color: #fd9135;
		height: 32.2rpx;
		font-size: 26rpx;
		line-height: 32.2rpx;
	}

	.xianshi-div .scheduleMod .scheduleModCont .soldOut {
		width: 100%;
		text-align: center;
		color: #fff;
		z-index: 10;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		height: 20px;
	}

	/* 优惠券 */

	#goodsRed {
		padding: 0;
	}

	.get_pou {
		background: #F5F5F5;
	}

	#product_red_roll {
		background: #F5F5F5;
	}

	#product_red_roll .bbctouch-tickets {
		min-height: 46rpx;
		padding-bottom: 9.2rpx;
	}

	.go_use {
		width: 135rpx;
		height: 50rpx;
		border: 1rpx solid #FF0000;
		border-radius: 25rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FC1C1C;
		line-height: 50rpx;
		text-align: center;
	}

	.get_now {
		width: 135rpx;
		height: 50rpx;
		background: #FF3D3D;
		border-radius: 25rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		border: none;
	}

	.have_finished {
		width: 135rpx;
		height: 50rpx;
		background: #cbcbcb;
		border-radius: 25rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		border: none;
	}

	/* 评论 展示 */

	.comment-item {
		/* margin: 0 0 13.8rpx; */
	}

	.comment-item .item-user {
		height: 69rpx;
		line-height: 69rpx;
		display: flex;
		align-items: center;
	}

	/* .comment-item .item-user div {
		display: inline-block;
	} */

	.comment-item .item-user .user-avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100%;
		overflow: hidden;
		float: left;
		background-color: #efecdd;
	}

	.comment-item .item-user .user-avatar image {
		width: 100%;
		height: 100%;
	}

	.comment-item .item-user .user-name {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
		float: left;
		margin: 0 13.8rpx;
		color: #1b1b1b;
	}

	.comment-item .item-user .user-level {
		line-height: 46rpx;
		width: 46rpx;
		height: 46rpx;
		margin-top: 10rpx;
	}

	.comment-item .item-user .user-level image {
		width: 100%;
		height: 100%;
	}

	.comment-item .item-user .user-comment-star {
		margin: 0;
		position: relative;
		top: -2rpx;
	}

	.comment-item .item-user .user-comment-star .star-item {
		width: 24rpx;
		height: 24rpx;
		display: inline-block;
		float: left;
		overflow: hidden;
		margin: 0 0 0 13.8rpx;
	}

	.comment-item .item-user .user-comment-star .star-item image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.comment-item .item-spec {
		font-size: 26.22rpx;
		font-weight: 300;
		color: #747474;
	}

	.comment-item .item-spec .comment-item-time {
		display: inline-block;
	}

	.comment-item .item-spec .spec-vals {
		display: inline-block;
	}

	.comment-item .item-spec .spec-vals .spec-item {
		display: inline-block;
		margin: 0 0 0 9.2rpx;
	}

	.comment-item .item-content {
		padding: 12rpx 0 19rpx 0;
		border-bottom: 1rpx solid #FCFCFC;
	}

	.comment-item .item-content .item-text {
		font-size: 26rpx;
		line-height: 36rpx;
		color: #141414;
		-webkit-line-clamp: 2;
		height: 72rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		text-overflow: ellipsis;
		word-break: break-all;
		overflow: hidden;
	}

	.comment-item .item-content .item-imgs {
		margin: 18.4rpx 0 0 0;
	}

	.comment-item .item-content .item-imgs a {
		display: inline-block;
		width: auto;
	}

	.comment-item .item-content .item-imgs a .item-img {
		display: table-cell;
		width: 119.6rpx;
		height: 119.6rpx;
		text-align: center;
		border: solid 2.3rpx #eee;
		vertical-align: middle;
		font-size: 0;
		line-height: 0;
	}

	.comment-item .item-content .item-imgs a image {
		max-width: 119.6rpx;
		max-height: 119.6rpx;
	}

	.comment-item .item-reply {}

	.comment-item .item-reply .item-reply-content {
		font-size: 24rpx;
		font-weight: 300;
		line-height: 32.2rpx;
		padding: 13.8rpx;
		background-color: rgb(246, 246, 246);
	}

	.comment-item .item-reply .item-reply-content .item-reply-title {
		font-weight: 400;
	}

	.comment-item .item-reply .item-reply-content .item-reply-main {
		color: #7e7e7e;
	}

	/*团队列表 商品详情页*/

	.goods-detail-team {
		background: #fff;
		margin-top: 17.94rpx;
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
	}

	.goods-detail-team>.teams_h4 {
		font-size: 27.6rpx;
		color: #333;
	}

	.goods-detail-team .teams_a {
		display: block;
		border: 1px #ee1b21 solid;
		border-radius: 100px;
		height: 49px;
		width: 100%;
		overflow: hidden;
		margin-top: 15px;
	}

	.goods-detail-team b {
		width: 100%;
		display: block;
		width: 100%;
		text-align: center;
		font-size: 25.3rpx;
		color: #888;
		font-weight: normal;
		margin-top: 10px;
	}

	.goods-detail-team .teams_a image {
		float: left;
		width: 45px;
		height: 45px;
		margin: 2px;
		border-radius: 92rpx;
	}

	.goods-detail-team .teams_a .team_item_h2,
	.goods-detail-team .teams_a .team_item_h4 {
		font-size: 27.6rpx;
		line-height: 15px;
		display: block;
	}

	.goods-detail-team .teams_a .team_item_h3,
	.goods-detail-team .teams_a .team_item_h5 {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
	}

	.make_group_end {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
	}

	.make_group_end text {
		color: #999999;
	}

	.goods-detail-team .teams_a .team_item_h3 {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 19px;
	}

	.goods-detail-team .teams_a .fl {
		float: left;
		width: 21%;
		padding: 5px 0 5px 4px;
	}

	.goods-detail-team .teams_a .team_item_h6,
	.goods-detail-team .teams_a .fr {
		float: right;
	}

	.goods-detail-team .teams_a .fr {
		text-align: right;
		padding: 12rpx 10rpx 12rpx 0;
		height: 49px;
		line-height: 49px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.goods-detail-team .teams_a .team_item_h6 {
		line-height: 49px;
		background: #ee1b21;
		color: #fff;
		display: block;
		padding: 0 15px;
		font-size: 32.2rpx;
	}

	.goods-detail-team .teams_a .team_item_h6:before {
		content: '去参团';
		display: inline-block;
	}

	.goods-detail-team .teams_a .team_item_h6:after {
		display: inline-block;
		margin-left: 10px;
		width: 5px;
		content: ' ';
		height: 5px;
		border-left: 1px #fff solid;
		border-top: 1px #fff solid;
		transform: rotate(135deg);
		vertical-align: middle;
	}

	.goods-detail-team .teams_a.on .team_item_h6:before {
		content: '已选择';
	}

	.goods-detail-team .teams_a .team_item_h6.own:before {
		content: '我的团';
	}

	.goods-detail-team .teams_a .team_item_h6.oth:before {
		content: '其他团';
	}

	.goods-detail-team .teams_a .team_item_h4 {
		color: #ee1b21;
	}

	.goods-detail-team .teams_a .team_item_h5 {
		line-height: 12px;
	}

	.member_grade {
		display: block;
	}

	.member_grade .member_grade_title {
		display: inline-block;
		padding: 0 11rpx;
		line-height: 30rpx;
		color: #373737;
		font-size: 20rpx;
		border-radius: 15rpx;
		background: -webkit-gradient(linear, 25% 100%, 75% 100%, from(#e5d3af), to(#d4bd9f));
	}

	.grade_price_list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		color: #333;
		font-size: 30rpx;
	}

	.grade_item {
		display: inline-block;
		margin: 10rpx 50rpx 10rpx 0;
	}

	.tuigoods {
		margin-top: 20rpx;
		background-color: #fff;
	}

	.tuititle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		padding: 30rpx 20rpx 20rpx;
		box-sizing: border-box;
	}

	.tuititle .tui_title_txt {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
	}

	.tui_title_more {
		display: flex;
		align-items: center;
	}

	.tui_title_more text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 40, 31, 1);
		line-height: 45rpx;
	}

	.tui_title_more image {
		width: 12rpx;
		height: 20rpx;
		margin-left: 18rpx;

	}

	.tuigoodslist {
		display: flex;
		background-color: #fff;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
	}

	.tuigoodslist .goods_item {
		/* flex: 1; */
		box-sizing: border-box;
		margin-right: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.tuigoodslist .goods_item:nth-of-type(4),
	.tuigoodslist .goods_item:nth-of-type(5),
	.tuigoodslist .goods_item:nth-of-type(6) {
		margin-bottom: 10rpx;
	}

	.tuigoodslist .goods_item:nth-of-type(3n) {
		margin-right: 0;
	}


	.tuigoodslist .goods_item .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 223rpx;
		height: 223rpx;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
	}

	.tuigoodslist .goods_item .img image {
		height: 100%;
		width: 100%;
		border-radius: 15rpx;
	}

	.tuigoodslist .goods_name {
		display: block;
		width: 220rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(45, 45, 45, 1);
		line-height: 36rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.tuigoodslist .g_price {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 45, 45, 1);
		line-height: 32rpx;
		margin-top: 23rpx;
		font-weight: bold;
	}

	.tuigoodslist .g_price text:nth-child(2) {
		display: inline-block;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 45, 45, 1);
		line-height: 32rpx;
	}

	.tuigoodslist .g_price text:nth-child(1),
	.tuigoodslist .g_price text:nth-last-child(1) {
		display: inline-block;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 45, 45, 1);
		line-height: 32rpx;
	}

	.favorate {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 135rpx;
	}

	.favorate image {
		width: 100%;
		height: 0;
	}

	.presale {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 128rpx;
		background-color: #ff0331;
		padding: 0 20rpx;
		color: #fff;
	}

	.pre_left view:nth-child(1) {
		font-size: 26rpx;
	}

	.pre_left view:nth-child(1) text {
		font-size: 50rpx;
		padding: 0 15rpx;
	}

	.pre_left view:nth-child(2) {
		font-size: 24rpx;
	}

	.pre_left view:nth-child(2) text {
		text-decoration: line-through;
	}

	.pre_right {
		font-size: 28rpx;
	}

	.presale_btn {
		display: flex;
		align-items: center;
		width: 420rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(255, 122, 24, 1) 0%, rgba(254, 161, 14, 1) 100%);
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		justify-content: space-between;
	}

	.deposit_wait {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.pre_price {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 420rpx;
	}

	.despoit_pay_now {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 26rpx;
	}

	.despoit_pay_price {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 26rpx;
	}

	.despoit_pay_price text {
		font-size: 24rpx;
	}

	.ladder {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 140rpx;
		overflow: hidden;
	}

	.ladder .jtt_left {
		position: relative;
		flex: 0 0 501rpx;
		display: flex;
		align-items: center;
		height: 110rpx;
		background-color: #ed6307;
		color: #fff;
		font-size: 22rpx;
	}

	.ladder .jtt_right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 140rpx;
		font-size: 24rpx;
		color: #5f4a08;
	}

	.jtt_right .activity_not_started {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	/* .ladder .p_sj {
    position: absolute;
    top: -1rpx;
    left: 392rpx;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 56rpx;
    border-color: transparent #f3c422 transparent transparent;
    z-index: 1;
} */

	.ladder .jtt_left .dj {
		flex: 0 0 280rpx;
		font-size: 30rpx;
		text-align: center;
	}

	.ladder .jtt_left .dj text {
		font-size: 36rpx;
	}

	.ladder .jtt_price {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 90rpx;
	}

	.ladder .pro_wrap {
		width: 210rpx;
		height: 9rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 5rpx;
		overflow: hidden;
		margin: 11rpx 0 19rpx;
	}

	.ladder .pro_wrap .pro {
		width: 0;
		height: 14rpx;
		background: linear-gradient(-90deg, #FEEAD6 0%, #FFFFFF 100%);
		border-radius: 5rpx;
	}

	.jtt_right .djs {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		display: flex;
	}

	.ladder_text {
		color: #FD8E01 !important;
	}

	.ladder_btn {
		width: 420rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(255, 122, 24, 1) 0%, rgba(254, 161, 14, 1) 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 70rpx;
		text-align: center;
	}

	.no_ladder_btn {
		background: #999999 !important;
		color: #FFF !important;
	}

	.program {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 223rpx;
		padding: 0 10rpx;
		background-color: #fff;
	}

	.program .p_prev,
	.program .p_next {
		margin: 0 15rpx;
		transform: translateY(28rpx);
	}

	.program .p_img {
		width: 19rpx;
		height: 31rpx;
	}

	.program .p_content {
		flex: 1;
		display: block;
		overflow: hidden;
		white-space: nowrap;
	}

	.p_item {
		display: inline-block;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #808080;
	}

	.p_tem_main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.p_item_top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width: 177rpx;
		height: 76rpx;
		margin-bottom: 15rpx;
		border: 3rpx solid transparent;
	}

	.p_item_top .ladder_jt_price1 {
		font-size: 20rpx;
		line-height: 20rpx;
	}

	.ladder_jt_price1 text:nth-of-type(2) {
		font-size: 24rpx;
	}

	.p_item_top .ladder_num1 {
		font-size: 28rpx;
		line-height: 28rpx;
	}

	.p_item_top .on1 {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FB2D2D;
		line-height: 20rpx;
	}

	.p_item_top .on2 {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 28rpx;
	}

	.p_item_bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.p_item_bottom .p_line {
		position: relative;
	}

	.p_item_bottom .p_line text {
		display: block;
		width: 40rpx;
		height: 40rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		overflow: hidden;
		background-color: #d1d1d1;
		color: #fff;
	}

	.p_item_bottom.on .p_line text {
		background-color: #FD8D01;
	}

	.p_item_txt {
		margin-top: 15rpx;
	}

	.p_item_bottom.on .p_item_txt {
		color: #ed6307;
	}

	.p_line_left_wrap,
	.p_line_right_wrap {
		position: absolute;
		top: 50%;
		width: 95rpx;
		height: 2rpx;
		background-color: #d1d1d1;
		transform: translateY(-50%);
	}

	.p_line_left_wrap {
		right: 40rpx;
	}

	.p_line_right_wrap {
		left: 40rpx;
	}

	.p_line_left {
		width: 0;
		height: 2rpx;
		background: linear-gradient(90deg, #FFAA06 0%, #FF5C00 0%, #FF561C 0%, #FF9936 100%);
	}

	.wxParse image {
		display: block;
		margin: 0 auto;
	}

	.goods-err {
		position: fixed;
		bottom: 92rpx;
		left: 0;
		width: 750rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		background-color: #949494;
		z-index: 2;
		right: 0;
		margin: 0 auto;
	}

	.select-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.45);
		z-index: 9999;
		right: 0;
		margin: 0 auto;
	}

	.select-wrap .share-mode {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.select-wrap .share-mode .share-img {
		width: 72%;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.select-wrap .share-mode .share-img image {
		width: 100%;
		height: 0;
		border-radius: 20rpx;
	}

	.select-wrap .share-mode .ul {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-evenly;
	}

	.share-mode .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		cursor: pointer;
		border: none;
		margin: 0;
		padding: 0;
		line-height: 1;
		background-color: transparent;
	}

	.share-mode .item::after {
		border: none;
	}

	.share-mode .item image {
		width: 106rpx;
		height: 0;
	}

	.share-mode .item text {
		color: #fff;
		font-size: 24rpx;
		margin-top: 30rpx;
	}

	.select-wrap .close {
		width: 750rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-wrap .close image {
		width: 30rpx;
		height: 30rpx;
		padding: 30rpx;
	}

	.share-mode .share-img {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.red-show {
		display: flex;
		align-items: center;
		/* width: 80%; */
		margin-left: 15rpx;
	}

	.red-show .red-item {
		position: relative;
		width: 180rpx;
		height: 42rpx;
		text-align: center;
		line-height: 42rpx;
		color: #e1251b;
		font-size: 24rpx;
		margin-right: 20rpx;
	}

	.red-show .red-item:last-child {
		margin-right: 0;
	}

	.red-item image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.activity_con {
		display: flex;
		justify-content: space-between;
		width: 624rpx;
		align-items: center;
	}

	.margin_bottom20 {
		margin-bottom: 28rpx;
	}

	.activity_con .collect_coupons {
		display: flex;
	}

	/* 活动-满减优惠 */
	.full_discount {
		display: flex;
		/* margin-top: 28rpx; */
		/* padding-bottom: 29rpx; */
		box-sizing: border-box;
	}

	.full_discount .full_discount_title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 45, 45, 1);
		line-height: 39rpx;
		flex-shrink: 0;
	}

	.full_discount .full_discount_con {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		margin-left: 19rpx;
		display: flex;
		width: 550rpx;
		justify-content: space-between;
		align-items: center;
	}

	.team-more-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 999;
	}

	.team-more-group {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 50vh;
		background-color: #fff;
	}

	.team-more-group .title {
		text-align: center;
		font-size: 28rpx;
		color: #777;
		line-height: 80rpx;
	}

	.team-more-group scroll-view {
		width: 100%;
		height: calc(50vh - 80rpx);
		box-sizing: border-box;
		margin-top: 0;
	}

	.team-more {
		text-align: center;
		color: #888;
		font-size: 26rpx;
		line-height: 70rpx;
		margin-top: 20rpx;
	}

	.detail_top_radio {
		width: 157rpx;
		height: 64rpx;
		position: absolute;
		bottom: 2.5rem;
		right: 0;
		/* background-image: url("../../static/images/detail_radio.png"); */
		background-repeat: no-repeat;
		background-size: 100%;
		z-index: 5;
		display: flex;
		align-items: center;
	}

	.detail_top_radio_fenge {
		display: flex;
		align-items: flex-end;
		margin-left: 16rpx;
	}

	.detail_top_radio_fenge text {
		width: 3rpx;
		margin-left: 4rpx;
		background-color: #fff;
	}

	.detail_top_radio_fenge text:nth-child(1) {
		height: 15rpx;
	}

	.detail_top_radio_fenge text:nth-child(2) {
		height: 25rpx;
	}

	.detail_top_radio_fenge text:nth-child(3) {
		height: 15rpx;
	}

	.detail_top_radio_fenge text:nth-child(4) {
		height: 10rpx;
	}

	.detail_top_radio_fenge text:nth-child(5) {
		height: 22rpx;
	}

	.detail_top_radio_text {
		margin-left: 6rpx;
		font-size: 22rpx;
		color: #fff;
	}

	.detail_radio_zhibo {
		position: absolute;
		top: 20rpx;
		z-index: 5;
		left: 40rpx;
		height: 47rpx;
		border: 1px solid rgba(255, 0, 0, 0.2);
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		padding-left: 8rpx;
		background-image: linear-gradient(to right, rgba(252, 28, 28, 0), rgba(252, 28, 28, 1), rgba(252, 28, 28, 0));
	}

	.detail_radio_zhibo_musicGig {
		margin-left: 15rpx;
		margin-top: -13rpx;
		width: 34rpx;
		height: 32rpx;
	}

	.detail_radio_zhibo_avator {
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
	}

	.detail_radio_zhibo_text {
		font-size: 22rpx;
		font-weight: 500;
		margin: 0 15rpx;
		color: #fff;
		margin-right: 0;
		max-width: 220rpx;
	}

	.detail_radio_zhibo_jiantou {
		width: 34rpx;
		height: 36rpx;
	}

	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.rate-item {
		flex: 1;
	}


	/* 商品价格 */
	.goods_price_new {
		/* width: 100%; */
		display: flex;
		justify-content: space-between;
		padding: 29rpx 30rpx 0 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.goods_opt {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.goods_opt .collection {
		margin-right: 21rpx;
	}

	.goods_opt .collection,
	.goods_opt .share {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 72rpx;
	}

	.goods_opt .collection image {
		width: 44rpx;
		height: 40rpx;
		margin-bottom: 12rpx;
	}

	.goods_opt .share image {
		width: 38rpx;
		height: 40rpx;
		margin-bottom: 12rpx;
	}

	.goods_opt .collection text,
	.goods_opt .share text {
		width: 72rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-word;
		}

	.new_show_price {
		font-size: 44rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 28, 28, 1);
		line-height: 44rpx;
	}

	.new_show_price text:nth-child(1),
	.new_show_price text:nth-last-child(1) {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.new_goods_marketprice {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(148, 148, 148, 1);
	}

	.new_goods_marketprice text:nth-of-type(2) {
		text-decoration: line-through;
	}

	/* 会员尊享权益 */
	.view_benefits {
		width: 710rpx;
		background: rgba(255, 248, 235, 1);
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 10rpx 10rpx 16rpx;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.view_benefits_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		color: #343434;
		font-weight: 500;
	}

	.view_benefits_title text:nth-of-type(2) {
		color: #FC1C1C;
	}

	.go_look {
		display: flex;
		align-items: center;
	}

	.go_look text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #343434;
	}

	.go_look image {
		width: 12rpx;
		height: 20rpx;
		margin-left: 8rpx;
	}

	/* 遮罩层 */
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100%;
		z-index: 40;
		background: rgba(0, 0, 0, 1);
		opacity: 0.4;
		right: 0;
		margin: 0 auto;
	}

	.loading_mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		/* background:rgba(0,0,0,1); */
		/* opacity:0.4; */
	}

	/* 会员权益弹出框 */
	.benefits_model {
		width: 750rpx;
		height: 640rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 200;
		overflow-y: scroll;
		right: 0;
		margin: 0 auto;
	}

	.benefts_model_top {
		width: 750rpx;
		height: 90rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx 15rpx 0 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f2f2f2;
		position: fixed;
		z-index: 20;
	}

	.benefts_model_top text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}

	.benefts_model_top image {
		width: 28rpx;
		height: 28rpx;
	}

	.grader_list {
		margin-top: 90rpx;
		box-sizing: border-box;
		height: 550rpx;
	}

	.grader_title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
		margin: 24rpx 0 19rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.grader_price_pre {
		width: 712rpx;
		height: 122rpx;
		padding: 0 20rpx;
		position: relative;
		box-sizing: border-box;
		margin-bottom: 19rpx;
	}

	.grader_price_pre image {
		width: 712rpx;
		height: 122rpx;

	}

	.grader_pre_con {
		position: absolute;
		padding: 26rpx 0 27rpx 51rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		z-index: 10;
		left: 0;
		top: 0;
	}

	.grader_img1 {
		position: absolute;
		width: 90rpx !important;
		height: 90rpx !important;
		z-index: 10;
		right: 20rpx;
		bottom: 15rpx;
	}

	.grader_pre_top {
		display: flex;
	}

	.grader_pre_top .grade_name {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333;
		line-height: 32rpx;
		margin-right: 40rpx;
		margin-bottom: 20rpx;
	}

	.grader_pre_top .goods_price {
		font-size: 32rpx;
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: rgba(253, 19, 19, 1);
		line-height: 32rpx;
	}

	.grader_pre_top .goods_price text:nth-child(1),
	.grader_pre_top .goods_price text:nth-last-child(1) {
		font-size: 24rpx;
	}

	.grader_pre_bottom {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
		opacity: 0.6;
	}

	.grader_tips {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10rpx 0 31rpx;
	}

	.grader_tips image {
		width: 23rpx;
		height: 23rpx;
	}

	.grader_tips text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 32rpx;
		margin-left: 8rpx;
	}

	/* 发货及门店自提 */
	.deliver_goods {
		margin-top: 20rpx;
		background: #FFFFFF;
	}

	/* 发货 */
	.deliver_good {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.deliver_goods_left {
		display: flex;
		align-items: center;
	}

	.deliver_goods_left text:nth-of-type(1) {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		line-height: 45rpx;
	}

	.deliver_goods_left image {
		width: 23rpx;
		height: 29rpx;
		margin: 0 19rpx 0 40rpx;
	}

	.deliver_goods_left text:nth-of-type(2) {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 45rpx;
	}

	.express_fee {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #2D2D2D;
		line-height: 45rpx;
	}

	.deliver_goods_sold {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #777777;
		line-height: 45rpx;
	}

	/* 门店自提 */
	.store_pick_up {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 90rpx;
		width: 100%;
		border-top: 1rpx solid #F4F4F4;
	}

	.store_pick_left {
		display: flex;
		align-items: center;
	}

	.store_pick_left text:nth-child(1) {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 45rpx;
	}

	.store_pick_left text:nth-child(2) {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
		margin-left: 27rpx;
	}

	.store_pick_up image {
		width: 12rpx;
		height: 20rpx;
	}

	.detail_nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		height: 87rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		opacity: 0.9;
		position: fixed;
		top: 0;
		z-index: 99;
		padding: 0 50rpx 0 20rpx;
		/* #ifdef APP-PLUS */
		margin-top:var(--status-bar-height);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-left: 50rpx;
		/* #endif */
		align-items: center;
	}
	.go_back_nav{
		width: 50rpx;
		height: 87rpx;
		
	}
	.go_back_nav image{
		width: 20rpx;
		height: 32rpx;
	}

	.detail_nav .nav_pre,
	.detail_nav .active {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 87rpx;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 87rpx;
	}

	.detail_nav .active::before {
		content: "";
		width: 65rpx;
		height: 5rpx;
		background: #FC1919;
		position: absolute;
		bottom: 2rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.footer_btn {
		display: flex;
		align-items: center;
		width: 310rpx;
		height: 98rpx;
		padding: 0 33rpx 0 24rpx;
		box-sizing: border-box;
		justify-content: space-around;
	}

	.footer_btn_pre {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.footer_btn_pre image {
		width: 50rpx;
		height: 50rpx;
	}

	.footer_btn_pre text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		overflow: hidden;
		white-space: nowrap;
		width: 70rpx;
		text-overflow: ellipsis;
	}

	.goods_cart_btn {
		position: relative;
	}

	.goods_cart_num {
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		text-align: center;
		background: rgba(252, 45, 45, 1);
		border-radius: 50%;
		font-size: 18rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
		right: 10rpx;
		top: -8rpx;
		z-index: 5;
	}

	.add_cart {
		width: 220rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(255, 122, 24, 1) 0%, rgba(254, 161, 14, 1) 100%);
		border-radius: 35rpx 0 0 35rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 70rpx;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		padding: 0 10rpx;
		text-overflow: ellipsis;
	}

	.buy_now {
		width: 220rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(252, 45, 45, 1) 0%, rgba(253, 87, 43, 1) 100%);
		border-radius: 0 35rpx 35rpx 0;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.exclusive_mobile_phone {
		width: 120rpx;
		height: 36rpx;
		margin-right: 20rpx;
	}

	/* 活动-- 手机专享 */
	.mobile_buy_now {
		width: 420rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(252, 45, 45, 1) 0%, rgba(253, 87, 43, 1) 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.seckill_finished{
		width: 420rpx;
		height: 70rpx;
		background: #999999;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
	}

	/* 活动不显示价格时 */
	.goods_name_new {
		width: 533rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 48rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		padding-top: 17rpx;
		box-sizing: border-box;
		height: 115rpx;
	}

	.goods_price_new1 {
		padding-right: 0;
	}

	/* 阶梯团 */
	.ladder_bg {
		width: 750rpx;
		height: 140rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 0 23rpx;
		box-sizing: border-box;
	}

	.ladder_left {
		height: 140rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.ladder_left .ladder_deposit {
		display: flex;
		align-items: flex-end;
		margin-bottom: 18rpx;
	}

	.ladder_deposit .deposit_text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.ladder_deposit .deposit {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.ladder_deposit .deposit text:nth-child(2) {
		font-size: 50rpx;
		font-weight: bold;
	}

	.deposit_price {
		display: flex;
		align-items: center;
	}

	.deposit_price text:nth-child(1) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.deposit_price text:nth-child(2) {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 400;
		text-decoration: line-through;
		color: rgba(254, 254, 254, 1);
		opacity: 0.7;
		margin-left: 19rpx;
		text-decoration: line-through;
	}

	.manjian_des_con {
		width: 458rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	/* 满赠弹框 */
	.full_gift_box {
		position: fixed;
		bottom: 0;
		z-index: 200;
		width: 750rpx;
		height: 640rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
	}

	.full_gift_title {
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.full_gift_title text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
	}

	.full_gift_title image {
		width: 22rpx;
		height: 22rpx;
	}

	.full_gift_con {
		overflow-y: scroll;
		height: 540rpx;
	}

	.full_gift_tips {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-bottom: 62rpx;
	}

	.full_gift_tips text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 38rpx;
	}

	.full_gift_list {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx 0 44rpx;
		box-sizing: border-box;
	}

	.full_gift_pre {
		display: flex;
	}

	.gift_tips {
		width: 10rpx;
		height: 10rpx;
		background: rgba(255, 54, 54, 1);
		border-radius: 50%;
		margin-top: 19rpx;
	}

	.gift_goods_name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		width: 528rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin: 0 31rpx 49rpx 19rpx;
	}

	.gift_goods_name text:nth-child(1) {
		font-size: 28rpx;
		color: #FF3636;
	}

	.gift_goods_name text:nth-of-type(2) {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: normal;
		color: #333;
		line-height: 39rpx;
	}

	.line1 {
		width: 1rpx;
		height: 60rpx;
		background: #000000;
		opacity: 0.05;
		margin-right: 30rpx;
	}

	.gify_goods_image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 5rpx;
	}

	.full_tips_bottom {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 38rpx;
		text-align: center;
		padding: 0 69rpx 60rpx 66rpx;
		box-sizing: border-box;
	}

	.full_tips_bottom1 {
		margin: 0 auto;
		width: 615rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 38rpx;
		text-align: center;
		padding: 0 69rpx 60rpx 66rpx;
		box-sizing: border-box;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.pintuan_left {
		display: flex;
		flex-direction: column;
	}

	.pintuan_left_price {
		font-size: 44rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 44rpx;
	}

	.pintuan_left_group {
		display: flex;
		align-items: center;
		margin-top: 21rpx;
		min-width: 249rpx;
		height: 30rpx;
		border-radius: 15rpx 15rpx 0 15rpx;
	}

	.pintuan_left_num {
		min-width: 135rpx;
		height: 30rpx;
		background: #EF1720;
		border-radius: 15rpx 0 0 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #FFFFFF;
		box-sizing: border-box;
	}

	.pintuan_left_num image {
		width: 25rpx;
		height: 21rpx;
		margin-right: 9rpx;
	}

	.pintuan_left_num text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.group_return_regiment {
		/* width:135rpx; */
		padding: 0 12rpx;
		box-sizing: border-box;
		height: 30rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 0 15rpx 0 15rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(233, 17, 30, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: -10rpx;
	}

	.pintuan_right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pintuan_right_num {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.pingtuan1 {
		width: 100%;
		height: 140rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx 0 33rpx;
		box-sizing: border-box;
	}

	.tuangou_left {
		display: flex;
		flex-direction: column;
	}

	.establish_province {
		min-width: 243rpx;
		height: 46rpx;
		background: #DB012F;
		border-radius: 0 0 15rpx 15rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 团购 */
	.tuangou_price {
		display: flex;
		align-items: baseline;
		margin-top: 5rpx;
	}

	.tuangou_discount_price {
		font-size: 44rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.tuangou_discount_price text:nth-of-type(2) {
		font-size: 60rpx;
	}

	.tuangou_original_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		text-decoration: line-through;
		color: rgba(254, 254, 254, 1);
		opacity: 0.7;
		margin-left: 30rpx;
	}

	.tuangou_right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.rganized_units_num {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin-bottom: 17rpx;
	}

	.tuangou_time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	/* 预售 */
	.presale1 {
		width: 100%;
		height: 163rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 0 53rpx;
		box-sizing: border-box;
	}

	.presale1_left {
		display: flex;
		flex-direction: column;
		padding-top: 15rpx;
	}

	.presale1_price {
		display: flex;
		flex-direction: column;
	}

	.presale1_title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(254, 254, 254, 1);
	}

	.presale1_price1 {
		display: flex;
		align-items: center;
	}

	.presale1_price2 {
		display: flex;
		align-items: flex-start;
		margin-top: 10rpx;
	}

	.presale1_price1 image {
		width: 24rpx;
		height: 28rpx;
	}

	.presale1_prices {
		display: flex;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.presale_oragin_price {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		text-decoration: line-through;
		color: rgba(254, 254, 254, 1);
		opacity: 0.7;
	}

	.presale1_right {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.presale2 {
		width: 100%;
		height: 163rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx 0 39rpx;
		box-sizing: border-box;
	}

	.collect_deposit {
		display: flex;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		align-items: center;
	}

	.collect_deposit text:nth-child(2) {
		font-size: 40rpx;
		font-style: italic;
		margin-right: 10rpx;
	}

	.presale1_start_time {
		width: 350rpx;
		height: 30rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(191, 0, 254, 1);
		text-align: center;
		line-height: 30rpx;
		margin-top: 10rpx;
	}

	.presale1_start_time1 {
		width: 350rpx;
		height: 30rpx;
		background: #C300FF;
		border-radius: 15rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		line-height: 30rpx;
		margin-top: 10rpx;
	}


	/* 倒计时样式 */
	/* 团购 */
	.count_down1 {
		display: flex;
		align-items: center;
	}

	.count_down_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		flex-shrink: 0;
	}

	.countdown {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.count_down_day {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin: 0 9rpx;
		flex-shrink: 0;
	}

	.count_down_hours,
	.count_down_minutes,
	.count_down_seconds {
		width: 34rpx;
		height: 34rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		text-align: center;
		color: #FF284D;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 34rpx;
	}

	.count_down_flag {
		font-size: 20rpx;
		color: #fff;
		margin: 0 9rpx;
	}

	.limited_discount_hours,
	.limited_discount_minutes,
	.limited_discount_seconds {
		color: #B329FA;
	}

	/* 拼团 */
	.group_shopping {
		display: flex;
		align-items: center;
	}

	.group_shopping_alone {
		width: 223rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(255, 121, 24, 1) 0%, rgba(254, 160, 13, 1) 100%);
		border-radius: 34rpx 0 0 34rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.group_alone_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.group_alone_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.go_group {
		width: 197rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(251, 45, 45, 1) 0%, rgba(252, 87, 42, 1) 100%);
		border-radius: 0 34rpx 34rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.go_group_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.go_group_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
	}

	.make_group {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	.make_group_num {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.make_groip_more {
		display: flex;
		align-items: center;
	}

	.make_groip_more text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(251, 27, 27, 1);
	}

	.make_groip_more image {
		width: 12rpx;
		height: 20rpx;
	}


	/* 拼团 查看更多 */
	.make_group_content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 125rpx;
		border-bottom: 1rpx solid #E5E5E5;
	}

	.make_group_content:nth-last-of-type(1) {
		border-bottom: 0;
	}

	.make_group_content_left {
		display: flex;
		align-items: center;
	}

	.make_group_avator {
		width: 64rpx;
		height: 64rpx;
		background: rgba(208, 208, 208, 1);
		border-radius: 50%;
	}

	.make_group_name {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
		margin-left: 20rpx;
	}

	.make_group_missing {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 36rpx;
	}

	.make_group_missing text {
		color: #FC1C1C;
	}

	.make_group_right {
		display: flex;
		align-items: center;
	}

	.make_group_right1 {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-right: 20rpx;
	}

	.make_group_right2 {
		width: 120rpx;
		height: 50rpx;
		background: rgba(252, 28, 28, 1);
		border-radius: 25rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 50rpx;
		text-align: center;
	}

	.make_rroup_time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 36rpx;
	}

	.make_rroup_time text {
		color: #999999;
	}

	/* 参与拼单 */
	.join_group {
		width: 580rpx;
		height: 415rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		position: fixed;
		z-index: 100;
		left: 50%;
		top: 50%;
		margin-left: -290rpx;
		margin-top: -207rpx;
	}

	.join_group_title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 80rpx;
		border-bottom: 1rpx solid #F7F7F7;
	}

	.join_group_title text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.join_group_title image {
		width: 22rpx;
		height: 22rpx;
	}

	.join_group_content {
		padding-top: 38rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.join_group_des {
		display: flex;
		align-items: center;
	}

	.group_des_title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
		margin-right: 30rpx;
	}

	.group_des_miss {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999;
		line-height: 45rpx;
	}

	.group_des_miss text {
		color: #FC1D1B;
	}

	.join_group_time {
		display: flex;
		align-items: center;
		margin-top: 19rpx;
	}

	.join_group_time text:nth-child(1) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(148, 148, 148, 1);
		line-height: 45rpx;
	}

	.join_group_time text:nth-child(2) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FF0000;
		line-height: 45rpx;
		margin-left: 20rpx;
	}

	.join_group_pro {
		display: flex;
		align-items: center;
		margin: 25rpx 0 20rpx;
	}

	.join_group_pre {
		position: relative;
	}

	.join_group_pre image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.join_group_pre text {
		position: absolute;
		bottom: 13rpx;
		left: 10rpx;
		width: 54rpx;
		height: 26rpx;
		background: rgba(255, 0, 0, 1);
		border-radius: 13rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add_group,
	.add_group image {
		width: 80rpx;
		height: 80rpx;
	}

	.handleAddGroup {
		width: 240rpx;
		height: 50rpx;
	}

	/* 正在拼单查看更多 */
	.make_order_more {
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

	.make_order_title {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #F7F7F7;
	}

	.make_order_title text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.make_order_title image {
		width: 22rpx;
		height: 22rpx;
	}

	.make_order_content {
		width: 100%;
		height: 630rpx;
	}

	.make_order_pre {
		width: 100%;
		height: 95rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #F5F5F5;
	}

	.make_order_image {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		margin-right: 19rpx;
	}

	.make_order_des {
		display: flex;
		flex-direction: column;
	}

	.make_order_des_top {
		display: flex;
	}

	.make_order_des_top text:nth-child(1) {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.make_order_des_top text:nth-child(2) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
		line-height: 45rpx;
		margin-left: 10rpx;
	}

	.make_order_des_bot {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 45rpx;
	}

	.my_group {
		width: 120rpx;
		height: 50rpx;
		background: rgba(255, 0, 0, 1);
		border-radius: 25rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(248, 248, 248, 1);
		line-height: 50rpx;
		text-align: center;
	}

	.group_pre_num {
		display: fixed;
		bottom: 0;
		z-index: 250;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 45rpx;
		text-align: center;
	}

	.make_order_pre_left {
		display: flex;
		align-items: center;
	}

	/* 选择规格弹框 */
	.specifications {
		width: 750rpx;
		height: 900rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		position: fixed;
		bottom: 0;
		z-index: 200;
	}

	.specifications_con {
		padding-bottom: 99rpx;
		box-sizing: border-box;
	}

	.spec_content {
		height: 590rpx;
		overflow-y: scroll;
	}

	.specifications_des {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1rpx solid #F4F4F4;
		box-sizing: border-box;
	}

	.specifications_des_left {
		display: flex;
		align-items: center;
	}

	.specification_des_image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		margin-right: 21rpx;
	}

	.specifications_des_pre {
		display: flex;
		flex-direction: column;
		width: 490rpx;
	}

	.specifications_des_price {
		display: flex;
		align-items: center;
	}

	.specifications_des_price .des_spec_price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 28, 28, 1);
		margin-right: 20rpx;
	}

	.des_spec_price text:nth-of-type(2) {
		font-size: 50rpx;
	}

	.specifications_des_price .mobile_phone_tips {
		width: 130rpx;
		height: 40rpx;
		background: #FF2222;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pre_sale_tips {
		width: 80rpx;
		height: 40rpx;
		background: linear-gradient(90deg, #891FF7 0%, #DA01E8 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.limited_activities_tips {
		width: 130rpx;
		height: 40rpx;
		background: linear-gradient(90deg, #B029FB 0%, #CD30FD 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 40rpx;
	}

	.make_group_tips {
		width: 80rpx;
		height: 40rpx;
		background: linear-gradient(90deg, #FC1C1C 0%, #FF6C00 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.group_buying_tips {
		width: 80rpx;
		height: 40rpx;
		background: linear-gradient(90deg, #F51A3E 0%, #FF4444 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ladder_regiment_tips {
		min-width: 100rpx;
		height: 40rpx;
		padding: 0 10rpx;
		background: linear-gradient(90deg, #FF7A18 0%, #FEA10E 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sec_kill_tips{
		width: 130rpx;
		height: 40rpx;
		background: linear-gradient(90deg, #FFAA06 0%, #FF8323 0%, #FC5300 0%, #FF1353 100%);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		line-height: 40rpx;
	}

	.specifications_des_store {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		margin: 17rpx 0;
	}

	.specifications_des_txt {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 26rpx;
	}

	.specifications_des_view {
		font-size: 26rpx;
		line-height: 32rpx;
		width: 500rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.specifications_des_view text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-right: 10rpx;
		line-height: 26rpx;
	}

	.specifications_des_txt1 {
		margin-right: 10rpx;
	}

	.specifications_color {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.speci_color_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}

	.sepc_con_pre {
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.color_list {
		display: flex;
		flex-wrap: wrap;
	}

	.color_list_pre {
		width: 330rpx;
		height: 50rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 25rpx;
		margin: 0 20rpx 20rpx 0;
	}

	.color_list_pre image {
		width: 36rpx;
		height: 36rpx;
		border-radius: 2rpx;
	}

	.color_list_pre text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}

	.color_list_pre:nth-of-type(2n) {
		margin-right: 0;
	}

	.specifications_size {
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.spec_size_title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		margin-bottom: 20rpx;
	}

	.size_list {
		display: flex;
		flex-wrap: wrap;
	}

	.size_list_pre {
		min-width: 120rpx;
		height: 50rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		margin-right: 20rpx;
		padding: 0 50rpx;
		box-sizing: border-box;
	}

	.specifications_buynum {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 90rpx;
	}

	.specifications_buynum_left {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}

	.specifications_buynum_left text:nth-child(2) {
		color: #949494;
	}

	.specifications_buynumber {
		display: flex;
		align-items: center;
		width: 182rpx;
		height: 50rpx;
		border-radius: 6rpx;
		border: 1rpx solid #F5F5F5;
		color: #333333;
	}

	.specifications_buynumber text:nth-child(1) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30rpx;
		width: 51rpx;
		height: 50rpx;
		border-right: 1rpx solid #F5F5F5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.specifications_buynumber text:nth-child(3) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30px;
		width: 51rpx;
		height: 50rpx;
		border-left: 1rpx solid #F5F5F5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.specifications_buynumber input {
		width: 78rpx;
		height: 50rpx;
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
	}

	.size_pre_active {
		border: 1rpx solid rgba(255, 0, 0, 1);
		color: #FC1C1C;
		background: #FFF3F3;
	}

	/* 三点更多分享 */
	.more_tips {
		position: relative;
		display: flex;
		align-items: center;
	}

	.more_tips .more {
		width: 44rpx;
		height: 8rpx;
	}

	.triangle-up {
		position: absolute;
		right: 15rpx;
		top: 11rpx;
		width: 0;
		height: 0;
		border-left: 15rpx solid transparent;
		border-right: 15rpx solid transparent;
		border-bottom: 20rpx solid #FFFFFE;
		/* transform: rotate(120deg); */
		transform: rotate(0deg);
		box-shadow: -2rpx 2rpx -1rpx 0rpx rgba(102, 102, 102, 0.1);
		z-index: 21;
	}

	.tips {
		position: absolute;
		z-index: 20;
		top: 30rpx;
		right: -30rpx;
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

	button::after {
		border: none;
	}

	button[plain] {
		border: none;
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

	/* 透明遮罩层 */
	.transparent_mask {
		width: 100%;
		height: 100%;
		position: fixed;
		background-color: #FFFFFF;
		top: 0;
		left: 0;
		opacity: 0;
		z-index: 10;
	}

	/* 拼团倒计时 */
	.countdown_group {
		display: flex;
		/* align-items: center; */
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}

	.countdown1 {
		width: 34rpx;
		height: 34rpx;
		background: #FFFFFF;
		border-radius: 50%;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #F12826;
		text-align: center;
		line-height: 34rpx;
		margin-left: 10rpx;
	}

	.countdown_group text:nth-of-type(1) {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}

	.countdown2 {
		margin-left: 10rpx;
	}

	.loading_image {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -25rpx;
		margin-left: -25rpx;
	}

	/* 所有规格弹框的底部按钮 */
	.specification_bottom_btn {
		width: 750rpx;
		height: 98rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(85, 85, 85, 0.08);
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
	}

	.specification_btn1 {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
	}

	.specification_add {
		width: 347rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FF7918 0%, #FEA00D 100%);
		border-radius: 34rpx 0 0 34rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specification_add text:nth-of-type(1),
	.specification_buy text:nth-of-type(1) {
		margin-right: 20rpx;
	}

	.specification_buy {
		width: 343rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
		border-radius: 0 34rpx 34rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specifications_btn2 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FF5C00 0%, #FCE000 0%, #FE8300 0%, #FB9721 100%);
		border-radius: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
	}

	.specifications_btn3 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FF5C00 0%, #FCE000 0%, #FE8300 0%, #FB9721 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specifications_btn4 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.specifications_bottom_btn {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FF5C00 0%, #FCE000 0%, #FE8300 0%, #FB9721 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specifications_bottom_btn1 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.spec_bot_sekill_finshed{
		width: 690rpx;
		height: 70rpx;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #999999;
	}

	.specifications_bottom_btn3 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FF5D00 0%, #FCE000 0%, #FE8400 0%, #FB9721 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specifications_bottom_btn4 {
		width: 690rpx;
		height: 70rpx;
		background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.specifications_bottom_btn3 text:nth-of-type(1),
	.specifications_bottom_btn4 text:nth-of-type(1) {
		margin-right: 20rpx;
	}

	.specifications_btn {
		width: 580rpx;
		height: 70rpx;
		background: linear-gradient(45deg, rgba(252, 45, 45, 1) 0%, rgba(253, 87, 43, 1) 100%);
		border-radius: 35rpx;
		margin: 14rpx auto;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.reditem_str {
		width: 584rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 45rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.reditem_str1 {
		width: 583rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 45rpx;
		white-space: pre-wrap;
	}

	.reditem_img {
		width: 28rpx;
		height: 28rpx;
	}

	.detail_title {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
		justify-content: center;
	}

	.detail_title image {
		width: 171rpx;
		height: 18rpx;
		margin: 0;
	}

	.detail_title text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #2D2D2D;
		line-height: 30px;
		margin: 0 22rpx 0 19rpx;
	}

	.Payment_Delivery {
		height: 100rpx;
		padding: 20rpx 0 0 20rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.Payment_time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
	}

	.Delivery_time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
		margin-top: 16rpx;
	}

	.padding_bottom20 {
		margin-bottom: 20rpx;
		box-sizing: border-box;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.limit_line2{
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	a{
		text-decoration: none;
	}
	em{
		font-style: normal;
	}
	/* #ifdef H5 */
	.share-mode{
		padding-top:20rpx;
		padding-bottom:50rpx
	}
	.is_h5_public_share{
		margin-top: 100rpx;
	}
	/* #endif */
	.iphone_view{
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
	}
	.play_btn{
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		left: 50%;    //起始是在body中，横向距左50%的位置
		top:50%;      //起始是在body中，纵向距上50%的位置，这个点相当于body的中心点，div的左上角的定位
		transform:translate(-50%,-50%);//水平、垂直都居中,也可以写成下面的方式
	}
	.goods_detail_des{
		padding-bottom: 20rpx;
	}
	/* 秒杀活动 start */
	.second_kill{
		width: 750rpx;
	}
	.second_kill_con{
		width: 750rpx;
		height: 126rpx;
		padding-left: 114rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.second_kill_left{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.second_kill_goods_price{
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		margin-bottom: 8rpx;
	}
	.second_kill_goods_price text:nth-child(2){
		font-size: 40rpx;
	}
	.second_kill_price{
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		opacity: 0.8;
	}
	.second_kill_right{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.second_kill_text{
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: #FF2930;
		margin-bottom: 20rpx;
	}
	.sec_kill_countdown{
		display: flex;
		align-items: center;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FF333A;
		line-height: 34rpx;
	}
	.sec_kill_countdown .day{
		margin-right: 10rpx;
	}
	.sec_kill_countdown .time{
		background: #FF1F26;
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
		line-height: 34rpx;
		text-align: center;
		color: #FFFFFF;
	}
	.sec_kill_countdown .time_tips{
		color: #FF3C42;
		margin: 0 5rpx;
	}
	.sec_kill_preview{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		width: 750rpx;
		height: 50rpx;
	}
	.sec_kill_preview_left{
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
	}
	.sec_kill_preview_right{
		display: flex;
		align-items: center;
		width: 136rpx;
		height: 34rpx;
		background: #FF2B32;
		border-radius: 17rpx;
		display: flex;
		align-items: center;
		/* justify-content: center; */
	}
	.sec_kill_preview_right image{
		width: 23rpx;
		height: 24rpx;
		margin: 0 10rpx 0 15rpx;
	}
	.sec_kill_preview_right text{
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 34rpx;
		letter-spacing:2rpx;
	}
	.cancel_preview{
		width: 136rpx;
		height: 34rpx;
		background: #999999;
		border-radius: 17rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		line-height: 34rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* 秒杀活动 end */
</style>
