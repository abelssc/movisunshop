<template>
	<view>
		<!--首页 推荐 装修  -->
		<template name="fixtrue">
			<block v-if="home_info">
				<view v-for="(item, index) in home_info" :key="index">
					<!--轮播模块  -->
					<view data-type="lunbo" v-if="item.type == 'lunbo'" :data-index="index">
						<swiper circular="true" class="home_lunbo" :autoplay="autoplay + ' '" :interval="(interval?interval:3000) + ' '"
						 :duration="(duration?duration:600) + ' '" :style="'height:' + item.height + 'rpx'">
							<block v-for="(childitem, index2) in item.data" :key="index2">
								<swiper-item>
									<block v-if="childitem.url_type=='url'">
										<block data-type="template" data-is="luno_navigator" data-attr="childitem">
											<!--跳转商品详情页start  -->
											<navigator v-if="childitem.url_type_new=='goods' && childitem.url_new!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(childitem.url_type_new=='keyword'||childitem.url_type_new=='goodslist') && childitem.url_new!=''"
											 :url="'/pages/goods_list/goods_list?keyword=' + childitem.url_new" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="childitem.url_type_new=='special' && childitem.url_new!=''" :url="'/pages/found/subject?u=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="childitem.url_type_new=='goodscat' && childitem.url_new!=''" :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="childitem.url_type_new=='vendor' && childitem.url_new!=''" :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="childitem.url_type_new=='sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="childitem.url_type_new=='fenlei' && childitem.url_new!=''" :url="'/pages/found/subject?u=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="childitem.url_type_new=='voucherlist'" url="/pages/red/red_get_list" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="childitem.url_type_new=='cart'" url="/pages/cart/cart" open-type="switchTab" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="childitem.url_type_new=='usercenter'" url="/pages/user/user" open-type="switchTab"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="childitem.url_type_new=='pin_index'" url="/integral/activity/pin_index/pin_index"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="childitem.url_type_new=='tuan_index'" url="/integral/activity/tuan_index/tuan_index"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="childitem.url_type_new=='xianshi_index'" url="/integral/activity/discount/discount"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--跳转积分商城首页start  -->
											<navigator v-if="childitem.url_type_new=='points_shop'" url="/integral/pages/index/index" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="childitem.url_type_new=='ldj'" url="/ldj/pages/index/index" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street start  -->
											<navigator v-if="childitem.url_type_new=='vendorlist'" url="/pages/shoplist/shoplist" hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转street end  -->

											<!--跳转预售 start  -->
											<navigator v-if="childitem.url_type_new=='presale_home'" url="/addons/pages/presaleIndex/presaleIndex"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转预售 end  -->

											<!--跳转阶梯团 start  -->
											<navigator v-if="childitem.url_type_new=='ladder_home'" url="/addons/pages/ladderIndex/ladderIndex"
											 hover-class="navigator-hover ">
												<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
											</navigator>
											<!--跳转阶梯团 end  -->
											<navigator v-if="childitem.url_type_new=='ldj_store'" :url="'/ldj/pages/store/store?vid=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" class="slide-image " :src="childitem.img"></image>
											</navigator>
											<navigator v-else-if="childitem.url_type_new=='ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + childitem.url_new.gid + '&vid=' + childitem.url_new.vid"
											 hover-class="navigator-hover ">

												<image mode="widthFix" class="slide-image " :src="childitem.img"></image>
											</navigator>
											<navigator v-else-if="childitem.url_type_new=='ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + childitem.url_new"
											 hover-class="navigator-hover ">
												<image mode="widthFix" class="slide-image " :src="childitem.img"></image>
											</navigator>

											<!--url_type_new为空的情况start  -->
											<navigator v-if="childitem.url_type_new==''">
												<image mode="widthFix" :src="childitem.img" class="slide-image "></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'../goods_detail/goods_detail?gid=' + childitem.url"
										 hover-class="navigator-hover ">
											<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
										</navigator>
										<navigator v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'../found/subject?u=' + childitem.url">
											<image mode="widthFix" :src="childitem.img + ' '" class="slide-image "></image>
										</navigator>
										<navigator v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'../goods_list/goods_list?keyword=' + childitem.url">
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
												<block data-type="template" data-is="nav_navigator" data-attr="childitem,item:item">

													<!--跳转积分商城首页start  -->
													<navigator v-if="childitem.url_type_new=='points_shop'" url="/integral/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转积分商城首页end  -->
													<!--跳转联到家首页start  -->
													<navigator v-if="childitem.url_type_new=='ldj'" url="/ldj/pages/index/index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转联到家首页end  -->
													<!--跳转street 首页start  -->
													<navigator v-if="childitem.url_type_new=='vendorlist'" url="/pages/shoplist/shoplist" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转street 首页end  -->

													<!--跳转商品详情页start  -->
													<navigator v-if="childitem.url_type_new=='goods' && childitem.url_new!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转商品详情页end  -->

													<!--跳转关键词搜索start  -->
													<navigator v-if="(childitem.url_type_new=='keyword'||childitem.url_type_new=='goodslist') && childitem.url_new!=''"
													 :url="'/pages/goods_list/goods_list?keyword=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转关键词搜索end  -->

													<!--跳转专题页start  -->
													<navigator v-if="childitem.url_type_new=='special' && childitem.url_new!=''" :url="'/pages/found/subject?u=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转专题页end  -->

													<!--跳转分类id商品列表页start  -->
													<navigator v-if="childitem.url_type_new=='goodscat' && childitem.url_new!=''" :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转分类id商品列表页end  -->
													<!--跳转店铺页start  -->
													<navigator v-if="childitem.url_type_new=='vendor' && childitem.url_new!=''" :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转店铺页end  -->
													<!--跳转签到start  -->
													<navigator v-if="childitem.url_type_new=='sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转签到end  -->
													<!--跳转分类页start  -->
													<navigator v-if="childitem.url_type_new=='fenlei'" :url="'/pages/found/subject?u=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转分类页end  -->

													<!--跳转优惠券列表start  -->
													<navigator v-if="childitem.url_type_new=='voucherlist'" url="/pages/red/red_get_list" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转优惠券列表end  -->
													<!--跳转购物车start  -->
													<navigator v-if="childitem.url_type_new=='cart'" url="/pages/cart/cart" open-type="switchTab" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转购物车end  -->
													<!--跳转个人中心start  -->
													<navigator v-if="childitem.url_type_new=='usercenter'" url="/pages/user/user" open-type="switchTab" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--跳转个人中心end  -->
													<!--拼团列表页start  -->
													<navigator v-if="childitem.url_type_new=='pin_index'" url="/integral/activity/pin_index/pin_index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--拼团列表页end  -->
													<!--团购列表页start  -->
													<navigator v-if="childitem.url_type_new=='tuan_index'" url="/integral/activity/tuan_index/tuan_index"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--团购列表页end  -->
													<!--限时折扣列表页start  -->
													<navigator v-if="childitem.url_type_new=='xianshi_index'" url="/integral/activity/discount/discount"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--限时折扣列表页end  -->

													<!--预售start  -->
													<navigator v-if="childitem.url_type_new=='presale_home'" url="/addons/pages/presaleIndex/presaleIndex"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--预售end  -->

													<!--阶梯团start  -->
													<navigator v-if="childitem.url_type_new=='ladder_home'" url="/addons/pages/ladderIndex/ladderIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<navigator v-if="childitem.url_type_new=='ldj_store'" :url="'/ldj/pages/store/store?vid=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<navigator v-else-if="childitem.url_type_new=='ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + childitem.url_new.gid + '&vid=' + childitem.url_new.vid"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<navigator v-else-if="childitem.url_type_new=='ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + childitem.url_new"
													 :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--阶梯团end  -->

													<!--url_type_new为空的情况start  -->
													<navigator v-if="childitem.url_type_new==''" url="/pages/index/index" open-type="switchTab" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
														<span class="name_wrap" :style="'width:' + item.slide + 'px'">
															<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
														</span>
														<span>{{childitem.name}}</span>
													</navigator>
													<!--url_type_new为空的情况end  -->
												</block>

											</block>
											<block v-else-if="childitem.url_type=='coupon'">
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-if="childitem.url_type=='goods' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else-if="childitem.url_type=='special' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :data-id="childitem.url" @tap="ReceiveCoupon">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else :data-id="childitem.url" @tap="ReceiveCoupon">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
											</block>
											<block v-else>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'../goods_detail/goods_detail?gid=' + childitem.url">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'../found/subject?u=' + childitem.url">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'../goods_list/goods_list?keyword=' + childitem.url">
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
													</span>
													<span>{{childitem.name}}</span>
												</navigator>
												<navigator :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')"
												 v-else>
													<span class="name_wrap" :style="'width:' + item.slide + 'px;'">
														<image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
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
					<!-- <view data-type="tuijianshangpin" v-if="item.type == 'tuijianshangpin'" :data-index="index">
						<div :class="'index_block goods ' + (item.isshow_title == '0'&&item.isshow_price == '0'?'hide_title hide_price':'') + ' ' + (item.isshow_title == '0'&&item.isshow_price == '1'?'hide_title':'') + ' ' + (item.isshow_title == '1'&&item.isshow_price == '0'?'hide_price':'')">
							<div class="content">
								<div v-for="(childitem, index2) in item.data.goods_info" :key="index2" :class="'goods-item goods-' + item.show_style">
									<view class="navigator">
										<div class="goods-item-pic">
											<navigator :url="'../goods_detail/goods_detail?gid=' + childitem.gid">
												<image :src="childitem.goods_image" alt></image>
											</navigator>
										</div>
										<div class="goods-item-name">{{childitem.goods_name}}</div>
										<div class="goods-item-price d2">
											<em class="bigprice">{{childitem.show_price}}积分</em>
											<em class="bigprice2">售价：{{$L('￥')}}{{childitem.pgoods_price}}</em>
										</div>
										<view class="tbuy">
											<view :data-id="childitem.gid" @tap="cart">
												<image :src="img_url+'integral/cart.png'" mode="widthFix"></image>
											</view>
											<view :data-id="childitem.gid" @tap="buy">
												立即兑换
											</view>
										</view>
									</view>
								</div>
							</div>
						</div>
					</view>
 -->
					<!--图片组合0123  -->
					<view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style<4" :data-index="index">
						<div class="modules-slide">
							<div :class="'image-list style' + item.sele_style" :data-id="item.sele_style">
								<ul class="clearfix">
									<li v-for="(childitem, index2) in item.data" :key="index2">
										<block v-if="childitem.url_type=='url'">
											<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem,type:'0'">
												<!--跳转积分商城首页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转积分商城首页end  -->
												<!--跳转联到家首页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--跳转联到家首页end  -->
												<!--跳转street 首页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--跳转street 首页end  -->
												<!--跳转商品详情页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转商品详情页end  -->

												<!--跳转关键词搜索start  -->
												<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
												 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转关键词搜索end  -->

												<!--跳转专题页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转专题页end  -->

												<!--跳转分类id商品列表页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转分类id商品列表页end  -->
												<!--跳转店铺页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转店铺页end  -->
												<!--跳转签到start  -->
												<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转签到end  -->
												<!--跳转分类页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转分类页end  -->

												<!--跳转优惠券列表start  -->
												<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转优惠券列表end  -->
												<!--跳转购物车start  -->
												<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转购物车end  -->
												<!--跳转个人中心start  -->
												<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--跳转个人中心end  -->
												<!--拼团列表页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--拼团列表页end  -->
												<!--团购列表页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--团购列表页end  -->
												<!--限时折扣列表页start  -->
												<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--限时折扣列表页end  -->

												<!--预售start  -->
												<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--预售end  -->

												<!--阶梯团start  -->
												<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
													<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
												</navigator>
												<!--阶梯团end  -->

												<!--url_type_new为空的情况start  -->
												<navigator v-if="item['data'][4].url_type_new == ''">
													<image mode="widthFix" :src="item['data'][4].img"></image>
												</navigator>
												<!--url_type_new为空的情况end  -->
											</block>
										</block>
										<block v-else>
											<navigator v-if="childitem.url_type=='goods' && childitem.url!=''" :url="'../goods_detail/goods_detail?gid=' + childitem.url">
												<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
											</navigator>
											<navigator v-else-if="childitem.url_type=='special' && childitem.url!=''" :url="'../found/subject?u=' + childitem.url">
												<image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
											</navigator>
											<navigator v-else-if="childitem.url_type=='keyword' && childitem.url!=''" :url="'../goods_list/goods_list?keyword=' + childitem.url">
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
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][0],type:'1'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'../found/subject?u=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
									</block>
								</div>
								<div>
									<block v-if="item['data'][1].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][1],type:'1'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'../found/subject?u=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
									</block>
									<block v-if="item['data'][2].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][2],type:'1'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'../found/subject?u=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][2].url">
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
										<block data-type="template" data-is="tpzh5_navigator" data-attr="childitem:item['data'][0],type:'small'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goods' && item['data'][3].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][3].url_type_new == 'keyword' || item['data'][3].url_type_new == 'goodslist') && item['data'][3].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url_new" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'special' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goodscat' && item['data'][3].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendor' && item['data'][3].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][3].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'fenlei' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][3].url_type_new == 'voucherlist'" url="/pages/red/red_get_list" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][3].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][3].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][3].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][3].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator class="small" v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator class="small" v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'../found/subject?u=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator class="small" v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator class="small" v-else>
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][1].url_type=='url'">
										<block data-type="template" data-is="tpzh5_navigator" data-attr="childitem:item['data'][1],type:'big'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goods' && item['data'][3].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][3].url_type_new == 'keyword' || item['data'][3].url_type_new == 'goodslist') && item['data'][3].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url_new" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'special' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goodscat' && item['data'][3].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendor' && item['data'][3].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][3].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'fenlei' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][3].url_type_new == 'voucherlist'" url="/pages/red/red_get_list" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][3].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][3].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][3].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][3].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator class="big" v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator class="big" v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'../found/subject?u=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator class="big" v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator class="big" v-else>
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
									</block>
								</div>
								<div class="clearfix">
									<block v-if="item['data'][2].url_type=='url'">
										<block data-type="template" data-is="tpzh5_navigator" data-attr="childitem:item['data'][2],type:'big'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goods' && item['data'][3].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][3].url_type_new == 'keyword' || item['data'][3].url_type_new == 'goodslist') && item['data'][3].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url_new" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'special' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goodscat' && item['data'][3].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendor' && item['data'][3].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][3].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'fenlei' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][3].url_type_new == 'voucherlist'" url="/pages/red/red_get_list" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][3].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][3].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][3].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][3].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator class="big" v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator class="big" v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'../found/subject?u=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator class="big" v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator class="big" v-else>
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][3].url_type=='url'">
										<block data-type="template" data-is="tpzh5_navigator" data-attr="childitem:item['data'][3],type:'small'">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goods' && item['data'][3].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][3].url_type_new == 'keyword' || item['data'][3].url_type_new == 'goodslist') && item['data'][3].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][3].url_new" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'special' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'goodscat' && item['data'][3].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'vendor' && item['data'][3].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][3].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'fenlei' && item['data'][3].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][3].url_new"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][3].url_type_new == 'voucherlist'" url="/pages/red/red_get_list" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][3].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab" :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][3].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab"
											 :class="'small'">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][3].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][3].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][3].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][3].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][3].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][3].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator class="small" v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator class="small" v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'../found/subject?u=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator class="small" v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][3].url">
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
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][0]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'../found/subject?u=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][1].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][1]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'../found/subject?u=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
									</block>
								</div>
								<div>
									<block v-if="item['data'][2].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][2]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'../found/subject?u=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][3].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][3]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>
									</block>
									<block v-else>
										<navigator v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'../found/subject?u=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][3].url">
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
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][0]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][0].url_type=='goods' && item['data'][0].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='special' && item['data'][0].url!=''" :url="'../found/subject?u=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][0].url_type=='keyword' && item['data'][0].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][0].url">
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][0].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][1].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][1]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][1].url_type=='goods' && item['data'][1].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='special' && item['data'][1].url!=''" :url="'../found/subject?u=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][1].url_type=='keyword' && item['data'][1].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][1].url">
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][1].img"></image>
										</navigator>
									</block>
								</div>
								<div>
									<block v-if="item['data'][2].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][2]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][2].url_type=='goods' && item['data'][2].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='special' && item['data'][2].url!=''" :url="'../found/subject?u=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][2].url_type=='keyword' && item['data'][2].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][2].url">
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][2].img"></image>
										</navigator>
									</block>

									<block v-if="item['data'][3].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][3]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][3].url_type=='goods' && item['data'][3].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][3].url_type=='special' && item['data'][3].url!=''" :url="'../found/subject?u=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][3].url_type=='keyword' && item['data'][3].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][3].url">
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
										<navigator v-else>
											<image mode="widthFix" :src="item['data'][3].img"></image>
										</navigator>
									</block>
								</div>
								<div>
									<block v-if="item['data'][4].url_type=='url'">
										<block data-type="template" data-is="tpzh0123_navigator" data-attr="childitem:item['data'][4]">
											<!--跳转积分商城首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'points_shop'" url="/integral/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_store'" :url="'/ldj/pages/store/store?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new.gid + '&vid=' + item['data'][4].url_new.vid">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<navigator v-else-if="item['data'][4].url_type_new == 'ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转积分商城首页end  -->
											<!--跳转联到家首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ldj'" url="/ldj/pages/index/index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转联到家首页end  -->
											<!--跳转street 首页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendorlist'" url="/pages/shoplist/shoplist">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--跳转street 首页end  -->
											<!--跳转商品详情页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goods' && item['data'][4].url_new != ''" :url="'/pages/goods_detail/goods_detail?gid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转商品详情页end  -->

											<!--跳转关键词搜索start  -->
											<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''"
											 :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转关键词搜索end  -->

											<!--跳转专题页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'special' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转专题页end  -->

											<!--跳转分类id商品列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'goodscat' && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?gc_id=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类id商品列表页end  -->
											<!--跳转店铺页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'vendor' && item['data'][4].url_new != ''" :url="'/pages/shopHomePage/shopHomePage?vid=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转店铺页end  -->
											<!--跳转签到start  -->
											<navigator v-if="item['data'][4].url_type_new == 'sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转签到end  -->
											<!--跳转分类页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'fenlei' && item['data'][4].url_new != ''" :url="'/pages/found/subject?u=' + item['data'][4].url_new">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转分类页end  -->

											<!--跳转优惠券列表start  -->
											<navigator v-if="item['data'][4].url_type_new == 'voucherlist'" url="/pages/red/red_get_list">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转优惠券列表end  -->
											<!--跳转购物车start  -->
											<navigator v-if="item['data'][4].url_type_new == 'cart'" url="/pages/cart/cart" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转购物车end  -->
											<!--跳转个人中心start  -->
											<navigator v-if="item['data'][4].url_type_new == 'usercenter'" url="/pages/user/user" open-type="switchTab">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--跳转个人中心end  -->
											<!--拼团列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'pin_index'" url="/integral/activity/pin_index/pin_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--拼团列表页end  -->
											<!--团购列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'tuan_index'" url="/integral/activity/tuan_index/tuan_index">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--团购列表页end  -->
											<!--限时折扣列表页start  -->
											<navigator v-if="item['data'][4].url_type_new == 'xianshi_index'" url="/integral/activity/discount/discount">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--限时折扣列表页end  -->

											<!--预售start  -->
											<navigator v-if="item['data'][4].url_type_new == 'presale_home'" url="/addons/pages/presaleIndex/presaleIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--预售end  -->

											<!--阶梯团start  -->
											<navigator v-if="item['data'][4].url_type_new == 'ladder_home'" url="/addons/pages/ladderIndex/ladderIndex">
												<image mode="widthFix" :src="item['data'][4].img + ' '"></image>
											</navigator>
											<!--阶梯团end  -->

											<!--url_type_new为空的情况start  -->
											<navigator v-if="item['data'][4].url_type_new == ''">
												<image mode="widthFix" :src="item['data'][4].img"></image>
											</navigator>
											<!--url_type_new为空的情况end  -->
										</block>

									</block>
									<block v-else>
										<navigator v-if="item['data'][4].url_type=='goods' && item['data'][4].url!=''" :url="'../goods_detail/goods_detail?gid=' + item['data'][4].url">
											<image mode="widthFix" :src="item['data'][4].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][4].url_type=='special' && item['data'][4].url!=''" :url="'../found/subject?u=' + item['data'][4].url">
											<image mode="widthFix" :src="item['data'][4].img"></image>
										</navigator>
										<navigator v-else-if="item['data'][4].url_type=='keyword' && item['data'][4].url!=''" :url="'../goods_list/goods_list?keyword=' + item['data'][4].url">
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

					<!--富文本  -->
					<!-- <view data-type='fuwenben'  wx:if="{{item.type == 'fuwenben'}}">
	  		<div class="fuwenben_part">
				{{item.text}}
			</div>
		</view> -->

					<!--富文本 start -->
					<view data-type="fuwenben" v-if="item.type == 'fuwenben'" :data-index="index">
						<div class="fuwenben_part">
							<block data-type="template" data-is="entry" data-attr="...item.article">
								<view :class="'h2w h2w-' + theme">
									<view class="h2w__main">
										<!--<import src="./renderTemplate.wxml"></import>-->
										<block v-for="(item, index) in child" :key="index">
											<template is="m0" :data="item"></template>
										</block>
									</view>
								</view>
							</block>
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
								<block data-type="template" data-is="gonggao_promote" data-attr="item:item">
									<navigator url="/integral/activity/tuan_index/tuan_index" hover-class="none" v-if="item.lianjie_url=='cwap_tuan'">
										<text>{{item.text}}</text>
									</navigator>

									<navigator v-if="item.lianjie_url=='cwap_discount'" url="/integral/activity/discount/discount">
										<text>{{item.text}}</text>
									</navigator>

									<navigator v-if="item.lianjie_url=='pin_index'" url="/integral/activity/pin_index/pin_index">
										<text>{{item.text}}</text>
									</navigator>

									<navigator v-if="item.lianjie_url=='ladder'" url="/addons/pages/ladderIndex/ladderIndex">
										<text>{{item.text}}</text>
									</navigator>

									<navigator v-if="item.lianjie_url=='presale'" url="/addons/pages/presaleIndex/presaleIndex">
										<text>{{item.text}}</text>
									</navigator>
									<!--url为空的情况end  -->

									<!--url为空的情况start  -->
									<navigator v-if="item.lianjie_url==''" url="/pages/index/index" open-type="switchTab">
										<text>{{item.text}}</text>
									</navigator>
									<!--url为空的情况end  -->
								</block>
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
								<navigator :url="'../goods_detail/goods_detail?gid=' + dpitem.gid" class="wrap">
									<view class="img">
										<image :src="dpitem.goods_image"></image>
									</view>
									<text class="name">{{dpitem.goods_name}}</text>
									<view class="price">{{dpitem.show_price}}{{$L('积分')}}</view>
								</navigator>
							</view>
						</scroll-view>
					</view>
					<!-- 搭配 end -->


					<!-- 客服电话 start -->
					<view class="kefu" data-type="kefu" v-if="item.type == 'kefu'" :data-index="index">
						<view>{{item.text}} {{item.tel}}</view>
					</view>
					<!-- 客服电话 end -->

					<!--辅助空白    -->
					<view data-type="fzkb" v-if="item.type == 'fzkb'" :data-index="index">
						<div class="fzkb" :style="'width: 100%;height:' + item.text + 'px;background-color: #' + item.color"></div>
					</view>

					<!--辅助线  -->
					<view data-type="fzx" v-if="item.type == 'fzx'" :data-index="index">
						<div class="fzx_part">
							<div :class="'fzx_content fzx_' + item.val">
							</div>
						</div>
					</view>

					<!--活动0 拼团 -->
					<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==0  && item.data.left.top[0].goods_info!=null&& item.data.right.bottom[2].goods_info!=null && item.data.right.top[0].goods_info!=null"
					 :data-index="index">
						<div class="modules-huodong modules-slide">
							<div class="style_template">
								<div class="huodong-content">
									<div class="huodong-top">
										<navigator url="../found/import?u=/pin_index_xcx.html">
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
														<navigator :url="'../goods_detail/goods_detail?gid=' + item.data.left.top[0].gid">
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
															<navigator v-for="(goods_info_item, index2) in item.data.right.top[0].goods_info" :key="index2" class="huodong-goods-item"
															 :url="'../goods_detail/goods_detail?gid=' + goods_info_item.gid">
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
														<navigator v-if="item.data.right.bottom[1].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.right.bottom[1].gid"
														 class="goods-thumb">
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
														<navigator v-if="item.data.right.bottom[2].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.right.bottom[2].gid"
														 class="goods-thumb">
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
					<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==1 && item.data.bottom.left[1].goods_info!=null && item.data.bottom.mid[2].goods_info!=null && item.data.bottom.right[3].goods_info!=null"
					 :data-index="index">
						<div class="modules-huodong modules-slide">
							<div class="style_template">
								<div class="huodong-content style-1">
									<div class="huodong-top">
										<navigator url="../found/import?u=/cwap_discount_xcx.html">
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
													<navigator v-if="item.data.bottom.left[1].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.bottom.left[1].goods_info[0].gid"
													 class="goods-thumb">
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
													<navigator v-if="item.data.bottom.mid[2].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid"
													 class="goods-thumb">
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
													<navigator v-if="item.data.bottom.right[3].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.bottom.right[3].goods_info[0].gid"
													 class="goods-thumb">
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
					<view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==2 && item.data.bottom.mid[2].goods_info!=null"
					 :data-index="index">
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
													<navigator v-if="item.data.bottom.mid[2].gid" :url="'../goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid"
													 class="goods-thumb">
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
																<navigator :url="'../goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-tuan-btn-navigator">
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

		</view>
