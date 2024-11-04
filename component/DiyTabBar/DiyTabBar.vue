<template>
<!--component/DiyTabBar/DiyTabBar.wxml-->
<view class="tabBar">
  <block v-for="(item, index) in tabBar.list" :key="index">
    <view class="tab-item" :data-url="tabBar.selectItem==index?'':item.pagePath" @tap="reLaunch">
      <image :src="tabBar.selectItem==index?item.selectedIconPath:item.iconPath"></image>
      <text :style="'color: ' + (tabBar.selectItem==index?tabBar.selectedColor:tabBar.color)">{{item.text}}</text>
    </view>
  </block>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    tabBar: {
      // tabBar 配置, 如上
      type: Object
    }
  },
  methods: {
    reLaunch(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        uni.reLaunch({
          url: url
        });
      }
    }

  }
};
</script>
<style>
/* component/DiyTabBar/DiyTabBar.wxss */
.tabBar{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 98rpx;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-around;
  right: 0;
  margin: 0 auto;
}

.tab-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-item image{
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 15rpx;
}

.tab-item text{
  font-size: 20rpx;
}
</style>