<template name="listVideoItem">
    <view class="video_list">
        <view v-for="(item, index) in videoList" :key="index" class="video_item" :data-videoId="item.video_id" @tap="goVideoPlay">
            <view class="play_num_bg" :style="'background:url({listPlayNum})' + bgStyle">
                <text class="play_num">{{item.click_num}}</text>
            </view>
            <view class="video_img" :style="'background:url({item.video_image})' + bgStyle"></view>
            <text class="name">{{item.video_name}}</text>
            <view class="author">
                <view class="author_info">
                    <view class="avator" :style="'background:url({item.member_avatar})' + bgStyle"></view>
                    <text>{{item.member_nickname}}</text>
                </view>
                <view class="fav">
                    <image :src="img_url+'svideo/fav.png'"></image>
                    <text>{{item.like_num}}</text>
                </view>
            </view>
        </view>
    </view>
</template>