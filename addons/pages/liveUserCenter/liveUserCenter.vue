<template>
	<view class="author_info" :style="'background:url('+authorInfo.background_image+') no-repeat center;'">
		<!-- <image @tap="goBack" class="go_back" :src="img_url+'white_arrow_l.png'"></image> -->
		<view class="info">
			<image class="author_avator" :src="authorInfo.member_avatar" mode="aspectFill" v-if="authorInfo && authorInfo.member_avatar"></image>
			<view class="right_info">
				<view class="member_info">
					<text class="author_name">{{authorInfo.member_nickname ? authorInfo.member_nickname : authorInfo.member_name}}
					</text>

					<view v-if="memberInfo.is_own==1" @tap="editMemInfo" class="edit_mem_info">
						<text>{{$L('编辑资料')}}</text>
						<image :src="img_url+'live/edit_mem_info.png'"></image>
					</view>

					<view v-if="memberInfo.is_own!=1" class="fav_info" :style="'background:' + (memberInfo.is_follow == 1 ? '#999999' : '#FC1C1C')"
					 @tap="collect">
						<image v-if="memberInfo.is_follow == 0" :src="img_url+'live/fav_a.png'"></image>
						<text>{{memberInfo.is_follow == 0?$L('关注'):$L('已关注')}}</text>
					</view>

					<block v-if="memberInfo.is_own == 1 && settingData.video_switch ==1">
						<view class="msg_wrap" @tap="goComments">
							<image :src="img_url+'svideo/msg.png'"></image>
							<text v-if="memberInfo.no_read_num * 1 > 0">{{memberInfo.no_read_num * 1 > 9 ? '9+' : memberInfo.no_read_num}}</text>
						</view>
					</block>

					<block v-if="role_type == 2&&store_info.store_state=='1'">
						<navigator :url="'/pages/shopHomePage/shopHomePage?vid=' + authorInfo.vid">
							<view class="go_vendor">
								<text>{{$L('进店')}}</text>
							</view>
						</navigator>
					</block>
				</view>
				<text v-if="memberInfo.publish_video_can == 1" :data-tip="$L('是否立即申请发布权限')" @tap="applicationTip" class="check_tip">{{memberInfo.publish_video_can_msg}}</text>
				<text v-if="memberInfo.publish_video_can == 2 && author.permission_status != 4" :data-tip="memberInfo.publish_video_can_click_msg"
				 @tap="applicationShowTip" class="check_tip">{{memberInfo.publish_video_can_msg}}</text>
				<text v-if="memberInfo.publish_video_can == 2 && author.permission_status == 4" :data-tip="memberInfo.publish_video_can_click_msg"
				 @tap="applicationTip" class="check_tip">{{memberInfo.publish_video_can_msg}}</text>
				<text v-if="memberInfo && memberInfo.author && memberInfo.author.live_status == 2" :data-tip="memberInfo.publish_live_can_click_msg" @tap="applicationShowTip"
				 class="check_tip">{{memberInfo.publish_live_can_msg}}</text>
			</view>

		</view>
		<text class="author_desc">{{ authorInfo.introduction ? authorInfo.introduction : (memberInfo.is_own != 1 ? $L('这个人很懒，什么都没有写') : $L('请设置个人简介~')) }}</text>
		<view class="stat_num">
			<block v-if="settingData.video_switch ==1">
				<view data-index="follow" :data-title="authorInfo.member_nickname ? authorInfo.member_nickname : authorInfo.member_name">
					<text class="num">{{authorInfo&&authorInfo.like_num ? authorInfo.like_num : '0'}}</text>
					<text class="desc">{{$L('获赞')}}</text>
				</view>
			</block>
			<view data-index="follow" :data-title="authorInfo.member_nickname ? authorInfo.member_nickname : authorInfo.member_name"
			 @tap="goAttention">
				<text class="num">{{authorInfo&&authorInfo.follow_num ? authorInfo.follow_num : '0'}}</text>
				<text class="desc">{{$L('关注')}}</text>
			</view>
			<view data-index="fans" :data-title="authorInfo.member_nickname ? authorInfo.member_nickname : authorInfo.member_name"
			 @tap="goAttention">
				<text class="num">{{authorInfo&&authorInfo.fans_num ? authorInfo.fans_num : '0'}}</text>
				<text class="desc">{{$L('粉丝')}}</text>
			</view>
		</view>

		<view class="tab" :style="'justify-content:' + (((settingData.video_switch ==1&&memberInfo.is_own != 1&&!(settingData.live_switch == 1 && authorInfo.role_type == 2))||settingData.video_switch !=1)?'space-around':'space-between')">
			<block v-if="settingData.video_switch ==1">
				<text :class="curTab=='video'?'sel':''" @tap="changeTab" data-index="video">{{$L('动态')}}({{ authorInfo&&authorInfo.video_num ? (authorInfo.video_num * 1 > 99 ? '99+' : authorInfo.video_num) : '0' }})</text>
			</block>
			<block v-if="settingData.live_switch == 1 && authorInfo.role_type == 2">
				<text :class="curTab=='live'?'sel':''" @tap="changeTab" data-index="live">{{$L('直播')}}({{ authorInfo&&authorInfo.live_num ? (authorInfo.live_num * 1 > 99 ? '99+' : authorInfo.live_num) : '0' }})</text>
			</block>
			<text :class="curTab=='goods'?'sel':''" @tap="changeTab" data-index="goods">{{$L('商品')}}({{ authorInfo&&authorInfo.goods_num ? (authorInfo.goods_num * 1 > 99 ? '99+' : authorInfo.goods_num) : 0 }})</text>
			<block v-if="settingData.video_switch ==1  && memberInfo.is_own == 1">
				<text :class="curTab=='favorite'?'sel':''" @tap="changeTab" data-index="favorite">{{$L('喜欢')}}({{ authorInfo&&authorInfo.like_video_num ? (authorInfo.like_video_num * 1 > 99 ? '99+' : authorInfo.like_video_num) : '0' }})</text>
			</block>
		</view>

		<view class="live_user_tab_content">
			<!-- 动态模块 -->
			<svideoUserVideo v-if="curTab=='video'" :memberInfo="memberInfo" :author_id="author_id" ref='video' :settingData="settingData"
			 :authorInfo="authorInfo" @liveEvent="liveEvent"></svideoUserVideo>

			<!-- 直播模块 -->
			<svideoUserLive v-if="curTab=='live'" :memberInfo="memberInfo" :author_id="author_id" :settingData="settingData"
			 :authorInfo="authorInfo" @liveEvent="liveEvent"></svideoUserLive>

			<!-- 商品模块 -->
			<svideoUserGoods v-if="curTab=='goods'" :memberInfo="memberInfo" :author_id="author_id" :settingData="settingData"
			 :authorInfo="authorInfo"></svideoUserGoods>

			<!-- 喜欢模块 -->
			<svideoUserFavorite v-if="curTab=='favorite'" :memberInfo="memberInfo" :settingData="settingData" :authorInfo="authorInfo"></svideoUserFavorite>
		</view>
		<!-- 发布按钮，目前只有发布直播 -->
		<block v-if="memberInfo.is_own == 1 &&(settingData.live_switch == 1 && role_type == 2||settingData.video_switch == 1)">
			<!-- #ifdef H5 -->
			<view class="release" v-if="settingData.video_switch == 1">
				<image :src="img_url+'release.png'"  data-flag="true" @tap="release"></image>
				<view class="release_bot">
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="release">
				<image :src="img_url+'release.png'"  data-flag="true" @tap="release"></image>
				<view class="release_bot">
				</view>
			</view>
			<!-- #endif -->
		</block>
		<!-- 发布按钮弹层 start -->
		<view class="release_mask" v-if="showReleaseType">
			<view class="content">
				<view class="detail">
					<view data-type="video" @tap="releaseLive" class="item" v-if="settingData.video_switch == 1">
						<image :src="img_url+'release_video_icon.png'"></image>
						<text>{{$L('短视频')}}</text>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view @tap="releaseLive" data-type="live" class="item" v-if="settingData.live_switch == 1 && authorInfo.role_type == 2">
						<image :src="img_url+'release_live_icon.png'"></image>
						<text>{{$L('直播')}}</text>
					</view>
					<!-- #endif -->
					
				</view>
				<image class="colse" :data-flag="false" @tap="showReleaseTypeFun" :src="img_url+'release_close.png'"></image>
			</view>
		</view>
		<!-- 发布按钮弹层 end -->
	</view>
