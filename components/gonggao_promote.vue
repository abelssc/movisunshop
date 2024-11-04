<template name="gonggao_promote">
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
</template>