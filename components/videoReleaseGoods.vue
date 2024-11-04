<template name="videoReleaseGoods">
    <block v-for="(item, index) in goods_lists" :key="index">
        <view class="line_marginl_20"></view>
        <view class="goods_item" :style="goods_lists.length - index == 1 ? 'border-radius:0 0 14rpx 14rpx' : 'border-radius:0'">
            <view class="goods_img" :data-gid="item.gid">
                <image :src="item.goods_image" mode="aspectFit"></image>
                <text>{{index+1}}</text>
            </view>
            <view class="right">
                <view class="top" :data-gid="item.gid">
                    <text class="name">{{item.goods_name}}</text>
                    <text class="jingle">{{item.goods_jingle}}</text>
                </view>
                <view class="bottom">
                    <view class="price">
                        <text class="unit">{{$L('¥')}}</text>
                        <text class="num">{{item.goods_price}}</text>
                    </view>
                    <text :data-gid="item.gid" class="del_goods" @tap="delGoods">{{$L('删除')}}</text>
                </view>
            </view>
        </view>
    </block>
</template>