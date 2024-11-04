<template>
	<view>
		<view class="release">
			<view class="release_header_bg" :style="'background: url('+img_url+'live/rbg.png)  no-repeat center;'">
				<view class="header_nav">
					<view class="go_back_wrap" @tap="goBack">
						<image class="go_back" :src="img_url+'white_arrow_l.png'"></image>
					</view>
					<text class="title">{{$L('发布')}}</text>
				</view>
			</view>
			<scroll-view class="release_main" scroll-y>
				<view class="title_part ">
					<view class="title_tag" :style="'background:url('+img_url+'live/title.png) no-repeat center;background-size:cover;'">
						<text class="title">{{$L('标题')}}</text>
					</view>
					<view class="title_wrap">
						<view class="left">
							<textarea class="input" data-type="live_name" :placeholder="$L('请输入名称，最多20字(必填)')"
							 placeholder-style="font-size:26rpx;color:#949494;z-index:1,zoom:1" :value="live_name" maxlength="20" @input="editData"
							 auto-height="true"></textarea>
						</view>
						<view class="right">
							<view v-if="cover == ''" class="cover" @tap="uploadCover">
								<image class="cover_icon" :src="img_url+'live/cover_icon.png'"></image>
							</view>
							<view class="cover" v-if="cover != ''">
								<image @tap="previewImage" class="cover_img" :src="cover.live_image_url" :data-cover="cover.live_image_url"></image>
								<image class="del_cover" @tap="delCover" :src="img_url+'live/del_cover.png'"></image>
							</view>
							<text class="cover_tip">{{$L('选封面(必填)')}}</text>
						</view>
					</view>
				</view>
				<view class="avator">
					<view class="left">
						<text class="con">{{$L('添加标签')}}</text>
						<image class="icon" :src="img_url+'live/tag.png'"></image>
					</view>
					<view class="right">
						<picker class="con" range-key="label_name" @change="seleLabel" :value="index" :range="label_list">
							<view class="picker">
								{{label_index?label_list[label_index]['label_name']:$L('请选择标签(必填)')}}
							</view>
						</picker>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view v-if="setting.live_virtual_click_num_switch == 1" class="avator">
					<view class="left">
						<text class="con">{{$L('虚拟观看')}}</text>
						<image class="icon" :src="img_url+'live/virtual.png'"></image>
					</view>
					<view class="right">
						<input type="number" data-type="virtual_click_num" name="talk_con" :value="virtual_click_num" class="talk_con con"
						 :placeholder="$L('最多输入1000000(选填)')" placeholder-style="font-size:24rpx;color:color: #949494;" @input="editData"
						 maxlength="7"></input>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view v-if="setting.live_virtual_like_num_switch == 1" class="avator">
					<view class="left">
						<text class="con">{{$L('虚拟人气')}}</text>
						<image class="icon" :src="img_url+'live/virtual.png'"></image>
					</view>
					<view class="right">
						<input type="number" data-type="virtual_like_num" name="talk_con" :value="virtual_like_num" class="talk_con con"
						 :placeholder="$L('最多输入1000000(选填)')" placeholder-style="font-size:24rpx;color:color: #949494;" @input="editData"
						 maxlength="7"></input>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>

				<view class="avator" :style="goods_lists.length > 0?'border-radius:15rpx 15rpx 0 0':'border-radius:15rpx'">
					<view class="left">
						<text class="con">{{$L('商品选择')}}</text>
						<image class="icon" :src="img_url+'live/product.png'"></image>
					</view>
					<view class="right" @tap="seleGoods">
						<text v-if="goods_lists.length == 0" class="con">{{$L('请选择')}}{{setting.live_bind_goods_num*1>0?$L(',最多选择')+setting.live_bind_goods_num*1+$L('件'):''}}{{$L('商品(选填)')}}</text>
						<view v-if="goods_lists.length > 0">
							<text class="text">{{$L('已选商品：')}}</text>
							<text class="text" style="color:#FC1C1C">{{goods_lists.length}}</text>
							<text v-if="setting.live_bind_goods_num*1>0" class="text">/{{setting.live_bind_goods_num*1}}</text>
						</view>
						<image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
					</view>
				</view>
				<!-- 商品列表item -->
				<view class="live_user_tab_content">
					<liveReleaseGoods :goodsData="goods_lists" :addCartIcon="img_url+'live/add_cart.png'" :eyeIcon="img_url+'live/eye.png'"
					 @delGoods="delGoods" />
				</view>
			</scroll-view>
			<view class="live_btn">
				<text v-if="live_name==''||label_index==''||cover==''" class="live_btn_text">{{$L('开始直播')}}</text>
				<text v-if="!(live_name==''||label_index==''||cover=='')" style="background:linear-gradient(90deg,rgba(255,38,65,1) 0%,rgba(255,122,0,1) 100%);box-shadow:0px 3px 10px 0px rgba(255,13,0,0.26);"
				 @tap="startLive" class="live_btn_text">{{$L('开始直播')}}</text>
			</view>
			<image-cropper v-if="showCropper" id="image-cropper" limit_move="true" disable_rotate="true" :width="width" :height="height"
			 :imgSrc="cover.live_image_url" @load="cropperload" @tapcut="clickcut" quality="0.9" @parentEvent="operateCropperImg"></image-cropper>
		</view>
	</view>
</template>

