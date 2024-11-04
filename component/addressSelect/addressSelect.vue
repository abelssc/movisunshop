<template>
	<picker mode="multiSelector" :value="initVal" :range="addressList" range-key="label" @change="selAddress"
		@columnchange="addressChange">
		<input type="text" :placeholder="tip" :value="addressArea" disabled="true"></input>
	</picker>
</template>

<script>
	import request from "../../utils/request";
  import {getCurLanguage} from '../../utils/common.js'
	export default {
		data() {
			return {
				addressList: [
					[],
					[],
					[]
				],
				initVal: [0, 0, 0],
				key: "",
				intervalId: '',
				allAreaData: [], //全部地址数据
			};
		},

		components: {},
		props: {
			tip: {
				type: String,
				default: getCurLanguage('点击选择省、市、区')
			},
			addressArea: {
				type: String,
				default: ''
			}
		},

		mounted() {
			// this.initFun();
			this.getAllAreaData();
		},

		methods: {
			// 获取地址列表
			getAllAreaData() {
				let key = uni.getStorageSync('token');
				this.key = key;
				uni.showLoading({
					// title: '正在初始化地址',
					mask: true
				});
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=address&mod=get_area_data&key=' + key,
					success: res => {
						if (res.data.code == 200) {
							this.allAreaData = res.data.datas.area_list;
							this.initAddressPicker();
						} else {
							uni.hideLoading();
						}
					},
					error: err => {
						uni.hideLoading();
					}
				});
			},

			// 初始化地址选择器
			initAddressPicker() {
				let p = [];
				let c = [];
				let a = [];
				p = JSON.parse(JSON.stringify(this.allAreaData));
				c = JSON.parse(JSON.stringify(this.allAreaData[0].children));
				a = JSON.parse(JSON.stringify(this.allAreaData[0].children[0].children));
				this.setData({
					addressList: [p, c, a],
					initVal: [0, 0, 0]
				});
				uni.hideLoading();
			},

			// 地址变化
			addressChange(e) {
				let {
					column,
					value
				} = e.detail;
				let addressSel = this.initVal;
				let c = [];
				let a = [];

				if (column == 0) {
					addressSel = [value, 0, 0];
				} else if (column == 1) {
					addressSel = [addressSel[0], value, 0];
				} else {
					addressSel = [addressSel[0], addressSel[1], value];
				}

				this.initVal = addressSel;

				if (column == 0) {
					c = JSON.parse(JSON.stringify(this.allAreaData[value].children));
					a = JSON.parse(JSON.stringify(this.allAreaData[value].children[0].children));
					this.setData({
						'addressList[1]': c,
						'addressList[2]': a
					});
				}

				if (column == 1) {
					a = JSON.parse(JSON.stringify(this.allAreaData[addressSel[0]].children[value].children));
					this.setData({
						'addressList[2]': a
					});
				}
			},

			// 选择地址
			selAddress(e) {
				let value = e.detail.value;

				let {
					addressList,
					allAreaData
				} = this;
				this.initVal = value;
				let tarData = [];
				tarData[0] = addressList[0][value[0]];
				tarData[0].area_id = tarData[0].value;
				tarData[0].area_name = tarData[0].label;
				tarData[1] = addressList[1][value[1]];
				if (tarData[1].area_parent_id != tarData[0].area_id) {
					//二级地区的父id不等于一级的id，说明不匹配，需要获取该一级地区下的首个二级数据
					let tempData = allAreaData.filter(item => item.value == tarData[0].area_id)[0].children;
					tarData[1] = tempData[0];
					this.initVal[1] = 0;
					this.addressList[1] = tempData;
				}
				tarData[1].area_id = tarData[1].value;
				tarData[1].area_name = tarData[1].label;
				tarData[2] = addressList[2][value[2]];
				if (tarData[2].area_parent_id != tarData[1].area_id) {
					//三级地区的父id不等于二级的id，说明不匹配，需要获取该二级地区下的首个三级数据
					tarData[2] = tarData[1].children[0];
					this.initVal[2] = 0;
					this.addressList[2] = tarData[1].children;
				}
				tarData[2].area_id = tarData[2].value;
				tarData[2].area_name = tarData[2].label;
				this.$emit('confirm', {
					detail: tarData
				});
			},
		}
	};
</script>
<style>
	.address_mask {
		width: 750rpx;
		height: 100vh;
		z-index: 10000;
		background-color: rgba(0, 0, 0, 0.3);
	}

	input {
		font-size: 28rpx;
	}
</style>
