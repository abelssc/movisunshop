<template>
<view>
<view class="pay">{{$L('选择支付方式')}}</view>

<radio-group class="pay_mode" @change="changePay">
  <view v-for="(item, index) in paymentList" :key="index" class="pay_item">
    <label :for="'mode'+item.payment_id">
      <view class="pay_img">
        <image :src="item.img" mode="widthFix"></image>
      </view>
      <view class="pay_name">
        <text>{{titleName}}：{{$L('￥')}}{{p}}</text>
        <view>{{item.payment_name}} <text v-if="item.payment_code=='predeposit' && disable" style="margin-left: 20rpx">{{$L('余额不足，可用余额')}}{{predepoit}}</text></view>
      </view>
    </label>
    <radio :id="'mode'+item.payment_id" :disabled="item.payment_code=='predeposit'&&disable" :checked="item.payment_code==payment" :value="item.payment_code" color="#FC8800"></radio>
  </view>
</radio-group>  

<view class="footer" @tap="pay">{{$L('确定')}}</view>

<view class="pw-wrap" v-if="show">
  <view class="pw-modal">
    <view class="pw-title">
      <text>{{$L('请输入支付密码')}}</text>
      <view class="modal-close" @tap="hidePayType">
        <image src="/static/images/pwclose.png"></image>
      </view>
    </view>

    <view class="modal-main">
      <input type="password" v-model="pw" @input="getpw"></input>
      <navigator open-type="redirect" url="/pages/setpw/setpw" hover-class="none">
        <text>{{$L('忘记密码？去找回密码')}}</text>
      </navigator>
      <button @tap="paypw">{{$L('确定')}}</button>
    </view>
  </view>
</view>

<common :title="$L('支付')"></common>
</view>
</template>

<script>
// addons/pages/pay/pay.js
const app = getApp();
let flag = true;

