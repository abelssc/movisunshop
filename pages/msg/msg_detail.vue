<template>
	<view>
		<view class="msg_detail">
			<view class="wrap">

				<block v-if="MsgList.length">
					<view v-for="(item, index) in MsgList" :key="index" class="list">
						<view class="msg-time"><text>{{item.message_date}}</text></view>

						<view class="msg-body">

							<view class="detail_top">
								<view class="msg_mian">{{item.message_title}}</view>
								<view :class="'is-read ' + (item.is_read?'':'b')">{{item.is_read ? $L('已读'):$L('未读')}}</view>
							</view>

							<view class="detail_bottom">
								<view :class="'msg-main ' + (item.showMore?'':'hidden')">{{item.message_body}}</view>

								<!-- 其他信息 -->
								<view class="more-txt" :data-type="item.redirect_type" :data-params="item.redirect_param" @tap="goDetail" v-if="item.redirect_type && type!='sys'">
									<text>{{$L('查看更多')}}>></text>
								</view>
							</view>

						</view>

					</view>
				</block>

				<block v-if="!MsgList.length && isLoading">
					<view class="not">
						<view class="img">
							<image :src="img_url+'active2_m.png'"></image>
						</view>
						<text>{{$L('暂无消息')}}</text>
					</view>
				</block>

			</view>

		</view>

		<common :title="$L('消息详情')"></common>
	</view>
</template>

<script>
import {getCurLanguage} from '../../utils/common.js'
	const typeList = {
		sys: getCurLanguage('亲，系统公告来了'),
		fahuo: getCurLanguage('发货提醒'),
		fukuan: getCurLanguage('付款信息'),
		yue: getCurLanguage('余额变动'),
		tui: getCurLanguage('退款退货')
	};

	function timeInit(date) {
		var time = new Date(date * 1000);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		var h = time.getHours();
		var min = time.getMinutes();
		var s = time.getSeconds();

		function init(val) {
			return val > 9 ? val : '0' + val;
		}

		return y + '-' + init(m) + '-' + init(d) + ' ' + init(h) + ':' + init(min) + ':' + init(s);
	}

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				MsgList: [],
				type: '',
				key: '',
				isLoading: false,
				pn: 1,
				hasmore: true,
				refresh: false,
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('消息详情')
      });
			let type = options.type;
			let key = uni.getStorageSync('token');
			this.setData({
				key
			});

			if (type) {
				this.setData({
					type
				});
				// this.getSiteMsg(type);
			}
		},
		onShow() {
			this.pn = 1
			if (this.type) {
				this.getSiteMsg(this.type);
			}
		},
		onReachBottom() {
			if (this.hasmore) {
				this.getSiteMsg();
			}
		},

		onReachBottom() {
			if (this.hasmore) {
				this.getSiteMsg(this);
			}
		},

		onPullDownRefresh() {
			this.setData({
				pn: 1,
				hasmore: true,
				refresh: true
			});
			this.getSiteMsg(this);
		},
		methods: {
			getSiteMsg() {
				let {
					key,
					type
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=mysystemmsg',
					data: {
						pageSize: 10,
						pn: this.pn,
						key: key,
						type: type
					},
					success: res => {
						if (res.data.state == 200) {
							let list = res.data.data.list ? res.data.data.list : [];

							if (list.length) {
								let pages = res.data.data.pagination;
								list.forEach(el => {
									let len = el.message_body.length;
									el.isShowMore = len > 75 ? true : false;
									el.showMore = false;
									el.message_title = el.message_title ? el.message_title : typeList[type];
								});

								if (this.pn == 1) {
									this.setData({
										MsgList: list
									});
								} else {
									let {
										MsgList
									} = this;
									this.setData({
										MsgList: MsgList.concat(list)
									});
								}

								if (pages.total <= this.pn) {
									this.hasmore = false;
								} else {
									this.pn++;
								}
							}
						}
					},
					complete: () => {
						this.setData({
							isLoading: true
						});
					}
				});
			},
			showMore(e) {
				let id = e.currentTarget.dataset.id;
				let {
					MsgList
				} = this;

				for (let i = 0; i < MsgList.length; i++) {
					let el = MsgList[i];

					if (el.message_id == id) {
						el.showMore = !el.showMore;
						break;
					}
				}

				this.setData({
					MsgList
				});
			},

			goDetail(e) {
				let type = e.currentTarget.dataset.type;
				let params = e.currentTarget.dataset.params;
				let {
					key
				} = this;

				switch (type) {
					case 'fahuo':
						uni.navigateTo({
							url: '/pages/order_detail/order_detail?order_id=' + params
						});
						break;

					case 'fukuan':
						uni.navigateTo({
							url: '/pages/Balance/Balance?type=banance'
						});
						break;

					case 'yue':
						uni.navigateTo({
							url: '/pages/Balance/Balance?type=banance'
						});
						break;

					case 'tui':
						uni.navigateTo({
							url: '/pages/refund/refund?id=' + params
						});
						break;
					case 'prepare':
						uni.navigateTo({
							url: '/pages/goods_detail/goods_detail?gid=' + params
						});
						break;

					default:
						break;
				}
			}

		}
	};
</script>
<style>
	/* pages/msg/msg_detail.wxss */
	page {
		width: 750rpx;
		margin: 0 auto;
		height: 100%;
	}

	.msg_detail {
		width: 750rpx;
		min-height: 94vh;
		background-color: #f6f6f6;
	}

	.wrap {
		padding: 30rpx;
		overflow: hidden;
	}

	.wrap .list {
		position: relative;
		color: #333;
		overflow: hidden;
	}

	.wrap .list:last-child {
		margin-bottom: 20rpx;
	}

	.list .msg-time {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 25rpx 0;
	}

	.list .msg-time text {
		display: block;
		height: 43rpx;
		border-radius: 4rpx;
		background-color: #bbb;
		color: #fff;
		line-height: 43rpx;
		padding: 0 20rpx;
		font-size: 22rpx;
	}

	.list .msg-body {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 0 25rpx 20rpx;
	}

	.wrap .list .detail_top {
		display: flex;
		height: 78rpx;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		color: #181818;
	}

	.detail_top .is-read {
		font-size: 22rpx;
		color: #bbb;
	}

	.detail_top .is-read.b {
		color: #2e95ff;
	}

	.detail_bottom {
		font-size: 28rpx;
		color: #777;
	}

	.detail_bottom .msg-main {
		line-height: 40rpx;
	}

	.detail_bottom .msg-main.hidden {
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.not {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #666;
		font-size: 32rpx;
		text-align: center;
		margin-top: 460rpx;
	}

	.not .img {
		width: 210rpx;
		height: 210rpx;
		background-color: #ddd;
		border-radius: 50%;
		overflow: hidden;
	}

	.not image {
		width: 210rpx;
		height: 210rpx;

	}

	.not text {
		margin-top: 30rpx;
	}

	.list .more {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 64rpx;
	}

	.list .more image {
		width: 25rpx;
		height: 21rpx;
		transition: all .3s;
	}

	.list .more image.on {
		transform: rotate(180deg);
	}

	.list .more-txt {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 64rpx;
		font-size: 26rpx;
		color: #666;
		margin-top: 15rpx;
	}
</style>
