<template>
<view>
  <view class="p-md">
      <image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
      <view class="avator">
        <view class="img">
          <image :src="info.member_avatar"></image>
        </view>
        <view class="we">{{$L('welcome')}}, {{info.member_name}} {{$L('请完善信息')}}</view>
      </view>

      <view class="form">
          <view class="form_item">
              <label for="phone">
                  <image :src="img_url+'b_user.png'" mode="widthFix"></image>
                  <text class="nickname">{{$L('呢称')}}</text>
              </label>
              <input type="text" id="phone" @input="nickInput" :value="info.member_nickname?info.member_nickname:''" :placeholder="$L('请输入呢称')"></input>
          </view>

          <view class="form_item">
              <label for="password">
                  <image :src="img_url+'b_phone.png'" style="width: 24rpx" mode="widthFix"></image>
                  <text class="nickname">{{$L('手机号')}}</text>
              </label>
              <input type="number" @input="phoneInput" :value="mobile" id="password" :placeholder="$L('请输入手机号')"></input>
          </view>

          <view class="form_item">
              <label for="yzm">
                  <text class="nickname">{{$L('验证码')}}</text>
              </label>
              <input type="text" @input="codeinput" id="yzm" :placeholder="$L('请输入验证码')"></input>
              <view v-if="issend" class="btn" @tap="sendcode">{{btn_txt}}</view>
              <view v-if="!issend" class="btn">{{btn_txt}}</view>
          </view>

          <button class="submit" @tap="submit">{{$L('确 定')}}</button>
      </view>
      <common :title="$L('完善个人信息')"></common>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      info: '',
      btn_txt: this.$L('发送验证码'),
      img_url: getApp().globalData.img_url,
      nickname: "",
      mobile: "",
      phone_code: "",
	  time:60,
	  issend: true,
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('完善个人信息')
    });
    let key = uni.getStorageSync('token');
    this.setData({
      key
    });
    uni.setNavigationBarTitle({
      title: options.title
    });
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let key = this.key;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=supplement_info',
        data: {
          key
        },
        success: res => {
          let info = res.data;
          this.setData({
            info: info,
            nickname: res.data.member_nickname,
            mobile: res.data.member_mobile
          });
        }
      });
    },

    phoneInput(e) {
      this.setData({
        mobile: e.detail.value
      });
    },

    // 发送验证码
    sendcode() {
		let {
		  key,
		  mobile
		} = this;
		if(!mobile){
			uni.showToast({
			  title: this.$L('请输入手机号'),
			  icon: 'none'
			});
			return;
		}
		this.setData({
			issend: false
		})
      if (this.time < 60) return;
      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(mobile)) {
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
          mobile
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
          btn_txt: this.$L('再次发送'),
		  issend: true
        });
        this.time = 60;
        return;
      }

      this.time--;
      this.setData({
        btn_txt: this.time + '秒'
      });
    },

    codeinput(e) {
      this.setData({
        phone_code: e.detail.value
      });
    },

    nickInput(e) {
      this.setData({
        nickname: e.detail.value
      });
    },

    submit() {
      let {
        key,
        mobile,
        phone_code,
        nickname
      } = this;

      if (nickname && nickname.lenght > 8) {
        uni.showToast({
          title: this.$L('昵称最长8位'),
          icon: 'none'
        });
        return;
      }

      if (!mobile || !nickname || !phone_code) {
        uni.showToast({
          title: this.$L('请完善信息'),
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=supplement_info_save',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key,
          phone: mobile,
          phone_code,
          nickname
        },
        success: res => {
          if (res.data.datas.state == 200) {
            uni.showToast({
              title: res.data.datas.msg
            });
            const page = getCurrentPages();
            if (page[page.length - 2].$vm.getUserInfo) {
              page[page.length - 2].$vm.getUserInfo();
            }

            setTimeout(() => {
              uni.navigateBack({});
            }, 1500);
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
	page{
		width: 750rpx;
		margin: 0 auto;
	}
.p-md{
  padding: 60rpx 60rpx 0;
}
.bg {
  position: fixed;
  top: 0;
  /* left: 0; */
  width: 750rpx;
  height: 100vh;
  z-index: -1;
}

.bg image {
  width: 750rpx;
  height: 100vh;
}

.avator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260rpx;
}

.avator .img {
  width: 130rpx;
  height: 130rpx;
  overflow: hidden;
  border-radius: 50%;
}

.avator .img image {
  width: 100%;
  height: 100%;
}

.avator .we {
  margin-top: 30rpx;
  color: #3c3c3c;
  font-size: 26rpx;
}

.form .form_item {
  position: relative;
  display: flex;
  align-items: center;
  height: 90rpx;
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
  width: 30rpx;
  height: 0;
  margin-right: 10rpx;
}

.form .form_item input {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
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
  padding:8px;
  border-radius: 4rpx;
  font-size: 24rpx; 
  background-color: #48537d;
  color: #fff;
  line-height: 24rpx;
}

.submit {
  display: block;
  height: 74rpx;
  width: 615rpx;
  margin: 100rpx auto 0;
  background-color: #041a70;
  color: #fff;
  font-size: 28rpx;
  border-radius: 15rpx;
  border: none;
}
.form_item .nickname{
	font-size: 28rpx	
}
.form_item input{
	font-size: 26rpx	
}
.avatar{
  width: 100%;
  height: 25px;
}
</style>