<template>
	<view>
		<scroll-view scroll-y class="fllow_list" v-if="list.length">

			<!-- item -->
			<liveFollow :list="list" :bgStyle="bgStyle" :showFans="true" @collect="collect" />

			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&list.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&!list.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

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
	import liveFollow from "@/addons/templates/live/liveFollow.vue";
	const bus = getApp().globalData.bus;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			liveFollow
		},
		data() {
			return {
				list: '',
				//当前列表数据
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;',
				//背景图片样式
				search_name: '', //搜索内容
				pn: 1,
				img_url: getApp().globalData.img_url,

			};
		},

		props: {},
		//是否还有数据

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('更多用户')
      });
			this.setData(options);
			this.getList();
		},
		onShow: function() {
			//更新作者列表的关注状态和粉丝数 data为作者id
			bus.on('updateAuthorListFollow', data => {
				let {
					list
				} = this;
				let cur_data = list.filter(item => item.author_id == data)[0];
				cur_data.is_follow = cur_data.is_follow == 1 ? 0 : 1;
				cur_data.fans_num = cur_data.is_follow == 1 ? cur_data.fans_num * 1 + 1 : cur_data.fans_num * 1 - 1;
				bus.emit('updateAuthorFollow', data);
				this.setData({
					list: list
				});
			});
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getList();
			}
		},

		methods: {
			//获取数据
			getList() {
				let key = uni.getStorageSync('token');
				let {
					list,
					firstLoading,
					loading,
					hasmore,
					search_name
				} = this;
				this.setData({
					loading: true
				});
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=searchAuthor',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						search_name: search_name,
						key: key
					}
				}).then(res => {
					if (res.state == 200) {
						let temp_list = res.data.author;

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

			//关注、取消关注事件
			collect(e) {
				let author_id = e.author_id;
				let key = uni.getStorageSync('token');
				let {
					list
				} = this;

				if (key) {
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
							tmp_data.fans_num = tmp_data.is_follow == 1 ? tmp_data.fans_num * 1 + 1 : tmp_data.fans_num * 1 - 1;
							this.setData({
								list: list
							}); //通知搜索页面数据更新

							if (e.index < 3) {
								bus.emit('updateAuthorFollow', tmp_data.author_id);
							}
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



		}
	};
</script>
<style>
	page {
		background: #f8f8f8;
	}

	.live_fllow_tab {
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
		color: #2d2d2d;
		font-size: 26rpx;
		line-height: 80rpx;
		border-bottom: 2px solid #fff;
	}

	.live_fllow_tab text.sel {
		color: #fc1c1c;
		border-bottom: 2px solid #ec1313;
	}

	.fllow_list {
		margin-top: 20rpx;
		height: 100%;
		width: 100%;
	}

	.empty_h {
		height: 100rpx;
		width: 100%;
		background-color: 'transpanrent';
	}
</style>
