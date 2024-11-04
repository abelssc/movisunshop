<template name="videoFollow">
  <block v-for="(item, index) in authorList" :key="index">
    <view class="fllow_list_item">
      <view class="left">
        <view :data-authorId="item.author_id" @tap="goLiveUserCenter" class="avator" :style="'background:url({item.member_avatar})' + bgStyle"></view>
        <view :data-authorId="item.author_id" @tap="goLiveUserCenter" class="mem_info">
          <text class="name">{{item.member_nickname}}</text>
          <text class="desc">{{item.introduction&&item.introduction!=null?item.introduction:$L('暂无简介')}}</text>
        </view>
      </view>
      <view class="right">
      <!-- <text bindtap='collect' data-index='{{index}}' data-authorId='{{item.author_id}}' class="fllow {{item.is_follow == 1 ? 'has_fllow' : ''}}">{{item.is_follow == 1 ? '已关注' : '关注'}}</text> -->
      <text v-if="true" class="fans_num">{{item.fans_num}}{{$L('粉丝')}}</text>
      </view>
    </view>
    <view v-if="authorList.length - index > 1" class="line_marginl_20"></view>
  </block>
</template>