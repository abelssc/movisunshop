<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="video_wrap" ref="videoWrapHls"></view>
		<!-- #endif -->
		<view class="video_play" v-if="videoDetail">

			<view class="wrap">
				<view class="live_header">
					<image mode="scaleToFill" @tap="goBack" class='go_back' :src="img_url+'white_arrow_l.png'" />
					<view class="avator" :data-authorId="videoDetail.author_id" @tap="goLiveUserCenter" :style="'background:url('+videoDetail.member_avatar+');' + bgStyle"></view>
					<view class="mem_info" :data-authorId="videoDetail.author_id" @tap="goLiveUserCenter">
						<text class="name">{{videoDetail.member_nickname}}</text>
						<view class="stat_num">
							<text class="click_num" style="margin-right: 20rpx">{{videoDetail.fans_num}}{{$L('粉丝')}}</text>
						</view>
					</view>
					<view v-if="videoDetail.is_own == 0" class="live_fllow" @tap="collect" :style="'background:' + (videoDetail.is_follow == 1?'#999':'#fc1c1c')">
						<image v-if="videoDetail.is_follow == 0" :src="img_url+'live/fav_a.png'"></image>
						<text>{{videoDetail.is_follow == 0?$L('关注'):$L('已关注')}}</text>
					</view>
				</view>
				
				<!-- #ifdef MP -->
				<video :autoplay="false" @tap="chansgedd" :id="'sldVideo_child'+video_id" class="live_back" :src="videoDetail.video_path" loop
					controls="false" show-fullscreen-btn="false" show-progress="" object-fit="contain" :show-center-play-btn="false">
				</video>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<video autoplay @tap="chansgedd" id="sldVideo_child" class="live_back" :src="videoDetail.video_path" loop
					controls="false" show-fullscreen-btn="false" show-progress="" object-fit="contain" :show-center-play-btn="false">
				</video>
				<!-- #endif -->

				<view class="right_control">
					<image :src="img_url+(videoDetail.is_like == 1 ?'svideo/dianzan_complete.png':'svideo/dianzan.png')" @tap="like"></image>
					<text>{{videoDetail.like_num}}</text>
					<image :src="img_url+'svideo/play_comment.png'" @tap="openCommnet"></image>
					<text>{{(videoDetail.comment_num && videoDetail.comment_num > 0) ? videoDetail.comment_num : $L('评论')}}</text>
					<!-- #ifdef  MP-WEIXIN -->
					<button open-type="share" class="share_btn">
						<image :src="img_url+'svideo/share.png'"></image>
					</button>
					<!-- #endif -->
					<!-- #ifdef  APP-PLUS -->
					<button @tap="showShare" class="share_btn">
						<image :src="img_url+'svideo/share.png'"></image>
					</button>
					<text>{{$L('分享')}}</text>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<block v-if="isWeiXinBrower">
						<button @tap="showShare" class="share_btn">
							<image :src="img_url+'svideo/share.png'"></image>
						</button>
						<text>{{$L('分享')}}</text>
					</block>
					<!-- #endif -->
					<block v-if="videoDetail.is_own == 1">
						<image :src="img_url+'svideo/del_video.png'" @tap="del_video"></image>
						<text>{{$L('删除')}}</text>
					</block>
					<!-- 进入直播个人主页 -->
					<view class="personal_homepage" @tap="gPensonalCenter" data-curTab="video">
						<image class="personal_homepage_image" :src="member_avatar"></image>
					</view>

				</view>

				<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap">
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
							<!-- #ifdef  H5 -->
							<button @tap.stop="sldShareBrower" class="item" v-if="isWeiXinBrower">
								<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
								<text>{{$L('微信好友')}}</text>
							</button>
							<!-- #endif -->
						</view>

						<view class="close" @tap="closeShare">
							<image src="../../static/images/share_close2.png" mode="aspectFit"></image>
						</view>
					</view>
				</view>
				<view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
					<view class="wx_brower_share_top_wrap">
						<image :src="img_url+'wx_share_tip.png'" mode="widthFix" @tap="closeShare" class="wx_brower_share_img"></image>
					</view>
				</view>

				<view class="video_footer">
					<text class="title">{{videoDetail.video_name}}</text>
					<text class="desc">{{videoDetail.introdution}}</text>
					<!-- #ifndef MP -->
					<view v-if="goodsList.length == 0" style="width:100%;height:20rpx"></view>
					<!-- #endif -->
					<scroll-view v-if="goodsList.length > 0" scroll-x="true" class="video_goods">
						<view v-for="(item, index) in goodsList" :key="index" class="video_goods_item">
							<view class="goods_img" :data-gid="item.gid" @tap="goGoodsDetail" :style="'background:url('+item.goods_image+');' + bgStyle"></view>
							<view class="goods_detail">
								<text class="goods_name" :data-gid="item.gid" @tap="goGoodsDetail">{{item.goods_name}}</text>
								<view class="goods_info">
									<text class="goods_price">{{$L('¥')}}{{item.goods_price}}</text>
									<image class="add_cart" :data-gid="item.gid" @tap="addCart" :src="img_url+'svideo/add_cart.png'"></image>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 评论模块 start -->
				<view class="video_comment" v-if="showComment" @touchmove.stop.prevent="moveHandle">
					<view class="title">
						<view class="com_t_l">
							<text class="com_t_l_title">{{$L('全部评论')}}</text>
							<text class="com_t_l_total">{{$L('共有')}}{{videoDetail.comment_num}}{{$L('条评论')}}</text>
						</view>
						<image class="com_t_close" :src="img_url+'svideo/close.png'" @tap="closeComment"></image>
					</view>

					<scroll-view class="comment" scroll-y="true" @scrolltolower="getMoreCom">
						<view v-for="(item, index) in commentList" :key="index" class="com_item_wrap" :index="index" v-if="commentList.length>0">
							<view class="com_item">
								<view class="com_item_l">
									<view class="com_avator" :style="'background:url('+item.member_avatar+');' + bgStyle"></view>
									<view class="com_detail" :data-commentId="item.comment_id" :data-authorId="item.author_id"
									 :data-memberNickname="item.member_nickname" @tap="replyComment">
										<text class="com_name">{{item.member_nickname}}</text>
										<text class="com_con">{{item.content}}</text>
										<view class="com_other">
											<text class="com_time">{{item.create_time}}</text>
											<text v-if="item.is_own == 1" class="del_com" data-type="comment" @tap.stop="delCom" :data-commentId="item.comment_id">{{$L('删除')}}</text>
										</view>
									</view>
								</view>
								<view class="com_item_r">
									<image :data-commentId="item.comment_id" @tap="likeComment" :src="img_url+(item.is_like == 1?'svideo/dz_complete.png':'svideo/dz.png')"></image>
									<text>{{item.like_num}}</text>
								</view>
							</view>

							<view v-for="(itemReplay, index2) in item.reply" :key="index2" class="child" :index="itemIndex" v-if="item.reply.length>0">
								<view class="com_item">
									<view class="com_item_l">
										<view class="com_avator" :style="'background:url('+itemReplay.from_member_avatar+');' + bgStyle"></view>
										<view class="com_detail" :data-commentId="item.comment_id" :data-authorId="itemReplay.from_author_id"
										 :data-memberNickname="itemReplay.from_member_nickname" @tap="replyComment">
											<text class="com_name">{{itemReplay.from_member_nickname}}</text>
											<text class="com_con">{{$L('回复')}}<text class="replay_name">{{itemReplay.to_name!=undefinded?itemReplay.to_name:""}}：</text>{{itemReplay.content}}
											</text>
											<view class="com_other">
												<text class="com_time">{{itemReplay.create_time}}</text>
												<text v-if="itemReplay.is_own == 1" class="del_com" data-type="reply" @tap.stop="delCom" :data-commentId="item.comment_id"
												 :data-replyId="itemReplay.reply_id">{{$L('删除')}}</text>
											</view>
										</view>
									</view>
									<view class="com_item_r">
										<image :data-commentId="item.comment_id" :data-replyId="itemReplay.reply_id" @tap="likeReply" :src="img_url+(itemReplay.is_like == 1?'svideo/dz_complete.png':'svideo/dz.png')"></image>
										<text>{{itemReplay.like_num}}</text>
									</view>
								</view>
							</view>
							<!-- 查看更多回复 -->
							<view v-if="item.reply.length>3&&item.reply_has_more == 1" class="reply_pagnation" @tap="getMoreReply"
							 :data-commentId="item.comment_id" :data-rpn="item.rpn">
								<view class="left_line"></view>
								<text class="more_reply">{{$L('查看更多回复')}}</text>
								<view class="right_line"></view>
							</view>
							<!-- 收起更多回复 -->
							<view v-if="item.reply.length>4&&item.reply_has_more == 0" class="reply_pagnation" @tap="closeMoreReply"
							 :data-commentId="item.comment_id">
								<view class="left_line"></view>
								<text class="more_reply">{{$L('收起更多回复')}}</text>
								<view class="right_line"></view>
							</view>
						</view>


						<!-- 数据加载完毕 -->
						<dataLoaded :showFlag="!hasmore&&commentList.length>0" />

						<!-- 数据加载中 -->
						<dataLoading :showFlag="hasmore&&loading" />



						<!-- 页面loading -->
						<view class="page_loading_child" v-if="firstLoading">
							<image :src="img_url + 'live/page_loading_icon.gif'"></image>
						</view>

					</scroll-view>

					<view class="comment_empty" v-if="!firstLoading&&!commentList.length">
						<!-- 页面空数据 -->
						<emptyData :showFlag="!firstLoading&&!commentList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />
					</view>

					<view class="replay">
						<view class="input_wrap">
							<text v-if="replyInfo!=''" class="reply_tip">{{$L('回复')}}@<text class="reply_name">{{replyInfo.member_nickname}}</text></text>
							<image v-if="replyInfo==''" :src="img_url+'svideo/edit.png'"></image>
							<input type="text" cursor-spacing="30" :focus="showFocus" name="reply_con" class="reply_inp" :placeholder="$L('赶快发表你的评论吧~')"
							 placeholder-style="font-size:24rpx;color:#949494" confirm-type="send" @confirm="sendReplyComment" maxlength="100"
							 v-model="input_val"></input>
						</view>
					</view>
				</view>
				<!-- 评论模块 end -->

			</view>

		</view>
	</view>
