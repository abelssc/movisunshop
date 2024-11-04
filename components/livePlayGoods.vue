<template name="livePlayGoods">
    <block v-for="(item, index) in goodsList" :key="index">
        <view class="goods_item">
            <view class="goods_img" :data-gid="item.gid" @tap="goGoodsDetail">
                <image :src="item.goods_image" mode="aspectFit"></image>
                <text>{{index+1}}</text>
            </view>
            <view class="right">
                <view class="top" :data-gid="item.gid" @tap="goGoodsDetail">
                    <text class="name">{{item.goods_name}}</text>
                    <text class="jingle">{{item.goods_jingle}}</text>
                </view>
                <view class="bottom">
                    <view class="price">
                        <text class="unit">{{$L('¥')}}</text>
                        <text class="num">{{item.goods_price}}</text>
                    </view>
                    <view class="click_num" v-if="false == undefined">
                        <image class="add_cart" v-if="memberInfo.is_own!=1" :src="img_url+'live/add_cart.png'" mode="aspectFit" :data-gid="item.gid" @tap="addCart"></image>
                        <block v-if="memberInfo.is_own==1">
                            <image class="img" :src="img_url+'live/eye.png'" mode="aspectFit"></image>
                            <text>{{item.goods_click}}</text>
                        </block>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="goodsList.length - index > 1" class="line_marginl_20"></view>
    </block>
</template>