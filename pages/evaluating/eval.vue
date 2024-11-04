<template>
	<view>
		<!-- <view class="send-tip">
			特别提示：评价晒图选择直接拍照或从手机相册上传图片时，请注意图片尺寸控制在1M以内，超出请压缩裁剪后再选择上传！
		</view>
 -->
		<view class="eval">
			<view class="goods-info">
				<view class="img">
					<image :src="goodsInfo.image_60_url" mode="aspectFit"></image>
				</view>
				<view class="info">
					<view class="name">{{goodsInfo.goods_name}}</view>
					<view class="score">
						{{$L('商品评分')}}
						<Rate :score="score" @change="setScore"></Rate>
					</view>
				</view>
			</view>

			<view class="content">
				<input class="content_input" :placeholder="$L('亲，写点什么吧，您的意见对其他买家有很大帮助')" @input="inputHandle" :value="evaluate_comment" name="evaluate_comment"></input>
				<view class="nm">
					<view @tap="radioHandle">
						<radio color="#f23030" :checked="isChecked"></radio>
					</view>
					<label>{{$L('匿名')}}</label>
				</view>
			</view>

			<view class="upload">
				<view class="icon">
					<image :src="img_url+'upload-pic.png'" mode="widthFix"></image>
					<text>{{$L('晒图')}}</text>
				</view>
				<view v-for="(item, index) in uploadimg" :key="index" class="upload-item" @tap="uploadimgFun" :data-index="index">
					<image :src="item.file_url" v-if="item.file_url" mode="aspectFit"></image>
					<image :src="img_url+'value_add.png'" class="add" mode="widthFix" v-else></image>
				</view>
			</view>
		</view>

		<button @tap="submit" class="submit">{{$L('提交评价')}}</button>

		<common :title="$L('订单评价')"></common>
	</view>
</template>

<script>
	import request from "../../utils/request";
	import Rate from "../../component/Rate/Rate";

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				out_base_url: getApp().globalData.view_url,
				key: '',
				order_id: '',
				gid: '',
				score: 5,
				// 默认评分
				order_info: '',
				goodsInfo: {},
				uploadimg: [],
				isChecked: false,
				evaluate_comment: '',
        evalIndex:'',
			};
		},

		components: {
			Rate
		},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('订单评价')
      });
			let key = uni.getStorageSync('token');
			let order_id = options.order_id;
			let gid = options.gid;
      let evalIndex = options.index

			if (key) {
				this.setData({
					key: key,
					order_id: order_id,
					gid: gid,
          evalIndex:evalIndex
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.initData();
		},
		methods: {
			initData(e) {
				let {
					key,
					order_id
				} = this;
				request({
					url: getApp().globalData.ser_url + `/index.php?app=userorder&mod=order_info&key=${key}&order_id=${order_id}`
				}).then(res => {
					if (res.datas.error) { // wx.showToast({
						//   title: res.,
						// })
					}
					if (res.code == 200 && !res.datas.error) {					
						let {
							gid
						} = this;
						this.order_info = res.datas.order_info;
						this.goodsInfo =res.datas.order_info.goods_list[this.evalIndex]				
					}
				});
				let uploadimg = [];

				for (let i = 0; i < 5; i++) {
					uploadimg.push({
						file_name: '',
						file_url: ''
					});
				}

				this.setData({
					uploadimg
				});
			},

			setScore(e) {
				let score = e.detail-1;
				this.setData({
					score
				});
			},

			uploadimgFun(e) {
				let index = e.currentTarget.dataset.index;
				let {
					key
				} = this;
        let that = this
				uni.chooseImage({
					count: 1,
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: getApp().globalData.ser_url + '/index.php?app=sns_album&mod=file_upload',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								key: key
							},
							success: result => {
								let data = JSON.parse(result.data);

								if (data.code == 200) {
									if (data.datas.error) {
										uni.showToast({
											title: that.$L('图片尺寸过大'),
											icon: 'none'
										});
										return;
									}

									let file_name = data.datas.file_name;
									let file_url = data.datas.file_url;
									let {
										uploadimg
									} = this;
									uploadimg[index].file_name = file_name;
									uploadimg[index].file_url = file_url;
									this.setData({
										uploadimg
									});
								}
							}
						});
					}
				});
			},

			radioHandle() {
				this.setData({
					isChecked: !this.isChecked
				});
			},

			// 禁止input框输入表情
			regStrFn: function(str) {
				// 转换一下编码
				let reg =
					/([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g,
					indexArr = reg.exec(str);

				if (str.match(reg)) {
					str = str.replace(reg, '');
				}

				let obj = {
					val: str,
					index: indexArr
				};
				return obj;
			},
			inputHandle: function(e) {
				let name = 'form.' + e.target.dataset.name;
				let val = e.detail.value,
					pos = e.detail.cursor; 
				let obj = this.regStrFn(val);

				if (pos != -1 && obj.index) {
					//计算光标的位置
					pos = obj.index.index;
				}

				this.setData({
					evaluate_comment: obj.val
				}); 
			},

			submit() {
				let {
					key,
					order_id,
					gid,
					score,
					evaluate_comment,
					uploadimg,
					isChecked
				} = this;
        let that = this
				let images = [];
				uploadimg.forEach(el => {
					if (el.file_name) {
						images.push(el.file_name);
					}
				});

				if (!evaluate_comment && images.length == 0) {
					uni.showToast({
						title: that.$L('请填写评价内容'),
						icon: 'none'
					});
					return;
				}

				let params = {
					key: key,
					order_id: order_id,
					gid: gid,
					evaluate_score: score,
					evaluate_comment: evaluate_comment,
					goods_anony: isChecked ? 1 : 0
				};
				params.images = images.join(',');
				request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=wapGoodsComments',
					method: 'post',
					data: params
				}).then(res => {
					if (res.datas.state == "success") {
						uni.showToast({
							title: that.$L('评价成功')
						});
						let page = getCurrentPages();

						if (page[page.length - 2].$vm.update) {
							page[page.length - 2].$vm.update(gid);
						}
						
						if (page[page.length - 3].$vm.update) {
							page[page.length - 3].$vm.update()
						}
						
						if (page[page.length - 4].$vm.update) {
							page[page.length - 4].$vm.update()
						}

						setTimeout(() => {
							uni.navigateBack({});
						}, 1500);
					} else {
						uni.showToast({
							title: that.$L('评价失败'),
							icon: 'none'
						});
					}
				});
			}

		}
	};
