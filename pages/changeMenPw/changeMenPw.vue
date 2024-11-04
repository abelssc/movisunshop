<template>
<view>
<common :title="$L('修改登录密码')"></common>

<view class="form">
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
  padding: 138rpx 60rpx 0;
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
  background-color: #ff8f31;
}
</style>