<template>
	<view>
		<!-- 回放 -->
		<view class="live_header">
			<image @tap="goBack" class="go_back" :src="img_url+'white_arrow_l.png'"></image>
			<view class="avator" :style="'background:url('+liveDetail.live.member_avatar+');' + bgStyle"></view>
			<view class="mem_info">
				<text class="name">{{liveDetail.live.member_nickname}}</text>
				<view class="stat_num">
					<text v-if="liveDetail.live.is_own == 1" class="click_num" style="margin-right: 20rpx">{{live_like_num}}{{$L('人气')}}</text>
					<text class="click_num">{{live_click_num}}{{$L('观看')}}</text>
				</view>
			</view>
			<view v-if="liveDetail.live.is_show_follow" class="live_fllow" @tap="collect">
				<image :src="img_url+'live/fav_a.png'"></image>
				<text>{{$L('关注')}}</text>
			</view>
		</view>
		<!-- 直播 -->
		<live-pusher waiting-image="../../images/live/live_wait_img.jpg" id="sldVideo" mode="SD" beauty="9" whiteness="9"
		 class="living" :url="pushurl" @statechange="statechange" object-fit="fillCrop" autopush="false">
		</live-pusher>

		<view class="live_footer">
			<view class="goods" @tap="showGoodsFun">
				<image :src="img_url+'live/goods_icon.png'"></image>
				<text>{{liveDetail.live.goods_num * 1 > 99 ? '99+' : liveDetail.live.goods_num }}</text>
			</view>

			<input type="text" name="talk_con" v-model="input_val" class="talk_con" :placeholder="live_state?$L('和粉丝聊两句~'):$L('直播开始后可与粉丝交流~')"
			 placeholder-style="font-size:24rpx;color:#fff;font-weight:600" confirm-type="send" @confirm="publishComment"
			 maxlength="30"></input>
			<view class="share" @tap="showShare">
				<image :src="img_url+'live/share.png'"></image>
				<text>{{$L('分享')}}</text>
			</view>
			<view v-if="!live_state" class="share add_heart" @tap="startLive">
				<image :src="img_url+'live/start_live.png'"></image>
				<text>{{$L('开始直播')}}</text>
			</view>
			<view v-if="live_state" class="share add_heart" @tap="stopLiveTip">
				<image :src="img_url+'live/stop_live.png'"></image>
				<text>{{$L('结束直播')}}</text>
			</view>
		</view>

		<!-- 分享 -->
		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap">
			<view class="share-mode">
				<view class="empty_158"></view>
				<view class="share-img" @tap="prevImg">
					<image :src="shareImg" mode="widthFix"></image>
				</view>

				<view class="ul">
					<view class="item" @tap="downloadImg">
						<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
						<text>{{$L('下载海报')}}</text>
					</view>
				</view>

				<view class="close" @tap="closeShare">
					<image src="/static/images/share_close2.png" mode="widthFix"></image>
				</view>

			</view>
		</view>

		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2">
			<view class="share-mode">

				<view class="share-img"></view>

				<view class="ul">
					<button open-type="share" class="item">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<view class="item" @tap="createhb">
						<image :src="img_url+'createhb.png'" mode="widthFix"></image>
						<text>{{$L('生成海报')}}</text>
					</view>
				</view>

				<view class="close" @tap="closeShare">
					<image src="/static/images/share_close2.png" mode="widthFix"></image>
				</view>
			</view>
		</view>

		<!-- 视频绑定的商品模块 start -->
		<view class="live_bind_goods_mask" v-if="showGoods">
			<view class="live_bind_goods">
				<view class="header">
					<text>{{$L('全部商品')}}({{liveDetail.live.goods_num * 1 > 99 ? '99+' : liveDetail.live.goods_num}})</text>
					<image :src="img_url+'live/close.png'" @tap="closeGoods"></image>
				</view>
				<scroll-view class="scroll_goods" scroll-y="true" @scrolltolower="getMoreGoods">
					<view class="live_user_tab_content">
						<!-- 商品列表item -->
						<livePlayGoods :goodsData="goodsList" :addCartIcon="img_url+'live/add_cart.png'" :eyeIcon="img_url+'live/eye.png'"
						 :live_id="live_id" @click="addCart" />

						<!-- 数据加载完毕 -->
						<dataLoaded :showFlag="!hasmore&&goodsList.length>0" />

						<!-- 数据加载中 -->
						<dataLoading :showFlag="hasmore&&loading" />

					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 视频绑定的商品模块 end -->
		<!-- 弹幕 start-->
		<view class="barrage_wrap">
			<view class="notice">
				<text v-if="noticeList&&noticeList.length>0">{{noticeList[0].msg}}</text>
			</view>

			<scroll-view class="barrage" scroll-y :scroll-into-view="toBottom">
				<view class="gonggao" v-if="settingData.like_notic">
					<text class="title">{{$L('公告')}} </text>
					<text class="ba_txt">{{settingData.like_notic}}</text>
				</view>
				<view v-for="(item, index) in msgList" :key="index" :index="index" v-if="msgList.length>0">
					<view :id="'item' + index" class="barrage_item">
						<text class="name" :style="'color:' + item.color_random">{{item.author_name}}</text>
						<text class="barrage_item_con">{{item.msg}}</text>
					</view>
				</view>

			</scroll-view>
		</view>
		<!-- 弹幕 end-->
	</view>
