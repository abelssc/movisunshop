<template>
	<view v-if="loadEnd">
		<block v-if="videoUrl.length == 1">
			<view style="width:750rpx;height:100vh;overflow-y: hidden;">
				<videoPlay :id="'sldVideo_'+videoUrl[0].video_id" :video_id="videoUrl[0].video_id" :activeIndex="videoUrl[0].video_id"
					:author_id="author_id" :prevIndex="prevIndex" :nextIndex="nextIndex" :showHide="videoUrl[0].ShowHide"></videoPlay>
			</view> 

			<!-- 回放视频暂停/播放的弹层展示 --> 
			<view class="video_control" v-if="playFlag&&showPauseBtn||!playFlag" @tap="videoPlayControl">
				<image :src="showBtnIcn" :video_id="videoUrl[0].video_id"></image>
			</view>  
	    </block> 
		<block v-else>
			<swiper class="swiper" vertical :interval="interval" :duration="duration" @animationfinish="animationfinish">
				<swiper-item v-for="(item,index) in videoUrl" :key="index">
					<view style="width:750rpx;height:100vh;overflow-y: hidden;">
						<videoPlay :id="'sldVideo_'+item.video_id" :video_id="item.video_id" :activeIndex="item.video_id"
						:author_id="author_id" :prevIndex="prevIndex" :nextIndex="nextIndex" :showHide="item.ShowHide"></videoPlay>
					</view> 

					<!-- 回放视频暂停/播放的弹层展示 --> 
					<view class="video_control" v-if="playFlag&&showPauseBtn||!playFlag" @tap="videoPlayControl">
						<image :src="showBtnIcn" :video_id="item.video_id"></image>
					</view>  
				</swiper-item>
			</swiper>
		</block>
	</view>
</template>

