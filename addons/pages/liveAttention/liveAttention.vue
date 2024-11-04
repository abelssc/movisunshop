<template>
	<view>
		<view class="live_fllow_tab">
			<text v-for="(item, index) in tabData" :key="index" :class="curTabIndex==item.index?'sel':''" :data-index="item.index"
			 @tap="changeTab">{{item.name}}</text>
		</view>

		<scroll-view scroll-y class="fllow_list" v-if="list.length">
			<!-- item -->
			<liveFollow :list="list" :bgStyle="bgStyle" :showFans="false" @collect="collect" />
			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&list.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading" />

			<view class="empty_h"></view>
		</scroll-view>

		<!-- 页面loading -->
		<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

		<!-- 页面空数据 -->
		<emptyData :showFlag="!firstLoading&&!list.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

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
	import liveFollow from "@/addons/templates/live/liveFollow.vue";

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			liveFollow,
		},
		data() {
			return {
				tabData: [{
					index: 'follow',
					name: this.$L('关注')
				}, {
					index: 'fans',
					name: this.$L('粉丝')
				}],
				//tab 数据
				curTabIndex: 'follow',
				//当前tabindex
				list: '',
				//当前列表数据
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				img_url: getApp().globalData.img_url,
				//图片地址
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;', //背景图片样式
				pn: 1,
				pageSize: 10,
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('关注/粉丝')
      });
			if (options.type != undefined && options.type) {
				this.setData({
					curTabIndex: options.type
				});
			}

			this.getList();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getList();
			}
		},

		methods: {
			//获取数据
			getList() {
				let {
					list,
					firstLoading,
					loading,
					hasmore,
					curTabIndex
				} = this;
				this.setData({
					loading: true
				});
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=follow&mod=index',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						type: curTabIndex,
						key: uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.state == 200) {
						let temp_list = res.data.follow;

						if (this.pn == 1) {
							list = temp_list;
						} else {
							list = list.concat(temp_list);
						}

						if (checkPageHasMore(res.data.pagination)) {
							this.pn++;
						} else {
							this.hasmore = false;
							hasmore = false;
						}
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						list: list,
						firstLoading: firstLoading
					});
				});
			},

			//tab切换事件
			changeTab(e) {
				let id = e.currentTarget.dataset.index;
				let {
					curTabIndex
				} = this;
				if (curTabIndex == id) return;
				this.setData({
					curTabIndex: id,
					firstLoading: true,
					list: []
				});
				this.pn = 1;
				this.hasmore = true;
				this.getList();
			},

			//关注、取消关注事件
			collect(e) {
				let key = uni.getStorageSync('token');
				let author_id = e.author_id;
				let {
					list
				} = this;

				if (uni.getStorageSync('token')) {
					request({
						url: getApp().globalData.svideo_url + '/index.php?app=follow&mod=followAuthor',
						method: 'POST',
						data: {
							to_auhtor_id: author_id,
							key: key
						}
					}).then(res => {
						if (res.state == 200) {
							let tmp_data = list.filter(item => item.author_id == author_id)[0];
							tmp_data.is_follow = tmp_data.is_follow == 1 ? 0 : 1;
							this.setData({
								list: list
							});
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
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

			//进入作者页面
			goLiveUserCenter(e) {
				let author_id = e.currentTarget.dataset.authorid;
				let page = getCurrentPages();
				let len = page.length;

				if (len > 4) {
					uni.redirectTo({
						url: '../liveUserCenter/liveUserCenter?author_id=' + author_id
					});
				} else {
					uni.navigateTo({
						url: '../liveUserCenter/liveUserCenter?author_id=' + author_id
					});
				}
			}

		}
	};
</script>
<style>
	page {
		background: #F8F8F8;
	}

	.live_fllow_tab {
		position: fixed;
		top: 1px;
		/* width: 100%; */
		width: 750rpx;
		height: 80rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin: 0 auto;
	}

	.live_fllow_tab text {
		color: #2D2D2D;
		font-size: 26rpx;
		line-height: 80rpx;
		border-bottom: 2px solid #fff;
	}

	.live_fllow_tab text.sel {
		color: #FC1C1C;
		border-bottom: 2px solid #EC1313;
	}

	.fllow_list {
		position: relative;
		top: 0;
		left: 0;
		margin-top: 87rpx;
		height: 93%;
	}

	.empty_h {
		height: 100rpx;
		width: 100%;
		background-color: 'transpanrent';
	}
</style>