</template>

<script>
	export default {
		name: "fixture",
		data() {
			return {
				key: '',
			}
		},
		props: {
			home_info: {
				type: Array,
				value: []
			},
			img_url: {
				type: String,
				value: ''
			},
			autoplay: {
				type: Boolean,
				value: true
			},
			interval: {
				type: Number,
				value: 5000
			},
			duration: {
				type: Number,
				value: 1000
			},
		},
		methods: {
			checkLogin(cb) {
				let key = uni.getStorageSync('token');

				if (key) {
					this.setData({
						key
					});
					cb && cb(key);
				} else {
					getApp().globalData.goLogin();
				}
			},
			// 单件购买
			buy(e) {
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.navigateTo({
						url: '/integral/pages/Integral_order/Integral_order?ifcart=0&cart_id=' + gid + '|1'
					});
				});
			},

			//加入购物车
			cart(e) {
				debugger
				let that = this,
					gid = e.currentTarget.dataset.id;
				that.checkLogin(function(key) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=addcart&sld_addons=points',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key,
							num: 1,
							gid
						},
						success: function(res) {
							if (res.data.status == 200) {
								uni.showToast({
									title: that.$L('加入购物车成功'),
									icon: 'none'
								});
								uni.reLaunch({
									url: '/integral/pages/cart/cart'
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				});
			},
		}
	}