<script>
	import request from "@/utils/request";
	const bus = getApp().globalData.bus;
	import imageCropper from "@/component/imageCropper/image-cropper";
	import liveReleaseGoods from "@/addons/templates/live/liveReleaseGoods.vue";

	export default {
		components: {
			liveReleaseGoods,
		},
		data() {
			return {
				img_url: getApp().globalData.img_url,
				//图片地址
				bgStyle: 'background-size:contain;background-position:top center;background-repeat: no-repeat;',
				//背景图片样式
				cover: '',
				//封面信息
				virtual_click_num: '',
				//虚拟观看数
				virtual_like_num: '',
				//虚拟人气数
				live_name: '',
				//标题
				label_list: '',
				//标签列表
				label_index: '',
				//标签数组角标
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
				showCropper: false //是否显示裁剪框，默认不显示
					,
				type: ""
			};
		},

		components: {
			imageCropper
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('发布直播')
      });
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

				uni.navigateBack({
					success: function() {
						if (beforePage.route.indexOf('liveUserCenter') != -1 && beforePage.curTab == 'live') {
							beforePage.$vm.changeTab('goods', true);
							beforePage.$vm.changeTab('live', true);
						}
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
							url: getApp().globalData.svideo_url + "/index.php?app=live&mod=uploadLiveImage",
							filePath: res.tempFilePaths[0],
							name: 'live_image',
							formData: {
								key: key,
								filename: 'live_image'
							},
							success: resup => {

								resup = JSON.parse(resup.data);
								if (resup.state == 200) {
									// //获取到image-cropper实例
									this.setData({
										cover: resup.data
									});
									this.cropper = this.selectComponent("#image-cropper");
									this.setData({
										showCropper: true
									});
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
				request({
					url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getValidLabel&type=2'
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
				this.setData({
					label_index: e.detail.value
				});
			},

			//开始直播
			startLive() {
				let {
					live_name,
					cover,
					label_index,
					virtual_click_num,
					virtual_like_num,
					label_list,
					goods_ids
				} = this;

				if (live_name == '') {
					uni.showToast({
						title: this.$L('请输入标题'),
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

				if (label_index == '') {
					uni.showToast({
						title: this.$L('请选择直播标签'),
						icon: 'none'
					});
					return;
				}

				let params = {
					live_image: cover.live_image,
					label_id: label_list[label_index]['label_id'],
					key: uni.getStorageSync('token'),
					live_name: live_name,
					virtual_click_num: virtual_click_num,
					virtual_like_num: virtual_like_num
				};

				if (goods_ids.length) {
					// 商品是可选的
					goods_ids.forEach((el, i) => {
						params[`goods_ids[${i}]`] = el;
					});
				}

				request({
					url: getApp().globalData.svideo_url + '/index.php?app=live&mod=save',
					method: 'POST',
					data: params
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});

					if (res.state == 200) {
						//直播作者直播动态页面
						request({
							url: getApp().globalData.svideo_url + '/index.php?app=live&mod=saveLiveUrl',
							method: 'POST',
							data: {
								key: uni.getStorageSync('token'),
								live_id: res.data.live_id
							}
						}).then(res_rmtp => {
							uni.showToast({
								title: res_rmtp.msg,
								icon: 'none'
							});

							if (res_rmtp.state == 200) {
								uni.navigateTo({
									url: '../livePush/livePush?live_id=' + res.data.live_id + '&pushurl=' + encodeURIComponent(res_rmtp.data
										.pushurl) + '&backGrade=2'
								});
							} else {
								return false;
							}
						});
					} else {
						return false;
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
				params.max_num = setting.live_bind_goods_num * 1;
				uni.navigateTo({
					url: '../liveSeleGoods/liveSeleGoods?params=' + JSON.stringify(params)
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
						url: getApp().globalData.svideo_url + "/index.php?app=live&mod=uploadLiveImage",
						filePath: data.url,
						name: 'live_image',
						formData: {
							key: uni.getStorageSync('token'),
							filename: 'live_image'
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
	/* addons/pages/liveReleaseLive/liveReleaseLive.wxss */

	page {
		background: #f8f8f8;
	}

	.release {
		position: relative;
	}

	.release_header_bg {
		width: 750rpx;
		height: 407rpx;
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
		position: fixed;
		top: 160rpx;
		left: 0;
		right: 0;
		height: calc(100vh - 270rpx);
		z-index: 2;
	}

	.release_main .title_part {
		width: 690rpx;
		height: 240rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 15px 0px rgba(86, 86, 86, 0.1);
		border-radius: 15px;
		margin-left: 20rpx;
		padding: 20rpx 0 20rpx 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
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
		height: 164rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.release_main .title_part .title_wrap .left {
		width: 465rpx;
		height: 100%;
		border-right: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	.release_main .title_part .title_wrap .left .input {
		margin-top: 20rpx;
		color: #2d2d2d;
		font-size: 32rpx;
		width: 445rpx;
	}

	.release_main .title_part .title_wrap .right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.release_main .title_part .title_wrap .right .cover {
		width: 125rpx;
		height: 125rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.release_main .title_part .title_wrap .right .cover .cover_img {
		width: 125rpx;
		height: 125rpx;
		border-radius: 15rpx;
	}

	.release_main .title_part .title_wrap .right .cover .del_cover {
		width: 45rpx;
		height: 45rpx;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 2;
	}

	.release_main .title_part .title_wrap .right .cover .cover_icon {
		width: 37rpx;
		height: 36rpx;
	}

	.release_main .title_part .title_wrap .right .cover_tip {
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
		padding-left: 85rpx;
		position: fixed;
		z-index: 3;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f8f8f8;
		height: 110rpx;
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
		margin: 20rpx 0;
	}
</style>
