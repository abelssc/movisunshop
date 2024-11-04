<template>
	<view>
		<view class="commodity_evaluation" v-if="comment.total!=undefined">
			<view class="evaluation_top">
				<view class="evaluation_top_left">
					{{$L('商品评价')}}
					<text>({{comment.total}})</text>
				</view>
				<view class="evaluation_top_right">
					{{$L('好评率')}}
					<text v-if="comment.total != 0">{{comment.goods_rate}}%</text>
					<text v-else>0</text>
				</view>
			</view>
			<view class="tag-nav">
				<view :class="'nav-item ' + (comment_state=='all'?'on':'')" data-state='all' @tap="selectComment">{{$L('全部')}}({{comment.total}})</view>
				<view :class="'nav-item ' + (comment_state=='good'?'on':'')" data-state="good" @tap="selectComment">{{$L('好评')}}({{comment.good_total}})</view>
				<view :class="'nav-item ' + (comment_state=='normal'?'on':'')" data-state="normal" @tap="selectComment">{{$L('中评')}}({{comment.normal_total}})</view>
				<view :class="'nav-item ' + (comment_state=='bad'?'on':'')" data-state="bad" @tap="selectComment">{{$L('差评')}}({{comment.bad_total}})</view>
			</view>
		</view>


		<view class="eval-list" v-if="comment_list.length">
			<view v-for="(item, index) in comment_list" :key="index" class="eval-item">
				<view class="item-top">
					<image :src="item.member_logo" mode="aspectFit"></image>
					<text class="name">{{item.geval_frommembername}}</text>
					<Rate :disable="true" :score="item.geval_scores*1" :size="25" :padding="5"></Rate>
					<!-- <text class="time">{{item.wap_gevel_addtime}}</text> -->
				</view>

				<view class="item-main">
					<!-- <Rate disable="{{true}}" score="{{item.geval_scores*1}}" size="{{25}}" padding="{{5}}" /> -->
					<text class="time">{{item.wap_gevel_addtime}}</text>
					<view class="txt">{{item.geval_content}}</view>
					<view class="geval-image" v-if="item.geval_images">
						<view v-for="(child, index2) in item.geval_images" :key="index2" class="img">
							<image :src="child" :data-src="child" @tap="previewImg($event,item.geval_images)" mode="aspectFit"></image>
						</view>
					</view>
					<view class="bus_response" v-if="item.geval_explain&&item.geval_explain.length>0">
						<text>{{$L('商家回复：')}}</text>
						<text>{{item.geval_explain}}</text>
					</view>
				</view>
			</view>
			<view class="no_more_data" v-if="noMoreData == true">{{$L('没有更多数据~')}}</view>
			<!-- 底部站位栏 -->
			<view class="iphone_view" :style="'height:'+bottomSateArea"></view>
		</view>

		<view class="empty" v-if="!comment_list.length && !isloading">
			<view class="img">
				<image :src="img_url+'mcc_04_w.png'" mode="widthFix"></image>
			</view>
			<text>{{$L('暂无数据')}}</text>
		</view>

		<common :title="$L('商品评价')"></common>
	</view>
</template>

