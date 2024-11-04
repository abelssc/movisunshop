<template>
	<view>
		<view class="shop_list">
			<!-- 搜索 -->
			<view class="fixed_top_status_bar"></view>
		
			<view class="search">
				<!-- #ifdef H5 ||APP-PLUS -->
				  <image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'" mode="widthFix"></image>
				<!-- #endif -->
				<view class="search_input">
					<image :src="img_url+'shop_list_search.png'"></image>
					<input :placeholder="$L('请输入店铺名称')" :value="searchVal" @input="searchInput" @confirm="goSearch"></input>
					<image class="cancel" :src="img_url+'guanbi.png'" @tap="cancel" v-if="searchVal !=''"></image>
				</view>
				<view class="search_text" @tap="goSearch">{{$L('搜索')}}</view>
			</view>
			<!-- 搜索相关 -->
			<view class="search_content">
				<!-- 历史记录  -->
				<view class="historical_records" v-if="history_val && history_val.length">
					<view class="records_title">
						<text>{{$L('历史记录')}}</text>
						<image :src="img_url+'lajitong.png'" @tap.stop="clear_history"></image>
					</view>
					<view class="record_lists">
						<view v-for="(item, index) in history_val" :key="index" class="record_pre" @tap="goSearch" :data-sc_name="item">{{item}}</view>
					</view>
				</view>
				<!-- 店铺分类 -->
				<view class="store_classification" v-if="classifyList.length">
					<view class="classify_title">{{$L('店铺分类')}}</view>
					<view class="classification_content">
						<view v-for="(item, index) in classifyList" :key="index" class="classification_pre">
							<view class="classify_top" @tap="goSearch" :data-sc_id="item.sc_id">
								<text>{{item.sc_name}}</text>
								<image src="/static/images/arrow_right_b.png"></image>
							</view>
							<view class="classify_con" v-if="item.child">
								<text v-for="(child, index2) in item.child" :key="index2" class="classify_pre" @tap="goSearch" :data-sc_id="child.sc_id">{{child.sc_name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
		<common :title="$L('店铺列表')"></common>
	</view>
</template>

<script>
	import {
		checkSpace
	} from "../../utils/common";

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				bid: '',
				store_list: [],
				searchVal: '',
				//搜索框内的值
				classifyList: [],
				//店铺列表分类
				show: false,
				sc_name: '',
				//搜索内容
				pn: 1,
				//默认第一页
				hasmore: true,
				//更多
				sc_id: '',
				//二级分类id，或者一级分类
				history_val: [] //历史记录的数组
					,
				city_site_open: "",
				scrollTopH: 0,
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('店铺搜索')
      });
			let city_site_open = uni.getStorageSync('city_site_open');

			if (city_site_open) {
				let city_site_bind_id = uni.getStorageSync('city_site_bind_id');
				this.setData({
					bid: city_site_bind_id,
					city_site_open: city_site_open
				});
			}

			this.getShopClassify();
		},

		onShow() {
			//获取历史记录
			this.getHistoryList();
		},

		// 加载更多
		onReachBottom(e) {
			if (this.hasmore) {
				this.getShopClassify();
			}
		},
		//获取滚动条的当前位置
		onPageScroll: function(e) {
			this.scrollTopH = e.scrollTop;

		},
		methods: {
			//设置店铺历史记录缓存
			setHistoryData() {
				let {
					history_val,
					sc_name
				} = this;
				history_val.unshift(sc_name); // 最多取30条，不重复且不为空的数据

				history_val = history_val.reduce((a, b) => {
					a.length <= 30 && b && a.indexOf(b) == -1 ? a.push(b) : null;
					return a;
				}, []);
				let history_val_str = history_val.join('~');
				this.setData({
					history_val: history_val
				});
				uni.setStorage({
					key: "his_keyword_store",
					data: history_val_str
				});
			},

			//获取历史记录
			getHistoryList() {
				var history_val = uni.getStorageSync('his_keyword_store');

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

			//清空历史记录
			clear_history: function(e) {
				uni.removeStorageSync('his_keyword_store');
				this.setData({
					history_val: ''
				});
			},
	        go_back: function(e) {
				uni.navigateBack({})
			},
			//点击去搜索
			goSearch(e) {
				let sc_name = e.currentTarget.dataset.sc_name ? e.currentTarget.dataset.sc_name : this.searchVal ? this.searchVal :
					'';
				let sc_id = e.currentTarget.dataset.sc_id ? e.currentTarget.dataset.sc_id : '';
				this.setData({
					sc_name,
					sc_id
				});
				this.setHistoryData();
				uni.navigateTo({
					url: '/pages/shoplist/shoplist?sc_name=' + this.sc_name + '&sc_id=' + sc_id
				});
			},

			//获取搜索框内的值
			searchInput(e) {
				this.setData({
					searchVal: e.detail.value
				});
			},

			//清空搜索输入框内容
			cancel() {
				this.searchVal = '';
				this.setData({
					searchVal: ''
				});
			},

			// 获取店铺分类
			getShopClassify() {
				let that = this,
					bid = that.bid,
					key = uni.getStorageSync('token'),
					city_site_open = that.city_site_open;
				let data = {
					key: key
				};

				if (city_site_open && bid != '0') {
					data.bid = bid;
				}

				uni.showLoading({
					title: that.$L('加载中...')
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=store_search_list',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.state == 200) {
							that.classifyList = res.data.data;
							that.setData({
								classifyList: that.classifyList
							});
						}
					},
					error: function(err) {},
					complete: function() {
						uni.hideLoading();
					}
				});
			}

		}
	};
