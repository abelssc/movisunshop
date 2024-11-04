<template>
<view>
<view class="bg" :style="'background: url(' + img_url + 'sld_qd_bg.png) no-repeat center;background-size: cover'">

  <image class="top-bg" :src="img_url + $L('sld_qd_wenzi.png')" mode="widthFix"></image>
  
  <button v-if="flag" class="btn" @tap="singined">{{$L('已签到')}}</button>

  <button v-if="!flag" class="btn" @tap="singin">{{$L('立即签到')}}</button>

  <view class="list" :style="'background: url(' + img_url + 'sld_qd8.png) no-repeat center;background-size: contain'">
    <view class="list-title">
      <view class="title-item">
        <text>{{total_count?total_count:'--'}}</text>
        <text class="white">{{$L('累计签到')}}</text>
      </view>

      <view class="title-item">
        <text>{{total_points?total_points:'--'}}</text>
        <text class="white">{{$L('累计积分')}}</text>
      </view>
    </view>
    <view class="item">
      <text>{{$L('签到时间')}}</text>
      <text>{{$L('获赠积分')}}</text>
    </view>
    <scroll-view scroll-y @scrolltolower="getmore">
      <view v-for="(item, index) in list" :key="index" class="item">
        <text>{{item.pl_addtime_str}}</text>
        <text>{{item.pl_points}}</text>
      </view>
    </scroll-view>
  </view>
</view>

<common :title="$L('签到')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      key: '',
      img_url: getApp().globalData.img_url,
      flag: false // 是否已签到
      ,
      list: "",
      total_count: "",
      total_points: "",
	  pn:1
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('签到')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
	  return
    }

    this.initData();
  },
  methods: {
    initData() {
      this.UserCheckinIsChecked();
      this.myCheckInLog();
    },

    UserCheckinIsChecked() {
		let that=this
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=UserCheckinIsChecked',
        method: 'post',
        data: {
          key: this.key
        }
      }).then(res => {
        if (res.code == 200) {
			setTimeout(()=>{
				this.flag= res.datas.flag || false
			},0)
          // this.setData({
          //   flag: res.datas.flag || false
          // });
        }
      });
    },

    myCheckInLog() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=myCheckInLog&pn=' + this.pn,
        data: {
          key: this.key
        },
        method: 'post'
      }).then(res => {
        if (res.code == 200) {
          let data = res.datas.list;

          if (this.pn == 1) {
			  let that=this
			  setTimeout(()=>{
			  	that.list=data,
				that.total_count=res.datas.total_count,
				that.total_points=res.datas.total_points
			  },0)
          } else {
            let {
              list
            } = this;
			let that=this
			setTimeout(()=>{
				this.list=list.concat(data)
			},0)
          }
        }

        if (res.hasmore) {
          this.pn++;
        } else {
          this.hasmore = false;
        }
      });
    },

    getmore() {
      if (this.hasmore) {
        this.myCheckInLog();
      }
    },

    singin() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=checkInAction',
        method: 'post',
        data: {
          key: this.key
        }
      }).then(res => {
        uni.showToast({
          title: res.datas.msg,
          icon: 'none'
        });

        if (res.datas.state != 'failuer') {
          this.pn = 1;
          this.hasmore = true;
          this.myCheckInLog();
          this.setData({
            flag: true
          });
        }
      });
    },

    singined() {
      uni.showToast({
        title: this.$L('每日只可签到一次'),
        icon: 'none'
      });
    }

  }
};
</script>
<style>
/* pages/singIn/singIn.wxss */
.bg{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 750rpx;
  height: 100vh;
}

.bg .top-bg{
  width: 670rpx;
  height: 0;
  margin: 30rpx auto 0;
}

.bg .btn{
  width: 442rpx;
  height: 88rpx;
  /* line-height: 78rpx; */
  border-radius: 44rpx;
  padding: 0;
  background: linear-gradient(to right,#fee477, #ffbe37);
  color: #a64037;
  font-size: 30rpx;
  margin: 50rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* letter-spacing: 10rpx; */
}

.bg .list{
  display: flex;
  flex-direction: column;
  flex: 0 0 706rpx;
  width: 750rpx;
  height: 706rpx;
  font-size: 24rpx;
  color: #f00;
  margin-bottom: 20rpx;
}

.list .list-title{
  display: flex;
  align-items: center;
  color: #FF979D;
  height: 100rpx;
  width: 666rpx;
  margin: 20rpx auto 0;
}

.list .list-title .title-item{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.title-item text:first-child{
  color: #fff;
  margin-bottom: 15rpx;
}

.list .item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 666rpx;
  height: 70rpx;
  line-height: 70rpx;
  margin: 0 auto;
}

.item text{
  flex: 1;
  width: 50%;
  text-align: center;
}

.list scroll-view{
  height: 450rpx;
}

.list scroll-view .item{
  border-top: 1rpx solid #ede6e6;
  color: #6A6A6A;
}

.list scroll-view .item:last-child{
  border-bottom: 1rpx solid #ede6e6;
}
.white{
	color: white;
}
</style>