<script>
	import {
		checkPageHasMore
	} from "@/utils/live";
	import request from "@/utils/request";
	import videoPlay from "@/component/videoPlay/videoPlay";

	export default {
		data() { 
			return {
				loadEnd: false,
				ShowHide: 'hide',
				label_id: '', //label_id: 该标签下的所有视频
				theme_id: '', //theme_id: 该主题下的所有视频
				author_id: '', //author_id: 该作者下的所有视频
				type: '', //type: 我喜欢的视频
				video_id: '', //当前短视频id
				playFlag: true, //视频是否播放
				showPauseBtn: false,  //是否显示暂停按钮
				showBtnIcn: '', //视频播放控制层按钮图片
				activeIndex: '', //当前播放的视频id
				videoUrl: [ // 视频列表
					{ video_id: '' }
				],
				videoId: [], // 所有视频id
				prevIndex: '', // 上个视频的id
				nextIndex: '', // 下个视频的id
				interval: 2000,
				duration: 500,
				curIndex: 0,
			};
		},
		components: {
			videoPlay
		},
		props: {},
		//继续播放按钮图片

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.scene) {
				let url = decodeURIComponent(options.scene);
				options.video_id = url.split('=')[1];
			}

			options.activeIndex = options.video_id;
			this.setData({ ...options,
				videoUrl: [{
					video_id: options.video_id,
					ShowHide: 'hide'
				}]
			});
			this.initData();
			uni.createVideoContext('sldVideo_child').pause();
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
		},
		onShow() {
			this.ShowHide = 'show'
			// #ifdef H5
			if (this.videoUrl[this.curIndex].ShowHide == 'hide') {
				this.videoUrl[this.curIndex].ShowHide = 'show'
				setTimeout(()=>{
					let currentId = 'myVideo' + this.videoUrl[this.curIndex].video_id;
					let current_video = videojs(currentId)
					current_video.play();
				}, 900)
			}
			// #endif
			// #ifndef H5
			setTimeout(()=>{
				this.videoUrl[this.curIndex].ShowHide = 'show';
			}, 900)
			// #endif
		},
		onHide() {
			this.ShowHide = 'hide'
			
			// #ifdef H5
			let currentId = 'myVideo' + this.videoUrl[this.curIndex].video_id;
			let current_video = videojs(currentId)
			current_video.pause();
			// #endif
			// #ifndef H5
			this.videoUrl[this.curIndex].ShowHide = 'hide';
			// #endif
		},
		onUnload(){
			// #ifdef APP-PLUS
			uni.getSubNVueById('vidoePlayAppCon').hide();
			// #endif
			// 移除监听事件    
			uni.$off('goBack');
			uni.$off('forbidenHide'); 
			uni.$off('goGoodsDetail'); 
			uni.$off('goLiveUserCenter'); 
		},
		methods: {
			initData() {
				let {
					label_id,
					theme_id,
					author_id,
					type
				} = this;

				if (theme_id) {
					this.getAllVideoId(theme_id, 'theme_id');
				} else if (author_id) {
					this.getAllVideoId(author_id, 'author_id');
				} else if (type) {
					this.getAllVideoId(type, 'type');
				} else {
					this.getAllVideoId(label_id, 'label_id');
				}
			},

			getAllVideoId(id, type) {
				let url = getApp().globalData.svideo_url;
				let key = uni.getStorageSync('token');
				let params = {
					is_play: 1
				};

				switch (type) {
					case 'label_id':
						url += '/index.php?app=video&mod=index&label_id=' + id;
						break;

					case 'theme_id':
						url += '/index.php?app=video&mod=themeList&theme_id=' + id;
						break;

					case 'author_id':
						url += '/index.php?app=author&mod=getVideoList&author_id=' + id + "&key=" + key;
						break;

					case 'type':
						url += '/index.php?app=author&mod=getLikeVideoList&key=' + key;
						break;

					default:
						break;
				}

				url = url + '&is_play=' + 1;
				
				request({
					url
				}).then(res => {
					if (res.state == 200) {
						let ids = res.data.video_ids;
						if (ids.length > 1) {
							let {
								loadEnd,
								videoUrl,
								activeIndex,
								curIndex
							} = this;
							
							//去除当前视频
							let index = ids.indexOf(activeIndex);
							ids.splice(index, 1);
							
							if (ids.length) {
								ids.forEach(item=>{
									videoUrl.push({
										video_id: item,
										ShowHide: 'hide'
									});
								})
							}
							
							this.setData({
								loadEnd: true,
								videoUrl,
								videoId: ids,
								nextIndex: videoUrl[1].video_id
							});
							
							if(this.loadEnd) {
								setTimeout(()=>{ //需要等待一下视频渲染
									videoUrl[curIndex].ShowHide = 'show'
								}, 800)
							}
						} else {
							this.setData({
								loadEnd: true,
							});
							setTimeout(()=>{ //需要等待一下视频渲染
								videoUrl[curIndex].ShowHide = 'show'
							}, 800)
						}
						
					}
				});
			},

			animationfinish(e) {
				this.setData({
					curIndex: e.detail.current
				})
				let {
					curIndex,
					videoUrl
				} = this;
				// #ifdef H5
				let currentId = 'myVideo' + videoUrl[curIndex].video_id; // 获取当前视频id
				let current_video = videojs(currentId)
				current_video.play();
				// 获取视频列表
				videoUrl.forEach(item => { // 获取json对象并遍历, 停止非当前视频
					let pauseId = 'myVideo' + item.video_id;
					if (pauseId != currentId) {
						// 暂停其余视频
						let other_video = videojs(pauseId)
						other_video.pause();
						other_video.currentTime(0);
					}
				})
				// #endif
				// #ifndef H5
				let currentId = 'sldVideo_child' + videoUrl[curIndex].video_id; // 获取当前视频id
				videoUrl.forEach((item,index) => { // 获取json对象并遍历, 停止非当前视频
					let pauseId = 'sldVideo_child' + item.video_id;
					if (pauseId == currentId) {
						videoUrl[index].ShowHide = 'show';
					}else{
						videoUrl[index].ShowHide = 'hide';
					}
				})
				// #endif
			},
			
			//滑动切换短视频
			changeVideo(e) {
				let curIndex = e.detail.current;
				let {
					videoUrl,
					videoId
				} = this;
				
				if (curIndex >= 1) {
					this.selectComponent("#sldVideo_" + videoUrl[curIndex - 1].video_id).videoCon(false);
				}
				
				if (curIndex + 1 >= videoUrl.length - 1 && videoId.length > 0) {
					videoUrl.push({
						video_id: videoId.pop()
					});
				}

				let prevIndex = curIndex - 1 >= 0 ? videoUrl[curIndex - 1].video_id : '';
				let nextIndex = curIndex + 1 <= videoUrl.length - 1 ? videoUrl[curIndex + 1].video_id : '';
				this.setData({
					videoUrl: videoUrl,
					videoId: videoId,
					activeIndex: videoUrl[curIndex].video_id,
					prevIndex: prevIndex,
					nextIndex: nextIndex
				});
			},

			//视频暂停/继续播放事件
			videoPlayControl() {
				let {
					playFlag,
					showPauseBtn
				} = this;
				this.videoContext = uni.createVideoContext('sldVideo');

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
						this.videoContext.pause(); //暂停播放

						this.setData({
							showPauseBtn: false,
							playFlag: false,
							showBtnIcn: this.playBtnIcon
						});
					}
				} else {
					this.videoContext.play(); //开始播放

					this.setData({
						playFlag: true,
						showPauseBtn: false
					});
				}
			}

		}
	};