</template>

<script>
	import request from "@/utils/request";
	const bus = getApp().globalData.bus;
	import svideoUserGoods from "@/component/svideoUserGoods/svideoUserGoods";
	import svideoUserFavorite from "@/component/svideoUserFavorite/svideoUserFavorite";
	import svideoUserLive from "@/component/svideoUserLive/svideoUserLive";
	import svideoUserVideo from "@/component/svideoUserVideo/svideoUserVideo";

	export default {
		data() {
			return {
				author_id: '',
				//作者id
				settingData: {},
				//平台设置信息
				authorInfo: {},
				//作者信息
				memberInfo: {},
				//用户相关信息
				img_url: getApp().globalData.img_url,
				//图片地址
				curTab: 'video',
				//当前tab
				showReleaseType: false //是否展示发布类型
					,
				role_type: "",
				publish_live_can: "",
				//店铺信息
				store_info:''
			};
		},

		components: {
			svideoUserGoods,
			svideoUserFavorite,
			svideoUserLive,
			svideoUserVideo
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.author_id != undefined && options.author_id) {
				this.setData({
					author_id: options.author_id
				});
			}

			if (options.curTab) {
				this.setData({
					curTab: options.curTab
				});
			}
		},
		onShow: function(){
			this.initData();
		},

		onHide() {
			this.setData({
				showReleaseType: false
			});
		},

		methods: {
			//初始化数据
			initData() {
				this.getAuthorInfo();
				this.getSetting();
			},
			//删除动态视频后更新视频列表
			updateVideoList() {
				this.initData()
				this.$refs.video.getVideoList()
			},
			//获取作者信息
			getAuthorInfo() {
				let {
					author_id
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=detail&author_id=' + author_id + '&key=' + uni.getStorageSync(
						'token'),
					success: res => {
						if (res.data.state == 200) {
							let storeInfo = res.data.data.store_info != undefined ? res.data.data.store_info : {};
							this.setData({
								authorInfo: res.data.data.author,
								memberInfo: res.data.data,
								role_type: res.data.data.author.role_type,
								publish_live_can: res.data.data.publish_live_can,
								store_info:storeInfo
							});
						}
					}
				});
			},

			//获取平台设置信息
			getSetting() {
				let {
					curTab
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getSetting',
					success: res => {
						if (res.data.state == 200) {
							if (res.data.data.setting.video_switch == 1) {
								curTab = 'video';
							} else {
								curTab = 'live';
							}

							this.setData({
								settingData: res.data.data.setting,
								curTab: curTab
							});
						}
					}
				});
			},

			// 返回上级页面
			goBack() {
				uni.navigateBack({});
			},

			//关注、取消关注事件
			collect() {
				let key = uni.getStorageSync('token');
				let {
					author_id,
					authorInfo,
					memberInfo
				} = this;

				if (key) {
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=follow&mod=followAuthor',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							to_auhtor_id: author_id,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								memberInfo.is_follow = memberInfo.is_follow == 1 ? 0 : 1;
								authorInfo.fans_num = res.data.data.fans_num;
								this.setData({
									memberInfo: memberInfo,
									authorInfo: authorInfo
								}); //通知作者列表

								bus.emit('updateAuthorListFollow', author_id);
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: `${this.$L('需要登录才能操作')}`,
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: res => {
							if (res.confirm) {
								getApp().globalData.goLogin();
							}
						}
					});
				}
			},

			//查看粉丝
			goAttention(e) {
				let {
					memberInfo
				} = this;
				let tmp_data = e.currentTarget.dataset;

				if (memberInfo.is_own == 1) {
					uni.navigateTo({
						url: '../liveAttention/liveAttention?type=' + tmp_data.index
					});
				}
			},

			//编辑资料
			editMemInfo() {
				uni.navigateTo({
					url: '../liveAuthorInfo/liveAuthorInfo'
				});
			},

			//tab切换
			changeTab(e, type = '') {
				let targetTab = type ? e : e.target.dataset.index;
				this.setData({
					curTab: targetTab
				});
			},

			//进入评论列表
			goComments() {
				uni.navigateTo({
					url: '../svideoComments/svideoComments'
				});
			},

			//点击底部加号事件
			release(e) {
				this.showReleaseTypeFun(e);
			},

			// 发布直播
			releaseLive(e) {
				let type = e.currentTarget.dataset.type;
				let {
					author_id,
					authorInfo,
					memberInfo
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=detail&author_id=' + author_id + '&key=' + uni.getStorageSync(
						'token')
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							authorInfo: res.data.author
						});

						if (type == 'live') {
							if (res.data.author.role_type == 2 && res.data.publish_live_can == 1) {
								uni.navigateTo({
									url: '../liveReleaseLive/liveReleaseLive'
								});
							} else {
								uni.showToast({
									title: res.data.publish_live_can_click_msg,
									icon: 'none'
								});
							}
						} else if (type == 'video') {
							if (res.data.publish_video_can == 1) {
								this.applicationFb(`${this.$L('是否立即申请发布权限')}`);
								return;
							}

							if (res.data.publish_video_can == 2 && res.data.author.permission_status != 4) {
								uni.showToast({
									title: res.data.publish_video_can_click_msg,
									icon: 'none'
								});
								return;
							}

							if (res.data.publish_video_can == 2 && res.data.author.permission_status == 4) {
								this.applicationFb(res.data.author.remark);
								return;
							}

							uni.navigateTo({
								url: '../svideoRelease/svideoRelease'
							});
						}
					}
				});
			},

			applicationShowTip(e) {
				let con = e.currentTarget.dataset.tip;
				uni.showToast({
					title: con,
					icon: 'none'
				});
			},

			applicationTip(e) {
				let con = e.currentTarget.dataset.tip;
				this.applicationFb(con);
			},

			applicationFb(tip) {
				uni.showModal({
					title: '',
					content: tip,
					cancelText:this.$L('取消'),
					confirmText:this.$L('确定'),
					success: res => {
						if (res.confirm) {
							uni.request({
								url: getApp().globalData.svideo_url + '/index.php?app=author&mod=applyPublic&key=' + uni.getStorageSync(
									'token'),
								success: res => {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									});

									if (res.data.state == 200) {
										this.getAuthorInfo();
									}
								}
							});
						}
					}
				});
			},

			liveEvent(e) {
				this.getAuthorInfo();
			},

			showReleaseTypeFun(e) {
				this.setData({
					showReleaseType: e.currentTarget.dataset.flag
				});				
			}

		}
	};
