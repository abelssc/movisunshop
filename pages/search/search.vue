<template>
	<view>
		<view class="sea_input_part">
			<!-- #ifndef MP-WEIXIN -->
			<image src="../../static/integral/images/crright.png" mode="" style="transform:rotate(180deg);" class="go_back" @click="goBack"></image>
			<!-- #endif -->
			<view>
				<image class="search" :src="img_url+'search.png'"></image>
				<input confirm-type="search" class="sea_input" type="text" v-model="in_value" @input="input" :placeholder="$L('请输入关键词')"
				 @confirm="in_confirm"></input>
				<image v-if="in_value" class="clear_input" @tap.stop="clear_input" :src="img_url+'clear_input.png'"></image>
			</view>
			<label class="sea_btn" @tap.stop="btn_search">{{$L('搜索')}}</label>
		</view>

		<view class="search-item" v-if="history_val && history_val.length">
			<view class="search-title">
				<text>{{$L('搜索历史')}}</text>
				<view class="del" @tap.stop="clear_history">
					<image :src="img_url+'del_search.png'"></image>
				</view>
			</view>

			<view class="search-con">
				<view v-for="(item, index) in history_val" :key="index" class="item" :data-keyword="item" @tap.stop="go_glist">{{item}}</view>
			</view>
		</view>

		<view class="search-item" v-if="list_info && list_info.hot_list && list_info.hot_list.length">
			<view class="search-title">
				<text>{{$L('热门搜索')}}</text>
			</view>

			<view class="search-con">
				<view v-for="(item, index) in list_info.hot_list" :key="index" class="item" :data-keyword="item" @tap.stop="go_glist">
					{{item}}
				</view>
			</view>
		</view>

		<common :title="$L('搜索')"></common>
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
				in_value: '',
				history_val: '',
				list_info: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('搜索')
      });
			// 	生命周期函数--监听页面加载
			var that = this;
			uni.request({
				url: getApp().globalData.ser_url + '/index.php?app=index&mod=search_key_list_xcx',
				data: {},
				dataType: 'json',
				success: function(result) {
					that.setData({
						list_info: result.data
					});
				}
			});
		},

		onShow() {
			//获取历史记录
			this.getHistoryList();
		},

		methods: {
			//获取历史记录
			getHistoryList() {
				var history_val = uni.getStorageSync('his_keyword');

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

			//热门关键词事件
			go_glist: function(e) {
				//跳转到商品列表页面
				uni.navigateTo({
					url: '../goods_list/goods_list?keyword=' + e.currentTarget.dataset.keyword
				});
				this.setData({
					in_value: e.currentTarget.dataset.keyword
				});
			},

			input(e) {
				this.setData({
					in_value: e.detail.value
				});
			},

			//清空搜索内容
			clear_input() {
				this.setData({
					in_value: ''
				});
			},

			//点击弹起的键盘按钮时触发
			in_confirm: function(e) {
				if (this.in_value != this.$L('请输入关键词') || this.in_value != '') {
					uni.navigateTo({
						url: '../goods_list/goods_list?keyword=' + this.in_value
					});
				}
			},
			//搜索事件
			btn_search: function(e) {
				if (this.in_value != this.$L('请输入关键词') || this.in_value != '') {
					uni.navigateTo({
						url: '../goods_list/goods_list?keyword=' + this.in_value
					});
				}
			},
			//清空历史记录事件
			clear_history: function(e) {
				uni.removeStorageSync('his_keyword');
				this.setData({
					history_val: ''
				});
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	};
</script>
<style>
	page {
		background-color: #fff;
		width: 750rpx;
		margin: 0 auto;
	}

	.go_back{
		width: 20rpx;
		height: 28rpx;
	}


	/* #ifdef APP-PLUS  */
	.sea_input_part {
		margin-top: var(--status-bar-height);
	}
	/* #endif */
	.sea_input {
		flex: 1;
		height: 65rpx;
		font-size: 26rpx;
		color: #333;
	}

	.sea_input_part .search {
		width: 30rpx;
		height: 30rpx;
		margin-right: 22rpx;
	}

	.sea_input_part .clear_input {
		width: 30rpx;
		height: 30rpx;
		/* margin-left: 10rpx; */
		margin-right: 20rpx;

	}

	.sea_input_part view {
		display: flex;
		align-items: center;
		border: none;
		width: 80%;
		/* #ifdef APP-PLUS || H5 */
		width: 78%;
		/* #endif */
		margin-left: 20rpx;
		height: 65rpx;
		padding-left: 20rpx;
		border-radius: 32.5rpx;
		background-color: #f5f5f5;
	}

	.sea_btn {
		font-size: 30rpx;
		color: #2D2D2D;
		padding: 10rpx 0 10rpx 25rpx;  
	}

	.sea_input_part {
		position: relative;
		display: flex;
		align-items: center;
		height: 88rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
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
</style>
