<template>
	<view>
		<view class="address">
			<view class="addr_info">
				<view>
					<text>{{info.true_name}}</text>
					<text>{{info.address_info.phone}}</text>
				</view>
				<view>{{info.address_info.address}}</view>
			</view>
		</view>

		<view class="order">
			<view class="order_item">{{$L('订单号：')}}{{info.order_sn}}</view>
			<view class="order_item">{{$L('订单时间：')}}{{info.add_time}}</view>
		</view>

		<view class="goods">
			<navigator :url="'/pages/shopHomePage/shopHomePage?vid='+info.vid" hover-class="none" class="store">
				<view class="store_name">
					<image :src="img_url+'addons/store.png'" mode="widthFix"></image>
					<text>{{info.store_name}}</text>
					<image src="/static/addons/images/ltr.png" mode="widthFix"></image>
				</view>
				<view class="store_state">{{detail.change.order_state_str}}</view>
			</navigator>



			<navigator :url="'/pages/goods_detail/goods_detail?gid=' + info.gid" hover-class="none" class="goods_info">
				<view class="goods_logo">
					<image :src="info.goods_image" mode="widthFix"></image>
				</view>
				<view class="goods_name">
					<view class="name">
						<image :src="img_url+$L('addons/jtt.png')" mode="widthFix"></image>
						<text class="info_goods_name">{{info.goods_name}}</text>
					</view>
					<view class="dj_price">
						{{$L('定金：')}}
						<view>{{$L('￥')}}
							<text>{{info.goods_dingjin_price}}</text> x
							<text>{{info.goods_num}}</text>
						</view>
					</view>
					<view class="spec" v-if="info.goods_spec">
						<text v-for="(item, index) in info.goods_spec" :key="index">{{item}}</text>
					</view>
					<view class="d_price">{{$L('单买价：')}}
						<text>{{$L('￥')}}{{info.goods_danmai_price}}</text>
					</view>
				</view>
			</navigator>
		</view>

		<!-- 阶梯团 进度 start -->
		<view class="program_wrap">
			<view class="time" v-if="isShowTime">
				<text class="line"></text>
				<text  class="dis_end0">{{jtt_time_txt}}</text>
				<text class="dis_end" v-if="jtt_time_txt1 != ''">{{jtt_time_txt1}}</text>
				<text class="line"></text>
			</view>
			<view class="program">
				<view class="p_prev">
					<image :src="img_url+'prtl.png'" class="p_img"></image>
				</view>
				<scroll-view class="p_content" :scroll-into-view="scrollTo" scroll-with-animation="true" scroll-x>
					<view v-for="(item, index) in ladderInfo" :key="index" class="p_item" :id="(ladder_jt==(index+1))?'scrollTo':''">
						<view class="p_tem_main">
							<view :class="'p_item_top ' + ((ladder_jt==index+1)?'on':'')">
								<text>{{$L('￥')}}{{item.pay_money}}</text>
								<text>{{$L('满')}}{{item.people_num}}{{$L('人参团')}}</text>
							</view>
							<view :class="'p_item_bottom ' + ((ladder_jt>=index+1)?'on':'')">
								<view class="p_line">
									<text>{{index+1}}</text>
									<view class="p_line_left_wrap">
										<view class="p_line_left" :style="'width: ' + item.left_pro + '%'"></view>
									</view>
									<view class="p_line_right_wrap">
										<view class="p_line_left" :style="'width: ' + item.right_pro + '%'"></view>
									</view>
								</view>
								<view class="p_item_txt">{{$L('阶梯')}}{{index+1}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="p_next">
					<image :src="img_url+'pltr.png'" class="p_img"></image>
				</view>
			</view>
		</view>
		<!-- 阶梯团 进度 end -->

		<view class="ys_jd">
			<view class="ys_title">{{$L('费用详情')}}</view>
			<view class="jd_item">
				<view class="jd_title">{{$L('阶段一')}}
					<text>{{detail.change.jieduan_1_str}}</text>
				</view>
				<view class="jd_price">
					{{$L('定金')}}
					<text>{{$L('￥')}}{{detail.change.jieduan_1_price}}</text>
				</view>
			</view>

			<view class="jd_item" v-if="detail.change.jieduan_2_str">
				<view class="jd_title">{{$L('阶段二')}}
					<text style="font-size: 20rpx;">{{detail.change.jieduan_2_str}}</text>
				</view>
				<view class="jd_price">
					{{$L('尾款')}}
					<text>{{$L('￥')}}{{detail.change.jieduan_2_price}}</text>
				</view>
			</view>

			<view class="jd_item express" v-if="detail.change.jieduan_2_str">
				<view class="jd_title">{{$L('运费')}}</view>
				<view class="jd_price">
					{{$L('快递')}}
					<text>{{$L('免邮')}}</text>
				</view>
			</view>
		</view>

		<view class="heji" v-if="detail.change.jieduan_2_str">
			{{$L('订单合计:')}}
			<text>{{$L('￥')}}{{detail.change.ding_dan_he_ji}}</text>
		</view>

		<view :class="'msg ' + ((info.order_state<30 && info.order_state > 0)?'pd':'')">
			<view class="title">{{$L('买家留言')}}</view>
			<view class="msg_input">
				<textarea :placeholder="$L('请输入留言')" disabled="true" :value="info.member_message?info.member_message:$L('无留言')"></textarea>
			</view>
		</view>

		<view class="footer" v-if="info.order_state<30 && info.order_state > 0">
			<view class="f_lfet">{{$L('应付尾款：')}}{{$L('￥')}}{{detail.change.jieduan_2_price}}</view>
			<view :class="'btn ' + (detail.change.shi_fou_ke_yi_fu_wei_kuan?'':'disable')" @tap="goPay">{{$L('去支付尾款')}}</view>
		</view>

		<common :title="$L('订单详情')"></common>
	</view>
</template>

<script>
	import request from "../../../utils/request";
	let time = 0;
	let timer = null;

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				key: '',
				orderid: '',
				jtt_time_txt: this.$L('距结束'),
				jtt_time_txt1: ' 00:00:00',
				scrollTo: '',
				detail: "",
				info: "",
				ladder_jt: "",
				ladderInfo: "",
				isShowTime: false
			};
		},

		components: {},
		props: {},
		async onLoad(options) {
      uni.setNavigationBarTitle({
          title: this.$L('订单详情')
      });
			const key = uni.getStorageSync('token');

			if (!key) {
				getApp().globalData.goLogin();
			}

			this.setData({
				key,
				...options
			});
			await this.getOrderDetail();
		},
		methods: {
			getOrderDetail() {
				let {
					orderid,
					key
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=order_desc&sld_addons=pin_ladder',
					data: {
						key,
						order_id: orderid
					},
					success: res => {
						if (res.data.status == 200) {
							let ladderInfo = res.data.data.ladder_price;
							let change = res.data.data.change;
							let ladder_jt = 0;
							let already_num = parseInt(change.yijing_pin_num);
							time = parseInt(change.dao_ji_shi);
							let isShowTime = false;
							if (time > 0) {
								isShowTime = true;
								this.jtt_time_out();
							}else{
								this.setData({
									jtt_time_txt: this.$L('活动已结束'),
									jtt_time_txt1: ``,
								})
							}

							for (var i = 0; i < ladderInfo.length; i++) {
								var el = ladderInfo[i];

								if (already_num >= el.people_num) {
									ladder_jt = i + 1;
								} else {
									break;
								}
							}

							let prev = 0;
							ladderInfo.forEach((el, i) => {
								let now = parseInt(el.people_num);
								el.left_pro = ladder_jt >= i + (ladder_jt == 0 ? 0 : 1) ? already_num >= now ? 100 : (already_num - prev) /
									now * 100 : 0;
								el.right_pro = ladder_jt >= i + 1 ? already_num > now ? 100 : 0 : 0;
								prev = now;
							});
							let info = res.data.data.guding;
							info.order_state = parseInt(info.order_state);
							this.setData({
								detail: res.data.data,
								info: info,
								ladder_jt: ladder_jt,
								ladderInfo: ladderInfo,
								isShowTime: true,
								scrollTo: 'scrollTo'
							});
						} else {
							uni.showModal({
								title: this.$L('提示'),
								confirmText:this.$L('确定'),
								content: res.msg,
								showCancel: false,
								success: e => {
									uni.navigateBack({});
								}
							});
						}
					}
				});
			},

			refresh() {
				this.getOrderDetail();
			},

			jtt_time_out() {
				
				if (timer) {
					clearTimeout(timer);
				}
				var days = parseInt(time / 60 / 60 / 24 ); //计算剩余的天数 
				let h = parseInt(time / 60 / 60% 24);
				let m = parseInt(time / 60 % 60);
				let s = parseInt(time % 60);
				if (time > 0) {
					h = h > 999 ? 999 : h > 9 ? h : '0' + h;
					m = m > 9 ? m : '0' + m;
					s = s > 9 ? s : '0' + s;
					this.setData({
						jtt_time_txt: this.$L('距结束'),
						jtt_time_txt1: `${days}${this.$L('天')} ${h}:${m}:${s}`
					});
					time--;
					timer = setTimeout(this.jtt_time_out, 1000);
				} else {
					this.setData({
						jtt_time_txt: this.$L('已结束'),
						jtt_time_txt1: ``,
					});
				}
			},

			goPay() {
				let {
					info,
					detail
				} = this;
				if (!detail.change.shi_fou_ke_yi_fu_wei_kuan) return;
				request({
					url: getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=buy_finish&sld_addons=pin_ladder',
					method: 'POST',
					data: {
						key: uni.getStorageSync('token'),
						order_sn: info.order_sn
					}
				}).then(res => {
					if (res.status == 200) {
						let url = '/addons/pages/pay/pay?order_sn=' + info.order_sn + '&p=' + detail.change.jieduan_2_price +
							'&type=ladder';
						uni.navigateTo({
							url: url
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}

		}
	};
</script>
<style>
	page {
		font-size: 28rpx;
		color: #353535;
		background-color: #f6f6f6;
	}

	.pay_success {
		width: 750rpx;
	}

	.pay_success image {
		width: 100%;
	}

	.address {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 158rpx;
		padding: 0 30rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.address .addr_img {
		margin-right: 30rpx;
	}

	.addr_img image {
		width: 34rpx;
		height: 0;
	}

	.address .addr_info view:nth-child(1) {
		margin-bottom: 15rpx;
	}

	.addr_info view text {
		margin-right: 25rpx;
	}

	.goods {
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.goods .store {
		display: flex;
		height: 70rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		color: #353535;
		font-size: 24rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.goods .store_name {
		display: flex;
		align-items: center;
	}

	.goods .store image {
		width: 24rpx;
		height: 0;
		margin-right: 20rpx;
	}

	.goods .store image:nth-of-type(2) {
		width: 10rpx;
		margin-left: 15rpx;
	}

	.goods .store_state {
		color: #F01313;
		font-size: 24rpx;
	}

	.goods .goods_info {
		display: flex;
		padding: 30rpx;
	}

	.goods_info .goods_logo {
		flex: 0 0 220rpx;
		width: 220rpx;
		height: 220rpx;
		border: 1rpx solid #F0F0F0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.goods_info .goods_logo image {
		max-width: 100%;
		height: 0;
	}

	.goods_info .goods_name {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		flex: 1;
		margin-left: 20rpx;
	}

	.goods_name .name {
		margin-bottom: 20rpx;
	}

	.info_goods_name{
		/* line-height: 40rpx; */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #353535;
		display: inline-block;
		margin-left: 10rpx;
	}
	.goods_name .name image {
		width: 116rpx;
		height: 31rpx;
	}

	.goods_name .y_pay {
		position: absolute;
		top: 88rpx;
		right: 0;
	}

	.goods_name .y_pay image {
		width: 170rpx;
		height: 0;
	}

	.spec {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.spec text {
		display: inline-block;
		padding: 6rpx 10rpx;
	}

	.send_str {
		color: #FFB81E;
		font-size: 24rpx;
	}

	.ys_jd {
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.ys_jd .ys_title {
		line-height: 90rpx;
		padding: 0 20rpx;
		color: #353535;
		font-size: 32rpx;
		border-bottom: 1rpx solid #E8E8E8;
	}

	.ys_jd .jd_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		border-bottom: 1rpx solid #E8E8E8;
		color: #353535;
		font-size: 30rpx;
		padding: 0 20rpx;
	}

	.ys_jd .jd_item:last-child {
		border-bottom: none;
	}

	.ys_jd .jd_title text {
		color: #686767;
		font-size: 28rpx;
		margin-left: 21rpx;
	}

	.ys_jd .jd_price {
		display: flex;
		align-items: center;
	}

	.ys_jd .jd_price text {
		color: #F01313;
		margin-left: 10rpx;
	}

	.express .jd_price text {
		color: #353535;
	}

	.ys_jd .jd_price text:nth-child(2) {
		color: #FE011D;
		font-size: 30rpx;
	}

	.ys_jd .jd_tip {
		line-height: 60rpx;
		color: #FF0031;
		font-size: 24rpx;
		padding: 0 20rpx;
	}

	.order {
		background-color: #fff;
		line-height: 60rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 98rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 999;
	}

	.footer .btn {
		flex: 0 0 250rpx;
		background-color: #FE011D;
		height: 98rpx;
		text-align: center;
		line-height: 98rpx;
		color: #fff;
	}

	.footer .btn.disable {
		background-color: #ccc;
	}

	.footer .f_lfet {
		flex: 1;
		padding-left: 50rpx;
		color: #FE011D;
		font-size: 30rpx;
		font-weight: 600;
	}

	.pd {
		padding-bottom: 98rpx;
	}

	.dj_price {
		display: flex;
		align-items: center;
	}

	.dj_price view {
		color: #F31010;
		font-size: 32rpx;
	}

	.dj_price view text {
		font-size: 42rpx;
	}

	.d_price {
		color: #A7A6A6;
	}

	.program_wrap {
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.program {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 223rpx;
		padding: 0 10rpx;
		background-color: #fff;
	}

	.program .p_prev,
	.program .p_next {
		margin: 0 15rpx;
		transform: translateY(28rpx);
	}

	.program .p_img {
		width: 19rpx;
		height: 31rpx;
	}

	.program .p_content {
		flex: 1;
		display: block;
		overflow: hidden;
		white-space: nowrap;
	}

	.p_item {
		display: inline-block;
		padding: 0 20rpx;
		font-size: 24rpx;
		color: #808080;
	}

	.p_tem_main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.p_item_top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width: 177rpx;
		height: 76rpx;
		margin-bottom: 15rpx;
		border: 3rpx solid transparent;
	}

	.p_item_top.on {
		border-radius: 38rpx;
		border: 3rpx solid #ED6307;
		color: #ED6307;
	}

	.p_item_bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.p_item_bottom .p_line {
		position: relative;
	}

	.p_item_bottom .p_line text {
		display: block;
		width: 40rpx;
		height: 40rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		overflow: hidden;
		background-color: #d1d1d1;
		color: #fff;
	}

	.p_item_bottom.on .p_line text {
		background-color: #ED6307;
	}

	.p_item_txt {
		margin-top: 15rpx;
	}

	.p_item_bottom.on .p_item_txt {
		color: #ED6307;
	}

	.p_line_left_wrap,
	.p_line_right_wrap {
		position: absolute;
		top: 50%;
		width: 95rpx;
		height: 6rpx;
		background-color: #D1D1D1;
		transform: translateY(-50%);
	}

	.p_line_left_wrap {
		right: 40rpx;
	}

	.p_line_right_wrap {
		left: 40rpx;
	}

	.p_line_left {
		width: 0;
		height: 6rpx;
		background-color: #ED6307;
	}

	.heji {
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		padding: 0 20rpx;
		color: #F01313;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.heji text {
		font-size: 34rpx;
		font-weight: 600;
	}

	.msg {
		background-color: #fff;
	}

	.msg .title {
		line-height: 90rpx;
		padding: 0 20rpx;
		color: #353535;
		font-size: 32rpx;
	}

	.msg_input {
		height: 120rpx;
		padding: 10rpx 20rpx;
	}

	.msg_input textarea {
		width: 100%;
		height: 120rpx;
		background-color: #F6F6F6;
		padding: 10rpx;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
		font-size: 24rpx;
	}

	.time .line {
		display: block;
		width: 116rpx;
		height: 1rpx;
		background-color: #E1E1E1;
	}

	.time text {
		margin: 0 20rpx;
	}
	.dis_end0{
		font-size: 28rpx !important;	
	}
	.dis_end{
		font-size: 20rpx !important;
		background-color: #3232;
	}
</style>