</template>

<script>
	import {
		checkPageHasMore,
		colorArray,
		initNum
	} from "../../../utils/live";
	import request from "../../../utils/request";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import livePlayGoods from "@/addons/templates/live/livePlayGoods.vue";
	import io from '@hyoga/uni-socket.io';
	const bus = getApp().globalData.bus;
	let livePusherContext = '';

	export default {
		data() {
			return {
				pushurl: '',
				// pushurl: "rtmp://uplive.slodon.cn/slodon/61?auth_key=1585015763-0-0-73cd3859d2bb30143760051a39de06f2",
				live_id: 61,
				//当前直播id
				loading: false,
				//数据加载状态
				liveDetail: '',
				//直播详情
				settingData: '',
				//平台设置信息
				img_url: getApp().globalData.img_url,
				//图片地址
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;',
				//背景图片样式
				shareWrap: false,
				// 展示分享弹层
				shareWrap2: false,
				// 展示分享弹层
				shareImg: '',
				// 分享图片
				goodsList: [],
				//直播绑定的商品
				hasmore: true,
				//是否还有数据，用于页面展示
				showGoods: false,
				//是否显示商品弹层
				playFlag: true,
				//视频是否播放
				showPauseBtn: false,
				//是否显示暂停按钮
				showBtnIcn: '',
				//视频播放控制层按钮图片
				colorArray: colorArray,
				//颜色数组
				msgList: [],
				//弹幕内容
				noticeList: [],
				//消息通知列表
				input_val: '',
				//输入框内容
				toBottom: '',
				//弹幕滚动到指定的元素
				live_state: false,
				//直播状态 默认0：未开启,1开启直播，2:直接结束
				backGrade: 1,
				//返回页面级别
				live_like_num: 0,
				//人气数
				live_click_num: 0 //观看数
					,
				liveStateInfo: "",
				pn: 1,
				stat_end: 1, //终端，默认为1，pc端
				show_live_stop: false, //是否显示直播结束提示
				live_stop_info: {}, //显示直播结束提示信息
				pageSize:10,
			};
		},

		components: {
			livePlayGoods,
			dataLoading,
			dataLoaded
		},
		props: {},
		//继续播放按钮图片

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			options.pushurl = decodeURIComponent(options.pushurl);
			uni.setKeepScreenOn({
				keepScreenOn: true
			});
			this.setData(options);
			this.initData();
			this.getPlatform();
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.socket) {
				this.closeSocket();
			}
		},

		onShow() {
			this.getPlatform();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(options) {
			this.setData({
				shareWrap: false,
				shareWrap2: false
			});
			let {
				liveDetail,
				live_id
			} = this;
			return {
				title: liveDetail.live.live_name,
				path: '/addons/pages/livePlay/livePlay?live_id=' + live_id,
				imageUrl: liveDetail.live.live_image_url
			};
		},
		onShareTimeline: function(options) {
			this.setData({
				shareWrap: false,
				shareWrap2: false
			});
			let {
				liveDetail,
				live_id
			} = this;
			return {
				title: liveDetail.live.live_name,
				path: '/addons/pages/livePlay/livePlay?live_id=' + live_id,
				imageUrl: liveDetail.live.live_image_url
			};
		},
		methods: {
			//获取当前终端的方法
			getPlatform() {
				//判断终端
				this.stat_end = 1;
				// #ifdef H5
				this.stat_end = 2;
				// #endif
				// #ifdef MP-WEIXIN
				this.stat_end = 3;
				// #endif
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == 'android') {
					this.stat_end = 5;
				} else if (uni.getSystemInfoSync().platform == 'ios') {
					this.stat_end = 4;
				}
				// #endif
			},
			//加入购物车事件
			addCart(e) {
				let key = uni.getStorageSync('token');
				let gid = e.gid;
				let {
					live_id
				} = this;

				if (key) {
					request({
						url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						method: 'POST',
						data: {
							key: key,
							gid: gid,
							quantity: 1,
							live_id: live_id,
							stat_end: this.stat_end
						}
					}).then(res => {
						if (res.datas.status) {
							uni.showToast({
								title: this.$L('加入购物车成功'),
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: res.datas.msg,
								icon: 'none'
							});
						}
					});
				} else {
					let uuid = uni.getStorageSync('uuid');
					let url = getApp().globalData.ser_url + '/index.php?app=cache_cart&mod=cart_add';
					uni.request({
						url,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: uuid,
							gid: gid,
							quantity: 1,
							live_id: live_id,
							stat_end: this.stat_end
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								uni.showToast({
									title: this.$L('加入购物车成功'),
									duration: 500,
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									duration: 500,
									icon: 'none'
								});
							}
						}
					});
				}
			},
			statechange(e) {

			},

			//初始化数据
			initData() {
				let livePusherContext = uni.createLivePusherContext();
				livePusherContext.startPreview();
				this.getLiveInfo();
				this.getSetting();
				this.getLiveGoods();
			},

			// 获取直播详情
			getLiveInfo() {
				let {
					live_id,
					liveDetail
				} = this;
        let that = this
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=detail&live_id=' + live_id + '&key=' + uni.getStorageSync(
						'token')
				}).then(res => {
					if (res.state == 200) {
						liveDetail = res.data;

						if (liveDetail.live.status == 3) {
							//禁止播放
							uni.showModal({
								title: res.data.msg.msg,
								content: res.data.msg.remark,
								showCancel: false,
								confirmText: that.$L('返回'),
								success: res => {
									if (res.confirm) {
										uni.navigateBack({});
									}
								}
							});
						} else if (liveDetail.live.status == 4) {
							//录制中
							uni.showModal({
								title: '',
								content: that.$L('正在录制中，录制完成才可以观看哦！'),
								showCancel: false,
								confirmText:that.$L('返回') ,
								success: res => {
									if (res.confirm) {
										uni.navigateBack({});
									}
								}
							});
						}

						this.setData({
							liveDetail: liveDetail
						});

						if (this.socket) {
							this.socket.emit("update_user", {
								author_name: res.author.member_nickname,
								author_id: res.author.author_id ? res.author.author_id : 1,
								live_id: live_id ? live_id : 1
							});
						} else { // this.initSocket();
						}
					} else {
						//禁止播放
						uni.showModal({
							title: res.data.msg.msg,
							content: res.data.msg.remark,
							showCancel: false,
							confirmText: that.$L('返回'),
							success: res => {
								if (res.confirm) {
									uni.navigateBack({});
								}
							}
						});
					}
				});
			},

			// 获取平台设置信息
			getSetting() {
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getSetting'
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							settingData: res.data.setting
						});
					}
				});
			},

			//关闭分享
			closeShare() {
				this.setData({
					shareWrap: false,
					shareWrap2: false
				});
			},

			touchmoveshare() {
				return false;
			},

			initSocket() {
				if (this.socket) {
					this.closeSocket();
				}

				const {
					live_id,
					liveDetail
				} = this;
				const authorInfo = liveDetail.author;
				let userInfo = {
					live_id: live_id ? live_id : 1,
					is_own: 1
				};

				if (authorInfo.author_id) {
					userInfo.author_name = authorInfo.member_nickname;
					userInfo.author_id = authorInfo.author_id ? authorInfo.author_id : 1;
				}

				this.socket = io(getApp().globalData.socket_url, {
					path: "/socket.io",
					reconnection: true,
					jsonp: false,
					transports: ['websocket', 'polling']
				});
				this.socket.on("connect", () => {
					//给服务端发送消息
					this.socket.emit("update_user", userInfo); //获取服务端的消息

					this.socket.on("get_msg", e => {
						if (typeof e.msg === 'string') {
							this.socketHandle('wec', e);
						} else {
							this.socketHandle('msg', e.msg);
						}
					}); //获取服务端新人信息

					this.socket.on("get_new_user", e => {
						this.socketHandle2('new', e);
					});
					this.socket.on("disconnect", function() {});
				}); //获取关注的返回信息

				this.socket.on("get_follow_msg", e => {
					this.socketHandle2('follow', e);
				}); //获取直播点击数

				this.socket.on("get_click_num", e => {
					this.clickNumHandle(e);
				}); //获取直播人气数

				this.socket.on("get_like_num", e => {
					this.likeNumHandle(e);
				}); // 直播结束

				this.socket.on('stop_live', e => {
					this.handleStopLive(e);
				});
			},

			//关闭socket
			closeSocket() {
				if (this.socket) {
					this.socket.close();
				}
			},

			socketHandle(type, msg) {
				let {
					msgList
				} = this;

				if (msg.type) {
					return;
				}

				msg.type = type;
				msg.color_random = colorArray[Math.floor(Math.random() * 8)];
				msgList.push(msg);
				this.setData({
					msgList: msgList,
					toBottom: msgList && msgList.length > 0 ? 'item' + (msgList.length - 1) : 0
				});
			},

			//直播结束
			handleStopLive(e) {
				let {
					backGrade,
					liveDetail
				} = this;
				this.setData({
					liveStateInfo: e.msg
				}); //显示modal

				let true_click_data = e.msg.click_num * 1 - liveDetail.live.virtual_click_num * 1 > 0 ? e.msg.click_num * 1 -
					liveDetail.live.virtual_click_num * 1 : 0;
				let true_like_data = e.msg.like_num * 1 - liveDetail.live.virtual_like_num * 1 > 0 ? e.msg.like_num * 1 -
					liveDetail.live.virtual_like_num * 1 : 0;
				uni.showModal({
					title: e.msg.remark ? e.msg.remark : this.$L('直播已结束'),
					content: this.$L('直播时长：') + e.msg.live_time + '\r\n获赞：' + initNum(true_like_data) + this.$L('  观看：') + initNum(true_click_data),
					showCancel: false,
					confirmText: this.$L('返回'),

					success(res) {
						if (res.confirm) {
							const pages = getCurrentPages(); //获取页面栈

							const beforePage = pages[pages.length - (backGrade * 1 + 1)]; //前一个页面

							uni.navigateBack({
								delta: backGrade * 1,
								success: function() {
									if (beforePage.route.indexOf('liveUserCenter') != -1 && beforePage.curTab == 'live') {
										beforePage.$vm.changeTab('goods', true);
										beforePage.$vm.changeTab('live', true);
									}
								}
							});
						}
					}

				});

			},
			//直播结束点击确定
			stop_confirm() {
				const pages = getCurrentPages(); //获取页面栈

				const beforePage = pages[pages.length - (backGrade * 1 + 1)]; //前一个页面

				uni.navigateBack({
					delta: backGrade * 1,
					success: function() {
						if (beforePage.route.indexOf('liveUserCenter') != -1 && beforePage.curTab == 'live') {
							beforePage.$vm.changeTab('goods', true);
							beforePage.$vm.changeTab('live', true);
						}
					}
				});
			},
			//获取服务端新人信息
			socketHandle2(type, msg) {
				let {
					noticeList
				} = this;

				if (msg.type) {
					return;
				}

				if (noticeList.filter(el => el.type === 'follow').length > 0 && type === 'follow') {
					return;
				}

				msg.type = type;
				msg.timer = setTimeout(() => {
					this.noticeRemoveItem(type);
				}, 2000);

				if (type === 'follow') {
					noticeList.push(msg);
				} else {
					let index = noticeList.findIndex(el => el.type === 'new');

					if (index > -1) {
						noticeList[index] = msg;
					} else {
						noticeList.push(msg);
					}
				}

				this.setData({
					noticeList: noticeList
				});
			},

			noticeRemoveItem(type) {
				let {
					noticeList
				} = this;
				let index = noticeList.findIndex(el => el.type === type);

				if (index > -1) {
					clearTimeout(noticeList[index].timer);
					noticeList.splice(index, 1);
				}

				this.setData({
					noticeList: noticeList
				});
			},

			// 点击量处理
			clickNumHandle(e) {
				const {
					liveDetail
				} = this;
				liveDetail.live.click_num = e.click_num;
				let true_data = e.click_num * 1 - liveDetail.live.virtual_click_num * 1 > 0 ? e.click_num * 1 - liveDetail.live.virtual_click_num *
					1 : 0;
				this.setData({
					liveDetail: liveDetail,
					live_click_num: initNum(true_data)
				});
			},

			// 人气
			likeNumHandle(e) {
				const {
					liveDetail
				} = this;
				liveDetail.live.like_num = e.like_num;
				let true_data = e.like_num * 1 - liveDetail.live.virtual_like_num * 1 > 0 ? e.like_num * 1 - liveDetail.live.virtual_like_num *
					1 : 0;
				this.setData({
					liveDetail: liveDetail,
					live_like_num: initNum(true_data)
				});
			},

			// 发送消息
			publishComment(e) {
				const {
					live_id,
					liveDetail,
					live_state
				} = this;

				if (!live_state) {
					//直播开始后才可以聊天
					return false;
				}

				if (uni.getStorageSync('token')) {
					let content = e.detail.value; //没有内容的话直接结束

					if (!content.trim()) {
						return false;
					}

					let msg = {
						author_id: liveDetail.author.author_id,
						author_name: liveDetail.author.member_nickname,
						live_id: live_id,
						msg: content
					};
					this.socket.emit("send_msg", msg); //清空输入框的内容
					this.setData({
						input_val: ''
					});
					var that = this
					setTimeout(() => {
						that.input_val = ''
					})
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

			//增加人气事件
			add_heart() {
				let {
					live_id,
					liveDetail
				} = this;

				if (uni.getStorageSync('token')) {
					this.socket.emit("update_like_num", {
						author_id: liveDetail.author.author_id,
						live_id: live_id
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

			// 返回上级页面提示
			goBack() {
				let {
					live_state
				} = this;

				if (live_state) {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: `${this.$L('返回上级页面将关闭直该场直播，确认返回吗？')}`,
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: res => {
							if (res.confirm) {
								this.stopLive();
							}
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: `${this.$L('直播还未开始，确认返回上级页面吗？')}`,
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/addons/pages/liveUserCenter/liveUserCenter?curTab=live'
								});
							}
						}
					});
				}
			},

			//关注、取消关注事件
			collect(e) {
				let key = uni.getStorageSync('token');
				let {
					liveDetail
				} = this;

				if (key) {
					request({
						url: getApp().globalData.svideo_url + '/index.php?app=follow&mod=followAuthor',
						method: 'POST',
						data: {
							to_auhtor_id: liveDetail.live.author_id,
							key: key
						}
					}).then(res => {
						if (res.state == 200) {
							liveDetail.live.is_show_follow = liveDetail.live.is_show_follow == 1 ? 0 : 1;
							liveDetail.live.fans_num = res.data.fans_num;
							this.setData({
								liveDetail: liveDetail
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
			},

			//分享点击事件
			showShare() {
				if (!this.live_state) {
					uni.showToast({
						title: this.$L('直播开始后才可以分享哦！'),
						icon: 'none'
					});
				} else {
					this.setData({
						shareWrap2: true
					});
				}
			},

			//生成海报事件
			createhb() {
				let {
					live_id,
					liveDetail,
					shareImg
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=shareLike',
					method: 'POST',
					data: {
						live_id: live_id,
						click_num: liveDetail.live.click_num,
						client: 'wx_xcx'
					}
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							shareImg: res.data.share_img,
							shareWrap: true,
							shareWrap2: false
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},

			//下载海报
			downloadImg() {
				let {
					shareImg
				} = this;

				let _this = this;

				uni.downloadFile({
					url: shareImg,
					success: res_info => {
						if (res_info.statusCode == 200) {
							uni.getSetting({
								success(res_down) {
									if (!res_down.authSetting['scope.writePhotosAlbum']) {
										uni.showModal({
											title: _this.$L('提示'),
											content: _this.$L('您好,需要开启相册权限'),
											confirmText:this.$L('确定'),
											showCancel: false,

											success(res) {
												if (res.confirm) {
													uni.authorize({
														scope: 'scope.writePhotosAlbum',

														success() {
															// 用户已经同意,后续调用时不会弹窗询问
															_this.saveHb(res_info.tempFilePath);
														},

														fail() {
															//拒绝授权
															uni.showToast({
																title: _this.$L('抱歉，没有授权无法下载海报'),
																icon: 'none'
															});
														}

													});
												}
											}

										});
									} else {
										_this.saveHb(res_info.tempFilePath);
									}
								}

							});
						} else {
							uni.showToast({
								title: _this.$L('下载失败'),
								icon: 'none'
							});
						}
					}
				});
			},

			/**
			 * 保存图片
			 */
			saveHb: function(img) {
				let _this = this;

				uni.saveImageToPhotosAlbum({
					filePath: img,
					success: function(data) {
						_this.setData({
							shareWrap: false,
							shareWrap2: false
						});

						uni.showToast({
							title: _this.$L('已保存到本地'),
							icon: 'success',
							duration: 2000
						});
					},
					complete: function(res) {}
				});
			},

			//获取直播商品
			getLiveGoods() {
				this.setData({
					loading: true
				});
				let {
					goodsList,
					hasmore,
					live_id
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=getLiveGoods',
					data: {
						pageSize: this.pageSize,
						current: this.pn,
						live_id: live_id,
						key: uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.state == 200) {
						let list = res.data.list;
						if (this.pn == 1) {
							goodsList = list;
						} else {
							goodsList = goodsList.concat(list);
						}
						if (checkPageHasMore(res.data.pagination)) {
							this.pn++;
						} else {
							this.hasmore = false;
							hasmore = false;
						}
					}

					this.setData({
						loading: false,
						hasmore: hasmore,
						goodsList: goodsList
					});
				});
			},

			showGoodsFun() {
				let {
					showGoods,
					liveDetail
				} = this;

				if (liveDetail.live.goods_num * 1 > 0) {
					this.setData({
						showGoods: true
					});
				}
			},

			//关闭商品弹层
			closeGoods() {
				let {
					showGoods
				} = this;
				this.setData({
					showGoods: false
				});
			},

			//绑定的商品分页事件
			getMoreGoods() {
				if (this.hasmore) {
					this.getLiveGoods();
				}
			},

			//开始直播
			startLive() {
				this.operateLive('start');
			},

			stopLiveTip() {
				uni.showModal({
					title: this.$L('温馨提示!'),
					content: `${this.$L('确定结束该场直播吗？')}`,
					cancelText:this.$L('取消'),
					confirmText:this.$L('确定'),
					success: res => {
						if (res.confirm) {
							this.stopLive();
						}
					}
				});
			},

			//结束直播
			stopLive() {
				this.operateLive('end');
			},

			operateLive(type) {
				let _this = this;

				if (type == 'start') {
					livePusherContext = uni.createLivePusherContext();
					livePusherContext.start({
						success: function(data) {
							_this.live_state = true
							_this.initSocket();
						},
						fail: function(data) {
							uni.showToast({
								title: _this.$L('推流失败，请重新点击'),
								icon: 'none'
							});
						},
						complete: function(res) {}
					}); //开始推流
					_this.live_state = true
				} else {
					livePusherContext.stop({
						success: function(data) {},
						fail: function(data) {},
						complete: function(res) {}
					}); //结束推流
				}
			}

		}
	};
</script>
<style>
	page {
		background: rgba(0, 0, 0, 0.3);
	}

	.live_back,
	.living {
		width: 750rpx;
		height: 100vh;
	}

	.live_header {
		position: absolute;
		top: 80rpx;
		left: 20rpx;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		height: 80rpx;
	}

	.live_header text {
		color: #fff;
	}

	.live_header .go_back {
		width: 45rpx;
		height: 47rpx;
	}

	.live_header .avator {
		width: 78rpx;
		height: 78rpx;
		border-radius: 50%;
		border: 2px solid #fff;
		margin-left: 8rpx;
	}

	.live_header .mem_info {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}

	.live_header .mem_info .name {
		max-width: 150rpx;
		color: #fff;
		font-size: 28rpx;
		line-height: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
		margin: 5rpx 0 6rpx;
	}

	.live_header .mem_info .stat_num {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.live_header .mem_info .stat_num text {
		color: #fff;
		font-size: 22rpx;
		line-height: 36rpx;
		white-space: nowrap;
		font-weight: 600;
	}

	.live_header .live_fllow {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 120rpx;
		height: 50rpx;
		background: #fc1c1c;
		border-radius: 25rpx;
		margin-left: 25rpx;
	}

	.live_header .live_fllow image {
		width: 46rpx;
		height: 46rpx;
	}

	.live_header .live_fllow text {
		color: #fff;
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.live_footer {
		position: fixed;
		z-index: 99;
		left: 40rpx;
		bottom: 30rpx;
		width: 710rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		overflow-x: hidden;
		padding-top: 30rpx;
	}

	.live_footer .goods {
		width: 85rpx;
		height: 91rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.live_footer .goods image {
		width: 100%;
		height: 100%;
	}

	.live_footer .goods text {
		position: absolute;
		bottom: 12rpx;
		line-height: 23rpx;
		color: #fff;
		font-size: 22rpx;
	}

	.live_footer .talk_con {
		height: 65rpx;
		width: 325rpx;
		margin-left: 30rpx;
		border-radius: 30rpx;
		background: rgba(0, 0, 0, 0.3);
		padding: 0 20rpx;
		color: #fff;
		font-weight: 600;
		font-size: 26rpx;
	}

	.live_footer .share {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 77rpx;
		margin-left: 21rpx;
	}

	.live_footer .share image {
		width: 65rpx;
		height: 65rpx;
		font-weight: 600;
	}

	.live_footer .share text {
		color: #fff;
		font-size: 22rpx;
		margin-top: 10rpx;
	}

	.select-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.45);
		z-index: 9999;
	}

	.select-wrap .share-mode {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.select-wrap .share-mode .share-img {
		width: 72vw;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.select-wrap .share-mode .share-img image {
		width: 100%;
		height: 0;
		border-radius: 20rpx;
	}

	.select-wrap .share-mode .ul {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-evenly;
	}

	.share-mode .item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		cursor: pointer;
		border: none;
		margin: 0;
		padding: 0;
		line-height: 1;
		background-color: transparent;
	}

	.share-mode .item::after {
		border: none;
	}

	.share-mode .item image {
		width: 106rpx;
		height: 0;
	}

	.share-mode .item text {
		color: #fff;
		font-size: 24rpx;
		margin-top: 30rpx;
	}

	.select-wrap .close {
		width: 750rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-wrap .close image {
		width: 30rpx;
		height: 0;
		padding: 30rpx;
	}

	.share-mode .share-img {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 视频绑定的商品模块 start */

	.live_bind_goods_mask {
		width: 750rpx;
		height: 100vh;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.45);
	}

	.live_bind_goods {
		width: 750rpx;
		height: 850rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 4;
		background: #fff;
		border-radius: 15rpx 15rpx 0 0;
		background: #f8f8f8;
	}

	.live_bind_goods .header {
		width: 710rpx;
		height: 100rpx;
		padding: 0 20rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-radius: 15rpx 15rpx 0 0;
	}

	.live_bind_goods .header text {
		color: #2d2d2d;
		font-size: 32rpx;
	}

	.live_bind_goods .header image {
		width: 47rpx;
		height: 47rpx;
	}

	.scroll_goods {
		height: 750rpx;
	}

	/* 视频绑定的商品模块 end */

	.empty_158 {
		width: 750rpx;
		height: 158rpx;
	}

	/***** 弹幕 start *****/

	.barrage_wrap {
		position: absolute;
		bottom: 200rpx;
		left: 30rpx;
		width: 500rpx;
		background-color: transparent;
		z-index: 99;
		height: 500rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
	}

	.notice {
		height: 50rpx;
		max-width: 500rpx;
		display: inline-block;
		border-radius: 10rpx;
		line-height: 50rpx;
		margin-bottom: 10rpx;
	}

	.notice text {
		color: #fff;
		font-size: 24rpx;
		height: 50rpx;
		max-width: 500rpx;
		display: inline-block;
		background-color: #fc1c1c;
		border-radius: 10rpx;
		line-height: 50rpx;
		margin-bottom: 10rpx;
		padding: 0 15rpx;
		font-weight: 600;
	}

	.barrage {
		min-height: 100rpx;
		max-height: 450rpx;
	}

	.gonggao {
		background-color: rgba(0, 0, 0, 0.3);
		white-space: normal;
		padding: 12rpx 16rpx;
		border-radius: 10rpx;
		word-break: break-all;
		font-weight: 600;
	}

	.gonggao .title {
		color: #fc1c1c;
		font-size: 26rpx;
		line-height: 36rpx;
	}

	.gonggao .ba_txt {
		color: #fff;
		font-size: 26rpx;
		line-height: 36rpx;
	}

	.barrage_item {
		background-color: rgba(0, 0, 0, 0.3);
		max-width: 500rpx;
		border-radius: 23rpx;
		padding: 0rpx 15rpx 10rpx 15rpx;
		margin-top: 10rpx;
		white-space: normal;
		word-break: break-all;
		display: inline-block;
		font-weight: 600;
	}

	.barrage_item .name {
		font-size: 25rpx;
		line-height: 36rpx;
		margin-right: 15rpx;
	}

	.barrage_item .barrage_item_con {
		color: #fff;
		font-size: 25rpx;
	}

	/***** 弹幕 end *****/

	.canvas {
		background: transparent;
		width: 180rpx;
		height: 400rpx;
		position: fixed;
		right: -40rpx;
		bottom: 130rpx;
	}

	.live_footer .add_heart {
		width: 90rpx;
	}

	.live_footer .add_heart text {
		color: #F34A05;
	}
</style>
