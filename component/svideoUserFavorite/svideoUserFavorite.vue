<template>
<view>
<!-- 直播/短视频 个人中心 喜欢模块 -->

<scroll-view class="live_user_tab_content_scroll" scroll-y="true" @scrolltolower="getMoreGoods">
    <view class="favorite">
        <view v-for="(item, index) in favoriteList" :key="index" class="f_item" :style="'margin-right:' + (index%3==2?'0rpx':'3rpx')" :data-videoId="item.video_id" @tap="goVideoPlay">
            <image class="f_img" :src="item.video_image" mode="aspectFill"></image>
            <view class="bottom">
                <view class="left">
                    <image :src="favIcon"></image>
                    <text>{{item.like_num}}</text>
                </view>
                <view class="right">
                    <image :src="playIcon"></image>
                    <text>{{item.click_num}}</text>
                </view>
            </view>
        </view>
    </view>
    <!-- 数据加载完毕 -->
	<dataLoaded :showFlag="!hasmore&&favoriteList.length>0" />

    <!-- 数据加载中 -->
	<dataLoading :showFlag="hasmore&&loading&&!firstLoading" />

    <!-- 页面loading -->
	<pageLoading :firstLoading="firstLoading" :loadingIcon="img_url + 'live/page_loading_icon.gif'" :topVal="467" />

    <!-- 页面空数据 -->
	<emptyData :showFlag="!firstLoading&&!favoriteList.length" :emptyIcon="img_url+'live/live_list_empty_icon.png'" />
    
    <block v-if="settingData.live_switch == 1 && memberInfo.is_own == 1">
        <view class="video_bottom"></view>
    </block>
</scroll-view>
</view>
</template>

<script>
import { checkPageHasMore } from "@/utils/live";
import request from "@/utils/request";
	import pageLoading from "@/addons/templates/live/pageLoading.vue";
	import emptyData from "@/addons/templates/live/emptyData.vue";
	import dataLoading from "@/addons/templates/live/dataLoading.vue";
	import dataLoaded from "@/addons/templates/live/dataLoaded.vue";
const img_url = getApp().globalData.img_url;

export default {
	components: {
		pageLoading,
		emptyData,
		dataLoading,
		dataLoaded,
	},
  data() {
    return {
      pn: 1,
      //当前页
      pageSize: 10,
      //每页数据
      loading: false,
      //数据加载状态
      favoriteList: [],
      //喜欢列表数据
      favIcon: img_url + 'svideo/fav_w.png',
      playIcon: img_url + 'svideo/watch_w.png',
      hasmore: true,
      //是否还有数据，用于页面展示
      firstLoading: true,
      //是否初次加载，是的话展示页面居中的loading效果，
      img_url: getApp().globalData.img_url //图片地址

    };
  },

  props: {
    memberInfo: {
      // 用户信息
      type: Object
    },
    authorInfo: {
      // 作者信息
      type: Object
    },
    settingData: {
      // 平台设置信息
      type: Object
    }
  },

  mounted() {
    this.getFavoriteList();
  },

  methods: {
    //获取喜欢数据
    getFavoriteList() {
      this.setData({
        loading: true
      });
      let {
        firstLoading,
        favoriteList,
        pageSize,
        pn,
        hasmore
      } = this;
      request({
        url: getApp().globalData.svideo_url + '/index.php?app=author&mod=getLikeVideoList',
        data: {
          key: uni.getStorageSync('token'),
          pageSize: pageSize,
          current: pn
        }
      }).then(res => {
        if (res.state == 200) {
          let list = res.data.video;

          if (pn == 1) {
            favoriteList = list;
          } else {
            favoriteList = favoriteList.concat(list);
          }
          if (checkPageHasMore(res.data.pagination)) {
            pn++;
          } else {
            hasmore = false;
          }
        } //初次加载的话更改状


        if (firstLoading) {
          firstLoading = false;
        }

        this.setData({
          loading: false,
          hasmore: hasmore,
          favoriteList: favoriteList,
          firstLoading: firstLoading,
          pn: pn
        });
      });
    },

    getMoreGoods() {
      if (this.hasmore) {
        this.getFavoriteList();
      }
    },

    //进入播放页面
    goVideoPlay(e) {
      let cur_video_id = e.currentTarget.dataset.videoid;
      uni.navigateTo({
        url: '../svideoPlay/svideoPlay?video_id=' + cur_video_id + '&label_id=' + this.curLabelId
      });
    }

  }
};
</script>
<style>

.live_user_tab_content_scroll {
    height: calc(100vh - 467rpx);
    background: #333;
}

.live_user_tab_content_scroll .favorite {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.live_user_tab_content_scroll .favorite .f_item {
    width: calc((100% - 6rpx) / 3);
    height: 323rpx;
    overflow: hidden;
    position: relative;
    margin-bottom: 3rpx;
    margin-right: 3rpx;
}

.live_user_tab_content_scroll .favorite .f_item .f_img {
    width: 100%;
    height: 100%;
}

.live_user_tab_content_scroll .favorite .f_item .bottom {
    position: absolute;
    bottom: 0;
    left: 0rpx;
    right: 0rpx;
    height: 92rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 2;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    padding: 0 10rpx 5rpx 5rpx;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left,
.live_user_tab_content_scroll .favorite .f_item .bottom .right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .right {
    justify-content: flex-end;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left image,
.live_user_tab_content_scroll .favorite .f_item .bottom .right image {
    width: 42rpx;
    height: 42rpx;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left text,
.live_user_tab_content_scroll .favorite .f_item .bottom .right text {
    color: #fff;
    font-size: 24rpx;
    margin-left: 3rpx;
}
	.video_bottom {
		height:161rpx;width:750rpx
	}
	/* #ifdef H5 */
	.video_bottom{
		height:261rpx;
	}
	/* #endif */

</style>