</script>
<style>
	/* pages/shoplist/shoplist.wxss */

	.shop_list {
		width: 750rpx;
		margin: 0 auto;
	}

	/* 搜索框 */
	.search {
		/* width: 100%; */
		width: 750rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 35rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		z-index: 10;
		background: #FFFFFF;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifdef H5 || APP-PLUS */		  
			 padding-left:10rpx
		/* #endif */
	}
	

	.search_input {
		width: 570rpx;
		/* #ifdef H5 || APP-PLUS */
			width: 540rpx;
		/* #endif */
		height: 65rpx;
		border: 2rpx solid rgba(225, 37, 27, 1);
		border-radius: 33rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.search_input image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.search_input .cancel {
		width: 47rpx;
		height: 47rpx;
	}

	.search input {
		width: 500rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(148, 148, 148, 1);
		line-height: 32rpx;
	}

	.search_text {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	/* 搜索记录 */
	.search_content {
		/* width: 100%; */
		width: 750rpx;
		background: #F5F5F5;
		padding: 39rpx 20rpx 20rpx;
		box-sizing: border-box;
		margin-top: 92rpx;
		position: absolute;
	}

	.historical_records {
		width: 100%;
	}

	.records_title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.records_title text {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.records_title image {
		width: 31rpx;
		height: 33rpx;
	}

	.record_lists {
		display: inline-table;
		margin-top: 21rpx;
	}

	.record_pre {
		margin-right: 10rpx;
		float: left;
		padding: 0 18rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 25rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		margin-bottom: 20rpx;
	}

	/* 店铺分类 */
	.store_classification {
		width: 100%;
		margin-top: 18rpx;
		/* #ifdef APP-PLUS */
		margin-top: calc(var(--status-bar-height) + 18rpx);
		/* #endif */
	}

	.classify_title {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
	}

	.classification_content {
		width: 710rpx;
		/* height:723rpx; */
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 33rpx;
	}

	.classification_pre {
		border-bottom: 1rpx solid #fbfbfb;
		padding: 30rpx 0;
	}

	.classify_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.classify_top text {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 32rpx;
		font-weight: bold;
	}

	.classify_top image {
		width: 22rpx;
		height: 22rpx;
	}

	.classify_con {
		display: flex;
		flex-wrap: wrap;
	}

	.classify_pre {
		width: 155rpx;
		height: 50rpx;
		padding: 0 15rpx;
		box-sizing: border-box;
		background: rgba(245, 245, 245, 1);
		border-radius: 25rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		margin-right: 11rpx;
		margin-top: 20rpx;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		line-height: 50rpx;
	}

	.classify_pre:nth-of-type(4n) {
		margin-right: 0;
	}

	.fixed_top_status_bar {
		position: fixed;
		/* #ifdef APP-PLUS */
		height: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		height: 0;
		/* #endif */
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background: #fff;
	}
	.top_w_b {
		height: 30rpx;
		width: 30rpx;
		margin: 0 20rpx;
		display: block;
	}	
</style>
