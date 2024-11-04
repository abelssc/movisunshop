<template>
<view>
<view class="exp-header">
  <image class="bg" :src="img_url+'experience_bg.png'"></image>
  <view class="exp-total">
    <image class="bg2" :src="img_url+'experience_center.png'"></image>
    {{growthvalue}}
  </view>
  <view class="exp-rule" @tap="showRuleWrap">
    <image :src="img_url+'experience_label.png'"></image>{{$L('规则')}}
  </view>
</view>

<view class="experience-list" v-if="expList.length">
  <view v-for="(item, index) in expList" :key="index" class="exp-item border-bottom-1px">
    <view class="exp-item-top">
      <text>{{item.growth_stage_str?item.growth_stage_str:''}}</text>
      <text>{{item.growth_points}}</text>
    </view>
    <view class="desc">{{item.growth_desc}}</view>
    <view class="time">{{item.growth_addtime_str}}</view>
  </view>
</view>

<view class="empty" v-if="!expList.length && !isLoading">
  <image :src="img_url+'exe_empty.png'" mode="widthFix"></image>
  <view>{{$L('您还没有经验值~')}}</view>
  <navigator open-type="switchTab" hover-class="none" url="/pages/index/index">{{$L('逛逛首页')}}</navigator>
</view>

<view class="rule-wrap" v-if="ruleShow">
  <view class="rule-content">
    <view class="rule-title">{{$L('经验值规则明细')}}</view>
    <view class="rule-con">
      <text v-for="(item, index) in rule" :key="index">{{index+1}}、{{item}}</text>
    </view>
    <button @tap="closeRuleWrap">{{$L('我知道了')}}</button>
  </view>
</view>

<common :title="$L('我的经验值')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      expList: [],
      key: '',
      isLoading: true,
      rule: [],
      growthvalue: 0,
      ruleShow: false,
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('我的经验值')
    });
    let key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.getList();
    this.getRule();
  },

  onReachBottom() {
    if (this.hasmore) {
      this.getList();
    }
  },

  methods: {
    getList() {
      let {
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=growth_grade&mod=growth_list&page=10&pn=' + this.pn,
        data: {
          key: key
        },
        method: 'post',
        loading: this.pn == 1
      }).then(res => {
        if (res.state == 200) {
          let list = res.data;

          if (this.pn == 1) {
            this.setData({
              expList: list
            });
          } else {
            let {
              expList
            } = this;
            this.setData({
              expList: expList.concat(list)
            });
          }
        }

        if (this.pn == 1) {
          this.setData({
            isLoading: false
          });
        }

        if (res.hasmore) {
          this.pn++;
        } else {
          this.hasmore = false;
        }
      }).catch(err => {
        if (this.pn == 1) {
          this.setData({
            isLoading: false
          });
        }
      });
    },

    getRule() {
      let {
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=growth_grade&mod=growth_rule',
        data: {
          key: key
        },
        method: 'post'
      }).then(res => {
        if (res.state == 200) {
          this.setData({
            rule: res.data,
            growthvalue: res.growthvalue
          });
        }
      });
    },

    showRuleWrap() {
      this.setData({
        ruleShow: true
      });
    },

    closeRuleWrap() {
      this.setData({
        ruleShow: false
      });
    }

  }
};
</script>
<style>
/* pages/experience/experience.wxss */

page {
  background-color: #f5f5f5;
  color: #333;
  width: 750rpx;
  margin: 0 auto;
}

.rule {
  margin-top: 20rpx;
  background-color: #fff;
  color: #999;
  font-size: 24rpx;
  line-height: 36rpx;
}

.title {
  position: relative;
  height: 68rpx;
  padding: 0 65rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 68rpx;
}

.title::before {
  position: absolute;
  content: '';
  left: 40rpx;
  top: 20rpx;
  width: 4rpx;
  height: 28rpx;
  background-color: #ff3b3b;
}

.rule .con {
  padding: 15rpx 40rpx;
}

.experience-list {
  background-color: #fff;
  padding-left: 39rpx;
}

.experience-list .exp-item {
  padding: 15rpx 30rpx 15rpx 0;
}

.exp-item .exp-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exp-item .exp-item-top text:nth-child(1) {
  width: 60%;
  font-size: 28rpx;
  color: #2d2d2d;
}

.exp-item .exp-item-top text:nth-child(2) {
  color: #ff3b3b;
  font-size: 32rpx;
  font-weight: bold;
}

.exp-item .desc {
  font-size: 28rpx;
  line-height: 30rpx;
  padding: 10rpx 0;
  color: #949494;
}

.exp-item .time {
  color: #949494;
  font-size: 24rpx;
}

.empty {
  width: 750rpx;
  height: calc(100vh - 330rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty image {
  width: 135rpx;
  height: 0;
}

.empty view {
  margin: 20rpx 0 64rpx;
  color: #999;
  font-size: 24rpx;
}

.empty navigator {
  width: 160rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  line-height: 40rpx;
  border: 1rpx solid #333;
  color: #333;
  font-size: 24rpx;
}

.exp-header {
  position: relative;
  height: 310rpx;
}

.exp-header .bg {
  position: absolute;
  top: -90rpx;
  left: 0;
  height: 400rpx;
  width: 100%;
  z-index: 0;
}

.exp-header .exp-total {
  position: relative;
  margin: 60rpx auto 0;
  width: 167rpx;
  height: 163rpx;
  text-align: center;
  line-height: 163rpx;
  color: #fff;
}

.exp-header .exp-total .bg2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.exp-total-tip {
  position: relative;
  text-align: center;
  color: #fff;
  font-size: 24rpx;
  margin-top: 6rpx;
}

.exp-rule {
  position: absolute;
  top: 30rpx;
  right: 0;
  width: 120rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 24rpx 0 0 24rpx;
}

.exp-rule image {
  width: 23rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.rule-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.rule-wrap .rule-content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500rpx;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.rule-content .rule-title {
  padding-top: 56rpx;
  line-height: 1;
  font-size: 34rpx;
  color: #2d2d2d;
  text-align: center;
}

.rule-content .rule-con {
  padding: 30rpx 42rpx;
  color: #666;
  font-size: 30rpx;
  line-height: 45rpx;
}

.rule-content .rule-con text {
  display: block;
}

.rule-content button {
  position: relative;
  height: 92rpx;
  border: none;
  margin: 0;
  color: #e1251b;
  font-size: 34rpx;
  line-height: 92rpx;
  padding: 0;
  background-color: #fff;
}

.rule-content button::after{
  border: none;
}

.rule-content button::before {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  width: 100%;
  height: 1rpx;
  transform: scaleY(0.5);
  background-color: #e2e2e2;
}

</style>