<template>
	<view>
		<view class="tuiguang" :style="'background-image:url('+tuiguang_info.fenxiao_pic+');'">
		</view>
		<common :title="$L('我要推广')"></common>
		<!-- #ifdef  APP-PLUS -->
		<view class="select-wrap" catchtouchmove="touchmoveshare" v-if="shareWrap">
			<view class="share-mode">
				<view class="share-img"></view>
				<view class="ul">
					<button @tap.stop="sldShare(0,'WXSceneSession')" class="item" >
						<image :src="imgUrl+'wx_share.png'" mode="widthFix"></image>
						<text>{{$L('微信好友')}}</text>
					</button>
					<button @tap.stop="sldShare(0,'WXSenceTimeline')" class="item" >
						<image :src="imgUrl+'pyq_share.png'" mode="widthFix"></image>
						<text>{{$L('微信朋友圈')}}</text>
					</button>
				</view>
				<view class="close" @tap="closeShare">
					<image src="../../static/images/share_close2.png"></image>
				</view>
		
			</view>
		</view>
		
		<!-- #endif -->	
		<!-- #ifdef  H5 -->
		<view class="mask" v-if="showShare">
			<view class="h5_app_container">
				<block  v-if="!iswx">
					<view class="erwei_con">
						<image :src="tuiguang_info.h5_qrcode" @longtap="bc_code" mode="widthFix"></image>
					</view>
					<image class="fx_share_code" :src="imgUrl+'fx_share_code.png'" mode="widthFix"></image>
				</block>
				<block v-if="iswx">
					<view class="erwei_con1">
						<image :src="imgUrl+'wx_share_tip.png'" mode="widthFix" @tap="closeShare" class="weixin_h5_img"></image>
					</view>
				</block>
				<view class="share_close"  @tap="closeShare" v-if="!iswx">
					<image :src="imgUrl+'share_close.png'" mode="widthFix"></image>
				</view>
				
			</view>
		</view>
		<!-- #endif -->	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tuiguang_info: {},
				imgUrl: getApp().globalData.img_url,
				erwei: '',
				showShare: false,
				shareWrap:false,
				iswx: false,
			};
		},

		components: {},
		props: {},
		onNavigationBarButtonTap: function(e) {
			// #ifdef APP-PLUS 
			this.shareWrap = true;
			// #endif
			// #ifdef H5
			if(this.iswx){
				// 微信浏览器分享
				this.$weiXinBrowerShare(1,{
					 title: this.tuiguang_info.title,
					 desc: this.tuiguang_info.description,
					 link:this.tuiguang_info.redirect_url,
					 imgUrl:this.tuiguang_info.fenxiao_pic,
				});
				this.showShare = true
			}else{
				this.showShare = true
			}
			// #endif
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('推广中心')
      });
			let that = this;
			var key = uni.getStorageSync('token');
			let client = '';
			//#ifdef APP-PLUS
			client = 'app';
			//#endif
			//#ifdef MP-WEIXIN
			client = 'wx_xcx';
			//#endif
			//#ifdef H5
			if(this.$isWeiXinBrower()){
				client = 'h5';
			}else{
				client = 'h5';
			}
			this.iswx = this.$isWeiXinBrower();
			//#endif
			uni.request({
				url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getFenxiaoCommon',
				data: {
					key,
					client: client
				},
				dataType: 'json',
				success: res => {
					if (res.data.code == 200) {
						if (!res.data.datas.fenxiao_pic) {
							res.data.datas.fenxiao_pic = this.imgUrl + 'tuiguang_bg.png';
						}

						this.setData({
							tuiguang_info: res.data.datas,
						});
					}
				},
				error: function(err) {
				}
			});
		},
		onShareAppMessage: function() {
			return {
				title: this.tuiguang_info.title,
				path: this.tuiguang_info.redirect_url,
				imageUrl: this.tuiguang_info.fenxiang_pic
			};
		},
		onShareTimeline: function() {
			return {
				title: this.tuiguang_info.title,
				path: this.tuiguang_info.redirect_url,
				imageUrl: this.tuiguang_info.fenxiang_pic
			};
		},
		methods: {
			//关闭分享弹窗
			closeShare() {
				this.showShare = false;
				this.shareWrap = false;
			},
			//分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
			sldShare(type, scene) {
				let {
					tuiguang_info
				} = this;
				let shareData = {};
				if (type == 0) {
					shareData.href = tuiguang_info.redirect_url;
					shareData.title = tuiguang_info.title;
					shareData.summary = tuiguang_info.description;
					shareData.imageUrl = tuiguang_info.fenxiang_pic;
				} 
				this.$weiXinAppShare(type, scene, shareData);
				this.closeShare(); //关闭分享
			},
			//长按保存二维码
			bc_code() {
				let that = this;
				uni.downloadFile({ //获得二维码的临时地址
					url: that.tuiguang_info.h5_qrcode,
					success: (res) => {
						if (res.statusCode == 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath, //传入临时地址
								success() {
								},
								fail() {
								}
							})
						}
					}
				})
			},
		}
	};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
	.tuiguang_img {
		width: 750rpx;
		height: 100vh;
	}

	.tuiguang {
		width: 100%;
		height: 100vh;
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
	}

	page {
		overflow: hidden;
	}

	.mask {
		width: 750rpx;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.45);
		position: fixed;
		top: 0;
	}

	.h5_app_container {
		text-align: center;
	}

	.fx_share_code {
		width: 350rpx;
		display: block;
		margin: 0 auto;
		margin-top: 80rpx;
	}

	.share_close {
		width: 100%;
		display: block;
		margin: 0 auto;
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		bottom: 50rpx;
		position: fixed;
	}
	.share_close image{
		width: 50rpx;
		height: 50rpx;
	}

	.erwei_con {
		padding: 40rpx;
		background-color: white;
		border-radius: 20rpx;
		width: 60%;
		margin: 0 auto;
		margin-top: 260rpx;
	}

	.erwei_con image {
		width: 400rpx;
	}
	.erwei_con1{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 150rpx;
	}
	.erwei_con1 .weixin_h5_img{
		width: 80%;
		height: 150rpx;
	}
	.select-wrap {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 750rpx;
	  height: 100vh;
	  background-color: rgba(0, 0, 0, 0.65);
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
</style>
