<template>
<view>
  <common :title="$L('修改登录密码')"></common>

  <view class="form">
    <image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
    <view class="form-item border-bottom-1px">
      <image class="icon" :src="img_url+'login_pass.png'" mode="aspectFit"></image>
      <view class="input">
        <input :placeholder="$L('请输入旧密码')" data-type="oldpassword" :value="oldpassword" @input="inputHandle" type="password" :hidden="showpw1"></input>
        <input :placeholder="$L('请输入旧密码')" data-type="oldpassword" :value="oldpassword" @input="inputHandle" type="text" :hidden="!showpw1"></input>
      </view>
      <view class="change-type">
        <image :src="img_url+'login_pass_hide.png'" mode="aspectFit" :hidden="showpw1" data-type="showpw1" @tap="changeShowMode"></image>
        <image :src="img_url+'login_pass_show.png'" mode="aspectFit" :hidden="!showpw1" data-type="showpw1" @tap="changeShowMode"></image>
      </view>
    </view>

    <view class="form-item border-bottom-1px">
      <image class="icon" :src="img_url+'login_pass.png'" mode="aspectFit"></image>
      <view class="input">
        <input :placeholder="$L('请输入新密码')" data-type="password" :value="password" @input="inputHandle" type="password" :hidden="showpw2"></input>
        <input :placeholder="$L('请输入新密码')" data-type="password" :value="password" @input="inputHandle" type="text" :hidden="!showpw2"></input>
      </view>
      <view class="change-type">
        <image :src="img_url+'login_pass_hide.png'" mode="aspectFit" :hidden="showpw2" data-type="showpw2" @tap="changeShowMode"></image>
        <image :src="img_url+'login_pass_show.png'" mode="aspectFit" :hidden="!showpw2" data-type="showpw2" @tap="changeShowMode"></image>
      </view>
    </view>

    <button class="confirm" @tap="confirm">{{$L('确认')}}</button>
  </view>

  <view @tap="cancle()" class="delete-acount">
    <text>{{$L('注销账号')}}</text>
  </view>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      showpw1: false,
      showpw2: false,
      oldpassword: '',
      password: '',
      key: '',
      type: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('修改密码')
    });
    const key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key
      });
    }
  },
  methods: {
    cancle(){
      const { key } = this;
      uni.showModal({
        title: this.$L('提示'),
        content: this.$L('确认注销该账号吗？'),
        cancelText:this.$L('取消'),
        confirmText:this.$L('确定'),
        success: function (result) {
          if (result.confirm) {
            uni.request({
              url: getApp().globalData.ser_url + '/index.php?app=login&mod=memberCancel',
              data: {
                key
              },
              success: res => {
                if(res.data.state == 255){
                  uni.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }else{
                  uni.clearStorageSync('uuid'); //清空零时uuid
                  uni.removeStorage('token');
                  uni.removeStorage('share_u');
                  uni.navigateTo({
                    url: '/pages/login/login'
                  });
                }
              }
            });
          }
        }
      });
    },

    inputHandle(e) {
      const type = e.currentTarget.dataset.type;
      const value = e.detail.value;
      this.setData({
        [type]: value
      });
    },

    changeShowMode(e) {
      const type = e.currentTarget.dataset.type;
      const target = this[type];
      this.setData({
        [type]: !target
      });
    },

    confirm() {
      const {
        oldpassword,
        password,
        key
      } = this;
	  if(oldpassword == '' || password == ''){
		  uni.showToast({
		  	title:this.$L('请完善信息'),
			icon:'none',
			duration:700
		  })
	  }else{
		  request({
		    url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=editPassword',
		    data: {
		      opassword: oldpassword,
		      npassword: password,
		      key
		    },
		    method: 'post'
		  }).then(res => {
		    if (res.datas.state == 'failuer') {
		      uni.showToast({
		        title: res.datas.data,
		        icon: 'none'
		      });
		    } else {
		      uni.showToast({
		        title: res.datas.data
		      });
		    }
		  });
	  }
      
    }

  }
};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
/* pages/changeMenPw/changeMenPw.wxss */
.form{
  padding: 60rpx 60rpx 0;
}

.form .form-item{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 35rpx;
  padding-bottom: 10rpx;
}

.form .form-item .icon{
  width: 34rpx;
  height: 34rpx;
  margin-right: 16rpx;
}

.form-item .input{
  flex: 1;
}

.form-item input{
  font-size: 28rpx;
}

.form-item .change-type {
  width: 46rpx;
  height: 46rpx;
  padding: 10rpx 20rpx;
}

.form-item .change-type image{
  width: 46rpx;
  height: 46rpx;
}

.confirm{
  padding: 0;
  border: none;
  margin-top: 70rpx;
  color: #fff;
  font-size: 30rx;
  line-height: 88rpx;
  border-radius: 8rpx;
  background-color: #041a70;
}
.avatar{
  width: 100%;
  height: 25px;
}

.delete-acount {
  margin-top: 60rpx;
  text{
    display: block;
    font-size: 28rpx;
    color: red;
    padding: 20rpx 60rpx;
    width: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;
    background:#fafafa;
  }
}


</style>