<template>
<view>
<!--<import src="../templates/not.wxml"></import>-->

<view class="recharge">
  <view v-if="payMode.length">
    <view class="input">
      <label for="money">{{$L('金额')}}</label>
      <input type="number" v-model="mon" @blur="money" :placeholder="$L('请输入充值金额')"></input>
	  <label style="padding-left: 28rpx;">{{$L('元')}}</label>
    </view>
    <view class="pay_mode">
      <radio-group @change="changePaymode">
        <label v-for="(item, index) in payMode" :key="index" :for="item.payment_code" v-if="item.payment_state_text==$L('开启中')">
          <view class="mode">
            <view class="pay_left">
              <image :src="img_url+item.url" mode="widthFix"></image>
              <text>{{item.payment_name}}</text>
            </view>
            <view class="pay_right">
              <radio :value="item.payment_code" :checked="item.payment_code==payment_code" :id="item.payment_code"></radio>
            </view>
          </view>
        </label>
      </radio-group>
    </view>

    <button class="pay" @tap="rechargeAction">{{$L('充值')}}</button>
  </view>

  <view v-else>
    <block data-type="template" data-is="not" data-attr="img,content">
  <view class="nothasData">
    <view class="img">
      <image :src="img"></image>
    </view>
    <text>{{content}}</text>
  </view>
</block>
  </view>
</view>

