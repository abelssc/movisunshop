<template>
	<view>
	<!-- #ifdef H5 -->
	<view class="video-wrap" ref="videoWrapHls" ></view>
	<!-- #endif -->
	<view v-if="isShow && liveDetail" class="live_play">
		<!-- #ifdef H5 -->
		<!-- 回放 -->
		<view class="live_header">
			<image @tap="goBack" class="go_back" :src="img_url+'white_arrow_l.png'"></image>
			<view class="avator" :data-authorId="liveDetail.live.author_id" @tap="goLiveUserCenter" :style="'background:url('+liveDetail.live.member_avatar+');' + bgStyle"></view>
			<view class="mem_info" :data-authorId="liveDetail.live.author_id" @tap="goLiveUserCenter">
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
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<block v-if="liveDetail.live.status == 2">
			<video id="sldVideo" @tap="videoPlayControl" class="live_back" :src="liveDetail.live.play_back_url" autoplay loop
			 controls="false" show-fullscreen-btn="false" show-progress="" object-fit="cover" show-center-play-btn="false"
			 enable-play-gesture :initial_time="initial_time">
			</video>
		</block>
        <!-- #endif -->
		
		<!-- 直播 -->
		<block v-if="liveDetail.live.status == 1">
			<!-- #ifdef MP-WEIXIN -->
			<live-player id="sldVideo" class="living" :src="liveDetail.live.rtmpurl" object-fit="fillCrop" autoplay>
			</live-player>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<video id="sldVideo" @tap="videoPlayControl" class="live_back" :src="liveDetail.live.rtmpurl" autoplay loop
			 controls="false" show-fullscreen-btn="false" show-progress="" object-fit="cover" show-center-play-btn="false"
			 enable-play-gesture :initial_time="initial_time">
			</video>
			<!-- #endif -->
		</block>
		
	
		<view class="live_footer">
			<view class="goods" @tap="showGoodsFun">
				<image :src="img_url+'live/goods_icon.png'"></image>
				<text>{{liveDetail.live.goods_num * 1 > 99 ? '99+' : liveDetail.live.goods_num }}</text>
			</view>

			<input type="text" name="talk_con" v-model="input_val" class="talk_con" :placeholder="$L('说点什么吧~')" placeholder-style="font-size:24rpx;color:#fff;font-weight:600"
			 confirm-type="send" @confirm="publishComment" maxlength="30"></input>
			<view class="share" @tap="showShare">
				<image :src="img_url+'live/share.png'"></image>
				<text>{{$L('分享')}}</text>
			</view>
			<view class="share add_heart" @tap="add_heart">
				<image :src="img_url+'live/add_heart.png'"></image>
				<text>{{live_like_num}}</text>
			</view>
		</view>

		<!-- 人气飘心效果 -->
		<canvas canvas-id="heart_canvas" class="canvas"></canvas>

		<!-- 分享 -->
		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap">
			<view class="share-mode">
				<view class="empty_158"></view>
				<view class="share-img" @tap="prevImg">
					<image :src="shareImg" mode="widthFix"></image>
				</view>

				<!-- #ifdef  MP-WEIXIN -->
				<view class="ul">
					<button class="item" @tap="downloadImg">
						<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
						<text>{{$L('下载海报')}}</text>
					</button>

				</view>
				<!-- #endif -->

				<!-- #ifdef  APP-PLUS -->
				<view class="ul">
					<view class="item" @tap="downloadImg">
						<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
						<text>{{$L('保存海报')}}</text>
					</view>
					<view class="item" @tap="sldShare(2,'WXSceneSession')">
						<image :src="img_url + 'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</view>
					<view class="item" @tap="sldShare(2,'WXSenceTimeline')">
						<image :src="img_url + 'pyq_share.png'" mode="widthFix"></image>
						<text>{{$L('微信朋友圈')}}</text>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="ul">
					<view class="item" @tap="downloadImg">
						<view class="share_h5_operate_img">
							<image class="share_h5" :src="img_url + 'hb_save_tip.png'" mode="scaleToFill"></image>
						</view>
						<view class="share_h5_close_img" @tap="closeShare">
							<image class="share_h5" :src="img_url + 'share_close.png'" mode="scaleToFill"></image>
						</view>
						<view class="share_h5_img_bottom">
						</view>

					</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view class="close" @tap="closeShare">
					<image mode="aspectFit" src="../../../static/images/share_close2.png"></image>
				</view>
				<!-- #endif -->
			</view>
		</view>

		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2">
			<view class="share-mode">

				<view class="share-img"></view>

				<view class="ul">
					<!-- #ifdef  APP-PLUS -->
					<button @tap.stop="sldShare(0,'WXSceneSession')" class="item">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<button @tap.stop="sldShare(0,'WXSenceTimeline')" class="item">
						<image :src="img_url+'pyq_share.png'" mode="widthFix"></image>
						<text>{{$L('微信朋友圈')}}</text>
					</button>
					<!-- #endif -->
					<!-- #ifdef  MP-WEIXIN -->
					<button open-type="share" class="item">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<!-- #endif -->
					<!-- #ifdef  H5 -->
					<button @tap.stop="sldShareBrower" class="item" v-if="isWeiXinBrower">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<!-- #endif -->
					<view class="item" @tap="createhb">
						<image :src="img_url+'createhb.png'" mode="widthFix"></image>
						<text>{{$L('生成海报')}}</text>
					</view>
				</view>

				<view class="close" @tap="closeShare">
					<image src="../../../static/images/share_close2.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
			<view class="wx_brower_share_top_wrap">
				<image :src="img_url+'wx_share_tip.png'" mode="widthFix" @tap="closeShare" class="wx_brower_share_img"></image>
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
						<livePlayGoods :goodsData="goodsList" :memberInfo='liveDetail.live' :addCartIcon="img_url+'live/add_cart.png'" :eyeIcon="img_url+'live/eye.png'"
						 :live_id="live_id" @click="addCart" />

						<!-- 数据加载完毕 -->
						<dataLoaded :showFlag="!hasmore&&goodsList.length>0" />

						<!-- 数据加载中 -->
						<!-- <dataLoading :showFlag="hasmore&&loading" /> -->

					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 视频绑定的商品模块 end -->

		<!-- 回放视频暂停/播放的弹层展示 -->
		<view class="video_control" v-if="playFlag&&showPauseBtn||!playFlag" @tap="videoPlayControl">
			<image :src="showBtnIcn"></image>
		</view>

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
		
		<!-- 直播状态信息 start -->
		<view class="live_stop" v-if="show_live_stop||live_recording||live_ban">
			<view class="live_stop_mask">
				<view class="live_stop_bg" :style="{backgroundImage:'url('+ liveDetail.live.live_image_url +')'}" mode=""></view>
			</view>
			<!-- 直播结束 -->
			<view class="live_stop_container" v-if="show_live_stop">
				<view class="live_stop_title">
					{{live_stop_info.remark?live_stop_info.remark:$L('直播已结束')}}
				</view>
				<view class="live_stop_time">
					{{$L('直播时长：')}}{{live_stop_info.live_time}}
				</view>
				<view class="live_stop_like_watch">
					{{$L('获赞')}} {{live_stop_info.like_num * 1}}    {{$L('观看')}} {{live_stop_info.click_num * 1}}
				</view>
				<view @click="initData" class="return_refresh">
					{{$L('刷新')}}
				</view>
			</view>
			<!-- 直播录制中 -->
			<view class="live_stop_container" v-if="live_recording">
				<view class="live_stop_title">
					{{$L('直播已结束')}}
				</view>
				<view class="live_stop_recording">
					{{$L('正在录制中，录制完成才可以观看')}}
				</view>
				<!-- <view class="live_stop_like_watch">
					获赞 {{liveDetail.live.like_num}}    观看 {{liveDetail.live.click_num}}
				</view> -->
				<view @click="goBack" class="return_refresh">
					{{$L('返回')}}
				</view>
			</view>
			<!-- 直播被禁止 -->
			<view class="live_stop_container" v-if="live_ban">
				<view class="live_stop_title">
					{{live_ban_info.msg}}
				</view>
				<view class="live_stop_recording">
					{{live_ban_info.remark}}
				</view>
				<view @click="goBack" class="return_refresh">
					{{$L('返回')}}
				</view>
			</view>
		</view>
		</view>
		<!-- 直播状态信息 end -->
	</view>
