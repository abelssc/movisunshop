<template>
<view>
<!--addons/pages/tsUserCenter/tsUserCenter.wxml-->
<DiyTabBar :tabBar="tabBar"></DiyTabBar>
<tsCommon></tsCommon>

<view class="user">
  <view class="avator" data-url @tap="go">
    <view class="avator-left">
      <view class="avator-img">
        <image :src="memberInfo.avator" mode="aspectFit"></image>
      </view>
      <view class="user-name">{{memberInfo.user_name}}</view>
    </view>

    <view class="avator-right">
    </view>
  </view>

  <view class="money">
    <view class="money-item" data-url="/addons/pages/tsTiXian/tsTiXian" @tap="go">
      <view class="item-name">{{$L('可提现金额')}}</view>
      <view class="item-money">{{memberInfo.available_yongjin}}</view>
      <text class="dot"></text>
    </view>

    <view class="money-item" data-url="/addons/pages/tsFreezing/tsFreezing" @tap="go">
      <view class="item-name">{{$L('冻结金额')}}</view>
      <view class="item-money">{{memberInfo.freeze_yongjin}}</view>
      <text class="dot"></text>
    </view>

    <view class="money-item" data-url="/addons/pages/tsInvalid/tsInvalid" @tap="go">
      <view class="item-name">{{$L('失效金额')}}</view>
      <view class="item-money">{{memberInfo.disable_yongjin}}</view>
    </view>
  </view>

  <view class="list">
    <view data-url="/addons/pages/tsMySubordinates/tsMySubordinates" @tap="go" class="list-item">
      <text>{{$L('我的下级')}}</text>
      <image src="/static/addons/images/ltr.png"></image>
    </view>

    <view data-url="/addons/pages/tsOrderList/tsOrderList" @tap="go" class="list-item">
      <text>{{$L('订单明细')}}</text>
      <image src="/static/addons/images/ltr.png"></image>
    </view>

    <view data-url="/pages/help/help_detail?type=ts" @tap="go" class="list-item">
      <text>{{$L('常见问题')}}</text>
      <image src="/static/addons/images/ltr.png"></image>
    </view>

    <view @tap="call" class="list-item">
      <text>{{$L('联系客服')}}</text>
      <image src="/static/addons/images/ltr.png"></image>
    </view>
	<view @tap="logout" class="list-item logout">
	  <text>{{$L('退出登录')}}</text>
	</view>
  </view>
</view>

<common :title="$L('个人中心')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      tabBar: {
        // tabBar 配置
        color: "#5C5C5C",
        // 文字颜色
        selectedColor: "#FC3559",
        // 选中的颜色
        selectItem: 2,
        list: [{
          pagePath: "/addons/pages/tsIndex/tsIndex",
          text: this.$L('必推好货'),
          iconPath: getApp().globalData.img_url + "ts/ts1.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts11.png"
        }, {
          pagePath: "/addons/pages/tsOrderList/tsOrderList",
          text: this.$L('订单明细'),
          iconPath: getApp().globalData.img_url + "ts/ts2.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts22.png"
        }, {
          pagePath: "/addons/pages/tsUserCenter/tsUserCenter",
          text: this.$L('推手中心'),
          iconPath: getApp().globalData.img_url + "ts/ts3.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts33.png"
        }]
      },
      memberInfo: {},
      site_phone: '',
      ssys_key: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('个人中心')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key
    });
    this.getUserInfo();
    this.getSitePhone();
  },
  methods: {
    getUserInfo() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          ssys_key: ssys_key
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              memberInfo: res.data.datas.member_info
            });
          }
        }
      });
    },

    getSitePhone() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=get_site_phone&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          key: ssys_key
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              site_phone: res.data.datas.site_phone
            });
          }
        }
      });
    },
	//退出登录
    logout(){
		uni.removeStorageSync('ssys_key')
		uni.reLaunch({
		    url: '/addons/pages/tsLogin/tsLogin'
		  }); 
	},
    go(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        if (url == '/addons/pages/tsOrderList/tsOrderList') {
          uni.reLaunch({
            url: url
          });
        } else {
          uni.navigateTo({
            url: url
          });
        }
      }
    },

    call() {
      const {
        site_phone
      } = this;
      uni.showModal({
        title: this.$L('联系客服'),
        content: this.$L('立即拨打客服电话：') + site_phone,
        cancelText:this.$L('取消'),
				confirmText:this.$L('确定'),
        success: res => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: site_phone
            });
          }
        }
      });
    }

  }
};
</script>
<style>
/* addons/pages/tsUserCenter/tsUserCenter.wxss */
page{
  padding-bottom: 100rpx;
  background-color: #F7F8FB;
  width: 750rpx;
  margin: 0 auto;
}

.user{
  position: relative;
}

.avator{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 336rpx;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 37rpx 146rpx 56rpx;
}

.avator .avator-left{
  display: flex;
  align-items: center;
}

.avator .avator-left .avator-img{
  width: 144rpx;
  height: 144rpx;
  margin-right: 25rpx;
}

.avator .avator-img image{
  width: 100%;
  height: 100%;
}

.avator .user-name{
  color: #373737;
  font-size: 30rpx;
}

.avator .avator-right image{
  width: 16rpx;
  height: 30rpx;
}

.money{
  position: absolute;
  top: 219rpx;
  left: 20rpx;
  right: 20rpx;
  height: 146rpx;
  background-color: #FFFFFF;
  box-shadow: 0 0 30rpx 1rpx #E9ECF5;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.money .money-item{
  flex: 1;
  position: relative;
  text-align: center;
}

.money .money-item .item-name{
  color: #5C5C5C;
  font-size: 24rpx;
}

.money .money-item .item-money{
  margin-top: 25rpx;
  color: #373737;
  font-size: 30rpx;
}

.money .money-item .dot{
  position: absolute;
  top: 5rpx;
  right: 0;
  width: 4rpx;
  height: 20rpx;
  background-color: #FC3357;
}

.list{
  padding: 30rpx 20rpx;
}

.list .list-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  background-color: #fff;
  color: #373737;
  font-size: 30rpx;
  border-radius: 5rpx;
  padding: 0 14rpx 0 34rpx;
  margin-bottom: 10rpx;
}

.list .list-item image{
  width: 12rpx;
  height: 24rpx;
}
.logout{
	justify-content: center!important;
}

</style>