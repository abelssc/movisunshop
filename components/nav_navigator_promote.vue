<template name="nav_navigator_promote">

	<!--url为空的情况start  -->
	<navigator v-if="childitem.url=='cwap_tuan'" url="/integral/activity/tuan_index/tuan_index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>

	<navigator v-if="childitem.url=='cwap_discount'" url="/integral/activity/discount/discount" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>

	<navigator v-if="childitem.url=='pin_index'" url="/integral/activity/pin_index/pin_index" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>

	<navigator v-if="childitem.url=='ladder'" url="/addons/pages/ladderIndex/ladderIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>

	<navigator v-if="childitem.url=='presale'" url="/addons/pages/presaleIndex/presaleIndex" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--url为空的情况end  -->

	<!--url为空的情况start  -->
	<navigator v-if="childitem.url==''" url="/pages/index/index" open-type="switchTab" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')">
		<span class="name_wrap" :style="'width:' + item.slide + 'px'">
			<image mode="widthFix" :style="'width:' + item.slide + 'px'" :src="childitem.img"></image>
		</span>
		<span>{{childitem.name}}</span>
	</navigator>
	<!--url为空的情况end  -->
</template>