<template>
	<view>
		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap && show">
			<view class="share-mode">
				<view class="share-img">
					<image :src="shareImg" mode="widthFix"></image>
				</view>
				<!-- #ifdef  MP-WEIXIN -->
				<view class="ul">
					<view class="item" @tap="downloadImg">
						<image :src="img_url + 'hb_share.png'" mode="widthFix"></image>
						<text>{{$L('下载海报')}}</text>
					</view>
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
					<image src="/static/images/share_close2.png" mode="aspectFit"></image>
				</view>
				<!-- #endif -->
			</view>
		</view>

		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap2 && show">
			<view class="share-mode">

				<view class="share-img"></view>

				<view class="ul">
					<!-- #ifdef  MP-WEIXIN -->
					<button open-type="share" class="item">
						<image :src="img_url+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<!-- #endif -->
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
					<view class="item" @tap="createhb">
						<image :src="img_url+'createhb.png'" mode="widthFix"></image>
						<text>{{$L('生成海报')}}</text>
					</view>
				</view>

				<view class="close" @tap="closeShare">
					<image src="/static/images/share_close2.png" mode="aspectFit"></image>
				</view>

			</view>
		</view>
		<view class="wx_brower_share_mask" v-if="showWeiXinBrowerTip">
			<view class="wx_brower_share_top_wrap">
				<image :src="img_url+'wx_share_tip.png'" mode="widthFix" @tap="closeShare" class="wx_brower_share_img"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../utils/request";

	export default {
		data() {
			return {
				shareWrap: false,
				shareWrap2: true,
				shareImg: '',
				img_url: getApp().globalData.img_url,
				shareId: "",
				isWeiXinBrower: false, //是否微信浏览器
				showWeiXinBrowerTip: false, //微信浏览器分享的提示操作
			};
		},

		components: {},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			gid: {
				type: String,
				optionalTypes: [String, Number],
				default: ''
			},
			goodsInfo: {
				type: Object,
				default: () => ({})
			},
			goodsData: {
				type: Object,
				default: () => ({})
			}
		},

		mounted() {
			const shareId = uni.getStorageSync('ssys_share_code');
			this.setData({
				shareId: shareId
			});
			// #ifdef H5	
			this.isWeiXinBrower = this.$isWeiXinBrower();
			// #endif
		},

		methods: {
			touchmoveshare() {
				return false;
			},

			closeShare() {
				this.setData({
					shareWrap: false,
					shareWrap2: true,
					showWeiXinBrowerTip: false, //微信浏览器提示层
				});
				this.$emit('close');
			},

			createhb() {
				// const {
				//   gid
				// } = this.properties;
				const {
					shareId,
					gid
				} = this;
				let client = 'h5';
				//#ifdef MP-WEIXIN
				client = 'wx_xcx';
				//#endif
				//#ifdef APP-PLUS
				client = 'app';
				//#endif
				request({
					url: getApp().globalData.ser_url + '/index.php?app=ssys_goods&mod=shareimg&sld_addons=spreader',
					data: {
						gid: gid,
						shareId: shareId,
						client: client,
						ssys_key: uni.getStorageSync('ssys_key')
					}
				}).then(res => {
					if (res.status == 200) {
						this.setData({
							shareImg: res.img,
							shareWrap: true,
							shareWrap2: false
						});
					}
				});
			},

			downloadImg() {
				let {
					shareImg
				} = this;
        let _this = this;
				uni.downloadFile({
					url: shareImg,
					success: res => {
						if (res.statusCode == 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: result => {
									if (result.errMsg == 'saveImageToPhotosAlbum:ok') {
										uni.showToast({
											title: _this.$L('已保存到本地')
										});
										this.closeShare();
									} else {
										uni.showToast({
											title: _this.$L('保存失败'),
											icon: 'none'
										});
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

			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare(type, scene) {
				let {
					goodsData,
					shareImg,
					goodsInfo
				} = this;
				let shareData = {};
				if (type == 0) {
					shareData.href = getApp().globalData.h5_url +  goodsInfo.path;
					shareData.title = goodsData.goods_name;
					shareData.summary = goodsData.goods_jingle;
					shareData.imageUrl = goodsData.share_link;
				} else if (type == 2) {
					shareData.imageUrl = shareImg;
				}
				this.$weiXinAppShare(type, scene, shareData,this.gid,uni.getStorageSync('ssys_key'));
				this.closeShare(); //关闭分享
			},

			//浏览器分享
			sldShareBrower() {	
				if (this.isWeiXinBrower) {
					let {
						goodsData,
						shareImg,
						goodsInfo
					} = this;
					//展示分享提示
					this.showWeiXinBrowerTip = true;
					this.shareWrap2 = false;
					//微信浏览器分享
					this.$weiXinBrowerShare(1, {
						title: goodsData.goods_name,
						desc: goodsData.goods_jingle,
						link: goodsData.share_link,
						imgUrl: goodsData.goods_image,
					},true);
				}
			}

		}
	};
</script>
<style>
	.select-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 9999;
		right: 0;
	    margin: 0 auto;
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
</style>
