<template>
	<view>
		<view class="address_list" v-if="address.length>0">
			<view v-for="(item, address_index) in address" :key="address_index" class="address_part">
				<view class="address_info" :data-index="address_index" :data-address-id="item.address_id" @tap.stop="select_address">
					<div class="sele_address" v-if="allow_sele==1&&item.address_id==sele_address_id">
						<image style="width:30rpx;height:30rpx;" :src="img_url+'ok.png'"></image>
					</div>
					<text class="name">{{item.true_name}}</text>
					<text class="phone">{{item.mob_phone}}</text>
					<text :class="'region ' + (isShowAllContent?'content-all':'content-breif')">{{item.area_info}} {{item.address}}</text>
				</view>
				<view class="operate">
					<text class="default-addr">{{item.is_default==1?$L('默认地址'):''}}</text>
					<view>
						<text v-if="allow_sele!=1" @tap.stop="edit_address" :data-id="item.address_id">{{$L('编辑')}}</text>
						<text :id="item.address_id" @tap.stop="del_address">{{$L('删除')}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bot_add_address">
			<text class="bot_btn_add" @tap.stop="go_add_address">{{$L('新增地址')}}</text>
		</view>
		<!--收货地址列表页没有数据的提示  -->
		<view class="no_cart_goods" v-if="address.length == 0">
			<image :src="img_url+'active5_m.png'"></image>
			<text>{{$L('还没有建立收货地址哦~')}}</text>
		</view>
		<common :title="$L('确认订单')"></common>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				allow_sele: 0, //是否允许选择
				key: "",
				isback: 0,
				sele_address_id: "",
				address: ""
			};
		},

		components: {},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('我的地址')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}

			if (options.form == 1) {
				this.setData({
					allow_sele: 1
				});
			}

			if (options.isback == 1) {
				this.setData({
					isback: 1
				});
			}

			if (options.address_id > 0) {
				this.setData({
					sele_address_id: options.address_id
				});
			}
		},

		onShow() {
			//获取用户的地址列表
			this.get_address();
		},

		methods: {
			get_address() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=address&mod=address_list',
					data: {
						key: this.key
					},
					dataType: 'json',
					success: result => {
						let list = result.data.datas.address_list;
						this.setData({
							address: list
						});
					}
				});
			},

			//新增地址事件
			go_add_address: function(event) {
				let url = this.isback ? '/pages/addaddress/addaddress?isback=1' : '/pages/addaddress/addaddress';
				uni.navigateTo({
					url
				});
			},
			//编辑地址事件
			edit_address: function(event) {
				let id = event.currentTarget.dataset.id;
				let url = this.isback ? `/pages/addaddress/addaddress?isback=1&address_id=${id}` :
					`/pages/addaddress/addaddress?address_id=${id}`;
				uni.navigateTo({
					url
				});
			},
			//删除地址事件
			del_address: function(event) {
				var address_id = event.currentTarget.id;
				var that = this;
				uni.showModal({
					title: that.$L('提示'),
					content: that.$L('删除当前地址'),
					cancelText:that.$L('取消'),
					confirmText:that.$L('确定'),
					success: res => {
						if (res.confirm) {
							uni.request({
								url: getApp().globalData.ser_url + '/index.php?app=address&mod=address_del_xcx',
								data: {
									'key': that.key,
									address_id: address_id
								},
								dataType: 'json',
								success: function(result) {
									if (result.data.state == 200) {
										let {
											address
										} = that;

										for (let i = 0; i < address.length; i++) {
											if (address[i].address_id == address_id) {
												address.splice(i, 1);
												break;
											}
										}

										that.setData({
											address
										});
									} else {
										uni.showToast({
											title: that.$L('操作失败'),
											icon: 'none',
											duration: 2000
										});
									}
								}
							});
						}
					}
				});
			},
			//选择地址事件
			select_address: function(e) {
				if (this.allow_sele != 1) return;
				var sele_id = e.currentTarget.dataset.addressId;
				var index = e.currentTarget.dataset.index;
				let address = this.address;
				address = address.filter(el => el.address_id == sele_id);
				let page = getCurrentPages();
				if (page[page.length - 2].$vm.addr) {
					page[page.length - 2].$vm.addr(address[0]);
				} //返回确认订单页面

				uni.navigateBack({
					delta: 1
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
		padding-bottom: 10px;
	}

	.address_list {
		position: relative;
		margin-bottom: 102rpx;
	}

	.address_list:after {
		height: 1px;
		content: '';
		width: 100%;
		border-top: 1px solid #e3e5e9;
		position: absolute;
		bottom: 0px;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.address_list .address_part {
		background: #fff;
		margin-bottom: 23rpx;
	}

	.address_list .address_part .address_info {
		padding: 23rpx;
		position: relative;
	}

	.address_list .address_part .address_info:after {
		height: 1px;
		content: '';
		width: 100%;
		border-top: 1px solid #e3e5e9;
		position: absolute;
		bottom: 0px;
		right: 0;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
		z-index: 1;
	}

	.address_list .address_part .address_info .name {
		color: #222;
		font-size: 32rpx;
		margin-right: 19rpx;    
		word-break: break-all;
	}

	.address_info .phone {
		color: #333;
		font-size: 28rpx;
	}

	.address_info .region {
		display: -webkit-box;
		color: #4d4d4d;
		margin-left: 24rpx;
		margin-right: 24rpx;
		margin-top: 24rpx;
		line-height: 52rpx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	/* #ifdef H5 */
	.region {
	  font-size: 26rpx;
	  line-height: 23px!important;
      margin:0 !important;
	  padding-left: 10rpx;
	}
	/* #endif */

	.content-breif {
		-webkit-line-clamp: 3;
	}

	.address_list .address_part .operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0rpx 10rpx 23rpx;
	}

	.address_list .address_part .operate view {
		text-align: right;
	}

	.address_list .address_part .operate text {
		color: #555;
		font-size: 28rpx;
		margin-right: 35rpx;
	}

	.bot_add_address {
		width: 750rpx;
		position: fixed;
		z-index: 2;
		background: #f5f5f5;
		height: 102rpx;
		bottom: 0;
		right: 0;
		left: 0;
		text-align: center;
		vertical-align: middle;
		margin: 0 auto;
	}

	.bot_add_address .bot_btn_add {
		background: #f23030;
		color: #fff;
		font-size: 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		display: inline-block;
		width: 45%;
		text-align: center;
		margin-top: 16rpx;
		border-radius: 8rpx;
	}

	.sele_address {
		width: 33rpx;
		height: 33rpx;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 100%;
		display: inline-block;
		margin-right: 20rpx;
	}

	.no_cart_goods {
		position: absolute;
		top: 50%;
		margin-top: -190rpx;
		align-items: center;
		left: 50%;
		margin-left: -144rpx;
	}

	.no_cart_goods image {
		width: 170rpx;
		height: 170rpx;
		display: block;
		text-align: center;
		margin: 0 auto;
	}

	.no_cart_goods text {
		display: block;
		text-align: center;
		color: #666;
		font-size: 32rpx;
		margin-top: 26rpx;
	}
	.default-addr{
		color: #ed5564 !important;
	}
</style>
