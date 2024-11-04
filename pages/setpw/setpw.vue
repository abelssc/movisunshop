<template>
<view>
<view class="bg">
  <image :src="img_url+'bindBg.png'"></image>
</view>

<view class="form">
    <view class="form_item">
        <label for="phone">
            <text>{{$L('手机号')}}</text>
        </label>
        <input type="number" maxlength="11" @input="phoneInput" :value="info.member_mobile" :disabled="info.member_mobile?true:false" id="phone" :placeholder="$L('请输入手机号')"></input>
    </view>

    <view class="form_item" style="justify-content: space-between;">
        <label for="yzm">
            <text>{{$L('验证码')}}</text>
        </label>
        <input type="text" data-name="phone_code" @input="inputHandle" id="yzm" :placeholder="$L('请输入验证码')"></input>
        <view class="btn" @tap="sendcode">{{btn_txt}}</view>
    </view>

    <view class="form_item">
        <label for="password">
            <text>{{$L('密码')}}</text>
        </label>
        <input type="password" data-name="password" @input="inputHandle" id="password" :placeholder="$L('请输入密码')"></input>
    </view>

    <view class="form_item">
        <label for="repassword">
            <text>{{$L('确认密码')}}</text>
        </label>
        <input type="password" data-name="repassword" @input="inputHandle" id="repassword" :placeholder="$L('请确认密码')"></input>
    </view>

    <button class="submit" @tap="submit">{{$L('确 定')}}</button>
</view>
<common :title="$L('设置密码')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      btn_txt: this.$L('发送验证码'),
      phone: '',
      img_url: getApp().globalData.img_url,
      info: "",
      name: "",
	  time:60,
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('设置密码')
    });
    let key = uni.getStorageSync('token');
    this.setData({
      key
    });
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let key = this.key;
      let that = this
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=supplement_info',
        data: {
          key
        },
        success: res => {
          let phone = res.data.member_mobile;

          if (!phone) {
            uni.showModal({
              title: that.$L('提示'),
              content: that.$L('请完善个人信息后设置密码'),
              cancelText:this.$L('取消'),
              confirmText:this.$L('确定'),
              success: result => {
                if (result.confirm) {
                  uni.navigateTo({
                    url: '/pages/Perfectinfo/Perfectinfo?title='+that.$L('完善个人信息')
                  });
                } else {
                  uni.navigateBack({});
                }
              }
            });
          }

          this.setData({
            info: res.data,
            phone: res.data.member_mobile ? res.data.member_mobile : ''
          });
        }
      });
    },

    phoneInput(e) {
      this.setData({
        phone: e.detail.value
      });
    },

    // 发送验证码
    sendcode() {
		let {
		  key,
		  info,
		  phone
		} = this;
		if(!phone){
			uni.showToast({
			  title: this.$L('请输入手机号'),
			  icon: 'none'
			});
			return;
		}
      if (this.time != 60) return;
      

      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(phone)) {
        uni.showToast({
          title: this.$L('请输入正确的手机号'),
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login_mobile&mod=send_sms_mobile',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key,
          client: 'wx_xcx',
          type: 4,
          mobile: phone
        },
        success: res => {
          if (res.data.code == 200 && res.data.datas.state == 'true') {
            uni.showToast({
              title: res.data.datas.msg
            });
            this.setData({
              btn_txt: '60秒'
            });
            this.timer = setInterval(() => {
              this.time_out();
            }, 1000);
          } else {
            uni.showToast({
              title: res.data.datas.msg,
              icon: 'none'
            });
          }
        }
      });
    },

    time_out() {
      if (this.time <= 0) {
        clearInterval(this.timer);
        this.setData({
          btn_txt: this.$L('再次发送')
        });
        this.time = 60;
        return;
      }

      this.time--;
      this.setData({
        btn_txt: this.time + '秒'
      });
    },

    // 
    inputHandle(e) {
      let name = e.currentTarget.dataset.name;
      this.setData({
        [name]: e.detail.value
      });
    },

    // 
    submit() {
      let {
        key,
        info,
        phone_code,
        password,
        repassword,
        phone
      } = this;

      if (!phone_code || !password || !repassword || !phone) {
        uni.showToast({
          title: this.$L('请完善信息'),
          icon: 'none'
        });
        return;
      }

      if (password != repassword) {
        uni.showToast({
          title: this.$L('确认密码与原密码不一致'),
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=editpwd',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key,
          phone: phone,
          phone_code,
          password
        },
        success: res => {
          if (res.data.datas.state == 200) {
            uni.showToast({
              title: res.data.datas.msg
            });
            setTimeout(() => {
              uni.navigateBack({});
            }, 2000);
          } else {
            uni.showToast({
              title: res.data.datas.msg,
              icon: 'none'
            });
          }
        }
      });
    }

  }
};
</script>
<style>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 750rpx;
  height: 100vh;
  z-index: -1;
}

.bg image {
  width: 750rpx;
  height: 100vh;
}

.form {
  padding: 120rpx 70rpx 0;
  box-sizing: border-box;
  width: 750rpx;
  margin: 0 auto;
}

.form .form_item {
  position: relative;
  display: flex;
  align-items: center;
  height: 96rpx;
  color: #ccc;
  font-size: 28rpx;
}

.form .form_item::after {
  position: absolute;
  content: '';
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1rpx;
  background-color: #ddd;
  transform: scaleY(0.5);
}

.form .form_item label {
  display: flex;
  align-items: center;
  flex: 0 0 196rpx;
}

.form .form_item label image {
  width: 22rpx;
  height: 0;
  margin-right: 10rpx;
}

.form .form_item input {
  flex: 1;
  line-height: 80rpx;
  border: none;
  color: #333;
  padding-left: 20rpx;
}

.form .form_item .change {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15rpx;
}

.form .form_item .change image {
  width: 31rpx;
  height: 0;
}

.form .form_item .btn {
  min-width: 150rpx;
  max-width: 200rpx;
  border: 1rpx solid #ff2f43;
  color: #ff2f43;
  text-align: center; 
  border-radius: 4rpx;
  padding: 10rpx 0;
  font-size: 20rpx; 
}

.submit {
  display: block;
  height: 74rpx;
  width: 615rpx;
  margin: 100rpx auto 0;
  background-color: #ff2f43;
  color: #fff;
  font-size: 28rpx;
  border-radius: 37rpx;
  border: none;
}

</style>