<script>
	/** copyright *** slodon *** version-v2.1.3 *** date-2021-12-11 ***PHP版本v8.0.1**/ 
	let eventBus = require("./utils/eventBus.js");
	import {getCurLanguage} from './utils/common.js'
	export default {
		onLaunch: function(options) {
			//#ifdef APP-PLUS
			uni.removeStorage({
				key: 'launchFlag',
				success: function(res) {}
			});
			//#endif
			if (options && options.channel_id) {
				uni.setStorageSync('channel', options.channel_id);
			}
			let isnew = uni.getStorageSync('isnew');

			if (!isnew || isnew !== 0) {
				uni.setStorage({
					key: 'isnew',
					data: 1
				});
			}

			//#ifdef APP-PLUS

			this.$checkUpdate();

			let clientid;
			let timer = setInterval(function() {
				if (clientid != null && clientid != "null" && clientid) {
					clearInterval(timer);
					return;
				}
				// clientid = plus.push.getClientInfo().clientid;
				clientid = '';
				uni.setStorageSync('clientid', clientid);
			}, 1000);
			if (uni.getSystemInfoSync().platform == "ios") {
				plus.runtime.setBadgeNumber(0);
				//导入个推原生类
				var GeTuiSdk = plus.ios.importClass("GeTuiSdk");
				GeTuiSdk.setBadge(0);
			}
			// 锁定屏幕方向
			plus.screen.lockOrientation("portrait-primary"); //锁定
			// plus.push.addEventListener("click", function(msg) {
			// });
			// //透传的情况下才会走这个，这个获取到额外的参数
			// plus.push.addEventListener("receive", function(msg) {
			// 	    var info=JSON.parse(msg.content)
			// 		if(info.type=='predeposit_change'){//余额变动
			// 			uni.navigateTo({
			// 				url: '/pages/Balance/Balance?type=banance'
			// 			}) 
			// 		}else if(info.type=='cash_apply_notice'){//提现申请
			// 			uni.navigateTo({
			// 				url: '/pages/recharge/tixian'
			// 			})
			// 		}else if(info.type=='order_deliver_success'){//商品出库提醒
			// 			uni.navigateTo({
			// 				url: '/pages/order/order?s=1024'
			// 			})
			// 		}else if(info.type=='order_payment_success'){//付款成功提醒
			// 			uni.navigateTo({
			// 				url: '/pages/order/order?s=256'
			// 			})
			// 		}else if(info.type=='red_notice'){//优惠卷到期提醒
			// 			uni.navigateTo({
			// 				url: '/pages/red/red'
			// 			})
			// 		}else if(info.type=='refund_return_notice'){//退款退货提醒
			// 			uni.navigateTo({
			// 				url: '/pages/refund/list'
			// 			})
			// 		}else if(info.type=='seckill_prepare_start'){//秒杀开始提醒
			// 			uni.navigateTo({
			// 				url: '/pages/goods_detail/goods_detail?gid='+info.gid
			// 			})
			// 		}
       
			// });
			//#endif

			uni.getSystemInfo({
				success: res => {
					this.globalData.systemInfo = res;
					this.globalData.bottomSateArea = 0; //手机底部安全区域高度
					this.globalData.model = res.model;
					this.globalData.titleBarHeight = 44; //原生的标题高度
					let iphoneXArr = ["iPhone X", "iPhone 11", "iPhone 11 Pro Max", "iPhone XR"]; //iphone手机底部一条黑线
					// #ifndef H5
					if (iphoneXArr.indexOf(res.model) != -1) {
						this.globalData.bottomSateArea = "30rpx";
					}
					if (res.model.indexOf('iPhone XR') != -1) {
						this.globalData.bottomSateArea = "30rpx";
					}
					// #endif
					this.globalData.statusBarHeight = res.statusBarHeight;

				}
			}); // 联到家定位缓存

			let ldj_location = uni.getStorageSync('ldj_location');
			let ldj_addr = uni.getStorageSync('ldj_addr');

			if (ldj_location || ldj_addr) {
				uni.removeStorage({
					key: 'ldj_location',
					success: function(res) {}
				});
				uni.removeStorage({
					key: 'ldj_addr',
					success: function(res) {}
				});
			}
			// 网站是否关闭
			uni.request({
				url: this.globalData.ser_url + '/index.php?app=index&mod=getSetting',
				success: res => {
					if (res.data.data.site_status == '0') {
						uni.reLaunch({
							url: '/pages/index/index?site=close&info=' + encodeURIComponent(res.data.data.closed_reason)
						});
					}
				}
			});
		},
    // onLoad() {
    // 	// 当前系统默认语言
    // 	let system = uni.getSystemInfoSync()
    // 	if(system.language == 'zh-CN'){
    // 		getApp().globalData.curLang = 'zh';
    // 	}else{
    // 		getApp().globalData.curLang = 'en';
    // 	}
    // 	uni.setStorageSync('curLang',getApp().globalData.curLang)
    // },
		onShow() {
			this.timer = setInterval(function() {
				let data = new Date();
				let isToday = (new Date().toDateString() === data.toDateString()) && (Date.parse(data) < Date.parse(new Date(new Date()
					.setHours(23, 59, 59, 59)))); //判断当前时间是否为今天并且不为第二天
				if (!isToday) {
					uni.removeSavedFile({
						key: 'cookie'
					})
				}
			}, 1000);
		},

		onHide() {
			uni.removeStorage({
				key: 'fromurl',
				success: function(res) {}
			});
			clearInterval(this.timer);
		},

		globalData: {
			goLogin() {
				uni.showModal({
					title: getCurLanguage('提示'),
					content: getCurLanguage('请登录'),
					cancelText:getCurLanguage('取消'),
					confirmText:getCurLanguage('确定'),
					success: res => {
						if (res.confirm) {
							const page = getCurrentPages();
							let url = page[page.length - 1].route;
							const options = page[page.length - 1].options;

							for (let i in options) {
								if (url.indexOf('?') > -1) {
									url += `&${i}=${options[i]}`;
								} else {
									url += `?${i}=${options[i]}`;
								}
							}

							url = '/' + url;
							uni.setStorageSync('fromurl', url);
							uni.switchTab({
								url: '/pages/user/user'
							});
						}
					}
				});
			},

			//未登录，生成唯一用户标识UUID
			initUUID(client) {
				if (!client) {
					return '';
				}

				var reg = RegExp(client);

				if (!reg.test('123') || client.length != 1) {
					return '';
				}

				var d = new Date().getTime();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
				});
				return client + '_' + uuid;
			},

			// 底部按钮兼容 iPhone X 解决底部横杠遮挡问题
			isIphoneX() {
				let info = uni.getSystemInfoSync();

				if (/iPhone X/i.test(info.model)) {
					return true;
				} else {
					return false;
				}
			},

			userInfo: null,
			//svideo_url
			svideo_url: 'https://newbbcvideo.slodon.cn/mobile', //直播、短视频接口地址
			//svideo_url
			//socket_url
			socket_url: 'wss://newbbcliveim.slodon.cn/', //直播即时通讯地址
			//socket_url
			ser_url: 'https://www.movisunshop.com/cmobile', //接口请求地址
			h5_url: 'https://www.movisunshop.com/cwap/',
			view_url: 'https://www.movisunshop.com/appview',
			img_url: 'https://www.movisunshop.com/static/wx_xcx/', //静态资源地址——线上开发
      
			// ser_url: 'https://dwqshop.slodon.cn/cmobile', //接口请求地址
			// h5_url: 'https://dwqshop.slodon.cn/cwap/',
			// view_url: 'https://dwqshop.slodon.cn/appview',
			// img_url: 'https://dwqshop.slodon.cn/static/wx_xcx/', //静态资源地址——线上开发
			key: '3fb83bfc6bc51b1781ac8f9e98917566', // 高德 小程序key
			amap_h5_key:'c6979f9121ed9d1d6cd46f5fc2ab30e3',// 高德 jsapi key
			h5_appid: 'wxaf4dfd46eb6776b0', //微商城appid
			// 富文本解析插件
			statusBarHeight: 0,
			regeneratorRuntime: require("./libs/regenerator-runtime/runtime-module.js"),
			// 支持 async 运行
			bus: eventBus.eventBus,
			isFirst: true,
      curLang: uni.getStorageSync('curLang')||'en',
		},
		methods: {}
	};
