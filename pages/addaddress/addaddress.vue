<template>
	<view>
		<form v-if="isShow" @submit="submit">

			<view class="form-item border-bottom-1px">
				<label>{{$L('收货人')}}</label>
				<input class="input" type="text" name="true_name" maxlength="50" data-type="true_name" :value="true_name" :placeholder="$L('请输入收货人姓名')"
				 @input="changText"></input>
			</view>

			<view class="form-item border-bottom-1px">
				<label>{{$L('联系方式')}}</label>
				<input class="input" type="number" maxlength="20" name="mob_phone" data-type="mob_phone" :value="mob_phone"
				 :placeholder="$L('请输入手机号码')"></input>
			</view>

			<view class="form-item border-bottom-1px">
				<label>{{$L('地区选择')}}</label>
				<view class="input">
					<addressSelect :addressArea="area_info" @confirm="confirmSelectAddr"></addressSelect>
				</view>
				<input class="hide" name="city_id" :value="city_id"></input>
				<input class="hide" name="area_id" :value="area_id"></input>
				<input class="hide" name="area_info" :value="area_info"></input>
			</view>

			<view class="form-item border-bottom-1px">
				<label>{{$L('详细地址')}}</label>
				<input class="input" maxlength="60" type="text" name="address" data-type="address" :value="address" @input="changTextAddress" :placeholder="$L('请输入详细地址')"></input>
			</view>

			<view class="form-item">
				<label>{{$L('默认地址')}}</label>
				<switch name="is_default" :checked="is_default==1" color="#f23030"></switch>
			</view>

			<button form-type="submit">{{$L('确认')}}</button>
		</form>


		<common :title="title" v-if="title"></common>
	</view>
</template>

<script>
	//获取应用实例
	import request from "../../utils/request";
	let flag = false;

	export default {
		data() {
			return {
				key: '',
				address_id: '',
				true_name: '',
				mob_phone: '',
				city_id: '',
				area_id: '',
				address: '',
				area_info: '',
				is_default: 0,
				form: '',
				title: '',
				isShow: false,
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('新增地址')
      });
			let key = uni.getStorageSync('token');

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
			// 编辑地址 获取地址信息
			initData() {
				let {
					key,
					address_id
				} = this;
				this.setData({
					title: address_id ? this.$L('编辑地址') : this.$L('添加地址'),
					isShow: address_id ? false : true
				});

				if (address_id) {
					uni.showToast({
						title: this.$L('加载中~~~~~'),
						icon: 'none'
					});
					uni.setNavigationBarTitle({
						title: this.$L('编辑地址')
					});
					request({
						url: getApp().globalData.ser_url + '/index.php?app=address&mod=address_info',
						data: {
							key,
							address_id
						},
						method: 'post'
					}).then(res => {
						this.setData({
							...res.datas.address_info,
							isShow: true
						});
						uni.hideToast();
					});
				}
			},

			// 地址确认回调
			confirmSelectAddr(e) {
				let arr = e.detail;
				let city_id = arr[1].area_id;
				let area_id = arr[2].area_id;
				let area_info = `${arr[0].area_name} / ${arr[1].area_name} / ${arr[2].area_name}`;
				this.setData({
					city_id,
					area_id,
					area_info
				});
			},

			// 提交表单
			submit(e) {
				let phoneReg = /^\d+$/;
				let params = e.detail.value;
				let {
					key,
					address_id,
					form
				} = this;

				if (flag) {
					return;
				}

				flag = true;

				if (!params.true_name) {
					uni.showToast({
						title: this.$L('请输入收货人姓名'),
						icon: 'none'
					});
					flag = false;
					return;
				}

				if (!params.mob_phone) {
					flag = false;
					uni.showToast({
						title: this.$L('请输入手机号码'),
						icon: 'none'
					});
					return;
				}

				if (!params.area_info) {
					flag = false;
					uni.showToast({
						title: this.$L('请选择地区'),
						icon: 'none'
					});
					return;
				}

				if (!params.address) {
					flag = false;
					uni.showToast({
						title: this.$L('请输入详细地址'),
						icon: 'none'
					});
					return;
				} else if (params.address.length < 5||params.address.length >= 60) {
					flag = false;
					uni.showToast({
						title: this.$L('详细地址内容输入区间为5-60个字'),
						icon: 'none'
					});
					return;
				}

				if (!phoneReg.test(params.mob_phone)) {
					flag = false;
					uni.showToast({
						title: this.$L('请输入正确的手机号'),
						icon: 'none'
					});
					return;
				}

				let url = address_id ? getApp().globalData.ser_url + '/index.php?app=address&mod=address_edit' : getApp().globalData
					.ser_url + '/index.php?app=address&mod=address_add';
				params.is_default = params.is_default ? 1 : 0;
				let data = {
					key,
					...params
				};

				if (address_id) {
					data.address_id = address_id;
				}

				request({
					url,
					method: 'post',
					data: data
				}).then(res => {
					if (res.datas.error != undefined) {
						flag = false;
						uni.showToast({
							title: res.datas.error,
							icon: 'none'
						});
					} else {
						flag = false;
						uni.showToast({
							title: address_id ? this.$L('编辑地址成功') : this.$L('添加地址成功')
						});

						if (form) {
							// 确认订单 增加收货地址
							let page = getCurrentPages();

							if (page[page.length - 2].$vm.addr) {
								page[page.length - 2].$vm.addr({ ...data,
									address_id: res.datas.address_id
								});
							}
						}

						setTimeout(() => {
							uni.navigateBack({});
						}, 1500);
					}
				}).catch(err => {
				});
			},

			changText(e) {
				let val = e.detail.value;
				val =  val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
				if(val.length>=50){
					uni.showToast({
						title: this.$L('字数已到达最大值50字，不支持继续输入'),
						icon: 'none'
					});
				}
				this.setData({
					true_name: val
				});
			},
			
			changTextAddress(e) {
				let val = e.detail.value;
				if(val.length>=60){
					uni.showToast({
						title: this.$L('字数已到达最大值60字，不支持继续输入'),
						icon: 'none'
					});
				}
				this.setData({
					address: val
				});
			}

		}
	};
</script>
<style>
	page {
		background-color: #f0f2f5;
		width: 750rpx;
		margin: 0 auto;
	}

	input,.input {
		font-size: 28rpx;
	}

	.form-item {
		font-size: 28rpx;
		color: #232326;
		padding: 30rpx;
		background-color: #fff;
		margin-top: 30rpx;
	}

	.form-item label {
		text-align: center;
	}

	.form-item .input {
		padding: 10rpx 0;
		border-bottom: 1px solid #ccc;
	}

	button {
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx 30rpx;
		background-color: #000;
		color: #fff;
		font-size: 30rpx;
		border: none;
	}
</style>
