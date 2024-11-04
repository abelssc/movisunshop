<template name="footer">
  <view id="ldj_footer">
    <view class="footer_item" data-url="/ldj/pages/index/index" @tap="imgSrc=='index'?'':'jumpPage'">
      <image :src="imgSrc=='index'?'/ldj/images/11.png':'/ldj/images/1.png'" mode="aspectFit"></image>
      <text :class="imgSrc=='index'?'on':''">{{$L('首页')}}</text>
    </view>

    <view class="footer_item" data-url="/ldj/pages/cart/cart" @tap="imgSrc=='cart'?'':'jumpPage'">
      <image :src="imgSrc=='cart'?'/ldj/images/22.png':'/ldj/images/2.png'" mode="aspectFit"></image>
      <text :class="'icon ' + (imgSrc=='cart'?'on':'') + ' ' + (icon_show?'ac':'')">{{$L('购物车')}}</text>
    </view>

    <view class="footer_item" data-url="/ldj/pages/order/order" @tap="imgSrc=='order'?'':'jumpPage'">
      <image :src="imgSrc=='order'?'/ldj/images/33.png':'/ldj/images/3.png'" mode="aspectFit"></image>
      <text :class="imgSrc=='order'?'on':''">{{$L('订单')}}</text>
    </view>

    <view class="footer_item" data-url="/ldj/pages/user/user" @tap="imgSrc=='user'?'':'jumpPage'">
      <image :src="imgSrc=='user'?'/ldj/images/44.png':'/ldj/images/4.png'" mode="aspectFit"></image>
      <text :class="imgSrc=='user'?'on':''">{{$L('我的')}}</text>
    </view>
  </view>
</template>