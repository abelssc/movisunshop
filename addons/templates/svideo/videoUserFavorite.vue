<template>
<view>
<!-- 作者个人中心喜欢模块 -->
<template name="videoUserFavorite">
    <view class="favorite">
        <view v-for="(item, index) in favoriteList" :key="index" class="f_item">
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
</template>
</view>
</template>

<style>
.live_user_tab_content_scroll .favorite{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start
}

.live_user_tab_content_scroll .favorite .f_item{
    width: calc((100% - 6rpx) / 3);
    height: 323rpx;
    overflow: hidden;
    position: relative;
    margin-bottom: 3rpx;
    margin-right: 3rpx;
}

.live_user_tab_content_scroll .favorite .f_item .f_img{
    width: 100%;
    height: 100%;
}

.live_user_tab_content_scroll .favorite .f_item .bottom{
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
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8));
    padding: 0 10rpx 5rpx 5rpx;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left,.live_user_tab_content_scroll .favorite .f_item .bottom .right{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .right{
    justify-content: flex-end;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left image,.live_user_tab_content_scroll .favorite .f_item .bottom .right image{
    width: 42rpx;
    height: 42rpx;
}

.live_user_tab_content_scroll .favorite .f_item .bottom .left text,.live_user_tab_content_scroll .favorite .f_item .bottom .right text{
    color: #fff;
    font-size: 24rpx;
    margin-left: 3rpx;
}
</style>