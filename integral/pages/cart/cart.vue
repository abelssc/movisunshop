<template>
	<view>

		<view class="cart">
			<view class="edit" v-if="cartList && cartList.length > 0">
				<text @tap="edithandle" v-if="edit">{{$L('完成')}}</text>
				<text @tap="edithandle" v-if="!edit">{{$L('编辑')}}</text>
			</view>
			<scroll-view class="order_list" scroll-y>
				<block v-if="cartList.length">
					<checkbox-group @change="choice">
						<view v-for="(item, index) in cartList" :key="index" class="item">
							<label :for="'a'+item.pcart_id">
								<icon type="success" size="22" color="#EC3737" v-if="item.checked"></icon>
								<text class="icon" v-else></text>
								<checkbox :id="'a'+item.pcart_id" :value="item.pcart_id" class="hide" :checked="item.checked"></checkbox>
							</label>
							<view class="img" :data-gid="item.pgid" @tap="detail">
								<image :src="item.image"></image>
							</view>
							<view class="cart_info">
								<text :data-gid="item.pgid" @tap="detail" class="pgoods_name">{{item.pgoods_name }}</text>
								<!-- <text>粉色  L码</text> -->
								<view class="price">
									<text>{{item.pgoods_points}}{{$L('积分')}}</text>
									<view class="num">
										<text data-type="desc" :data-id="item.pcart_id" @tap="handlecart">-</text>
										<text>{{item.pgoods_choosenum}}</text>
										<text data-type="add" :data-id="item.pcart_id" @tap="handlecart">+</text>
									</view>
								</view>
							</view>
						</view>
					</checkbox-group>
				</block>

				<block v-else>
					<block data-type="template" data-is="not" data-attr="img,content">
						<view class="nothasData">
							<view class="img">
								<image :src="img"></image>
							</view>
							<text>{{content}}</text>
						</view>
					</block>
				</block>
			</scroll-view>


			<view class="footer" v-if="cartList && cartList.length > 0">
				<label for="checkAll" @tap="check">
					<icon type="success" size="22" color="#EC3737" v-if="checkAll"></icon>
					<text class="icon" v-else></text>
					<checkbox class="hide" id="checkAll" :value="checkAll"></checkbox>
					<text>{{$L('全选')}}</text>
				</label>
				<view class="pay_price"  v-if=" !edit ">
					{{$L('应付：')}}
					<text>{{total}}{{$L('积分')}}</text>
				</view>
				<view class="pay_price"  v-if="edit">
				</view>
				<button class='pay_btn' @tap="delCart" v-if="cartList && cartList.length > 0 && edit ">{{$L('删除')}}</button>
				<!-- <view :class="'del ' + (edit?'on':'')" @tap="delCart" v-if="cartList && cartList.length > 0 && edit==false">删除</view> -->
				<button class="pay_btn" @tap="pay" v-if=" !edit ">{{$L('立即兑换')}}</button>
			</view>
		</view>
		<footerBar :imgSrc="imgSrc" />
		<common :title="$L('购物车')"></common>
	</view>
</template>