</view>
</template>

<script>
	import {
		checkPageHasMore,
		colorArray,
		initNum
	} from "@/utils/live";
	import request from "@/utils/request";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
	import livePlayGoods from "@/addons/templates/live/livePlayGoods.vue";
	import io from '@hyoga/uni-socket.io';

	const bus = getApp().globalData.bus; // 飘心---start
	// 飘心---start
	var lastFrameTime = 0;
	var ctx = null;
	var factor = {
		speed: .01, // 运动速度，值越小越慢
		t: 0  // 贝塞尔函数系数
	};
	var that;
	var timer = null; // 循环定时器
	// 飘心---end

	export default {
		components: {
			livePlayGoods,
			dataLoading,
			dataLoaded,
		},
		data() {
			return {
				pauOrPl: true,
				isShow: false,
				key: '',
				pageSize: 10, //商品每页数量
				pn: 1, //商品的当前页
				live_id: '',
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
				img_path: [
					[{
						x: 30,
						y: 400
					}, {
						x: 70,
						y: 300
					}, {
						x: -50,
						y: 150
					}, {
						x: 30,
						y: 0
					}],
					[{
						x: 30,
						y: 400
					}, {
						x: 30,
						y: 300
					}, {
						x: 80,
						y: 150
					}, {
						x: 30,
						y: 0
					}],
					[{
						x: 30,
						y: 400
					}, {
						x: 0,
						y: 90
					}, {
						x: 80,
						y: 100
					}, {
						x: 30,
						y: 0
					}]
				],
				initial_time: 1,
				// 指定视频初始播放位置
				live_like_num: '--',
				//人气数
				live_click_num: '--' //观看数
					,
				liveStateInfo: "",
				isWeiXinBrower: false, //是否微信浏览器
				showWeiXinBrowerTip: false, //微信浏览器分享的提示操作
				stat_end:1,  //终端，默认为1，pc端
				show_live_stop:false,//是否显示直播结束提示
				live_stop_info:{},//显示直播结束提示信息
				live_recording:false,//是否显示直播录制中提示
				live_ban:false,//直播是否被禁止
				live_ban_info:{
					msg:'',
					remark:''
				}
			};
		},

		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.scene) {
				let url = decodeURIComponent(options.scene);
				options.live_id = url.split('=')[1];
			}

			if (options.initial_time) {
				this.setData({
					initial_time: Number(options.initial_time)
				});
			}
			this.setData(options);
			this.initData();
			that = this; //获取canvas实例

			ctx = uni.createCanvasContext('heart_canvas');
			let key = uni.getStorageSync('token');

			if (!key) {
				let uuid = uni.getStorageSync('uuid');

				if (uuid) {
					this.setData({ 
						uuid: uuid
					});
				} else {
					let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app

					uni.setStorageSync('uuid', uuid);
				}
			} else {
				this.setData({
					key: uni.getStorageSync('token')
				});
			}
			// #ifdef H5
			this.isWeiXinBrower = this.$isWeiXinBrower();
			// #endif
			
			// #ifdef APP-PLUS
			
			uni.setStorageSync('live_id', this.live_id);
			
			let _this = this;
			uni.$on('goBack', (data) => { 
				uni.getSubNVueById('livePlayAppCon').hide();
				setTimeout(() => {
					this.goBack();
				}, 100)
			})
			uni.$on('goGoodsDetail', (data) => {
				this.goGoodsDetail(data);
				uni.getSubNVueById('livePlayAppCon').hide();
			})
			uni.$on('goLiveUserCenter', (data) => {
				this.onHandleGoLiveUserCenter(data);
				uni.getSubNVueById('livePlayAppCon').hide();
			})
			uni.$on('tapVideo', () => {
				this.pauOrPl = !this.pauOrPl
				let videoCtx = uni.createVideoContext('sldVideo')
				if (this.pauOrPl) {
					videoCtx.pause();
				} else {
					videoCtx.play();
				}
			})
			// #endif
			this.getPlatform();
		},
	
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.socket) {
				this.closeSocket();
			}

			if (timer != null) {
				that.cancelTimer(timer, false);
			} //卸载掉视频


			if (this.videoContext && this.videoContext.stop != undefined) {
				this.videoContext.stop();
			}
			
			// #ifdef H5
			if(this.player_video){
				this.player_video.dispose()
			}
			// #endif
			// #ifdef APP-PLUS
			uni.getSubNVueById('livePlayAppCon').hide();
			// 移除监听事件    
			uni.$off('goBack');
			uni.$off('goGoodsDetail'); 
			uni.$off('goLiveUserCenter'); 
			uni.$off('tapVideo'); 
			plus.key.removeEventListener('backbutton', this.subnvueBackPre);
			// #endif
		},

		onShow() {
			if (this.initial_time) {
				this.returnShow();
			}
			this.getPlatform();
			// #ifdef APP-PLUS
			setTimeout(() => {
				uni.getSubNVueById('livePlayAppCon').show();
			}, 300)
			let ctx = uni.createVideoContext('sldVideo', this)
			ctx.play()
			plus.key.addEventListener('backbutton', this.subnvueBackPre,false);
			// #endif
		},
		onHide(){
			plus.key.removeEventListener('backbutton', this.subnvueBackPre);
		},
		onReady() {
			//继续播放按钮图片
			videoContext: uni.createVideoContext('sldVideo')
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
				onShareTimeline: function (options) {
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
			subnvueBackPre(){
				uni.getSubNVueById('livePlayAppCon').hide();
			},
			//处理遮罩层物理返回键
			onBackPress(){
			},
			//获取当前终端的方法
			getPlatform(){
				//判断终端
				this.stat_end = 1;
				// #ifdef H5
				this.stat_end = 2;
				// #endif
				// #ifdef MP-WEIXIN
				this.stat_end = 3;
				// #endif
				// #ifdef APP-PLUS
				if(uni.getSystemInfoSync().platform == 'android'){
					this.stat_end = 5;
				}else if(uni.getSystemInfoSync().platform == 'ios'){
					this.stat_end = 4;
				}
				// #endif
			},
			statechange(e) {
			},



			returnShow() {
				let videoContext = uni.createVideoContext("sldVideo");

				if (videoContext) {
					videoContext.stop(); //停止播放视频
				}

				if (videoContext) {
					setTimeout(() => {
						//300毫秒延迟
						videoContext.seek(this.initial_time);
						videoContext.play(); //开始播放视频
					}, 300);
				}
			},

			//初始化数据
			initData() {
				this.setData({
					show_live_stop:false
				})
				this.getLiveInfo();
				this.getSetting();
				this.getLiveGoods();
			},

			//获取直播详情
			getLiveInfo() {
				let {
					live_id,
					liveDetail
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=detail&live_id=' + live_id + '&key=' + uni.getStorageSync(
						'token')
				}).then(res => {
					if (res.state == 200) {
						liveDetail = res.data;

						if (liveDetail.live.status == 3) {
							//禁止播放
							this.setData({
								live_ban:true,
								live_ban_info:{
									msg:res.data.msg.msg,
									remark:res.data.msg.remark
								}
							})
						} else if (liveDetail.live.status == 4) {
							//录制中
							this.setData({
								live_recording:true
							})
						} else {
							// #ifdef H5
							var video = document.createElement('video');
							
							      video.id = 'myVideo';
							      video.style = `width:100vw;height:100vh;`;
								  
							      video.setAttribute(
							        'class',
							        'video-js vjs-default-skin vjs-big-play-centered'
							      );
								  
							      video.setAttribute('webkit-playsinline', true);
							      video.setAttribute('playsinline', true);
							      video.setAttribute('x5-video-player-type', 'h5');
							      video.setAttribute('x5-video-player-fullscreen', true);
							      video.setAttribute('x-webkit-airplay', true);
							      this.$refs.videoWrapHls.$el.appendChild(video);
							      this.player_video = videojs('myVideo', {
							        controls: true,
									controlBar: {
										children:[
											{name: 'playToggle'}, // 播放按钮
											{name: 'progressControl'}, // 播放进度条
										]
									},
							        autoplay: 'autoplay',
							        preload: 'auto',
									poster: liveDetail.live.live_image_url,
							        sources: [{
							          src: liveDetail.live.status == 1?liveDetail.live.m3u8url:liveDetail.live.play_back_url,
							          type: liveDetail.live.status == 1?"application/x-mpegURL":"video/mp4"
							        }]
							      })
								  // #endif 
							
						}

						this.setData({
							liveDetail: liveDetail,
							isShow: true
						});

						if (this.socket) {
							this.socket.emit("update_user", {
								author_name: res.author.member_nickname,
								author_id: res.author.author_id ? res.author.author_id : 1,
								live_id: live_id ? live_id : 1
							});
						} else {
							// #ifndef APP-PLUS
							this.initSocket();
							// #endif
						}
					} else {
						//禁止播放
						this.setData({
							live_ban:true,
							live_ban_info:{
								msg:res.data.msg.msg,
								remark:res.data.msg.remark
							}
						})
					}
				});
			},

			//获取平台设置信息
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
					shareWrap2: false,
					showWeiXinBrowerTip: false, //微信浏览器提示层
				});
			},

			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare(type, scene) {
				let {
					liveDetail,
					live_id,
					shareImg
				} = this;
				let shareData = {};   
				if (type == 0) {
					shareData.href = liveDetail.live.live_name.share_link;
					shareData.title = this.$L('我正在看') + liveDetail.live.member_nickname + this.$L('的精彩内容，快来围观~');
					shareData.summary = liveDetail.live.live_name;
					shareData.imageUrl = liveDetail.live.live_image_url;
				} else if (type == 2) {
					shareData.imageUrl = shareImg;
				}
				this.$weiXinAppShare(type, scene, shareData);
				this.closeShare(); //关闭分享
			},

			//浏览器分享
			sldShareBrower() {
				if (this.isWeiXinBrower) {
					let {
						liveDetail,
						live_id,
						shareImg
					} = this;
					//展示分享提示
					this.showWeiXinBrowerTip = true;
					this.shareWrap2 = false;
					//微信浏览器分享
					this.$weiXinBrowerShare(1, {
						title: this.$L('我正在看') + liveDetail.live.member_nickname + this.$L('的精彩内容,快来围观~'),
						desc: liveDetail.live.live_name,
						link: getApp().globalData.h5_url + "addons/pages/livePlay/livePlay?live_id=" + live_id,
						imgUrl: liveDetail.live.live_image_url,
					});
				}
			},

			prevImg() {
				wx.previewImage({
					urls: [this.shareImg],
				})
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
					live_id: live_id ? live_id : 1
				};

				if (authorInfo.author_id) {
					userInfo.author_name = authorInfo.member_nickname;
					userInfo.author_id = authorInfo.author_id ? authorInfo.author_id : 1;
				}

				this.socket = io(getApp().globalData.socket_url, {
					path: "/socket.io",
					reconnection: true,
					jsonp: true,
					transports: ['websocket', 'polling'],
					timeout: 5000,
				});

				this.socket.on("connect", () => {
					//给服务端发送消息
					this.socket.emit("update_user", userInfo);

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
					this.socket.on("disconnect", function() {
					});
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
				this.setData({
					liveStateInfo: e.msg
				});
				bus.emit('updateLiveList', {
					type: 'live_stop',
					live_id: e.msg.live_id
				}); //显示modal
               this.setData({
				   show_live_stop:true,
				   live_stop_info:e.msg
			   })
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
				let {
					liveDetail,
					live_click_num
				} = this;
				liveDetail.live.click_num = e.click_num;
				this.setData({
					liveDetail: liveDetail,
					live_click_num: initNum(e.click_num)
				});
			},

			// 人气
			likeNumHandle(e) {
				let {
					liveDetail,
					live_like_num
				} = this;
				liveDetail.live.like_num = e.like_num;
				that.startTimer();
				this.setData({
					liveDetail: liveDetail,
					live_like_num: initNum(e.like_num)
				});
			},

			// 发送消息
			publishComment(e) {
				const {
					live_id,
					liveDetail
				} = this;

				if (uni.getStorageSync('token') && liveDetail.author.author_id != null) {
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
					
					this.socket.emit("send_msg", msg);
					//清空输入框的内容
					this.setData({
						input_val: ''
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

			// 返回上级页面
			goBack() {
				let page = getCurrentPages();
				let len = page.length;

				if (len < 2) {
					uni.redirectTo({
						url: '../liveList/liveList'
					});
				} else {
					uni.navigateBack({});
				}
			},
			
			//跳转商品详情页
			goGoodsDetail(data) {
				if (data.pageLength > 4) {
					uni.redirectTo({
						url: data.url
					});
				} else {
					uni.navigateTo({
						url: data.url
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
			
			//进入作者页面-监听事件处理 
			onHandleGoLiveUserCenter(data) {
				if (data.pageLength > 4) {
					uni.redirectTo({
						url: data.url
					});
				} else {
					uni.navigateTo({
						url: data.url
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
				this.setData({
					shareWrap2: true
				});
			},

			//生成海报事件
			createhb() {
				let {
					live_id,
					liveDetail,
					shareImg
				} = this;
				let client = '';
				//#ifdef MP-WEIXIN
				client = 'wx_xcx';
				//#endif
				//#ifdef H5
				client = 'h5';
				//#endif
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live_index&mod=shareLike',
					method: 'POST',
					data: {
						live_id: live_id,
						click_num: liveDetail.live.click_num,
						client: client
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
							//#ifdef MP-WEIXIN
							uni.getSetting({
								success(res_down) {
									if (!res_down.authSetting['scope.writePhotosAlbum']) {
										uni.showModal({
											title: _this.$L('提示'),
											content: _this.$L('您好,需要开启相册权限'),
											cancelText:this.$L('取消'),
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
							//#endif
							//#ifdef APP-PLUS
							_this.saveHb(res_info.tempFilePath);
							//#endif
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



			//加入购物车事件
			addCart(e) {
				let key = uni.getStorageSync('token');
				let gid = e.gid;
				let {
					live_id
				} = this;
        let _this = this
				if (key) {
					request({
						url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						method: 'POST',
						data: {
							key: key,
							gid: gid,
							quantity: 1,
							live_id: live_id,
							stat_end:this.stat_end
						}
					}).then(res => {
						if (res.datas.status) {
							uni.showToast({
								title: _this.$L('加入购物车成功'),
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
							stat_end:this.stat_end
						},
						success: function(res) {
							if (res.data.code == 200 && res.data.datas.status == '1') {
								uni.showToast({
									title: _this.$L('加入购物车成功'),
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

			//视频暂停/继续播放事件
			videoPlayControl() {
				let {
					playFlag,
					showPauseBtn
				} = this;
				let videoContext = uni.createVideoContext("sldVideo");

				if (playFlag) {
					if (!showPauseBtn) {
						this.setData({
							showPauseBtn: true,
							showBtnIcn: this.pauseBtnIcon
						}); //3s后自动消失

						setTimeout(() => {
							this.setData({
								showPauseBtn: false
							});
						}, 3000);
					} else {
						videoContext.pause(); //暂停播放

						this.setData({
							showPauseBtn: false,
							playFlag: false,
							showBtnIcn: this.playBtnIcon
						});
					}
				} else {
					videoContext.play(); //开始播放

					this.setData({
						playFlag: true,
						showPauseBtn: false
					});
				}
			},

			//不断绘制图片到cavans
			requestAnimationFrame(callback) {
				var currTime = new Date().getTime(); //手机屏幕刷新率一般为60Hz，大概16ms刷新一次，这里为了使页面看上去更流畅自然,通过改变timedis的值可以控制动画的快慢

				var timedis = 16 - (currTime - lastFrameTime);
				var timeToCall = Math.max(0, timedis);
				var id = setTimeout(callback, timeToCall);
				lastFrameTime = currTime + timeToCall;
				return id;
			},

			drawImage: function(data) {
				let img_url = this.img_url;
				var p10 = data[0][0]; // 三阶贝塞尔曲线起点坐标值

				var p11 = data[0][1]; // 三阶贝塞尔曲线第一个控制点坐标值

				var p12 = data[0][2]; // 三阶贝塞尔曲线第二个控制点坐标值

				var p13 = data[0][3]; // 三阶贝塞尔曲线终点坐标值

				var p20 = data[1][0];
				var p21 = data[1][1];
				var p22 = data[1][2];
				var p23 = data[1][3];
				var p30 = data[2][0];
				var p31 = data[2][1];
				var p32 = data[2][2];
				var p33 = data[2][3];
				var t = factor.t;
				/*计算多项式系数*/

				var cx1 = 3 * (p11.x - p10.x);
				var bx1 = 3 * (p12.x - p11.x) - cx1;
				var ax1 = p13.x - p10.x - cx1 - bx1;
				var cy1 = 3 * (p11.y - p10.y);
				var by1 = 3 * (p12.y - p11.y) - cy1;
				var ay1 = p13.y - p10.y - cy1 - by1;
				/*计算xt yt坐标值 */

				var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
				var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;
				/** 计算多项式系数*/

				var cx2 = 3 * (p21.x - p20.x);
				var bx2 = 3 * (p22.x - p21.x) - cx2;
				var ax2 = p23.x - p20.x - cx2 - bx2;
				var cy2 = 3 * (p21.y - p20.y);
				var by2 = 3 * (p22.y - p21.y) - cy2;
				var ay2 = p23.y - p20.y - cy2 - by2;
				/*计算xt yt坐标值*/

				var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
				var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;
				/** 计算多项式系数*/

				var cx3 = 3 * (p31.x - p30.x);
				var bx3 = 3 * (p32.x - p31.x) - cx3;
				var ax3 = p33.x - p30.x - cx3 - bx3;
				var cy3 = 3 * (p31.y - p30.y);
				var by3 = 3 * (p32.y - p31.y) - cy3;
				var ay3 = p33.y - p30.y - cy3 - by3;
				/*计算xt yt坐标值*/

				var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x;
				var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y;
				factor.t += factor.speed;
				ctx.drawImage(img_url + "live/1.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/2.png", xt2, yt2, 30, 30);
				ctx.drawImage(img_url + "live/3.png", xt3, yt3, 30, 30);
				ctx.drawImage(img_url + "live/4.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/5.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/6.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/7.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/8.png", xt1, yt1, 30, 30);
				ctx.drawImage(img_url + "live/9.png", xt1, yt1, 30, 30);
				ctx.draw();

				if (factor.t > 1) {
					factor.t = 0;
					that.cancelTimer(timer, false); //传入true动画重复
				} else {
					timer = that.requestAnimationFrame(function() {
						that.drawImage(that.img_path);
					});
				}
			},
			// add_heart: function (e) {
			//     that.startTimer()
			// },
			startTimer: function() {
				that.drawImage(that.img_path);
			},

			cancelTimer(timer, isrepeat) {
				let img_url = this.img_url;
				//清除定时器
				clearTimeout(timer);

				if (isrepeat) {
					that.startTimer();
				} else {
					//如果不重复动画则将图片回到原始位置
					ctx.drawImage(img_url + "live/1.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/2.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/3.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/4.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/5.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/6.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/7.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/8.png", 30, 400, 30, 30);
					ctx.drawImage(img_url + "live/9.png", 30, 400, 30, 30);
					ctx.draw();
				}
			}

		}
	};
</script>
<style>
	page {
		width: 750rpx;
		/* margin: 0 auto;
		position: relative; */
		overflow-x: hidden;
		overflow: hidden;
		height: 100vh;
	}
	.live_play{
		width: 750rpx;
		height: 100vh;
		overflow: hidden;
	}

	.live_back,
	.living {
		width: 750rpx;
		/* height: 600rpx; */
		height: 100vh;
		overflow: hidden;
	}
	/* #ifdef APP-PLUS */
	.live_back{
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
	/* #endif */

	.live_header {
		position: absolute;
		top: 80rpx;
		left: 20rpx;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		height: 88rpx;
		width: 750rpx;
		overflow-x: hidden;
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
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 2;
		/* left: 40rpx; */
		bottom: 30rpx;
		padding-left: 40rpx;
		width: 750rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		overflow-x: hidden;
		padding-top: 30rpx;
	}

	/* #ifdef MP-WEIXIN */
	.live_footer {
		bottom: 60rpx;
	}

	/* #endif */


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

	.live_footer .add_heart image:active {
		-webkit-animation: 1s seconddiv;
	}

	@keyframes seconddiv {
		0% {
			transform: scale(1.3, 1.3);
		}

		50% {
			transform: scale(1.2, 1.2);
		}

		100% {
			transform: scale(1, 1);
		}
	}

	.select-wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
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
		width: 540rpx;
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
		height: 30rpx;
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
		right: 0;
		margin: 0 auto;
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

	.video_control {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		z-index: 5;
	}

	.video_control image {
		width: 102rpx;
		height: 102rpx;
		margin-top: calc(100vh/3);
	}

	.empty_158 {
		width: 750rpx;
		overflow-x: hidden;
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
		position: absolute;
		right: -20rpx;
		bottom: 130rpx;
	}

	.live_footer .add_heart {
		transform: scale(1);
		-webkit-transform: scale(1);
		-webkit-transition: ease all;
		-moz-transition: ease all;
		transition: ease all;
		-webkit-transition-duration: 700ms;
		-moz-transition-duration: 700ms;
		transition-duration: 700ms;
	}
	
	/* 直播结束 start */
	.live_stop{
		width: 750rpx;
		height: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		/* background: rgba(0, 0, 0, 0.5); */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		z-index: 1;
	}
	.live_stop_bg{
		width: 750rpx;
		height: 100%;
		opacity: 0.1;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}
	.live_stop_mask{
		width: 750rpx;
		height: 100%;
		position: fixed;
		
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background: linear-gradient(0deg, #060606 0%, #4E4E4E 56.00000000000001%, #090909 99%);
	}
	.live_stop_container{
		width: 750rpx;
		height: 100%;
		position: absolute;
		top: 374rpx;
		text-align: center;
	}
	.live_stop_title{
		font-size: 36rpx;
		font-weight: bold;
		color: #fffeee;
	}
	.live_stop_time{
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
		opacity: 0.6;
		margin-top: 27rpx;
	}
	.live_stop_recording{
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
		margin-top: 17rpx;
	}
	.live_stop_like_watch{
		font-size: 26rpx;
		font-weight: 500;
		color: #ffffff;
		margin-top: 17rpx;
	}
	.return_refresh{
		width: 160rpx;
		height: 50rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 25rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 28rpx;
		color: #ffffff;
		margin: 0 auto;
		margin-top: 40rpx;
		
	}
	/* 直播结束 end */
</style>
