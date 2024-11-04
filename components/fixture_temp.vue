<template name="fixture_temp">

	<block v-if="home_info">
		<view v-for="(item, index) in home_info" :key="index">

			<!--轮播模块  -->
			<view data-type="lunbo" v-if="item.type == 'lunbo'" :data-index="index">
				<swiper circular="true" class="home_lunbo" :autoplay="autoplay + ' '" :interval="(interval?interval:5000) + ' '" :duration="(duration?duration:1000) + ' '" :style="'height:' + item.height + 'rpx'">
					<block v-for="(childitem, index2) in item.data" :key="index2">
						<swiper-item>
							<block v-if="childitem.url_type=='url'">
								<template is="luno_navigator" :data="childitem"></template>
							</block>
							<block v-else>
								<navigator v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url" hover-class="navigator-hover ">
									<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
								</navigator>
								<navigator v-if="childitem.url_type=='promote'" url="/integral/activity/tuan_index/tuan_index" hover-class="navigator-hover ">
									<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
								</navigator>
								<navigator v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'/pages/found/subject?u=' + childitem.url">
									<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
								</navigator>
								<navigator v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'/pages/goods_list/goods_list?keyword=' + childitem.url">
									<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
								</navigator>
							</block>
						</swiper-item>
					</block>
				</swiper>
			</view>

			<!--导航模块  -->
			<view data-type="nav" v-if="item.type == 'nav'" :data-index="index">
				<div class="modules-nav">
					<div>
						<section>
							<ul :class="(item.style_set=='tag-nav'?'mod-tag-nav':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='left'?'mod-nav before-icon':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='no-icon'?'mod-nav no-icon':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='up'?'mod-nav':'')">
								<li v-for="(childitem, index2) in item.data" :key="index2" v-if="childitem.img != ''">
									<block v-if="childitem.url_type=='url'">
										<template is="nav_navigator" :data="childitem,item:item"></template>
									</block>
									<!-- 优惠券 -->
									<block v-else-if="childitem.url_type=='coupon'">
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<block v-else-if="childitem.url_type=='shopstreet'">
										<navigator url="/pages/shoplist/shoplist" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='shopstreet'" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<!-- 团购 -->
									<block v-else-if="childitem.url_type=='promote'">
										<navigator url="/integral/activity/tuan_index/tuan_index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='promote'" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url" @tap="ReceiveCoupon">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>


									<!-- ldj -->
									<block v-else-if="childitem.url_type=='o2o'">
										<navigator url="/ldj/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/ldj/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/ldj/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/ldj/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>
									<!-- 商品列表 关键词搜索 -->
									<block v-else-if="childitem.url_type=='keywords'">
										<navigator :url="'/pages/goods_list/goods_list?keyword=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?keyword=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?keyword=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?keyword=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>
									<!-- 商品列表 分类id搜索 -->
									<block v-else-if="childitem.url_type=='category'">
										<navigator :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>
									<!-- 店铺 -->
									<block v-else-if="childitem.url_type=='shop'">
										<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>
									<!-- 签到 -->
									<block v-else-if="childitem.url_type=='checkin'">
										<navigator url="/pages/found/import?u=/cwap_user_points_xcx.html&id=qd" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/found/import?u=/cwap_user_points_xcx.html&id=qd" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/found/import?u=/cwap_user_points_xcx.html&id=qd" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/found/import?u=/cwap_user_points_xcx.html&id=qd" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<!-- 积分中心 -->
									<block v-else-if="childitem.url_type=='points'">
										<navigator url="/pages/integral/integral" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/integral/integral" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/integral/integral" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/integral/integral" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<!-- 领券中心 -->
									<block v-else-if="childitem.url_type=='getcoupon'">
										<navigator url="/pages/red/red_get_list" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/red/red_get_list" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/red/red_get_list" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/pages/red/red_get_list" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<!-- 积分商城 -->
									<block v-else-if="childitem.url_type=='pointscenter'">
										<navigator url="/integral/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/integral/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/integral/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/integral/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>

									<!-- 团购 -->
									<block v-else-if="childitem.url_type=='promote'">
										<template is="nav_navigator_promote" :data="childitem,item:item"></template>
									</block>

									<!-- 推手 -->
									<block v-else-if="childitem.url_type=='spleader'">
										<navigator url="/addons/pages/tsIndex/tsIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/addons/pages/tsIndex/tsIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/addons/pages/tsIndex/tsIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator url="/addons/pages/tsIndex/tsIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else :data-id="childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
									</block>
									<block v-else>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'/pages/found/subject?u=' + childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'/pages/goods_list/goods_list?keyword=' + childitem.url">
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>
										<!-- <navigator style="{{item.style_set=='tag-nav'?'line-height:':''}}{{item.style_set=='tag-nav'?item.slide:''}}{{item.style_set=='tag-nav'?'px':''}}" wx:elif="{{childitem.url_type_new=='ldj_store' && childitem.url!=''}}" url='/ldj/pages/store/store?vid={{childitem.url_new}}'>
											<span class='name_wrap' style="width:{{item.slide}}px;">
												<image mode='widthFix' style="width:{{item.slide}}px;" src="{{childitem.img}}"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator> -->
										<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" v-else>
											<span class="name_wrap" :style="'width:' + item.slide + 'px'">
												<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
											</span>
											<span>{{childitem.name}}</span>
										</navigator>

									</block>
								</li>
							</ul>
						</section>
					</div>
				</div>
			</view>

			<!--推荐商品  -->
			<view data-type="tuijianshangpin" v-if="item.type == 'tuijianshangpin'" :data-index="index">
				<div :class="'index_block goods ' + (item.isshow_title == '0'&&item.isshow_price == '0'?'hide_title hide_price':'') + ' ' + (item.isshow_title == '0'&&item.isshow_price == '1'?'hide_title':'') + ' ' + (item.isshow_title == '1'&&item.isshow_price == '0'?'hide_price':'')">
					<div class="content">
						<div v-for="(childitem, index2) in item.data.goods_info" :key="index2" :class="'goods-item goods-' + item.show_style">
							<navigator :url="'/pages/goods_detail/goods_detail?gid=' + childitem.gid">
								<div class="goods-item-pic">
									<image :src="childitem.goods_image" alt></image>
								</div>
								<div class="goods-item-name">{{childitem.goods_name}}</div>
								<div class="goods-item-price">
									<span class="yens">{{$L('￥')}}</span>
									<em class="bigprice">{{childitem.show_price}}</em>
								</div>
							</navigator>
						</div>
					</div>
				</div>
			</view>

			<!--图片组合0123  -->
			<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style<4" :data-index="index">
				<div class="modules-slide">
					<div :class="'image-list style' + item.sele_style" :data-id="item.sele_style">
						<ul class="clearfix">
							<li v-for="(childitem, index2) in item.data" :key="index2">
								<block v-if="childitem.url_type=='url'">
									<template is="tpzh0123_navigator" :data="childitem,type:'0'"></template>
								</block>
								<block v-else>
									<navigator v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'/pages/found/subject?u=' + childitem.url">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'/pages/goods_list/goods_list?keyword=' + childitem.url">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='keywords' && childitem.url!=''" :url="'/pages/goods_list/goods_list?keyword=' + childitem.url">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='shop' && childitem.url!=''" :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='shopstreet'" url="/pages/shoplist/shoplist">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else-if="childitem.url_type=='promote'" url="/integral/activity/tuan_index/tuan_index">
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
									<navigator v-else>
										<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
									</navigator>
								</block>
							</li>
						</ul>
					</div>
				</div>
			</view>

			<!--图片组合4  -->
			<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==4" :data-index="index">
				<div class="modules-slide">
					<div class="image-ad clearfix images-tpl">
						<div>
							<block v-if="item['data'][0].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][0],type:'1'"></template>
							</block>
							<block v-else>
								<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'/pages/found/subject?u=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='category' && item['data'][0].url!=''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
							</block>
						</div>
						<div>
							<block v-if="item['data'][1].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][1],type:'1'"></template>
							</block>
							<block v-else>
								<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'/pages/found/subject?u=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='category' && item['data'][1].url!=''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
							</block>
							<block v-if="item['data'][2].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][2],type:'1'"></template>
							</block>
							<block v-else>
								<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'/pages/found/subject?u=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='category' && item['data'][2].url!=''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
							</block>
						</div>
					</div>
				</div>
			</view>

			<!--图片组合5  -->
			<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==5" :data-index="index">
				<div class="modules-slide">
					<div class="image-ad2 clearfix images-tpl">
						<div class="clearfix">
							<block v-if="item['data'][0].url_type=='url'">
								<template is="tpzh5_navigator" :data="childitem:item['data'][0],type:'small'"></template>
							</block>
							<block v-else>
								<navigator class="small" v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator class="small" v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'/pages/found/subject?u=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator class="small" v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator class="small" v-else>
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][1].url_type=='url'">
								<template is="tpzh5_navigator" :data="childitem:item['data'][1],type:'big'"></template>

							</block>
							<block v-else>
								<navigator class="big" v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator class="big" v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'/pages/found/subject?u=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator class="big" v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator class="big" v-else>
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
							</block>
						</div>
						<div class="clearfix">
							<block v-if="item['data'][2].url_type=='url'">
								<template is="tpzh5_navigator" :data="childitem:item['data'][2],type:'big'"></template>
							</block>
							<block v-else>
								<navigator class="big" v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator class="big" v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'/pages/found/subject?u=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator class="big" v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator class="big" v-else>
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][3].url_type=='url'">
								<template is="tpzh5_navigator" :data="childitem:item['data'][3],type:'small'"></template>
							</block>
							<block v-else>
								<navigator class="small" v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator class="small" v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'/pages/found/subject?u=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator class="small" v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator class="small" v-else>
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
							</block>
						</div>
					</div>
				</div>
			</view>

			<!--图片组合6  -->
			<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==6" :data-index="index">
				<div class="modules-slide">
					<div class="image-ad3 clearfix images-tpl">
						<div>
							<block v-if="item['data'][0].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][0]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'/pages/found/subject?u=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][1].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][1]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'/pages/found/subject?u=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
							</block>
						</div>
						<div>
							<block v-if="item['data'][2].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][2]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'/pages/found/subject?u=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][3].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][3]"></template>
							</block>
							<block v-else>
								<navigator v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'/pages/found/subject?u=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
							</block>
						</div>
					</div>
				</div>
			</view>

			<!--图片组合7  -->
			<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==7" :data-index="index">
				<div class="modules-slide">
					<div listorder="5" class="image-ad4 clearfix images-tpl">
						<div>
							<block v-if="item['data'][0].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][0]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'/pages/found/subject?u=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][0].url">
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][0].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][1].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][1]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'/pages/found/subject?u=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][1].url">
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][1].img"></image>
								</navigator>
							</block>
						</div>
						<div>
							<block v-if="item['data'][2].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][2]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'/pages/found/subject?u=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][2].url">
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][2].img"></image>
								</navigator>
							</block>

							<block v-if="item['data'][3].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][3]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'/pages/found/subject?u=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url">
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][3].img"></image>
								</navigator>
							</block>
						</div>
						<div>
							<block v-if="item['data'][4].url_type=='url'">
								<template is="tpzh0123_navigator" :data="childitem:item['data'][4]"></template>

							</block>
							<block v-else>
								<navigator v-if="item['data'][4].url_type=='goods' && item['data'][4].url!=''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url">
									<image mode="widthFix" :src="item['data'][4].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][4].url_type=='special' && item['data'][4].url!=''" :url="'/pages/found/subject?u=' + item['data'][4].url">
									<image mode="widthFix" :src="item['data'][4].img"></image>
								</navigator>
								<navigator v-else-if="item['data'][4].url_type=='keyword' && item['data'][4].url!=''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url">
									<image mode="widthFix" :src="item['data'][4].img"></image>
								</navigator>
								<navigator v-else>
									<image mode="widthFix" :src="item['data'][4].img"></image>
								</navigator>
							</block>
						</div>
					</div>
				</div>
			</view>

			<!--富文本 start -->
			<view data-type="fuwenben" v-if="item.type == 'fuwenben'" :data-index="index">
				<div class="fuwenben_part">
					<template is="entry" :data="...item.article"></template>
				</div>
			</view>
			<!--富文本 end -->

			<!-- 公告 start -->
			<view class="gonggao" data-type="gonggao" v-if="item.type == 'gonggao'" :data-index="index">
				<view class="img">
					<image :src="img_url+'home_gonggao.png'" mode="widthFix"></image>
				</view>
				<view class="ani">
					<navigator url="/pages/integral/integral" hover-class="none" v-if="item.lianjie_type=='points'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator :url="'/pages/goods_list/goods_list?keyword=' + item.lianjie_url" hover-class="none" v-if="item.lianjie_type=='keywords'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator :url="'/pages/found/subject?u=' + item.lianjie_url" hover-class="none" v-if="item.lianjie_type=='special'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator :url="'/pages/goods_list/goods_list?gc_id=' + item.lianjie_url" hover-class="none" v-if="item.lianjie_type=='category'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator hover-class="none" :data-id="item.lianjie_url" @tap="ReceiveCoupon" v-if="item.lianjie_type=='coupon'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.lianjie_url" hover-class="none" v-if="item.lianjie_type=='goods'">
						<text>{{item.text}}</text>
					</navigator>

					<block v-else-if="item.lianjie_type=='promote'">
						<template is="gonggao_promote" :data="item:item"></template>
					</block>

					<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + item.lianjie_url" hover-class="none" v-if="item.lianjie_type=='shop'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/pages/found/import?u=/cwap_user_points_xcx.html&id=qd" hover-class="none" v-if="item.lianjie_type=='checkin'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/pages/red/red_get_list" hover-class="none" v-if="item.lianjie_type=='getcoupon'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/integral/pages/index/index" hover-class="none" v-if="item.lianjie_type=='pointscenter'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/pages/shoplist/shoplist" hover-class="none" v-if="item.lianjie_type=='shopstreet'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/ldj/pages/index/index" hover-class="none" v-if="item.lianjie_type=='o2o'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator url="/addons/pages/tsIndex/tsIndex" hover-class="none" v-if="item.lianjie_type=='spleader'">
						<text>{{item.text}}</text>
					</navigator>

					<navigator hover-class="none" v-if="item.lianjie_type=='url' || item.lianjie_type==''">
						<text>{{item.text}}</text>
					</navigator>
				</view>
			</view>
			<!-- 公告 end -->

			<!-- 搭配 start -->
			<view class="dapei" data-type="dapei" v-if="item.type == 'dapei'" :data-index="index">
				<view class="dapei_top">
					<view class="dp_tj" v-if="item.dapei_title">{{item.dapei_title}}</view>
					<image :src="item.dapei_img" mode="widthFix" v-if="item.dapei_img"></image>
					<view class="dp_desc" v-if="item.dapei_desc">{{item.dapei_desc}}</view>
				</view>
				<scroll-view v-if="item.data.goods_info" scroll-x>
					<view v-for="(dpitem, index2) in item.data.goods_info" :key="index2" class="dp_item">
						<navigator :url="'/pages/goods_detail/goods_detail?gid=' + dpitem.gid" class="wrap">
							<view class="img">
								<image :src="dpitem.goods_image"></image>
							</view>
							<text class="name">{{dpitem.goods_name}}</text>
							<view class="price">{{$L('￥')}}{{dpitem.goods_price}}</view>
						</navigator>
					</view>
				</scroll-view>
			</view>
			<!-- 搭配 end -->


			<!-- 客服电话 start -->
			<view class="kefu" data-type="kefu" v-if="item.type == 'kefu'" :data-index="index">
				<image :src="img_url+'call.png'" mode="widthFix"></image>
				<view>{{item.text}} {{item.tel}}</view>
			</view>
			<!-- 客服电话 end -->


			<!--辅助空白    -->
			<view data-type="fzkb" v-if="item.type == 'fzkb'" :data-index="index">
				<div class="fzkb" :style="'width: 100%height:' + item.text + 'pxbackground-color: #' + item.color"></div>
			</view>

			<!--辅助线  -->
			<view data-type="fzx" v-if="item.type == 'fzx'" :data-index="index">
				<div class="fzx_part">
					<div :class="'fzx_content fzx_' + item.val">
					</div>
				</div>
			</view>

			<!--活动0 拼团 -->
			<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==0  && item.data.left.top[0].goods_info!=null&& item.data.right.bottom[2].goods_info!=null && item.data.right.top[0].goods_info!=null" :data-index="index">
				<div class="modules-huodong modules-slide">
					<div class="style_template">
						<div class="huodong-content">
							<div class="huodong-top">
								<navigator url="/integral/activity/pin_index/pin_index">
									<div class="huodong-top-bg">
										<image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-0.jpg'"></image>
									</div>
									<div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
								</navigator>
							</div>
							<div class="huodong-main">
								<div class="huodong-left" style=" position:relative">
									<image style=" width:100%;height: 100%; position:absolute;z-index:-10;left:0;top:0" :src="img_url+'huodong_left_bg.jpeg'"></image>
									<div class="huodong-left-top">
										<div class="huodong-left-top-layout">
											<div class="main-title">{{item.data.left.top[0].title}}</div>
											<div class="sub-title">
												<span>{{item.data.left.top[0].subtitle}}</span>
											</div>
											<block v-if="item.data.left.top[0].gid">
												<div class="countdown" :data-end_time_str="item.data.left.top[0].goods_info.extend_data.sld_end_time">
													<div class="countdown-main">
														<span class="hours countdown-num">{{huodong_0.hours}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="min countdown-num">{{huodong_0.minutes}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="sec countdown-num">{{huodong_0.seconds}}</span>
													</div>
												</div>
											</block>
										</div>
									</div>
									<div class="huodong-left-goods">
										<div class="huodong-left-goods-layout huodong-left-goods-item">
											<block v-if="item.data.left.top[0].gid && item.data.left.top[0].goods_info.extend_data">
												<navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.data.left.top[0].gid">
													<div class="goods-thumb">
														<block v-if="item.data.left.top[0].goods_info.goods_image">
															<image mode="widthFix" :src="item.data.left.top[0].goods_info.goods_image"></image>
														</block>
														<block v-else>
															<div class="empty-img"></div>
														</block>
													</div>
													<div class="goods-price">
														<div class="sale-price">
															{{$L('¥')}}
															<span class="money-number">{{item.data.left.top[0].goods_info.promotion_price}}</span>
														</div>
														<div class="market-price">
															{{$L('¥')}}
															<span class="money-number">{{item.data.left.top[0].goods_info.goods_marketprice}}</span>
														</div>
													</div>
													<div class="goods-other">
														<div class="goods-extend-data">
															<span>
																<em>{{item.data.left.top[0].goods_info.extend_data.sld_team_count}}</em>{{$L('人团')}}</span>
															<span style="margin: 0 30rpx;">|</span>
															<span>{{$L('去开团')}}</span>
														</div>
													</div>
												</navigator>
											</block>
											<block v-else>
												<div style="text-align: center;font-size: 20rpx;height: 230rpx;line-height: 230rpx;display: table;padding: 20rpx;">
													<p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择拼团活动')}}</p>
												</div>
											</block>
										</div>
									</div>
								</div>
								<div class="huodong-right">
									<div class="huodong-right-top">
										<div class="huodong-top-title">
											<div class="main-title">{{item.data.right.top[0].title}}</div>
											<div class="sub-title">
												<span>{{data.right.top[0].subtitle}}</span>
											</div>
										</div>
										<div class="huodong-goods-list">
											<block v-if="item.data.right.top[0].gid">
												<block v-if="item.data.right.top[0].goods_info">
													<navigator v-for="(goods_info_item, index2) in item.data.right.top[0].goods_info" :key="index2" class="huodong-goods-item" :url="'/pages/goods_detail/goods_detail?gid=' + goods_info_item.gid">
														<div class="goods-thumb">
															<block v-if="goods_info_item.goods_image">
																<image mode="widthFix" :src="goods_info_item.goods_image"></image>
															</block>
															<block v-else>
																<div class="empty-img"></div>
															</block>
														</div>
													</navigator>
												</block>
											</block>
										</div>
									</div>
									<div class="huodong-right-bottom">
										<div class="huodong-goods-list">
											<div class="huodong-goods-item">
												<div class="huodong-top-title">
													<div class="main-title">{{item.data.right.bottom[1].title}}</div>
													<div class="sub-title">
														<span>{{item.data.right.bottom[1].subtitle}}</span>
													</div>
												</div>
												<navigator v-if="item.data.right.bottom[1].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.right.bottom[1].gid" class="goods-thumb">
													<block v-if="item.data.right.bottom[1].goods_info[0].goods_image">
														<image mode="widthFix" :src="item.data.right.bottom[1].goods_info[0].goods_image"></image>
													</block>
													<block v-else>
														<div class="empty-img"></div>
													</block>
												</navigator>
											</div>
											<div class="huodong-goods-item" style="border-width: 0.05rem 0 0 0;">
												<div class="huodong-top-title">
													<div class="main-title">{{item.data.right.bottom[2].title}}</div>
													<div class="sub-title">
														<span>{{item.data.right.bottom[2].subtitle}}</span>
													</div>
												</div>
												<navigator v-if="item.data.right.bottom[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.right.bottom[2].gid" class="goods-thumb">
													<block v-if="item.data.right.bottom[2].goods_info[0].goods_image">
														<image mode="widthFix" :src="item.data.right.bottom[2].goods_info[0].goods_image"></image>
													</block>
													<block v-else>
														<div class="empty-img"></div>
													</block>
												</navigator>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</view>

			<!--活动1 限时折扣 -->
			<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==1 && item.data.bottom.left[1].goods_info!=null && item.data.bottom.mid[2].goods_info!=null && item.data.bottom.right[3].goods_info!=null" :data-index="index">
				<div class="modules-huodong modules-slide">
					<div class="style_template">
						<div class="huodong-content style-1">
							<div class="huodong-top">
								<navigator url="/integral/activity/discount/discount">
									<div class="huodong-top-bg">
										<image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-1.jpg'"></image>
									</div>
									<div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
								</navigator>
							</div>
							<div class="huodong-main">
								<!--  -->
								<div class="huodong-goods-list">
									<div class="huodong-goods-item">
										<block v-if="item.data.bottom.left[1].gid && item.data.bottom.left[1].goods_info[0].extend_data">
											<div class="huodong-top-title">
												<div class="main-title">{{item.data.bottom.left[1].title}}</div>
												<div class="sub-title">
													<span>{{item.data.bottom.left[1].subtitle}}</span>
												</div>
												<div class="countdown" v-if="item.data.bottom.left[1].gid" :data-end_time_str="item.data.bottom.left[1].goods_info[0].extend_data.sld_end_time">
													<div class="countdown-main">
														<span class="hours countdown-num">{{huodong_1[0].hours}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="min countdown-num">{{huodong_1[0].minutes}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="sec countdown-num">{{huodong_1[0].seconds}}</span>
													</div>
												</div>
											</div>
											<navigator v-if="item.data.bottom.left[1].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.left[1].goods_info[0].gid" class="goods-thumb">
												<block v-if="item.data.bottom.left[1].gid && item.data.bottom.left[1].goods_info[0].goods_image">
													<image mode="widthFix" :src="item.data.bottom.left[1].goods_info[0].goods_image"></image>
												</block>
												<block v-else>
													<div class="empty-img"></div>
												</block>
											</navigator>
											<div class="huodong-style-1-bottom" v-if="item.data.bottom.left[1].gid">
												<div class="goods-price">
													<div class="sale-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.left[1].goods_info[0].promotion_price}}</span>
													</div>
													<div class="market-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.left[1].goods_info[0].goods_marketprice}}</span>
													</div>
												</div>
												<div class="goods-bottom-button">
													<a href="javascript:;">{{$L('抢')}}</a>
												</div>
											</div>
										</block>
										<block v-else>
											<div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
												<p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
											</div>
										</block>
									</div>
									<div class="huodong-goods-item">
										<block v-if="item.data.bottom.mid[2].gid && item.data.bottom.mid[2].goods_info[0].extend_data">
											<div class="huodong-top-title">
												<div class="main-title">{{item.data.bottom.mid[2].title}}</div>
												<div class="sub-title">
													<span>{{data.bottom.mid[2].subtitle}}</span>
												</div>
												<div class="countdown" v-if="item.data.bottom.mid[2].gid" :data-end_time_str="item.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time">
													<div class="countdown-main">
														<span class="hours countdown-num">{{huodong_1[1].hours}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="min countdown-num">{{huodong_1[1].minutes}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="sec countdown-num">{{huodong_1[1].seconds}}</span>
													</div>
												</div>
											</div>
											<navigator v-if="item.data.bottom.mid[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-thumb">
												<block v-if="item.data.bottom.mid[2].goods_info[0].goods_image">
													<image mode="widthFix" :src="item.data.bottom.mid[2].goods_info[0].goods_image"></image>
												</block>
												<block v-else>
													<div class="empty-img"></div>
												</block>
											</navigator>
											<div class="huodong-style-1-bottom" v-if="item.data.bottom.mid[2].gid">
												<div class="goods-price">
													<div class="sale-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.mid[2].goods_info[0].promotion_price}}</span>
													</div>
													<div class="market-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.mid[2].goods_info[0].goods_marketprice}}</span>
													</div>
												</div>
												<div class="goods-bottom-button">
													<a href="javascript:;">{{$L('抢')}}</a>
												</div>
											</div>
										</block>
										<block v-else>
											<div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
												<p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
											</div>
										</block>
									</div>
									<div class="huodong-goods-item">
										<block v-if="item.data.bottom.right[3].gid && item.data.bottom.right[3].goods_info[0].extend_data">
											<div class="huodong-top-title">
												<div class="main-title">{{item.data.bottom.right[3].title}}</div>
												<div class="sub-title">
													<span>{{item.data.bottom.right[3].subtitle}}</span>
												</div>
												<div class="countdown" v-if="item.data.bottom.right[3].gid" :data-end_time_str="item.data.bottom.right[3].goods_info[0].extend_data.sld_end_time">
													<div class="countdown-main">
														<span class="hours countdown-num">{{huodong_1[2].hours}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="min countdown-num">{{huodong_1[2].minutes}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="sec countdown-num">{{huodong_1[2].seconds}}</span>
													</div>
												</div>
											</div>
											<navigator v-if="item.data.bottom.right[3].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.right[3].goods_info[0].gid" class="goods-thumb">
												<block v-if="item.data.bottom.right[3].goods_info[0].goods_image">
													<image mode="widthFix" :src="item.data.bottom.right[3].goods_info[0].goods_image"></image>
												</block>
												<block v-else>
													<div class="empty-img"></div>
												</block>
											</navigator>
											<div class="huodong-style-1-bottom" v-if="item.data.bottom.right[3].gid">
												<div class="goods-price">
													<div class="sale-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.right[3].goods_info[0].promotion_price}}</span>
													</div>
													<div class="market-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.right[3].goods_info[0].goods_marketprice}}</span>
													</div>
												</div>
												<div class="goods-bottom-button">
													<a href="javascript:;">{{$L('抢')}}</a>
												</div>
											</div>
										</block>
										<block v-else>
											<div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
												<p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
											</div>
										</block>
									</div>
								</div>
								<!--  -->
							</div>
						</div>
					</div>
				</div>
			</view>

			<!--活动2 团购 -->
			<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==2 && item.data.bottom.mid[2].goods_info!=null" :data-index="index">
				<!--  -->
				<div class="modules-huodong modules-slide">
					<div class="style_template">

						<div class="huodong-content style-2">
							<div class="huodong-top">
								<navigator url="/integral/activity/tuan_index/tuan_index">
									<div class="huodong-top-bg">
										<image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-2.jpg'"></image>
									</div>
									<div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
								</navigator>
							</div>
							<div class="huodong-main" style="position: relative;">
								<image style=" width:100%;height:333.5rpx; position:absolute;z-index:-10;left:0;top:0" :src="img_url+'huodong_main_bg-2.jpg'"></image>
								<div class="huodong-goods-list">
									<div class="huodong-goods-item">
										<block v-if="item.data.bottom.mid[2].gid && item.data.bottom.mid[2].goods_info[0].extend_data">
											<navigator v-if="item.data.bottom.mid[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-thumb">
												<block v-if="item.data.bottom.mid[2].goods_info[0].goods_image">
													<image mode="widthFix" :src="item.data.bottom.mid[2].goods_info[0].goods_image"></image>
												</block>
												<block v-else>
													<div class="empty-img"></div>
												</block>
											</navigator>
											<div class="huodong-style-2-right">
												<div class="countdown" v-if="item.data.bottom.mid[2].gid" :data-end_time_str="item.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time">
													<div class="countdown-main">
														<span class="hours countdown-num">{{huodong_2.hours}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="min countdown-num">{{huodong_2.minutes}}</span>
														<span class="countdown-break-flag">:</span>
														<span class="sec countdown-num">{{huodong_2.seconds}}</span>
													</div>
												</div>
												<div class="main-title">{{item.data.bottom.mid[2].title}}</div>
												<div v-if="item.data.bottom.mid[2].gid" class="goods-price">
													<div class="sale-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.mid[2].goods_info[0].promotion_price}}</span>
													</div>
													<div class="market-price">
														{{$L('¥')}}
														<span class="money-number">{{item.data.bottom.mid[2].goods_info[0].goods_marketprice}}</span>
													</div>
												</div>
												<div class="goods-other">
													<div class="goods-tuan-info">
														{{$L('已团')}}
														<span>{{item.data.bottom.mid[2].goods_info[0].extend_data.buyed_quantity}}</span>{{$L('件')}}
													</div>
													<div class="goods-tuan-btn">
														<navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-tuan-btn-navigator">
															<span>{{$L('立即团')}}</span>
															<span class="arrow-right">></span>
														</navigator>
													</div>
												</div>
											</div>
										</block>
										<block v-else>
											<div style="text-align: center;font-size: 20rpx;height: 100%;line-height: 230rpx;display: table;padding: 20rpx;margin: 0 auto;">
												<p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择团购活动')}}</p>
											</div>
										</block>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
				<!--  -->
			</view>

		</view>
	</block>

</template>