<template>
<view>
<view class="register">
  <form @submit="register">
    <view class="form-item getcode">
      <input :placeholder="$L('请输入手机号')" :value="mobile" type="number" maxlength="11" @input="mobileInput" name="mobile"></input>
      <button @tap="sendCode" :disabled="btnDisable">{{time_out_txt}}</button>
    </view>

    <view class="form-item">
      <input :placeholder="$L('请输入验证码')" name="code"></input>
    </view>

    <view class="form-item">
      <input :placeholder="type=='register' ? $L('密码') : $L('请输入新密码')" type="password" name="password"></input>
    </view>

    <view class="form-item">
      <input :placeholder="type=='register' ? $L('请确认密码') : $L('请确认新密码')" type="password" name="repassword"></input>
    </view>

    <button class="submit" form-type="submit">{{type=='register' ?$L('注册'):$L('提交')}}</button>
  </form>
</view>

<common :title="$L('推手注册')"></common>
</view>
</template>

<script>
const PhoneReg = /(1[3-9]\d{9}$)/;

export default {
  data() {
    return {
      time_out_txt: this.$L('获取验证码'),
      mobile: '',
      type: 'register',
      btnDisable: false,
      time: 60,
	  isSend: false, //禁止重复点击事件
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('注册')
    });
    this.setData({ ...options
    });

    if (options.type == 'forgotPassword') {
      uni.setNavigationBarTitle({
        title: this.$L('找回密码')
      });
    }
  },
  methods: {
    // 
    mobileInput(e) {
      this.setData({
        mobile: e.detail.value
      });
    },

    //发送验证码
    sendCode() {
      const {
        mobile,
        type
      } = this;
      if(this.isSend){
		return;
      } else if (!mobile) {
        uni.showToast({
          title: this.$L('请输入手机号'),
          icon: 'none'
        });
        return;
      } else if (!PhoneReg.test(mobile)) {
        uni.showToast({
          title: this.$L('请输入正确的手机号'),
          icon: 'none'
        });
        return;
      }
      this.isSend = true;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login_mobile&mod=send_sms_mobile&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          mobile: mobile,
          type: type == 'register' ? '1' : '3'
        },
        success: res => {
		  this.isSend = false;
          if (res.data.code == 200) {
            if (res.data.datas.state == 'failuer') {
              uni.showToast({
                title: res.data.datas.msg,
                icon: 'none'
              });
            } else {
              this.setData({
                btnDisable: true,
                time_out_txt: this.$L('60秒后再试')
              });
              this.time_out();
            }
          } else {
            uni.showToast({
              title: res.data.datas.msg,
              icon: 'none'
            });
          }

          if (res.data.status == 250) {
            uni.showToast({
              title: res.data.datas.msg,
              icon: 'none'
            });
          }
        },
		fail() {
			this.isSend = false;
		}
      });
    },

    // 倒计时
    time_out() {
      let {
        time
      } = this;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      if (time <= 1) {
        this.setData({
          time: 60,
          btnDisable: false,
          time_out_txt: this.$L('再次获取验证码')
        });
        return;
      }

      let newTime = time - 1;
      this.setData({
        time: newTime,
        time_out_txt: `${newTime}${this.$L('秒后再试')}`
      });
      this.timer = setTimeout(() => {
        this.time_out();
      }, 1000);
    },

    //register
    register(e) {
	  let that = this;
      const {
        type
      } = this;
      const params = e.detail.value;

      if (!params.mobile || !params.code || !params.password || !params.repassword) {
        uni.showToast({
          title: that.$L('请完善信息'),
          icon: 'none'
        });
        return;
      }

      if (!PhoneReg.test(params.mobile)) {
        uni.showToast({
          title: that.$L('请输入正确的手机号'),
          icon: 'none'
        });
        return;
      }

      if (params.password != params.repassword) {
        uni.showToast({
          title: that.$L('两次密码输入不一致'),
          icon: 'none'
        });
        return;
      }
      that.isSend = true;
      let url = getApp().globalData.ser_url + (type == 'register' ? '/index.php?app=login_mobile&mod=mobileregister&sld_addons=spreader' : '/index.php?app=login_mobile&mod=editpass&sld_addons=spreader');
      let data = type == 'register' ? {
        mobile: params.mobile,
        password: params.password,
        client: 'wx_xcx',
        vcode: params.code
      } : {
        password: params.password,
        mobile: params.mobile,
        code: params.code
      };
      uni.request({
        url: url,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data,
        success: res => {
          // if (res.data.datas.state == 'success'||res.data.datas.state == 'true') {
          if (res.data.state == 'success'||res.data.state == 'true') {
            // if (typeof res.data.datas.key == 'undefined') {
            //   return false;
            // } else {
              let tipMsg = type == 'register' ? that.$L('注册成功，请登录') : that.$L('密码重置成功，请登录');
              uni.showToast({
                title: tipMsg,
                icon: 'none'
              });
              setTimeout(() => {
                uni.navigateBack({});
              }, 1500);
            // }
          } else {
            // let msg = '注册出错';

            // if (res.data.datas.error) {
            //   msg = res.data.datas.error;
            // }
           
            uni.showToast({
              // title: res.data.datas.msg,
              title: res.data.msg,
              icon: 'none'
            });
          }
        },
		fail(){
			that.isSend = false;
		}
      });
    }

  }
};
</script>
<style>
page{
  background-color: #F6F7FB;
  width: 750rpx;
  margin: 0 auto;
}

.register{
  width: 658rpx;
  padding: 46rpx;
}

.register .form-item{
  width: 658rpx;
  margin-bottom: 30rpx;
}

.register .form-item input{
  width: 100%;
  height: 94rpx;
  padding-left: 20rpx;
  font-size: 26rpx;
  background-color: #fff;
}

.register .getcode{
  display: flex;
  align-items: center;
}

.register .getcode input{
  flex: 1;
}

.register .getcode button{
  flex: 0 0 258rpx;
  width: 258rpx;
  border: none;
  color: #5C5C5C;
  font-size: 26rpx;
  height: 94rpx;
  line-height: 94rpx;
  margin: 0;
  padding: 0;
  border-radius: 0;
  background-color: #E6E9EE;
}

.register .submit{
  width: 100%;
  height: 94rpx;
  color: #fff;
  font-size: 36rpx;
  background-color: #FC3357;
  border-radius: 10rpx;
  line-height: 94rpx;
  margin-top: 50rpx;
}

button::after{
  border: none;
}

</style>