</script>
<style>
	/*
	* 全局公共样式
	* */
	@import './utils/styles/base.css';
	/**app.wxss**/
	@import "./utils/styles/aliIconfont.css";

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 200rpx 0;
		box-sizing: border-box;
	}

	div {
		width: auto;
		display: block;
	}

	/*页面底部样式  */

	.bottom_nav {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		position: fixed;
		z-index: 2;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #fff;
		align-items: center;
		box-shadow: 0 0 10px 0 rgba(155, 143, 143, 0.6);
	}

	.bottom_nav view {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bottom_nav view image {
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
	}

	.bottom_nav view label {
		font-size: 28rpx;
		color: #acacac;
	}

	.bottom_nav view label.sel {
		color: #121212 !important;
	}

	/* 订单活动类型 */

	.order_promotion_type {
		float: left;
		line-height: 1rem;
	}

	.order_promotion_type span {
		color: #fff !important;
		background-color: rgba(236, 55, 55, 1);
		font-size: 14px;
		margin: 0 0.1rem 0 0 !important;
		padding: 0 0.25rem;
		border-radius: 2px;
	}

	/* 积分商城底部样式 */

	#footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 98rpx;
		background-color: #fff;
		overflow: hidden;
		box-shadow: 0 0 6rpx #ccc;
		z-index: 99;
	}

	#footer .footer_item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 30rpx;
	}

	#footer image {
		max-width: 126rpx;
		height: 40rpx;
	}

	#footer text {
		font-size: 24rpx;
		color: #5b5b5b;
		margin-top: 10rpx;
	}

	#footer text.on {
		color: #ee2327;
	}

	.hide {
		display: none;
	}

	/* 没有数据 */

	.nothasData {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-size: 32rpx;
		color: #666;
		padding-top: 10vh;
		/* transform: translateY(-100%); */
	}

	.nothasData .img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #ddd;
		margin-top: 180rpx;
	}

	.nothasData .img image {
		width: 80rpx;
		height: 80rpx;
		margin-top: 30rpx;
	}

	.nothasData text {
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #000;
	}

	.clearfix::before,
	.clearfix::after {
		content: ".";
		display: block;
		height: 0;
		line-height: 0;
		visibility: hidden;
		clear: both;
	}

	.border-bottom-1px,
	.border-top-1px {
		position: relative;
	}

	.border-bottom-1px::after,
	.border-top-1px::before {
		position: absolute;
		content: '';
		width: 100%;
		height: 1px;
		left: 0;
		right: 0;
		background-color: #e3e5e9;
		transform: scaleY(0.5);
	}

	.border-bottom-1px::after {
		bottom: 0;
	}

	.border-top-1px::before {
		top: 0;
	}


	/* 分页loading */
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		font-size: 24rpx;
		color: #999;
	}

	.spinner {
		display: inline-block;
		vertical-align: middle;
		margin-right: 20rpx;
		font-size: 26rpx;
		width: 26rpx;
		height: 26rpx;
		text-align: left;
		border-radius: 50%;
		box-shadow: inset 0 0 0 3rpx rgba(58, 168, 237, .3);
	}

	.spinner text {
		position: absolute;
		clip: rect(0, 26rpx, 26rpx, 13rpx);
		width: 26rpx;
		height: 26rpx;
		animation: spinner-circle-clipper 1s ease-in-out infinite;
		-webkit-animation: spinner-circle-clipper 1s ease-in-out infinite;
	}

	@keyframes spinner-circle-clipper {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(180deg);
		}
	}

	@-webkit-keyframes spinner-circle-clipper {
		0% {
			-webkit-transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(180deg);
		}
	}

	.spinner text:after {
		position: absolute;
		clip: rect(0, 26rpx, 26rpx, 13rpx);
		width: 26rpx;
		height: 26rpx;
		content: '';
		animation: spinner-circle 1s ease-in-out infinite;
		-webkit-animation: spinner-circle 1s ease-in-out infinite;
		border-radius: 50%;
		box-shadow: inset 0 0 0 3rpx #3aa8ed;
	}

	@keyframes spinner-circle {
		0% {
			transform: rotate(-180deg);
		}

		100% {
			transform: rotate(180deg);
		}
	}

	@-webkit-keyframes spinner-circle {
		0% {
			-webkit-transform: rotate(-180deg);
		}

		100% {
			-webkit-transform: rotate(180deg);
		}
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		display: flex;
		justify-content: center;
	}

	uni-tabbar .uni-tabbar {
		-webkit-box-shadow: 0 -2px 7px 0 hsla(0, 0%, 89.8%, .5);
		box-shadow: 0 -2px 7px 0 hsla(0, 0%, 89.8%, .5);
		width: 750rpx !important;
		left: auto !important;
		right: auto !important;
	}

	uni-tabbar {
		right: 0;
		display: flex;
		justify-content: center;
	}

	uni-page-head .uni-page-head {
		width: 750rpx !important;
		left: auto !important;
		right: auto !important;
	}

	uni-page-head {
		display: flex !important;
		justify-content: center;
	}

	body {
		font-family: "Urbanist", "sans-serif";
	}

	* {
		-webkit-font-smoothing: subpixel-antialiased
	}

	.uni-system-choose-location {
		width: 375px;
		margin: 0 auto;
		right: 0;
	}

	.uni-mask {
		width: 750rpx;
		margin: 0 auto;
	}

	/* 微信浏览器分享提示 start */
	.wx_brower_share_mask {
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.45);
		position: fixed;
		z-index: 99999;
		top: 0;
	}

	.wx_brower_share_top_wrap {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		margin-top: 150rpx;
	}

	.wx_brower_share_top_wrap .wx_brower_share_img {
		width: 450rpx;
		height: 150rpx;
		margin-right: 80rpx;
	}

	.share_h5 {
		width: 100% !important;
		height: 100% !important
	}

	.share_h5_operate_img {
		width: 440rpx !important;
		height: 120rpx !important;
	}

	.share_h5_close_img {
		width: 50rpx !important;
		height: 50rpx !important;
	}

	.share_h5_img_bottom {
		width: 50rpx !important;
		height: 200rpx !important;
	}

	/* 微信浏览器分享提示 end */
</style>
