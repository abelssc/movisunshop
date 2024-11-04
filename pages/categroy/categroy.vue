<template>
	<view>
		<!-- 引用 模板 -->
		<!-- 占位状态栏 start -->
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"> </view>
		<!-- #endif -->
		<view class="fixed_top_status_bar"></view>
		<view class="categroy_top">
			<view @tap.stop="go_search" class="search_goos"> <text class="iconfont sld_msousu"></text> {{$L('搜索商品')}}</view>
		</view>
		<view class="categroy_content">
			<scroll-view scroll-y="true" class="con_left">
				<ul>
					<block v-for="(item, index) in cat_one_list" :key="index">
						<li :data-index="index" @tap.stop="sele_one_class" :class="item.is_sele==1?'sele':''" :data-id="item.gc_id">{{item.gc_name}}</li>
					</block>
				</ul>
			</scroll-view>
			<scroll-view scroll-y="true" class="con_right" :scroll-top="scrollTop">
				<view class="cat_swiper" v-if="topSwiperData && topSwiperData.length>0">
					<uni-swiper-dot :info="topSwiperData" :current="current" field="content" :mode="topSwiperData && topSwiperData.length > 1 ? 'dot' : ''"
					 :dotsStyles="dotsStyles">
						<swiper class="swiper-box" @change="change" autoplay circular >
							<swiper-item v-for="(item_top ,index_top) in topSwiperData" :key="index_top" @click="skipTo(item_top.link_type,item_top.link_value,item_top.info)">
								<view class="swiper-item">
									<image class="item_img" :src='item_top.imgUrl' mode="aspectFit" />
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</view>
				<dl class="wrap_con_right">
					<block v-for="(item, index) in cat_sec_three" :key="index">
						<dt :data-id="item.gc_id" class="second_title" @tap.stop="go_goods_list">{{item.gc_name}}</dt>
						<view v-if="item.third_class.length>0" class="wrap_third_dl">
							<dd v-for="(item, index2) in item.third_class" :key="index2" @tap.stop="go_goods_list" :data-id="item.gc_id">
								<image :src="item.image" mode="aspectFit"></image>
								<text>{{item.gc_name}}</text>
							</dd>
						</view>
					</block>
				</dl>
			</scroll-view>
		</view>
		<common :title="$L('商品分类')"></common>
	</view>
</template>

<script>
	var cat_one_list_array;
	var cat_sec_third_array;
	import uniSwiperDot from "@/components/uni-swiper-dot.vue";
	import {
		linkTo
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				botnav: 'categroy',
				cat_one_list: cat_one_list_array,
				cat_sec_three: cat_sec_third_array,
				left_height: 0,
				scrollTop: 0,
				topSwiperData: [], //一级分类轮播图
				current: 0,
				currentId: '',
				dotsStyles: {
					selectedBackgroundColor: '#fff',
					width: 6,
					height: 6,
					selectedBorder: 'none',
					backgroundColor: 'rgba(0, 0, 0, .2)',
					border: 'none',
					bottom: 8
				}
			};
		},

		components: {
			uniSwiperDot
		},
		props: {},
    onShow() {
      uni.setTabBarItem({
      	index: 0,
      	text: this.$L('首页')
      })
      uni.setTabBarItem({
      	index: 1,
      	text: this.$L('分类')
      })
      uni.setTabBarItem({
      	index: 2,
      	text:this.$L('发现')
      })
      uni.setTabBarItem({
      	index: 3,
      	text: this.$L('购物车')
      })
      uni.setTabBarItem({
      	index: 4,
      	text: this.$L('我的')
      })
    },
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('商品分类')
      });
			// 	生命周期函数--监听页面加载
			//获取滚动区域的高度
			var new_that = this;
			uni.getSystemInfo({
				success: function(res) {
					var scroll_height = res.windowHeight - 76;
					new_that.setData({
						left_height: scroll_height
					});
				}
			}); //获取分类的左侧数据

			var that = this;
			uni.request({
				url: getApp().globalData.ser_url + '/index.php?app=goods_cat&mod=get_root_class_xcx',
				dataType: 'json',
				success: function(result) {
					cat_one_list_array = result.data.class_list;

					if (Array.isArray(cat_one_list_array) && cat_one_list_array.length > 0) {
						//根据第一个一级分类获取下面的二三级分类的数据
						var gc_id = cat_one_list_array[0].gc_id;
						that.topSwiperData = cat_one_list_array[0].ad_logo;
						that.topSwiperData = that.topSwiperData && that.topSwiperData.filter(item => item.imgUrl != '');
						that.current = 0;
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=goods_cat&mod=get_sec_third_class_xcx',
							dataType: 'json',
							data: {
								pid: gc_id
							},
							success: function(result) {
								cat_sec_third_array = result.data.class_list;
								that.setData({
									cat_one_list: cat_one_list_array,
									cat_sec_three: cat_sec_third_array
								});
							}
						});
					}
				}
			});
		},
		methods: {
			//跳转搜索页事件
			go_search: function(e) {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			//跳转到商品列表页面
			go_goods_list: function(e) {
				uni.navigateTo({
					url: '../goods_list/goods_list?gc_id=' + e.currentTarget.dataset.id
				});
			},
			//左侧一级分类点击事件
			sele_one_class: function(e) {
				var sele_index = e.currentTarget.dataset.index;
				var sele_id = e.currentTarget.dataset.id;

				for (var i = 0; i < this.cat_one_list.length; i++) {
					cat_one_list_array[i].is_sele = 0;
				}

				cat_one_list_array[sele_index].is_sele = 1;
				var that = this; //获取相应分类下面的二三级分类
				that.topSwiperData = cat_one_list_array[sele_index].ad_logo;
				that.topSwiperData = that.topSwiperData && that.topSwiperData.filter(item => item.imgUrl != '');

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=goods_cat&mod=get_sec_third_class_xcx',
					dataType: 'json',
					data: {
						pid: sele_id
					},
					success: function(result) {
						cat_sec_third_array = result.data.class_list;
						that.setData({
							cat_one_list: cat_one_list_array,
							cat_sec_three: cat_sec_third_array,
							scrollTop: 0
						});
					}
				});
			},
			change(e) {
				this.current = e.detail.current;
			},
			// 相关跳转
			skipTo(type, url, info) {

				linkTo(type, url, info)
			},
		}
	};