</script>

<style>
	.home_lunbo uni-image{
	    width: 100%;
	    height: 100%;
	}

	/*导航样式  */

	.modules-nav {
		display: block;
		clear: both;
		overflow: hidden;
	}

	.modules-nav div {
		box-sizing: border-box;
	}

	.mod-nav {
		display: flex;
	}

	.mod-nav li {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		min-width: 60rpx;
	}

	.mod-nav li a {
		display: block;
		text-align: center;
		color: #555;
		padding: 0 0 16rpx 0;
		overflow: hidden;
	}

	.mod-nav image {
		max-width: 100%;
		height: auto;
		vertical-align: middle;
	}

	.mod-nav li navigator span.name_wrap {
		display: block;
		width: 101rpx;
		margin: 0 auto;
	}

	.mod-tag-nav li navigator span.name_wrap {
		margin-right: 23rpx;
	}

	.modules-nav .mod-nav li navigator span {
		font-size: 26rpx;
		text-align: center;
	}

	.mod-nav li navigator>span {
		display: block;
		margin: 0 auto;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	@-webkit-keyframes myfirst {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@-webkit-keyframes endshow {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	@-webkit-keyframes infirst {
		from {
			opacity: 0.6;
		}

		to {
			opacity: 1;
		}
	}

	@-webkit-keyframes endfirst {
		from {
			background: rgba(255, 255, 255, 1);
		}

		to {
			background: rgba(255, 255, 255, 0.6);
		}
	}

	input.htsearch-input::-webkit-input-placeholder {
		color: #000;
	}

	.bgshow_top {
		animation: myfirst 1s;
		-moz-animation: myfirst 1s;
		/* Firefox */
		-webkit-animation: myfirst 1s;
		/* Safari 和 Chrome */
		-o-animation: myfirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.bghide_top {
		animation: endshow 1s;
		-moz-animation: endshow 1s;
		/* Firefox */
		-webkit-animation: endshow 1s;
		/* Safari 和 Chrome */
		-o-animation: endshow 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.inputtm_top {
		animation: infirst 1s;
		-moz-animation: infirst 1s;
		/* Firefox */
		-webkit-animation: infirst 1s;
		/* Safari 和 Chrome */
		-o-animation: infirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.inputntm_top {
		animation: endfirst 1s;
		-moz-animation: endfirst 1s;
		/* Firefox */
		-webkit-animation: endfirst 1s;
		/* Safari 和 Chrome */
		-o-animation: endfirst 1s;
		/* Opera */
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* Safari 和 Chrome */
	}

	.mod-tag-nav {
		padding: 16rpx 16rpx 0 0;
		clear: both;
		overflow: hidden;
		box-sizing: border-box;
		display: block;
	}

	.mod-tag-nav li {
		width: 50%;
		float: left;
		padding: 0 0 16rpx 16rpx;
		box-sizing: border-box;
	}

	.modules-nav section {
		display: block;
	}

	.mod-tag-nav li navigator {
		display: block;
		background: #fff;
		color: #555;
		padding: 10rpx;
		line-height: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mod-tag-nav li navigator image {
		margin-right: 23rpx;
	}

	.mod-tag-nav li navigator span {
		font-size: 27rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.mod-nav.no-icon li navigator .name_wrap {
		display: none;
	}

	.mod-nav.no-icon li span {
		line-height: 80rpx;
	}

	.mod-nav.before-icon li span {
		padding: 0;
		line-height: 155rpx;
	}

	.mod-nav.before-icon li span>i,
	.mod-nav.before-icon li navigator>span {
		display: inline-block;
	}

	/*辅助空白样式  */

	.fzkb {
		display: block;
	}

	/*辅助线样式  */

	.fzx_part {
		margin: 10rpx 16rpx;
		height: 2rpx;
		display: block;
	}

	.fzx_part .fzx_content.fzx_solid,
	.fzx_part .fzx_content.fzx_dashed {
		position: relative;
	}

	.fzx_part .fzx_content.fzx_solid:after {
		height: 2rpx;
		content: '';
		width: 718rpx;
		border-top: 2rpx solid #e3e5e9;
		position: absolute;
		bottom: 0px;
		right: 0;
		left: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.fzx_part .fzx_content.fzx_dashed:after {
		height: 2rpx;
		content: '';
		width: 718rpx;
		border-top: 2rpx dashed #e3e5e9;
		position: absolute;
		bottom: 0px;
		right: 0;
		left: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	/*商品组合样式  */

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

	.goods .goods-small.goods-item:nth-child(2n) {
		margin-right: 10rpx;
	}

	.goods-small.goods-item {
		overflow: hidden;
		float: left;
		width: 360rpx;
		box-sizing: border-box;
		margin-bottom: 8rpx;
		position: relative;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		background-color: #fff;
		margin-left: 10rpx;
	}

	.goods-item .navigator {
		display: block;
		background: #fff;
	}

	.goods-item-pic {
		vertical-align: middle;
		line-height: 0;
		display: table-cell;
		text-align: center;
		width: 370rpx;
		height: 370rpx;
	}

	.goods-item-pic image {
		width: 367rpx;
		height: 367rpx;
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
		padding: 0 20rpx;
	}

	.goods-item-price {
		color: #f23030;
		display: inline-block;
		padding: 0 10rpx 0 8rpx;
		position: relative;
		top: 2rpx;
		height: 50rpx;
		line-height: 50rpx;
		margin-bottom: 20rpx;
	}

	.goods-item-price .yens {
		font-size: 26rpx;
	}

	.goods-item-price .bigprice {
		font-size: 30rpx;
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
		padding: 0 0 0 16rpx;
		box-sizing: border-box;
		display: block;
		clear: both;
		overflow: hidden;
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

	/* 活动模版 样式0 */
	.modules-huodong .huodong-content .huodong-top {
		height: 78.2rpx;
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.modules-huodong .huodong-content .huodong-top a {
		display: block;
		width: 100%;
		height: 100%;
	}

	.modules-huodong .huodong-content .huodong-top .huodong-top-bg {
		height: 78.2rpx;
	}

	.modules-huodong .huodong-content .huodong-top .huodong-top-title {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 78.2rpx;
		line-height: 87.4rpx;
		padding: 0 0 0 25%;
		font-size: 27.6rpx;
		color: rgb(199, 139, 89);
	}

	.modules-huodong .huodong-content .huodong-main {
		width: 100%;
		height: 460rpx;
		overflow: hidden;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left {
		width: 40%;
		height: 100%;
		float: left;
		position: relative;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout {
		text-align: center;
		margin: 18.4rpx 23rpx 0 23rpx;
		color: #FFFFFF;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .main-title {
		font-size: 32.2rpx;
		font-weight: bold;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .sub-title {
		font-size: 27.6rpx;
		height: 27.6rpx;
		line-height: 27.6rpx;
		overflow: hidden;
		margin: 9.2rpx 0;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .sub-title span {
		font-size: 46rpx;
		height: 55.2rpx;
		line-height: 55.2rpx;
		display: block;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
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

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods {
		clear: both;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout {
		padding: 23rpx;
		height: 317.4rpx;
		overflow: hidden;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout a {
		display: block;
	}

	.modules-huodong .huodong-content a:hover,
	.modules-huodong .huodong-content a:focus {
		color: #FFFFFF;
		text-decoration: none;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb {
		width: 138rpx;
		height: 138rpx;
		overflow: hidden;
		margin: 23rpx auto;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb img {
		width: 138rpx;
		height: 138rpx;
		overflow: hidden;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb .empty-img {
		width: 138rpx;
		height: 138rpx;
		overflow: hidden;
		background-color: #cccccc;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price {
		height: 32.2rpx;
		line-height: 32.2rpx;
		text-align: center;
		display: block;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .sale-price {
		color: rgb(252, 30, 39);
		width: 50%;
		float: left;
		font-size: 27.6rpx;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .sale-price .money-number {
		font-weight: bold;
		font-size: 43.7rpx;
		margin-left: 6.9rpx;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .market-price {
		color: rgb(171, 172, 173);
		width: 50%;
		float: left;
		font-size: 34.5rpx;
		text-decoration: line-through;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-other {
		clear: both;
		text-align: center;
		margin: 0rpx 23rpx;
		height: 46rpx;
		line-height: 46rpx;
		overflow: hidden;
		display: block;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-other .goods-extend-data {
		background-color: rgb(237, 26, 32);
		color: #FFFFFF;
		height: 92rpx;
		line-height: 92rpx;
		border-radius: 6.9rpx;
		font-size: 46rpx;
		margin: 0 auto;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right {
		width: 60%;
		height: 100%;
		float: left;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top {
		padding: 18.4rpx 23rpx 0rpx 23rpx;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .main-title {
		color: rgb(212, 45, 50);
		font-size: 32.2rpx;
		overflow: hidden;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .sub-title {
		height: 40rpx;
		line-height: 40rpx;
		overflow: hidden;
		color: rgb(128, 129, 130);
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .sub-title span {
		font-size: 46rpx;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
		display: block;
		color: #818181;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list {
		width: 100%;
		height: 144.9rpx;
		display: block;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list .huodong-goods-item {
		width: 124.2rpx;
		height: 124.2rpx;
		margin: 9.2rpx 11.5rpx 11.5rpx 0;
		float: left;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list .huodong-goods-item:last-child {
		margin: 9.2rpx 0 11.5rpx 0;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .goods-thumb {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .goods-thumb img {
		width: 100%;
		height: 100%;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .goods-thumb .empty-img {
		width: 100%;
		height: 100%;
		background-color: #cccccc;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom {
		height: 234.6rpx;
		width: 100%;
		display: block;
		overflow: hidden;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-list {
		width: 100%;
		height: 234.6rpx;
		display: block;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item {
		width: 40%;
		float: left;
		height: 234.6rpx;
		display: block;
		padding: 4.6rpx 23rpx 11.5rpx 23rpx;
		border-style: solid;
		border-width: 2.3rpx 2.3rpx 0 0;
		border-color: #cccccc;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item .main-title {
		color: rgb(224, 123, 39);
		overflow: hidden;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item .goods-thumb {
		width: 115rpx;
		height: 115rpx;
		display: block;
		overflow: hidden;
		margin: 0 auto;
	}

	.modules-huodong .huodong-content.style-1 .countdown {
		font-size: 30rpx;
	}

	.modules-huodong .huodong-content.style-1 .huodong-top .huodong-top-title {
		padding: 0 0 0 33%;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main {
		width: 100%;
		height: 437rpx;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list {
		width: 100%;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item {
		border-style: solid;
		border-color: #cccccc;
		border-width: 2.3rpx;
		width: 29%;
		height: 100%;
		text-align: center;
		padding: 18.4rpx 15.18rpx 9.2rpx 15.18rpx;
		float: left;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:first-child,
	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:last-child {
		border-width: 2.3rpx 0;
	}

	.modules-huodong .huodong-content.style-1 .countdown .countdown-main {
		float: none;
		color: #FFFFFF;
	}

	.modules-huodong .huodong-content.style-1 .countdown .countdown-num {
		background-color: rgb(101, 101, 101);
	}

	.modules-huodong .huodong-content.style-1 .countdown .countdown-main .countdown-break-flag {
		color: rgb(101, 101, 101);
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .main-title {
		color: rgb(235, 56, 221);
		font-size: 32.2rpx;
		overflow: hidden;

		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:first-child .huodong-top-title .main-title {
		color: rgb(56, 72, 223);
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:last-child .huodong-top-title .main-title {
		color: rgb(237, 93, 48);
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .sub-title {
		display: block;
		height: 32.2rpx;
		margin: 4.6rpx 0;

		overflow: hidden;
		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .sub-title span {
		font-size: 46rpx;
		display: block;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb {
		width: 100%;
		height: 170.2rpx;
		margin: 18.4rpx 0;
		overflow: hidden;
		display: block;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb .empty-img {
		width: 100%;
		height: 170.2rpx;
		overflow: hidden;
		background-color: #cccccc;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom {
		overflow: hidden;
		width: 100%;
		height: 78.2rpx;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price {
		float: left;
		width: 68%;
		height: 100%;
		overflow: hidden;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .sale-price {
		color: rgb(250, 30, 38);
		font-size: 27.6rpx;
		text-align: left;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .sale-price .money-number {
		color: rgb(250, 30, 38);
		font-size: 23rpx;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .market-price {
		text-decoration: line-through;
		text-align: left;
		color: rgb(192, 193, 194);
		font-size: 36.8rpx;
		display: block;
		-webkit-transform: scale(-0.5);
		width: 200%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-bottom-button {
		float: right;
		width: 18%;
		/*height: 100%;*/
		padding: 16.1rpx;
		overflow: hidden;
	}

	.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-bottom-button a {
		background-color: rgb(251, 30, 38);
		color: #FFFFFF;
		width: 46rpx;
		height: 46rpx;
		display: block;
		text-align: center;
		line-height: 46rpx;
		font-size: 27.6rpx;
		border-radius: 23rpx;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main {
		width: 100%;
		height: 333.5rpx;
		overflow: hidden;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list {
		width: 100%;
		height: 100%;
		margin: 32.2rpx 50.6rpx 36.8rpx 48.3rpx;
		width: 639.4rpx;
		display: block;
		height: 266.8rpx;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item {
		width: 639.4rpx;
		height: 266.8rpx;
		padding: 18.4rpx 0 18.4rpx 18.4rpx;
		display: block;
		overflow: hidden;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb {
		width: 230rpx;
		height: 230rpx;
		display: block;
		overflow: hidden;
		float: left;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb .empty-img {
		width: 100%;
		height: 100%;
		display: block;
		overflow: hidden;
		background-color: #cccccc;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right {
		float: right;
		width: 368rpx;
		height: 230rpx;
		padding: 6.9rpx 18.4rpx;
		display: block;
		overflow: hidden;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .countdown {
		text-align: center;
		font-size: 17.11.5rpx;
		height: 41.4rpx;
		line-height: 41.4rpx;
		color: rgb(213, 69, 121);
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .countdown .countdown-num {
		height: 41.4rpx;
		line-height: 41.4rpx;
		color: #FFFFFF;
		background-color: rgb(213, 69, 121);
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .main-title {
		clear: both;
		height: 64.4rpx;
		margin: 6.9rpx 0 6.9rpx 0;
		line-height: 32.2rpx;
		font-size: 27.6rpx;
		overflow: hidden;
		display: inline-block;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: normal;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price {
		height: 32.2rpx;
		line-height: 32.2rpx;
		text-align: left;
		display: block;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .sale-price {
		color: rgb(252, 30, 39);
		width: 50%;
		float: left;
		font-size: 23rpx;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .sale-price .money-number {
		font-weight: bold;
		font-size: 27.6rpx;
		margin-left: 6.9rpx;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .market-price {
		color: rgb(171, 172, 173);
		width: 50%;
		float: left;
		font-size: 22rpx;
		text-decoration: line-through;
		line-height: 39.1rpx;
		text-align: right;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other {
		clear: both;
		height: 52.9rpx;
		line-height: 52.9rpx;
		margin: 13.8rpx 0 0 0;
		width: 100%;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-info {
		width: 60%;
		float: left;
		font-size: 25rpx;
		color: rgb(120, 121, 122);
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn {
		width: 35%;
		float: right;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn .goods-tuan-btn-navigator {
		display: inline-block;
		text-align: center;
		height: 92rpx;
		line-height: 92rpx;
		color: #FFFFFF;
		padding: 0 20.7rpx;
		border-radius: 46rpx;
		background-color: rgb(213, 69, 121);
		font-size: 36.8rpx;
		display: block;
		-webkit-transform: scale(-0.5);
		width: 170%;
		-webkit-transform: scale(.5);
		-ms-transform-origin: left top;
		transform-origin: left top;
		-webkit-transform-origin: left top;
		white-space: nowrap;
	}

	.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn .goods-tuan-btn-navigator span {
		margin: 0 0 0 11.5rpx;
	}


	.d2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
	}

	.d2 .bigprice2 {
		color: #726F6F;
		font-size: 20rpx;
	}

	.tbuy {
		display: flex;
		align-items: center;
		width: 338rpx;
		height: 48rpx;
		border-radius: 25rpx;
		text-align: center;
		border: 1rpx solid #EE2328;
		margin: 0 auto 12rpx;
		overflow: hidden;
	}

	.tbuy>view {
		flex: 1;
	}

	.tbuy image {
		width: 30rpx;
	}

	.tbuy view:last-child {
		height: 100%;
		background-color: #EE2328;
		color: #fff;
		font-size: 24rpx;
		line-height: 48rpx;
	}



	.gonggao {
		position: relative;
		height: 76rpx;
		line-height: 76rpx;
		background-color: #eee;
		font-size: 26rpx;
		color: #666;
		overflow: hidden;
	}

	.gonggao .img {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 80rpx;
		text-align: center;
		background-color: #eee;
		z-index: 99;
	}

	.gonggao image {
		width: 40rpx;
		transform: translateY(10rpx);
	}

	.gonggao .ani {
		animation: mytransition 8s linear infinite;
	}

	@keyframes mytransition {
		from {
			transform: translateX(100%);
		}

		to {
			transform: translateX(0);
		}
	}

	.fuwenben_part {
		background: #fff;
		font-size: 26rpx;
		padding: 16rpx;
	}

	.fuwenben_part .wxParse-h1 {
		font-size: 36rpx;
		font-weight: 600;
	}

	.fuwenben_part .wxParse-h2 {
		font-size: 34rpx;
		font-weight: 600;
	}

	.fuwenben_part .wxParse-h3 {
		font-size: 32rpx;
	}

	.fuwenben_part .wxParse-h4 {
		font-size: 30rpx;
	}

	.fuwenben_part .wxParse-inline {
		display: inline;
	}

	.dapei {
		background-color: #fff;
		border-bottom: 1rpx solid #e2e2e2;
	}

	.dapei .dapei_top {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1rpx solid #e2e2e2;
	}

	.dapei_top .dp_tj {
		display: block;
		width: 100%;
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 0;
		font-weight: 600;
		text-align: center;
		border-bottom: 1rpx solid #e2e2e2;
	}

	.dapei_top image {
		width: 100%;
	}

	.dapei_top .dp_desc {
		font-size: 26rpx;
		padding: 7px;
	}

	.dapei scroll-view {
		width: 100%;
		/* height:376rpx; */
		white-space: nowrap;
	}

	.dapei scroll-view .dp_item {
		display: inline-block;
		width: 240rpx;
		height: 100%;
		margin-right: 15rpx;
	}

	.dapei scroll-view .dp_item:last-child {
		margin-right: 0;
	}

	.dapei .wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: left;
		overflow: hidden;
	}

	.dapei .wrap .img {
		width: 100%;
		height: 240rpx;
		overflow: hidden;
	}

	.dapei .wrap image {
		width: 100%;
		height: 100%;
	}

	.dapei .wrap .name {
		display: block;
		box-sizing: border-box;
		width: 100%;
		height: 60rpx;
		line-height: 30rpx;
		padding: 0 20rpx;
		margin-top: 15rpx;
		color: #333;
		font-size: 28rpx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.dapei .wrap .price {
		display: block;
		box-sizing: border-box;
		width: 100%;
		padding: 0 20rpx;
		color: #f23030;
		font-size: 30rpx;
		margin-bottom: 20rpx;
	}

	.kefu {
		padding: 20rpx;
		line-height: 35rpx;
		color: #333;
		font-size: 26rpx;
	}
	em{
		font-style: normal;
	}
</style>
