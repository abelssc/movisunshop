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