<template>
	<view>
		<form @submit="step1Submit" class="paddingB220">
			<!-- 店铺经营信息 -->
			<view class="form-item">
				<view class="form-list">
					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('商家帐号')+'&type=text&key=seller_name&val=' + seller_name + '&valid=seller_name&step=3'">
						<label>{{$L('商家帐号')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{seller_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="seller_name" :value="seller_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('店铺名称')+'&type=text&key=store_name&val=' + store_name + '&valid=store_name&step=3'">
						<label>{{$L('店铺名称')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{store_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="store_name" :value="store_name" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('店铺等级')+'&type=picker&key=sg_name&val=' + sg_name + '&id=' + sg_id + '&step=3&is_supplier='+ is_supplier">
						<label>{{$L('店铺等级')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{sg_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="sg_name" :value="sg_name" class="hide"></input>
							<input type="text" name="sg_id" :value="sg_id" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('开店时长')+'&type=picker&key=joinin_year_show&val=' + joinin_year_show + '&id=' + joinin_year + '&step=3'">
						<label>{{$L('开店时长')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{joinin_year_show}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="joinin_year" :value="joinin_year" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('店铺分类')+'&type=picker1&key=sc_name&val=' + sc_name + '&id=' + sc_id + '&step=3'">
						<label>{{$L('店铺分类')}}</label>
						<view class="list-right">
							<view class="content-wrap">{{sc_name}}</view>
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="sc_name" :value="sc_name" class="hide"></input>
							<input type="text" name="sc_id" :value="sc_id" class="hide"></input>
						</view>
					</navigator>

					<navigator class="list bw" hover-class="none" :url="'/integral/companyReg/companyEdit/companyEdit?title='+$L('经营类目')+'&type=category&key=vendor_category&step=3'">
						<label>{{$L('经营类目')}}</label>
						<view class="list-right">
							<image src="/static/integral/images/crright.png" class="more"></image>
							<input type="text" name="store_class_names" :value="store_class_names" class="hide"></input>
							<input type="text" name="store_class_ids" :value="store_class_ids" class="hide"></input>
						</view>
					</navigator>

					<view class="table">
						<view class="tab-list">
							<text>{{$L('一级类目')}}</text>
							<text>{{$L('二级类目')}}</text>
							<text>{{$L('三级类目')}}</text>
						</view>
						<block v-if="tabList.length">
							<view v-for="(item, index) in tabList" :key="index" class="tab-list tab-item">
								<text>{{item.gc_name1}}</text>
								<text>{{item.gc_name2}}</text>
								<text>{{item.gc_name3}}</text>
							</view>
						</block>
					</view>

				</view>
			</view>

			<button form-type="submit" class="submit-btn">{{$L('提交申请')}}</button>
		</form>

		<common :title="$L('店铺经营信息')"></common>
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
				apply_t: '',
				is_supplier: '',
				reapply: '0',
				key: "",
				sg_id: "",
				joinin_year: "",
				sc_id: "",
				tabList: "",
				store_class_ids: "",
				store_class_names: "",
				label: "",
				seller_name: '',
				store_name: '',
				sg_name: '',
				joinin_year_show: '',
				sc_name: '',
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
				params.sc_id=uni.getStorageSync('sc_id');
				let {
					apply_t,
					is_supplier,
					reapply,
					key
				} = this;

				if (!params.seller_name) {
					tip(this.$L('请输入商家帐号'));
					return false;
				}

				if (!params.store_name) {
					tip(this.$L('请输入店铺名称'));
					return false;
				}

				if (!params.sg_name) {
					tip(this.$L('请选择店铺等级'));
					return false;
				}

				if (!params.joinin_year) {
					tip(this.$L('请选择开店时长'));
					return false;
				}

				if (!params.sc_name) {
					tip(this.$L('请选择店铺分类'));
					return false;
				}

				if (!params.store_class_names) {
					tip(this.$L('请选择经营类目'));
					return false;
				}

				uni.request({
					url: getApp().globalData.ser_url +
						`/index.php?app=enterin&mod=step3&apply_t=${apply_t}&is_supplier=${is_supplier}&key=${key}&reapply=${reapply}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res.data.datas.state == 200) {
							uni.navigateTo({
								url: '/integral/companyReg/crStep4/crStep4?apply_t=' + apply_t + '&is_supplier=' + is_supplier +
									'&reapply=' + reapply + '&type=1'
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

					if (e.id) {
						switch (e.key) {
							case 'sg_name':
								this.setData({
									sg_id: e.id
								});
								break;

							case 'joinin_year_show':
								this.setData({
									joinin_year: e.id
								});
								break;

							case 'sc_name':
								this.setData({
									sc_id: e.id
								});
								break;

							default:
								break;
						}
					}
				} else if (e.key == 'vendor_category') {
					this.setData({
						tabList: e.tabList,
						store_class_ids: e.store_class_ids,
						store_class_names: e.store_class_names
					});
				}
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
						`/index.php?app=enterin&mod=dataOfStep&key=${key}&apply_t=${apply_t}&is_supplier=${is_supplier}&reapply=${reapply}&step=3`,
					success: res => {
						if (res.data.datas.state == 200) {
							let data = res.data.datas.data;
							let hasData = {};

							for (let i in data) {
								if (data[i]) {
									hasData[i] = data[i];
								}
							}

							let tabList = [];
							if(!uni.getStorageSync('sc_id')){
								uni.setStorageSync('sc_id', data.sc_id);
							}
							if (data.store_class_ids && data.store_class_names) {
								let ids = data.store_class_ids.split('|');
								ids.map((el, index) => {
									let a = el.split(',');
									a.map((el2, index2) => {
										if (!tabList[index]) {
											tabList[index] = {};
										}

										tabList[index]['gc_id' + (index2 + 1)] = el2;
									});
									tabList[index].ids = el;
								});
								let names = data.store_class_names.split(',');
								names.map((el, index) => {
									let a = el.split(' ');
									a.map((el2, index2) => {
										if (!tabList[index]) {
											tabList[index] = {};
										}

										tabList[index]['gc_name' + (index2 + 1)] = el2;
									});
									tabList[index].names = el;
								});
							}

							if (data.joinin_year) {
								hasData.joinin_year_show = data.joinin_year + '年';
							}

							this.setData({ ...hasData,
								tabList
							});
						}
						uni.getStorageInfo({
							success: function(res) {
								if (res.keys.length) {
									res.keys.map(el => {
										if (el.indexOf('enterin3_') > -1) {
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

	.table {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.table-title {
		line-height: 60rpx;
		color: #313131;
		font-size: 30rpx;
	}

	.tab-list {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 648rpx;
		margin: 0 auto;
	}

	.tab-list text {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		width: 216rpx;
		border-right: 1rpx solid #fff;
		border-bottom: 1rpx solid #fff;
		height: 90rpx;
		line-height: 45rpx;
		padding: 0 10rpx;
		font-size: 26rpx;
		color: #6d6d6d;
		box-sizing: border-box;
		background-color: #f0eeee;
	}

	.tab-list.tab-item text {
		background-color: #f7f7f7;
	}

	.tab-list.tab-item text.del-list {
		font-size: 28rpx;
		color: #f00;
	}
</style>
