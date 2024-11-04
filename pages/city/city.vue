<template>
	<view>
		<view class="city">
			<!-- #ifdef APP-PLUS -->
			<view class="status_bar"></view>
			<!-- #endif -->
			<view class="search">
				<!-- #ifndef MP-WEIXIN -->
				<image src="../../static/integral/images/crright.png" mode="" style="transform:rotate(180deg);" class="go_back"
				 @click="goBack"></image>
				<!-- #endif -->
				<view class="s_input">
					<image :src="img_url+'search_city.png'" mode="widthFix" class="search_img"></image>
					<input type="text" :placeholder="$L('请输入城市搜索')" :value="search" @input="searchInput" @confirm="searchFun"></input>
					<image :src="img_url+'city_clear.png'" v-if="search" class="city_clear" @tap="clearInput"></image>
				</view>
				<view class="search_txt" @click="searchFun">{{$L('搜索')}}</view>
			</view>
			<view class="search_container" v-if="search">
				<view v-for="(item, index) in searchList" :key="index" :id="index" class="search_item">
					<view v-for="(childItem, index2) in item" :key="index2" :data-abid="childItem.area_id" :data-cbid="childItem.city_id"
					 :data-pbid="childItem.province_id" :data-city_site_area_name="childItem.sld_city_site_name"
					 :data-city_site_site_id="childItem.id" @tap="chooseCity">{{childItem.sld_city_site_name}}</view>
				</view>
				<view class="search_nodata" v-if="search&&searchList.length==0&&!loading">
					<image :src="img_url+'nocity.png'"></image>
					<text>{{$L('该城市暂无分站')}}</text>
				</view>
			</view>
			<view class="current_city">
				<text class="current_site_text">{{$L('当前站点')}}</text>
				<image :src="img_url+'position.png'"></image>
				<text>{{city}}</text>
			</view>
			<view class="h20">

			</view>

			<view class="all_city">

				<scroll-view scroll-y class="all_city_scroll" :scroll-into-view="scroll_letter">
					<view class="hot_city">
						<view class="title">{{$L('热门推荐')}}</view>
						<view class="city_list">
							<text class="city_item" v-if="is_allow_show_default" data-abid="0" data-cbid="0" data-pbid="0"
							 :data-city_site_area_name="$L('全国')" data-city_site_site_id="0" @tap="chooseCity">{{$L('全国')}}</text>
							<text v-for="(item, index) in hotCity" :key="index" class="city_item" :data-abid="item.area_id" :data-cbid="item.city_id"
							 :data-pbid="item.province_id" :data-city_site_area_name="item.sld_city_site_name" :data-city_site_site_id="item.id"
							 @tap="chooseCity">{{item.sld_city_site_name}}</text>
						</view>
					</view>
					<view v-for="(item, index) in cityList" :key="index" :id="index" class="all_city_item">
						<text class="top_letter">{{index}}</text>
						<view v-for="(childItem, index2) in item" :key="index2" :data-abid="childItem.area_id" :data-cbid="childItem.city_id"
						 :data-pbid="childItem.province_id" :data-city_site_area_name="childItem.sld_city_site_name"
						 :data-city_site_site_id="childItem.id" @tap="chooseCity">{{childItem.sld_city_site_name}}</view>
					</view>
				</scroll-view>
				<view class="search_letter" v-if="cityList">
					<view class="search_letter_all">
						#
					</view>
					<view v-for="(item, index) in cityList" :key="index" :class="current_letter==index?'search_letter_on on':'search_letter_on'"
					 @click='toSelectCityPosition(index)'>
						{{index}}
					</view>
				</view>
			</view>

		</view>
		<common :title="$L('城市分站')"></common>
	</view>
</template>

