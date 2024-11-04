<template name="listLiveItem">
    <view v-for="(item, index) in liveList" :key="index" :class="'live_list_item ' + (index==0?'live_list_item_first':'')" :data-liveId="item.live_id" @tap="goLivePlay">
        <view class="left" :style="'background:url({item.live_image_url})' + bgStyle">
            <view class="left_top">
                <view class="left_top_icon">
                    <block v-if="item.status == 2">
                        <image class="back_img" :src="img_url+'live/list_playback.png'" mode="aspectFit"></image>
                    </block>
                    <block v-else>
                        <image class="back_img_living" :src="img_url+'live/list_living.gif'" mode="aspectFit"></image>
                    </block>
                </view>
                <text class="watch_num_text left_top_num">{{item.click_num}}{{$L('观看')}}</text>
            </view>
            <view class="right_bottom" v-if="item.like_num!='0'">
                <image class="heart_icon" :src="img_url+'live/live_list_heart.gif'" mode="aspectFit"></image>
                <text class="watch_num_text bottom_right">{{item.like_num}}</text>
            </view>
        </view>

        <view class="right">
            <text class="live_name">{{item.live_name}}</text>
            <view class="member_info">
                <image class="avator" :src="item.member_avatar" mode="aspectFit"></image>
                <text class="nickname">{{item.member_nickname}}</text>
            </view>
            <block v-if="item.goods_list&&item.goods_list.length">
                <view class="goods_info">
                    <view class="first_goods" :style="'background:url({item.goods_list[0].goods_image})' + bgStyle">
                        <text class="goods_price">{{$L('¥')}}{{item.goods_list[0].goods_price}}</text>
                    </view>
                    <block v-if="item.goods_list&&item.goods_list.length>1">
                        <view class="second_goods" :style="'background:url({item.goods_list[1].goods_image})' + bgStyle">
                            <view class="second_goods_wrap">
                                <text class="total">{{item.goods_num>99?'99+':item.goods_num}}</text>
                                <text class="total">{{$L('宝贝')}}</text>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
        </view>
    </view>
</template>