<common :title="$L('我要充值')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      payMode: '',
      // 充值方式列表
      mon: '',
      // 充值金额
      payment_code: '',
      // 选择的充值方式
      img: getApp().globalData.img_url + "order_w.png",
      content: this.$L('平台没有开启充值方式，请稍后充值'),
	  flag: true,
	  img_url:getApp().globalData.img_url,
	  pay_sn:'',
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var key = uni.getStorageSync('token');
    uni.setNavigationBarTitle({
      title: this.$L('我要充值')
    });

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.getPaymentList();
  },
  methods: {
    // 获取充值方式
    getPaymentList() {
      let that = this,
	  key = that.key;
	  let client = '';
	  //#ifdef APP-PLUS
	  client = 'app';
	  //#endif
	  //#ifdef H5
	  let browerFlag = this.$isWeiXinBrower();
	  client = browerFlag ? 'h5_weixin' : 'h5_brower';
	  //#endif
	  //#ifdef MP-WEIXIN
	  client = 'xcx';
	  //#endif
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=common&mod=getPaymentList',
        method: 'GET',
        data: {
          paytype: 'predeposit',
          client: client
        },
        success: function (res) {
          if (res.data.state == 200) {
            let dat = res.data.data;

            dat.map(el => {
              if (el.payment_name == that.$L('银行卡')) {
                el.url = 'yinghangka@2x.png';
              }

              if (el.payment_code == 'mini_wxpay') {
                el.url = 'Group4@2x.png';
              }
			  if (el.payment_code == 'alipay') {
			  	//支付宝支付
			  	el.url = 'zifubao@2x.png';
			  }
			  if (el.payment_code == 'weixin' || el.payment_code == 'wxpay_jsapi' || el.payment_code == 'wxpay_h5api') {
			  	//微信支付
			  	el.url = 'Group4@2x.png';
			  }
            });
            that.setData({
              payMode: dat,
              payment_code: dat[0].payment_code
            });
          }
        }
      });
    },

    // 选择充值方式
    changePaymode(e) {
      this.setData({
        payment_code: e.detail.value
      });
    },

    //充值金额
    money(e) {
      let mon = e.detail.value;
	  //限制充值金额只能输入整数
	  // mon = mon.replace(/[^\d]/g, '') * 1;
	  mon = mon.replace(/[^\.\d]/g, '');
	  if (mon.indexOf(".") > 0 && mon.length - mon.indexOf(".") > 2 && mon != "") {
	  	mon=Math.floor(mon * 100) / 100;
	  }
	  if(mon > 5000){
		  uni.showToast({
		  	title:this.$L('最大充值金额5000'),
			icon:'none',
			duration:700
		  })
		  this.mon =5000;
	  }else if(mon <= 0.01){
		uni.showToast({
			title:this.$L('最小充值金额0.01'),
			icon:'none',
			duration:700
		})
		this.mon =0.01;
	  }else{
		  this.mon = mon;
	  }
    },

    // 充值
    rechargeAction() {
      let that = this,
          mon = that.mon,
          payment_code = that.payment_code,
          key = that.key;

      if (!mon) {
        uni.showToast({
          title: that.$L('请输入金额'),
          icon: 'none'
        });
        return;
      }

      if (that.flag) {
        that.flag = false;
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=cash&mod=rechargeAction&key=' + key,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            pdr_amount: mon,
            payment_code: payment_code
          },

          success(res) {
            let pay_sn = res.data.data.pdr_sn;
            let options = {
              key: key,
              pay_sn: pay_sn
            };
			that.pay_sn = pay_sn;
			that.goPay();
          },

          error: function (err) {
			  that.flag = true;
		  }
        });
      }
    },
	
	//充值支付
	goPay() {
		let { key,pay_sn,payment_code } = this;
		//#ifdef MP-WEIXIN
			this.wxPay();
		//#endif
		//#ifdef APP-PLUS
			this.appPay();
		//#endif
		//#ifdef H5
			location.href = getApp().globalData.ser_url + "/index.php?app=pay&mod=pay_new&key=" + key + "&pay_sn=" + pay_sn + "&payment_code=" + payment_code;
		//#endif
		this.flag = true;
	},

    // 微信小程序支付
    wxPay() {
      let that = this;
	  let { key,pay_sn } = that;
      uni.showLoading({
        title: that.$L('正在请求支付'),
        mask: true
      });
      uni.login({
        success: code => {
          uni.request({
            url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_xcx&code=' + code.code,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              key: key,
              pay_sn: pay_sn
            },
            success: function (res) {
              if (res.data.state == 200) {
                let info = res.data.info;
                uni.requestPayment({
                  // 调用微信支付
                  timeStamp: info.timeStamp,
                  nonceStr: info.nonceStr,
                  package: info.package,
                  signType: info.signType,
                  paySign: info.paySign,
                  success: function (result) {
                  },
                  error: function (er) {},
                  complete: function () {
                    that.flag = true;
                    uni.navigateBack({});
                  }
                });
              }
            },
            error: function (err) {
            },
            complete: () => {
              uni.hideLoading();
            }
          });
        }
      });
    },
	
	//APP支付
	appPay() {
		let {key,payment_code,pay_sn} = this;
		let _this = this;
		uni.showLoading({
		  title: _this.$L('正在请求支付'),
		  mask: true
		});
		uni.request({
		  url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_' + payment_code + '_app',
		  method: 'POST',
		  header: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  },
		  data: {
		    key: key,
		    pay_sn: pay_sn,
			payment_code: payment_code
		  },
		  success: function (res) {
		    if (res.data.datas.status == 0) {
				uni.hideLoading()
		    	uni.showToast({
		    		title: res.data.datas.msg,
		    		icon: 'none'
		    	});
				
		    } else {
				if (payment_code == 'alipay'){
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.data.datas.result, //订单数据
						success: function(res) {
							uni.hideLoading()
							//充值成功,如果是从充值列表过来，则需要返回充值列表，并通知页面刷新，否则直接跳转充值列表页面
							const pages = getCurrentPages(); //当前页面栈
							if (pages.length > 1) {
								const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
								beforePage.$vm.rechargeLogList(); //触发上个面中的方法获取充值列表 *rechargeLogList为上个页面的方法*
							}
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						},
						fail: function(err) {
							uni.hideLoading()
							//支付失败（包含用户取消支付）
							uni.showToast({
								title: JSON.stringify(err),
								icon: 'none'
							});
					
						}
					});
				} else if (payment_code == 'weixin'){
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: res.data.datas.result, //订单数据
						success: function(res) {
							uni.hideLoading()
							uni.showToast({
								title: _this.$L('充值成功'),
								icon: 'none'
							});
							//充值成功,如果是从充值列表过来，则需要返回充值列表，并通知页面刷新，否则直接跳转充值列表页面
							
						},
						fail: function(err) {
							//支付失败（包含用户取消支付）
							uni.hideLoading()
							uni.showToast({
								title: _this.$L('微信充值失败'),
								icon: 'none'
							});
						}
					});
				}
			}
		  },
		  error: function (err) {
		  },
		  complete: () => {
		    uni.hideLoading();
		  }
		});
	},

  }
};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
.recharge {
  width: 750rpx;
  min-height: calc(100vh - 30rpx);
  padding-top: 30rpx;
  background-color: #f5f5f5;
  font-family: 'PingFangSC-Light';
}

.input {
  display: flex;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  font-size: 30rpx;
  color: #333;
  padding-left: 30rpx;
}

.input input{
  width: 500rpx;
  height: 100rpx;
  line-height: 100rpx;
}

.input label {
  width: 100rpx;
  overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
}

.pay_mode {
  margin-top: 20rpx;
  background-color: #fff;
}

.pay_mode label {
  display: block;
}

.pay_mode label .mode {
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  align-items: center;
  color: #3c3f40;
  font-size: 30rpx;
  border-bottom: 1rpx solid #dfe1e2;
}

.pay_mode label .mode:last-child {
  border: none;
}

label .pay_left {
  display: flex;
  align-items: center;
}

label .pay_left image {
  width: 50rpx;
  height: 0;
  margin: 0 15rpx 0 30rpx;
}
label .pay_left text {
  width: 550rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
label .pay_right {
  padding-right: 21rpx;
}

label .pay_right image {
  width: 30rpx;
  height: 30rpx;
}

label .pay_right text {
  display: block;
  width: 28rpx;
  height: 28rpx;
  border: 1rpx solid #b8b8b8;
  border-radius: 50%;
}

.pay {
  background-color: #ffb80f;
  border-radius: 8rpx;
  line-height: 88rpx;
  color: #fff;
  margin: 50rpx 30rpx 0;
}

</style>