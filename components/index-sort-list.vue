<template>
	<view :class="is_from_home == true?'content':'content topic_top'" >
		<view class="sort_wrap">
			<view class="sort_title_wrap">
				<view class="sort_title_item" v-for="(item,index) in nav_list" :key="index" @click="changeStyle(item,index)">
					<!-- <view :class="currIndex == index?'active_item sort_title':'sort_title'">{{item.title}}</view> -->
					<view :class="currIndex == index?(item.sub_title != ''?'active_item_another sort_title':'active_item sort_title'):'sort_title'">{{item.title}}</view>
					<view :class="currIndex == index?'active_sub_title':'sort_sub_title'" v-if="item.sub_title != ''">{{item.sub_title}}</view>
				</view>
			</view>

			<view class="sort_goods_wrap">
				<view class="recommend-goods flex_row_start_start" v-for="(item,index1) in nav_list" :key="index1">
					<!-- 商品 -->
					<view class="goods_item_wrap" v-if="item.data_type == 'goods'">
						<goodsItemV v-for="(goodsItem,index2) in item.info" :key='index2' :goods_info="goodsItem" :icon_type="item.cart_icon_type" :page_margin="10" :goods_margin="10"
						 :show_sale="isShowSale" :border_radius="borderRadius" v-if="currIndex == index1" @click="linkTo(item.data_type,goodsItem.gid)" />
					</view>
					<!-- 直播 -->
					<view class="svideo" v-if="item.data_type == 'live' && currIndex == index1">
						<view class="svideo_main">
							<view class="svideo_wrap" v-for="(item2,index) in item.info" :key="index" @click="$linkTo(item.data_type,item2.live_id)">
								<view class="svideo_main_block svideo_main_block_l">
									<image class="live_list_b_img_hua" :src="img_url+'zhibo-dianzan.gif'"></image>
									<view class="svideo_main_block_lw">
										<view class="svideo_main_block_lt">
											<image class="svideo_block_t_img svideo_block_t_img2zb svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
											<text class="svideo_block_t_text">{{item2.click_num}}{{$L('人观看')}}</text>
										</view>
									</view>
									<image class="video_bg1" :src="item2.live_image_url"></image>
								</view>

								<view class="svideo_bottom">
									<view class="svideo_main_block_zb">{{item2.live_name}}</view>
									<view class="svideo_user_wrap">
										<view class="user_info">
											<image :src="item2.member_avatar" mode="" class="user_avatar"></image>
											<view class="user_name">{{item2.member_name}}</view>
										</view>
										<view class="svideo_icon">{{item2.status_text}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 短视频 -->
					<view class="svideo" v-if="item.data_type == 'svideo' && currIndex == index1">
						<view class="svideo_main">
							<view class="svideo_wrap" v-for="(item2,index) in item.info" :key="index" @click="$linkTo(item.data_type,item2.video_id)">
								<view class="svideo_main_block svideo_main_block_l">
									<image class="live_list_b_img_hua" :src="img_url+'zhibo-dianzan.gif'"></image>
									<view class="svideo_main_block_lw">
										<view class="svideo_top_icon_bg">
											<image class="svideo_block_t_img svideo_block_t_img2zb svideo_block_t_img0" :src="img_url+'zx_play.png'"></image>
											<text class="svideo_block_t_text">{{item2.click_num}}{{$L('人观看')}}</text>
										</view>
									</view>
									<image class="video_bg1" :src="item2.video_image"></image>
								</view>

								<view class="svideo_bottom">
									<view class="svideo_main_block_zb">{{item2.video_name}}</view>
									<view class="svideo_user_wrap">
										<view class="user_info">
											<image :src="item2.member_avatar" mode="" class="user_avatar"></image>
											<view class="user_name">{{item2.member_name}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsItemV from "@/components/goods_item_v.vue";
	// import {linkTo} from '@/utils/common.js'
	export default {
		name: 'index_sort_list',
		data() {
			return {
				img_url: getApp().globalData.img_url,
				icon: getApp().globalData.img_url + 'index/icon.png',
				sortImg: getApp().globalData.img_url + 'index/sort.png',
				currIndex: 0,
				recommendGoods: [],
				pageSize: 10,
				current: 1,
				loading: false, //是否加载数据
				hasMore: true, //是否还有数据
				goods_list: []
			}
		},
		props: {
			arriveBotFlag: {
				type: Boolean,
				default: false,
			},
			nav_list: {
				type: Array,
				default: []
			},
			isShowSale: {
				type: Boolean,
			},
			borderRadius:{
				type:Number
			},
			is_from_home:{
				type:Boolean
			}
		},
		components: {
			goodsItemV,
		},
		mounted() {
			// this.getData();//获取推荐商品数据
			this.goods_list = this.nav_list[0].info
			console.log('is_form_home',this.is_from_home)
		},
		methods: {
			changeStyle(item,index) {
				this.currIndex = index
				console.log(item)
				if(item.data_type=="goods"){
					this.$emit('changeGids',item.ids)
				}
				// this.goods_list = this.nav_list[index].info
			},
			getData() {
				this.loading = true;
				let param = {};
				param.url = 'v1/front/goods/goodsList';
				param.data = {};
				param.data.sort = 1;
				param.data.pageSize = this.pageSize;
				param.data.current = this.current;
				uni.request(param).then(res => {
					if (res.state == 200) {
						if (this.current == 1) {
							this.recommendGoods = res.data.list;
						} else {
							this.recommendGoods = this.recommendGoods.concat(res.data.list);
						}
						this.hasMore = this.$checkPaginationHasMore(res.data.pagination); //是否还有数据
						if (this.hasMore) {
							this.current++;
						} else {}
					} else {
						//错误提示
					}
					this.loading = false;
				})
			},
			//页面到底部加载更多数据
			getMoreData() {
				if (this.hasMore) {
					this.getData();
				}
			},
		}
	}
</script>

<style lang='scss'>
	/* #ifdef MP */
	.topic_top{
		margin-top:166rpx!important;
	}
	/* #endif */
	
	/* #ifdef H5 */
	.topic_top{
		margin-top:100rpx !important;
	}
	/* #endif */
	
	.content {
		width:750rpx;
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
		padding:0 20rpx;
		box-sizing: border-box;
		.sort_wrap {
			.sort_title_wrap {
				height: 85rpx;
				display: flex;
				padding-right: 40rpx;
				overflow-x: scroll;
				align-items: flex-end;
				margin-bottom: 25rpx;
				.sort_title_item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin: 0 32rpx;
					white-space: nowrap;
					box-sizing: border-box;
					.sort_title {
						font-size: 30rpx;
						color: #333;
						font-weight: bold;
					}

					.sort_sub_title {
						height: 32rpx;
						font-size: 24rpx;
						background: transparent;
						border-radius: 16rpx;
						color: #666;
						text-align: center;
						line-height: 32rpx;
						padding: 0 10rpx;
						margin-top: 6rpx;
					}
				}
			}
		}
	}

	.active_item {
		font-size: 32rpx !important;
		font-weight: bold !important;
		padding-bottom: 6rpx;
		border-bottom: 6rpx solid #fc1c1c;
	}

	.active_item_another {
		font-size: 34rpx !important;
		font-weight: bold !important;
	}

	.active_sub_title {
		background: #FA1C1C;
		color: #fff;
		height: 32rpx;
		font-size: 24rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 32rpx;
		padding: 0 10rpx;
		margin-top: 6rpx;
	}

	.list-scroll-content {
		height: 100vh;
	}

	.recommend-title {
		display: flex;
		justify-content: center;

		image {
			width: 387rpx;
			height: 34rpx;
			margin: 30rpx 0;
		}
	}

	.recommend-goods {
		/* flex-wrap: wrap;
		justify-content: space-between; */
	}

	.sort_goods_wrap {
		box-sizing: border-box;
	}

	.goods_item_wrap {
		width:100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	/* 短视频模块 */
	/* 方案1 */
	.svideo {
		/* background-color: #FFFFFF; */
		/* // padding: 20rpx; */
		/* margin-top: 20rpx; */
		width: 100%;
		box-sizing: border-box;

	}

	.svideo_title {
		width: 100%;
		font-family: PingFang SC;
		color: #2D2D2D;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx 0 20rpx;
		box-sizing: border-box;
	}

	.svideo_title_l {
		font-size: 32rpx;
		font-weight: bold;
	}

	.svideo_title_r {
		font-size: 26rpx;
		color: #666666
	}

	.svideo_main {
		width: 100%;
		/* padding: 0 20rpx; */
		box-sizing: border-box;
		color: #FFFFFF;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.svideo_main_block {
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;
		background-color: #3a4db8;
		position: relative;
		height: calc((750rpx - 60rpx)/2);
		width: calc((750rpx - 60rpx)/2);
	}

	.svideo_main_block_l {
		margin-left: 0;
	}

	.svideo_main_block_r {
		margin-right: 0;
	}

	.svideo_main_block_t {
		margin: 16rpx;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 18rpx;
		background-image: url("http://site7.55jimu.com/data/upload/mall/store/goods/301/301_06506538074418754.jpg");
		padding: 0 20rpx;
		border-radius: 16rpx;
		position: relative;
		display: inline-block;
	}

	.svideo_main_block_lt {
		height: 36rpx;
		font-size: 18rpx;
		background: rgba(0, 0, 0, .2);
		padding: 0 10rpx 0 0rpx;
		border-radius: 0 0 16rpx 0;
		position: relative;
		display: flex;
		align-items: center;
	}

	.svideo_main_block_t0 {
		margin: 0 16rpx 16rpx 0;
		border-radius: 0rpx;
		padding: 10rpx 20rpx;
	}

	.svideo_block_t_img {
		/* position: absolute;
		left: 4rpx;
		top: 3rpx; */
		margin-left: 4rpx;
		width: 36rpx;
		height: 36rpx;
	}

	.svideo_block_t_img0 {
		width: 22rpx;
		height: 22rpx;
		/* margin-top: 4rpx; */
		margin-left: 10rpx;
	}

	.svideo_block_t_img1 {
		width: 22rpx;
		height: 22rpx;
		margin-top: 6rpx;
	}

	.svideo_block_t_img2 {
		margin-top: -4rpx;
	}

	.svideo_block_t_img2zb {
		/* margin-top: -5rpx; */
	}

	.svideo_block_t_img24 {
		margin-top: 7rpx;
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
		/* padding-left: 26rpx; */
		margin-left: 7rpx;
	}

	/* 方案三 */
	.svideo_main3 {
		color: #FFFFFF;
		flex-direction: row;
		overflow: hidden;
		flex-wrap: nowrap;
		width: auto;
		margin-top: 20rpx;
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
		height: 48rpx;
		line-height: 48rpx;
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
		margin: 20rpx;
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
		margin-top: 10rpx;
	}

	.svideo_main_block_b40 {
		margin-left: 0;
		margin-right: 0;
	}

	.svideo_block_t_text4 {
		font-size: 20rpx;
		padding-left: 26rpx;
	}

	/* -------------方案5--------- */
	.svideo_main5 {
		width: 100%;
		padding: 0 20rpx;
		color: #FFFFFF;
		display: flex;
		flex-direction: row;
		overflow: auto;
		flex-wrap: nowrap;
		width: auto;
		background-color: #F8F8F8;
		justify-content: space-between;
		margin-top: 20rpx;
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
		height: 288rpx;
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
		width: 266rpx;
		color: #333333;
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 16rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.svideo5_b_text {
		width: 266rpx;
		color: #666666;
		font-size: 22rpx;
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
		line-height: 32rpx;
		font-size: 18rpx;
		background-color: rgba(1, 1, 1, 0.7);
		padding: 0 20rpx;
		border-radius: 16rpx;
		position: relative;
		display: inline-block;
		color: #FFFFFF;
		opacity: 0.7;
		padding-top: 2rpx;
		padding-bottom: 2rpx;
		margin-bottom: 30rpx
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
		right: 0;
		bottom: 0;
		z-index: 990
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
		margin-left: 5rpx;
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
	}

	.video_bg1 {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.svideo_main_block_w {
		z-index: 3;
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
		width: 173px;
		height: 163px;
		opacity: 0.2;
	}

	.svideo_wrap {
		box-sizing: border-box;
		color: #FFFFFF;
		flex-wrap: wrap;
		border-radius: 16rpx;
		width: calc((750rpx - 60rpx)/2);
		height: calc(504 - (750rpx - 60rpx)/2);
		display: flex;
		flex-direction: column;
		margin-bottom: 22rpx;
		background-color: #ffffff;
	}

	.svideo_bottom {
		width: calc((750rpx - 60rpx)/2);
		height: 164rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 20rpx;
		position: relative;
	}

	.svideo_main_block_zb {
		font-size: 28rpx;
		color: #2e2e2e;
		margin-top: 15rpx;
	}

	.svideo_user_wrap {
		position: absolute;
		left: 20rpx;
		bottom: 20rpx;
		display: flex;
		width: 100%;
		justify-content: space-between;

		.user_info {
			display: flex;
			align-items: center;

			.user_avatar {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 12rpx;
			}

			.user_name {
				font-size: 24rpx;
				color: #999;
				width: 160rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.svideo_icon {
			height: 32rpx;
			background-color: rgb(188, 174, 254);
			padding: 0 10rpx;
			border-radius: 32rpx;
			color: #fff;
			flex-shrink: 0;
			font-size: 22rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 26rpx;
			box-sizing: border-box;
		}
	}

	.svideo_top_icon_bg {
		position: relative;
		height: 36rpx;
		background: linear-gradient(90deg, rgba(0,0,0,0.4), transparent);
		border-radius: 25rpx;
		font-size: 24rpx;
		margin: 10rpx;
		display: flex;
		align-items: center;
		.svideo_block_t_text {
			font-size: 22rpx;
			transform: scale(.8);
			margin-left: -8rpx;
			line-height: 20rpx;
			margin-top: 2rpx;
		}
	}
	.goods_item_wrap>view:nth-child(2n){
		margin-right:0 !important;
	}
	/* #ifdef MP */
	.goods_item_wrap{
		justify-content: space-between !important;
	}
	/* #endif */  
</style>
