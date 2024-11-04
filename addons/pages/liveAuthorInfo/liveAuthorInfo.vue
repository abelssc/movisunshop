<template>
<view>
<view class="avator" style="margin-top:20rpx;">
    <text class="left">{{$L('设置头像')}}</text>
    <view class="right" data-type="member_avatar" @tap="chooseImage">
        <view class="img" :style="'background:url('+author_info.author.member_avatar+');'"></view>
        <image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
    </view>
</view>

<view class="avator">
    <text class="left">{{$L('设置主页背景')}}</text>
    <view class="right" data-type="background_image" @tap="chooseImage">
        <view class="mem_bg" :style="'background:url('+author_info.author.background_image+');'"></view>
        <image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
    </view>
</view>

<view class="avator" :style="common_style">
    <text class="left">{{$L('会员名')}}</text>
    <view class="right">
        <text class="member_name">{{author_info.author.member_name}}</text>
    </view>
</view>
<view class="avator" :style="common_style">
    <text class="left">{{$L('昵称')}}</text>
    <view class="right" data-index="nick_name" :data-title="$L('更改名字')" :data-val="author_info.author.member_nickname? author_info.author.member_nickname : author_info.author.member_name" @tap="editInfo">
        <text class="member_name">{{author_info.author.member_nickname? author_info.author.member_nickname : author_info.author.member_name}}</text>
        <image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
    </view>
</view>
<view class="avator" :style="common_style">
    <text class="left">{{$L('个人简介')}}</text>
    <view class="right" data-index="introduction" :data-title="$L('个人简介')" :data-val="author_info.author.introduction? author_info.author.introduction : ''" @tap="editInfo">
        <text class="member_name">{{author_info.author.introduction? author_info.author.introduction : ''}}</text>
        <image class="arrow_r" :src="img_url+'live/mem_arrow_r.png'"></image>
    </view>
</view>
</view>
</template>

<script>
// addons/pages/liveAuthorInfo/liveAuthorInfo.js
import request from "../../../utils/request";

export default {
  data() {
    return {    
      //背景图片样式
      img_url: getApp().globalData.img_url,
      //图片地址
      common_style: 'height:80rpx;border-bottom:1rpx solid rgba(0,0,0,0.1);margin-bottom:0',
      author_info: '' //作者信息

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('个人信息')
    });
    this.getAuthorInfo();
  },

  onShow() {
    this.getAuthorInfo();
  },

  methods: {
    //获取用户信息
    getAuthorInfo() {
      let key = uni.getStorageSync('token');
      let {
        author_info
      } = this;
      request({
        url: getApp().globalData.svideo_url + '/index.php?app=author&mod=detail&key=' + key
      }).then(res => {
        if (res.state == 200) {
          this.setData({
            author_info: res.data
          });
        }
      });
    },

    // 选择图片
    chooseImage(e) {
      let type = e.currentTarget.dataset.type;
      let {
        author_info
      } = this;
      let key = uni.getStorageSync('token');
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'],
        //可选择性开放访问相册、相机
        success: res => {
          if (key) {
            uni.uploadFile({
              url: getApp().globalData.svideo_url + "/index.php?app=author&mod=uploadAuthorImage",
              filePath: res.tempFilePaths[0],
              name: type,
              formData: {
                key: key,
                filename: type
              },
              success: resup => {
                resup = JSON.parse(resup.data);

                if (resup.state == 200) {
                  if (type == 'member_avatar') {
                    author_info.author.member_avatar = resup.data.image;
                  } else {
                    author_info.author.background_image = resup.data.image;
                  }

                  this.setData({
                    author_info: author_info
                  });
                }
              }
            });
          }
        }
      });
    },

    //编辑信息
    editInfo(e) {
      let cur_data = e.currentTarget.dataset;
      uni.navigateTo({
        url: '../liveEditAuthorInfo/liveEditAuthorInfo?title=' + cur_data.title + '&type=' + cur_data.index + '&val=' + cur_data.val
      });
    }

  }
};
</script>
<style>
page{
    background-color:#F8F8F8;
	width: 750rpx;
	margin: 0 auto;
}

.avator{
    background: #fff;
    padding: 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.avator .left{
    color: rgba(45, 45, 45, 1);
    font-size: 28rpx;
}

.avator .right{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    overflow:hidden;
	white-space: nowrap;
}

.avator .right .img{
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
    overflow: hidden;
	background-size:contain!important;
	background-position:center center !important;
	background-repeat: no-repeat !important;
}

.avator .right .arrow_r{
    width: 40rpx;
    height: 42rpx;
    margin-left: 6rpx;
}

.avator .right .mem_bg{
    width: 126rpx;
    height: 82rpx;
    border-radius: 15rpx;
	background-size:contain!important;
	background-position:center center!important;
	background-repeat: no-repeat!important;
}

.avator .right .member_name{
    color: #949494;
    font-size: 24rpx;
    max-width: 350rpx;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>