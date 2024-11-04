<template>
	<view>
		<view class="con" v-if="article_detail">
			<view v-html="article_detail.article_content"></view>
		</view>
		<view class="empty" v-if="!article_detail && isLoading">
			<view class="img">
				<image :src="img_url+'order_w.png'"></image>
			</view>
			<text>{{$L('暂无帮助信息')}}</text>
		</view>
		<common :title="$L('帮助详情')"></common>
	</view>
</template>
<script>
	var graceRichText = require('../../libs/richText.js')
	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				i: '',
				type: '',
				article_detail: '',
				isLoading: false,
				article: "",
				show_rich_text: '' //富文本展示
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('帮助详情')
      });
			this.setData({ ...options
			});
			this.getHelpInfo();
		},
		methods: {
			getHelpInfo() {
				const {
					i,
					type
				} = this;
				let url = getApp().globalData.ser_url + (type == 'ts' ?
					`/index.php?app=index&mod=article_detail&sld_addons=spreader&id=${i}` :
					`/index.php?app=index&mod=article_detail&id=${i}`);
				uni.request({
					url: url,
					success: res => {
						let data = res.data.datas;

						if (data.status == 1) {
							this.setData({
								article_detail: data.article_detail,
								isLoading: true
							});
							this.setData({
								show_rich_text: graceRichText.format(data.article_detail.article_content)
							});

							this['__bind_tap'] = e => {
								// 预览图片
								let el = e.currentTarget.dataset._el;

								if (el.tag == 'image') {
									let imgSrc = el.attr.src;

									if (imgSrc) {
										uni.previewImage({
											urls: [imgSrc]
										});
									}
								}
							};

							uni.setNavigationBarTitle({
								title: data.article_detail.article_title
							});
						}
					},
					complete: () => {
						this.setData({
							isLoading: true
						});
					}
				});
			}

		}
	};
</script>
<style>
	.con {
		padding: 20rpx;
		font-size: 28rpx;
		color: #666;
		width: 710rpx !important;
		margin: 0 auto;
		word-break: break-all;
	}
	.con >>> img {
		max-width: 710rpx;
	}

	.empty {
		height: 750rpx;
		width: 750rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.empty .img {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		background-color: #ddd;
	}

	.empty text {
		color: #666;
		font-size: 28rpx;
		margin-top: 30rpx;
	}

	.empty .img image {
		width: 100rpx;
		height: 100rpx;
	}
</style>
