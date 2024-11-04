<template>
	<view>
		<!-- 直播/短视频 个人中心 直播模块 -->

		<scroll-view class="live_user_tab_content_scroll" scroll-y="true" @scrolltolower="getMoreGoods">

			<block v-for="(item, index) in liveList" :key="index">
				<block v-if="item.status=='1'">
					<view :class="'user_living_item ' + (index==0?'live_list_item_first':'')">
						<view class="top_info">
							<text class="status_text">{{item.status_text}}</text>
							<text class="publish_time">{{item.create_time}}</text>
						</view>

						<view class="live_list_item" :data-liveId="item.live_id" @tap="goLivePlay">
							<view class="left" :style="{backgroundImage:'url('+item.live_image_url+')'}">
								<view class="left_top">
									<block v-if="item.status == 2">
										<image class="back_img" :src="listPlayBackIcon" mode="aspectFit"></image>
									</block>
									<block v-else>
										<image class="back_img_living" :src="listLivingIcon" mode="aspectFit"></image>
									</block>
									<text class="watch_num_text">{{item.click_num}}{{$L('观看')}}</text>
								</view>
								<view class="right_bottom" v-if="item.like_num>0">
									<image class="heart_icon" :src="heartIcon" mode="aspectFit"></image>
									<text class="watch_num_text">{{item.like_num}}</text>
								</view>
							</view>

							<view class="right">
								<text class="live_name">{{item.live_name}}</text>
								<block v-if="item.goods_list.length">
									<view class="goods_info">
										<view class="first_goods" :style="{backgroundImage:'url('+item.goods_list[0].goods_image+')'}">
											<text class="goods_price">{{$L('¥')}}{{item.goods_list[0].goods_price}}</text>
										</view>
										<block v-if="item.goods_list.length>1">
											<view class="second_goods" :style="{backgroundImage:'url('+item.goods_list[1].goods_image+')'}">
												<text class="total">{{item.goods_num>99?'99+':item.goods_num}}</text>
											</view>
										</block>
									</view>
								</block>
							</view>
						</view>
						<block v-if="memberInfo.is_own==1">
							<view class="zhibo_orderBox">
								<view class="zhibo_order_item">
									<text class="zhibo_order_text">{{$L('订单销量：')}}</text>
									<text class="zhibo_order_xiaoliang">{{item.order_num}}</text>
								</view>
								<view class="zhibo_order_item ml_77">
									<text class="zhibo_order_text">{{$L('订单金额：')}}</text>
									<text class="zhibo_order_price">{{$L('￥')}}{{item.order_total_price}}</text>
								</view>
							</view>
						</block>
						<block v-if="memberInfo.is_own==1&&(settingData.live_virtual_click_num_switch==1||settingData.live_virtual_like_num_switch==1)">
							<view class="detail_num">
								<block v-if="settingData.live_virtual_click_num_switch==1">
									<text>{{$L('观看数')}}</text>
									<text class="color_9">{{$L('(虚/实)：')}}</text>
									<text class="color_3 mr_30">{{item.virtual_click_num}}/{{item.real_click_num}}</text>
								</block>
								<block v-if="settingData.live_virtual_like_num_switch==1">
									<text>{{$L('人气数')}}</text>
									<text class="color_9">{{$L('(虚/实)：')}}</text>
									<text class="color_3">{{item.virtual_like_num}}/{{item.real_like_num}}</text>
								</block>
							</view>
						</block>
					</view>
				</block>

				<block v-if="item.status!='1'">
					<view class="live_back_item">
						<view class="top_info">
							<text class="status_text">{{item.status_text}}</text>
							<text class="publish_time">{{item.create_time}}</text>
							<image class="forbid_flag" v-if="item.status==3" :src="forbidPlayImg"></image>
						</view>
						<view class="live_item" @tap="goGoodsDetail">
							<view class="live_img" @tap="goLiving(item)">
								<image class="play_btn_icon" v-if="item.status!=4" :src="videoPlayImg" mode="aspectFit"></image>
								<image class="img" :src="item.live_image_url" mode="aspectFit"></image>
								<view v-if="item.status != 0" class="live_time">
									<text v-if="item.status != 0 || item.status != 1">{{item.live_time}}</text>
								</view>
							</view>
							<view class="right">
								<view class="top">
									<text class="name">{{item.live_name}}</text>
									<text class="recommend_num">{{$L('推荐商品：')}}{{item.goods_num*1>99?'99+':item.goods_num}}</text>
								</view>
								<view class="bottom">
									<view class="click_num" style="margin-left:-12rpx">
										<image class="img" :src="userWatchIcon" mode="aspectFit"></image>
										<text>{{item.click_num}}</text>
									</view>
									<view class="click_num" style="margin-left:20rpx">
										<image class="img" :src="userFavIcon" mode="aspectFit"></image>
										<text>{{item.like_num}}</text>
									</view>
								</view>
							</view>
						</view>
						<block v-if="memberInfo.is_own==1">
							<view class="zhibo_orderBox">
								<view class="zhibo_order_item">
									<text class="zhibo_order_text">{{$L('订单销量：')}}</text>
									<text class="zhibo_order_xiaoliang">{{item.order_num}}</text>
								</view>
								<view class="zhibo_order_item ml_77">
									<text class="zhibo_order_text">{{$L('订单金额：')}}</text>
									<text class="zhibo_order_price">{{$L('￥')}}{{item.order_total_price}}</text>
								</view>
							</view>
						</block>
						<block v-if="memberInfo.is_own==1&&(settingData.live_virtual_click_num_switch==1||settingData.live_virtual_like_num_switch==1)">
							<view class="detail_num">
								<block v-if="settingData.live_virtual_click_num_switch==1">
									<text>{{$L('观看数')}}</text>
									<text class="color_9">{{$L('(虚/实)：')}}</text>
									<text class="color_3">{{item.virtual_click_num}}/{{item.real_click_num}}</text>
								</block>
								<block v-if="settingData.live_virtual_like_num_switch==1">
									<text class="ml_30">{{$L('人气数')}}</text>
									<text class="color_9">{{$L('(虚/实)：')}}</text>
									<text class="color_3">{{item.virtual_like_num}}/{{item.real_like_num}}</text>
								</block>
							</view>
						</block>
						<block v-if="memberInfo.is_own == 1 && (item.status!=1 && item.status!=4)">
							<image :src="zhibo_shanchu" class="zhibo_delHuifang" :data-id="item.live_id" @tap="del_huifang"></image>
						</block>

					</view>
				</block>
			</block>

			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&liveList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading&&!firstLoading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" :topVal="467" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&!liveList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

			<block v-if="settingData.live_switch == 1 && memberInfo.is_own == 1">
				<view  class="video_bottom"></view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import {
		checkPageHasMore
	} from "@/utils/live";
	import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	const img_url = getApp().globalData.img_url;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
		},
		data() {
			return {
				pn: 1,
				//当前页
				pageSize: 10,
				//每页数据
				loading: false,
				//数据加载状态
				liveList: [],
				//直播列表数据
				forbidPlayImg: img_url + 'live/forbid_play.png',
				videoPauseImg: img_url + 'live/video_pause.png',
				videoPlayImg: img_url + 'live/video_play.png',
				userWatchIcon: img_url + 'live/user_watch.png',
				userFavIcon: img_url + 'live/user_fav.png',
				listLivingIcon: img_url + 'live/list_living.gif',
				heartIcon: img_url + 'live/heart_icon.png',
				zhibo_shanchu: img_url + 'live/zhibo_shanchu.png',
				hasmore: true,
				//是否还有数据，用于页面展示
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				img_url: getApp().globalData.img_url //图片地址

			};
		},

		props: {
			memberInfo: {
				// 用户信息 
				type: Object
			},
			authorInfo: {
				// 作者信息
				type: Object
			},
			author_id: {
				// 作者id
				type: String,
				default: ''
			},
			settingData: {
				// 平台设置信息
				type: Object
			}
		},

		mounted() {
			this.getLiveList();
		},

		methods: {
			//获取直播数据
			getLiveList() {
				this.setData({
					loading: true
				});
				let {
					author_id,
					firstLoading,
					liveList,
					pageSize,
					pn,
					hasmore
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live&mod=liveList',
					data: {
						key: uni.getStorageSync('token'),
						author_id: author_id,
						pageSize: pageSize,
						current: pn
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.list;

						if (pn == 1) {
							liveList = list;
						} else {
							liveList = liveList.concat(list);
						}

						if (checkPageHasMore(res.data.pagination)) {
							pn++;
						} else {
							hasmore = false;
						}
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						liveList: liveList,
						firstLoading: firstLoading,
						pn: pn
					});
				});
			},

			getMoreGoods() {
				if (this.hasmore) {
					this.getLiveList();
				}
			},

			//进入直播或者回放
			goLiving(item) {
				if (item.status == 0) {
					//待直播
					uni.navigateTo({
						url: '/addons/pages/livePush/livePush?live_id=' + item.live_id + '&pushurl=' + encodeURIComponent(item.pushurl) +
							'&backGrade=1'
					});
					return;
				}

				if (item.status == 4) {
					uni.showToast({
						title: this.$L('视频录制中，请稍后再试'),
						icon: 'none'
					});
					return;
				}

				let page = getCurrentPages();
				let len = page.length;

				if (len > 4) {
					uni.redirectTo({
						url: '/addons/pages/livePlay/livePlay?live_id=' + item.live_id + '&author_id=' + item.author_id,
					});
				} else {
					uni.navigateTo({
						url: '/addons/pages/livePlay/livePlay?live_id=' + item.live_id + '&author_id=' + item.author_id,
					});
				}
			},

			//进入播放页面
			goLivePlay(e) {
				let cur_live_id = e.currentTarget.dataset.liveid;
				uni.navigateTo({
					url: '/addons/pages/livePlay/livePlay?live_id=' + cur_live_id,
				});
			},

			//跳转商品详情页
			goGoodsDetail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					let page = getCurrentPages();
					let len = page.length;

					if (len > 4) {
						uni.redirectTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					} else {
						uni.navigateTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					}
				}
			},

			// 点击删除回放
			del_huifang(e) {
				let live_id = e.currentTarget.dataset.id;
        let that = this
				uni.showModal({
					title: that.$L('提示'),
					content: that.$L('确定删除该直播回放?'),
					cancelText:this.$L('取消'),
					confirmText:this.$L('确定'),
					success: res => {

						if (res.confirm) {
							request({
								url: getApp().globalData.svideo_url + '/index.php?app=live&mod=softDelLive',
								method: 'post',
								data: {
									key: uni.getStorageSync('token'),
									live_id
								}
							}).then(res => {
								if (res.state == 200) {
									this.setData({
										pn: 1
									});
									this.getLiveList();
									this.$emit('liveEvent', {
										detail: {}
									});
								}
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	.live_user_tab_content_scroll {
		height: calc(100vh - 467rpx);
	}

	.live_user_tab_content_scroll .live_back_item {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		position: relative;
		background: #fff;
		width: 670rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		border-radius: 14rpx;
		margin-left: 20rpx;
		padding-bottom: 0;
		box-sizing: content-box;
	}

	.live_user_tab_content_scroll .live_back_item .top_info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.live_user_tab_content_scroll .live_back_item .top_info .status_text {
		padding: 0 10rpx;
		height: 30rpx;
		color: #fff;
		background-color: #bcaefe;
		font-size: 22rpx;
		border-radius: 15rpx;
		text-align: center;
		line-height: 30rpx;
	}

	.live_user_tab_content_scroll .live_back_item .top_info .publish_time {
		margin-left: 20rpx;
		color: #949494;
		font-size: 22rpx;
	}

	.live_user_tab_content_scroll .live_back_item .top_info .forbid_flag {
		position: absolute;
		top: 0;
		right: 8rpx;
		width: 127rpx;
		height: 37rpx;
	}

	.live_user_tab_content_scroll .live_item {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20rpx;
		/* padding-bottom: 22rpx; */
		width: 100%;
	}

	.live_user_tab_content_scroll .live_item .live_img {
		width: 246rpx;
		height: 246rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.live_user_tab_content_scroll .live_item .live_img .play_btn_icon {
		height: 48rpx;
		max-width: 48rpx;
		position: absolute;
		top: 99rpx;
		left: 99rpx;
		z-index: 2;
	}

	.live_user_tab_content_scroll .live_item .live_img .img {
		max-height: 100%;
		max-width: 100%;
		border-radius: 15rpx;
	}

	.live_user_tab_content_scroll .live_item .live_img .live_time {
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 15rpx 0 15rpx 0;
		padding: 0 8rpx;
	}

	.live_user_tab_content_scroll .live_item .live_img .live_time text {
		color: #fff;
		font-size: 22rpx;
		height: 38rpx;
		line-height: 38rpx;
	}

	.live_user_tab_content_scroll .live_item .right {
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		align-items: flex-start;
		height: 216rpx;
		padding: 10rpx 20rpx;
	}

	.live_user_tab_content_scroll .live_item .right .top {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.live_user_tab_content_scroll .live_item .right .top .name {
		color: #2d2d2d;
		font-size: 28rpx;
		line-height: 42rpx;
		width: 414rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.live_user_tab_content_scroll .live_item .right .top .recommend_num {
		color: #949494;
		font-size: 26rpx;
		line-height: 36rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 30rpx;
		width: 414rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-end;
		width: 414rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .price .unit {
		color: #fc1c1c;
		font-size: 24rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .price .num {
		font-size: 36rpx;
		color: #fc1c1c;
		margin-left: 3rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .click_num {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .click_num .add_cart {
		width: 42rpx;
		height: 42rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .click_num image {
		width: 50rpx;
		height: 50rpx;
	}

	.live_user_tab_content_scroll .live_item .right .bottom .click_num text {
		color: #999;
		font-size: 24rpx;
	}

	.live_list_item {
		width: 750rpx;
		height: 380rpx;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;
		padding: 0 20rpx 0 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.live_list_item_first {
		margin-top: 0 !important;
	}

	.live_list_item .left {
		width: 360rpx;
		height: 360rpx;
		border-radius: 15rpx;
		background-size: contain;
		background-repeat: no-repeat;
		/* background-size:100%;  */
		position: relative;
	}

	.live_list_item .left .left_top {
		position: absolute;
		top: 0;
		left: 0;
		padding-right: 10rpx;
		height: 36rpx;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom-right-radius: 15rpx;
		border-top-left-radius: 15rpx;
	}

	.left .left_top .back_img {
		width: 46rpx;
		height: 46rpx;
	}

	.left .left_top .back_img_living {
		width: 35rpx;
		height: 35rpx;
		margin-top: -14rpx;
	}

	.left .watch_num_text {
		color: #fff;
		font-size: 20rpx;
	}

	.live_list_item .left .right_bottom {
		position: absolute;
		bottom: 10rpx;
		right: 5rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		height: 75rpx;
	}

	.left .right_bottom .heart_icon {
		width: 48rpx;
		height: 48rpx;
	}

	.left .right_bottom text {
		margin-right: 10rpx;
	}

	.live_list_item .right {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 30rpx 0rpx 30rpx 15rpx;
		height: 300rpx;
	}

	.right .live_name {
		height: 72rpx;
		color: '#2D2D2D';
		font-size: 26rpx;
		line-height: 36rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.right .member_info,
	.right .goods_info {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-top: 20rpx;
	}

	.right .member_info .avator {
		width: 42rpx;
		height: 42rpx;
		border-radius: 21rpx;
	}

	.right .member_info .nickname {
		color: '#949494';
		font-size: 22rpx;
		margin-left: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.right .goods_info .first_goods,
	.right .goods_info .second_goods {
		width: 140rpx;
		height: 140rpx;
		border-radius: 15rpx;
		overflow: hidden;
		margin-right: 10rpx;
		background-repeat: no-repeat;
		background-size: contain;
	}

	.right .goods_info .second_goods {
		margin-right: 0;
	}

	.right .goods_info .first_goods .goods_price {
		display: flex;
		width: 140rpx;
		height: 120rpx;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		color: #fff;
		margin-top: 20rpx;
		background: -webkit-linear-gradient(top, rgba(221, 221, 221, 0), rgba(221, 221, 221, 0), #000);
		font-size: 20rpx;
		line-height: 44rpx;
		border-radius: 0 0 15rpx 15rpx;
	}

	.right .goods_info .second_goods .total {
		display: flex;
		width: 140rpx;
		height: 140rpx;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.3);
		font-size: 24rpx;
		color: #fff;
		border-radius: 15rpx;
	}

	.user_living_item {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		background-color: #FFF;
	}

	.user_living_item .top_info {
		width: 710rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-end;
		padding-left: 20rpx;
		background: #fff;
		height: 70rpx;
		padding-bottom: 10rpx;
	}

	.user_living_item .top_info .status_text {
		width: 80rpx;
		height: 30rpx;
		background: linear-gradient(45deg, rgba(252, 28, 28, 1) 0%, rgba(255, 163, 0, 1) 100%);
		border-radius: 15rpx;
		font-size: 22rpx;
		color: #fff;
		text-align: center;
		line-height: 30rpx;
	}

	.user_living_item .top_info .publish_time {
		margin-left: 20rpx;
		color: #949494;
		font-size: 22rpx;
	}

	.detail_num {
		width: 100%;
		height: 80rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	.user_living_item .detail_num {
		width: 710px;
		padding-left: 20rpx;
		background: #fff;
	}

	.detail_num text {
		color: #666;
		font-size: 24rpx;
	}

	.detail_num .color_9 {
		color: #999;
	}

	.detail_num .color_3 {
		color: #333;
		font-weight: bold;
	}

	.ml_30 {
		margin-left: 30rpx;
	}

	.ml_10 {
		margin-left: 10rpx;
	}

	.mr_30 {
		margin-right: 30rpx;
	}

	.ml_77 {
		margin-left: 77rpx;
	}

	.zhibo_orderBox {
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.user_living_item .zhibo_orderBox {
		padding-left: 20rpx;
	}

	.zhibo_orderBox .zhibo_order_text {
		color: #666666;
		font-size: 24rpx;

	}

	.zhibo_orderBox .zhibo_order_xiaoliang {
		color: #FF4C05;
		font-size: 30rpx;
		font-weight: bold;
	}

	.zhibo_orderBox .zhibo_order_price {
		color: #D90E0E;
		font-size: 30rpx;
		font-weight: bold;
	}

	.zhibo_delHuifang {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 50rpx;
		height: 50rpx;
	}
	.video_bottom {
		height:161rpx;width:750rpx
	}
	/* #ifdef H5 */
	.video_bottom{
		height:261rpx;
	}
	/* #endif */
</style>