</template>

<script>
	import {
		checkPageHasMore
	} from "@/utils/live";
	import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";

	const img_url = getApp().globalData.img_url;
	let cur_time = 0; //记录发送评论的时间，由于微信小程序本身input的发送时间在swiper里面会触发两次，所以时间间隔规避一下这个问题

	export default {
		components: {
			pageLoading,
			emptyData,
			dataLoading,
			dataLoaded,
		},
		data() {
			return {
				loading: false, //数据加载状态 
				videoDetail: '', //短视频详情
				img_url: getApp().globalData.img_url, //图片地址
				bgStyle: 'background-size:contain;background-position:center center;background-repeat: no-repeat;', //背景图片样式
				goodsList: [], //短视频绑定的商品
				commentList: [], // 评论列表
				hasmore: true, //是否还有数据，用于页面展示
				input_val: '', //输入框内容
				firstLoading: true, //是否初次加载，是的话展示页面居中的loading效果，
				showFocus: false, //评论回复输入框默认失去焦点
				replyInfo: '', //回复评论的数据
				showComment: false, //是否显示评论
				pn: 1, //当前页
				pageSize: 10, //每页数据
				autoplay: true, //是否自动播放 
				key: '', //登录的key值
				member_avatar: '', //默认作者头像
				shareWrap: false,
				isWeiXinBrower: false, //是否微信浏览器
				showWeiXinBrowerTip: false, //微信浏览器分享的提示操作
				stat_end: 1, //终端，默认为1，pc端
				pauOrPl: true,
			};
		},

		components: {},
		props: {
			video_id: {
				//短视频id
				type: String,
				default: ''
			},
			activeIndex: {
				//当前播放的短视频id
				type: String,
				default: ''
			},
			author_id: {
				//当前作者id
				type: String,
				default: ''
			},
			showHide: {
				type: String,
				default: 'hide'
			},
		},
		watch: {
			// #ifdef MP-WEIXIN
			showHide: {
				handler() {
					if (this.showHide == 'show') {
						uni.createVideoContext('sldVideo_child'+this.video_id,this).play();
					} else {
						uni.createVideoContext('sldVideo_child'+this.video_id,this).pause();
					}
				},
				deep: true
			},
			// #endif
			// #ifdef APP-PLUS
			showHide: {
				handler() {
					if (this.showHide == 'show') {
						uni.getSubNVueById('vidoePlayAppCon').show();
						plus.key.addEventListener('backbutton', this.subnvueBackPre,false);
						uni.createVideoContext('sldVideo_child').play()
					} else {
						plus.key.removeEventListener('backbutton', this.subnvueBackPre);
						uni.getSubNVueById('vidoePlayAppCon').hide();
					}
				},
				deep: true
			},
			// #endif
		},

		beforeMount() {
			// uni.createVideoContext('sldVideo_child').pause();
		},
		beforeDestroy(){
			// #ifdef APP-PLUS
			// 移除监听事件    
			uni.$off('goBack');
			uni.$off('goGoodsDetail'); 
			uni.$off('goLiveUserCenter'); 
			uni.$off('tapVideo'); 
			plus.key.removeEventListener('backbutton', this.subnvueBackPre);
			// #endif
		},

		mounted() {
			let {
				video_id
			} = this;

			// uni.createVideoContext('sldVideo_child').pause();
			// #ifdef H5
			this.isWeiXinBrower = this.$isWeiXinBrower();
			// #endif
			this.initData();
			this.getPlatform();
			
			// 监听视频播放页面的返回事件
			// #ifdef APP-PLUS
			uni.setStorageSync('svideo_id', this.video_id);

			setTimeout(() => {
				uni.getSubNVueById('vidoePlayAppCon').show('fade-in', 200);
			}, 1000)

			let _this = this;
			uni.$on('goBack', (data) => {
				uni.getSubNVueById('vidoePlayAppCon').hide();
				setTimeout(() => {
					this.goBack();
				}, 100)
			})
			
			uni.$on('goGoodsDetail', (data) => {
				uni.getSubNVueById('vidoePlayAppCon').hide();
				this.goGoodsDetailNew(data);
			})
			uni.$on('goLiveUserCenter', (data) => {
				this.onHandleGoLiveUserCenter(data);
				uni.getSubNVueById('vidoePlayAppCon').hide();
			})
			
			uni.$on('tapVideo', () => {
				_this.pauOrPl = !_this.pauOrPl
				let videoCtx = uni.createVideoContext('sldVideo_child')
				if (_this.pauOrPl) {
					videoCtx.pause();
				} else {
					videoCtx.play();
				}
			})
			
			plus.key.addEventListener('backbutton', this.subnvueBackPre,false);
			// #endif
		},

		moved() {

		},

		destroyed() {
			// #ifdef H5
			if(this.player_video){
				this.player_video.dispose()
			}
			// #endif
		},

		methods: {
			subnvueBackPre(){
				uni.getSubNVueById('vidoePlayAppCon').hide();
			},
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
			//初始化数据
			initData() {
				this.getVideoInfo();
				this.getVideoGoods();
			},

			//跳转商品详情页
			goGoodsDetailNew(data) {
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

			//获取短视频详情
			getVideoInfo() {
				let key = uni.getStorageSync('token');
				let {
					video_id,
					videoDetail,
					member_avatar
				} = this;
        let that = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=detail&video_id=' + video_id + '&key=' + key,
					success: res => {
						if (res.data.state == 200) {
							videoDetail = res.data.data.video; //作者头像

							this.setData({
								member_avatar: res.data.data.member_info.member_avatar
							});

							if (videoDetail.status == 3) {
								uni.showModal({
									title: '',
									content: that.$L('审核失败，') + videoDetail.remark,
									showCancel: false,
									confirmText: that.$L('确定'),
									confirmColor: '#FC1C1C',
									success: res => {
										if (res.confirm) {
											uni.navigateBack({});
										}
									}
								});
							} else {
								// #ifdef H5
								var video = document.createElement('video');
								video.id = 'myVideo'+video_id;
								video.style = `max-width:100vw;max-height:100vh;`;
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
								this.player_video = videojs('myVideo'+video_id, {
									controls: true,
									controlBar: {
										children:[
											{name: 'playToggle'}, // 播放按钮
											{name: 'progressControl'}, // 播放进度条
										]
									},
									autoplay: false,
									preload: 'auto',
									poster: videoDetail.video_image,
									sources: [{
										src: videoDetail.video_path,
										type: "video/mp4"
									}]
								})
								// #endif 
								this.setData({
									videoDetail: videoDetail
								});
							}
						} else {
							if (typeof res.data.msg == 'String') {
								uni.showModal({
									title: '',
									content: res.data.msg,
									showCancel: false,
									confirmText: that.$L('确定'),
									confirmColor: '#FC1C1C',
									success: res => {
										if (res.confirm) {
											uni.navigateBack({});
										}
									}
								});
							} else {
								uni.showModal({
									title: res.data.msg[0],
									content: res.data.msg[1],
									showCancel: false,
									confirmText: that.$L('确定'),
									confirmColor: '#FC1C1C',
									success: res => {
										if (res.confirm) {
											uni.navigateBack({});
										}
									}
								});
							}
						}
					}
				});
			},

			//获取评论列表
			getCommentList() {
				let {
					video_id,
					videoDetail,
					commentList,
					hasmore,
					firstLoading,
					pageSize,
					pn
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=comment&mod=index&video_id=' + video_id + '&key=' + uni.getStorageSync(
						'token') + '&current=' + pn + '&pageSize=' + pageSize,
					success: res => {
						if (res.data.state == 200) {
							let list = res.data.data.comment;
							list.forEach(el => el.rpn = 1);

							if (pn == 1) {
								commentList = list;
							} else {
								commentList = commentList.concat(list);
							}

							if (checkPageHasMore(res.data.data.pagination)) {
								pn++;
							} else {
								hasmore = false;
							} //初次加载的话更改状


							if (firstLoading) {
								firstLoading = false;
							}

							this.setData({
								loading: false,
								hasmore: hasmore,
								commentList: commentList,
								firstLoading: firstLoading,
								pn: pn,
								hasmore: hasmore
							});
						}
					}
				});
			},

			//评论列表滑到底部加载数据
			getMoreCom() {
				if (this.hasmore) {
					this.getCommentList();
				}
			},

			// 返回上级页面
			goBack() {
				let page = getCurrentPages();
				let len = page.length;

				if (len < 2) {
					uni.redirectTo({
						url: '../svideoList/svideoList'
					});
				} else {
					uni.navigateBack({});
				}
			},

			//关注、取消关注事件
			collect(e) {
				let key = uni.getStorageSync('token');
				let {
					videoDetail
				} = this;
        let that = this
				if (key) {
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=follow&mod=followAuthor',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							to_auhtor_id: videoDetail.author_id,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								videoDetail.is_follow = videoDetail.is_follow == 1 ? 0 : 1;
								videoDetail.fans_num = res.data.data.fans_num;
								this.setData({
									videoDetail: videoDetail
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: that.$L('温馨提示!'),
						content: that.$L('需要登录才能操作'),
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
					shareWrap: true
				});
			},

			//关闭分享
			closeShare() {
				this.setData({
					shareWrap: false,
					showWeiXinBrowerTip: false, //微信浏览器提示层
				});
			},

			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare(type, scene) {
				let {
					videoDetail,
					video_id
				} = this;
				let shareData = {};
				if (type == 0) {
					shareData.href = videoDetail.share_link;
					shareData.title = videoDetail.video_name;
					shareData.summary = this.$L('我正在看') + videoDetail.member_nickname + this.$L('的精彩内容，快来围观~');
					shareData.imageUrl = videoDetail.video_image;
				}
				this.$weiXinAppShare(type, scene, shareData);
				this.closeShare(); //关闭分享
			},

			//浏览器分享
			sldShareBrower() {
				if (this.isWeiXinBrower) {
					let {
						videoDetail,
						video_id
					} = this;
					//展示分享提示
					this.showWeiXinBrowerTip = true;
					this.shareWrap = false;
					//微信浏览器分享
					this.$weiXinBrowerShare(1, {
						title: videoDetail.video_name,
						desc: this.$L('我正在看') + videoDetail.member_nickname + this.$L('的精彩内容，快来围观~'),
						link: videoDetail.share_link,
						imgUrl: videoDetail.video_image,
					});
				}
			},

			/**
			 * 用户点击右上角分享
			 */
			onShareAppMessage: function(options) {
				let {
					videoDetail,
					video_id
				} = this;
				return {
					title: videoDetail.video_name,
					path: '/addons/pages/svideoPlay/svideoPlay?video_id=' + video_id,
					imageUrl: videoDetail.video_image
				};
			},
			onShareTimeline: function(options) {
				let {
					videoDetail,
					video_id
				} = this;
				return {
					title: videoDetail.video_name,
					path: '/addons/pages/svideoPlay/svideoPlay?video_id=' + video_id,
					imageUrl: videoDetail.video_image
				};
			},

			//获取短视频绑定的商品
			getVideoGoods() {
				let {
					goodsList,
					video_id
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=goodsList',
					data: {
						pageSize: 100,
						current: 1,
						video_id: video_id
					},
					success: res => {
						if (res.data.state == 200) {
							goodsList = res.data.data.goods;
						}

						this.setData({
							goodsList: goodsList
						});
					}
				});
			},

			//跳转商品详情页
			goGoodsDetail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					let page = getCurrentPages();
					let len = page.length;

					if (len > 4) {
						uni.redirectTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					} else {
						uni.navigateTo({
							url: '/pages/goods_detail/goods_detail?gid=' + gid
						});
					}
				}
			},

			//加入购物车事件
			addCart(e) {
				let gid = e.currentTarget.dataset.gid;
				let key = uni.getStorageSync('token');

				if (key) {
					uni.request({
						url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_add',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: key,
							gid: gid,
							quantity: 1,
							stat_end: this.stat_end
						},
						success: res => {
							if (res.data.datas.status) {
								uni.showToast({
									title: this.$L('加入购物车成功'),
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: res.data.datas.msg,
									icon: 'none'
								});
							}
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

			//删除视频提示
			del_video() {
				uni.showModal({
					title: this.$L('提示'),
					content: this.$L('确定删除该视频？'),
					cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
					success: res => {
						if (res.confirm) {
							this.delVideo();
						}
					}
				});
			},

			//删除视频
			delVideo() {
				let {
					video_id
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=video&mod=delVideo',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						video_id: video_id,
						key: uni.getStorageSync('token')
					},
					success: res => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});

						if (res.data.state == 200) {
							//删除视频后刷新个人中心动态列表
							const page = getCurrentPages();
							if (page[page.length - 2].route == "addons/pages/liveUserCenter/liveUserCenter") {
								// 更新上一页数据
								page[page.length - 2].$vm.updateVideoList();
							}
							//返回上一页
							uni.navigateBack({});
						}
					}
				});
			},

			//点赞事件
			like() {
				let key = uni.getStorageSync('token');
				let {
					video_id,
					videoDetail
				} = this;

				if (key) {
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=video&mod=likeVideo',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							video_id: video_id,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								videoDetail.is_like = videoDetail.is_like == 1 ? 0 : 1;
								videoDetail.like_num = res.data.data.like_num;
								this.setData({
									videoDetail: videoDetail
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: this.$L('需要登录才能点赞'),
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

			//评论模块删除事件
			delCom(e) {
				e.stopPropagation()
				let tmp_data = e.currentTarget.dataset;
				uni.showModal({
					title: '',
					content: this.$L('确认删除该评论？'),
					cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
					success: res => {
						if (res.confirm) {
							if (tmp_data.type == 'comment') {
								this.delComment(tmp_data.commentid);
							} else {
								this.delApply(tmp_data.replyid, tmp_data.commentid);
							}
						}
					}
				});
			},

			// 删除回复
			delApply(reply_id, comment_id) {
				let {
					video_id,
					videoDetail,
					commentList
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=delReply',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						reply_id: reply_id,
						key: uni.getStorageSync('token')
					},
					success: res => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});

						if (res.data.state == 200) {
							let index = commentList.findIndex(el => el.comment_id == comment_id);
							let r_index = commentList[index].reply.findIndex(el => el.reply_id == reply_id);
							commentList[index].reply.splice(r_index, 1);
							this.setData({
								commentList: commentList
							});
						}
					}
				});
			},

			// 删除评论
			delComment(comment_id) {
				let {
					video_id,
					videoDetail,
					commentList
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=comment&mod=delComment',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						comment_id: comment_id,
						video_id: video_id,
						key: uni.getStorageSync('token')
					},
					success: res => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});

						if (res.data.state == 200) {
							videoDetail.comment_num = --videoDetail.comment_num;
							let index = commentList.findIndex(el => el.comment_id == comment_id);
							commentList.splice(index, 1);
							this.setData({
								videoDetail: videoDetail,
								commentList: commentList
							});
						}
					}
				});
			},

			// 点赞评论
			likeComment(e) {
				let comment_id = e.currentTarget.dataset.commentid;
				let key = uni.getStorageSync('token');
				let {
					commentList
				} = this;

				if (key) {
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=comment&mod=likeComment',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							comment_id: comment_id,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								let index = commentList.findIndex(el => el.comment_id == comment_id);
								let is_like = commentList[index].is_like;
								commentList[index].is_like = is_like == 1 ? 0 : 1;
								commentList[index].like_num = res.data.data.like_num;
								this.setData({
									commentList: commentList
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: this.$L('需要登录才能点赞哦'),
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

			// 点赞回复
			likeReply(e) {
				let comment_id = e.currentTarget.dataset.commentid;
				let reply_id = e.currentTarget.dataset.replyid;
				let key = uni.getStorageSync('token');
				let {
					commentList
				} = this;

				if (key) {
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=likeReply',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							reply_id: reply_id,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								let index = commentList.findIndex(el => el.comment_id == comment_id);
								let r_index = commentList[index].reply.findIndex(el => el.reply_id == reply_id);
								let is_like = commentList[index].reply[r_index].is_like;
								commentList[index].reply[r_index].is_like = is_like == 1 ? 0 : 1;
								commentList[index].reply[r_index].like_num = res.data.data.like_num;
								this.setData({
									commentList: commentList
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: this.$L('需要登录才能点赞哦'),
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

			//回复评论
			replyComment(e) {
				let tmp = e.currentTarget.dataset;
				let {
					replyInfo
				} = this;

				if (uni.getStorageSync('token')) {
					this.setData({
						replyInfo: {
							comment_id: tmp.commentid,
							to_author_id: tmp.authorid,
							member_nickname: tmp.membernickname
						},
						showFocus: true
					});
				} else {
					uni.showToast({
						title: this.$L('需要登录才能回复哦'),
						icon: 'none'
					});
				}
			},

			//评论功能
			sendReplyComment(e) {
				if (Date.parse(new Date()) - cur_time < 10) {
					return false;
				} else {
					cur_time = Date.parse(new Date());
				}

				let key = uni.getStorageSync('token');

				if (!key) {
					uni.showModal({
						title: this.$L('温馨提示!'),
						content: this.$L('需要登录才能操作哦'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: res => {
							if (res.confirm) {
								getApp().globalData.goLogin();
							}
						}
					});
					return;
				}

				let {
					replyInfo,
					video_id,
					commentList,
					videoDetail
				} = this;

				if (replyInfo == '') {
					//发布评论
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=comment&mod=publishComment',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							video_id: video_id,
							content: e.detail.value,
							key: key
						},
						success: res => {

							if (res.data.state == 200) {
								let that = this
								videoDetail.comment_num = res.data.data.comment_num;
								commentList.unshift(res.data.data); //清空输入内容
								setTimeout(() => {
									that.commentList = JSON.parse(JSON.stringify(commentList)),
										that.input_val = '',
										that.showFocus = false,
										that.videoDetail = videoDetail
								}, 0)

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					//回复评论
					let that = this
					uni.request({
						url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=publishReply',
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							comment_id: replyInfo.comment_id,
							to_author_id: replyInfo.to_author_id,
							video_id: video_id,
							content: e.detail.value,
							key: key
						},
						success: res => {
							if (res.data.state == 200) {
								let index = commentList.findIndex(el => el.comment_id == replyInfo.comment_id);
								commentList[index].reply.push(res.data.data); //清空输入内容

								// this.setData({
								// 	commentList: commentList,
								// 	input_val: '',
								// 	showFocus: false,
								// 	replyInfo: ''
								// });
								setTimeout(() => {
									// this.setData({
									that.commentList = commentList,
										that.input_val = '',
										that.showFocus = false,
										that.replyInfo = ''
									// });
								}, 0)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				}
			},

			//关闭评论
			closeComment() {
				this.setData({
					showComment: false
				});
			},

			//打开评论
			openCommnet() {
				this.setData({
					showComment: true,
					firstLoading: true,
					hasmore: true,
					pn: 1
				});
				this.getCommentList();
			},

			// 查看更多回复
			getMoreReply(e) {
				let tmp = e.currentTarget.dataset;
				let {
					commentList
				} = this;
				uni.request({
					url: getApp().globalData.svideo_url + '/index.php?app=reply&mod=index&comment_id=' + tmp.commentid +
						'&pageSize=' +
						this.pageSize + '&current=' + tmp.rpn,
					success: res => {
						if (res.data.state == 200) {
							let index = commentList.findIndex(el => el.comment_id === tmp.commentid);
							let list = res.data.data.reply;

							if (tmp.rpn == 1) {
								commentList[index].reply = list;
							} else {
								commentList[index].reply = commentList[index].reply.concat(list);
							}

							let ishasmore = checkPageHasMore(res.data.data.pagination);

							if (!ishasmore) {
								commentList[index].reply_has_more = 0;
							} else {
								commentList[index].rpn = ++tmp.rpn;
							}

							this.setData({
								commentList: commentList
							});
						}
					}
				});
			},

			// 收起更多回复
			closeMoreReply(e) {
				let comment_id = e.currentTarget.dataset.commentid;
				let {
					commentList
				} = this;
				let index = commentList.findIndex(el => el.comment_id === comment_id);
				commentList[index].reply = commentList[index].reply.slice(0, 4);
				commentList[index].reply_has_more = 1;
				commentList[index].rpn = 1;
				this.setData({
					commentList: commentList
				});
			},

			chansgedd() {
				uni.createVideoContext('sldVideo_child_76').pause();
			},

			//视频暂停播放，flag为true播放，否则暂停
			videoCon(flag) {
				let {
					video_id
				} = this;
				let str = "sldVideo_child_" + video_id;
				let videoContext = uni.createVideoContext(str);
				videoContext.pause(); //暂停播放

				this.setData({
					autoplay: flag
				});
			},

			//进入直播个人中心
			gPensonalCenter(e) {
				var curTab = e.currentTarget.dataset.curtab;
				let key = uni.getStorageSync('token');

				if (!key) {
					uni.showModal({
						title: this.$L('提示'),
						content: this.$L('未登录，请先登录'),
						cancelText:this.$L('取消'),
						confirmText:this.$L('确定'),
						success: function(res) {
							if (res.cancel) { //点击了取消
							} else {
								uni.switchTab({
									url: '/pages/user/user'
								});
							}
						}
					});
				} else {
					uni.navigateTo({
						url: '/addons/pages/liveUserCenter/liveUserCenter?curTab=' + curTab
					});
				}
			},
			moveHandle() {

			}

		}
	};
</script>
<style>
	/* #ifdef H5 */
	.video_wrap /deep/ .video-js {
		width: 100vw;
		height: 100vh;
	}
	.video_wrap /deep/ .video-js .vjs-tech {
		width: auto;
		height: auto;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	/* #endif */
	
	.live_back,
	.living {
		width: 750rpx;
		height: 100vh;
	}
	
	.video_wrap{
		width: 100vw;
		height: 100vh;
		overflow-y: hidden;
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
		margin-bottom: 15rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
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
		position: absolute;
		z-index: 2;
		left: 30rpx;
		bottom: 30rpx;
		width: 750rpx;
		height: 110rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.live_footer .goods {
		width: 110rpx;
		height: 90rpx;
		border-radius: 55rpx;
		background-color: rgba(0, 0, 0, 0.3);
		padding-top: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.live_footer .goods image {
		width: 80rpx;
		height: 80rpx;
	}

	.live_footer .goods text {
		position: absolute;
		top: 16rpx;
		left: 65rpx;
		/* width: 28rpx; */
		height: 28rpx;
		line-height: 28rpx;
		background-color: #fff;
		color: #ff0200;
		font-size: 24rpx;
		border-radius: 14rpx;
		text-align: center;
		padding: 0 9rpx;
	}

	.live_footer .talk_con {
		height: 65rpx;
		width: 325rpx;
		margin-left: 30rpx;
		border-radius: 30rpx;
		background: rgba(0, 0, 0, 0.3);
		padding: 0 20rpx;
		color: #fff;
	}

	.live_footer .share {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 77rpx;
		height: 110rpx;
		margin-left: 21rpx;
	}

	.live_footer .share image {
		width: 77rpx;
		height: 77rpx;
	}

	.live_footer .share text {
		color: #fff;
		font-size: 22rpx;
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
	}

	.gonggao .title {
		color: #fc1c1c;
		font-size: 26rpx;
		line-height: 36rpx;
	}

	.gonggao .ba_txt {
		color: #fff;
		font-size: 24rpx;
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
	}

	.barrage_item .name {
		font-size: 24rpx;
		line-height: 36rpx;
		margin-right: 15rpx;
	}

	.barrage_item .barrage_item_con {
		color: #fff;
		font-size: 24rpx;
	}

	/***** 弹幕 end *****/

	.right_control {
		position: absolute;
		bottom: 310rpx;
		right: 30rpx;
		z-index: 99;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.right_control image {
		width: 68rpx;
		height: 68rpx;
		margin-bottom: 13rpx;
	}

	.right_control text {
		color: #fff;
		font-size: 24rpx;
		margin-bottom: 36rpx;
		white-space: nowrap;
	}

	.right_control .share_btn {
		background-color: transparent;
		border: none;
		color: transparent;
		line-height: 0;
	}

	.right_control .share_btn::after {
		border: none !important;
	}

	/* 进入个人主页按钮入口 */
	.personal_homepage {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		border: 2rpx solid #ffffff;
		bottom: 310rpx;
		right: 30rpx;
		z-index: 99;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffffff;
	}

	.personal_homepage .personal_homepage_image {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		margin-bottom: 0;
	}


	.video_footer {
		position: absolute;
		left: 30rpx;
		/* #ifdef MP */
		bottom: 80rpx;
		/* #endif */
		/* #ifndef MP */
		bottom: 37rpx;
		/* #endif */
		right: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
	}

	.video_footer .title {
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.video_footer .desc {
		color: #fff;
		font-size: 26rpx;
		line-height: 40rpx;
		margin-bottom: 18rpx;
		width: 570rpx;
	}

	.wrap {
		width: 750rpx;
		height: 100vh;
		overflow: hidden;
	}

	.video_footer .video_goods {
		height: 172rpx;
		white-space: nowrap;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.video_footer .video_goods .video_goods_item {
		width: 410rpx;
		height: 100%;
		display: inline-block;
		border-radius: 15rpx;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		margin-right: 30rpx;
		clear: both;
		overflow: hidden;
	}

	.video_footer .video_goods .video_goods_item .goods_img {
		width: 172rpx;
		height: 172rpx;
		background: #fff;
		border-radius: 15rpx 0 0 15rpx;
		float: left;
	}

	.video_footer .video_goods .video_goods_item .goods_detail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		flex: 1;
		background: #222;
		height: 100%;
		border-radius: 0 15rpx 15rpx 0;
		padding: 15rpx 20rpx;
		box-sizing: border-box;
	}

	.video_footer .video_goods .video_goods_item .goods_detail .goods_name {
		width: 200rpx;
		color: #fff;
		font-size: 24rpx;
		line-height: 36rpx;
		height: 72rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		white-space: normal;
	}

	.video_footer .video_goods .video_goods_item .goods_detail .goods_info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 200rpx;
	}

	.video_footer .video_goods .video_goods_item .goods_detail .goods_info .goods_price {
		color: #fff;
		font-size: 28rpx;
		letter-spacing: 2rpx;
	}

	.video_footer .video_goods .video_goods_item .goods_detail .goods_info .add_cart {
		width: 48rpx;
		height: 48rpx;
	}

	.video_comment {
		/* position: fixed; */
		position: absolute;
		z-index: 100;
		left: 0;
		right: 0;
		bottom: 0;
		width: 750rpx;
		/* height: 90vw; */
		background: #fff;
		border-radius: 15rpx 15rpx 0 0;
	}


	.video_comment .comment_empty {
		position: absolute;
		z-index: -1;
		left: 0;
		right: 0;
		bottom: 0;
		top: 70rpx;
	}

	.video_comment .title {
		display: flex;
		padding: 30rpx;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		height: 40rpx;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.video_comment .title .com_t_l {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.video_comment .title .com_t_l .com_t_l_title {
		color: #2d2d2d;
		font-size: 32rpx;
		margin-right: 18rpx;
	}

	.video_comment .title .com_t_l .com_t_l_total {
		color: #949494;
		font-size: 22rpx;
	}

	.video_comment .title .com_t_close {
		width: 48rpx;
		height: 48rpx;
	}

	.replay {
		position: absolute;
		z-index: 4;
		height: 100rpx;
		width: calc(750rpx - 60rpx);
		padding: 0 30rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0px 0px 20px 0px rgba(86, 86, 86, 0.08);
	}

	.replay .input_wrap {
		background-color: #ddd;
		border-radius: 6px;
		width: 690rpx;
		height: 57rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.replay .input_wrap .reply_inp {
		display: flex;
		flex: 1;
	}

	.replay .input_wrap image {
		width: 47rpx;
		height: 47rpx;
		margin: 0 10rpx;
	}

	.replay .reply_tip {
		color: #2d2d2d;
		font-size: 24rpx;
		padding: 0 15rpx;
	}

	.replay .reply_name {
		color: #4d8efb;
	}

	.video_comment .comment .com_item_wrap {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.video_comment .comment {
		width: 100%;
		height: calc(750rpx - 220rpx);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: 20rpx;
		/* position: relative; */
		padding-bottom: 100rpx;
	}

	.video_comment .comment .com_item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		width: calc(750rpx - 60rpx);
		margin-left: 30rpx;
	}

	.video_comment .comment .com_item .com_item_l {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		width: 600rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_avator {
		width: 43rpx;
		height: 43rpx;
		border-radius: 50%;
		margin-right: 18rpx;
		margin-top: 10rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_detail {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		flex: 1;
	}

	.video_comment .comment .com_item .com_item_l .com_detail .com_name {
		color: #2d2d2d;
		font-size: 28rpx;
		margin-bottom: 12rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_detail .com_con {
		color: #2d2d2d;
		font-size: 26rpx;
		line-height: 39rpx;
		margin-bottom: 7rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_detail .com_other {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		margin-bottom: 12rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_detail .com_other .com_time {
		color: #949494;
		font-size: 22rpx;
		margin-right: 20rpx;
	}

	.video_comment .comment .com_item .com_item_l .com_detail .com_other .del_com {
		color: #4d8efb;
		font-size: 20rpx;
	}

	.video_comment .comment .com_item .com_item_r {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.video_comment .comment .com_item .com_item_r image {
		width: 46rpx;
		height: 46rpx;
	}

	.video_comment .comment .com_item .com_item_r text {
		color: #949494;
		font-size: 20rpx;
		margin-top: -3rpx;
	}

	.comment .child {
		padding-left: 60rpx;
	}

	.video_comment .comment .child .com_item .com_item_l .com_avator {
		width: 30rpx;
		height: 30rpx;
		margin-top: 0;
		margin-right: 10rpx;
	}

	.video_comment .comment .child .com_item .com_item_l .com_detail .com_name {
		font-size: 26rpx;
		margin-bottom: 5rpx;
	}

	.video_comment .comment .child .com_item .com_item_l .com_detail .com_con {
		font-size: 24rpx;
	}

	.video_comment .comment .child .com_item .com_item_l .com_detail .com_con .replay_name {
		color: #949494;
		font-size: 24rpx;
	}

	.video_comment .comment .child .com_item {
		width: calc(750rpx - 120rpx);
	}

	.video_comment .comment .child .com_item .com_item_l {
		width: 550rpx;
	}

	.reply_pagnation {
		width: 550rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 40rpx;
		padding-left: 110rpx;
		padding-right: 90rpx;
	}

	.reply_pagnation .left_line,
	.reply_pagnation .right_line {
		height: 1rpx;
		background: rgba(0, 0, 0, 0.1);
		width: 166rpx;
	}

	.reply_pagnation .more_reply {
		color: #2d2d2d;
		font-size: 22rpx;
	}

	.page_loading_child {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 750rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: transparent;
	}

	.page_loading_child image {
		width: 60rpx;
		height: 60rpx;
	}
</style>
