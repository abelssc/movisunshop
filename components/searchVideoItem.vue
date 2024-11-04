<template name="searchVideoItem">
     <view class="search_video_list">
            <view v-for="(item, index) in videoList" :key="index" class="search_video_item" :data-videoId="item.video_id" @tap="goVideoPlay">
                <view class="left">
                    <text class="video_name">{{item.video_name}}</text>
                    <text class="desc">{{item.introdution}}</text>
                    <view class="author">
                        <view class="avator" :style="'background:url({item.member_avatar})' + bgStyle"></view>
                        <text class="name">{{item.member_nickname}}</text>
                    </view>
                    <text class="goods">{{item.goods_num == 0 ? $L('暂无相关商品') : item.goods_num}}{{$L('件相关商品')}}</text>
                </view>
                <view class="right" :style="'background:url({item.video_image})' + bgStyle">
                    <text>{{item.click_num}}{{$L('次播放')}}</text>
                    <image :src="img_url+'svideo/play.png'"></image>
                </view>
            </view>
        </view>
</template>