</script>
<style>
	page {
		background-color: #ffffff;
		width: 100%;
		height: 100vh;
		/* overflow: hidden; */
		justify-content: center;
		display:flex ;
	}

	/* #ifdef APP-PLUS  */
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: #ffffff;
		/* position: fixed; */
		/* top: 0; */
	}

	/* #endif */
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

	.categroy_top {
		position: relative;
		display: flex;
		align-items: center;
		height: 88rpx;
		background: #fff;
		padding: 0 30rpx;
	}

	.categroy_top::after {
		position: absolute;
		content: '';
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: #e5e5e5;
		transform: scaleY(0.5);
	}

	.categroy_top .search_goos {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		flex: 1;
		color: #949494;
		background: #F5F5F5;
		border-radius: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.categroy_top .search_goos text {
		color: #949494;
		font-size: 24rpx;
		margin: 0 20rpx;
	}

	.con_right {
		display: inline-block;
		width: calc(750rpx - 187rpx);
		vertical-align: top;
		background-color: #fff;
		overflow: hidden;
		box-sizing: border-box;
	}

	.wrap_con_right {
		display: block;
		padding: 20rpx 20rpx 0;
		box-sizing: border-box;
	}

	.con_left {
		display: inline-block;
		width: 187rpx;
		vertical-align: top;
		background: #f5f5f5;
	}

	.categroy_content scroll-view {
		height: calc(100vh - 88rpx);
	}
    /* #ifdef APP-PLUS */
    .categroy_content scroll-view {
    	height: calc(100vh - 88rpx - var(--status-bar-height));
    }
    /* #endif */
	.con_left ul li {
		position: relative;
		display: block;
		width: 100%;
		height: 88rpx;
		color: #232326;
		font-size: 28rpx;
		line-height: 88rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 36rpx;
		box-sizing: border-box;
	}

	.con_right .wrap_con_right .second_title {
		display: block;
		color: #2d2d2d;
		font-size: 28rpx;
		height: 68rpx;
		line-height: 68rpx;
		margin-top: 20rpx;
		padding-left: 20rpx;
	}

	.con_right .wrap_con_right .second_title:first-child {
		margin-top: 0;
	}

	.wrap_third_dl {
		display: flex;
		flex-wrap: wrap;
		background: #fff;
		border-radius: 6rpx;
		width: calc(750rpx - 227rpx);
		box-shadow: 0 0 5px #f5f5f5;
	}

	.wrap_third_dl dd {
		width: 33.3%;
		box-sizing: border-box;
		padding: 0 20rpx;
		margin-top: 20rpx;
	}

	.wrap_third_dl dd:nth-child(-n+3) {
		margin-top: 12rpx;
	}

	.wrap_third_dl dd image {
		width: 133rpx;
		height: 133rpx;
		display: block;
	}

	.wrap_third_dl dd text {
		width: 133rpx;
		text-align: center;
		font-size: 24rpx;
		color: #333;
		line-height: 60rpx;
		height: 60rpx;
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.con_left ul li.sele {
		color: #e1251b;
		font-size: 28rpx;
		font-weight: bold;
		background-color: #fff;
	}

	.con_left ul li.sele::after {
		position: absolute;
		content: '';
		left: 0;
		top: 50%;
		width: 6rpx;
		height: 36rpx;
		background-color: #e1251b;
		border-radius: 3rpx;
		transform: translateY(-50%);
	}

	.cat_swiper {
		width: 520rpx;
		margin: 22rpx auto 0;
	}

	.swiper-box {
		width: 520rpx;
		height: 210rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.swiper-item {
		width: 520rpx;
		height: 210rpx;

	}

	.item_img {
		width: 520rpx;
		height: 210rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
</style>
