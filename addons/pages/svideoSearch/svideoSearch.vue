<template>
	<view>
		<view class="sea_input_part">
			<view>
				<image :src="img_url+'search.png'"></image>
				<input confirm-type="search" class="sea_input" type="text" v-model="in_value" @input="input" :placeholder="$L('请输入关键词')"
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
					<text>{{$L('相关用户')}}</text>
					<view class="right" @tap="goAuthorList">
						<text>{{$L('查看更多')}}</text>
						<image src="/static/addons/images/ltr.png"></image>
					</view>
				</view>
				<!-- 主播item -->
				<videoFollow :list="authorList" :bgStyle="bgStyle" :showFans="true" />
			</view>
		</block>
		<!-- {{show_result}}--{{videoList}} -->
		<block v-if="show_result">
			<!-- 短视频列表item -->
			<view class="search_result" v-if="videoList && videoList.length>0">
				<view class="title">
					<text>{{$L('相关视频')}}</text>
				</view>
				<searchVideoItem :videoList="videoList" :bgStyle="bgStyle" :listPlayIcon="img_url+'svideo/play.png'" />
			</view>
			<!-- 数据加载完毕 -->
			<dataLoaded :showFlag="!hasmore&&videoList.length>0" />

			<!-- 数据加载中 -->
			<dataLoading :showFlag="hasmore&&loading" />

			<!-- 页面loading -->
			<pageLoading :firstLoading="firstLoading&&show_result" :loadingIcon="img_url + 'live/page_loading_icon.gif'" />

			<!-- 页面空数据 -->
			<emptyData :showFlag="!firstLoading&&isShow_empty1&&isShow_empty2 " :emptyIcon="img_url+'live/live_list_empty_icon.png'" />

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
	import searchVideoItem from "@/addons/templates/svideo/searchVideoItem.vue";
	import videoFollow from "@/addons/templates/svideo/videoFollow.vue";
	const bus = getApp().globalData.bus;

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
			searchVideoItem,
			videoFollow,
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
				videoList: [],
				//直播列表
				hasmore: true,
				//是否还有数据，用于页面展示
				loading: false,
				firstLoading: true,
				//是否初次加载，是的话展示页面居中的loading效果，
				bgStyle: 'background-size:cover;background-position:center center;background-repeat: no-repeat;', //背景图片样式
				isShow_empty1: true,
				isShow_empty2: true,
				pn:1
			};
		},

		props: {},
		//是否还有数据
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('短视频搜索')
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
			this.getAuthor();
			this.getVideoList();
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getVideoList();
			}
		},

		methods: {
			//获取历史记录
			getHistoryList() {
				var history_val = uni.getStorageSync('hisSldSearchSv');

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
					in_value: e.currentTarget.dataset.keyword
				});
				this.getAuthor();
				this.getVideoList();
			},

			//搜索事件
			btn_search: function() {
				let {
					in_value
				} = this;
				in_value = in_value.trim();

				if (in_value.length > 0) {
					this.setData({
						show_result: true
					});
					this.pn = 1;
					this.setHistoryData();
					this.getAuthor();
					this.getVideoList();
					this.$forceUpdate();
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
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=searchAuthor',
					data: {
						pageSize: 3,
						current: 1,
						search_name: in_value.trim()
					}
				}).then(res => {
					let isShow
					if (res.state == 200) {
						let list = res.data.author;
						authorList = list;
						isShow= list.length > 0 ? false : true;
					} //初次加载的话更改状态

					if (firstLoading) {
						firstLoading = false;
					}
					
					this.setData({
						authorList: authorList,
						firstLoading: firstLoading,
						isShow_empty1: isShow,
					});
				});
			},

			//查找短视频
			getVideoList() {
				this.setData({
					loading: true
				});
				let {
					videoList,
					hasmore,
					firstLoading,
					in_value
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=searchVideo',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						search_name: in_value.trim()
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.video;

						if (this.pn == 1) {
							videoList = list;
						} else {
							videoList = videoList.concat(list);
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

					let isShow = videoList.length > 0 ? false : true;

					this.setData({
						loading: false,
						hasmore: hasmore,
						videoList: videoList,
						firstLoading: firstLoading,
						isShow_empty2: isShow,
					});
					this.$forceUpdate();
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
					key: "hisSldSearchSv",
					data: history_val_str
				});
			},

			//清空历史记录事件
			clear_history: function(e) {
				uni.removeStorageSync('hisSldSearchSv');
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
						url: '../svideoAuthorList/svideoAuthorList?search_name=' + in_value
					});
				} else {
					uni.navigateTo({
						url: '../svideoAuthorList/svideoAuthorList?search_name=' + in_value
					});
				}
			},
		}
	};
</script>
<style>
	page {
		background-color: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
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
		width: 77%;
		height: 65rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		padding-left: 20rpx;
		border-radius: 32.5rpx;
		background-color: #f0f0f0;
	}

	.sea_btn {
		font-size: 28rpx;
		color: #2d2d2d;
		padding: 10rpx 24rpx;
		border: 1px solid #aeaeae;
		border-radius: 40rpx;
	}

	.sea_input_part {
		position: relative;
		display: flex;
		align-items: center;
		height: 88rpx;
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
	}

	.search-item .search-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48rpx;
		color: #2d2d2d;
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
		color: #2d2d2d;
		line-height: 50rpx;
		font-size: 24rpx;
		background-color: #f5f5f5;
		border-radius: 25rpx;
		margin-right: 20rpx;
		margin-top: 20rpx;
	}

	.search_result {
		background: #f8f8f8;
	}

	.search_result .title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 77rpx;
		width: 710rpx;
		padding: 0 20rpx;
	}

	.search_result .title text {
		color: #2d2d2d;
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
