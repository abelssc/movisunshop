<template>
	<view>
		<!--addons/pages/liveEditAuthorInfo/liveEditAuthorInfo.wxml-->
		<view v-if="type=='nick_name'" class="edit_nick_name">
			<view class="input_wrap">
				<input type="text" :value="val" :maxlength="limit_num" :placeholder="$L('请输入昵称,最多输入8个字符~')" placeholder-style="font-size:20rpx;color:#949494"
				 @input="inputCon" confirm-type="done" @confirm="saveCon"></input>
				<image v-if="val" class="clear_con" @tap="clearCon" :src="img_url+'live/input_clear.png'"></image>
			</view>
			<view v-if="val" class="count">
				<text class="cur_count">{{val.length}}</text><text>/{{limit_num}}</text>
			</view>
		</view>

		<view v-if="type=='introduction'" class="edit_introduction">
			<view class="introduction">
				<textarea @input="inputCon" @confirm="saveCon" :placeholder="$L('请输入简介，最多100个字符~')" :maxlength="limit_num"
				 :value="val" placeholder-style="color:#949494"></textarea>
				<view class="count">
					<block v-if="val">
						<text class="cur_count">{{val.length}}</text>
						<text>/</text>
					</block>
					<text>{{limit_num}}</text>
				</view>
			</view>

		</view>
		
		<view class="bottom-btn">
			<button @tap="saveCon">{{$L('保存更改')}}</button>
		</view>
	</view>
</template>

<script>
	import request from "../../../utils/request";

	export default {
		data() {
			return {
				img_url: getApp().globalData.img_url,
				//图片地址
				val: '',
				//内容
				limit_num: 0 //限制长度

			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
      uni.setNavigationBarTitle({
          title: this.$L('编辑信息')
      });
			uni.setNavigationBarTitle({
				title: options.title
			});
			this.setData({ ...options,
				limit_num: options.type == 'nick_name' ? 8 : 100
			});
		},
		onUnload: function() {},
		methods: {
			//清空输入值
			clearCon() {
				this.setData({
					val: ''
				});
			},

			//input输入事件
			inputCon(e) {
				let {
					limit_num
				} = this;
				let con = e.detail.value;

				if (con.length <= limit_num) {
					this.setData({
						val: con
					});
				}
			},

			//保存数据
			saveCon() {
				let {
					val,
					type
				} = this;

				if (val.trim().length == 0) {
					uni.showToast({
						title: this.$L('请输入') + type == "introduction" ? this.$L('简介') : this.$L('昵称'),
						icon: 'none'
					});
				} else {
					let data = {
						key: uni.getStorageSync('token')
					};

					if (type == 'introduction') {
						data.introduction = val;
					} else {
						data.member_nickname = val;
					}

					request({
						url: getApp().globalData.svideo_url + '/index.php?app=author&mod=editInfo',
						method: 'POST',
						data: data
					}).then(res => {
						if (res.state == 200) {
							setTimeout(() => {
								uni.navigateBack({});
							}, 1500);
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				}
			}

		}
	};
</script>
<style>
	/* addons/pages/liveEditAuthorInfo/liveEditAuthorInfo.wxss */

	page {
		background-color: #F8F8F8;
		width: 750rpx;
		margin: 0 auto;
		height: 100%;
	}

	.edit_nick_name,
	.edit_introduction {
		width: 100%;
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.edit_nick_name .input_wrap {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 83rpx;
		padding: 0 20rpx;
		width: 710rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	.edit_nick_name .input_wrap input {
		width: 450rpx;
		color: #2D2D2D;
		font-size: 26rpx;
	}

	.edit_nick_name .input_wrap .clear_con {
		width: 43rpx;
		height: 43rpx;
	}

	.edit_nick_name .count {
		width: calc(750rpx-39rpx);
		display: flex;
		justify-content: flex-end;
		margin-right: 39rpx;
		margin-top: 19rpx;
	}

	.edit_nick_name .count text,
	.edit_introduction .introduction .count text {
		font-size: 22rpx;
		color: #949494;
	}

	.edit_nick_name .count .cur_count,
	.edit_introduction .introduction .count .cur_count {
		color: #FC1C1C;
	}

	.edit_introduction .introduction {
		margin-top: 20rpx;
		width: 710rpx;
		margin-left: 20rpx;
		height: 300rpx;
		position: relative;
	}

	.edit_introduction .introduction textarea {
		width: 670rpx;
		height: 258rpx;
		background: #DDDDDD;
		border: 1rpx solid rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		padding: 20rpx;
		color: #2D2D2D;
		font-size: 26rpx;
	}

	.edit_introduction .introduction .count {
		position: absolute;
		right: 15rpx;
		bottom: 10rpx;
		z-index: 2;
	}
	
	.bottom-btn button {
		display: block;
		height: 37px;
		width: 307px;
		margin: 50px auto 0;
		background-color: #ff2f43;
		color: #fff;
		font-size: 14px;
		border-radius: 18px;
		border: none;
	}
</style>