<script>
	let baseUrl = getApp().globalData.ser_url;

	export default {
		data() {
			return {
				cityList: '',
				hotCity: '',
				city: '',
				is_allow_show_default: false,
				search: '',
				//搜索词
				searchList: '',
				// 搜索结果
				img_url: getApp().globalData.img_url,
				scroll_letter: '',
				current_letter: '',
				loading: false
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('城市分站')
      });
			let city = uni.getStorageSync('city_site_area_name');

			if (city) {
				this.setData({
					city
				});
			}

			this.getCityList();
		},
		methods: {
			// 获取城市列表
			getCityList(search) {
				let that = this;
				let data = {};
				that.loading = true
				if (search) {
					data.term = search;
				}

				uni.request({
					url: baseUrl + '/index.php?app=index&mod=city_site_list',
					method: 'GET',
					data,
					success: function(res) {
						if (res.data.code == 200) {
							if (!search) {
								that.setData({
									cityList: res.data.datas.citylist,
									hotCity: res.data.datas.hotlist,
									is_allow_show_default: res.data.datas.is_allow_show_default
								});
							} else {
								that.setData({
									searchList: res.data.datas.citylist,
									is_allow_show_default: res.data.datas.is_allow_show_default
								});
							}
							that.loading = false
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							that.loading = false
						}
					},
					error: function(err) {}
				});
			},

			searchInput(e) {
				this.setData({
					search: e.detail.value
				});
				this.searchFun();
			},

			// 搜索
			searchFun() {
				let search = this.search;
				if (!search) {
					this.setData({
						searchList: ''
					});
					return;
				}

				this.getCityList(search);
			},

			// 选择城市
			chooseCity(e) {
				let abid = Number(e.currentTarget.dataset.abid);
				let cbid = Number(e.currentTarget.dataset.cbid);
				let pbid = Number(e.currentTarget.dataset.pbid);
				let city_site_area_name = e.currentTarget.dataset.city_site_area_name;
				let city_site_site_id = abid == ''?(cbid == ''?pbid:cbid):abid;
				let bid = abid || cbid || pbid;
				// let page = getCurrentPages();
				// let beforePage = page[page.length - 2]
				// page[page.length - 2].$vm.setCityInfo(bid, city_site_area_name, city_site_site_id);
				var cityInfo = {
					bid,
					city_site_area_name,
					city_site_site_id
				}
				uni.setStorage({
					key: 'cityInfo',
					data: cityInfo,
					success() {
						uni.switchTab({
							url: '/pages/index/index'
						})
					},
				})
			},

			clearInput() {
				this.search = '';
				this.getCityList(this.search);
				this.searchList = ''
			},
			goBack() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			toSelectCityPosition(letter) {
				this.scroll_letter = letter
				this.current_letter = letter
			}

		}
	};
