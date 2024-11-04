<template>
	<view>
		<view class="release">
			<!-- <view class="release_header_bg" :style="'background: url('+img_url+'svideo/rbg.png) no-repeat center;'">
				<view class="header_nav">
					<view class="go_back_wrap" @tap="goBack">
						<image class="go_back" :src="img_url+'white_arrow_l.png'"></image>
					</view>
					<text class="title">发布</text>
				</view>
			</view> -->
			<scroll-view class="release_main" scroll-y>
				<view class="title_part ">
					<view class="title_tag" :style="'background:url('+img_url+'live/title.png'+') no-repeat center;background-size:cover;'">
						<text class="title">{{$L('标题')}}</text>
					</view>
					<view class="title_wrap">
						<view class="top">
							<textarea class="input" data-type="live_name" :placeholder="$L('请输入名称，最多20字(必填)')" placeholder-style="font-size:26rpx;color:#949494;z-index:1,zoom:1"
							 :value="live_name" maxlength="20" @input="editData" auto-height="true"></textarea>
						</view>
						<view class="bottom">
							<view class="left">
								<view v-if="upload_video == ''" class="cover" @tap="uploadVideo">
									<image class="cover_icon" :src="img_url+'svideo/upload_video_icon.png'"></image>
									<text class="cover_tip">{{$L('上传短视频(必填)')}}</text>
								</view>
								<view class="cover" v-if="upload_video != ''">
									<video class="cover_img" autoplay muted id="myVideo" :src="upload_video.video_url" show-center-play-btn="false"
									 show-play-btn="true" controls :picture-in-picture-mode="['push', 'pop']"></video>
									<image class="del_cover" @tap="delVideo" :src="img_url+'live/del_cover.png'"></image>
								</view>
							</view>
							<view class="right">
								<view v-if="cover == ''" class="cover" @tap="uploadCover">
									<image class="cover_icon" :src="img_url+'live/cover_icon.png'"></image>
									<text class="cover_tip">{{$L('选封面(必填)')}}</text>
								</view>
								<view class="cover" v-if="cover != ''">
									<image @tap="previewImage" class="cover_img" :src="cover.video_url" :data-cover="cover.video_url"></image>
									<image class="del_cover" @tap="delCover" :src="img_url+'live/del_cover.png'"></image>
								</view>

							</view>
						</view>
					</view>
				</view>

				<view class="desc">
					<text class="title">{{$L('视频简介')}}</text>
					<textarea class="desc_con" data-type="video_desc" :placeholder="$L('请输入名称，最多20字(必填)')" placeholder-style="font-size:26rpx;color:#949494;z-index:1,zoom:1"
					 :value="video_desc" maxlength="30" @input="editData" auto-height="true"></textarea>
				</view>

				<view class="avator">
					<view class="left">
						<text class="con">{{$L('添加标签')}}</text>
						<image class="icon" :src="img_url+'live/tag.png'"></image>
					</view>
					<view class="right">
						<!-- <picker class="con" range-key="label_name" @change="seleLabel" :value="index" :range="label_list"> -->
						<picker class="con" range-key="label_name" @change="seleLabel" :range="label_list">
							<view class="picker">
								{{selectLabel.label_id != undefined && selectLabel.label_id?selectLabel.label_name:$L('请选择标签(必填)')}}
							</view>
						</picker>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view v-if="setting.video_virtual_click_num_switch == 1" class="avator">
					<view class="left">
						<text class="con">{{$L('虚拟播放')}}</text>
						<image class="icon" :src="img_url+'live/virtual.png'"></image>
					</view>
					<view class="right">
						<input type="number" data-type="virtual_click_num" name="talk_con" :value="virtual_click_num" class="talk_con con"
						 :placeholder="$L('最多输入1000000(选填)')" placeholder-style="font-size:24rpx;color:color: #949494;" @input="editData"
						 maxlength="7"></input>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view v-if="setting.video_virtual_like_num_switch == 1" class="avator">
					<view class="left">
						<text class="con">{{$L('虚拟点赞')}}</text>
						<image class="icon" :src="img_url+'live/virtual.png'"></image>
					</view>
					<view class="right">
						<input type="number" data-type="virtual_like_num" name="talk_con" :value="virtual_like_num" class="talk_con con"
						 :placeholder="$L('最多输入1000000(选填)')" placeholder-style="font-size:24rpx;color:color: #949494;" @input="editData"
						 maxlength="7"></input>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view class="avator" v-if="setting.member_bind_goods == 1" :style="goods_lists.length > 0?'border-radius:15rpx 15rpx 0 0':'border-radius:15rpx'">
					<view class="left">
						<text class="con">{{$L('商品选择')}}</text>
						<image class="icon" :src="img_url+'live/product.png'"></image>
					</view>
					<view class="right" @tap="seleGoods">
						<text v-if="goods_lists.length == 0" class="con">{{$L('请选择')}}{{setting.bind_goods_num*1>0?$L(',最多选择')+setting.bind_goods_num*1+$L('件'):''}}{{$L('商品(选填)')}}</text>
						<view v-if="goods_lists.length > 0">
							<text class="text">{{$L('已选商品：')}}</text>
							<text class="text" style="color:#FC1C1C">{{goods_lists.length}}</text>
							<text v-if="setting.live_bind_goods_num*1>0" class="text">/{{setting.bind_goods_num*1}}</text>
						</view>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>
				<!-- 商品列表item -->
				<view class="live_user_tab_content">
					<videoReleaseGoods :goodsData="goods_lists" :addCartIcon="img_url+'live/add_cart.png'" :eyeIcon="img_url+'live/eye.png'"
					 @delGoods="delGoods" />
				</view>
			</scroll-view>
			<view class="live_btn">
				<text v-if="live_name==''||(selectLabel.label_id == undefined)||cover==''||video_desc==''||upload_video==''" class="live_btn_text">{{$L('发布')}}</text>
				<text v-if="!(live_name==''||(selectLabel.label_id == undefined)||cover==''||video_desc==''||upload_video=='')"
				 style="background:linear-gradient(90deg,rgba(255,38,65,1) 0%,rgba(255,122,0,1) 100%);box-shadow:0px 3px 10px 0px rgba(255,13,0,0.26);"
				 @tap="startLive" class="live_btn_text">{{$L('发布')}}</text>
			</view>
			<image-cropper v-if="showCropper" id="image-cropper" :limit_move="true" :disable_rotate="true" :width="width" :height="height"
			 :imgSrc="cover.video_url" @load="cropperload" @tapcut="clickcut" :quality="0.9" @parentEvent="operateCropperImg"></image-cropper>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	import imageCropper from "@/component/imageCropper/image-cropper";
	import videoReleaseGoods from "@/addons/templates/svideo/videoReleaseGoods.vue";

	const bus = getApp().globalData.bus;

	export default {
		components: {
			videoReleaseGoods,
			imageCropper
		},
		data() {
			return {
				img_url: getApp().globalData.img_url,
				//图片地址
				bgStyle: 'background-size:cover;background-position:top center;background-repeat: no-repeat;',
				//背景图片样式
				cover: '',
				//封面信息
				upload_video: '',
				//上传的短视频
				virtual_click_num: '',
				//虚拟观看数
				virtual_like_num: '',
				//虚拟人气数
				live_name: '',
				//标题
				video_desc: '',
				//视频简介
				label_list: [],
				//标签列表
				selectLabel: {},
				goods_ids: [],
				//已选商品的id数组
				goods_lists: [],
				//已选的商品
				setting: '',
				//平台设置信息
				width: 300,
				//裁剪的图片宽度
				height: 300,
				//裁剪的图片高度
				showCropper: false,
				//是否显示裁剪框，默认不显示
				video_id: '' //短视频id，编辑短视频用
					,
				type: ""
			};
		},

		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('发布短视频')
      });
			if (options.video_id) {
				this.setData({
					video_id: options.video_id
				});
				this.getVideoDetail();
			}

			this.initData();
		},
		onShow: function() {},
		methods: {
			//更新选择的商品
			updateData(data) {
				this.setData({
					goods_ids: data.goods_ids,
					goods_lists: data.goodsList
				});
			},

			initData() {
				this.getLableList();
				this.getSetting();
			},

			// 返回上级页面 
			goBack() {
				const pages = getCurrentPages(); //获取页面栈

				const beforePage = pages[pages.length - 2]; //前一个页面
                beforePage.$vm.getAuthorInfo()
				uni.navigateBack({
					success: function() {
						if (beforePage.route.indexOf('liveUserCenter') != -1 && beforePage.$vm.curTab == 'video') {
							beforePage.$vm.changeTab('goods', true);
						}
						if(beforePage.$vm.getAuthorInfo){
							beforePage.$vm.getAuthorInfo()
						}
						
					}
				});
			},

			//获取短视频详情
			getVideoDetail() {
				let {
					video_id
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=editVideoInfo&video_id=' + video_id + '&key=' + uni.getStorageSync(
						'token')
				}).then(res => {
					if (res.state == 200) {
						let info = res.data.video;
						let goodsList = res.data.goods_list;
						let goods_ids = goodsList.map(el => el.gid);
						this.setData({
							upload_video: {
								video_url: info.video_path,
								video_path: info.video_path_str
							},
							//上传的视频信息
							cover: {
								video_url: info.video_image,
								video_path: info.video_image_str
							},
							// 封面图片
							live_name: info.video_name,
							video_desc: info.introdution,
							selectLabel: {
								label_name: info.label_name,
								label_id: info.label_id
							},
							// 已选标签
							goods_lists: goodsList,
							goods_ids: goods_ids,
							virtual_click_num: info.virtual_click_num * 1 > 0 ? info.virtual_click_num : '',
							virtual_like_num: info.virtual_like_num * 1 > 0 ? info.virtual_like_num : ''
						});
					}
				});
			},

			// 上传短视频
			uploadVideo() {
				let {
					upload_video
				} = this;
				let that = this;
				let key = uni.getStorageSync('token');
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					compressed: true,
					//默认压缩
					maxDuration: 60,
					camera: 'back',

					success(res) {
						uni.uploadFile({
							url: getApp().globalData.svideo_url + "/index.php?app=author&mod=uploadVideo",
							filePath: res.tempFilePath,
							name: 'video_path',
							formData: {
								key: key,
								filename: 'video_path'
							},
							success: resup => {
								resup = JSON.parse(resup.data);

								if (resup.state == 200) {
									that.setData({
										upload_video: resup.data
									});
								}
							}
						});
					}

				});
			},

			// 选封面
			uploadCover() {
				let {
					cover
				} = this;
				let key = uni.getStorageSync('token');
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					//可选择原图或压缩后的图片
					sourceType: ['album', 'camera'],
					//可选择性开放访问相册、相机
					success: res => {
						uni.uploadFile({
							url: getApp().globalData.svideo_url + "/index.php?app=author&mod=uploadVideoImage",
							filePath: res.tempFilePaths[0],
							name: 'video_image',
							formData: {
								key: key,
								filename: 'video_image'
							},
							success: resup => {
								resup = JSON.parse(resup.data);

								if (resup.state == 200) {
									// //获取到image-cropper实例
									this.setData({
										cover: resup.data
									});
									// this.cropper = this.selectComponent("#image-cropper");
									// this.setData({
									// 	showCropper: true
									// });
								}
							}
						});
					}
				});
			},

			//删除封面
			delCover() {
				this.setData({
					cover: ''
				});
			},

			//删除视频
			delVideo() {
				this.setData({
					upload_video: ''
				});
			},

			//编辑内容
			editData(e) {
				let type = e.currentTarget.dataset.type;
				let data = e.detail.value * 1;

				if (type == 'virtual_click_num' || type == 'virtual_like_num') {
					if (data <= 1000000) {
						this.setData({
							[type]: e.detail.value
						});
					} else {
						this.setData({
							[type]: 1000000
						});
					}
				} else {
					this.setData({
						[type]: e.detail.value
					});
				}
			},

			// 获取标签列表
			getLableList() {
				let {
					selectLabel
				} = this;
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getValidLabel'
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							label_list: res.data.label
						});
					}
				});
			},

			// 获取设置信息
			getSetting() {
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getSetting&key=' + uni.getStorageSync('token')
				}).then(res => {
					if (res.state == 200) {
						this.setData({
							setting: res.data.setting
						});
					}
				});
			},

			//选择标签
			seleLabel(e) {
				const {
					label_list
				} = this;
				this.setData({
					selectLabel: label_list[e.detail.value]
				});
			},

			//开始直播
			startLive() {
				let {
					live_name,
					cover,
					upload_video,
					video_desc,
					virtual_click_num,
					virtual_like_num,
					label_list,
					goods_ids,
					selectLabel,
					setting,
					video_id
				} = this;

				if (live_name == '') {
					uni.showToast({
						title: this.$L('请输入标题'),
						icon: 'none'
					});
					return;
				}

				if (upload_video == '') {
					uni.showToast({
						title: this.$L('请上传短视频'),
						icon: 'none'
					});
					return;
				}

				if (cover == '') {
					uni.showToast({
						title: this.$L('请上传封面图片'),
						icon: 'none'
					});
					return;
				}

				if (video_desc == '') {
					uni.showToast({
						title: this.$L('请输入视频简介'),
						icon: 'none'
					});
					return;
				}

				if (selectLabel.label_id == undefined) {
					uni.showToast({
						title: this.$L('请选择视频标签'),
						icon: 'none'
					});
					return;
				}

				let params = {
					video_image: cover.video_path,
					video_path: upload_video.video_path,
					video_name: live_name,
					introdution: video_desc,
					label_id: selectLabel.label_id,
					key: uni.getStorageSync('token'),
					virtual_click_num: virtual_click_num,
					virtual_like_num: virtual_like_num
				};

				if (video_id > 0) {
					params.video_id = video_id;
				}

				if (goods_ids.length && setting.member_bind_goods == 1) {
					// 商品是可选的
					goods_ids.forEach((el, i) => {
						params[`goods_ids[${i}]`] = el;
					});
				}

				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=saveVideo',
					method: 'POST',
					data: params
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});

					if (res.state == 200) {
						//返回上级页面并更新上一页数据
						this.goBack();
					}
				});
			},

			//选择商品
			seleGoods() {
				let params = {};
				let {
					goods_ids,
					goods_lists,
					setting
				} = this;
				params.goods_ids = goods_ids;
				params.max_num = setting.bind_goods_num * 1;
				uni.navigateTo({
					url: '../svideoSeleGoods/svideoSeleGoods?params=' + JSON.stringify(params)
				});
			},

			//删除商品
			delGoods(e) {
				let gid = e.gid;
				const {
					goods_lists,
					goods_ids
				} = this;
				let index = goods_ids.findIndex(el => el == gid);
				let index2 = goods_lists.findIndex(el => el.gid == gid);
				goods_ids.splice(index, 1);
				goods_lists.splice(index2, 1);
				this.setData({
					goods_lists,
					goods_ids
				});
			},

			//图片预览
			previewImage(e) {
				let url = e.currentTarget.dataset.cover;
				uni.previewImage({
					urls: [url]
				});
			},

			cropperload(e) {
			},

			clickcut(e) {
				//点击裁剪框阅览图片
				uni.previewImage({
					current: e.detail.url,
					// 当前显示图片的http链接
					urls: [e.detail.url] // 需要预览的图片http链接列表

				});
			},

			// 当自定义组件触发 parentEvent 事件时，调用 operateCropperImg 方法
			operateCropperImg: function(event) {
				// 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
				let data = event.detail;

				if (data.type == 'cancle') {
					this.setData({
						cover: '',
						showCropper: false
					});
				} else {
					uni.showLoading({
						title: ''
					}); //上传最后的裁剪图片

					uni.uploadFile({
						url: getApp().globalData.svideo_url + "/index.php?app=author&mod=uploadVideoImage",
						filePath: data.url,
						name: 'video_image',
						formData: {
							key: uni.getStorageSync('token'),
							filename: 'video_image'
						},
						success: resup => {
							resup = JSON.parse(resup.data);

							if (resup.state == 200) {
								uni.hideLoading();
								this.setData({
									cover: resup.data,
									showCropper: false
								});
							}
						}
					});
				}
			}
		}
	};