</script>
<style>
	page {
		background: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
	}

	.author_info {
		width: calc(750rpx - 40rpx);
		height: 360rpx;
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		align-items: flex-start;
		padding: 20rpx 20rpx 0rpx 20rpx;
		overflow: hidden;
		position: inherit;
		top: 0;
		box-sizing: content-box;
	}
/* #ifdef APP-PLUS */
    .author_info{
		height: 380rpx;
	}
/* #endif */
	.author_info .go_back {
		width: 45rpx;
		height: 47rpx;
		/* margin-top: 60rpx; */
	}

	.author_info .info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 130rpx;
		margin-top: 5rpx;
		margin-left: 20rpx;
	}

	.author_info .info .right_info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start
	}

	.author_info .info .right_info .check_tip {
		color: #fff;
		font-size: 24rpx;
		margin-left: 20rpx;
		margin-top: 10rpx
	}

	.author_info .info .right_info .member_info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.author_info .info .author_avator {
		width: 130rpx;
		height: 130rpx;
		border-radius: 65rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.author_info .info .author_name {
		max-width: 310rpx;
		color: #fff;
		font-size: 36rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: 20rpx;
	}

	.author_info .info .edit_mem_info {
		width: 155rpx;
		height: 40rpx;
		background: #fc1c1c;
		border-radius: 6rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-left: 20rpx;
	}

	.author_info .info .edit_mem_info text {
		color: #f9e9e9;
		font-size: 24rpx;
		margin-right: 5rpx;
	}

	.author_info .info .edit_mem_info image {
		width: 40rpx;
		height: 40rpx;
		margin-left: -4rpx;
	}

	.author_info .info .fav_info {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 25rpx;
		border-radius: 6rpx;
		background: #fc1c1c;
		padding: 8rpx 10rpx;
		margin-left: 20rpx;
	}

	.author_info .info .fav_info image {
		width: 36rpx;
		height: 36rpx;
	}

	.author_info .info .fav_info text {
		color: #f9e9e9;
		font-size: 24rpx;
		margin-left: 5rpx;
		margin-right: 5rpx;
	}

	.author_info .info .go_vendor {
		background: linear-gradient(to left, #fc1c1c, #ffa300);
		width: 73rpx;
		height: 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		margin-left: 20rpx;
	}

	.author_info .info .go_vendor text {
		color: #fff;
		font-size: 22rpx;
	}

	.author_info .author_desc {
		color: #fff;
		width: 670rpx;
		margin-top: 25rpx;
		font-size: 26rpx;
		margin-left: 20rpx;
		height: 60rpx;
		overflow: hidden;
		line-height: 30rpx;
	}

	.author_info .stat_num {
		color: #fff;
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-left: 20rpx;
	}

	.author_info .stat_num view {
		margin-right: 30rpx;
	}

	.author_info .stat_num view .num {
		font-size: 30rpx;
		font-weight: bold;
		margin-right: 10rpx;
	}

	.author_info .stat_num view .desc {
		font-size: 22rpx;
	}

	.author_info .tab {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		width: 670rpx;
		margin-top: 10rpx;
	}

	.author_info .tab text {
		font-size: 32rpx;
		color: #fff;
		padding-bottom: 8rpx;
	}

	.author_info .tab text.sel {
		font-weight: bold;
		border-bottom: 2px solid #fff;
	}

	.live_user_tab_content {
		width: 750rpx;
		position: fixed;
		top: 467rpx;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 0 auto;
	}
	/* #ifdef APP-PLUS*/
	.live_user_tab_content {
		width: 750rpx;
		position: fixed;
		top: 360rpx;
		left: 0;
		bottom: 0;	
	}
	
	/* #endif */
	/* #ifdef MP-WEIXIN */
	.live_user_tab_content {
		width: 750rpx;
		position: fixed;
		top: 378rpx;
		left: 0;
		bottom: 0;	
	}

	/* #endif */
	/* #ifdef H5  */
	.live_user_tab_content {
		width: 750rpx;
		position: fixed;
		top: 463rpx;
		/* left: 0; */
		bottom: 0;
	}

	/* #endif */
	.live_user_tab_content_scroll {
		height: 100vh;
	}

	.author_info .info .msg_wrap {
		width: 34rpx;
		height: 34rpx;
		position: relative;
		margin-left: 20rpx;
	}

	.author_info .info .msg_wrap image {
		width: 34rpx;
		height: 34rpx;
	}

	.author_info .info .msg_wrap text {
		position: absolute;
		z-index: 2;
		top: -9rpx;
		left: 11px;
		color: #fff;
		background: #fc1c1c;
		height: 22rpx;
		line-height: 22rpx;
		border-radius: 11rpx;
		font-size: 18rpx;
		padding: 0 6rpx;
	}

	.release {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		width: 750rpx;
		height: 161rpx;
		background: transparent;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin: 0 auto;
	}

	.release image {
		position: absolute;
		z-index: 3;
		width: 120rpx;
		height: 120rpx;
	}

	.release .release_bot {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background: #fff;
	}

	.release_mask {
		width: 750rpx;
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		margin: 0 auto;
	}

	.release_mask .content {
		position: absolute;
		bottom: 35rpx;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.release_mask .content .colse {
		width: 47rpx;
		height: 47rpx;
		margin-top: 38rpx
	}

	.release_mask .content .detail {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
	}

	.release_mask .content .detail .item {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.release_mask .content .detail .item image {
		width: 110rpx;
		height: 110rpx;
	}

	.release_mask .content .detail .item text {
		color: #fff;
		font-size: 34rpx;
		margin-top: 28rpx
	}
</style>