<script>
	var is_load = true;
	var get_comments = function(that) {
		uni.showLoading({
			title: that.$L('加载中...')
		});
		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getGoodsDetailComments_xcx',
			data: {
				gid: that.gid,
				commenttype: that.comment_state == 'all' ? '' : that.comment_state,
				pn: that.pn,
				rows: that.rows
			},
			dataType: 'json',
			success: function(result) {
				var pn = that.pn; //如果是初次加载，直接赋值，否则数据追加

				var data = [];

				if (pn == 1) {
					data = result.data.datas.comment;
					that.setData({
						comment: result.data.datas
					});
				} else {
					data = that.comment_list.concat(result.data.datas.comment);
				}

				if (result.data.hasmore) {
					pn = pn + 1;
					is_load = true;
				} else {
					is_load = false;
				} // //如果hasmore为true，则


				that.setData({
					comment_list: data,
					pn: pn,
					hasmore: result.data.hasmore
				});
			},

			complete() {
				that.setData({
					isloading: false
				});
				uni.hideLoading();
			}

		});
	};
	import Rate from "../../component/Rate/Rate";

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				gid: 0,
				comment_state: 'all',
				pn: 1,
				rows: 10,
				hasmore: true,
				show_go_top: true,
				scroll_height: 0,
				comment_list: [],
				isloading: true,
				comment: {}, //评论
				scrren_height: "",
				noMoreData:false,   //没有更多数据的提示
				bottomSateArea:getApp().globalData.bottomSateArea,//iphone手机底部一条黑线的高度
			};
		},

		components: {
			Rate
		},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('评价')
      });
			//获取商品id
			this.setData({
				gid: options.gid
			}); //获取全部好评状态下的数据
			
			get_comments(this); //获取滚动区域的高度

			var new_that = this;
			uni.getSystemInfo({
				success: function(res) {
					var scroll_height = res.windowHeight;
					new_that.setData({
						scrren_height: scroll_height
					});
				}
			});
		},

		onReachBottom() {
			if (is_load) {
				is_load = false;
				var loadmore = this;
				get_comments(this);
			}else{
				this.noMoreData = true;
			}
		},

		methods: {
			selectComment: function(e) {
				var state = e.target.dataset.state;
				this.setData({
					comment_state: state,
					pn: 1
				});
				this.setData({
					scroll_height: 0
				}); //获取相应状态下的数据

				get_comments(this);
			},
			//滚动监听的方法
			scroll: function(e) {
				var is_show = true;

				if (e.detail.scrollTop > 200) {
					is_show = false;
				}

				this.setData({
					show_go_top: is_show
				});
			},
			//返回顶部事件
			go_top: function(e) {
				this.setData({
					scroll_height: 0,
					pn: 1
				});
			},

			previewImg(e,geval_images) {
				let src = e.currentTarget.dataset.src;
				if(src.indexOf('https:') != -1){
					src = e.currentTarget.dataset.src;
				}else{
				   src ='https:'+ e.currentTarget.dataset.src;
				} 
				let imgList = geval_images; //获取data-list
				imgList && imgList.map((item,index)=>{
					imgList[index]= src.indexOf('https:') != -1 ? item : 'https:'+item
				})
				uni.previewImage({
					current:src,
					// 当前显示图片的http链接
					urls: imgList.length > 1 ? imgList : [src] // 需要预览的图片http链接列表
				});
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

	.commodity_evaluation {
		width: 100%;
		background: #fff;
		border-top: 20rpx solid rgba(245, 245, 245, 1);
		border-bottom: 20rpx solid rgba(245, 245, 245, 1);
	}

	.evaluation_top {
		width: 100%;
		height: 79rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.evaluation_top_left {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
	}

	.evaluation_top_left text {
		font-size: 22rpx;
	}

	.evaluation_top_right {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 45rpx;
	}

	.evaluation_top_right text {
		color: #666666;
	}


	.bus_response {
		background: #F8F8F8;
		border-radius: 15rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #2D2D2D;
		line-height: 36rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.tag-nav {
		width: 750rpx;
		display: flex;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		font-size: 28rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		// justify-content: space-between;
	}

	.tag-nav .nav-item {
		min-width: 180rpx;
		height: 50rpx;
		background: rgba(245, 245, 245, 1);
		border: 1rpx solid rgba(245, 245, 245, 1);
		border-radius: 25px;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		padding: 0 10rpx;
		color: rgba(45, 45, 45, 1);
		line-height: 50rpx;
		text-align: center;
		margin: 0 20rpx 22rpx 20rpx;
	}

	.tag-nav .nav-item.on {
		min-width: 180rpx;
		height: 50rpx;
		border: 1rpx solid rgba(252, 28, 28, 1);
		border-radius: 25rpx;
		background: #FFF3F3;
		color: #fc1c1c;
	}

	.eval-list {
		padding-top: 20rpx;
	}

	.eval-list .eval-item {
		padding-left: 30rpx;
	}

	.eval-item .item-top {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding-right: 30rpx;
	}

	.eval-item .item-top image {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.eval-item .item-top .name {
		/* flex: 1; */
		margin-left: 20rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(45, 45, 45, 1);
		line-height: 45rpx;
		margin-right: 20rpx;
	}

	.eval-item .time {
		color: #BBB;
		font-size: 26rpx;
	}

	.eval-item .item-main {
		padding-right: 30rpx;
		padding-top: 20rpx;
	}

	.eval-item .item-main .txt {
		display: block;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 39rpx;
		padding: 15rpx 0;
		box-sizing: border-box;
	}

	.eval-item .geval-image {
		display: flex;
		align-items: center;
		/* flex-wrap: wrap; */
		overflow-x: scroll;
	}

	.geval-image .img {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 20rpx 20rpx 0;
		width: 223rpx;
		height: 223rpx;
		border-radius: 15rpx;
	}

	.geval-image .img image {
		width: 223rpx;
		height: 223rpx;
		border-radius: 15rpx;
		display: block;
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 200rpx;
	}

	.empty .img {
		width: 150rpx;
		height: 150rpx;
		background-color: #ddd;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty .img image {
		width: 110rpx;
		height: 110rpx;
	}

	.empty text {
		color: #666;
		font-size: 26rpx;
		margin-top: 30rpx;
	}
	.no_more_data{
		width: 100%;
		text-align: center;
		font-size: 26rpx;
		margin-bottom: 20rpx;
		color: #C1C1C1;
	}
	.iphone_view{
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
	}
</style>