</script>
<style>
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: #ffffff;
	}


	.go_back {
		width: 20rpx;
		height: 28rpx;
	}

	page {
		width: 750rpx;
		margin: 0 auto;
		overflow-y: hidden;
	}

	.city {
		width: 100%;
	}

	.city .search {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 108rpx;
		background-color: #fff;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		/* #ifdef APP-PLUS */
		margin-top: var(--status-bar-height);
		/* #endif */
		box-sizing: border-box;
	}

	.search_container {
		position: fixed;
		top: 96rpx;
		/* #ifdef APP-PLUS */
		top: calc(96rpx + var(--status-bar-height));
		/* #endif */
		left: 0;
		right: 0;
		height: calc(100vh - 96rpx);
		background-color: #fff;
		z-index: 100;
		font-size: 28rpx;
		overflow-y: scroll;
	}

	.search_nodata {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.search_nodata image {
		width: 210rpx;
		height: 210rpx;
		margin: 0 auto;
		margin-top: 180rpx;
	}

	.search_nodata text {
		font-size: 28rpx;
		color: #666666;
		margin-top: 30rpx;
	}

	.search_item {
		/* padding: 10rpx 0 30rpx 0;
		width: 691rpx;
		margin: 0 auto;
		border-bottom: 1rpx solid #f2f2f2; */
	}

	.search_item view {
		padding: 30rpx 0 30rpx 0;
		width: 691rpx;
		margin: 0 auto;
		border-top: 1rpx solid #f2f2f2;
		color: #333333;
	}

	.search_item view:nth-child(1) {
		border-top: none;
	}

	.search_img {
		width: 26rpx;
		height: 26rpx;
		margin: 0 20rpx;
		display: inline-block;
	}

	.city_clear {
		width: 30rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.search .s_input {

		width: 575rpx;
		/* #ifdef MP-WEIXIN */
		width: 590rpx;
		/* #endif */
		height: 60rpx;
		background-color: #f3f3f3;
		border-radius: 30rpx;
		/* font-size: 30rpx; */
		/* line-height: 60rpx; */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.s_input input {
		height: 60rpx;
		/* width: 452rpx; */
		font-size: 28rpx;
		line-height: 66rpx;
		flex: 1;
	}

	.uni-input-placeholder::after {
		content: ' ';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
		margin-top: 1px;
	}

	.search_txt {
		font-size: 30rpx;
		color: #333333;
	}

	.current_city {
		display: flex;
		align-items: center;
		color: #8c8b8b;
		font-size: 32rpx;
		margin-top: 108rpx;
		overflow: hidden;
		padding-left: 30rpx;
		margin-bottom: 20rpx
	}


	.current_city image {
		width: 24rpx;
		height: 31rpx;
		margin-left: 32rpx;
	}

	.current_city text:last-child {
		margin-left: 20rpx;
		font-weight: bold;
		color: #333333;
		font-size: 32rpx;
	}

	.current_site_text {
		font-size: 28rpx;
	}

	.hot_city {
		font-size: 28rpx;
		color: #3a3a3a;
		padding: 0 10rpx 0 30rpx;
		display: flex;
		align-items: center;
		margin-top: 20rpx;
	}

	.hot_city .title {
		color: #808080;
		width: 112rpx;
		align-self: flex-start;
		word-break: break-all;
		/* line-height: 44rpx; */
	}

	.hot_city .city_list {
		display: flex;
		flex-wrap: wrap;
		margin-left: 48rpx;
		width: 545rpx;
	}

	.hot_city .city_list .city_item {
		max-width: 222rpx;
		height: 46rpx;
		background: #F5F5F5;
		border-radius: 23px;
		text-align: center;
		line-height: 46rpx;
		padding: 0 21rpx;
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 20rpx;
		display: inline-block;
	}

	.hot_city .city_list .city_item:nth-child(4n) {
		margin-right: 0;
	}

	.hot_city .city_list .city_item::after {
		content: ' ';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
		margin-top: 1px;
	}

	.all_city {
		/* margin-left: 30rpx; */
		/* margin-right: 20rpx; */
		/* display: flex; */
		/* align-items: center; */
		/* place-items: flex-start; */
		position: relative;
	}

	.all_city_item view {
		display: flex;
		line-height: 50rpx;
		padding: 30rpx 0;
		color: #5c5c5c;
		font-size: 28rpx;
		border-top: 1rpx solid #F5f5f5;
		margin-left: 30rpx;
		margin-right: 60rpx;
	}

	.all_city_item view:nth-child(2) {
		border: none;
	}

	.all_city_scroll {
		flex: 1;
		height: calc(100vh - 172rpx);
	}

	.search_letter {
		font-size: 26rpx;
		position: absolute;
		right: 20rpx;
		top: 134rpx;
	}

	.search_letter_all {
		color: #999999;
		line-height: 32rpx;
	}

	.search_letter_on {
		color: #333333;
		line-height: 32rpx;
	}

	.on {
		color: #FF1642;
	}

	.seach_result {
		position: absolute;
		top: 108rpx;
		width: 100%;
		max-height: 360rpx;
		background-color: #fff;
	}

	.h20 {
		width: 100%;
		height: 1rpx;
		background-color: #f5f5f5;
	}

	.top_letter {
		/* height: 30rpx; */
		width: 100%;
		background-color: #f5f5f5;
		display: inline-block;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		padding-left: 30rpx;
		line-height: 30rpx;
	}

	.top_letter::after {
		content: ' ';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
		margin-top: 1px;
	}
</style>
