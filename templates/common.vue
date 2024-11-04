<template>
<view>
<!-- 页面loading -->
<template name="pageLoading">
  <view class="page_loading" v-if="firstLoading" :style="'top:' + (topVal?topVal+'rpx':0) + ';height:calc(100vh - ' + (topVal+'rpx') + ')'">
    <image :src="loadingIcon"></image>
  </view>
</template>

<!-- 页面空数据 -->
<template name="emptyData">
  <view class="empty_data" v-if="showFlag">
      <image :src="emptyIcon" mode="aspectFit"></image>
      <text>暂无数据</text>
  </view>
</template>

<!-- 数据加载中 -->
<template name="dataLoading">
  <view class="loading" v-if="showFlag">
    <view class="spinner">
      <text></text>
    </view>
  数据加载中...
  </view>
</template>

<!-- 数据加载完毕 -->
<template name="dataLoaded">
  <view class="no-has-more" v-if="showFlag" style="background-color: transparent">
  数据加载完毕~
  </view>
</template>
</view>
</template>

<style>
/* template:pageLoading start */
.page_loading{
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.page_loading image{
  width: 60rpx;
  height: 60rpx;
}
/* template:pageLoading end */

/* template:emptyData start */
.empty_data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  width: 750rpx;
  margin-top: calc(50vw - 200rpx);
}

.empty_data image{
  width: 179rpx;
  height: 140rpx;
}

.empty_data text{
  font-size: 28rpx;
  margin-top: 20rpx;
  color: #949494;
}
/* template:emptyData end */

/* template:dataLoaded start */
.no-has-more {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  color: #949494;
  font-size: 22rpx;
}

.no-has-more::after, .no-has-more::before {
  position: absolute;
  content: '';
  width: 166rpx;
  height: 1rpx;
  background-color: rgba(0,0,0,0.1);
  top: 50%;
  transform: translateY(-50%) scaleY(0.5);
}

.no-has-more::after {
  right: 114rpx;
}

.no-has-more::before {
  left: 114rpx;
}
/* template:dataLoaded end */

/* 分页loading */
.loading{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  font-size: 24rpx;
  color: #999;
}

.spinner {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20rpx;
    font-size: 26rpx;
    width: 26rpx;
    height: 26rpx;
    text-align: left;
    border-radius: 50%;
    box-shadow: inset 0 0 0 3rpx rgba(58, 168, 237, .3);
}

.spinner text {
    position: absolute;
    clip: rect(0, 26rpx, 26rpx, 13rpx);
    width: 26rpx;
    height: 26rpx;
    animation: spinner-circle-clipper 1s ease-in-out infinite;
    -webkit-animation: spinner-circle-clipper 1s ease-in-out infinite;
}

@keyframes spinner-circle-clipper {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(180deg);
    }
}

@-webkit-keyframes spinner-circle-clipper {
    0% {
        -webkit-transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(180deg);
    }
}

.spinner text:after {
    position: absolute;
    clip: rect(0, 26rpx, 26rpx, 13rpx);
    width: 26rpx;
    height: 26rpx;
    content: '';
    animation: spinner-circle 1s ease-in-out infinite;
    -webkit-animation: spinner-circle 1s ease-in-out infinite;
    border-radius: 50%;
    box-shadow: inset 0 0 0 3rpx #3aa8ed;
}

@keyframes spinner-circle {
    0% {
        transform: rotate(-180deg);
    }
    100% {
        transform: rotate(180deg);
    }
}

@-webkit-keyframes spinner-circle {
    0% {
        -webkit-transform: rotate(-180deg);
    }
    100% {
        -webkit-transform: rotate(180deg);
    }
}

::-webkit-scrollbar{
    width: 0;
    height: 0;
    color: transparent;
}

</style>