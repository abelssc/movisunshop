<template name="nav_navigator">

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
	<navigator v-if="childitem.url_type_new=='goods' && childitem.url_new!=''" :url="'/pages/goods_detail/goods_detail?gid=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转商品详情页end  -->

	<!--跳转关键词搜索start  -->
	<navigator v-if="(childitem.url_type_new=='keyword'||childitem.url_type_new=='goodslist') && childitem.url_new!=''" :url="'/pages/goods_list/goods_list?keyword=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转关键词搜索end  -->

	<!--跳转专题页start  -->
	<navigator v-if="childitem.url_type_new=='special' && childitem.url_new!=''" :url="'/pages/found/subject?u=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转专题页end  -->

	<!--跳转分类id商品列表页start  -->
	<navigator v-if="childitem.url_type_new=='goodscat' && childitem.url_new!=''" :url="'/pages/goods_list/goods_list?gc_id=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转分类id商品列表页end  -->
	<!--跳转店铺页start  -->
	<navigator v-if="childitem.url_type_new=='vendor' && childitem.url_new!=''" :url="'/pages/shopHomePage/shopHomePage?vid=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转店铺页end  -->
	<!--跳转签到start  -->
	<navigator v-if="childitem.url_type_new=='sighlogin'" url="/pages/found/import?u=/cwap_user_points_xcx.html&id=1" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--跳转签到end  -->
	<!--跳转分类页start  -->
	<navigator v-if="childitem.url_type_new=='fenlei'" :url="'/pages/found/subject?u=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
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
	<navigator v-if="childitem.url_type_new=='tuan_index'" url="/integral/activity/tuan_index/tuan_index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--团购列表页end  -->
	<!--限时折扣列表页start  -->
	<navigator v-if="childitem.url_type_new=='xianshi_index'" url="/integral/activity/discount/discount" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--限时折扣列表页end  -->

	<!--预售start  -->
	<navigator v-if="childitem.url_type_new=='presale_home'" url="/addons/pages/presaleIndex/presaleIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
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
	<navigator v-if="childitem.url_type_new=='ldj_store'" :url="'/ldj/pages/store/store?vid=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<navigator v-else-if="childitem.url_type_new=='ldj_goods'" :url="'/ldj/pages/goods_detail/goods_detail?gid=' + childitem.url_new.gid + '&vid=' + childitem.url_new.vid" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<navigator v-else-if="childitem.url_type_new=='ldj_goodslist'" :url="'/ldj/pages/ldj_search/ldj_search?val=' + childitem.url_new" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
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
</template>