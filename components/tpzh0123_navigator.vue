<template name="tpzh0123_navigator">
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
	<navigator v-if="(item['data'][4].url_type_new == 'keyword' || item['data'][4].url_type_new == 'goodslist') && item['data'][4].url_new != ''" :url="'/pages/goods_list/goods_list?keyword=' + item['data'][4].url_new">
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
</template>