<template>
<view>
<view class="login-bg" v-if="isShow">
  <image class="bg" :src="img_url+'addons/sld_bj.png'"></image>
  <image class="logo" :src="logoUrl" mode="widthFix" v-if="logoUrl"></image>
  <image class="logo" :src="img_url+'addons/sld_logo.png'" mode="widthFix" v-if="!logoUrl"></image>
</view>

<view class="login">
  <view class="login-title">{{$L('登录')}}</view>

  <form @submit="goLogin">
    <view class="form-item">
      <input :placeholder="$L('请输入账号')" name="username"></input>
    </view>

    <view class="form-item">
      <input :placeholder="$L('请输入密码')" name="password" type="password"></input>
    </view>
    <view class="other">
      <navigator hover-class="none" url="/addons/pages/tsRegister/tsRegister?type=register">{{$L('申请成为推手')}}</navigator>
      <navigator hover-class="none" url="/addons/pages/tsRegister/tsRegister?type=forgotPassword">{{$L('忘记密码？')}}</navigator>
    </view>

    <button form-type="submit">{{$L('登录')}}</button>
    
  </form>
</view>

<sldMenu nowPage="ts"></sldMenu> 
<common :title="$L('推手登录')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      logoUrl: getApp().globalData.img_url+'addons/sld_logo.png',
      img_url: getApp().globalData.img_url ,//图片地址,
	  isShow:false

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('登录')
    });
    this.getLogo();
  },
  methods: {
    // 获取logo
    getLogo() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login&mod=getSldWapLogo',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          this.setData({
            logoUrl: res.data.sldwaplogo ? res.data.sldwaplogo : img_url + 'addons/sld_logo.png',
			isShow:true
          });
        }
      });
    },

    // 登录
    goLogin(e) {
      let params = e.detail.value;

      if (!params.username || !params.password) {
        uni.showToast({
          title: this.$L('请完善登录信息'),
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login&mod=index&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: { ...params,
          client: 'wx_xcx'
        },
        success: res => {
          if (!res.data.datas.error) {
            if (typeof res.data.datas.key == 'undefined') {
              return false;
            } else {
              uni.setStorageSync("ssys_username", res.data.datas.username);
              uni.setStorageSync('ssys_key', res.data.datas.key);
              uni.setStorageSync('ssys_share_code', res.data.datas.share_code);
              uni.showToast({
                title: this.$L('登录成功')
              });
              setTimeout(() => {
                uni.reLaunch({
                  url: '/addons/pages/tsIndex/tsIndex'
                });
              }, 1500);
            }
          } else {
            uni.showToast({
              title: res.data.datas.error,
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
  background-color: #FDFDFD;
  width: 750rpx;
  margin: 0 auto;
}

.login-bg{
  position: relative;
  z-index: 0;
  width: 750rpx;
  height: 581rpx;
}

.login-bg .bg{
  position: relative;
  width: 750rpx;
  height: 581rpx;
  z-index: 1;
}

.login-bg .logo{
  position: absolute;
  top: 35%;
  left: 50%;
  z-index: 2;
  width: 510rpx;
  height: 0;
  transform: translate(-50%,-50%);
  width: 200rpx;
  height: 200rpx;
}

.login{
  position: absolute;
  top: 270rpx;
  left: 30rpx;
  right: 30rpx;
  background-color: #fff;
  height: 770rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10rpx 1rpx rgba(0,0,0,.1);
  z-index: 99;
  margin: 0 auto;
  width: 690rpx;
}

.login .login-title{
  width: 100%;
  position: relative;
  padding-top: 76rpx;
  line-height: 74rpx;
  color: #FC3357;
  font-size: 36rpx;
  text-align: center;
}

.login .login-title::after,.login .login-title::before{
  position: absolute;
  content: '';
  width: 100rpx;
  height: 1rpx;
  background-color: #FC3357;
  top: 110rpx;
}

.login .login-title::after{
  left: 180rpx;
}

.login .login-title::before{
  right: 180rpx;
}

.login form{
  margin-top: 50rpx;
}

.login .form-item{
  width: 592rpx;
  margin-bottom: 35rpx;
}

.login .form-item input{
  width: 592rpx;
  height: 90rpx;
  border: 2rpx solid #CBCBCB;
  border-radius: 45rpx;
  padding-left: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.login button{
  width: 300rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #FC3357;
  color: #fff;
  line-height: 80rpx;
  border: none;
}

.login .other{
  width: 592rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #5C5C5C;
  font-size: 24rpx;
  height: 50rpx;
  margin-bottom: 35rpx;
}






</style>