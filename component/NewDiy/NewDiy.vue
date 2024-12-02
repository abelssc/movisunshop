<template>

	<view :class="{'container':is_show_top == true,'container1':home_is_show_top_cat == true,'topic_top':!is_show_top,}"
	 :style="{paddingTop:is_show_empty == true?'166rpx':(tab_index == 0?(home_is_show_top_cat == true?'96rpx':'108rpx'):'158rpx'),paddingBottom:isIos == true?'170rpx':''}">  
		<!-- 专题页标题 -->
		<!-- <view class="topic_top_bar" v-if="is_show_top == false" @click="toBack">
			<image :src="img_url+'to_right.png'" mode="" class="topic_back_icon"></image>
			<view class="topic_name">{{topic_name}}</view>
		</view> -->
		<!-- <view class="container" :style="{paddingTop:is_show_empty == true?'54rpx':'68rpx'}"> -->
		<view class="mp-search-box" v-if="is_show_top == true">
				<view class="avatar-container">
					<image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
				</view>
				<view v-if="city_site_open" class="city_wrap" @click="chooseCity" >
					<text>{{city}}</text>
				</view>
				<image v-if="city_site_open" mode="aspectFit" :src="img_url+'more_site.png'" class="top_icon"></image>
				<view class="search_con">
					<image :src="img_url+'search.svg'" mode="aspectFit" class="search_img" @click="toSearchPage"></image>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="scan" @click="scanCode">
					<image :src="img_url+'scanning.png'" mode=""></image>
					<text>{{$L('扫一扫')}}</text>
				</view>
				<!-- #endif -->
				
				<view class="message" @click="toMessage" style="display:none">
					<image :src="img_url+'notification.svg'" mode=""></image>
				</view>
				<tab-menu :backGround="tab_index == 0?pure_bg_color:top_bg" :tabInfo="sort_nav_list" @getChildList="getChildList"
				v-if="is_show_top == true&&home_is_show_top_cat" ref="menuTab" style="display:none"></tab-menu>
				
		</view>

		<!-- 头部轮播 -->
		<!-- 首页装修 -->
		<view v-if="is_show_index == true && isShow == true" :class="isShowTab == true?(home_is_show_top_cat?'deco_wrap':'deco_wrap_no_top_cat'):'deco_wrap2'">
			<view class="index_deco" v-for="(decoItem,decoIndex) in deco_info" :key="decoIndex">
				<view class="carousel-section" v-if="decoItem.type == 'top_cat_nav' && decoItem.data.length>0">
					<!-- 背景色区域 -->
					<view :class="decoItem.swiper_bg_style == 1?'titleNview-background top_swiper_style1':'titleNview-background top_swiper_style2'"
					 :style="{background:titleNViewBackground,borderRadius:decoItem.swiper_bg_style == 1?'border_radius':'0'}"></view>
					<uni-swiper-dot :current="swiperCurrent" :info="decoItem.data" mode="round" :dotsStyles="dotsStyles" @click="skipTo()" >
						<swiper class="carousel" circular @change="swiperChange" autoplay="true" interval="8000">
							<swiper-item v-for="(item, index) in decoItem.data" :key="index" class="carousel-item" @click.stop="skipTo(item.url_type,item.url,item.info)">
								<image :src="item.img" />
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</view>

				<!-- 公告 -->
				<view class="notice_box" v-if="decoItem.type == 'gonggao' && decoItem.is_show == true">
					<!-- 公告样式一 -->
					<view class="notice_wrap1" v-if="decoItem.type == 'gonggao' && decoItem.show_style == 'one' " @click="skipTo(decoItem.url_type,decoItem.url,decoItem.info)">
						<image :src="noticeImg1" mode="" class="notice_img1"></image>
						<marquee class="notice_content_wrap" broadcastType="text" direction="left" :broadcastData="[decoItem.text]"
						 :broadcastStyle="broadcastStyle1"></marquee>
						<view class="notice_wrap1_line"></view>
						<view class="notice_more">>></view>
					</view>
					<!-- 公告样式二 -->
					<view class="notice_wrap2" v-if="decoItem.type == 'gonggao' && decoItem.show_style == 'two'" @click="skipTo(decoItem.url_type,decoItem.url,decoItem.info)">
						<image :src="noticeImg2" mode="" class="notice_img2"></image>
						<marquee class="notice_content_wrap2" broadcastType="text" direction="left" :broadcastData="[decoItem.text]"
						 :broadcastStyle="broadcastStyle2"></marquee>
						<view class="notice_wrap2_line"></view>
						<view class="notice_more">>></view>
					</view>
				</view>



				<view class="nav_wrap" v-if="decoItem.type == 'nav'">
					<!-- 导航样式一、二（图标在上/不显示图标） -->
					<view class="cate-section" v-if="decoItem.style_set == 'nav' && decoItem.icon_set == 'up' && decoItem.is_show == true || decoItem.icon_set == 'no-icon' && decoItem.is_show == true">
						<view class="cate-item" v-for="(item,index) in decoItem.data" :key="index" @click="skipTo(item.url_type,item.url,item.info)">
							<image :src="item.img" v-if="decoItem.icon_set == 'up'"></image>
							<text>{{item.name}}</text>
						</view>
					</view>

					<!-- 导航样式三 （图标文字左右显示）-->
					<view class="cate-section" v-if="decoItem.style_set == 'nav' && decoItem.icon_set == 'left' && decoItem.is_show == true"
					 style="justify-content: flex-start;padding:20rpx 2rpx;">
						<view class="cate-item2" v-for="(item,index) in decoItem.data" :key="index" @click="skipTo(item.url_type,item.url,item.info)">
							<image :src="item.img" style="margin-right:10rpx;"></image>
							<view class="cate_name">{{filters.toSubstring(item.name,0,9)}}</view>
						</view>
					</view>

					<!-- 导航分组 -->
					<view class="nav_group" v-if="decoItem.style_set == 'tag-nav'">
						<view class="nav_group_item" v-for="(item,index) in decoItem.data" :key="index" @click="skipTo(item.url_type,item.url,item.info)">
							<image :src="item.img" mode="aspectFit"></image>
							<view class="nav_group_name">{{item.name}}</view>
						</view>
					</view>
				</view>

				<!-- 客服 -->
				<view class="service_wrap" v-if="decoItem.type == 'kefu' && decoItem.is_show == true" @click="callUp(decoItem.tel)">
					<image :src="telImg" mode=""></image>
					<text>{{decoItem.text}}{{decoItem.tel}}</text>
				</view>

				<!-- 富文本 -->
				<view class="rich_text_wrap ql-editor" v-if="decoItem.type == 'fuwenben' && decoItem.is_show == true">
					<rich-text :nodes="decoItem.text"></rich-text>
				</view>

				<!-- 图片组合 -->
				<view class="combination_wrap" v-if="decoItem.type == 'tupianzuhe' && decoItem.is_show == true">
					<!-- 图片组合0123 -->
					<view v-if="decoItem.type == 'tupianzuhe' && decoItem.sele_style<4 && decoItem.is_show == true" style="background-color: #fff;">
						<view class="modules-slide">
							<view :class="'image-list style' + decoItem.sele_style" v-if="decoItem.sele_style<3">
								<view :class="decoItem.sele_style == 2?'combination_style no_margin_right flex_row_start_start tupianzuhe2':'space_between combination_style'"
								 :style="{'display':decoItem.sele_style < 2?'block':'flex'}">
									<view v-for="(childitem, childindex) in decoItem.data" :key="childindex" :class="decoItem.sele_style < 2?'combine1':'combine2'"
									 :style="{'marginTop':decoItem.sele_style == 1?'20rpx':'0','marginRight':decoItem.sele_style < 3?'0':'20rpx','marginBottom':decoItem.sele_style < 3?'0':'20rpx'}">
										<view class="flex_column_start_center" v-if="decoItem.sele_style == 0||decoItem.sele_style == 1">
											<image v-if="decoItem.sele_style == 0 " @click="skipTo(childitem.url_type,childitem.url,childitem.info)"
											 mode="aspectFit" :src="childitem.img" :style="{'display': 'block','width':'750rpx','height':(750*childitem.height/childitem.width)+'rpx'}"></image>
											<image v-if="decoItem.sele_style == 1" @click="skipTo(childitem.url_type,childitem.url,childitem.info)" mode="aspectFit"
											 :src="childitem.img" :style="{'display': 'block','width':'710rpx','height':(710*childitem.height/childitem.width)+'rpx','margin-bottom':childindex == (decoItem.data.length-1)?'20rpx':0}"></image>
										</view>

										<view class="flex_row_center_center combine3" v-if="decoItem.sele_style == 2" :style="{'height':childindex%2==0?((345*childitem.height/childitem.width)+'rpx'):((345*decoItem.data[childindex-1].height/decoItem.data[childindex-1].width)+'rpx'),'margin-left':'20rpx'}">
											<image @click="skipTo(childitem.url_type,childitem.url,childitem.info)" mode="aspectFit" :src="childitem.img"
											 style="width: 100%;height: 100%;"></image>
										</view>
									</view>
								</view>
							</view>

							<view :class="'image-list style' + decoItem.sele_style" v-if="decoItem.sele_style == 3 && decoItem.is_show == true">
								<view class="combination_style no_margin_right2" style="display: flex;margin-bottom: 20rpx;flex-wrap:wrap">
									<view v-for="(childitem, childindex) in decoItem.data" :key="childindex" class="combine2">
										<view class="combine4" :style="{'height':childindex%3==0?((690/3*childitem.height/childitem.width)+'rpx'):(childindex%3==1?((690/3*decoItem.data[childindex-1].height/decoItem.data[childindex-1].width)+'rpx'):((690/3*decoItem.data[childindex-2].height/decoItem.data[childindex-2].width)+'rpx')),}">
											<image @click="skipTo(childitem.url_type,childitem.url,childitem.info)" mode="aspectFit" :src="childitem.img"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!--图片组合4  -->
					<view v-if="decoItem.type == 'tupianzuhe' && decoItem.sele_style == 4 && decoItem.is_show == true" style="background-color: #fff;">
						<view class="modules-slide">
							<view class="image-ad clearfix images-tpl">
								<view style="display: flex;">
									<view class="tupianzuhe04_left flex_row_center_center" @click="skipTo(decoItem.data[0].url_type,decoItem.data[0].url,decoItem.data[0].info)">
										<image mode="aspectFit" :src="decoItem.data[0].img"></image>
									</view>
									<view style="display: flex;flex-direction: column;justify-content: space-between;">
										<view class="tupianzuhe04_right_item flex_row_center_center" @click="skipTo(decoItem.data[1].url_type,decoItem.data[1].url,decoItem.data[1].info)">
											<image mode="aspectFit" :src="decoItem.data[1].img"></image>
										</view>
										<view class="tupianzuhe04_right_item flex_row_center_center" @click="skipTo(decoItem.data[2].url_type,decoItem.data[2].url,decoItem.data[2].info)">
											<image mode="aspectFit" :src="decoItem.data[2].img"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 图片组合5 6 display: flex;flex-wrap:wrap;-->
					<view v-if="decoItem.type == 'tupianzuhe'&& decoItem.sele_style == 5 || decoItem.sele_style == 6 && decoItem.is_show == true"
					 style="background-color: #fff;">
						<view class="modules-slide">
							<view class="image-ad clearfix images-tpl" style="padding-top: 0;">
								<view class="combine5_wrap" style="display:flex;flex-wrap:wrap;width:100%;" v-if="decoItem.sele_style == 5">
									<view v-for="(childitem, childindex) in decoItem.data" :key="childindex" class="combine5 flex_row_center_center"
									 @click="skipTo(childitem.url_type,childitem.url,childitem.info)" :style="{width: childindex == 0 || childindex == 3 ? 230 +'rpx' : 460 + 'rpx',
										height: '230rpx',marginTop:'20rpx',marginLeft:'20rpx',backGround:'red'}">
										<image mode="aspectFit" :src="childitem.img" style="width: 100%;height: 100%;"></image>
									</view>
								</view>

								<view class="" v-if="decoItem.sele_style == 6" style="display:flex;">
									<view class="combine6" style="margin-left: 20rpx;">
										<view class="flex_row_center_center" :style="{width:  '345rpx',height:345/2+'rpx','flex-shrink':0,'margin-bottom':'20rpx'}"
										 @click="skipTo(decoItem.data[0].url_type,decoItem.data[0].url,decoItem.data[0].info)">
											<image :src="decoItem.data[0].img" mode="aspectFit" style="width: 100%;height: 100%;"></image>
										</view>
										<view class="flex_row_center_center" :style="{width:  '345rpx',height:'345rpx','flex-shrink':0}" @click="skipTo(decoItem.data[1].url_type,decoItem.data[1].url,decoItem.data[1].info)">
											<image :src="decoItem.data[1].img" mode="aspectFit" style="width: 100%;height: 100%;"></image>
										</view>
									</view>
									<view class="combine6">
										<view class="flex_row_center_center" :style="{width:  '345rpx',height:'345rpx','flex-shrink':0,'margin-bottom':'20rpx'}"
										 @click="skipTo(decoItem.data[2].url_type,decoItem.data[2].url,decoItem.data[2].info)">
											<image :src="decoItem.data[2].img" mode="aspectFit" style="width: 100%;height: 100%;"></image>
										</view>
										<view class="flex_row_center_center" :style="{width:  '345rpx',height:345/2+'rpx','flex-shrink':0}" @click="skipTo(decoItem.data[3].url_type,decoItem.data[3].url,decoItem.data[3].info)">
											<image :src="decoItem.data[3].img" mode="aspectFit" style="width: 100%;height: 100%;"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 图片组合7-->
					<view v-if="decoItem.sele_style == 7 && decoItem.is_show == true" data-index="index" style="background-color: #fff;">
						<view class="modules-slide">
							<view class="image-ad images-tpl" style="display: flex;justify-content: flex-start;align-items: center;padding-top: 0;">
								<view :style="{'display': 'flex','flex-wrap':'wrap','width':(670/3*2+61)+'rpx',}">
									<!-- <view class="flex_row_center_center" v-for="(childitem, childindex) in decoItem.data" v-if="childindex<4" :key="childindex" 
									 @click="skipTo(childitem.url_type,childitem.url,childitem.info)" :style="{'margin-left':'20rpx',width:670/3+'rpx',height:670/3+'rpx',marginTop:'20rpx','flex-shrink':0}">
										<image mode="aspectFit" :src="childitem.img" style="width: 100%;height: 100%;"></image>
									</view> -->
									<view class="flex_row_center_center" @click="skipTo(decoItem.data[0].url_type,decoItem.data[0].url,decoItem.data[0].info)"
									 :style="{'margin-left':'20rpx',width:670/3+'rpx',height:670/3+'rpx',marginTop:'20rpx','flex-shrink':0}">
										<image mode="aspectFit" :src="decoItem.data[0].img" style="width: 100%;height: 100%;"></image>
									</view>
									<view class="flex_row_center_center" @click="skipTo(decoItem.data[2].url_type,decoItem.data[2].url,decoItem.data[2].info)"
									 :style="{'margin-left':'20rpx',width:670/3+'rpx',height:670/3+'rpx',marginTop:'20rpx','flex-shrink':0}">
										<image mode="aspectFit" :src="decoItem.data[2].img" style="width: 100%;height: 100%;"></image>
									</view>
									<view class="flex_row_center_center" @click="skipTo(decoItem.data[1].url_type,decoItem.data[1].url,decoItem.data[1].info)"
									 :style="{'margin-left':'20rpx',width:670/3+'rpx',height:670/3+'rpx',marginTop:'20rpx','flex-shrink':0}">
										<image mode="aspectFit" :src="decoItem.data[1].img" style="width: 100%;height: 100%;"></image>
									</view>
									<view class="flex_row_center_center" @click="skipTo(decoItem.data[3].url_type,decoItem.data[3].url,decoItem.data[3].info)"
									 :style="{'margin-left':'20rpx',width:670/3+'rpx',height:670/3+'rpx',marginTop:'20rpx','flex-shrink':0}">
										<image mode="aspectFit" :src="decoItem.data[3].img" style="width: 100%;height: 100%;"></image>
									</view>
								</view>
								<view class="flex_row_center_center" v-if="decoItem.data[4]" @click="skipTo(decoItem.data[4].url_type,decoItem.data[4].url,decoItem.data[4].info)"
								 :style="{'margin-top':'20rpx',width:670/3+'rpx',height: (670/3*2+20) +'rpx'}">
									<image mode="aspectFit" :src="decoItem.data[4].img" style="width: 100%;height: 100%;"></image>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 搭配 -->
				<view class="match_wrap" v-if="decoItem.type == 'dapei' && decoItem.is_show == true">
					<view class="match_top">
						<view class="match_top_title" v-if="decoItem.dapei_title">{{decoItem.dapei_title}}</view>
						<view class="match_image_wrap  flex_row_center_center">
							<image :src="decoItem.dapei_img" mode="aspectFit" class="match_image" :style="{width:'710rpx',height:710*decoItem.height/decoItem.width+'rpx'}"></image>
						</view>
						<view class="match_top_text" v-if="decoItem.dapei_desc">{{decoItem.dapei_desc}}</view>
					</view>
					<view class="match_main_wrap">
						<view class="match_main" v-if="decoItem && decoItem.data && decoItem.data.info">
							<view class="match_item" v-for="(item,index) in decoItem.data.info" :key="index" @click="skipTo('goods',item.gid)">
								<view class="match_goods_img">
									<image :src="item.goods_image" mode=""></image>
								</view>
								<view class="match_goods_name">{{item.goods_name}}</view>
								<view class="match_goods_price">
									<text class="small_price">{{$L('￥')}}</text>
									<text class="big_price">{{filters.toSplit(item.goods_price)[0]}}</text>.
									<text class="small_price">{{filters.toSplit(item.goods_price)[1]}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 辅助线 -->
				<view class="subline_wrap" v-if="decoItem.type == 'fzx' && decoItem.is_show == true" :style="{paddingTop:decoItem.lrmargin+'rpx',paddingBottom:decoItem.lrmargin+'rpx'}">
					<view class="subline" :style="{height:decoItem.tbmargin+'px',borderBottomColor:decoItem.color,borderBottomStyle:decoItem.val}"></view>
					<view :style="{height:decoItem.tbmargin+'px'}"></view>
				</view>

				<!-- 轮播图 -->
				<view class="carousel_bottom_wrap" v-if="decoItem.type == 'lunbo' && decoItem.is_show == true" style="padding:0;">
					<swiper class="carousel carousel_bottom" circular autoplay="true" :style="{width:decoItem.width+'rpx',height:decoItem.height+'rpx'}">
						<swiper-item v-for="(item, index) in decoItem.data" :key="index" class="carousel-item" style="padding:0;" @click="skipTo(item.url_type,item.url,item.info)">
							<image :src="item.img" class="carousel_img" />
						</swiper-item>
					</swiper>
				</view>

				<!-- 推荐商品样式一 --> 
				<view class="recommend_goods_wrap" v-if="decoItem.type == 'tuijianshangpin' && decoItem.show_style == 'small' && decoItem.is_show == true"
				 style="padding:0">
					<view :style="{backgroundColor:decoItem.border_style == 'border_none_grey_bg'?'f8f8f8':'#fff',paddingLeft:decoItem.page_margin*2+'rpx',paddingRight:decoItem.page_margin*2+'rpx',paddingTop:'40rpx'}"
					 class="rec_goods_wrap">
						<goods-item-v :goods_info="item" :show_sale="decoItem.isshow_sales == 1?true:false" :icon_type="decoItem.cart_icon_type"
						 :border_radius="decoItem.border_radius" :border_style="decoItem.border_style" :goods_margin="decoItem.goods_margin"
						 :page_margin="decoItem.page_margin" v-for="(item,index) in decoItem.data.info" :key="index" @click="skipTo(decoItem.type,item.gid,item.info)"></goods-item-v>
					</view>
				</view>
				<!-- 推荐商品样式二 -->
				<view class="recommend_goods_wrap" v-if="decoItem.type == 'tuijianshangpin' && decoItem.show_style == 'list' && decoItem.is_show == true"
				 :style="{paddingLeft:decoItem.page_margin*2+'rpx',paddingRight:decoItem.page_margin*2+'rpx',marginTop:0,backgroundColor:decoItem.border_style == 'border_none_grey_bg'?'f8f8f8':'#fff'}">
					<view class="rec_goods_wrap">
						<view class="recommend_goods1" v-for="(item,index) in decoItem.data.info" :key="index" :style="{width:'calc((750rpx - '+decoItem.page_margin*4+'rpx)',borderTopLeftRadius:decoItem.border_radius*2+'rpx',borderBottomLeftRadius:decoItem.border_radius*2+'rpx',border:decoItem.border_style == 'border_eee'?'1rpx solid #eee':'',boxShadow:decoItem.border_style == 'card-shadow'?'rgba(93, 113, 127, 0.08) 0px 2px 8px':'',marginBottom:decoItem.goods_margin+'px'}">
							<view class="recommend_goods_img1" @click="skipTo('goods',item.gid)">
								<image :src="item.goods_image" mode="aspectFill" :style="{width:'calc((750rpx - '+decoItem.page_margin*4+'rpx - 10rpx)/2)',borderTopLeftRadius:decoItem.border_radius*2+'rpx',borderBottomLeftRadius:decoItem.border_radius*2+'rpx'}"></image>
							</view>
							<view class="recommend_goods_right" :style="{borderTopRightRadius:decoItem.border_radius*2+'rpx',borderBottomRightRadius:decoItem.border_radius*2+'rpx'}">
								<view class="recommend_goods_name" @click="skipTo('goods',item.gid)">{{item.goods_name}}</view>
								<view :class="decoItem.isshow_sales == 1?'':'hide_sold_wrap'">
									<view class="recommend_goods_price" :style="{position:decoItem.isshow_sales == 1?'absolute':'static'}">
										<text class="small_price">{{$L('￥')}}</text>
										<text class="big_price">{{filters.toSplit(item.goods_price)[0]}}</text>.
										<text class="small_price">{{filters.toSplit(item.goods_price)[1]}}</text>
									</view>
									<view class="recommend_goods_bottom" :style="{position:decoItem.isshow_sales == 1?'absolute':'static',width:decoItem.isshow_sales == 1?'100%':'auto'}">
										<view class="have_sold" v-if="decoItem.isshow_sales == 1">{{$L('已售')}}{{item.goods_salenum}}{{$L('件')}}</view>
										<block>
											<image :src="img_url+'index/add-cart.png'" mode="" v-if="decoItem.cart_icon_type == 1" @click="addCart(item.gid)"></image>
											<image :src="icon2" mode="" v-if="decoItem.cart_icon_type == 2" @click="addCart(item.gid)"></image>
											<image :src="icon3" mode="" v-if="decoItem.cart_icon_type == 3" @click="addCart(item.gid)"></image>
											<image :src="icon4" mode="" v-if="decoItem.cart_icon_type == 4" @click="addCart(item.gid)"></image>
											<image :src="icon5" mode="" v-if="decoItem.cart_icon_type == 5" @click="addCart(item.gid)"></image>
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 推荐商品样式三 -->
				<view class="recommend_goods_wrap" v-if="decoItem.type == 'tuijianshangpin' && decoItem.show_style == 'big' && decoItem.is_show == true"
				 :style="{paddingLeft:decoItem.page_margin*2+'rpx',paddingRight:decoItem.page_margin*2+'rpx',marginTop:0,backgroundColor:decoItem.border_style == 'border_none_grey_bg'?'f8f8f8':'#fff'}">
					<view class="recommend_goods2" v-for="(item,index) in decoItem.data.info" :key="index" :style="{width:'calc(750rpx - '+decoItem.page_margin*4+'rpx)',borderRadius:decoItem.border_radius+'px',border:decoItem.border_style == 'border_eee'?'1rpx solid #eee':'',boxShadow:decoItem.border_style == 'card-shadow'?'rgba(93, 113, 127, 0.08) 0px 2px 8px':'',marginBottom:decoItem.goods_margin+'px'}">
						<view class="recommend_goods_img2" @click="skipTo('goods',item.gid)">
							<image :src="item.goods_image" mode="aspectFill" :style="{width:'calc(750rpx - '+decoItem.page_margin*4+'rpx)',borderRadius:border_radius1}"></image>
						</view>
						<view class="recommend_goods_bottom2" :style="{borderRadius:border_radius3}">
							<view class="recommend_goods_name2" @click="skipTo('goods',item.gid)">{{item.goods_name}}</view>
							<view class="goods_bottom" :style="{flexDirection:decoItem.isshow_sales == 1?'':'row',justifyContent:decoItem.isshow_sales == 1?'':'space-between',marginTop:decoItem.isshow_sales == 1?'':'20px'}">
								<view class="recommend_goods_price" style="color:#FC1C1C;">
									<text class="small_price">{{$L('￥')}}</text>
									<text class="big_price">{{filters.toSplit(item.goods_price)[0]}}</text>.
									<text class="small_price">{{filters.toSplit(item.goods_price)[1]}}</text>
								</view>
								<view class="recommond_goods3_wrap">
									<view class="have_sold" v-if="decoItem.isshow_sales == 1">{{$L('已售')}}{{item.goods_salenum}}{{$L('件')}}</view>
									<image :src="img_url+'index/add-cart.png'" mode="" v-if="decoItem.cart_icon_type == 1" @click="addCart(item.gid)"></image>
									<image :src="icon2" mode="" v-if="decoItem.cart_icon_type == 2" @click="addCart(item.gid)"></image>
									<image :src="icon3" mode="" v-if="decoItem.cart_icon_type == 3" @click="addCart(item.gid)"></image>
									<image :src="icon4" mode="" v-if="decoItem.cart_icon_type == 4" @click="addCart(item.gid)"></image>
									<image :src="icon5" mode="" v-if="decoItem.cart_icon_type == 5" @click="addCart(item.gid)"></image>
								</view>
							</view>
						</view>
					</view>
				</view>


				<!-- 辅助空白 -->
				<view class="blank_wrap" v-if="decoItem.type == 'fzkb' && decoItem.id && decoItem.is_show == true" :style="{backgroundColor:decoItem.color,height:decoItem.text+'px'}"></view>
				<!-- tab切换 -->
				<sort-list @changeGids='changeGids' :nav_list="decoItem.data" :borderRadius="decoItem.border_radius" :is_from_home="is_show_top" :isShowSale="false"
				 v-if="decoItem.type == 'more_tab' && decoItem.is_show == true"></sort-list>

				<!-- 直播 start -->
				<!-- 方案一 -->
				<view class="svideo" v-if="decoItem.type == 'live' && decoItem.is_show == true">
					<view class="svideo_title">
						<view class="svideo_title_l">{{decoItem.title}}</view>
						<view class="svideo_title_r" @click="skipTo('live_home','','')">{{$L('更多直播')}} ></view>
					</view>
					<view class="svideo_main" v-if="decoItem.show_style == 'one' && decoItem.is_show == true">
						<view class="svideo_main_block svideo_main_block_l" v-for="(item,index) in decoItem.data.info" :key="index"
						 :style="{borderRadius:decoItem.border_radius+'px'}" @click="skipTo(decoItem.type,item.live_id,item.info)">
							<image class="live_list_b_img_hua live_list_b_img_hua1" :src="img_url+'zhibo-dianzan.gif'"></image>
							<view class="svideo_main_block_lw">
								<view class="svideo_main_block_lt">
									<image class="svideo_block_t_img svideo_block_t_img2zb" :src="img_url+'zx_zhibo_gif.gif'"></image>
									<text class="svideo_block_t_text svideo_block_t_text2">{{item.click_num}}{{$L('人观看')}}</text>
								</view>
							</view>
							<image class="video_bg1" :src="item.live_image_url"></image>
							<view class="svideo_main_block_zb">{{item.live_name}}</view>
						</view>
					</view>
					<!-- 方案2 -->
					<view class="svideo_main2" v-if="decoItem.show_style == 'two' && decoItem.is_show == true">
						<scroll-view class="svideo2_wrap scroll-view" scroll-x="true" show-scrollbar="false">
							<block v-for="(item, index) in decoItem.data.info" :key="index">
								<view class="svideo_main_block2 svideo_main_block_l2" @click="skipTo(decoItem.type,item.live_id,item.info)"
								 :style="{borderRadius:decoItem.border_radius+'px'}">
									<image class="video_bg1" :src="item.live_image_url"></image>
									<image class="live_list_b_img_hua" :src="img_url+'zhibo-dianzan.gif'"></image>
									<view class="svideo_main_block_lw">
										<view class="svideo_main_block_lt">
											<image class="svideo_block_t_img svideo_block_t_img2zb" :src="img_url+'zx_zhibo_gif.gif'"></image>
											<text class="svideo_block_t_text svideo_block_t_text2">{{item.click_num}}{{$L('人观看')}}</text>
										</view>
									</view>
									<view class="svideo_main_block_b2 svideo_main_block_b2_zb">
										<text>{{item.live_name}}</text>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
				<!-- 直播 end -->

				<!-- 短视频 start -->
				<view class="svideo" v-if="decoItem.type == 'svideo' && decoItem.is_show == true">
					<view class="svideo_title">
						<view class="svideo_title_l">{{decoItem.title}}</view>
						<view class="svideo_title_r" @click="skipTo('svideo_home')">{{$L('更多视频')}} ></view>
					</view>
					<!-- 方案一 -->
					<view class="svideo_main" v-if="decoItem.show_style == 'one' && decoItem.is_show == true">
						<view class="svideo_main_block svideo_main_block_l" v-for="(item,index) in decoItem.data.info" :key="index"
						 @click="skipTo(decoItem.type,item.id,item.info)" :style="{borderRadius:decoItem.border_radius+'px'}">
							<view class="svideo_main_block_w">
								<view class="svideo_main_block_t">
									<image class="svideo_block_t_img svideo_block_t_img2s svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
									<text class="svideo_block_t_text">{{item.click_num}}{{$L('人观看')}}</text>
								</view>
							</view>
							<image class="video_bg1" :src="item.video_image"></image>
							<view class="svideo_main_block_b">{{item.video_name}}</view>
						</view>
					</view>


					<!-- 方案2 -->
					<view class="svideo_main2" v-if="decoItem.show_style == 'two' && decoItem.is_show == true">
						<scroll-view class="scroll-view svideo2_wrap" scroll-x="true" show-scrollbar="false">
							<block v-for="(item, index) in decoItem.data.info" :key="index">
								<view class="svideo_main_block2 svideo_main_block_l2" @click="skipTo(decoItem.type,item.id,item.info)"
								 :style="{borderRadius:decoItem.border_radius+'px'}">
									<image class="video_bg1" :src="item.video_image"></image>
									<view class="svideo_main_block_w">
										<view class="svideo_main_block_t">
											<image class="svideo_block_t_img svideo_block_t_img2 svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
											<text class="svideo_block_t_text">{{item.click_num}}{{$L('人观看')}}</text>
										</view>
									</view>
									<view class="svideo_main_block_b2">{{item.video_name}}</view>
								</view>
							</block>
						</scroll-view>
					</view>

					<!-- 方案3 -->
					<view class="svideo_main5" v-if="decoItem.show_style == 'three' && decoItem.is_show == true">
						<block v-for="(item, index) in decoItem.data.info" :key="index">
							<view class="svideo_main_block5 svideo_main_block50" @click="skipTo(decoItem.type,item.id,item.info)"
							 :style="{borderRadius:decoItem.border_radius+'px'}">
								<image class="video_bg3" :src="item.video_image"></image>
								<view class="svideo_bg_img"></view>
								<view class="svideo_block_bgimg0">
									<view class="svideo_block_t5_w">
										<view class="svideo_block_t5">{{item.click_num}}{{$L('人观看')}}</view>
									</view>
									<view class="svideo_block_bgimg1_wrap">
										<view class="svideo_block_bgimg1">
											<image class="video_bg" :src="item.video_image"></image>
											<image class="svideo_block_bgimg3 svideo_block_t_img0 svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
										</view>
									</view>
								</view>
								<view class="svideo5_b">
									<view class="svideo5_b_title">{{item.video_name}}</view>
									<view class="svideo5_b_text">{{item.introdution}}</view>
								</view>
							</view>
						</block>
					</view>


					<!-- 方案4 -->
					<view class="svideo_main3" v-if="decoItem.show_style == 'four' && decoItem.is_show == true" style="padding-bottom:30rpx;">
						<swiper class="swiper-block" :current="1" :circular="true" :autoplay="true" @change="swiperChange2"
						 previous-margin="120rpx" next-margin="120rpx">
							<block v-for="(item, index) in decoItem.data.info" :key="index" :index="index">
								<swiper-item :style="{left:((71+index*63)+'rpx')}" :class="swiperIndex1 == index  ? 'swiper-item1' : 'swiper-item'">
									<view class="optionBox" style="text-align:center" @click="skipTo(decoItem.type,item.id,item)">
										<image mode="aspectFill" :src="item.video_image" :class="swiperIndex1 == index  ? 'active1' : 'active2'"
										 :style="{height:'345rpx',borderRadius:decoItem.border_radius+'px'}"></image>
										<view class="svideo_main_block_sw">
											<view class="">
												<image class="svideo_block_t_img svideo_person_num" :src="img_url+'play_video.png'"></image>
											</view>
										</view>
										<view class="svideo_main_block_b3_w">
											<view class="svideo_main_block_b3">{{item.click_num}}{{$L('人观看')}}</view>
										</view>
									</view>
								</swiper-item>
							</block>
						</swiper>
					</view>
					<!-- 方案5 -->
					<view class="svideo_main4" v-if="decoItem.show_style == 'five' && decoItem.is_show == true">
						<scroll-view class="scroll-view svideo4_wrap" scroll-x="true" show-scrollbar="false">
							<block v-for="(item, index) in decoItem.data.info" :key="index">
								<view class="svideo_main_block4" @click="skipTo(decoItem.type,item.id,item.info)" :style="{borderRadius:decoItem.border_radius+'px'}">
									<image class="video_bg" :src="item.video_image" :style="{borderRadius:decoItem.border_radius+'px'}"></image>
									<view class="svideo_main_block_w svideo_main_block_t svideo_main_block_t0">
										<image class="svideo_block_t_img svideo_block_t_img24 svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
										<text class="svideo_block_t_text4">{{item.click_num}}{{$L('人观看')}}</text>
									</view>
									<view class="svideo_main_block_b4 svideo_main_block_b40" :style="{borderRadius:[0,0,decoItem.border_radius+'px',decoItem.border_radius+'px']}">
										<image class="video_bg" :style="{borderRadius:[0,0,decoItem.border_radius+'px',decoItem.border_radius+'px']}"
										 :src="img_url+'/zx_v_bg'+(index+1)+'.png'"></image>
										<view class="svideo_main_block_b4_text">{{item.video_name}}</view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
				<!-- 短视频 end -->

				<!-- 活动1/限时折扣 -->
				<view class="active_wrap" v-if="decoItem.type == 'activity' && decoItem.show_style == 'discount' && decoItem.is_show == true">
					<view class="active_wrap_top">
						<image class="active_logo" :src="img_url+'zx_limit_active.png'"></image>
						<view class="active_wrap_bili">{{decoItem.title}}</view>
						<view class="active_more" @click="skipTo('discount_home')">MORE ></view>
					</view>
					<view class="active_wrap_bili_d">{{decoItem.sub_title}}</view>
					<view class="active_block_wrap svideo_main5">
						<scroll-view class="tab_nav_scroll" scroll-x="true" v-if="decoItem && decoItem.data && decoItem.data.info && decoItem.data.info.length > 0"
						 show-scrollbar="false">
							<block v-for="(item, index) in decoItem.data.info" :key="index">
								<view class="active_limit_block svideo_main_block5" @click="skipTo('goods',item.gid,item.info,item.info)">
									<view class="active_imgage1" :style="{borderRadius:decoItem.border_radius+'px'}">
										<image :src="item.goods_image" class="active_imgage1_img"></image>
										<view class="active_top_tip_w">
											<view class="active_top_tip" :style="{background:decoItem.tag_bg_color}">{{$L('限时抢购')}}</view>
										</view>
									</view>
									<view class="active_img_bottom1">{{item.goods_name}}</view>
									<view class="active_img_bottom2_w">
										<view class="active_img_bottom2_p">
											<text>{{$L('￥')}}</text>
											<text>{{filters.toSplit(item.activity_price)[0]}}</text>.
											<text>{{filters.toSplit(item.activity_price)[1]}}</text>
										</view>
									</view>
									<view class="active_panic_buy">
										<view class="active_panic_text">{{$L('抢购')}}</view>
										<view v-if="countDownData[decoIndex+'_'+index]!=undefined&&countDownData[decoIndex+'_'+index]" class="active_panic_time">{{countDownData[decoIndex+'_'+index]}}</view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>

				<!-- 活动2/优享团购 -->
				<view class="active_wrap" v-if="decoItem.type == 'activity' && decoItem.show_style == 'group_buy' && decoItem.is_show == true"
				 :style="{borderRadius:decoItem.border_radius+'px'}">
					<view class="active_wrap_top">
						<image class="active_logo" :src="img_url+'zx_yxtg.png'"></image>
						<view class="active_more" @click="skipTo('group_home')">MORE ></view>
					</view>
					<view class="active_wrap_bili2">{{decoItem.title}}</view>
					<view class="active_wrap_bili_d">{{decoItem.sub_title}}</view>
					<view class="active_block_wrap2 svideo_main5" style="padding:0 20rpx;">
						<block v-for="(item, index) in decoItem.data.info" :key="index">
							<view class="active_limit_block2 svideo_main_block5" @click="skipTo('goods',item.gid,item.info)">
								<view class="active_imgage2">
									<image :src="item.goods_image" class="active_imgage2_img" mode="aspectFill"></image>
									<view class="active_top_tip_w2 active_top_tip_w22">
										<view class="active_top_tip2" :style="{background:decoItem.tag_bg_color}">{{$L('优享团购')}}</view>
									</view>
								</view>
								<view class="active_panic_buy2">
									<view class="active_tuan_num">{{$L('已团')}}{{$groupNum(item.buyer_count)}}{{$L('件')}}</view>
									<view class="active_panic_text2">{{$L('距结束')}}</view>
									<view v-if="countDownData[decoIndex+'_'+index]!=undefined&&countDownData[decoIndex+'_'+index]" class="active_panic_time2">{{countDownData[decoIndex+'_'+index]}}</view>
								</view>
								<view class="active_img_bottom2">{{item.goods_name}}</view>
								<view class="active_img_bottom2_w" style="padding:0;">
									<view class="active_img_bottom2_p">
										<text>{{$L('￥')}}</text>
										<text>{{filters.toSplit(item.activity_price)[0]}}</text>.
										<text>{{filters.toSplit(item.activity_price)[1]}}</text>
									</view>
									<view class="active_now_tuan">{{$L('立即团')}}</view>
								</view>
							</view>
						</block>
					</view>
				</view>

				<!-- /* ------------活动3/拼团特惠---- */ -->
				<view class="active_wrap" v-if="decoItem.type == 'activity' && decoItem.show_style == 'pin' && decoItem.is_show == true"
				 :style="{borderRadius:decoItem.border_radius+'px'}">
					<view class="active_wrap_top">
						<image class="active_logo" :src="img_url+'zx_ptth.png'"></image>
						<view class="active_wrap_bili">{{decoItem.title}}</view>
						<view class="active_more" @click="skipTo('pin_home')">MORE ></view>
					</view>
					<view class="active_block_wrap svideo_main5">
						<scroll-view class="tab_nav_scroll" scroll-x="true" show-scrollbar="false">
							<block v-for="(item, index) in decoItem.data.info" :key="index">
								<view class="active_limit_block svideo_main_block5" @click="skipTo('goods',item.gid,item.info)">
									<view class="active_imgage1">
										<image :src="item.goods_image" class="active_imgage1_img"></image>
										<view class="active_top_tip_w2 active_top_tip_w21">
											<view v-if="countDownData[decoIndex+'_'+index]!=undefined&&countDownData[decoIndex+'_'+index]" class="active_top_tip2 active_top_tip20" :style="{background:decoItem.tag_bg_color}">{{countDownData[decoIndex+'_'+index]}}</view>
										</view>
									</view>
									<view class="active_img_bottom1">{{item.goods_name}}</view>
									<view class="active_img_bottom2_w">
										<view class="active_img_bottom2_p">
											<text>{{$L('￥')}}</text>
											<text>{{filters.toSplit(item.activity_price)[0]}}</text>.
											<text>{{filters.toSplit(item.activity_price)[1]}}</text>
										</view>
									</view>
									<view class="active_panic_buy active_panic_buy3">
										<view class="active_panic_time3">
											<image class="active_panic_time_img" :src="img_url+'zx_drt.png'"></image>
											<view>{{item.team_count}}{{$L('人团')}}</view>
										</view>
										<view class="active_panic_text3">{{$L('去开团')}}</view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>

		<!-- 顶部分类切换 -->
		<view class="sort_sub_wrap" v-if="tab_index != 0 && gcseclist.length>0">
			<view class="sort_sub_top">
				<view class="sort_sub_item" v-for="(item,index) in gcseclist" :key="index" @click="goGoodsList(item.gc_id)">
					<view class="sort_sub_img">
						<image :src="item.pic" mode=""></image>
					</view>
					<view class="sort_sub_name">{{item.gc_name}}</view>
				</view>
				<view class="see_more_wrap" @click="toAllSort" v-if="gcseclist.length>7">
					<view class="more_icon_circle">
						<image :src="img_url+'index/more.png'" mode="" class="more_icon"></image>
					</view>
					<view class="see_more_text">{{$L('查看更多')}}</view>
				</view>
			</view>
			<view class="sort_sub_goods">
				<goods-item-v :goods_info="item" :show_sale="false" :icon_type="1" :border_radius="8" v-for="(item,index) in sort_list"
				 :key="index"></goods-item-v>
			</view>
		</view>

		<!-- 分类空页面 -->
		<view class="empty_sort_page" v-if="tab_index > 0 && is_show_empty == true" style="padding-top: 35vh;">
			<image :src="img_url+'index/empty.png'" mode="aspectFit" class="empty_img"></image>
			<view class="empty_text" v-if="is_show_empty">{{$L('该分类暂无相关商品')}}</view>
		</view>

		<!-- 空首页装修 -->
		<view class="empty_sort_page" v-if="city == $L('全国') && deco_info == null" style="padding-top: 35vh;">
			<image :src="img_url+'index/empty.png'" mode="aspectFit" class="empty_img"></image>
			<view class="empty_text">{{$L('首页暂未装修')}}</view>
		</view>
		<!-- 专题空页面 -->
		<view class="empty_sort_page" v-if="is_show_top == false && deco_info.length == 0" style="padding-top: 35vh;">
			<image :src="img_url+'index/empty.png'" mode="aspectFit" class="empty_img"></image>
			<view class="empty_text">{{$L('专题页暂未装修')}}</view>
		</view>
		<!-- 分站空页面 -->
		<view class="empty_sort_page" v-if="city != $L('全国') && tab_index == 0 && deco_info == null" style="padding-top: 35vh;">
			<image :src="img_url+'index/empty.png'" mode="aspectFit" class="empty_img"></image>
			<view class="empty_text">{{$L('我们正在努力装修中～')}}</view>
		</view>
		<!-- 分类空商品 -->
		<view class="empty_sort_page" v-if="tab_index > 0 && is_show_empty_goods == true" style="padding-top: 260rpx;">
			<image :src="img_url+'index/empty.png'" mode="aspectFit" class="empty_img"></image>
			<view class="empty_text">{{$L('该分类暂无相关商品')}}</view>
		</view>
	</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
	import tabMenu from '@/components/index-tab-menu.vue'
	import sortList from '@/components/index-sort-list.vue'
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
	import marquee from '@/components/marquee.vue'
	import {
		decoType,
		linkTo,
		countDown,
		getSceneParam
	} from '@/utils/common.js'
	import goodsItemV from '@/components/goods_item_v.vue'
	
	
	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				goodsList: [],
				current: 0, //轮播图指示点
				dotsStyles: { //指示点样式设置
					selectedBackgroundColor: '#fff',
					backgroundColor: 'rgba(255,255,255,0.4)',
					border: 'none',
					selectedBorder: 'none'
				},
				noticeImg1: getApp().globalData.img_url + 'index/notice1.png',
				noticeImg2: getApp().globalData.img_url + 'index/notice2.png',
				// deco_info:[] ,//首页装修数据
				dataObj: {}, //完整版首页装修数据
				border_radius: '', //顶部轮播背景圆角
				broadcastData1: [], //公告1滚动文字
				broadcastData2: [], //公告2滚动文字
				broadcastStyle1: { //滚动文字样式设置
					speed: 1, //每秒30px  
					font_size: "24", //字体大小(rpx)
					text_color: "#666", //字体颜色
					back_color: "linear-gradient(to right,rgba(250,244,244,0.2) 0%, rgba(255,244,244,1) 50%, rgba(250,244,244,0.2) 100%);", //背景色
				},
				broadcastStyle2: { //滚动文字样式设置
					speed: 1, //每秒30px  
					font_size: "24", //字体大小(rpx) 
					text_color: "#fff", //字体颜色
					back_color: "#3A3A3A", //背景色
				},
				telImg: getApp().globalData.img_url + 'index/mobile.png',
				sort_nav_list: [], //顶部分类列表 
				sort_obj: {}, //二级分类列表+分类商品列表 
				sort_list: [],
				gcseclist: [],
				tab_index: 0, //分类切换下标
				is_show_index: true,
				adArr: [], //公告数组 
				icon2: getApp().globalData.img_url + 'index/add2.png',
				icon3: getApp().globalData.img_url + 'index/add.png',
				icon4: getApp().globalData.img_url + 'index/add3.png',
				icon5: getApp().globalData.img_url + 'index/stop.png',
				client: '', //客户端类型
				isShowTab: true, //是否显示顶部分类
				sortLen: '', //二级分类长度
				isShow: true,
				client: '', //客户端类型
				huodong_0: {
					hours: '00',
					minutes: '00',
					seconds: '00'
				},
				huodong_1: [{
					hours: '00',
					minutes: '00',
					seconds: '00'
				}, {
					hours: '00',
					minutes: '00',
					seconds: '00'
				}, {
					hours: '00',
					minutes: '00',
					seconds: '00'
				}],
				huodong_2: {
					hours: '00',
					minutes: '00',
					seconds: '00'
				},
				swiperIndex: 0,
				swiperIndex1: 1,
				navRecomIndex: 0,
				is_show_empty: false, //是否展示分类空页面
				is_show_empty_goods: false, //是否展示分类空商品页面 
				is_show_empty_deco: false, //是否展示装修空页面
				top_bg: 'linear-gradient(90deg, #FC1D1C 0%, #FF7A18 100%)', //顶部状态栏颜色
				pure_bg_color: '', //顶部栏有弧度纯色
				border_radius1: '', //推荐商品二角度设置
				border_radius2: '', //推荐商品三角度设置
				border_radius3: '',
				is_show_another: false,
				stat_end: 1, //终端，默认为1，pc端
				isIos: uni.getSystemInfoSync().platform == 'ios', //是否ios手机
				discount_time: '', //限时折扣倒计时
				countDownData:{},//装修数据里面所有倒计时
			};
		},
		components: {
			tabMenu,
			sortList,
			uniSwiperDot,
			marquee,
			goodsItemV
		},
		props: ['deco_info', 'city','city_site_open' ,'is_show_top', 'topic_name', 'home_is_show_top_cat'],
		onShow: function() {
			console.log(deco_info);
		},
		watch: {
			deco_info(val) {
				val && val.map((item,index) => {
					if(item.type == 'top_cat_nav'&&item.data&&item.data.length>0){
						if(item.swiper_bg_style==1){
							this.titleNViewBackground =  'linear-gradient(' + item.data[0].bg_color + ' 0%,' + item.data[0].bg_color +
								'42%,' + item.data[0].bg_color + ' 100%)';
						}else{
							this.titleNViewBackground =  'linear-gradient(' + item.data[0].bg_color + ' 0%,' + item.data[0].bg_color +
								'42%,#ffffff 100%)';
						}
						this.pure_bg_color = item.data[0].bg_color;
					}else if (item.type == 'tuijianshangpin' && item.show_style == "big") {
						this.border_radius1 = item.border_radius + 'px' + ' ' + item.border_radius + 'px' + ' 0 0'
						this.border_radius3 = '0 0 ' + item.border_radius + 'px' + ' ' + item.border_radius + 'px'
					} else if (item.type == 'tuijianshangpin' && item.show_style == "list") {
						this.border_radius2 = item.border_radius + 'px' + ' 0 0 ' + item.border_radius + 'px'
					}
					//促销活动——拼团、团购倒计时数据
					if(item.type == 'activity'&&(item.show_style == 'pin'||item.show_style == 'group_buy'||item.show_style == 'discount')&&item.is_show == true){
						item.data.info.map((item_child,child_index)=>{
							this.countDown(item_child.end_time,index+'_'+child_index)
						})
					}
				})
			}
		},
		async mounted() {
			// this.loadData();
			this.getSortList();
			this.getPlatform();
			console.log(this.deco_info);
			if (this.deco_info != null && this.deco_info != undefined && this.deco_info && this.is_show_top == true) {
				let cur = this.deco_info.filter(item => item.type == 'fuwenben');
				if (cur && cur.length > 0) {
					cur.map(item => {
						item.text = this.formatRichText(item.text)
					})
				}
			}

			// let is_empty_deco = this.deco_info.length
			// if (this.city == '全国' && is_empty_deco < 1 || this.deco_info == null || this.deco_info == undefined) {
			// 	this.is_show_empty_deco = true
			// } else {
			// 	this.is_show_empty_deco = false
			// }
			this.deco_info && this.deco_info.map(item => {
				if (item.type == 'tuijianshangpin' && item.show_style == "big") {
					this.border_radius1 = item.border_radius + 'px' + ' ' + item.border_radius + 'px' + ' 0 0'
				} else if (item.type == 'tuijianshangpin' && item.show_style == "list") {
					this.border_radius2 = item.border_radius + 'px' + ' 0 0 ' + item.border_radius + 'px'
				}
			})
		},
		methods: {
			changeGids(ids){
				this.$emit('changeGids',ids)
			},
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
			// 返回上一页
			toBack() {
				uni.navigateBack()
			},
			// 扫描二维码
			scanCode() {
				uni.scanCode({
					success: function(res) {
						let gid = getSceneParam(res.result, 'gid')
						if (gid) {
							uni.navigateTo({
								url: '/pages/goods_detail/goods_detail?gid=' + gid
							})
						}
					}
				});
			},
			toMessage() {
				if (!uni.getStorageSync('token')) {
					uni.showToast({
						title: this.$L('请登录'),
						icon: 'none'
					});
					return
				}
				uni.navigateTo({
					url: '/pages/msg/msg?u=cwap_user_msg_xcx.html'
				})
			},
			returnHome() {
				if (this.home_is_show_top_cat == true) {
					this.$refs.menuTab.currIndex = 0
				}
			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				// #ifdef H5
				this.client = 'h5'
				// #endif

				// #ifdef APP-PLUS
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						this.client = 'android'
						break;
					case 'ios':
						this.client = 'ios'
						break;
					default:
						console.log('运行在开发者工具上')
						break;
				}
				// #endif

				// #ifdef MP
				this.client = 'weixin_xcx'
				// #endif
				let param = {}
				param.url = getApp().globalData.ser_url + '/index.php?app=index&mod=index_new&client_type=' + this.client
				param.method = 'GET'
				uni.request(param).then(res => {
					let result = res[1].data
					if (result.code == 200) {
						this.deco_info = result.datas.tmp_data;
						this.dataObj = decoType(this.deco_info);
						if (this.dataObj.more_tab) {
							this.border_radius = '0 0' + ' ' + this.dataObj.more_tab.border_radius + 'px ' + this.dataObj.more_tab.border_radius +
								'px'
						}
						if (this.dataObj.gonggao1) {
							this.broadcastData1.push(this.dataObj.gonggao1.text)
						}
						if (this.dataObj.gonggao2) {
							this.broadcastData2.push(this.dataObj.gonggao2.text)
						}
						if (!this.dataObj.top_cat_nav) {
							this.isShowTab = false
						} else {
							this.isShowTab = true
						}
					}
				})
			},
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
				return newContent;
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.deco_info && this.deco_info.map(item => {
					if (item.type == 'top_cat_nav') {
						this.pure_bg_color = item.data[index].bg_color
						this.titleNViewBackground = 'linear-gradient(' + item.data[index].bg_color + ' 0%,' + item.data[index].bg_color +
							'42%,#ffffff 100%)'
					}
				})
			},
			// 短视频轮播
			swiperChange2(e) {
				this.swiperIndex1 = e.detail.current
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.title
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			// 获取分类列表
			getSortList() {
				let site_id = uni.getStorageSync('city_site_site_id');
				let param = {}
				param.url = getApp().globalData.ser_url + '/index.php?app=goods_cat&mod=get_root_class_xcx&sld_city_site_id=' +
					site_id
				param.method = 'GET'
				uni.request(param).then(res => {
					let tmpRes = res.filter(item => {
						return item
					})
					let result = tmpRes[0]
					if (result.data.state == 200) {
						this.sort_nav_list = result.data.class_list
						this.sort_nav_list.unshift({
							gc_name: this.$L('首页')
						})
					}
				})
			},
			// 获取二级分类及分类商品列表 
			getChildList(list, index) {
				if (this.tab_index != index) {
					// 切换tab回到顶部
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 0
					})
					this.sort_list = [];
				}
				this.tab_index = index
				if (index > 0) {
					this.sort_obj = list
					if ((this.sort_obj.gc_sec_list != undefined && this.sort_obj.gc_sec_list.length > 0) || this.gcseclist.length > 0) {
						this.gcseclist = this.sort_obj.gc_sec_list != undefined ? this.sort_obj.gc_sec_list : this.gcseclist;
						this.sortLen = this.gcseclist.length;
						this.is_show_empty = false
					} else {
						this.is_show_empty = true
					}
					if (this.sortLen > 9) {
						this.gcseclist = this.gcseclist.slice(0, 9)
					}
					this.is_show_index = false
					if (this.sort_list.length == 0) {
						this.sort_list = this.sort_obj.list
					} else {
						this.sort_list = this.sort_list.concat(this.sort_obj.list);
					}
					if (this.sort_obj.list.length > 0) {
						this.is_show_empty_goods = false
					} else {
						this.is_show_empty_goods = true
					}
				} else {
					this.is_show_index = true
				}
				this.isShow = false
				this.isShow = true
			},
			// 拨打客服电话
			callUp(tel) {
				uni.makePhoneCall({
					phoneNumber: tel.toString()
				})
			},
			toSearchPage() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			// 相关跳转
			skipTo(type, url, info) {
				linkTo(type, url, info)
			},
			// 跳转消息列表页
			toMsg() {
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			},
			// 选择分站城市
			chooseCity() {
				uni.navigateTo({
					url: '/pages/city/city'
				});
			},
			// 跳转全部分类页 
			toAllSort() {
				uni.switchTab({
					url: '/pages/categroy/categroy',
				})
			},
			// 倒计时
			countDown(time,index) {
				if (this['timer_'+index]) {
					clearTimeout(this['timer_'+index])
				}
				let now_date = new Date()
				let date = now_date.getTime()
				let last_time = time * 1000 - date
			
				var d = Math.floor(last_time / 1000 / 60 / 60 / 24);
				var h = Math.floor(last_time / 1000 / 60 / 60 % 24);
				var m = Math.floor(last_time / 1000 / 60 % 60);
				var s = Math.floor(last_time / 1000 % 60);
				if (last_time > 0) {
					h = h > 9 ? h : '0' + h;
					m = m > 9 ? m : '0' + m;
					s = s > 9 ? s : '0' + s;
					this.last_time--
					this['timer_'+index] = setTimeout(()=>this.countDown(time,index), 1000)
					this.countDownData[index] = h + ':' + m + ':' + s;
				} else {
					this.countDownData[index] = '';
				}
				this.countDownData = JSON.parse(JSON.stringify(this.countDownData))
			},
			
			activityTime(time) {
				let _this = this
				setTimeout(() => {
					_this.countDown(time)
				}, 1000)
			},
			// 加入购物车 
			addCart(gid) {
				let uuid = uni.getStorageSync('uuid');
				let key = uni.getStorageSync('token');
				if (key) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						data: {
							key: key,
							gid: gid,
							quantity: 1,
							stat_end: this.stat_end
						},
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							if (res.data.datas.status == true) {
								uni.showToast({
									title: this.$L('加入购物车成功'),
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none'
								})
							}
						}
					})
				} else {
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
							stat_end: this.stat_end

						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								uni.showToast({
									title: this.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								}); //一键回到页面顶部

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
				}
			},
			//关闭广告屏 
			close_openScreen() {
				this.isCookie = false;
			},
			//点击广告屏跳转到详情页面
			gotoGoods_detail() {
				let osValue = this.home_page_img[0];
				this.$diyNavTo(osValue);
			},
			// 首页 
			//去商品列表页面
			goGoodsList(gc_id) {
				uni.navigateTo({
					url: '/pages/goods_list/goods_list?gc_id=' + gc_id
				})
			},
			// 去秒杀活动页面
			toSeckillPage() {
				uni.navigateTo({
					url: '/addons/pages/seckill/seckill'
				})
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: `/pages/search/search`
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg(this.$L('点击了扫描'));
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
	}