export default {
  data() {
    return {
      key: '',
      order_sn: '',
      p: '',
      type: '',
      paymentList: [],
      payment: '',
      disable: false,
      show: false,
      predepoit: "",
      pw: "",
	  titleName: this.$L('商品总额'),
	  img_url: getApp().globalData.img_url,
	  payFrom:'other',
	  sourceType:''
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('支付')
    });
    const key = uni.getStorageSync('token');
    if (!key) {
      getApp().globalData.goLogin();
    } 
	let titlename = options.type == 'ladder' ? this.$L('定金金额') : this.$L('商品总额');
    this.setData({
      key,
      ...options,
	  titleName: titlename,
    });
	
	this.sourceType = options.type;
	this.payFrom = options.payFrom;
	
    this.getPayMode();
    this.getMyAvailable();
  },
  methods: {
	  /** 支付成功及失败页面跳转方法
	   *  支付成功,如果是从订单列表过来，则需要返回订单列表，并通知页面刷新，否则直接跳转订单列表页面	
	   *  支付失败（包含用户取消支付），如果是从订单列表过来，则需要返回订单列表，否则直接跳转订单列表页面
	   */
	  paySuccessTips(type) {
	  	if (this.sourceType == 'presale') {   //预售
			if(this.payFrom == "orderList"){ 	//订单列表
				if (type == 'success') { //支付成功
					uni.showToast({
						title: this.$L('支付成功!'),
						icon: 'none',
						duration: 700
					})
					const pages = getCurrentPages(); //当前页面栈  
					if (pages.length > 1) {
						const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
						beforePage.$vm.getOrderList(); //触发上个面中的方法获取订单列表 *getOrder为上个页面的方法*
					}
					setTimeout(() => {
						uni.navigateBack({delta:2})
					}, 1000)
				} else if (type == 'fail') { //支付失败
					uni.showToast({
						title: this.$L('支付失败'),
						icon: 'none',
						duration: 700
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
			}else{
				uni.redirectTo({
					url: '/addons/pages/presaleOrder/presaleOrder'
				});
			}
	  	} else if(this.sourceType == 'ladder'){	//阶梯团
	  		uni.redirectTo({
	  			url: '/addons/pages/ladderOrder/ladderOrder'
	  		});
	  	}
	  },
	  
	  
	  
	  
    // 获取支付方式
    getPayMode() {
      let {
        key,
        order_sn,
        type
      } = this;
	  let client_type = '';
	  //#ifdef APP-PLUS
		client_type = 'app';
	  //#endif
	  //#ifdef MP-WEIXIN
		client_type = 'xcx';
	  //#endif
	  //#ifdef H5
		client_type = this.$isWeiXinBrower()?'h5_weixin':'h5_brower';
	  //#endif
      let url = type == 'ladder' ? getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=payment&sld_addons=pin_ladder' : getApp().globalData.ser_url + '/index.php?app=buy&mod=payment&sld_addons=presale';
      uni.request({
        url: url,
        data: {
          key,
          order_sn,
          client_type: client_type
        },
        success: res => {
          if (res.data.status == 200) {
            let list = res.data.data.payment;
            const imgs = {
              predeposit: this.img_url+"yepay.png",
              mini_wxpay: this.img_url+"wxpay.png",
			  alipay: this.img_url+"alipay.png",
			  weixin: this.img_url+"wechat.png",
			  wxpay_jsapi: this.img_url+"wechat.png",
			  wxpay_h5api: this.img_url+"wechat.png",
            };
            list.map(el => {
              el.img = imgs[el.payment_code];
            });

            for (let i = 0; i < list.length; i++) {
              if (list[i].payment_code == 'predeposit') {
                let el = list[i];
                list.splice(i, 1);
                list.push(el);
                break;
              }
            }

            this.setData({
              paymentList: list,
              payment: list[0].payment_code
            });
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        }
      });
    },

    // 获取用户余额
    getMyAvailable() {
      let that = this,
          key = that.key;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key,
        method: 'GET',

        success(res) {
          let disable = false;

          if (parseFloat(that.p) <= parseInt(res.data.datas.predepoit)) {
            disable = false;
          } else {
            disable = true;
          }

          that.setData({
            predepoit: res.data.datas.predepoit,
            disable
          });
        },

        error: function (err) {}
      });
    },

    changePay(e) {
      this.setData({
        payment: e.detail.value
      });
    },

    getpw(e) {
      this.setData({
        pw: e.detail.value
      });
    },

    hidePayType() {
      this.setData({
        show: false
      });
    },

    pay() {
      if (!flag) return;
      let {
        payment,
        key,
        order_sn,
        type
      } = this;

      if (payment == 'predeposit') {
        this.setData({
          show: true
        });
      } else {
        this.goPay();
      }
    },

    paypw() {
      let {
        pw
      } = this;

      if (!pw) {
        uni.showToast({
          title: this.$L('请输入密码'),
          icon: 'none'
        });
        return;
      }

      this.goPay();
	  this.pw = '';
    },

    goPay() {
      let {
        payment,
        key,
        order_sn,
        type,
        pw
      } = this;
	  let that = this;
      flag = false;
      uni.showLoading({
        title: that.$L('正在请求支付...')
      });
	  
      let params = {
        key,
        order_sn,
        payment_code: payment
      };

      if (payment == 'predeposit' && pw) {
        params.password = pw;
      }
	  
	  if (payment == 'mini_wxpay') {
		  uni.login({
		    success: code => {
		      let url = type == 'ladder' ? getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_xcx&sld_addons=pin_ladder&code=' + code.code : getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_xcx&sld_addons=presale&code=' + code.code;
		      uni.request({
		        url: url,
		        data: params,
		        method: 'POST',
		        header: {
		          'Content-Type': 'application/x-www-form-urlencoded'
		        },
		        success: res => {
		          if (res.data.state == 200 || res.data.status == 200) {
		            if (payment == 'mini_wxpay') {
		              let info = res.data.info;
		              uni.requestPayment({
		                timeStamp: info.timeStamp,
		                nonceStr: info.nonceStr,
		                package: info.package,
		                signType: info.signType,
		                paySign: info.paySign,
		                success: result => {
		                  this.goOrderPage();
		                }
		              });
		            } else {
		              this.goOrderPage();
		            }
		          } else {
		            uni.showToast({
		              title: res.data.msg,
		              icon: 'none'
		            });
		          }
		  
		          flag = true;
		        },
		        error: err => {
		          flag = true;
		        },
		        complete: () => {
		          uni.hideLoading();
		        }
		      });
		    }
		  });
	  }else{
		  that.goPayCommon();
	  }
    },
	
	//支付
	goPayCommon() {
		let {
		  payment,
		  key,
		  order_sn,
		  type,
		  pw
		} = this;
		let _this = this;
		let params = {};
		//#ifdef APP-PLUS
		params.client = 'app';
		//#endif
		params.key = key;
		params.order_sn = order_sn;
		params.payment = payment;
		if (payment == 'predeposit' && pw) {
		  params.password = pw;
		}
		let url = type == 'ladder' ? getApp().globalData.ser_url + '/index.php?app=buy_ladder&mod=topay&sld_addons=pin_ladder': getApp().globalData.ser_url + '/index.php?app=buy&mod=topay&sld_addons=presale';
		uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: params,
			success: function(res) { 
				 uni.hideLoading();
				if (res.data.status == 300) {
					let tmp_params = res.data.url_param;
					let tar_url = getApp().globalData.ser_url + '/index.php?';
					//#ifdef APP-PLUS
					for(let i in tmp_params){
						if(tar_url.indexOf('?') > -1){
							tar_url += `&${ i }=${ tmp_params[ i ] }`;
						}else{
							tar_url += `?${ i }=${ tmp_params[ i ] }`;
						}
					}
					uni.request({
						url: tar_url,
						success: function(res_end) {
							if (res_end.data.datas.status == 0) {
								uni.showToast({
									title: res_end.data.datas.msg,
									icon: 'none'
								});
							} else {
								uni.requestPayment({
									provider: payment == 'alipay' ? 'alipay' : 'wxpay',
									orderInfo: res_end.data.datas.result, //订单数据
									success: function(result) {
										uni.showToast({
											title: this.$L('支付成功'),
											icon: 'none'
										});
										//支付成功,如果是从订单列表过来，则需要返回订单列表，并通知页面刷新，否则直接跳转订单列表页面
										_this.paySuccessTips('success');
									},
									fail: function(err) {
										//支付失败（包含用户取消支付）
										_this.paySuccessTips('fail');
									}
								});
							}
						}
					});
					//#endif
					//跳转支付
					//#ifdef H5
					for(let i in tmp_params){
						if (i == 'app') {
							tar_url += i + '=' + tmp_params[i];
						} else {
							tar_url += '&' + i + '=' + tmp_params[i];
						}
					}
					window.location.href = tar_url;
					//#endif
				}else if(res.data.status == 200){ //余额支付
					//支付成功
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					_this.paySuccessTips('success');
					//#ifdef H5
					//支付成功，跳转成功页面
					//#endif
				}else if(res.data.status == 255){
					//支付失败
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					_this.show = false;
				}
				flag = true;
			}
		});
	},
	

    goOrderPage() {
      let {
        payment,
        key,
        order_sn,
        type
      } = this;
      uni.showToast({
        title: this.$L('支付成功')
      });
      let page = getCurrentPages();

      if (type == 'presale') {
        if (page.length > 1 && (page[page.length - 2].route == 'addons/pages/presaleOrder/presaleOrder' || page[page.length - 2].route == 'addons/pages/preOrderDetail/preOrderDetail')) {
          page[page.length - 2].$vm.refresh();

          if (page.length > 2 && page[page.length - 3].route == 'addons/pages/presaleOrder/presaleOrder') {
            page[page.length - 3].$vm.refresh();
          }

          setTimeout(() => {
            uni.navigateBack({});
          }, 2000);
        } else {
          setTimeout(() => {
            uni.redirectTo({
              url: '/addons/pages/presaleOrder/presaleOrder'
            });
          }, 2000);
        }
      } else {
        if (page.length > 1 && (page[page.length - 2].route == 'addons/pages/ladderOrder/ladderOrder' || page[page.length - 2].route == 'addons/pages/ladderOrderDetail/ladderOrderDetail')) {
          page[page.length - 2].$vm.refresh();

          if (page.length > 2 && page[page.length - 3].route == 'addons/pages/ladderOrder/ladderOrder') {
            page[page.length - 3].$vm.refresh();
          }

          setTimeout(() => {
            uni.navigateBack({});
          }, 2000);
        } else {
          setTimeout(() => {
            uni.redirectTo({
              url: '/addons/pages/ladderOrder/ladderOrder'
            }, 2000);
          });
        }
      }
    }

  }
};
</script>
<style>
/* addons/pages/pay/pay.wxss */

page {
  background-color: #f6f6f6;
}

.pay {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  color: #353535;
  padding: 0 20rpx;
  background-color: #fff;
}

.pay_mode {
  background-color: #fff;
}

.pay_item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 140rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #E8E8E8;
}

.pay_item label{
  flex: 1;
  display: flex;
  align-items: center;
}

.pay_item label image{
  width: 52rpx;
  height: 0;
  margin-right: 50rpx;
}

.pay_item .pay_name>text{
  display: block;
  color: #353535;
  font-size: 28rpx;
}

.pay_item .pay_name view{
  display: flex;
  align-items: center;
  color: #808080;
  font-size: 24rpx;
  margin-top: 20rpx;
}

.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #FC8800;
  color: #fff;
  font-size: 34rpx;
  text-align: center;
  line-height: 100rpx;  
  letter-spacing: 15rpx;
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

@keyframes fade{
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
  background-color: #FC8800;
}
</style>