</script>
<style>
	/* pages/evaluating/eval.wxss */
	page {
		font-size: 28rpx;
		color: #333;
		background-color: #f5f5f5;
	}
.content_input{
	font-size: 24rpx;
}
	.send-tip {
		margin: 20rpx 36rpx;
		border-radius: 20rpx;
		background-color: #AAA;
		color: #fff;
		font-size: 26rpx;
		line-height: 36rpx;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
	}

	.eval {
		background-color: #fff;
		padding: 20rpx;
	}

	.eval .goods-info {
		display: flex;
		align-items: center;
	}

	.goods-info .img {
		flex: 0 0 120rpx;
		width: 120rpx;
		height: 120rpx;
	}

	.goods-info .img image {
		width: 120rpx;
		height: 120rpx;
	}

	.goods-info .info {
		flex: 1;
		padding: 20rpx;
	}

	.goods-info .info .name {
		color: #232326;
	}

	.goods-info .info .score {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		color: #888;
		font-size: 26rpx;
	}

	.content {
		display: flex;
		margin: 20rpx 0;
		align-items: center;
	}

	.content input {
		flex: 1;
		height: 90rpx;
		padding: 0 15rpx;
		border-radius: 10rpx;
		background-color: #F5F5F5;
	}

	.content .nm {
		flex: 0 0 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: #888;
	}

	.upload {
		display: flex;
		align-items: center;
	}

	.upload .icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 120rpx;
		color: #BBB;
		text-align: center;
	}

	.upload .icon image {
		width: 60rpx;
		height: 0;
		opacity: 0.3;
	}

	.upload .icon text {
		font-size: 24rpx;
	}

	.upload .upload-item {
		display: flex;
		width: 90rpx;
		height: 90rpx;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #EEE;
		margin-right: 20rpx;
	}

	.upload .upload-item image {
		width: 100%;
		height: 100%;
	}

	.upload .upload-item .add {
		width: 50%;
		height: 0;
		opacity: 0.3;
	}

	.submit {
		height: 80rpx;
		background-color: #F23030;
		font-size: 30rpx;
		border-radius: 10rpx;
		line-height: 80rpx;
		color: #fff;
		margin: 30rpx 50rpx;
	}
</style>