<script>
	import footerBar from "@/integral/pages/template/footer.vue";

	export default {
		components: {
			footerBar,
		},
		data() {
			return {
				edit: false,
				imgSrc: 'cart',
				key: '',
				cartList: [],
				checkAll: false,
				// 全选
				idList: '',
				// 选中的商品ID
				total: 0,
				img: getApp().globalData.img_url + "no_cart.png",
				content: this.$L('暂无数据...')
			};
		},

		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('积分购物车')
      });
			var key = uni.getStorageSync('token');

			if (key) {
				this.setData({
					key: key
				});
			} else {
				getApp().globalData.goLogin();
			}
		},

		onShow() {
			this.getCartList();
			this.edit = false;
		},

		methods: {
			edithandle() {
				this.setData({
					edit: !this.edit
				});
			},

			jumpPage(e) {
				let url = e.currentTarget.dataset.url;

				if (url) {
					uni.redirectTo({
						url
					});
				}
			},

			// 计算购物车价格
			calcTotal() {
				let total = 0,
					cartList = this.cartList;
				cartList.forEach(el => {
					if (el.checked) {
						total += parseInt(el.pgoods_points) * parseInt(el.pgoods_choosenum);
					}
				});
				this.setData({
					total
				});
			},

			// 获取购物车列表
			getCartList() {
				let that = this,
					key = that.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=cartlist&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key
					},
					success: function(res) {
						if (res.data.status == 200) {
							let list = res.data.data;
							let isCheck = true;
							let idList = [];
							list.map(el => {
								if (isCheck) {
									el.checked = true;
									idList.push(el.pcart_id);
								} else {
									el.checked = false;
								}
							});
							idList = idList.join(',');
							that.setData({
								cartList: list,
								idList,
								checkAll: isCheck
							});
							that.calcTotal();
						} else {
							if (res.data.msg == that.$L('当前购物车暂无数据')) {
								return
							}
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			// 选择商品
			choice(e) {
				let arr = e.detail.value;
				let cartList = this.cartList;
				cartList.map(el => {
					if (arr.indexOf(el.pcart_id + '') > -1) {
						el.checked = true;
					} else {
						el.checked = false;
					}
				});
				let idList = arr.join(',');
				this.setData({
					cartList,
					checkAll: false,
					idList
				});
				this.calcTotal();
			},

			// 全选
			check() {
				let checkAll = this.checkAll;
				let cartList = this.cartList;
				let idList = [];
				cartList.map(el => {
					if (checkAll) {
						el.checked = false;
					} else {
						el.checked = true;
						idList.push(el.pcart_id);
					}
				});
				idList = idList.join(',');
				this.setData({
					checkAll: !checkAll,
					cartList,
					idList
				});
				this.calcTotal();
			},

			// 购物车加减
			handlecart(e) {
				let that = this,
					type = e.currentTarget.dataset.type,
					id = e.currentTarget.dataset.id,
					key = that.key;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=handlecart&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key,
						type,
						cartid: id
					},
					success: function(res) {
						if (res.data.status == 200) {
							let cartList = that.cartList;

							for (let i = 0; i < cartList.length; i++) {
								let el = cartList[i];

								if (el.pcart_id == id) {
									if (type == 'desc') {
										el.pgoods_choosenum--;
									} else {
										el.pgoods_choosenum++;
									}

									break;
								}
							}

							that.setData({
								cartList
							});
							that.calcTotal();
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			// 删除商品
			delCart() {
				let that = this,
					key = that.key,
					cartid = that.idList;

				if (!cartid) {
					uni.showToast({
						title: that.$L('请选择要删除的商品'),
						icon: 'none'
					});
					return;
				}

				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=delcart&sld_addons=points',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: {
						key,
						cartid
					},
					success: function(res) {

						if (res.data.status == 200) {
							let oldcartList = that.cartList;
							let delList = cartid.split(',');
							let cartList = [];
							cartList = oldcartList.filter(el => delList.indexOf(el.pcart_id + '') == -1);
							that.setData({
								cartList
							});
							that.calcTotal();
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},

			// 查看商品详情
			detail(e) {
				let gid = e.currentTarget.dataset.gid;

				if (gid) {
					uni.navigateTo({
						url: '/integral/pages/goods_detail/goods_detail?gid=' + gid
					});
				}
			},

			// 支付
			pay() {
				let cartList = this.cartList;
				let idList = this.idList;

				if (!idList) {
					uni.showToast({
						title: this.$L('请选择要购买的商品'),
						icon: 'none'
					});
					return;
				}

				let cart = [];
				cartList.forEach(el => {
					if (el.checked) {
						cart.push(el.pcart_id + '|' + el.pgoods_choosenum);
					}
				});
				let cart_id = cart.join(',');
				uni.navigateTo({
					url: '/integral/pages/Integral_order/Integral_order?ifcart=1&cart_id=' + cart_id
				});
			}

		}
	};
</script>
<style>
	/* integral/pages/cart.wxss */
	page {
		width: 750rpx;
		margin: 0 auto;
	}

	.cart {
		width: 750rpx;
		height: calc(100vh - 100rpx);
		padding-bottom: 100rpx;
		overflow: hidden;
		background-color: #f5f5f5;
		position: relative;
	}

	.cart .edit {
		text-align: right;
		font-size: 30rpx;
		color: #181818;
	}

	.cart .edit text {
		display: inline-block;
		padding: 30rpx 40rpx;
	}

	.order_list {
		height: calc(100vh - 310rpx);
		overflow: hidden;
	}

	.order_list .item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.order_list .item:last-child {
		margin-bottom: 0;
	}

	label {
		flex: 0 0 44rpx;
		padding: 30rpx 38rpx 30rpx 30rpx;
	}

	label .icon {
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 1rpx solid #707070;
	}

	.item .img {
		flex: 0 0 180rpx;
		width: 180rpx;
		height: 180rpx;
		overflow: hidden;
		margin-right: 30rpx;
	}

	.item .img image {
		width: 100%;
		height: 100%;
	}

	.item .cart_info {
		flex: 1;
		padding-right: 30rpx;
	}

	.cart_info>text:nth-child(1) {
		display: block;
		color: #181818;
		font-size: 30rpx;
		margin-bottom: 52rpx;
		width: 400rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.cart_info>text:nth-child(2) {
		display: block;
		color: #747474;
		font-size: 26rpx;
		margin-bottom: 38rpx;
	}

	.cart_info .price {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		color: #181818;
		font-size: 28rpx;
	}

	.price .num {
		display: flex;
		width: 230rpx;
		height: 65rpx;
		align-items: center;
		color: #707070;
		font-size: 34rpx;
		text-align: center;
		border: 1rpx solid #c4c4c4;
		border-radius: 8rpx;
	}

	.price .num text {
		flex: 1;
		height: 100%;
		line-height: 65rpx;
		border-right: 1rpx solid #c4c4c4;
	}

	.price .num text:last-child {
		border: none;
	}

	.footer {
		position: fixed;
		bottom: 100rpx;
		display: flex;
		height: 98rpx;
		width: 750rpx;
		justify-content: space-between;
		line-height: 98rpx;
		align-items: center;
		background-color: #fff;
		font-size: 32rpx;
		color: #181818;
		border-top: 1rpx solid #e2e2e2;
	}

	.footer label {
		flex: 0 0 160rpx;
		display: flex;
		align-items: center;
		padding: 0 0 0 30rpx;
	}

	/* #ifdef MP-WEIXIN */
	.footer label icon {
		transform: translateY(20rpx);
	}

	/* #endif */

	.footer label .icon {
		width: 38rpx;
		height: 38rpx;
	}

	.footer label .icon,
	.footer label icon {
		display: block;
		margin-right: 10rpx;
	}

	.footer .pay_price {
		flex: 1;
		text-align: left;
		height: 98rpx;
	}

	.footer .pay_price text {
		color: #ee2328;
		font-size: 34rpx;
	}

	.footer .pay_btn {
		flex: 0 0 283rpx;
		width: 283rpx;
		height: 100%;
		background-color: #ec3737;
		color: #fff;
		font-size: 36rpx;
		text-align: center;
		line-height: 98rpx;
		border-radius: 0;
		padding: 0;
	}

	.del {
		position: absolute;
		bottom: 288rpx;
		right: 0;
		width: 283rpx;
		height: 120rpx;
		color: #fff;
		font-size: 36rpx;
		text-align: center;
		line-height: 120rpx;
		background-color: #ec3737;
		transform: translateX(100%);
		transition: all 0.3s;
	}

	.del.on {
		transform: translateX(0);
	}

	.nothasData .img {
		background-color: transparent;
	}

	.nothasData .img image {
		width: 100%;
		height: 100%;
		margin-top: 0;
	}
</style>
