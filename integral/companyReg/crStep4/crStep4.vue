<template>
	<view>
		<!-- #ifndef MP-WEIXIN -->
		<navigationBar id="gainPhone" :text="title"></navigationBar>
		<!-- #endif -->
		<view class="step4Header" v-if="type!=3">
			<image :src="img_url+'integral/crsuccess.png'"></image>
			<text>{{type==1?$L('入驻申请已提交，请等待管理员审核'):(type==2?$L('审核成功，请完成付款，付款后提交付款凭证'):(type==4?$L('已经提交，请等待管理员核对后为您开通店铺'):(type==5?$L('请登录商户后台'):$L('付款审核失败'))))}}</text>
		</view>

		<view class="step4Header err" v-if="type==3">
			<image :src="img_url+'enterin_apply_false.png'"></image>
			<view>
				<text>{{$L('审核失败')}}</text>
				<text>{{errorTip}}</text>
			</view>
		</view>

		<block v-if="type==1">
			<view class="table">
				<view class="table-title">{{$L('付费清单列表')}}</view>

				<view class="tab-list">
					<text class="s">{{$L('收费标准')}}</text>
					<text class>{{sg_info.sg_price}}</text>
					<text class="s">{{$L('开店时长')}}</text>
					<text class>{{joinin_year}}{{$L('年')}}</text>
				</view>
				<view class="tab-list">
					<text class="s">{{$L('店铺分类')}}</text>
					<text class>{{sc_name}}</text>
					<text class="s">{{$L('应付金额')}}</text>
					<text class>{{paying_amount}}{{$L('元')}}</text>
				</view>
			</view>

			<view class="table">
				<view class="table-title">{{$L('经营类目列表')}}</view>

				<view class="tab-list">
					<text class="s">{{$L('一级类目')}}</text>
					<text class="s">{{$L('二级类目')}}</text>
					<text class="s">{{$L('三级类目')}}</text>
					<text class="s">{{$L('佣金比例')}}</text>
				</view>
				<view v-for="(item, index) in store_class_names" :key="index" class="tab-list">
					<text class>{{item[0]?item[0]:''}}</text>
					<text class>{{item[1]?item[1]:''}}</text>
					<text class>{{item[2]?item[2]:''}}</text>
					<text class>{{store_class_commis_rates[index]?store_class_commis_rates[index]:$L('待定')}}</text>
				</view>
			</view>
		</block>

		<block v-if="type==2 || type==6">
			<navigator hover-class="none" open-type="redirect" url="/integral/companyReg/crStep5/crStep5" class="navigation">{{$L('上传支付凭证')}}</navigator>
		</block>

		<block v-if="type==3">
			<navigator hover-class="none" open-type="redirect" url="/integral/companyReg/crSelectType/crSelectType?reapply=1"
			 class="navigation">{{$L('重新申请')}}</navigator>
		</block>

		<common :title="$L('入驻信息')"></common>
	</view>
</template>

<script>
	import navigationBar from "../../../component/navigationBar/navigationBar";

	export default {
		data() {
			return {
				reapply: 0,
				key: '',
				type: 1,
				// 1 申请中  2 成功（去上传支付凭证） 3 失败  4 支付凭证上传成功  5 开店成功  6 付款审核失败
				errorTip: '',
				title: this.$L('入驻信息'),
				img_url: getApp().globalData.img_url, //图片地址
				store_class_names: "",
				store_class_commis_rates: "",
				sg_info: "",
				paying_amount: "",
				sc_name: "",
				joinin_year: ""
			};
		},

		components: {
			navigationBar
		},
		props: {},
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('入驻信息')
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

			if (options.type == 1) {
				this.getApplyInfo();
			}
		},
		methods: {
			getApplyInfo() {
				let {
					key,
					reapply
				} = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=getApplyInfo&key=' + key + '&reapply=' + reapply,
					success: res => {
						if (res.data.datas.state == 200) {
							let data = res.data.datas.data;
							let store_class_names = [];
							data.store_class_names.map(el => {
								store_class_names.push(el.split(','));
							});
							this.setData({
								store_class_names: store_class_names,
								store_class_commis_rates: data.store_class_commis_rates,
								sg_info: data.sg_info,
								paying_amount: data.paying_amount,
								sc_name: data.sc_name,
								joinin_year: data.joinin_year
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
	.step4Header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 153rpx;
		background-color: #FFF0C9;
		color: #887D5A;
		font-size: 30rpx;
	}

	.step4Header.err {
		background-color: #E76767;
	}

	.step4Header.err view {
		display: flex;
		flex-direction: column;
		line-height: 40rpx;
		color: #fff;
		font-size: 30rpx;
	}

	.step4Header.err view text:last-child {
		font-size: 24rpx;
	}

	.step4Header image {
		width: 53rpx;
		height: 53rpx;
		margin-right: 36rpx;
	}

	.table {
		text-align: center;
		margin-top: 50rpx;
	}

	.table-title {
		line-height: 120rpx;
		color: #313131;
		font-size: 30rpx;
	}

	.tab-list {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 709rpx;
		margin: 0 auto;
	}

	.tab-list text {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		width: 177rpx;
		border-right: 1rpx solid #fff;
		border-bottom: 1rpx solid #fff;
		height: 90rpx;
		line-height: 45rpx;
		padding: 0 10rpx;
		font-size: 26rpx;
		color: #6d6d6d;
		box-sizing: border-box;
		background-color: #f7f7f7;
	}

	.tab-list text.s {
		background-color: #ECECEC;
	}

	.navigation {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #F92938;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
		font-size: 30rpx;
	}
</style>
