<template>
	<view>
		<view class="sea_input_part">
			<view>
				<image :src="img_url+'search.png'"></image>
				<input confirm-type="search" class="sea_input" type="text" :value="in_value" @input="input" :placeholder="$L('请输入关键词')"
				 @confirm="in_confirm"></input>
				<block v-if="in_value.length>0">
					<image class="clear_content" @tap.stop="clearInputVal" :src="img_url+'live/input_clear.png'"></image>
				</block>
			</view>
			<label class="sea_btn" @tap.stop="btn_search">{{$L('搜索')}}</label>
		</view>
		<block v-if="!show_result">
			<view class="search-item" v-if="history_val && history_val.length">
				<view class="search-title">
					<text>{{$L('搜索历史')}}</text>
					<view class="del" @tap.stop="clear_history">
						<image :src="img_url+'del_search.png'"></image>
					</view>
				</view>

				<view class="search-con">
					<view v-for="(item, index) in history_val" :key="index" class="item" :data-keyword="item" @tap.stop="quick_search">{{item}}</view>
				</view>
			</view>
		</block>

		<block v-if="show_result">
			<view class="search_result" v-if="authorList.length>0">
				<view class="title">
					<text>{{$L('相关主播')}}</text>
					<view class="right" @tap="goAuthorList">
						<text>{{$L('查看更多')}}</text>
						<image src="/static/addons/images/ltr.png"></image>
					</view>
				</view>
				<!-- 主播item -->
				<liveFollow :list="authorList" :bgStyle="bgStyle" :showFans="true" @collect="collect" />
			</view>
		</block>


		<block v-if="show_result">
			<!-- 直播列表item -->
			<view class="search_result" v-if="liveList.length>0">
				<view class="title">
					<text>{{$L('相关视频')}}</text>
				</view>

				<listLiveItem :liveList="liveList" :bgStyle="bgStyle" :listPlayBackIcon="img_url+'live/list_playback.png'"
				 :listLivingIcon="img_url+'live/list_living.gif'" :heartIcon="img_url+'live/live_list_heart.gif'" />
			</view>
			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="(!hasmore)&&liveList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="(!firstLoading)&&hasmore&&loading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading&&show_result" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="(!hasmore)&&liveList.length==0&&authorList.length==0" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

		</block>
	</view>
</template>

