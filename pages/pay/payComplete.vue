<template>
	<view>
		<common :title="$L('结果页')"></common>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.initData();
		},
		methods: {
			initData() {
				if (/attach\=predeposit/.test(location.href)) {
					//跳转充值列表页
					uni.redirectTo({
						url: '/pages/recharge/recharge'
					})
				}else{
					//跳转订单列表页
					uni.redirectTo({
						url: '/pages/order/order'
					})
				}
			},
		}
	};
</script>
<style>
	.pay {
		position: relative;
		width: 750rpx;
		height: 100vh;
		background-color: #fff;
		overflow: hidden;
	}

	.pay .pay_type {
		padding: 30rpx 30rpx 0;
	}

	.pay_type .title {
		line-height: 90rpx;
		color: #353535;
		font-size: 32rpx;
	}

	.pay_type .item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 130rpx;
		color: #181818;
		border-bottom: 1rpx solid #e8e8e8;
	}

	.pay_type .item:last-child {
		border: none;
	}

	.item .type_left {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.item .type_left .img {
		width: 52rpx;
		max-height: 70rpx;
		overflow: hidden;
		margin: 0 53rpx 0 10rpx;
	}

	.item image {
		width: 52rpx;
	}

	.goPay {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 120rpx;
		width: 100%;
		z-index: 9;
	}

	.goPay button {
		background-color: #e74310;
		color: #fff;
		font-size: 34rpx;
		line-height: 120rpx;
		letter-spacing: 10rpx;
		border-radius: 0;
	}

	.dis {
		font-size: 26rpx;
		color: #b5b5b5;
	}

	.pay_type .disable {
		color: #989898;
	}

	.wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 120rpx;
		width: 750rpx;
		height: calc(100vh -120rpx);
		z-index: -1;
		background-color: rgba(0, 0, 0, 0);
		transition: all 0.2s;
	}

	.wrap.on {
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	.wrap .popup {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 260rpx;
		width: 100%;
		background-color: #fff;
		transform: translateY(380rpx);
		transition: all 0.2s;
	}

	.wrap.on .popup {
		transform: translateY(0);
	}

	.popup .pw {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.pw view {
		display: block;
		color: #333;
		font-size: 30rpx;
		height: 80rpx;
		width: 160rpx;
		text-align: right;
		line-height: 80rpx;
		margin-right: 20rpx;
	}

	.pw input {
		width: 370rpx;
		height: 80rpx;
		border: 1rpx solid #e8e8e8;
		padding-left: 30rpx;
	}

	.popup .close {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 50rpx;
		height: 50rpx;
		overflow: hidden;
	}

	.popup .close image {
		width: 100%;
		height: 100%;
	}

	.pw-wrap {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.pw-wrap .pw-modal {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 686rpx;
		height: 455rpx;
		border-radius: 20rpx;
		text-align: center;
		overflow: hidden;
		transform: translate(-50%, -80%);
		animation: fade 0.3s;
	}

	@keyframes fade {
		0% {
			transform: translate(-50%, -80%) scale3d(0.5, 0.5, 0.5);
			opacity: 0;
		}

		50% {
			-webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
			animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
		}

		100% {
			transform: translate(-50%, -80%) scale3d(1, 1, 1);
			-webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			opacity: 1;
		}
	}

	.pw-wrap .pw-modal .pw-title {
		position: relative;
		height: 99rpx;
		background-color: #ebebeb;
		font-size: 30rpx;
		font-weight: bold;
	}

	.pw-modal .pw-title text {
		line-height: 99rpx;
	}

	.pw-modal .pw-title .modal-close {
		position: absolute;
		top: 0;
		right: 0;
		padding: 30rpx;
	}

	.pw-modal .modal-close image {
		width: 30rpx;
		height: 30rpx;
	}

	.modal-main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		height: 356rpx;
		padding: 30rpx;
	}

	.modal-main input {
		width: 625rpx;
		height: 88rpx;
		border: 1rpx solid #dcdcdc;
		border-radius: 8rpx;
		margin-bottom: 30rpx;
	}

	.modal-main navigator {
		color: #0c8ae3;
		font-size: 26rpx;
		margin-bottom: 50rpx;
	}

	.modal-main button {
		width: 374rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		border-radius: 10rpx;
		background-color: #e00c1a;
	}
</style>