</script>
<style>
	page {
		background: #f8f8f8;
		width: 750rpx;
		margin: 0 auto;
	}

	.release {
		position: relative;
	}

	.release_header_bg {
		width: 750rpx;
		height: 462rpx;
	}

	.header_nav {
		position: absolute;
		top: 80rpx;
		left: 20rpx;
		right: 0;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80rpx;
	}

	.header_nav .go_back_wrap {
		position: absolute;
		left: 0;
		width: 80rpx;
		height: 47rpx;
	}

	.header_nav .go_back {
		width: 45rpx;
		height: 47rpx;
	}

	.header_nav .title {
		color: #fff;
		font-size: 34rpx;
		font-weight: bold;
	}

	.release_main {
		width: 750rpx;
		position: fixed;
		top: 150rpx;
	    /* #ifdef MP-WEIXIN ||APP-PLUS */
		top: 25rpx;
		 /* #endif */
		left: 0;
		right: 0;
		height: calc(100vh - 270rpx);
		/* #ifdef MP-WEIXIN ||APP-PLUS */
		height: calc(100vh - 130rpx);
		 /* #endif */
		z-index: 2;
		margin: 0 auto;
	}

	.release_main .title_part {
		width: 690rpx;
		height: 400rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 15px 0px rgba(86, 86, 86, 0.1);
		border-radius: 15px;
		margin-left: 20rpx;
		padding: 20rpx 0 20rpx 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		box-sizing: content-box;
	}

	.release_main .title_part .title_tag {
		width: 131rpx;
		height: 50rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: -32rpx;
	}

	.release_main .title_part .title_tag .title {
		font-size: 32rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 32rpx;
	}

	.release_main .title_part .title_wrap {
		width: 100%;
		height: 340rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}

	.release_main .title_part .title_wrap .top {
		width: 100%;
		margin-top: 23rpx
	}

	.release_main .title_part .title_wrap .top textarea {
		width: 100%;
		padding-left: 11rpx;
		color: #2D2D2D;
		font-size: 30rpx;
	}

	.release_main .title_part .title_wrap .bottom {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.release_main .title_part .title_wrap .bottom .left {
		/* width: 345rpx; */
		height: 257rpx;
		border-right: 1rpx solid rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 11rpx;
	}

	.release_main .title_part .title_wrap .bottom .left .cover {
		width: 345rpx;
		height: 257rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		flex-shrink: 0;
		margin-right: 25rpx;
	}

	.release_main .title_part .title_wrap .bottom .left .cover .cover_icon {
		width: 80rpx;
		height: 80rpx;
	}

	.release_main .title_part .title_wrap .bottom .left .cover .cover_img {
		width: 345rpx;
		height: 257rpx;
		border-radius: 15rpx;
	}

	.release_main .title_part .title_wrap .bottom .right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.release_main .title_part .title_wrap .bottom .right .cover {
		width: 257rpx;
		height: 256rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.release_main .title_part .title_wrap .bottom .right .cover .cover_img {
		width: 257rpx;
		height: 256rpx;
		border-radius: 15rpx;
	}

	.release_main .title_part .title_wrap .bottom .right .cover .del_cover,
	.release_main .title_part .title_wrap .bottom .left .cover .del_cover {
		width: 45rpx;
		height: 45rpx;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 2;
	}

	.release_main .title_part .title_wrap .bottom .right .cover .cover_icon {
		width: 80rpx;
		height: 80rpx;
	}

	.release_main .title_part .title_wrap .bottom .right .cover_tip,
	.release_main .title_part .title_wrap .bottom .left .cover_tip {
		font-size: 24rpx;
		color: #949494;
		line-height: 32rpx;
		margin-top: 15rpx;
	}

	.release_main .avator {
		background: #fff;
		width: 670rpx;
		height: 50rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		margin-left: 20rpx;
		border-radius: 15rpx;
		box-sizing: content-box;
	}

	.release_main .avator .left {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.release_main .avator .left .con {
		color: #2d2d2d;
		font-size: 32rpx;
	}

	.release_main .avator .left .icon {
		width: 47rpx;
		height: 47rpx;
	}

	.release_main .avator .right {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
		overflow: hidden;
	}

	.release_main .avator .right .con {
		color: #949494;
		font-size: 24rpx;
		text-align: right;
	}

	.release_main .avator .right .text {
		color: #2d2d2d;
		font-size: 24rpx;
		text-align: right;
	}

	.release_main .avator .right .img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
	}

	.release_main .avator .right .arrow_r {
		width: 40rpx;
		height: 42rpx;
		margin-left: 6rpx;
	}

	.live_btn {
		/* padding-left: 85rpx; */
		position: fixed;
		z-index: 3;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f8f8f8;
		height: 110rpx;
		width: 750rpx;
		margin: 0 auto;
	}

	.live_btn .live_btn_text {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		line-height: 32rpx;
		width: 580rpx;
		height: 70rpx;
		background: #aaa;
		border-radius: 35rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 20rpx auto;
	}

	.desc {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 710rpx;
		height: 160rpx;
		background: #fff;
		border-radius: 8rpx;
		margin: 20rpx 0 0 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.desc .title {
		color: #2D2D2D;
		font-size: 32rpx;
	}

	.desc .desc_con {
		color: #949494;
		font-size: 28rpx;
		line-height: 32rpx;
		margin-top: 10rpx;
		width: 100%;
	}
</style>
