<template>
	<view class="shop_homepage">

		<!-- 透明遮罩层 -->
		<view class="transparent_mask" v-if="transparent_mask" @tap="hideMask"></view>
		<view class="content">
			<!-- 搜索 -->
			<view class="fixed_top_status_bar" v-if="!searchShow"></view>
			<view class="search" v-if="!searchShow">
				<!-- #ifdef H5 || APP-PLUS -->
				<image class="top_w_b" @tap="go_back" :src="img_url+'white_arrow_l.png'"></image>
				<!-- #endif -->
				<view class="search_input" @tap="goSearch">
					<image :src="img_url+'shop_list_search.png'"></image>
					<input :placeholder="$L('搜索店铺内商品')" disabled="true"></input>
				</view>
				<view class="more_tips">
					<image class="more" :src="img_url+'more1.png'" @tap="moreTips"></image>
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
			<!-- 搜索 -->

			<view class="fixed_top_status_bar" :style="'opacity:'+scrollTopH/100"></view>
			<view class="search1" v-if="!homePage || searchShow">
				<!-- #ifdef H5 || APP-PLUS -->
				<image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'"></image>
				<!-- #endif -->
				<view class="search_input" @tap="goSearch">
					<image :src="img_url+'shop_list_search.png'"></image>
					<input :placeholder="$L('搜索店铺内商品')" disabled="true"></input>
				</view>
				<view class="more_tips">
					<image class="more" :src="img_url+'more_black.png'" @tap="moreTips"></image>
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
			<!-- 店铺信息-->
			<view class="shop_des" :style="'background-image:url(' + ((homePage || !searchShow) ? store_banner : '') + ');background-size:100% 100%;background-repeat:no-repeat;'">
				<view class="des_top" v-if="homePage">
					<view class="shop_info">
						<view class="info_left" @tap="handleStoreIntroduction" :data-vid="vender_detail.vid">
							<image class="avat" :src="vender_detail.store_label" mode="aspectFill"></image>
							<view class="info_des">
								<view class="info_top">
									<text>{{vender_detail.store_name}}</text>
									<image src="/static/images/rightdown.png"></image>
									<text v-if="vender_detail.is_own_shop == 1">{{$L('自营')}}</text>
								</view>
								<view class="info_bot">
									<image :src="img_url+'renqizhi.png'"></image>
									<text>{{$L('人气：')}}{{vender_detail.store_collect}}</text>
								</view>
							</view>
						</view>
						<view :class="is_favorites == 0 ? 'info_right' : 'info_right1'" @tap="collect">{{is_favorites == 0 ? $L('收藏') : $L('已收藏')}}</view>
					</view>
					<!-- 店铺首页，全部分类，商品上新，优惠券 -->
					<view class="select_nav" v-if="!fenlei && !no_content_decor">
						<view v-for="(item, idx) in navList" :key="idx" class="nav_item" @tap="tabItemTap" :data-idx="idx">
							<image :src="idx == currentTabIndex || (currentTabIndex == 0 && index == 0) && isSelect ? item.selImgUrl : item.imgUrl"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
					<!-- 店铺未装修不显示店铺首页 -->
					<view class="select_nav" v-if="!fenlei && no_content_decor">
						<view v-for="(item, idx) in navList1" :key="idx" class="nav_item" @tap="tabItemTap" :data-idx="idx">
							<image :src="idx == currentTabIndex || (currentTabIndex == 0 && index == 0) && isSelect ? item.selImgUrl : item.imgUrl"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
				<view :class="homePage ? 'des_con' : 'des_con1'" v-if="!fenlei" :style="'overflow:' + ((no_content_decor || no_content_productList || no_content_newProductList || no_content_coupon) ? 'hidden' : 'auto')">
					<!-- 店铺首页 -->
					<view class="home_decoration" v-if="home_decoration && !no_content_decor">
						<DiyPage :sourceData="decorationData" v-if="decorationData && decorationData.length" style="padding-bottom:100rpx;"
						 :vid="vid"></DiyPage>
						<!-- <view class="no_content" wx:if="{{no_content_decor}}">
						<image src="{{img_url + 'site/no_content.png'}}"></image>
						<text>店铺暂未装修~</text>
					</view> -->
					</view>
					<!-- 全部商品 -->
					<view class="all_commodities" v-if="all_commodities">
						<view :class="'all_commodities_nav ' + (searchShow ? 'nav1' : '')" v-if="all_commodities">
							<view class="comprehensive" @tap="commoditiesNav" data-index="0">
								<text :class="'pre_title ' + (commodNavIdx == 0 ? 'active' : '')">{{$L('综合')}}</text>
							</view>
							<view :class="'sales_volume ' + (commodNavIdx == 1 ? 'active' : '')" @tap="commoditiesNav" data-index="1"
							 data-isAscendingOrder="0">{{$L('销量')}}</view>
							<view class="price" @tap="commoditiesNav" data-index="2">
								<text :class="'pre_title ' + (commodNavIdx == 2 ? 'active' : '')">{{$L('价格')}}</text>
								<view class="price_switch">
									<image class="xiala_up" :src="commodNavIdx == 2 && isAscendingOrder == 1 ? img_url+'xiala_up1.png' : img_url+'xiala_up.png'"></image>
									<image class="xiala_down" :src="commodNavIdx != 2 ? img_url+'xiala_down.png' : commodNavIdx == 2 && isAscendingOrder == 1 ? img_url+'xiala_down.png' : img_url+'xiala_down1.png'"></image>
								</view>
							</view>
							<view :class="'sales_volume ' + (commodNavIdx == 3 ? 'active' : '')" @tap="commoditiesNav" data-index="3">{{$L('人气')}}</view>
							<view class="layout" @tap="layoutSwitch">
								<image :src="grid_list ? img_url+'fenlei1.png' : img_url+'fenlei2.png'"></image>
							</view>
						</view>
						<block v-if="productList && productList.length">
							<!-- 商品列表 -->
							<view class>
								<view :class="(grid_list ? 'all_commodities_list' : 'list') + ' ' + (searchShow ? 'product1' : '')">
									<view v-for="(item, index) in productList" :key="index" class="list_pre" :data-gid="item.gid" @tap="goods_detail">
										<view class="pre_img">
											<image :src="item.goods_image_url"></image>
										</view>
										<view class="pre_des">
											<view class="des_name">{{item.goods_name}}</view>
											<view class="des_info">{{item.goods_jingle}}</view>
											<!-- <view class="time_limited_discount">限时折扣</view> -->
											<view v-for="(item1, index2) in item.limited_activities" :key="index2" class="time_limited">
												<view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item1.color[0] + ',' + item1.color[1] + ');'"
												 v-if="item1.name!='' && item1.color && item1.color[0] && item1.color[1]">{{item1.name}}</view>
											</view>
											<view class="des_desc">
												<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(item.goods_price)[0]}}</text>.<text>{{filters.toSplit(item.goods_price)[1]}}</text></view>
												<!-- <text class="salenum" v-if="grid_list && item.goods_price < 999999.99">{{item.goods_salenum}}{{$L('人已付款')}}</text> -->
												<!-- <text class="salenum" v-if="!grid_list">{{item.goods_salenum}}{{$L('人已付款')}}</text> -->
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="is_more">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
						</block>
						<!-- 无商品 -->
						<block v-if="no_content_productList">
							<view class="no_content">
								<image :src="img_url + 'site/no_content.png'"></image>
								<text>{{$L('暂无任何商品~')}}</text>
							</view>
						</block>
					</view>
					<!-- 商品上新 -->
					<view class="new_products" v-if="new_products">
						<block v-if="new_productList && new_productList.length">
							<!-- 商品列表 -->
							<view class>
								<view v-for="(item, index) in new_productList" :key="index" class="new_products_pre">
									<view class="new_products_top">
										<text class="line"></text>
										<view class="new_products_title">
											<image :src="img_url+'shijian_title.png'"></image>
											<text>{{item.time}}{{$L('上新')}}</text>
										</view>
										<text class="line"></text>
									</view>
									<view class="all_commodities_list">
										<view v-for="(item1, index2) in item.list" :key="index2" class="list_pre" :data-gid="item1.gid" @tap="goods_detail">
											<view class="pre_img">
												<image :src="item1.goods_image_url" mode='aspectFit'></image>
											</view>
											<view class="pre_des">
												<view class="des_name">{{item1.goods_name}}</view>
												<view class="des_info">{{item1.goods_jingle}}</view>
												<!-- <view class="time_limited_discount">限时折扣</view> -->
												<view v-for="(item2, index) in item1.limited_activities" :key="index" class="discount">
													<view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item2.color[0] + ',' + item2.color[1] + ');'">{{item2.name}}</view>
												</view>
												<view class="des_desc">
													<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(item1.goods_price)[0]}}</text>.<text>{{filters.toSplit(item1.goods_price)[1]}}</text></view>
													<!-- <text class="salenum" v-if="item1.goods_price < 999999.99">{{item1.goods_salenum}}{{$L('人已付款')}}</text> -->
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="is_more" style="margin:10rpx 0 30rpx;">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
						</block>
						<block v-if="no_content_newProductList">
							<view class="no_content">
								<image :src="img_url + 'site/no_content.png'"></image>
								<text>{{$L('暂无商品上新~')}}</text>
							</view>
						</block>
					</view>
					<!-- 优惠券 -->
					<view class="coupon" v-if="coupon">
						<block v-if="couponList && couponList.length">
							<!-- 优惠券列表 -->
							<view class>
								<view v-for="(item, index) in couponList" class="coupon_pre" :key="item.id">
									<view class="conpon_des" :style="'background-image:url(' + (img_url + 'site/coupon_bg.png') + '); background-size:100%'">
										<view class="conpon_des_top">
											<!-- <view class="{{item.red_hasget == item.red_limit ? 'coupon_des_left1' : item.have == 0 ? 'coupon_des_left' : 'coupon_des_left1'}}">{{item.redinfo_money}}<text class="yuan">元</text></view> -->
											<view v-if="item.red_hasget == item.red_limit" class="coupon_des_left1">{{item.redinfo_money}}<text class="yuan">{{$L('元')}}</text></view>
											<view v-else-if="item.have < item.red_rach_max" class="coupon_des_left">{{item.redinfo_money}}<text class="yuan">{{$L('元')}}</text></view>
											<view v-else class="coupon_des_left1">{{item.redinfo_money}}<text class="yuan">{{$L('元')}}</text></view>
											<view class="coupon_des_con">
												<!-- {{item.red_hasget != item.red_limit && item.have == 0}} -->
												<view class="progress-box" style="display:flex" v-if="item.red_hasget != item.red_limit && item.have < item.red_rach_max">
													<progress :percent="item.per" backgroundColor="#FFFFFF" activeColor="#FF0000" font-size="22rpx"
													 border-radius="5rpx" stroke-width="3" style="width:60%;height: 25%;border: 1rpx solid #FF0000; border-right:2rpx solid #FF0000;border-radius:5rpx"></progress>
													<text class="progress_text">{{$L('已抢')}}{{item.per}}%</text>
												</view>
												<view class="full_reduction">{{$L('满')}}{{item.redinfo_full}}{{$L('减')}}{{item.redinfo_money}}</view>
												<view class="validity">{{$L('有效期：')}}{{item.redinfo_start_text}}-{{item.redinfo_end_text}}</view>
											</view>
											<!-- <view class="coupon_des_right {{item.red_hasget == item.red_limit ? 'coupon_des_right1' : item.have == 0 ? '' : 'coupon_des_right1'}}" bindtap="receive" data-redid="{{item.id}}">
											<text>{{item.red_hasget == item.red_limit ? '已抢完' : item.have < item.red_rach_max ? '立即领取' : '已领取'}}</text>
											<text>{{item.have == 0 && item.red_hasget != item.red_limit ? '已领取' : item.red_hasget == item.red_limit ? '已抢完' : item.have < item.red_rach_max ? '立即领取' : '' }}</text>
										</view> -->
											<view class="coupon_des_right1" @tap="receive" :data-redid="item.id" v-if="item.red_hasget == item.red_limit">
												<text>{{$L('已抢完')}}</text>
											</view>
											<view class="coupon_des_right" @tap="receive" :data-redid="item.id" v-else-if="item.have < item.red_rach_max">
												<text>{{$L('立即领取')}}</text>
											</view>
											<view class="coupon_des_right1" v-else @tap="receive" :data-redid="item.id">
												<text>{{$L('已领取')}}</text>
											</view>
										</view>
										<view class="conpon_des_bot">
											<view class="conpon_show" @tap="handleOpen">
												<view :class="'text ' + (conpon_show ? 'text2' : 'text1')"><text>{{$L('使用规则')}}</text>：{{item.str}}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="is_more" style="margin-top:20rpx;">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
						</block>
						<block v-if="no_content_coupon">
							<view class="no_content">
								<image :src="img_url + 'site/no_coupon.png'"></image>
								<text>{{$L('暂无优惠券~')}}</text>
							</view>
						</block>
					</view>
				</view>
				<!-- 分类 -->
				<view class="fenlei" v-if="fenlei">
					<view>
						<view class="fenlei_lists" v-if="classifyList && classifyList.length > 0">
							<view v-for="(item, index) in classifyList" :key="index" class="fenlei_pre">
								<view class="fenlei_pre_top" :data-stc_id="item.stc_id" :data-stc_name="item.stc_name" @tap="handleProClas">
									<view class="fenlei_pre_title">{{item.stc_name}}</view>
									<image src="/static/images/right_bg.png"></image>
								</view>
								<view class="fenlei_list" v-if="item && item.children && item.children.length > 0">
									<text v-for="(item1, index2) in item.children" :key="index2" :data-stc_id="item1.stc_id" :data-stc_name="item1.stc_name"
									 @tap="handleProClas">{{item1.stc_name}}</text>
								</view>
							</view>
						</view>
						<view class="fenlei_lists" v-if="no_content_fenlei">
							<view class="no_fenlei">
								<image :src="img_url + 'site/no_product.png'"></image>
								<text>{{$L('暂无商品分类')}}</text>
							</view>
						</view>
					</view>
					<!-- 推荐商品 -->
					<view class="all_commodities_list all_commodities_list1" v-if="recommend_productList && recommend_productList.length">
						<view class="commodities_list">
							<view v-for="(item, index) in recommend_productList" :key="index" class="list_pre" :data-gid="item.gid" @tap="goods_detail">
								<view class="pre_img">
									<image :src="item.goods_image_url" mode='aspectFit'></image>
								</view>
								<view class="pre_des">
									<view class="des_name">{{item.goods_name}}</view>
									<view class="des_info">{{item.goods_jingle}}</view>
									<!-- <view class="time_limited_discount">限时折扣</view> -->
									<view v-for="(item1, index2) in item.limited_activities" :key="index2" class="discount">
										<view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item1.color[0] + ',' + item1.color[1] + ');'">{{item1.name}}</view>
									</view>
									<view class="des_desc">
										<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(item.goods_price)[0]}}</text>.<text>{{filters.toSplit(item.goods_price)[1]}}</text></view>
										<!-- <text class="salenum" v-if="item.goods_price < 999999.99">{{item.goods_salenum}}{{$L('人已付款')}}</text> -->
									</view>
								</view>
							</view>
						</view>
						<view class="is_more">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部tab栏 -->
		<view class="tabbar" :style="'bottom:'+bottomSateArea">
			<view v-for="(item, idx) in tabBarList" :key="idx" class="tabbar_pre" @tap="hanbleTab" :data-idx="idx">
				<image :src="idx == tabcurrentTabIndex || index == 0 && tabisSelect ? item.selImgUrl : item.imgUrl"></image>
				<text :class="idx == tabcurrentTabIndex || index == 0 && tabisSelect ? 'pre_sel' : ''">{{item.name}}</text>
			</view>
		</view>

		<!-- 分享 -->
		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2">
			<view class="share-mode">
				<!-- #ifdef  APP-PLUS -->
				<view class="ul">
					<button @tap.stop="sldShare(0,'WXSceneSession')" class="item">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<button @tap.stop="sldShare(0,'WXSenceTimeline')" class="item">
						<image :src="img_url+'pyq_share.png'" mode="widthFix"></image>
						<text>{{$L('微信朋友圈')}}</text>
					</button>
				</view>	
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="is_h5_share" v-if="!iswx">
					<view class="share-img" @tap="prevImg">
						<image :src="share_img_h5" mode="widthFix"></image>
					</view>
					<image :src="img_url + '/fx_share_code.png'" mode="" class="h5_share_tips"></image>
				</view>
				<view class="is_h5_public_share" v-if="iswx" @tap="closeShare">
					<image :src="img_url+'wx_share_tip.png'" mode="widthFix"></image>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="close" @tap="closeShare" v-if="!iswx">
					<image src="../../static/images/share_close2.png"></image>
				</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view class="close" @tap="closeShare">
					<image src="../../static/images/share_close2.png"></image>
				</view>
				<!-- #endif -->
			</view>
		</view>


		<!-- 底部站位栏 -->
		<view class="iphone_view" :style="'height:'+bottomSateArea"></view>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>
	let img_url = getApp().globalData.img_url; //引用全局变量，图片域名
	// 加载js
	//引用全局变量，图片域名
	// 加载js
	import {
		getSceneParam,
		isWeiXinBrower
	} from "../../utils/common";

	export default {
		data() {
			return {
				// index: '',
				bid: '',
				vid: '',
				store_list: [],
				searchVal: '', //搜索框内的值
				searchList: [],
				show: false,
				searchShow: false,
				currentTabIndex: 0, //选项卡，默认综合排序
				isSelect: false,
				navList: [{
					"name": this.$L('店铺首页'),
					"imgUrl": img_url + "qiyeyunicon.png",
					"selImgUrl": img_url + 'site/qiyeyunicon_sel.png'
				}, {
					"name": this.$L('全部商品'),
					"imgUrl": img_url + "shangpin.png",
					"selImgUrl": img_url + 'site/shangpin_sel.png'
				}, {
					"name": this.$L('商品上新'),
					"imgUrl": img_url + "iconfont37newtag.png",
					"selImgUrl": img_url + 'site/shangxin_sel.png'
				}, {
					"name": this.$L('优惠券'),
					"imgUrl": img_url + 'site/youhuiquan1.png',
					"selImgUrl": img_url + 'site/youhuiquan.png'
				}],
				navList1: [{
					"name": this.$L('全部商品'),
					"imgUrl": img_url + "shangpin.png",
					"selImgUrl": img_url + 'site/shangpin_sel.png'
				}, {
					"name": this.$L('商品上新'),
					"imgUrl": img_url + "iconfont37newtag.png",
					"selImgUrl": img_url + 'site/shangxin_sel.png'
				}, {
					"name": this.$L('优惠券'),
					"imgUrl": img_url + 'site/youhuiquan1.png',
					"selImgUrl": img_url + 'site/youhuiquan.png'
				}],
				tabBarList: [{
					"name": this.$L('首页'),
					"imgUrl": img_url + 'bar1.png',
					"selImgUrl": img_url + 'site/bar1_sel.png'
				}, {
					"name": this.$L('商品'),
					"imgUrl": img_url + 'dianpu.png',
					"selImgUrl": img_url + 'site/dianpu_sel.png'
				}, {
					"name": this.$L('分类'),
					"imgUrl": img_url + 'fenlei.png',
					"selImgUrl": img_url + 'site/fenlei_sel.png'
				}],
				is_favorites: '0', //是否被收藏
				vender_detail: {}, //店铺详情
				home_decoration: true, //店铺首页
				productList: [], //全部商品列表
				pn: '1', //默认第一页
				all_commodities: false, //全部商品是否显示
				commodNavIdx: '0', //商品列表nav默认第一项
				isAscendingOrder: 1, //是否升序
				grid_list: true, //是否是两列grid_list布局
				new_products: false, //全部上新
				new_productList: [], //全部上新列表
				coupon: false, //优惠券
				couponList: [], //优惠券列表
				conpon_show: false, //优惠券规则展开
				tabcurrentTabIndex: 0, //默认选中首页
				tabisSelect: false, //tabbar的状态
				homePage: true, //首页显示
				fenlei: false, //分类
				classifyList: [], //店铺分类
				isReceive: false, //优惠券是否已领取
				decorationData: [], //店铺装修数据
				img_url: getApp().globalData.img_url, //图片地址
				no_more: false, //没有更多数据了
				share_img: '', //点击右上角的分享，分享店铺图片
				share_name: '', //点击右上角分享，分享店铺的名称
				recommend_product: {}, //推荐商品
				recommend_productList: [], //推荐商品列表
				no_recomment_goods: false, //店铺无推荐商品
				no_content_decor: false, //店铺装修无数据
				no_content_productList: false, //店铺无商品列表数据
				no_content_newProductList: false, //店铺无上新列表数据
				no_content_coupon: false, //店铺无优惠券数据
				no_content_fenlei: false, //店铺无分类数据
				store_banner: '', //店铺首页banner图
				hasmore: true, //有无更多
				tips_show: false, //三点分享更多按钮
				tips: [{
					tips_img: img_url + 'site/shouye.png',
					tips_name: this.$L('首页'),
					tips_link: '/pages/index/index',
					type: 'switchTab'
				}, {
					tips_img: img_url + 'site/leimupinleifenleileibie1.png',
					tips_name: this.$L('分类'),
					tips_link: '/pages/categroy/categroy',
					type: 'switchTab'
				}, {
					tips_img: img_url + "site/shape.png",
					tips_name: this.$L('分享'),
					tips_link: '',
					type: 'share'
				}, {
					tips_img: img_url + 'site/cart.png',
					tips_name: this.$L('购物车'),
					tips_link: '/pages/cart/cart',
					type: 'switchTab'
				}, {
					tips_img: img_url + 'site/gerenzhongxin.png',
					tips_name: this.$L('个人中心'),
					tips_link: '/pages/user/user',
					type: 'switchTab'
				}],
				city_site_open: "",
				transparent_mask: false,
				key: "",
				index: -1,
				scrollTopH: 0,
				bottomSateArea: getApp().globalData.bottomSateArea, //iphone手机底部一条黑线的高度
				shareWrap2: false, // 展示分享弹层
				iswx: false,
				share_img_h5: ''
			};
		},

		components: {},
		props: {},
		onShow() {
			this.venderDetail(); //店铺详情
			this.iswx = this.$isWeiXinBrower();
		},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('店铺首页')
      });
			if (options.scene) {
				let url = decodeURIComponent(options.scene);

				if (getSceneParam(url, 'vid')) {
					options.vid = getSceneParam(url, 'vid');
				}
			}

			let city_site_open = uni.getStorageSync('city_site_open');

			if (city_site_open) {
				let city_site_bind_id = uni.getStorageSync('city_site_bind_id');
				this.setData({
					bid: city_site_bind_id,
					city_site_open: city_site_open
				});
			}

			let sc_name = options.sc_name;
			let vid = options.vid;
			this.setData({
				searchVal: sc_name,
				vid: vid
			});
			this.isCollection(); //是否已被收藏

			this.getShopHome(); //获取店铺首页装修
			this.iswx = this.$isWeiXinBrower();
		},

		// 加载更多
		onReachBottom(e) {
			let {
				all_commodities,
				new_products,
				coupon,
				fenlei,
				hasmore
			} = this;

			if (hasmore) {
				if (all_commodities) {
					this.getProductList(); //全部商品列表
				} else if (new_products) {
					this.getNewProductList(); //获取商品上新数据
				} else if (coupon) {
					this.getCouponList(); //获取优惠券列表
				} else if (fenlei) {
					this.getShopClassify(); //获取店铺分类

					this.getRecommendProductList();
				}
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(options) {
			let {
				share_img
			} = this;

			if (options.form === 'button') {
				//来自页面内转发按钮
				return {
					title: this.share_name,
					path: '/pages/shopHomePage/shopHomePage?vid=' + this.vid,
					imageUrl: share_img
				};
			}

			return {
				title: this.share_name,
				path: '/pages/shopHomePage/shopHomePage?vid=' + this.vid,
				imageUrl: share_img
			};
		},
		onShareTimeline: function(options) {
			let {
				share_img
			} = this;
		
			if (options.form === 'button') {
				//来自页面内转发按钮
				return {
					title: this.share_name,
					path: '/pages/shopHomePage/shopHomePage?vid=' + this.vid,
					imageUrl: share_img
				};
			}
		
			return {
				title: this.share_name,
				path: '/pages/shopHomePage/shopHomePage?vid=' + this.vid,
				imageUrl: share_img
			};
		},
		methods: {
			go_back() {
				uni.navigateBack({});
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
				let type = e.currentTarget.dataset.type;

				if (type != 'share') {
					uni.switchTab({
						url: link
					});
				} else { //点击了分享
					// #ifndef MP-WEIXIN
					this.shareWrap2 = true;
					this.$weiXinBrowerShare(1,{
						 title:this.vender_detail.store_name,
						 desc:this.$L('刚刚看到一个不错的店铺，快来看看~'),
						 link:this.vender_detail.app_share_url,
						 imgUrl:this.vender_detail.store_label,
					});
					// #endif
				}
				this.setData({
					tips_show: false
				});
			},
			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare: function(type, scene) {
				let shareData = {};
				if (type == 0) {
					shareData.href = this.vender_detail.app_share_url;
					shareData.title = this.vender_detail.store_name;
					shareData.summary = this.$L('刚刚看到一个不错的店铺，快来看看~');
					shareData.imageUrl = this.vender_detail.store_label;
				} else if (type == 2) {
					shareData.imageUrl = this.share_img_h5;
				}
				this.$weiXinAppShare(type, scene, shareData);
				this.closeShare(); //关闭分享
			},


			closeShare() {
				this.setData({
					shareWrap2: false
				})
			},
			downloadImg() {
				let {
					shareImg
				} = this;
        let that = this
				wx.downloadFile({
					url: shareImg,
					success: res => {
						if (res.statusCode == 200) {
							wx.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: result => {
									if (result.errMsg == 'saveImageToPhotosAlbum:ok') {
										wx.showToast({
											title: that.$L('已保存到本地'),
										})
										this.closeShare();
									} else {
										wx.showToast({
											title: that.$L('保存失败'),
											icon: 'none'
										})
									}
								}
							})
						} else {
							wx.showToast({
								title: that.$L('下载失败'),
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



			//获取滚动条的当前位置
			onPageScroll: function(e) {
				this.scrollTopH = e.scrollTop;
				if (e.scrollTop > 150) {
					this.setData({
						searchShow: true
					});
				} else if (this.fenlei && e.scrollTop > 80) {
					this.setData({
						searchShow: true
					});
				} else {
					this.setData({
						searchShow: false
					});
				}
			},

			//点击去搜索
			goSearch() {
				uni.navigateTo({
					url: '/pages/productSearch/productSearch?vid=' + this.vid
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
				this.getProductList();
			},

			//去商品介绍页
			handleStoreIntroduction(e) {
				let vid = e.currentTarget.dataset.vid;
				uni.navigateTo({
					url: '/pages/storeIntroduction/storeIntroduction?vid=' + vid
				});
			},

			//店铺是否已收藏
			isCollection() {
				let that = this;
				let key = uni.getStorageSync('token');
				let vid = that.vid;

				if (key) {
					this.setData({
						key
					});
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=vendorfollow&mod=is_favorites',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							vid
						},
						success: function(res) {
							if (res.data.code == 200) {
								that.setData({
									is_favorites: res.data.datas.is_favorites
								});
							}
						}
					});
				}
			},

			//获取店铺首页装修
			getShopHome() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open;
				let data = {
					key: key,
					shop_id: that.vid
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=index',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							let decorationData = res.data.datas;

							if (decorationData && decorationData.length == 0) {
								that.setData({
									no_content_decor: true
								});

								if (that.no_content_decor) {
									that.setData({
										all_commodities: true
									});
									that.getProductList(); //全部商品列表
								}
							} else {
								that.setData({
									decorationData
								});
							}
						}
					},
					error: function(err) {},
					complete: function() { // wx.hideLoading()
					}
				});
			},

			// 获取全部商品列表
			getProductList() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					commodNavIdx = that.commodNavIdx;
				let data = {
					page: 10,
					pn: that.pn,
					key: commodNavIdx == 0 ? '' : commodNavIdx == 1 ? '3' : commodNavIdx == 2 ? '2' : commodNavIdx == 3 ? '4' : '',
					order: commodNavIdx == 2 ? that.isAscendingOrder == 1 ? "1" : '0' : '',
					//排序：1降序，0升序
					vid: that.vid
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				if (this.searchVal) {
					data.keyword = this.searchVal;
				}

				;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=store&mod=goods_list',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.goods_list.length == 0) {
								that.setData({
									no_content_productList: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								if (that.pn == 1) {
									let productList = res.data.datas.goods_list;
									that.setData({
										productList
									});
								} else {
									let productList = res.data.datas.goods_list;
									that.setData({
										productList: that.productList.concat(productList)
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
					complete: function() { // wx.hideLoading()
					}
				});
			},

			// 获取商品上新列表
			getNewProductList() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					vid = that.vid;
				let data = {
					page: 10,
					pn: that.pn,
					type: 'new',
					vid: vid
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				if (this.searchVal) {
					data.keyword = this.searchVal;
				}

				;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=store&mod=getStoreHotGoods',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.goods_list.length == 0) {
								that.setData({
									no_content_newProductList: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								if (that.pn == 1) {
									let new_productList = res.data.datas.goods_list;
									that.setData({
										new_productList
									});
								} else {
									let new_productList = res.data.datas.goods_list;
									that.setData({
										new_productList: that.new_productList.concat(new_productList)
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
					complete: function() { // wx.hideLoading()
					}
				});
			},

			//优惠券列表
			getCouponList() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					vid = that.vid;
				let data = {
					page: 10,
					pn: that.pn,
					vid: vid,
					key: key
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=red&mod=store_red_list&sld_addons=red',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.red.length == 0) {
								that.setData({
									no_content_coupon: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								if (that.pn == 1) {
									let couponList = res.data.datas.red;
									that.setData({
										couponList
									});
								} else {
									let couponList = res.data.datas.red;
									that.setData({
										couponList: that.couponList.concat(couponList)
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
					complete: function() { // wx.hideLoading()
					}
				});
			},

			//领取优惠券
			receive(e) {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					red_id = e.currentTarget.dataset.redid;

				if (!key) {
					getApp().globalData.goLogin();
					return;
				}

				let data = {
					key: key,
					red_id: red_id
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=red&mod=send_red&sld_addons=red',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas == 1) {
								uni.showToast({
									title: that.$L('领取成功'),
									icon: 'none',
									duration: 1500 //持续的时间

								});
								that.setData({
									isReceive: true
								});
								that.getCouponList();
							} else {
								uni.showToast({
									title: res.data.datas,
									icon: 'none',
									duration: 1500 //持续的时间

								});
								that.getCouponList();
							}
						}
					},
					error: function(err) {},
					complete: function() {}
				});
			},

			//优惠券规则展开
			handleOpen() {
				this.setData({
					conpon_show: !this.conpon_show
				});
			},

			//选项卡切换
			tabItemTap(e) {
				//记录上次点击的对象的序号
				var oldidx = this.currentTabIndex; //记录当前点击的对象的序号

				var currentIdx = e.currentTarget.dataset.idx;
				this.setData({
					hasmore: true
				});

				if (oldidx == currentIdx) {
					var isSelect = this.isSelect;
					this.setData({
						currentTabIndex: currentIdx,
						isSelect: !isSelect
					});
				} else {
					this.setData({
						currentTabIndex: currentIdx,
						isSelect: true
					});

					if (this.no_content_decor) {
						//无装修数据时：不显示装修模块，从全部商品开始显示
						if (currentIdx == 0) {
							this.setData({
								home_decoration: true,
								homePage: true,
								coupon: false,
								all_commodities: this.no_content_decor ? true : false,
								new_products: false,
								fenlei: false,
								currentTabIndex: '0',
								pn: '1'
							}); // this.getProductList();   //全部商品列表
						}

						if (currentIdx == 1) {
							this.setData({
								home_decoration: false,
								new_products: true,
								all_commodities: false,
								coupon: false,
								pn: '1'
							});
							this.getNewProductList(); //获取商品上新数据
						} else if (currentIdx == 2) {
							this.setData({
								home_decoration: false,
								coupon: true,
								all_commodities: false,
								new_products: false,
								pn: '1'
							});
							this.getCouponList(); //获取优惠券列表
						} else {
							this.setData({
								home_decoration: true,
								all_commodities: true,
								new_products: false,
								coupon: false,
								pn: '1'
							});
						}
					} else {
						//有装修数据时，默认显示装修模块
						if (currentIdx == 0) {
							this.setData({
								home_decoration: true,
								new_products: false,
								all_commodities: false,
								coupon: false,
								pn: '1'
							});
						}

						if (currentIdx == 1) {
							this.setData({
								home_decoration: false,
								all_commodities: true,
								new_products: false,
								coupon: false,
								pn: '1'
							});
							this.getProductList(); //全部商品列表
						} else if (currentIdx == 2) {
							this.setData({
								home_decoration: false,
								new_products: true,
								all_commodities: false,
								coupon: false,
								pn: '1'
							});
							this.getNewProductList(); //获取商品上新数据
						} else if (currentIdx == 3) {
							this.setData({
								home_decoration: false,
								coupon: true,
								all_commodities: false,
								new_products: false,
								pn: '1'
							});
							this.getCouponList(); //获取优惠券列表
						} else {
							this.setData({
								home_decoration: true,
								all_commodities: false,
								new_products: false,
								coupon: false,
								pn: '1'
							});
						}
					}
				}
			},

			//底部tabbar的切换
			hanbleTab(e) {
				this.pn = 1
				//切换时回到页面的顶部
				if (uni.pageScrollTo) {
					//判断这个方法是否可用
					uni.pageScrollTo({
						scrollTop: 0
					});
				} else {
					uni.showModal({
						title: this.$L('提示'),
						content: this.$L('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
					});
				}

				this.setData({
					hasmore: true
				}); //记录上次点击的对象的序号

				var oldidx = this.tabcurrentTabIndex; //记录当前点击的对象的序号

				var currentIdx = e.currentTarget.dataset.idx;

				if (oldidx == currentIdx) {
					var tabisSelect = this.tabisSelect;
					this.setData({
						tabcurrentTabIndex: currentIdx,
						tabisSelect: !tabisSelect
					});
				} else {
					this.setData({
						tabcurrentTabIndex: currentIdx,
						tabisSelect: true
					});

					if (currentIdx == 0) {
						this.setData({
							home_decoration: true,
							homePage: true,
							coupon: false,
							all_commodities: this.no_content_decor ? true : false,
							new_products: false,
							fenlei: false,
							currentTabIndex: '0',
							pn: '1'
						});
					} else if (currentIdx == 1) {
						this.setData({
							home_decoration: false,
							homePage: false,
							coupon: false,
							all_commodities: true,
							new_products: false,
							fenlei: false,
							pn: '1'
						});
						this.getProductList(); //全部商品列表
					} else if (currentIdx == 2) {
						this.setData({
							homePage: true,
							coupon: false,
							all_commodities: false,
							new_products: false,
							fenlei: true
						});
						this.getShopClassify(); //获取店铺分类

						this.getRecommendProductList(); //获取店铺推荐商品
					} else {
						this.setData({
							homePage: false,
							coupon: false,
							all_commodities: false,
							new_products: false,
							fenlei: false
						});
					}
				}
			},

			//商品列表tab切换
			commoditiesNav(e) {
				this.setData({
					hasmore: true
				}); //切换时回到页面的顶部

				if (uni.pageScrollTo) {
					//判断这个方法是否可用
					uni.pageScrollTo({
						scrollTop: 0
					});
				} else {
					uni.showModal({
						title: this.$L('提示'),
						content: this.$L('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
					});
				}

				let that = this,
					commodNavIdx = e.currentTarget.dataset.index;
				that.setData({
					commodNavIdx,
					pn: '1'
				});

				if (commodNavIdx == 2) {
					that.setData({
						isAscendingOrder: that.isAscendingOrder == 1 ? '0' : '1'
					});
				}

				that.getProductList();
			},

			// 获取店铺分类
			getShopClassify() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					vid = that.vid;
				let data = {
					key: key,
					vid: vid
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=store&mod=new_innercategory',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.innercategory.length == 0) {
								that.setData({
									no_content_fenlei: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								if (that.pn == '1') {
									let classifyList = res.data.datas.innercategory;
									that.setData({
										classifyList: classifyList
									});
								} else {
									let classifyList = res.data.datas.innercategory;
									that.setData({
										classifyList: that.classifyList.concat(classifyList)
									});
								}
							}
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
					},
					error: function(err) {},
					complete: function() { // wx.hideLoading()
					}
				});
			},

			//获取店铺推荐商品
			getRecommendProductList() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open,
					vid = that.vid;
				let data = {
					page: 10,
					pn: that.pn,
					vid: vid,
					key: key
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=store&mod=getWapRecGoods',
					method: 'POST',
					data,
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.code == 200) {
							if (res.data.datas.recomment_goods.goods_list.length == 0) {
								that.setData({
									no_recomment_goods: true
								});
							} else {
								//如果是初次加载，直接赋值，否则数据追加
								if (that.pn == '1') {
									let recommend_product = res.data.datas.recomment_goods;
									let recommend_productList = recommend_product !== null ? recommend_product.goods_list : [];
									that.setData({
										recommend_product: recommend_product,
										recommend_productList
									});
								} else {
									let recommend_productList = res.data.datas.recomment_goods.goods_list;
									that.setData({
										recommend_productList: that.recommend_productList.concat(recommend_productList)
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
					complete: function() { // wx.hideLoading()
					}
				});
			},

			//去商品分类列表
			handleProClas(e) {
				let stc_id = e.currentTarget.dataset.stc_id; // let stc_name = e.currentTarget.dataset.stc_name;
				uni.navigateTo({
					url: '/pages/productSearch/productSearch?stc_id=' + stc_id + '&vid=' + this.vid
				});
			},

			//布局切换
			layoutSwitch() {
				this.setData({
					grid_list: !this.grid_list
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

			// 商铺首页详情
			venderDetail(e) {
				let key = uni.getStorageSync('token');
				let that = this;
				let {
					vid
				} = that;

				if (vid) {
					let url = getApp().globalData.ser_url + '/index.php?app=store&mod=store_detail';
					uni.request({
						url: url,
						method: 'GET',
						data: {
							vid
						},
						success: function(res) {
							if (res.data.code == 200) {
								let vender_detail = res.data.datas;
								that.setData({
									vender_detail: vender_detail,
									share_img: vender_detail.store_label,
									share_name: vender_detail.store_name,
									store_banner: vender_detail.store_banner,
									share_img_h5: vender_detail.share_img
								});
							}
						},
						error: function(err) {
						}
					});
				}
			},

			//进入店铺首页
			handleShopHomePage() {
				uni.navigateTo({
					url: '/pages/shopHomePage/shopHomePage'
				});
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
					vid,
					is_favorites
				} = that;

				if (vid) {
					let url = getApp().globalData.ser_url + '/index.php?app=vendorfollow';

					if (is_favorites == 1) {
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
							let {
								is_favorites
							} = that;

							if (res.data.datas == 1) {
								that.setData({
									is_favorites: is_favorites == 0 ? '1' : '0'
								});
								uni.showToast({
									title: that.is_favorites == 0 ? that.$L('取消收藏') : that.$L('收藏成功'),
									icon: 'none',
									duration: 1000
								});
								that.venderDetail(); //店铺详情
							} else {
								uni.showToast({
									title: that.is_favorites == 0 ? that.$L('取消收藏失败') :that.$L('收藏失败'),
									icon: 'none',
									duration: 1000
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
				});
				this.getProductList();
			},

			//搜索
			search() {
				this.getProductList();
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
	/* pages/shopHomePage/shopHomePage.wxss */
	page {
		width: 750rpx;
		height: 100%;
		background-color: #F5F5F5;
		position: relative;
		margin: 0 auto;
	}

	.shop_homepage {
		width: 750rpx;
		background: #F5F5F5;
		height: 100%;
		position: absolute;
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

	.content {
		width: 100%;
		/* height: 754rpx; */
		/* background: black; */
		background-size: 100%;
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
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		z-index: 10;
	}

	.search_input {
		width: 78%;
		height: 65rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		background: rgba(248, 248, 248, 1);
		border-radius: 33px;
	}

	.search_input1 {
		width: 78%;
		height: 65rpx;
		background: rgba(255, 255, 255, 1);
		border: 2rpx solid rgba(255, 12, 12, 1);
		border-radius: 33rpx;
	}

	.search_input image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.search_input input {
		font-size: 28rpx !important;
	}

	.search_input .cancel {
		width: 47rpx;
		height: 47rpx;
	}

	.search input {
		width: 500rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(148, 148, 148, 1);
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
		right: -15rpx;
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

	/* 搜索框 */
	.search1 {
		width: 750rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 35rpx;
		box-sizing: border-box;
		position: fixed;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		z-index: 10;
		background: #FFFFFF;
	}

	.search1 .search_input {
		width: 77%;
		height: 65rpx;
		border: 2rpx solid rgba(225, 37, 27, 1);
		border-radius: 33rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		background: #FFFFFF;
	}

	.search1 .search_input image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.search1 .search_input .cancel {
		width: 47rpx;
		height: 47rpx;
	}

	.search1 input {
		width: 500rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(148, 148, 148, 1);
		line-height: 32rpx;
	}

	.search1 .search_text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	/* 店铺详情 */
	.shop_des {
		width: 100%;
		color: rgba(255, 255, 255, 1);
		/* #ifndef APP-PLUS */
		padding-top: 88rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		padding-top: calc(var(--status-bar-height) + 88rpx);
		/* #endif */
		box-sizing: border-box;
		background-size: 100%;
	}

	.des_top {
		width: 100%;
		/* height: 449rpx; */
		height: 290rpx;
	}

	.shop_info {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 31rpx 20rpx 39rpx;
		box-sizing: border-box;
	}

	.info_left {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.info_left .avat {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	.info_des {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: space-between;
	}

	.info_top {
		display: flex;
		align-items: center;
	}

	.info_top text:nth-of-type(1) {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
	}

	.info_top image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 14rpx;

	}

	.info_top text:nth-of-type(2) {
		width: 60rpx;
		height: 30rpx;
		background: rgba(252, 28, 28, 1);
		border-radius: 15rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 30rpx;
		text-align: center;
	}

	.info_bot {
		display: flex;
		align-items: center;
		margin-top: 13rpx;
	}

	.info_bot image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 8rpx;
	}

	.info_bot text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
	}

	.info_right {
		width: 110rpx;
		height: 50rpx;
		background: linear-gradient(-50deg, rgba(252, 28, 28, 1) 0%, rgba(255, 104, 3, 1) 100%);
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
		border-radius: 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.info_right1 {
		width: 110rpx;
		height: 50rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(252, 28, 28, 0.2);
		border-radius: 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select_nav {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav_item {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.nav_item image {
		width: 64rpx;
		height: 64rpx;
		margin-bottom: 10rpx;
	}

	.nav_item text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
	}

	.des_con {
		/* margin-top: -155rpx; */
		width: 100%;
		/* height: calc(100vh - 449rpx); */
		border-radius: 15rpx;
		position: absolute;
		z-index: 5;
		background: #F5F5F5;
	}

	.des_con1 {
		margin-top: 0;
		width: 100%;
		/* height: calc(100vh - 88rpx); */
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		position: absolute;
		z-index: 5;
	}

	.all_commodities {
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 98rpx;
		box-sizing: border-box;
		border-radius: 15rpx 15rpx 0 0;
		background: #F5F5F5;
	}

	.all_commodities_nav {
		width: 750rpx;
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 15rpx 15rpx 0 0;
	}

	.nav1 {
		position: fixed;
		/* #ifdef APP-PLUS */
		top: calc(var(--status-bar-height) + 88rpx);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 88rpx;
		/* #endif */
		z-index: 5;
	}

	.comprehensive {
		display: flex;
		align-items: center;
	}

	.comprehensive .pre_title {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.all_commodities_nav .active {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(243, 30, 30, 1);
		line-height: 32rpx;
	}

	.comprehensive image {
		width: 14rpx;
		height: 9rpx;
		margin-left: 10rpx;
	}

	.sales_volume {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		display: flex;
		align-items: center;
	}

	.price {
		display: flex;
	}

	.price .pre_title {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.price .active {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(243, 30, 30, 1);
		line-height: 32rpx;
	}

	.price_switch {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 10rpx;
	}

	.price_switch image {
		width: 14rpx;
		height: 9rpx;
	}

	.price_switch image:nth-child(1) {
		margin-bottom: 5rpx;
	}

	.sales_volume {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.layout {
		box-sizing: border-box;
		position: relative;
		padding: 0 26rpx 0 0;
		box-sizing: border-box;
	}

	.layout::before {
		content: "";
		width: 1rpx;
		height: 40rpx;
		position: absolute;
		top: 5rpx;
		left: -26rpx;
		background: rgba(187, 187, 187, 1);
	}

	.layout image {
		width: 50rpx;
		height: 50rpx;
	}

	/* 全部商品列表 */
	/* list布局 */
	.list {
		width: 100%;
		background: #F5F5F5;
		padding: 20rpx 20rpx 102rpx;
		box-sizing: border-box;
	}

	.list .list_pre {
		width: 100%;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
	}

	.list .pre_img {
		width: 294rpx;
		height: 294rpx;
		border-radius: 15rpx 0 0 15rpx;
	}

	.list .pre_img image {
		width: 294rpx;
		height: 294rpx;
		border-radius: 15rpx 0 0 15rpx;
	}

	.list .pre_des {
		width: 394rpx;
	}

	.list .pre_des .time_limited_discount {
		/* width:106rpx; */
		padding: 0 11rpx;
		box-sizing: border-box;
		height: 30rpx;
		/* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
		border-radius: 15rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 18rpx;
	}

	.list .list_pre .des_desc {
		margin-top: 43rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.list .list_pre .des_info {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		width: 310rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 35rpx;
		margin-top: 20rpx;
	}

	/* grid网格布局 */
	.all_commodities_list {
		background: #F5F5F5;
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.product1 {
		margin-top: 90rpx;
		padding-bottom: 4rpx !important;
	}

	.all_commodities_list .list_pre {
		width: 345rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.all_commodities_list .list_pre:nth-of-type(2n) {
		margin-right: 0;
	}

	.all_commodities_list .list_pre .pre_img {
		width: 345rpx;
		height: 345rpx;
		border-radius: 15rpx;
	}

	.all_commodities_list .list_pre .pre_img image {
		width: 345rpx;
		height: 345rpx;
		border-radius: 15rpx 15rpx 0 0;
	}

	.all_commodities_list .pre_des {
		padding: 20rpx;
		height: 272rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.list .list_pre .pre_des {
		padding: 20rpx 0 20rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.all_commodities_list .list_pre .des_name {
		width: 310rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		font-weight: bold;
	}

	.list .list_pre .des_name {
		width: 374rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		font-weight: bold;
	}

	.all_commodities_list .list_pre .des_info {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		width: 310rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 39rpx;
		margin-top: 9rpx;
	}

	.list .list_pre .des_info {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		width: 374rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 39rpx;
		margin-top: 9rpx;
	}

	.discount {
		display: flex;
	}

	.time_limited {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.list_pre .time_limited_discount {
		/* width:106rpx; */
		padding: 0 11rpx;
		box-sizing: border-box;
		height: 30rpx;
		/* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
		border-radius: 15rpx;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 39rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 15rpx;
	}

	.all_commodities_list .list_pre .des_desc {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 31rpx;
	}

	.list_pre .des_desc .commodity_price {
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(252, 28, 28, 1);
		font-weight: bold;
	}

	.commodity_price {
		font-size: 34rpx;
		font-family: PingFang SC;
		color: rgba(252, 28, 28, 1);
		line-height: 32rpx;
		font-weight: bold;
	}

	.commodity_price text:nth-child(1),
	.commodity_price text:nth-last-child(1) {
		font-size: 22rpx;
	}

	.list_pre .des_desc .salenum {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
	}

	/* 商品上新 */
	.new_products {
		width: 100%;
		background: #F5F5F5;
		border-radius: 15rpx 15rpx 0 0;
		padding-bottom: 100rpx;
		box-sizing: border-box;
	}

	.new_products_pre {
		width: 100%;
		padding-top: 20rpx;
	}

	.new_products_pre:nth-of-type(1) {
		width: 100%;
		padding-top: 40rpx;
	}

	.new_products_top {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.new_products_top .line {
		width: 120rpx;
		height: 1rpx;
		background: rgba(187, 187, 187, 1);
	}

	.new_products_title {
		display: flex;
		align-items: center;
		margin: 0 10rpx;
	}

	.new_products_title image {
		width: 28rpx;
		height: 27rpx;
		margin-right: 9rpx;
	}

	.new_products_title text {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	/* 优惠券 */
	.coupon {
		width: 100%;
		padding: 20rpx 20rpx 100rpx;
		box-sizing: border-box;
		background: #F5F5F5;
		border-radius: 15rpx 15rpx 0 0;
	}

	.coupon_pre {
		width: 100%;
		width: 711rpx;
		margin-bottom: 20rpx;
		min-height: 257rpx;
	}

	.conpon_des {
		width: 100%;
		width: 711rpx;
		height: 257rpx;
	}

	.conpon_des_top {
		width: 711rpx;
		height: 195rpx;
		display: flex;
		align-items: center;
		margin: 0 10rpx;
	}

	.coupon_des_left {
		width: 161rpx;
		height: 195rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		font-family: Adobe Heiti Std;
		font-weight: normal;
		color: rgba(253, 51, 18, 1);
		line-height: 45rpx;
		margin-left: 22rpx;
	}

	.coupon_des_left1 {
		width: 161rpx;
		height: 195rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		font-family: Adobe Heiti Std;
		font-weight: normal;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
		margin-left: 22rpx;
	}

	.yuan {
		font-size: 24rpx;
	}

	.coupon_des_con {
		width: 330rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 27rpx;
	}

	.progress-box {
		align-items: center;
		/* height: 32rpx; */
	}

	.progress-box .progress_text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		font-style: italic;
		color: rgba(253, 51, 18, 1);
		line-height: 32rpx;
		margin-left: 20rpx;
	}

	.full_reduction {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45rpx;
	}

	.validity {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 45rpx;
	}

	.coupon_des_right {
		display: flex;
		align-items: flex-start;
	}

	.coupon_des_right text {
		width: 140rpx;
		height: 50rpx;
		border-radius: 25px;
		background: rgba(253, 51, 18, 1);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.coupon_des_right1 text {
		width: 140rpx;
		height: 50rpx;
		background: rgba(153, 153, 153, 1);
		border-radius: 25rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.conpon_des_bot {
		width: 100%;
	}

	.conpon_show {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		padding-left: 0;
		box-sizing: border-box;
	}

	.conpon_show .text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
		padding-left: 22rpx;
		width: 615rpx;
		height: auto;
		box-sizing: border-box;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		/* 要显示多少行就改变line-clamp的数据,此处折叠起来显示一行*/
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.conpon_show .text2 {
		display: -webkit-box;
	}

	.conpon_show .text1 {
		display: block;
	}

	.conpon_show image {
		width: 16rpx;
		height: 9rpx;
	}

	.conpon_rules {
		width: 100%;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		padding-left: 22rpx;
		box-sizing: border-box;
	}

	.conpon_rules text {
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
	}

	/* 分类 */
	.fenlei {
		width: 100%;
		height: 100%;
		border-radius: 15rpx;
		position: absolute;
		z-index: 5;
	}

	.fenlei_lists {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 20rpx 0 0;
		box-sizing: border-box;
		margin-top: -150rpx;
		background: #F5F5F5;
	}

	.fenlei_pre {
		width: 710rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		padding: 17rpx 20rpx 0;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.fenlei_pre_top {
		width: 100%;
		/* height: 71rpx; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 0 20rpx;
		box-sizing: border-box;
		position: relative;
		margin-bottom: 17rpx;
	}

	.fenlei_pre_title {
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		box-sizing: border-box;
	}

	.fenlei_pre_title::before {
		position: absolute;
		top: 10rpx;
		left: 0rpx;
		bottom: 0;
		content: '';
		width: 4rpx;
		height: 30rpx;
		background: rgba(253, 52, 20, 1);
		border-radius: 2rpx;
	}

	.fenlei_pre_top image {
		width: 50rpx;
		height: 50rpx;
		margin-right: -15rpx;
	}

	.fenlei_list {
		display: flex;
		background: #FFFFFF;
		width: 100%;
		margin-top: 21rpx;
		flex-wrap: wrap;
	}

	.fenlei_list text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		width: 325rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: rgba(242, 242, 242, 1);
		border-radius: 6rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding: 0 17rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		margin-right: 20rpx;
		text-align: center;
	}

	.fenlei_list text:nth-of-type(2n) {
		margin-right: 0;
	}

	.no_fenlei {
		box-sizing: border-box;
		margin-top: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 126rpx;
	}

	.no_fenlei image {
		width: 238rpx;
		height: 171rpx;
	}

	.no_fenlei text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 24rpx;
		margin-top: 20rpx;
	}

	/* 推荐商品 */
	.all_commodities_list1 {
		background: #F5F5F5;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 0 100rpx;
		box-sizing: border-box;
	}

	.commodities_list {
		background: #F5F5F5;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 20rpx 0 20rpx;
		box-sizing: border-box;
	}

	.no_more {
		width: 100%;
		display: flex;
		justify-content: center;
	}




	/* tabbar底栏 */
	.tabbar {
		position: fixed;
		bottom: 0;
		z-index: 10;
		width: 750rpx;
		height: 98rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 130rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(86, 86, 86, 0.08);
	}

	.iphone_view {
		position: fixed;
		bottom: 0;
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
	}

	.tabbar_pre {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tabbar_pre image {
		width: 50rpx;
		height: 50rpx;
	}

	.tabbar_pre text {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
	}

	.tabbar_pre .pre_sel {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(252, 39, 25, 1);
		line-height: 32rpx;
	}

	/* 暂无数据 */
	.no_data {
		font-size: 24rpx;
		color: black;
		text-align: center;
	}

	/* 店铺首页装修 */
	.home_decoration {
		padding-bottom: 100rpx;
		box-sizing: border-box;
		border-radius: 15rpx 15rpx 0 0;
	}


	/* 无数据 */
	.no_content {
		margin: 250rpx auto 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.no_content image {
		width: 200rpx;
		height: 200rpx;
	}

	.no_content text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 32rpx;
		margin-top: 30rpx;
	}

	.no_coupon {
		width: 212rpx;
		height: 159rpx;
	}

	/* 加载更多，没有更多 */
	.is_more {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999999;
		line-height: 22rpx;
		margin: 10rpx 0 30rpx;
		background: #F5F5F5;
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

	.search .top_w_b {
		height: 50rpx !important;
		width: 50rpx !important;


	}

	.top_w_b {
		height: 34rpx;
		width: 34rpx;
		margin: 0 0 0 20rpx;
		display: block;
	}

	/* #ifdef H5  */
	.search {
		padding-left: 0;
	}

	.search1 {
		padding-left: 0;
	}

	/* #endif */
	/* #ifdef APP-PLUS  */
	.top_w_b {
		margin-left: 0;
	}

	/* #endif */




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


	.select-wrap .share-mode .ul {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		position: fixed;
		bottom: 200rpx;
		z-index: 9999;
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
		position: fixed;
		bottom: 30rpx;
		z-index: 99999;
	}

	.select-wrap .close image {
		width: 30rpx;
		height: 30rpx;
		padding: 30rpx;
	}
	.is_h5_public_share {
		margin-top: 100rpx;
	}
	.is_h5_share{
		width: 750rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.share-img{
		border-radius: 20%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.h5_share_tips{
		width: 400rpx;
		height: 100rpx;
		margin-top: 100rpx;
	}
</style>