<script>
	//获取应用实例
	import {
		checkSpace
	} from "@/utils/common";
	import {
		checkPageHasMore
	} from "@/utils/live";
	import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import listLiveItem from "@/addons/templates/live/listLiveItem.vue";
	import liveFollow from "@/addons/templates/live/liveFollow.vue";

	const bus = getApp().globalData.bus;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			listLiveItem,
			liveFollow
		},
		data() {
			return {
				in_value: '',
				history_val: [],
				//搜索历史数组
				show_result: false,
				//是否展示搜索结果
				img_url: getApp().globalData.img_url,
				//图片地址
				authorList: [],
				//作者列表
				liveList: [],
				//直播列表
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;', //背景图片样式
				pageSize: 10,
				pn: 1,

			};
		},
		props: {},
		//是否还有数据
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('直播搜索')
      });
			this.getHistoryList();
		},
		onShow: function() {
			//更新作者列表的关注状态和粉丝数 data为作者id
			bus.on('updateAuthorFollow', data => {
				let {
					authorList
				} = this;
				let cur_data = authorList.filter(item => item.author_id == data)[0];

				if (cur_data != undefined) {
					cur_data.is_follow = cur_data.is_follow == 1 ? 0 : 1;
					cur_data.fans_num = cur_data.is_follow == 1 ? cur_data.fans_num * 1 + 1 : cur_data.fans_num * 1 - 1;
					this.setData({
						authorList: authorList
					});
				}
			});
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getLiveList();
			}
		},

		methods: {
			//获取历史记录
			getHistoryList() {
				var history_val = uni.getStorageSync('his_keyword_live');

				if (history_val) {
					var his_array = history_val.split("~");
					var last_arr = [];

					for (var i = 0; i < his_array.length; i++) {
						!checkSpace(his_array[i]) && last_arr.push(his_array[i]);
					}

					this.setData({
						history_val: last_arr
					});
				}
			},

			input(e) {
				this.setData({
					in_value: e.detail.value,
					show_result: false
				});
			},

			//点击弹起的键盘按钮时触发
			in_confirm: function(e) {
				if (this.in_value != this.$L('请输入关键词') || this.in_value != '') {
					this.btn_search();
				}
			},

			//点击历史搜索
			quick_search(e) {
				this.setData({
					show_result: true,
					in_value: e.currentTarget.dataset.keyword,
					liveList: [],
					authorList: [],
				});
				this.getAuthor();
				this.getLiveList();
			},

			//搜索事件
			btn_search: function() {
				let {
					in_value
				} = this;
				in_value = in_value.trim();

				if (in_value.length > 0) {
					this.setData({
						show_result: true,
						liveList: [],
						authorList: [],
					});
					this.setHistoryData();
					this.getAuthor();
					this.getLiveList();
				} else {
					uni.showToast({
						title: this.$L('请输入关键词进行搜索'),
						icon: 'none'
					});
				}
			},

			//查找作者
			getAuthor() {
				let {
					authorList,
					firstLoading,
					in_value
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=searchAuthor',
					data: {
						pageSize: 3,
						current: 1,
						search_name: in_value.trim(),
						key: uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.author;
						authorList = list;
					} //初次加载的话更改状


					if (firstLoading) {
						firstLoading = false;
					}

					this.setData({
						authorList: authorList,
						firstLoading: firstLoading
					});
				});
			},

			//查找直播
			getLiveList() {
				this.setData({
					loading: true
				});
				let {
					liveList,
					hasmore,
					firstLoading,
					in_value
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=searchLive',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						search_name: in_value.trim()
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.list;

						if (this.pn == 1) {
							liveList = list;
						} else {
							liveList = liveList.concat(list);
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
						liveList: liveList,
						firstLoading: firstLoading
					});
				});
			},

			//设置缓存
			setHistoryData() {
				let {
					history_val,
					in_value
				} = this;
				history_val.unshift(in_value); // 最多取30条，不重复且不为空的数据

				history_val = history_val.reduce((a, b) => {
					a.length <= 30 && b && a.indexOf(b) == -1 ? a.push(b) : null;
					return a;
				}, []);
				let history_val_str = history_val.join('~');
				this.setData({
					history_val: history_val
				});
				uni.setStorage({
					key: "his_keyword_live",
					data: history_val_str
				});
			},

			//清空历史记录事件
			clear_history: function(e) {
				uni.removeStorageSync('his_keyword_live');
				this.setData({
					history_val: []
				});
			},

			//清空输入内容
			clearInputVal() {
				this.setData({
					in_value: '',
					show_result: false
				});
			},

			//进入更多主播列表
			goAuthorList() {
				let {
					in_value
				} = this;
				let page = getCurrentPages();
				let len = page.length;

				if (len > 4) {
					uni.redirectTo({
						url: '/addons/pages/liveAuthorList/liveAuthorList?search_name=' + in_value
					});
				} else {
					uni.navigateTo({
						url: '/addons/pages/liveAuthorList/liveAuthorList?search_name=' + in_value
					});
				}
			},

			//关注、取消关注事件
			collect(e) {
				let author_id = e.author_id;
				let key = uni.getStorageSync('token');
				let {
					authorList
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
							let tmp_data = authorList.filter(item => item.author_id == author_id)[0];
							tmp_data.is_follow = tmp_data.is_follow == 1 ? 0 : 1;
							tmp_data.fans_num = tmp_data.is_follow == 1 ? tmp_data.fans_num * 1 + 1 : tmp_data.fans_num * 1 - 1;
							this.setData({
								authorList: authorList
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

		}
	};
</script>
<style>
	page {
		background-color: #fff;
	}

	.sea_input {
		flex: 1;
		height: 65rpx;
		font-size: 24rpx;
		color: #333;
	}



	.sea_input_part view image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 22rpx;
	}

	.clear_content {
		width: 45rpx !important;
		height: 45rpx !important;
		margin-right: 15rpx !important;
	}

	.sea_input_part view {
		display: flex;
		align-items: center;
		border: none;
		width: 80%;
		height: 65rpx;
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-radius: 32.5rpx;
		background-color: #f5f5f5;
	}

	.sea_btn {
		font-size: 28rpx;
		color: #2D2D2D;
		padding: 10rpx 25rpx;
	}

	.sea_input_part {
		position: relative;
		display: flex;
		align-items: center;
		height: 88rpx;
		width: 750rpx;
		margin: 0 auto;
	}

	.sea_input_part::after {
		position: absolute;
		content: '';
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1rpx;
		background-color: #eee;
		transform: scaleY(0.5);
	}

	.search-item {
		padding: 30rpx 28rpx;
		width: 694rpx;
		margin: 0 auto;
	}

	.search-item .search-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48rpx;
		color: #2D2D2D;
		font-size: 28rpx;
		font-weight: bold;
	}

	.search-item .search-title image {
		width: 48rpx;
		height: 48rpx;
	}

	.search-item .search-con {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.search-item .search-con .item {
		height: 50rpx;
		padding: 0 18rpx;
		color: #2D2D2D;
		line-height: 50rpx;
		font-size: 24rpx;
		background-color: #F5F5F5;
		border-radius: 25rpx;
		margin-right: 20rpx;
		margin-top: 20rpx;
	}

	.search_result {
		background: #F8F8F8;
		margin: 0 auto;
	}

	.search_result .title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 77rpx;
		width: 710rpx;
		padding: 0 20rpx;
		margin: 0 auto;
	}

	.search_result .title text {
		color: #2D2D2D;
		font-size: 28rpx;
	}

	.search_result .title .right {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.search_result .title .right text {
		color: #949494;
		font-size: 24rpx;
		margin-right: 15rpx;
	}

	.search_result .title .right image {
		width: 11rpx;
		height: 19rpx;
	}
</style>
