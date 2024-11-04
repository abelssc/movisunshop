<template>
	<view>
		<view class="cr-tip" v-if="apply_t==1">
			<view class="tip-title">{{$L('注意事项')}}</view>
			<view class="tip-content">{{$L('以下所需要上传的电子版资质文件仅支持JPG/GIF/PNG格式图片，大小请控制在1M之内。')}}</view>
		</view>

		<form @submit="step1Submit" class="paddingB220">

			<!-- 开户银行信息 -->
			<view class="form-item" v-if="apply_t==1">
				<view class="form-item-title">{{$L('开户银行信息')}}</view>

				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('银行开户名')+'&type=text&key=bank_account_name&val=' + bank_account_name + '&step=2'">
						<label>{{$L('银行开户名')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{bank_account_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="bank_account_name" :value="bank_account_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('公司银行账号')+'&type=text&key=bank_account_number&val=' + bank_account_number + '&step=2'">
						<label>{{$L('公司银行账号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{bank_account_number}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="bank_account_number" :value="bank_account_number" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('开户银行支行名称')+'&type=text&key=bank_name&val=' + bank_name + '&step=2'">
						<label>{{$L('开户银行支行名称')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{bank_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="bank_name" :value="bank_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('支行联行号')+'&type=text&key=bank_code&val=' + bank_code + '&step=2'">
						<label>{{$L('支行联行号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{bank_code}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="bank_code" :value="bank_code" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('开户银行所在地')+'&type=address&key=bank_address&val=' + bank_address + '&step=2'">
						<label>{{$L('开户银行所在地')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{bank_address}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="bank_address" :value="bank_address" class="hide"></input>
						</view>
					</navigator>

					<view class="list bw">
						<label>{{$L('开户银行许可证电子版')}}</label>
						<view class="list-right">
							<view class="upload-wrap" data-name="bank_licence_electronic" @tap="uploadImg">
								<view class="clear" data-name="bank_licence_electronic" @tap.stop="clearImg">
									<image :src="img_url+'integral/uploadclear.png'"></image>
								</view>
								<image class="add" :src="img_url+'integral/crupload.png'" v-if="!bank_licence_electronic_show"></image>
								<image class="newImg" :src="bank_licence_electronic_show" mode="aspectFit" v-if="bank_licence_electronic_show"></image>
							</view>
							<input type="text" name="bank_licence_electronic" :value="bank_licence_electronic" class="hide"></input>
							<image src="/static/integral/images/crright.png" class="more"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 结算账号信息 -->
			<view class="form-item">
				<view class="form-item-title">{{$L('结算账号信息')}}</view>
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title=' + (apply_t==1?$L('银行开户名'):$L('支付宝姓名')) + '&type=text&key=settlement_bank_account_name&val=' + settlement_bank_account_name + '&step=2'">
						<label>{{apply_t==1?$L('银行开户名'):$L('支付宝姓名')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{settlement_bank_account_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="settlement_bank_account_name" :value="settlement_bank_account_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title=' + (apply_t==1?$L('公司银行账号'):$L('支付宝账号')) + '&type=text&key=settlement_bank_account_number&val=' + settlement_bank_account_number + '&step=2'">
						<label>{{apply_t==1?$L('公司银行账号'):$L('支付宝账号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{settlement_bank_account_number}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="settlement_bank_account_number" :value="settlement_bank_account_number" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('开户银行支行名称')+'&type=text&key=settlement_bank_name&val=' + settlement_bank_name + '&step=2'"
					 v-if="apply_t==1">
						<label>{{$L('开户银行支行名称')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{settlement_bank_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="settlement_bank_name" :value="settlement_bank_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('支行联行号')+'&type=text&key=settlement_bank_code&val=' + settlement_bank_code + '&step=2'"
					 v-if="apply_t==1">
						<label>{{$L('支行联行号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{settlement_bank_code}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="settlement_bank_code" :value="settlement_bank_code" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('开户银行所在地')+'&type=address&key=settlement_bank_address&val=' + settlement_bank_address + '&step=2'"
					 v-if="apply_t==1">
						<label>{{$L('开户银行所在地')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{settlement_bank_address}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="settlement_bank_address" :value="settlement_bank_address" class="hide"></input>
							<input type="text" name="business_licence_address_ids" :value="business_licence_address_ids" class="hide"></input>
						</view>
					</navigator>
				</view>
			</view>

			<button form-type="submit" class="submit-btn">{{$L('下一步，提交店铺经营信息')}}</button>
		</form>

		<common :title="$L('财务信息')"></common>
	</view>
</template>

<script>

	function tip(txt, icon) {
		uni.showToast({
			title: txt,
			icon: icon ? icon : 'none'
		});
	}

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				apply_t: '',
				is_supplier: '',
				reapply: '0',
				key: "",
				name: "",
				label: "",
				bank_account_name: '',
				bank_account_number: '',
				bank_name: '',
				bank_code: '',
				bank_address: '',
				bank_licence_electronic_show: '',
				bank_licence_electronic: '',
				settlement_bank_account_name: '',
				settlement_bank_account_number: '',
				settlement_bank_name: '',
				settlement_bank_code: '',
				settlement_bank_address: '',
				business_licence_address_ids: '',
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('入驻信息')
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
				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;

				if (apply_t == 0) {
					if (!params.settlement_bank_account_name) {
						tip(this.$L('请输入支付宝姓名'));
						return false;
					}

					if (!params.settlement_bank_account_number) {
						tip(this.$L('请输入支付宝账号'));
						return false;
					}
				} else if (apply_t == 1) {
					if (!params.bank_account_name) {
						tip(this.$L('请输入银行开户名'));
						return false;
					}

					if (!params.bank_account_number) {
						tip(this.$L('请输入公司银行账号'));
						return false;
					}

					if (!params.bank_name) {
						tip(this.$L('请输入开户银行支行名称'));
						return false;
					}

					if (!params.bank_code) {
						tip(this.$L('请输入支行联行号'));
						return false;
					}

					if (!params.bank_account_name) {
						tip(this.$L('请输入银行开户名'));
						return false;
					}

					if (!params.bank_address) {
						tip(this.$L('请选择开户银行所在地'));
						return false;
					}

					if (!params.bank_licence_electronic) {
						tip(this.$L('请上传开户银行许可证电子版'));
						return false;
					}

					if (!params.settlement_bank_account_name) {
						tip(this.$L(this.$L('请输入结算银行开户名')));
						return false;
					}

					if (!params.settlement_bank_account_number) {
						tip(this.$L('请输入公司银行账号'));
						return false;
					}

					if (!params.settlement_bank_name) {
						tip(this.$L('请输入开户银行支行名称'));
						return false;
					}

					if (!params.settlement_bank_code) {
						tip(this.$L('请输入支行联行号'));
						return false;
					}

					if (!params.settlement_bank_address) {
						tip(this.$L('请选择开户银行所在地'));
						return false;
					}
				}

				uni.request({
					url: getApp().globalData.ser_url +
						`/index.php?app=enterin&mod=step2&apply_t=${apply_t}&is_supplier=${is_supplier}&key=${key}&reapply=${reapply}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res.data.datas.state == 200) {
							uni.navigateTo({
								url: '/integral/companyReg/crStep3/crStep3?apply_t=' + apply_t + '&is_supplier=' + is_supplier +
									'&reapply=' + reapply
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
										key: 'enterin2_' + name + '_show',
										data: data.datas.img_url
									});
									uni.setStorage({
										key: 'enterin2_' + name,
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
				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url +
						`/index.php?app=enterin&mod=dataOfStep&key=${key}&apply_t=${apply_t}&is_supplier=${is_supplier}&reapply=${reapply}&step=2`,
					success: res => {
						if (res.data.datas.state == 200) {
							let data = res.data.datas.data;
							let hasData = {};

							for (let i in data) {
								if (data[i]) {
									hasData[i] = data[i];
								}
							}

							this.setData({ ...hasData
							});
						}

						uni.getStorageInfo({
							success: function(res) {
								if (res.keys.length) {
									res.keys.map(el => {
										if (el.indexOf('enterin2_') > -1) {
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
				});
			}

		}
	};
</script>
<style>
	@import "../../common/crcommon.css";
</style>
