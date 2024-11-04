<template>
	<view>
		<form @submit="step1Submit">

			<view class="form-item">
				<view class="form-list">
					<view class="list bw">
						<label>{{$L('上传支付凭证')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="paying_money_certificate" @tap="uploadImg">
								<view class="clear" data-name="paying_money_certificate" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!paying_money_certificate_show"></image>
								<image class="newImg" :src="paying_money_certificate_show" mode="aspectFit" v-if="paying_money_certificate_show"></image>
							</view>
							<input type="text" name="paying_money_certificate" :value="paying_money_certificate" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('备注')+'&type=text&key=paying_money_certificate_explain&val=' + paying_money_certificate_explain + '&step=5'">
						<label>{{$L('备注')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{paying_money_certificate_explain}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="paying_money_certificate_explain" :value="paying_money_certificate_explain" class="hide"></input>
						</view>
					</navigator>
				</view>
			</view>

			<button form-type="submit" class="submit-btn">{{$L('提交')}}</button>
		</form>

		<common :title="$L('上传支付凭证')"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				apply_t: '',
				is_supplier: '',
				reapply: '0',
				key: "",
				company_address_ids: "",
				name: "",
				label: "",
				paying_money_certificate_show: '',
				paying_money_certificate: '',
				paying_money_certificate_explain: '',
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('上传支付凭证')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			this.setData({ ...options
			});
			this.initData();
		},
		methods: {
			// 提交表单
			step1Submit(e) {
				let params = e.detail.value;
				let hasErr = false;

				if (hasErr) {
					uni.showToast({
						title: this.$L('请补全信息'),
						icon: 'none'
					});
					return;
				}

				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + `/index.php?app=enterin&mod=paySave&key=${key}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res.data.datas.state == 200) {
							uni.redirectTo({
								url: '/integral/companyReg/crStep4/crStep4?type=4'
							});
						} else {
							uni.showToast({
								title: res.data.datas.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			// 编辑
			crEdit(e) {
				if (e.key && e.val) {
					this.setData({
						[e.key]: e.val
					});
				}

				if (e.company_address_ids) {
					this.setData({
						company_address_ids: e.company_address_ids
					});
				} else if (e.business_licence_address_ids) {
					this.setData({
						company_address_ids: e.business_licence_address_ids
					});
				}
			},

			// 上传图片
			uploadImg(e) {
				let name = e.currentTarget.dataset.name;
				let {
					key,
					reapply
				} = this;
				let that = this;

				if (name) {
					uni.chooseImage({
						count: 1,

						success(res) {
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=uploadPic',
								filePath: tempFilePaths[0],
								name: 'upimg',
								formData: {
									key: key,
									name: 'upimg',
									reapply: reapply
								},

								success(res) {
									let data = JSON.parse(res.data);
									that.setData({
										[name + '_show']: data.datas.img_url,
										[name]: data.datas.name
									});
									uni.setStorage({
										key: 'enterin5_' + name + '_show',
										data: data.datas.img_url
									});
									uni.setStorage({
										key: 'enterin5_' + name,
										data: data.datas.name
									});
								}

							});
						}

					});
				}
			},

			clearImg(e) {
				let name = e.currentTarget.dataset.name;
				this.setData({
					[name]: '',
					[name + '_show']: ''
				});
			},

			// 初始化数据，从storage中获取
			initData() {
				let that = this;
				uni.getStorageInfo({
					success: function(res) {
						if (res.keys.length) {
							res.keys.map(el => {
								if (el.indexOf('enterin5_') > -1) {
									// 获取所有入驻信息
									let label = el.substr(9);
									uni.getStorage({
										key: el,
										success: function(val) {
											that.setData({
												[label]: val.data
											});
										}
									});
								}
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	@import "../../common/crcommon.css";
</style>