</script>
<style lang="scss">
	page{
		width: 750rpx;
		margin: 0 auto;
		position: relative;
	}
	
	.swiper {
		position: relative;
		width: 100%;
		/* 去除tabbar高度 */
		height: 100vh;
		background: #000000;
	
		.swiper-item {
			.info {
				z-index: 1;
				position: absolute;
				bottom: 60upx;
				color: white;
				text-indent: 1em;
				font-size: 30upx;
			}
	
			.audio {
				position: absolute;
				bottom: 20upx;
				z-index: 1;
				text-indent: 1em;
				color: white;
				font-size: 30upx;
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				@-webkit-keyframes move {
					0% {
						left: 100vw;
					}
	
					100% {
						left: -50vw;
					}
				}
	
				@-moz-keyframes move {
					0% {
						left: 100vw;
					}
	
					100% {
						left: -50vw;
					}
				}
	
				@-ms-keyframes move {
					0% {
						left: 100vw;
					}
	
					100% {
						left: -50vw;
					}
				}
	
				@keyframes move {
					0% {
						left: 100vw;
					}
	
					100% {
						left: -50vw;
					}
				}
				.text-group{
					position: relative;
					width: 50vw;
					height: 40upx;
				
					overflow: hidden;
					.text {
						position: absolute;
						top: 0upx;
						white-space: nowrap;
						/*文本不会换行，文本会在在同一行上继续*/
						-webkit-animation: 10s move infinite;
						-moz-animation: 10s move infinite;
						-ms-animation: 10s move infinite;
						animation: 10s move infinite;
						width: 50vw;
						left: 100vw;
					
					}
				}
				
	
				.icon {
					width: 60upx;
					height: 60upx;
					border-radius: 60upx;
					animation: turn 3s linear infinite;
					margin-right: 5vw;
					border: 10upx solid white;
				}
	
				/* 
					  turn : 定义的动画名称
					  1s : 动画时间
					  linear : 动画以何种运行轨迹完成一个周期
					  infinite :规定动画应该无限次播放
					 */
				@keyframes turn {
					0% {
						-webkit-transform: rotate(0deg);
					}
	
					25% {
						-webkit-transform: rotate(90deg);
					}
	
					50% {
						-webkit-transform: rotate(180deg);
					}
	
					75% {
						-webkit-transform: rotate(270deg);
					}
	
					100% {
						-webkit-transform: rotate(360deg);
					}
				}
			}
	
			.video {
				width: 100%;
				z-index: 0;
				height: calc(100vh - 120rpx);
			}
	
			.buttons {
				display: flex;
				flex-direction: column;
				position: absolute;
				right: 5vw;
				bottom: 12vh;
				color: white;
				text-align: center;
				justify-content: center;
				z-index: 1;
				.header_group{
					margin-bottom: 50upx;
					height: 90upx;
					width: 90upx;
					position: relative;
					.header{
						border: 2px solid white;
						margin: 0 auto;
						border-radius:90upx;
						height: 90upx;
						width: 90upx;
					}
					.add{
						position: absolute;
						bottom: -30upx;
						margin: 0 auto;
						right: 0upx;
						background-color: #f15b6c;
						left: 0upx;
						width: 50upx;
						height: 50upx;
						font-size: 50upx;
						line-height: 50upx;
						border-radius:50upx;
					}
				}
				
				.button {
					text-align: center;
					font-size: 25upx;
	
					.icon {
						margin: 20upx;
						width: 60upx;
					}
				}
			}
		}
	}
</style>
