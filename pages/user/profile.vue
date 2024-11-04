<template>
<view>
<view class="show-avatar">
    <view class="show-avatar-main">
        <view class="user-avatar upload">
            <view class="up_item" @tap="chooseImage">
              <image :src="member_info.avator" class="up_img" mode="aspectFill"></image>
            </view>
        </view>
    </view>
</view>

<view class="bbctouch-inp-con">

  <view class="bottom-btn">
    <button @tap="profile_submit">{{$L('保存更改')}}</button>
  </view>

</view>
<common :title="$L('个人信息')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      member_info: {},
      key: "",
      avator_name: ""
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
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key
      });
      this.getuserInfo();
    }
  },
  methods: {
    // 选择图片
    chooseImage(e) {
      let type = e.currentTarget.dataset.type;
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'],
        //可选择性开放访问相册、相机
        success: res => {
          var key = uni.getStorageSync('token');

          if (key) {
            uni.uploadFile({
              url: getApp().globalData.ser_url + "/index.php?app=usercenter&mod=uploadPic",
              filePath: res.tempFilePaths[0],
              name: 'upimg',
              formData: {
                key: key,
                name: 'upimg'
              },
              success: resup => {
                resup = JSON.parse(resup.data);
                var file_name = resup.datas.name;
                this.member_info['avator'] = resup.datas.img_url;
                this.setData({
                  member_info: this.member_info,
                  avator_name: file_name
                });
              }
            });
          }
        }
      });
    },

    // 保存变更信息
    profile_submit() {
      var key = uni.getStorageSync('token');
      var member_avatar = this.avator_name;
      var that = this
      if (key) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=editUserInfo',
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key,
            member_avatar
          },
          dataType: 'json',
          success: function (result) {
            if (result.data.code == 200) {
              uni.showToast({
                title: that.$L('修改成功'),
                icon: 'success'
              });
            } else {
              uni.showToast({
                title: that.$L('接口异常'),
                icon: 'none'
              });
            }
          }
        });
      }
    },

    getuserInfo() {
      var that = this;
      var key = uni.getStorageSync('token');
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo_xcx',
        data: {
          'key': key
        },
        dataType: 'json',
        success: function (result) {
          if (result.data.login != '0') {
            // 验证 用户 信息 查看用户 是否有openid
            if (result.data.member_info.member_id) {
              that.setData({
                member_info: result.data.member_info
              });

              if (!uni.getStorageSync('uid')) {
                uni.setStorage({
                  key: 'uid',
                  data: result.data.member_info.member_id
                });
              }
            } else {
              uni.removeStorage({
                key: 'member_name'
              });
              uni.removeStorage({
                key: 'member_id'
              });
              uni.removeStorage({
                key: 'token'
              });
              uni.navigateTo({
                url: '../bind_account/bind_account'
              });
            }
          } else {
            uni.removeStorage({
              key: 'token'
            });
          }
        }
      });
    }
    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {
    //   var key = wx.getStorageSync('token')
    //   if (key) {
    //     this.setData({
    //       key
    //     })
    //     this.getuserInfo()
    //   }
    // }


  }
};
</script>
<style>
/* pages/user/profile.wxss */

page {
  background-color: #f5f5f5;
  width: 750rpx;
  margin: 0 auto;
  
}
/* 个人信息 修改 */

.show-avatar {
  width: 100%;
  text-align: center;
  background-color: #fff;
  margin: 20rpx 0 20rpx 0;
  padding: 30rpx 0;
}

.show-avatar .show-avatar-main {
  width: 100%;
}

.show-avatar .user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 100%;
  overflow: hidden;
  background-color: #efecdd;
  margin: 0 auto;
}

.show-avatar .user-avatar .up_item {
  width: 100rpx;
  height: 100rpx;
}

.show-avatar .user-avatar .up_item image {
  width: 100rpx;
  height: 100rpx;
}

.bottom-btn {
  margin: 0 20rpx;
}

.bottom-btn button {
  background-color: #fff;
}

</style>