</script>

<style lang="scss"> 
	page {
		width: 100%;
		height: 100%;
		background-color: #F5F5F5;
		justify-content: center;
		display: flex;
	}

	.deco_wrap_no_top_cat {
		width: 750rpx;
	}

	/* #ifdef MP */
	.deco_wrap {
		margin-top: 62rpx !important;
	}

	.deco_wrap2 {
		margin-top: 108rpx;
	}

	/* #endif */

	.container {
		padding-top: 160rpx;
		// padding-bottom: 120rpx;
		overflow-x: hidden;
		background-color: #F5F5F5;
	}


	/* #ifdef APP-PLUS */
	.container {
		width: 750rpx;
		padding-bottom: 0rpx;
	}
	/* #endif */
	
	/* #ifdef H5 */
	.container1 {
		padding-top: 108rpx !important;
	}
	/* #endif */
	
	/* #ifdef APP-PLUS */
	.container1 {
		padding-top: 108rpx !important; 
	}
	/* #endif */


	/* #ifdef MP */
	.container {
		padding-top: 68rpx;
		padding-bottom: 0;
		overflow-x: hidden;
		background-color: #F5F5F5;
	}

	/* #endif */
	.mp-search-box {
		position: fixed;
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		z-index: 9999;
		width: 750rpx;
		height: 108rpx;
		padding: 0 23rpx 0 20rpx;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		background: #fff;

		.ser-input {
			flex: 1;
			height: 65upx;
			line-height: 56upx;
			text-align: left;
			font-size: 28upx;
			color: #949494;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
			padding-left: 58rpx;
			box-sizing: border-box;
			background-color: #fff;
		}
	}
	.avatar-container{
		width: 100%;
		.avatar{
			width: auto;
			height: 18px;
			aspect-ratio:390/44;
		}
	}

	page {

		.topic_top {
			padding-top: 0 !important;
		}


		.cate-section {
			position: relative;
			z-index: 5;
			//border-radius: 16upx 16upx 0 0;
			overflow-x: hidden;
		}

		.carousel-section {
			box-sizing: border-box;
			background-color: #FFFFFF;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	.search_img {
		width: 50rpx;
		height: 50rpx;
		padding: 15rpx;
	}



	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 88rpx;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 200upx;
			transition: .4s;
			border-radius: 0 0 30rpx 30rpx;
		}
	}

	.carousel {
		width: 100%;
		height: 280upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			// padding: 0 28upx !important;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: start;
		gap:10rpx;
		//flex-wrap: wrap;
		padding: 40rpx 0;
		background: #fff;

		.cate-item {
			flex:1;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26upx;
			color: #666666;

			text{
				text-align: center;
			}
		}

		.cate-item2 {
			display: flex;
			align-items: center;
			font-size: 26upx;
			color: #666666;
		}

		.cate_name {
			width: 78rpx;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 120upx;
			height: 120upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			border: 1px solid #ccc;
			padding: 20upx;
			box-sizing: border-box;
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.notice_box {
		margin: 20rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 14rpx;

		// margin-bottom:20rpx;
		.notice_wrap1 {
			width: 100%;
			height: 80rpx;
			margin-top: 20rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			border-radius: 14rpx;

			// border-radius: 6px;
			.notice_img1 {
				width: 127rpx;
				height: 80rpx;
				border-radius: 6px 0 0 6px;
			}

			.notice_content_wrap {
				font-size: 28rpx;
				font-weight: 600;
				width: 530rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				margin-left: -16rpx;

				.notice_content_title {
					color: #E1261C;
				}

				.notice_content {
					color: #666666;
				}
			}

			.notice_wrap1_line {
				width: 1rpx;
				height: 34rpx;
				background-color: rgba(0, 0, 0, 0.1);
				margin-left: 6rpx;
			}

			.notice_more {
				width: 80rpx;
				text-align: center;
				font-size: 29rpx;
				color: #2E2E2E;
				font-weight: 600;
			}
		}

		.notice_wrap2 {
			width: 100%;
			height: 80rpx;
			// margin-bottom: 20rpx;
			background-color: #3A3A3A;
			display: flex;
			align-items: center;
			box-shadow: 1px 6px 19px 1px rgba(86, 86, 86, 0.1);

			// border-radius: 6px;
			.notice_img2 {
				width: 138rpx;
				height: 80rpx;
				border-radius: 6px 0 0 6px;
			}

			.notice_content_wrap2 {
				font-size: 26rpx;
				font-weight: 600;
				width: 510rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				color: #fff;
				margin-left: 5rpx;
			}

			.notice_wrap2_line {
				width: 1rpx;
				height: 38rpx;
				background-color: #fff;
				margin-left: 2rpx;
			}

			.notice_more {
				width: 80rpx;
				text-align: center;
				font-size: 26rpx;
				color: #fff;
				font-weight: 600;
			}
		}
	}

	.service_wrap {
		// width: 100%;
		padding: 20rpx;
		font-size: 26rpx;
		color: #333;
		background-color: #fff;
		display: flex;
		align-items: center;
		margin: 20rpx 20rpx 0 20rpx;
		border-radius: 14rpx;

		image {
			width: 30rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}
	}

	.rich_text_wrap {
		font-size: 28rpx;
		background: #fff;
		padding: 30rpx 30rpx 0;
		box-sizing: border-box;
		margin-top: 20rpx;
		white-space: pre-line;
	}
	.ql-size-large{
		font-size: 18px;
	}

	.match_wrap {
		width: 100%;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		background-color: #FFFFFF;

		.match_top {
			display: flex;
			flex-direction: column;
			background-color: #fff;

			image {
				width: 100%;
			}

			.match_image_wrap {
				width: 100%;
				display: flex;
				justify-content: center;

				.match_image {
					margin: 0 auto;
				}
			}

			.match_top_title {
				text-align: center;
				padding-bottom: 20rpx;
				font-size: 32rpx;
				color: #333;
			}

			.match_top_text {
				padding: 20rpx 20rpx 0rpx;
				font-size: 28rpx;
				color: #333;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}

		.match_main_wrap {
			margin-top: 16rpx;
			background-color: #fff;
		}

		.match_main {
			display: flex;
			justify-content: space-between;
			overflow-x: scroll;
			box-sizing: border-box;
			margin: 0 20rpx;

			.match_item {
				width: 222rpx;
				height: 370rpx;
				margin-right: 20rpx;
				background-color: #fff;
				border-radius: 15rpx;
				position: relative;

				.match_goods_img {
					width: 222rpx;
					height: 222rpx;
					background-color: #ccc;
					border-radius: 15rpx 15rpx 0 0;

					image {
						width: 222rpx;
						height: 222rpx;
						border-radius: 10rpx 10rpx 0 0;
					}
				}

				.match_goods_name {
					font-size: 28rpx;
					color: #333;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					box-sizing: border-box;
					padding: 10rpx 0rpx 0 0rpx;
				}

				.match_goods_price {
					font-size: 28rpx;
					color: rgb(255, 43, 32);
					font-weight: 600;
					position: absolute;
					bottom: 12rpx;
					// left: 20rpx;
				}
			}
		}
	}

	.subline_wrap {
		padding: 30rpx 0;
		background-color: #fff;
		// margin: 20rpx 20rpx 0 20rpx;

		.subline {
			width: 100%;
			border-bottom: 1px dotted #fff;
		}
	}

	.carousel_bottom_wrap {
		padding-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		margin-top: 20rpx;

		.carousel_bottom {
			width: 100%;
			height: 340rpx;
			margin-bottom: 20rpx;
			padding-top: 20rpx;
		}
	}

	.recommend_goods_wrap {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 20rpx;
	}

	.carousel_img {
		// height:340rpx !important;
	}

	.blank_wrap {
		// margin: 0 20rpx;
		// margin-top: 20rpx;
	}

	.nav_wrap {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.sort_sub_wrap {
		width: 750rpx;
		background: #F5F5F5;

		.sort_sub_top {
			margin: 21rpx 21rpx 0 21rpx;
			display: flex;
			border-radius: 10rpx;
			background-color: #fff;
			padding: 0 20rpx 20rpx 20rpx;
			flex-wrap: wrap;

			.sort_sub_item {
				display: flex;
				flex-direction: column;
				margin-right: 35rpx;
				justify-content: center;
				align-items: center;
				margin-top: 20rpx;

				.sort_sub_img {
					width: 106rpx;
					height: 106rpx;
					border-radius: 50%;
					margin-bottom: 20rpx;

					image {
						width: 106rpx;
						height: 106rpx;
						border-radius: 50%;
					}
				}

				.sort_sub_name {
					font-size: 24rpx;
					color: #333;
					font-weight: 600;
					width: 96rpx;
					overflow: hidden;
					// text-overflow: ellipsis;
					white-space: nowrap;
					text-align: center;
				}
			}
		}

		.sort_sub_top>view:nth-child(5n) {
			margin-right: 0 !important;
		}

		.sort_sub_goods {
			width: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: 20rpx;
		}

		.sort_sub_goods>view:nth-child(2n) {
			margin-right: 0 !important;
		}
	}

	// 图片组合样式
	.goods {
		border: none;
		background: #fff;
		margin-top: 0;
	}

	.index_block {
		width: 750rpx;
		clear: both;
		overflow: hidden;
		background: #fff;
		display: block;
	}

	.goods .content {
		background: #f0f2f5;
		clear: both;
		overflow: hidden;
		display: block;
	}

	.goods .goods-small.goods-item:nth-child(2n+1) {
		padding-right: 8rpx;
	}

	.goods-small.goods-item {
		overflow: hidden;
		float: left;
		width: 50%;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	.goods-item navigator {
		display: block;
		background: #fff;
	}

	.goods-item-pic {
		vertical-align: middle;
		line-height: 0;
		display: table-cell;
		text-align: center;
		width: calc(50vw - 30rpx);
		height: calc(50vw - 30rpx);
	}

	.goods-item-pic image {
		width: calc(50vw - 30rpx);
		height: calc(50vw - 30rpx);
	}

	.goods-small .goods-item-name {
		height: 66rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		color: #232326;
		margin-top: 10rpx;
		line-height: 33rpx;
		margin-bottom: 6rpx;
		padding: 0 8rpx;
	}

	.goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.goods-item-price .yens {
		font-size: 26rpx;
	}

	.goods-item-price .bigprice {
		font-size: 32rpx;
		font-weight: bold;
		display: inline-block;
	}

	.goods-big.goods-item {
		overflow: hidden;
		float: left;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		padding: 16rpx 16rpx 0;
	}

	.goods-item-name {
		height: 66rpx;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		color: #232326;
		margin-top: 10rpx;
		line-height: 34rpx;
		margin-bottom: 6rpx;
		padding: 0 8rpx;
	}

	.goods-big .goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.goods-big .goods-item-pic image {
		width: 734rpx;
		height: 734rpx;
		padding: 0 8rpx;
	}

	.hide_title .goods-item .goods-item-name {
		display: none !important;
	}

	.hide_price .goods-item .goods-item-price {
		display: none !important;
	}

	.goods-list.goods-item .goods-item-pic {
		float: left;
		width: 214rpx !important;
		height: 214rpx !important;
	}

	.goods-list.goods-item {
		overflow: hidden;
		float: left;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background: #fff;
		margin-bottom: 16rpx;
	}

	.goods-list.goods-item .goods-item-pic image {
		width: 214rpx !important;
		height: 214rpx !important;
	}

	.goods-list .goods-item-name {
		padding-top: 40rpx;
	}

	.goods .new-content .goods-item.goods-list .goods-item-name {
		padding-top: 10rpx;
	}



	/*图片组合样式  */

	.modules-slide {
		display: block;
	}

	.modules-slide .image-list.style0,
	.modules-slide .image-list.style0 ul {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.modules-slide .image-list.style0,
	.modules-slide .image-list.style0 ul {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		display: block;
	}

	.modules-slide .image-list ul {
		overflow: hidden;
		box-sizing: border-box;
		display: block;
	}

	.modules-slide .image-list.style0 ul li {
		display: block;
		box-sizing: border-box;
	}

	.modules-slide .image-list ul li navigator {
		display: block;
	}

	.modules-slide .image-list ul li navigator image {
		width: 100%;
		background: #f1f1f1;
		display: block !important;
	}

	.modules-slide image {
		max-width: 100%;
		height: auto;
		vertical-align: middle;
		display: inline-block !important;
	}

	.modules-slide .image-list {
		overflow: hidden;

		.tupianzuhe2 {
			margin-bottom: 20rpx;
			flex-wrap: wrap;
		}
	}

	.modules-slide .image-list.style1 ul li {
		display: block;
		margin: 0 16rpx 16rpx;
	}

	.modules-slide .image-list.style1 ul li image {
		height: 100%;
	}

	.modules-slide .image-list ul li navigator image {
		width: 100%;
		background: #f1f1f1;
		display: block !important;
	}

	.modules-slide .image-list.style2 ul,
	.modules-slide .image-list.style3 ul {
		padding-right: 16rpx;
	}

	.modules-slide .image-list.style2 ul li {
		box-sizing: border-box;
		padding: 0 0 16rpx 16rpx;
		width: 50%;
		float: left;
	}

	.modules-slide .image-list.style3 ul li {
		float: left;
		width: 33.33333%;
		box-sizing: border-box;
		padding: 0 0 16rpx 16rpx;
	}

	.modules-slide .image-ad {
		padding: 20rpx 0;
		box-sizing: border-box;
		display: block;
		clear: both;
		overflow: hidden;

		.tupianzuhe04_left {
			width: calc((750rpx - 60rpx)/2);
			height: calc((750rpx - 60rpx)/2 + 20rpx);
			margin-right: 20rpx;
			margin-left: 20rpx;

			image {
				width: 100%;
				height: 100%
			}
		}

		.tupianzuhe04_right_item {
			width: calc((750rpx - 60rpx)/2);
			height: calc((750rpx - 60rpx)/4);

			image {
				width: 100%;
				height: 100%
			}
		}
	}

	.modules-slide .image-ad>div {
		float: left;
		width: 50%;
		box-sizing: border-box;
	}

	.modules-slide .image-ad div navigator {
		display: block;
		margin: 0 16rpx 16rpx 0;
		box-sizing: border-box;
	}

	.modules-slide .images-tpl image {
		width: 374rpx;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.modules-slide .image-ad2 {
		margin: 0 16rpx 0 0;
		box-sizing: border-box;
		display: block;
		clear: both;
		overflow: hidden;
	}

	.modules-slide .image-ad2 .clearfix {
		display: block;
		clear: both;
		overflow: hidden;
	}

	.space_between {
		display: flex;
		justify-content: space-between;
	}

	.modules-slide .image-ad2 div:first-child navigator:nth-child(1),
	.modules-slide .image-ad2 div:first-child navigator:nth-child(1) image {
		width: 228rpx;
	}

	.modules-slide .image-ad2 div:first-child .big:nth-child(2),
	.modules-slide .image-ad2 div:first-child .big:nth-child(2) image {
		width: 473rpx;
	}

	.modules-slide .image-ad2 div navigator {
		display: block;
		float: left;
		margin: 0 0 16rpx 16rpx;
		box-sizing: border-box;
	}

	.modules-slide .images-tpl img {
		width: 100%;
		vertical-align: middle;
		box-sizing: border-box;
	}

	.modules-slide .image-ad2 div:last-child navigator:nth-child(1),
	.modules-slide .image-ad2 div:last-child navigator:nth-child(1) image {
		width: 473rpx;
	}

	.modules-slide .image-ad2 div:last-child navigator:nth-child(2),
	.modules-slide .image-ad2 div:last-child navigator:nth-child(2) image {
		width: 228rpx;
	}

	.modules-slide .image-ad3 {
		padding: 0 0 0 16rpx;
		box-sizing: border-box;
		display: block;
		clear: both;
		overflow: hidden;
	}

	.modules-slide .image-ad3 div {
		width: 367rpx;
		float: left;
		box-sizing: border-box;
	}

	.modules-slide .image-ad3 div image {
		width: 351rpx;
	}

	.modules-slide .image-ad3 div navigator {
		padding: 0 16rpx 16rpx 0;
		display: inline-block;
		box-sizing: border-box;
	}

	.modules-slide .image-ad4 {
		padding: 0 16rpx 16rpx 0;
		box-sizing: border-box;
		display: block;
	}

	.modules-slide .image-ad4 div {
		float: left;
		width: 33.33333%;
		box-sizing: border-box;
	}

	.modules-slide .image-ad4 div navigator {
		display: block;
		margin: 0 0 16rpx 16rpx;
	}

	.countdown {
		width: 100%;
		height: 49.2rpx;
		line-height: 49.2rpx;
		font-size: 39.4rpx;
	}

	.countdown .countdown-name {
		float: left;
		display: block;
		-webkit-transform: scale(0.8);
	}

	.countdown .countdown-main {
		display: block;
		-webkit-transform: scale(0.8);
	}

	.countdown .countdown-num {
		background-color: #000000;
		display: inline-block;
		padding: 0 0rpx;
		width: 25px;
		height: 32.2rpx;
		line-height: 32.2rpx;
	}

	.combine1 {
		display: flex !important;
		flex-direction: column !important;
		text-align: center;
	}

	.combine2 {
		display: flex !important;
	}

	// 推荐商品
	.recommend_goods1 {
		width: 100%;
		height: 350rpx;
		display: flex;
		// background-color: #fff;
		margin-bottom: 20rpx;
		border: none;

		.recommend_goods_img1 {
			width: 350rpx;
			height: 350rpx;

			// margin-right: 20rpx;
			image {
				width: 350rpx;
				height: 350rpx;
				background-color: #ccc;
			}
		}

		.recommend_goods_right {
			width: 100%;
			height: 350rpx;
			position: relative;
			background-color: #fff;
			padding-left: 20rpx;

			.recommend_goods_name {
				font-size: 30rpx;
				margin-top: 20rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.recommend_goods_price {
				position: absolute;
				bottom: 80rpx;
				left: 20rpx;
				color: #FC1C1C;
			}

			.recommend_goods_bottom {
				width: 100%;
				position: absolute;
				bottom: 20rpx;
				left: 20rpx;
				display: flex;
				justify-content: space-between;

				image {
					width: 42rpx;
					height: 42rpx;
					margin-right: 40rpx;
				}
			}
		}
	}

	.recommend_goods2 {
		display: flex;
		flex-direction: column;
		width: 100%;

		.recommend_goods_img2 {
			width: 100%;
			height: 702rpx;

			image {
				width: 100%;
				height: 702rpx;
				background-color: #ccc;
			}
		}

		.recommend_goods_bottom2 {
			width: 100%;
			height: 204rpx;
			padding: 20rpx;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;

			.recommend_goods_name2 {
				font-size: 30rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.goods_bottom {
				width: 100%;
				display: flex;
				flex-direction: column;

				image {
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
	}

	.big_price {
		font-size: 34rpx;
	}

	.small_price {
		font-size: 24rpx;
	}

	.combination_style {
		display: flex;
	}

	.combination_wrap {
		width: 100%;
		background-color: #fff;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.combine6 {
		display: flex;
		flex-direction: column;
		margin-right: 20rpx;
		margin-top: 20rpx;
	}

	.scan_img {
		width: 44rpx;
		height: 44rpx;
		position: absolute;
		left: 15rpx;
	}

	.msg_img {
		width: 52rpx;
		height: 52rpx;
		position: absolute;
		right: 15rpx;
	}

	.combine3 {
		width: calc((750rpx - 60rpx)/2);
		margin-top: 20rpx;
	}

	.combine4 {
		width: calc((750rpx - 80rpx)/3);
		margin-top: 20rpx;
		margin-left: 20rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.paddingTB20 {
		padding: 0 20rpx;
	}

	.no_margin_right {
		padding: 0px
	}

	.no_margin_right>view:nth-child(2n) {
		margin-right: 0 !important;
	}

	.no_margin_right2>view:nth-child(3n) {
		margin-right: 0 !important;
	}

	.see_more_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 14rpx;

		.more_icon_circle {
			width: 106rpx;
			height: 106rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			background-color: #F8F8F8;
			margin-bottom: 20rpx;

			.more_icon {
				width: 52rpx;
				height: 14rpx;
			}
		}

		.see_more_text {
			font-size: 24rpx;
			color: #333;
			font-weight: 600;
		}
	}

	.combine5_wrap>view:nth-child(2n) {
		margin-right: 0 !important;
	}

	.mp-search-box /deep/ .ser-input /deep/ .uni-input-wrapper /deep/ .uni-input-input {
		background-color: #fff;
	}

	.search_input {
		text-align: left;
	}

	.rec_goods_wrap {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.city_wrap {
		font-size: 30rpx;
		display: flex;
		align-items: center;
		color: #fff;
		flex-shrink: 0;
		max-width: 58px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: inline-block;
	}

	.top_icon {
		width: 24rpx;
		height: 24rpx;
		margin-left: 11rpx;
		margin-right: 17rpx;
		margin-top: 2rpx;
		flex-shrink: 0;
	}

	.deco_wrap {
		width: 750rpx;
	}

	/* 短视频模块 */
	/* 方案1 */
	.svideo {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		// width: 100%;
		box-sizing: border-box;
	}

	.svideo_title {
		width: 100%;
		font-family: PingFang SC;
		color: #2D2D2D;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx 20rpx 20rpx;
		box-sizing: border-box;
	}

	.svideo_title_l {
		font-size: 32rpx;
		font-weight: bold;
	}

	.svideo_title_r {
		font-size: 26rpx;
		color: #666666;
		font-weight: 600;
	}

	.svideo_main {
		width: 100%;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;
		color: #FFFFFF;
		display: flex;
		justify-content: space-between;
	}

	.svideo_main_block {
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #3a4db8;
		position: relative;
		height: 345rpx;
		width: 345rpx;
	}

	.svideo_main_block_l {
		margin-left: 0;
	}

	.svideo_main_block_r {
		margin-right: 0;
	}

	.svideo_main_block_t {
		margin: 10rpx 0 0 10rpx;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 20rpx;
		background: rgba(0, 0, 0, 0.2);
		padding-right: 10rpx;
		border-radius: 16rpx;
		position: relative;
		display: inline-block;
		display: flex;
		align-items: center;
	}

	.svideo_main_block_lt {
		height: 100%;
		font-size: 18rpx;
		// background: url("http://site7.55jimu.com/data/upload/mall/store/goods/301/301_06506538074418754.jpg");
		background-color: rgba(0, 0, 0, 0.2);
		padding: 3rpx 10rpx 3rpx 6rpx;
		border-radius: 0 0 16rpx 0;
		position: relative;
		display: flex;
		align-items: center;
	}

	.svideo_main_block_t0 {
		margin: 0 16rpx 16rpx 0;
		border-radius: 0rpx 0rpx 20rpx 0;
		padding: 5rpx 15rpx 5rpx 0rpx;
	}

	.svideo_block_t_img {
		// position: absolute;
		// left: 0;
		// top: 3rpx;
		width: 36rpx;
		height: 36rpx;
	}

	.svideo_block_t_img0 {
		width: 24rpx;
		height: 24rpx;
		// margin-top: 4rpx;
		margin-left: 6rpx;
		margin-right: 7rpx;
	}

	.svideo_block_t_img1 {
		width: 22rpx;
		height: 22rpx;
		// margin-top: 6rpx;
	}

	.svideo_block_t_img2 {
		// margin-top: -4rpx;

	}

	.svideo_block_t_img2zb {
		margin-top: -1rpx;
		margin-left: 4rpx;
	}

	.svideo_block_t_img24 {
		margin-top: 1rpx;
	}

	.svideo_main_block_b {
		font-size: 26rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		position: absolute;
		bottom: 20rpx;
		padding: 0 20rpx;
		width: 100%
	}

	.svideo_block_t_text {
		// padding-left: 35rpx;
	}

	.svideo_block_t_text2 {
		padding-left: 6rpx;
		font-size: 22rpx;
	}

	/* 方案2 */
	.svideo_main2 {
		color: #FFFFFF;
		flex-direction: row;
		overflow: auto;
		flex-wrap: nowrap;
		width: auto;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.svideo_main_block2 {
		margin: 0 20rpx 10rpx 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #3a4db8;
		position: relative;
		height: 224rpx;
		width: 224rpx;
		display: inline-block;
	}

	.svideo_main2_scroll {
		min-width: 100%;
	}

	.svideo_main_block_c2 {
		margin: 20rpx 0;
	}

	.svideo_main_block_l2 {
		margin-left: 0;
	}

	.svideo_main_block_b2 {
		font-size: 24rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		position: absolute;
		bottom: 0rpx;
		box-sizing: border-box;
		padding-left: 10rpx;
		padding-right: 8rpx;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.svideo_main_block_b2_zb text {
		width: 85%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		display: inline-block;
	}

	/* 方案三 */
	.svideo_main3 {
		color: #FFFFFF;
		flex-direction: row;
		overflow: hidden;
		flex-wrap: nowrap;
		width: auto;
	}

	.svideo_main_block3 {
		margin: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #3a4db8;
		position: relative;
		height: 345rpx;
		width: 345rpx;
		display: inline-block;
	}

	.svideo_main_block_l3 {
		width: 280rpx;
		height: 280rpx;
	}

	.svideo_main3_scroll {
		width: 180vw;
		vertical-align: middle;
		display: flex;
		align-items: center;
		margin-left: -140rpx;
	}

	.svideo_main_block_c3 {
		margin-left: 0;
		margin-right: 0;
	}

	.svideo_main_block_r3 {
		width: 280rpx;
		height: 280rpx;
	}

	.svideo_main_block_b3 {
		font-size: 26rpx;
		background: rgba(1, 1, 1, 0.2);
		padding: 0 24rpx;
		color: #FFFFFF;
		border-radius: 24rpx;
		height: 100%;
	}

	.svideo_main_block_b3_w {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		bottom: 20rpx;
		right: 0;
		height: 96rpx;
		line-height: 96rpx;
	}

	/* 方案4  */
	.svideo_main4 {
		color: #FFFFFF;
		flex-direction: row;
		overflow: auto;
		flex-wrap: nowrap;
		width: auto;
		padding: 0 20rpx;
	}

	.svideo_main_block4 {
		margin: 0 20rpx 20rpx 20rpx;
		margin-left: 0;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: #3a4db8;
		position: relative;
		height: 300rpx;
		width: 300rpx;
		display: inline-block;
	}

	.scroll-view {
		width: 100%;
		white-space: nowrap;
	}

	.svideo_main_block_b4 {
		font-size: 24rpx;
		position: absolute;
		bottom: 0rpx;
		box-sizing: border-box;
		margin-left: 30rpx;
		margin-right: 30rpx;
		width: 100%;
		height: 90rpx;
		line-height: 110rpx;
		/* 换图片 */
	}

	.svideo_main_block_b4_text {
		position: absolute;
		left: 20rpx;
		top: 0;
		right: 20rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		z-index: 999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		box-sizing: border-box;
		margin-top: 16rpx;
		font-size: 24rpx;
	}

	.svideo_main_block_b40 {
		margin-left: 0;
		margin-right: 0;
	}

	.svideo_block_t_text4 {
		font-size: 20rpx;
		// padding-left: 20rpx;
	}

	/* -------------方案5--------- */
	.svideo_main5 {
		width: 100%;
		color: #FFFFFF;
		display: flex;
		flex-direction: row;
		overflow: auto;
		flex-wrap: nowrap;
		width: auto;
		background-color: #F8F8F8;
		padding: 0 20rpx;
		box-sizing: border-box;
		justify-content: space-between;
	}


	.svideo_main_block5 {
		display: inline-block;
		border-radius: 16rpx;
		overflow: hidden;
		width: 345rpx;
	}

	.svideo_main_block50 {
		position: relative;
	}

	.svideo_block_bgimg0 {
		height: 274rpx;
		width: 346rpx
	}

	.svideo5_b {
		background-color: #fff;
		height: 146rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.svideo5_b_title {
		width: 290rpx;
		color: #333333;
		font-size: 28rpx;
		font-weight: bold;
		margin-top: 16rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.svideo5_b_text {
		width: 290rpx;
		color: #666666;
		font-size: 26rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.svideo_block_t5_w {
		display: flex;
		justify-content: center;
		margin-top: 32rpx;
	}

	.svideo_block_t5 {
		margin: 16rpx;
		height: 32rpx;
		line-height: 34rpx;
		font-size: 20rpx;
		background-color: rgba(1, 1, 1, 0.7);
		padding: 0 20rpx;
		border-radius: 16rpx;
		position: relative;
		display: inline-block;
		color: #FFFFFF;
		opacity: 0.7;
		margin-bottom: 30rpx;
		z-index: 99;
	}

	.svideo_block_bgimg1_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.svideo_block_bgimg1 {
		width: 230rpx;
		height: 230rpx;
		border-radius: 115rpx;
		overflow: hidden;
		background-color: red;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.svideo_block_bgimg2 {
		width: 40rpx;
		height: 40rpx;
	}

	.svideo_block_bgimg3 {
		position: absolute;
		width: 60rpx;
		height: 60rpx;
	}

	/* ------------- 直播列表/短视频列表*/
	.live_list_b {
		width: 346rpx;
		border-radius: 16rpx;
		overflow: hidden;
		margin: 10rpx 0 10rpx 0;
	}

	.live_list_b_img {
		width: 100%;
		height: 346rpx;
		overflow: hidden;
		position: relative;
	}

	.live_list_b_img_img {
		position: absolute;
		width: 346rpx;
		height: 346rpx;
	}

	.live_list_b_img_hua {
		position: absolute;
		width: 90rpx;
		height: 300rpx;
		right: 5rpx;
		bottom: 3rpx;
		z-index: 990
	}

	.live_list_b_img_hua1 {
		bottom: 10rpx;
	}

	.live_list_b_text {
		font-size: 20rpx;
		color: #fff;
		margin-left: 30rpx;
	}

	.live_list_b_tip2 {
		padding: 4rpx 10rpx;
		height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url("http://site7.55jimu.com/data/upload/mall/store/goods/301/301_06506538074418754.jpg");
		/* 换地址，要用服务器地址 */
		border-radius: 16rpx;
		margin-left: 12rpx;
		margin-top: 10rpx;
		position: relative;
	}

	.live_list_img_bottom1 {
		font-size: 30rpx;
		padding: 10rpx 10rpx 4rpx 10rpx;
		color: #2D2D2D;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.live_list_main5 {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		overflow: auto;
		width: auto;
		justify-content: space-between;
		padding: 20rpx;
		background-color: #fff;
	}

	.live_list_text3 {
		border-radius: 15rpx;
		background-color: red;
		font-size: 22rpx;
		padding: 0 10rpx;
		color: #fff;
		line-height: 30rpx;
		position: absolute;
		right: -1rpx;
		top: 4rpx;
	}

	.live_list_text30 {
		background-color: #BCAEFE;
	}

	.live_panic_buy3 {
		border: none;
		position: relative;
	}

	.live_panic_time_i {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		width: 35%;
		color: #9A9A9A;
		margin: 0 8rpx
	}

	.live_panic_time_v {
		width: 60%;
	}


	.active_panic_time_img2 {
		width: 40rpx;
		height: 40rpx;
		margin-right: 5rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	/* ------ */
	.active_panic_text2 {
		margin: 0 5rpx;
	}

	.active_top_tip20 {
		font-size: 22rpx;
		padding-top: 0;
		padding-bottom: 0;
		line-height: 30rpx;
	}

	.active .tab_nav_block_t {
		color: #FC1C1C;
		font-size: 30rpx;
		border-bottom: 2px solid #FC1C1C;
		font-weight: bold
	}

	.active .tab_nav_block_i {
		color: #FC1C1C;
		font-size: 22rpx
	}

	.video_bg {
		width: 100%;
		height: 100%;
		z-index: 99;
	}

	.video_bg1 {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;

	}

	.svideo_main_block_w {
		z-index: 999;
		position: absolute;
		top: 0;
		left: 0;
	}

	.svideo_main_block_sw {
		z-index: 3;
		position: absolute;
		top: 0;
		left: 0;
		width: 40rpx;
		height: 50rpx;
	}

	.svideo_main_block_lw {
		z-index: 3;
		position: absolute;
		top: 0;
		left: 0;
	}

	.video_bg3 {
		z-index: 3;
		position: absolute;
		top: 0;
		left: 0;
		width: 184px;
		height: 163px;
		// opacity: 0.2;
	}

	.svideo_main5>view:nth-child(1) .svideo_bg_img {
		position: absolute;
		top: 0;
		left: 0;
		background: #B9E5FF;
		opacity: 0.7;
		width: 184px;
		height: 163px;
		z-index: 10;
	}

	.svideo_main5>view:nth-child(2) .svideo_bg_img {
		position: absolute;
		top: 0;
		left: 0;
		background: #FFCEB9;
		opacity: 0.7;
		width: 184px;
		height: 163px;
		z-index: 10;
	}

	/* ---------------活动组模块----------- */
	.active_wrap {
		padding: 20rpx 0 13rpx 0;
		border-radius: 15rpx;
		margin: 20rpx 20rpx 0 20rpx;
		width: 710rpx;
		background: #fff;
		box-sizing: border-box;
	}

	.active_wrap_top {
		height: 60rpx;
		line-height: 60rpx;
		display: flex;
		position: relative;
		font-family: PingFang SC;
		padding: 0 20rpx;
	}

	.active_logo {
		display: block;
		background-color: #FFFFFF;
		width: 176rpx;
		height: 42rpx;
		margin-top: 9rpx;
		margin-right: 20rpx;
	}

	.active_wrap_bili {
		font-size: 28rpx;
		color: #333333;
		width: 50%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		font-family: PingFang SC;
	}

	.active_more {
		height: 40rpx;
		font-size: 26rpx;
		// padding: 0 20rpx;
		line-height: 40rpx;
		box-sizing: border-box;
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		color: #333333
	}

	.active_wrap_bili_d {
		color: #999999;
		font-size: 24rpx;
		margin: 10rpx 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding-left: 20rpx;
	}

	.active_block_wrap {
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		padding-right: 0;
	}

	.active_limit_block {
		width: 230rpx;
		margin: 10rpx 20rpx 0 0;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.active_limit_block:last-child {
		margin: 10rpx 20rpx 0rpx 0;
	}

	.active_img_bottom1 {
		font-size: 28rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding: 10rpx 0 8rpx 0;
		padding-right: 3rpx;
		color: #2D2D2D
	}

	.active_img_bottom2_w {
		display: flex;
		align-items: flex-end;
		margin-bottom: 10rpx;
		position: relative;
	}

	.active_img_bottom2_p {
		color: #FF2B20;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.active_img_bottom2_p text:nth-child(2) {
		font-size: 30rpx;
	}

	.active_img_bottom2_r {
		color: #999999;
		font-size: 20rpx;
		text-decoration: line-through
	}

	.active_imgage1 {
		width: 100%;
		height: 230rpx;
		overflow: hidden;
		position: relative;
		border-radius: 0 0 8rpx 8rpx;
	}

	.active_imgage1_img {
		position: absolute;
		width: 230rpx;
		height: 230rpx;
	}

	.active_imgage2_img {
		width: 326rpx;
		height: 324rpx;
	}

	.active_top_tip_w {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		width: 230rpx;
		top: 0;
		left: 0;
	}


	.active_top_tip {
		padding: 0rpx 10rpx;
		height: 30rpx;
		background: linear-gradient(0deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%);
		border-radius: 0 0 14rpx 14rpx;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;

	}

	.active_panic_buy {
		height: 40rpx;
		border-radius: 20rpx;
		display: flex;
		margin: 10rpx 25rpx 0 0;
		border: 1px solid red
	}

	.active_panic_text {
		border-radius: 20rpx;
		background-color: red;
		font-size: 24rpx;
		padding: 0 10rpx;
		line-height: 40rpx;
		margin-left: -2rpx;
		width: 72rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.active_panic_time {
		font-size: 26rpx;
		line-height: 40rpx;
		padding-left: 10rpx;
		color: #FC1C1C;
	}

	/* ------------活动二/优享团购---- */
	.active_wrap_bili2 {
		color: #FF4605;
		font-size: 28rpx;
		margin: 14rpx 0;
		padding-left: 20rpx;
	}

	.active_top_tip2 {
		padding: 4rpx 10rpx;
		height: 30rpx;
		border-radius: 0 0 14rpx 0;
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background: linear-gradient(90deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%);
	}

	.active_top_tip_w2 {
		display: flex;
		align-items: center;
	}

	.active_top_tip_w21 {
		position: absolute;
		left: 0;
		top: 0;
		width: 230rpx;
	}

	.active_top_tip_w22 {
		position: absolute;
		left: 0;
		top: 0;
		width: 326rpx;
	}

	.active_limit_block2 {
		width: 326rpx;
		margin-top: 14rpx;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.active_imgage2 {
		width: 326rpx;
		height: 270rpx;
		overflow: hidden;
		position: relative;
	}

	.active_block_wrap2 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background: #fff;
	}

	.active_now_tuan {
		color: #fff;
		height: 40rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: red;
		position: absolute;
		right: 0;
		padding: 0 12rpx;
		box-sizing: border-box;
	}

	.active_img_bottom2 {
		font-size: 28rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding: 10rpx 0;
		padding-right: 3rpx;
		color: #2D2D2D
	}

	.active_panic_buy2 {
		height: 54rpx;
		display: flex;
		align-items: center;
		background-color: red;
		padding: 0 8rpx;
		color: #fff;
		font-size: 24rpx;
		border-radius: 0 0 8rpx 8rpx;
		box-sizing: border-box;
	}

	.active_tuan_num {
		color: #FF0000;
		background-color: #fff;
		border-radius: 18rpx;
		height: 36rpx;
		line-height: 36rpx;
		padding: 0 10rpx;
	}

	/* ------------活动3/拼团特惠---- */
	.active_panic_time_img {
		width: 24rpx;
		height: 24rpx;
		margin-top: 8rpx;
		margin-right: 5rpx;
	}

	.active_panic_text3 {
		border-radius: 0 20rpx 0 20rpx;
		background-color: red;
		font-size: 24rpx;
		padding: 0 10rpx;
		line-height: 40rpx;
		line-height: 42rpx;
		position: absolute;
		right: -1rpx;
		top: 0;
	}

	.active_panic_time3 {
		font-size: 24rpx;
		line-height: 40rpx;
		padding-left: 10rpx;
		color: #FC1C1C;
		display: flex;

	}

	.active_panic_time4 {
		font-size: 24rpx;
		line-height: 40rpx;
		display: flex;
	}

	.active_panic_buy3 {
		position: relative;
		margin: 0 0 0 0;
	}

	/* ------------------直播-- */
	.svideo_main_block_zb {
		font-size: 26rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		position: absolute;
		bottom: 10rpx;
		padding: 0 20rpx;
		width: 80%
	}

	.shuffing {
		text-align: center;
		width: 100%;
		position: relative;
	}

	.shuffing-item {
		position: absolute;
		width: 100%;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		height: 520rpx;
		transition: all 0.3s;
	}

	.shuffing-item-next {
		width: 85%;
		height: 85%;
		transform: translateX(-100%) translateY(-50%);
		transition: all 0.3s;
	}

	.shuffing-item-preo {
		width: 85%;
		height: 85%;
		transform: translateX(40%) translateY(-50%);
		transition: all 0.3s;
	}

	.shuffing-item>image {
		width: 100%;
		height: 100%;
	}

	.shuffing-mask {
		position: absolute;
		bottom: 0;
		width: 100%;
		line-height: 60rpx;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	/* ----TAB切换：---- */
	.tab_nav {
		margin-top: 100rpx;
	}

	.tab_nav_scroll {
		white-space: nowrap;
	}

	.tab_nav_block {
		display: inline-block;
		width: 25%;
		text-align: center;
	}

	.tab_nav_block_t {
		color: #2D2D2D;
		font-size: 28rpx;
		padding-bottom: 14rpx;
		margin: 0 50rpx 4rpx 50rpx
	}

	.tab_nav_block_on {
		color: #333333;
		font-weight: 700;
		font-size: 32rpx;
		margin-bottom: 8rpx;
	}

	.tab_nav_block_i {
		color: #999999;
		font-size: 22rpx;

		padding: 4rpx 0;
		margin: 5rpx 26rpx
	}

	.tab_nav_block_on2 {
		background-color: #FA1C1C;
		color: #FFFFFF;
		border-radius: 16rpx;
	}

	// 短视频3d轮播
	.swiper-block {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 346rpx;
		margin: 0
	}

	.slide-image {
		height: 320rpx;
		width: 520rpx;
		border-radius: 9rpx;
		box-shadow: 0px 0px 30rpx rgba(0, 0, 0, .2);
		margin: 0rpx 30rpx;
		z-index: 1;
	}

	.active1 {
		/* transform: scale(1.44); */
		transition: all .2s ease-in 0s;
		height: 100%;
		width: 100%;
		border-radius: 16rpx;
	}

	.active2 {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}

	// 空页面
	.empty_sort_page {
		width: 100%;
		// height: 100vh;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;
		align-items: center;

		.empty_img {
			width: 210rpx;
			height: 210rpx;
			margin-bottom: 32rpx;
		}

		.empty_text {
			font-size: 26rpx;
			color: #999;
		}
	}

	.scan,
	.message {
		image {
			width: 50rpx;
			height: 50rpx;
			padding: 15rpx;
		}
	}

	.search_con {
		position: relative;
		flex: 1;
	}

	.svideo_person_num {
		width: 40rpx;
		height: 40rpx;
		border-radius: 0 0 50% 0;
	}

	.swiper-item {
		color: #fff;
		overflow: hidden;
		left: 40rpx !important;
		right: 20rpx;
		top: 20rpx;
		bottom: 20rpx;
		width: 80% !important;
		height: 280rpx !important;
	}

	.swiper-item1 {
		color: #fff;
		box-sizing: border-box;
		height: 346rpx;
		width: 346rpx !important;
		top: 0rpx;
		bottom: 0rpx;
		overflow: hidden;
		left: 80rpx;
	}

	// 专题页头部
	.topic_top_bar {
		width: 750rpx;
		height: 88rpx;
		background-color: #fff;
		display: flex;
		// justify-content: center;
		align-items: center;
		font-size: 30rpx;
		color: #2d2d2d;
		position: fixed;
		top: 0;
		/* #ifdef MP || APP-PLUS */
		padding-top: 70rpx;
		/* #endif */
		left: 0;
		font-weight: 600;
		z-index: 99999;
		margin: 0 auto;
		right: 0;
	}

	.svideo2_wrap /deep/ .uni-scroll-view /deep/ .uni-scroll-view /deep/ .uni-scroll-view-content>view:nth-last-child(1) {
		margin-right: 0 !important;
	}

	.top_swiper_style1 {
		background: linear-gradient(90deg, #FC1D1C 0%, #FF7A18 100%);
	}

	.top_swiper_style2 {
		background: linear-gradient(#FC1D1C 0%, #FF7A18 42%, #fff 100%);
	}

	.svideo4_wrap /deep/ .uni-scroll-view /deep/ .uni-scroll-view /deep/ .uni-scroll-view-content>view:nth-last-child(1) {
		margin-right: 0 !important;
	}

	.recommond_goods3_wrap {
		display: flex;
		justify-content: space-between;
	}

	.have_sold {
		font-size: 24rpx;
		color: #9a9a9a;
	}

	.topic_back_icon {
		width: 52rpx;
		height: 32rpx;
		padding-left: 20rpx;
	}

	.topic_name {
		width: 100%;
		text-align: center;
		margin-left: -58rpx;
	}

	.hide_sold_wrap {
		width: 100%;
		position: absolute;
		bottom: 20rpx;
		left: 0;
		display: flex;
		justify-content: space-between;
	}

	// 导航分组
	.nav_group {
		padding: 0 97rpx;
		display: flex;
		flex-wrap: wrap;

		.nav_group_item {
			display: flex;
			align-items: center;
			margin-right: 90rpx;
			margin-top: 40rpx;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.nav_group_name {
				font-size: 26rpx;
				color: #333;
			}
		}
	}

	.nav_group>view:nth-child(2n) {
		margin-right: 0;
	}

	// 导航分组end
	.rec_goods_wrap>view:nth-child(2n) {
		margin-right: 0 !important;
	}
</style>
