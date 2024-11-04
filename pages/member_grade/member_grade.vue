<template>
<view>
<view class="grade">
  <view class="grade_bg">
  </view>
  <view class="grade_member">
    <image :src="img_url + 'grade_bg.png'" class="grade_member_bg"></image>
    <text class="mem_lev">{{$L('会员等级')}}{{member_info.grade_name}}</text>
    <view class="member_info">
      <view class="m_left" v-if="prev">
        <image :src="prev.grade_img"></image>
      </view>
      <navigator hover-class="none" url="/pages/experience/experience" class="member">
        <view class="avatar">
          <image :src="member_info.member_avatar"></image>
        </view>
        <view class="lev">
          <image :src="member_info.grade_img"></image>
        </view>
      </navigator>
      <view class="m_right" v-if="next">
        <image :src="next.grade_img"></image>
        <view class="content">
          <view>{{$L('未达到')}}</view>
          <view>{{$L('还差')}}{{nextval-nowval}}{{$L('经验值')}}</view>
        </view>
      </view>
    </view>
    <view class="now_level">
      <text>{{$L('当前经验值')}}</text>
      <text>{{nowval}}</text>
    </view>
  </view>
</view>

<view class="title">
  <image :src="img_url + $L('grade_bg2x.png')"></image>
</view>

<view class="grade_list">
  <view class="list_top">
    <image :src="img_url+'grade_jd@2x.png'"></image>
    <text>{{$L('我的升级进度')}}</text>
    <text>{{$L('（会员自动升级进度显示）')}}</text>
  </view>
  <view class="list">
    <view class="list_title">
      <text>{{$L('会员等级')}}</text>
      <text>{{$L('经验值')}}</text>
      <text>{{$L('享受优惠')}}</text>
    </view>
    <view v-for="(item, index) in grade_list" :key="index" class="item">
      <text>{{item.grade_name}}</text>
      <text>{{item.grade_value}}</text>
      <text>{{(item.grade_discount==0 || item.grade_discount==100)?$L('不享受优惠价'):$L('购物享')+(item.grade_discount/10)+$L('折')}}</text>
    </view>
  </view>
</view>
<common :title="$L('会员等级')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      grade_list: null,
      member_info: null,
      prev: null,
      next: null,
      nowval: 0,
      nextval: 0,
      img_url: getApp().globalData.img_url
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('会员等级')
    });
    const key = uni.getStorageSync('token');

    if (!key) {
      getApp().globalData.goLogin();
      return;
    }

    this.setData({
      key
    });
    this.getMemberGrade();
  },
  methods: {
    getMemberGrade() {
      let that = this,
          key = that.key;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=member_grade',
        data: {
          key
        },
        dataType: 'json',
        success: function (res) {
          if (res.data.status == 200) {
            let grade_list = res.data.data.grade_list;
            let member_info = res.data.data.member_info;
            let prev, next;
            let nowval = parseInt(member_info.member_growthvalue);

            for (let i = 0; i < grade_list.length; i++) {
              var el = grade_list[i];

              if (el.grade_name == member_info.grade_name) {
                if (i > 0) {
                  prev = grade_list[i - 1];

                  if (i < grade_list.length - 1) {
                    next = grade_list[i + 1];
                  } else {
                    next = '';
                  }
                } else {
                  prev = '';
                  next = grade_list[1];
                }
              }
            }

            let nextval = {};

            if (next) {
              nextval = parseInt(next.grade_value);
            }

            that.setData({
              grade_list: grade_list,
              member_info: member_info,
              prev: prev,
              next,
              nowval,
              nextval
            });
          } else {
            uni.showToast({
              title: res.data.msg,
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
/* pages/member_grade/member_grade.wxss */
page{
	width: 750rpx;
	margin: 0 auto;
}
.grade {
  position: relative;
}

.grade .grade_bg {
  width: 750rpx;
  height: 243rpx;
  background-color: #1b1b1b;
  border-radius: 0 0 50rpx 50rpx;
}

.grade .grade_member {
  position: absolute;
  top: 30rpx;
  left: 20rpx;
  right: 20rpx;
  height: 340rpx;
  z-index: 9;
}

.grade .grade_member .grade_member_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8;
}

.grade .grade_member .grade_member_bg img {
  width: 100%;
  height: 100%;
}

.grade_member .mem_lev {
  position: relative;
  display: block;
  width: 100%;
  padding-top: 60rpx;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
  z-index: 10;
}

.member_info .m_left, .member_info .m_right {
  position: absolute;
  top: 142rpx;
  width: 49rpx;
  height: 49rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.member_info .m_left image {
  max-width: 100%;
  max-height: 100%;
}

.member_info .m_left {
  left: 59rpx;
}

.member_info .m_right {
  position: absolute;
  top: 142rpx;
  right: 72rpx;
  width: 49rpx;
  height: 49rpx;
  font-size: 20rpx;
  color: #fff;
  text-align: center;
  z-index: 10;
}

.member_info .m_right .content {
  position: absolute;
  top: 60rpx;
  left: -79rpx;
  width: 200rpx;
  text-align: center;
  line-height: 1;
}

.member_info .m_right .content view:nth-child(1) {
  padding-bottom: 10rpx;
}

.member_info .m_right image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 49rpx;
  max-height: 49rpx;
}

.member_info .member {
  position: absolute;
  top: 122rpx;
  left: 321rpx;
  width: 89rpx;
  height: 89rpx;
  z-index: 10;
}

.member_info .member .avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 85rpx;
  max-height: 85rpx;
  border: 4rpx solid #bfbfbf;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member_info .member .avatar image {
  max-width: 85rpx;
  max-height: 85rpx;
}

.member_info .member .lev {
  position: absolute;
  right: -21rpx;
  top: 48rpx;
  width: 42rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member_info .member .lev image {
  max-width: 42rpx;
  max-height: 42rpx;
}

.now_level {
  position: absolute;
  bottom: 52rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  line-height: 32rpx;
  z-index: 10;
}

.now_level text:nth-child(1) {
  font-size: 20rpx;
  padding-left: 10rpx;
}

.now_level text:nth-child(2) {
  font-size: 28rpx;
  padding-left: 10rpx;
}

.title {
  height: 127rpx;
  margin: 180rpx 20rpx 0;
}

.title image {
  width: 100%;
  height: 100%;
}

.grade_list {
  margin: 40rpx 20rpx 20rpx;
}

.grade_list .list_top {
  position: relative;
  height: 98rpx;
}

.grade_list .list_top image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grade_list .list_top text {
  display: block;
  position: relative;
  z-index: 99;
  text-align: center;
  line-height: 36rpx;
}

.grade_list .list_top text:nth-child(2) {
  color: #333;
  font-size: 30rpx;
  padding-top: 20rpx;
}

.grade_list .list_top text:nth-child(3) {
  color: #cfa770;
  font-size: 18rpx;
}

.grade_list .list {
  border: 1rpx dashed #f7dfd1;
}

.grade_list .list .list_title, .grade_list .list .item {
  display: flex;
  min-height: 63rpx;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding: 10rpx 0;
  box-sizing: border-box;
}

.grade_list .list .list_title text, .grade_list .list .item text {
  flex: 1;
  color: #c6a16d;
  font-size: 24rpx;
  word-break: break-all;
}

.grade_list .list .item {
  border-top: 1rpx dashed #f7dfd1;
}

.grade_list .list .list_title text, .grade_list .list .item text:nth-child(1) {
  font-weight: 600;
}

</style>