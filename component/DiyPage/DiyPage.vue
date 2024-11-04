<template>
<view>
<!--首页 推荐 装修  -->

<block v-for="(item, index) in diyData" :key="index">

  <!--轮播模块  -->
  <view data-type="lunbo" v-if="item.type == 'lunbo'" data-index="index">
    <swiper circular="true" class="home_lunbo" :autoplay="swiperSetting.autoplay" :interval="swiperSetting.interval" :duration="swiperSetting.duration" :style="'height:' + item.height + 'rpx'">
      <block v-for="(childitem, childindex) in item.data" :key="childindex">
        <swiper-item>
          <block v-if="childitem.xcxPage">
            <navigator :open-type="childitem.navigateType" hover-class="none" :url="childitem.xcxPage">
              <image :src="childitem.img" class="slide-image" :style="'height:' + item.height + 'rpx'"></image>
            </navigator>
          </block>

          <block v-else>
            <view>
              <image :src="childitem.img" class="slide-image" :style="'height:' + item.height + 'rpx'" @click="$linkTo(childitem.url_type,childitem.url)"></image>
            </view> 
          </block>
        </swiper-item>
      </block>
    </swiper>
  </view>

  <!--导航模块  -->
  <view data-type="nav" v-if="item.type == 'nav'" :data-index="index">
    <view class="modules-nav">
      <ul :class="(item.style_set=='tag-nav'?'mod-tag-nav':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='left'?'mod-nav before-icon':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='no-icon'?'mod-nav no-icon':'') + ' ' + (item.style_set!='tag-nav'&&item.icon_set=='up'?'mod-nav':'')">
        <li v-for="(childitem, childindex) in item.data" :key="childindex" v-if="childitem.img != ''">
          <block v-if="childitem.xcxPage">
            <navigator class="nav-item" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" hover-class="none" :url="childitem.xcxPage" :open-type="childitem.navigateType">
              <span class="name_wrap" :style="'width:' + item.slide + 'px;'">
                <image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
              </span>
              <span style="color: #232326;">{{childitem.name}}</span>
            </navigator>
          </block>

          <block v-else>
            <view class="nav-item" :style="(item.style_set=='tag-nav'?'line-height:':'') + '' + (item.style_set=='tag-nav'?item.slide:'') + '' + (item.style_set=='tag-nav'?'px':'')" :data-id="childitem.url" @tap="childitem.url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <span class="name_wrap" :style="'width:' + item.slide + 'px;'">
                <image mode="widthFix" :style="'width:' + item.slide + 'px;'" :src="childitem.img"></image>
              </span>
              <span style="color: #232326;">{{childitem.name}}</span>
            </view>
          </block>
        </li>
      </ul>
    </view>
  </view>

  <!--推荐商品  -->
  <view data-type="tuijianshangpin" v-if="item.type == 'tuijianshangpin'" :data-index="index">
    <div :class="'index_block goods ' + (item.isshow_title == '0'&&item.isshow_price == '0'?'hide_title hide_price':'') + ' ' + (item.isshow_title == '0'&&item.isshow_price == '1'?'hide_title':'') + ' ' + (item.isshow_title == '1'&&item.isshow_price == '0'?'hide_price':'')">
      <div class="new-content">
        <div v-for="(childitem, childindex) in item.data.goods_info" :key="childindex" :class="'goods-item goods-' + item.show_style">
          <navigator :url="'/pages/goods_detail/goods_detail?gid=' + childitem.gid">
            <div class="goods-item-pic">
              <image mode="aspectFit" :src="childitem.goods_image" alt></image>
            </div>
            <div class="goods-item-name">{{childitem.goods_name}}</div>
            <div class="goods-item-price">
              <span class="yens">{{$L('￥')}}</span>
              <em class="bigprice">{{childitem.show_price}}</em>
            </div>
          </navigator>
        </div>
      </div>
    </div>
  </view>

  <!--图片组合0123  -->
  <view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style<4" :data-index="index">
    <div class="modules-slide">
      <div :class="'image-list style' + item.sele_style" :data-id="item.sele_style">
        <ul class="clearfix">
          <li v-for="(childitem, childindex) in item.data" :key="childindex">
            <block v-if="childitem.xcxPage">
				<block v-if="childitem.url_type=='points'">
				  <navigator  url='/pages/Balance/Balance?type=points'>
				    <image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
				  </navigator>
				</block>
				<block v-else>
              <navigator :open-type="childitem.navigateType" hover-class="none" :url="childitem.xcxPage">
                <image mode="widthFix" :src="childitem.img" style="display: inline;width:childitem.width+'rpx';height:childitem.height+'rpx';"></image>
              </navigator>
			  </block>
            </block>
            <block v-else>
              <navigator  :data-id="childitem.url" @tap="childitem.url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
                <image mode="widthFix" :src="childitem.img" style="display: inline;"></image>
              </navigator>
            </block>
          </li>
        </ul>
      </div>
    </div>
  </view>

  <!--图片组合4  -->
  <view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==4" :data-index="index">
    <div class="modules-slide">
      <div class="image-ad clearfix images-tpl">
        <div>
          <block v-if="item['data'][0].xcxPage">
            <navigator :open-type="item['data'][0].navigateType" hover-class="none" :url="item['data'][0].xcxPage">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][0].url" @tap="item['data'][0].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>
        </div>

        <div>
          <block v-if="item['data'][1].xcxPage">
            <navigator :open-type="item['data'][1].navigateType" hover-class="none" :url="item['data'][1].xcxPage">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][1].url" @tap="item['data'][1].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][2].xcxPage">
            <navigator :open-type="item['data'][2].navigateType" hover-class="none" :url="item['data'][2].xcxPage">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][2].url" @tap="item['data'][2].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>
        </div>
      </div>
    </div>
  </view>

  <!--图片组合5  -->
  <view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==5" :data-index="index">
    <div class="modules-slide">
      <div class="image-ad2 clearfix images-tpl">
        <div class="clearfix">
          <block v-if="item['data'][0].xcxPage">
            <navigator :open-type="item['data'][0].navigateType" class="small" hover-class="none" :url="item['data'][0].xcxPage">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator class="small" :data-id="item['data'][0].url" @tap="item['data'][0].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][1].xcxPage">
            <navigator :open-type="item['data'][1].navigateType" class="big" hover-class="none" :url="item['data'][1].xcxPage">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator class="big" :data-id="item['data'][1].url" @tap="item['data'][1].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>

        </div>
        <div class="clearfix">

          <block v-if="item['data'][2].xcxPage">
            <navigator :open-type="item['data'][2].navigateType" class="big" hover-class="none" :url="item['data'][2].xcxPage">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator class="big" :data-id="item['data'][2].url" @tap="item['data'][2].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][3].xcxPage">
            <navigator :open-type="item['data'][3].navigateType" class="small" hover-class="none" :url="item['data'][3].xcxPage">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator class="small" :data-id="item['data'][3].url" @tap="item['data'][3].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>

        </div>
      </div>
    </div>
  </view>

  <!--图片组合6  -->
  <view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==6" :data-index="index">
    <div class="modules-slide">
      <div class="image-ad3 clearfix images-tpl" style="clear:both;overflow:hidden">
        <div>

          <block v-if="item['data'][0].xcxPage">
            <navigator :open-type="item['data'][0].navigateType" hover-class="none" :url="item['data'][0].xcxPage">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][0].url" @tap="item['data'][0].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][1].xcxPage">
            <navigator :open-type="item['data'][1].navigateType" hover-class="none" :url="item['data'][1].xcxPage">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][1].url" @tap="item['data'][1].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>

        </div>

        <div>
          <block v-if="item['data'][2].xcxPage">
            <navigator :open-type="item['data'][2].navigateType" hover-class="none" :url="item['data'][2].xcxPage">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][2].url" @tap="item['data'][2].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][3].xcxPage">
            <navigator :open-type="item['data'][3].navigateType" hover-class="none" :url="item['data'][3].xcxPage">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][3].url" @tap="item['data'][3].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>

        </div>
      </div>
    </div>
  </view>

  <!--图片组合7  -->
  <view data-type="tupianzuhe" v-if="item.type == 'tupianzuhe'&&item.sele_style==7" data-index="index">
    <div class="modules-slide">
      <div listorder="5" class="image-ad4 clearfix images-tpl">
        <div>
          <block v-if="item['data'][0].xcxPage">
            <navigator :open-type="item['data'][0].navigateType" hover-class="none" :url="item['data'][0].xcxPage">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][0].url" @tap="item['data'][0].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][0].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][1].xcxPage">
            <navigator :open-type="item['data'][1].navigateType" hover-class="none" :url="item['data'][1].xcxPage">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][1].url" @tap="item['data'][1].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][1].img"></image>
            </navigator>
          </block>

        </div>
        <div>

          <block v-if="item['data'][2].xcxPage">
            <navigator :open-type="item['data'][2].navigateType" hover-class="none" :url="item['data'][2].xcxPage">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][2].url" @tap="item['data'][2].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][2].img"></image>
            </navigator>
          </block>

          <block v-if="item['data'][3].xcxPage">
            <navigator :open-type="item['data'][3].navigateType" hover-class="none" :url="item['data'][3].xcxPage">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][3].url" @tap="item['data'][3].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][3].img"></image>
            </navigator>
          </block>

        </div>
        <div>
          <block v-if="item['data'][4].xcxPage">
            <navigator :open-type="item['data'][4].navigateType" hover-class="none" :url="item['data'][4].xcxPage">
              <image mode="widthFix" :src="item['data'][4].img"></image>
            </navigator>
          </block>
          <block v-else>
            <navigator :data-id="item['data'][4].url" @tap="item['data'][4].url_type=='coupon'?ReceiveCoupon:$linkTo(childitem.url_type,childitem.url)">
              <image mode="widthFix" :src="item['data'][4].img"></image>
            </navigator>
          </block>
        </div>
      </div>
    </div>
  </view>

  <!--富文本 start -->
  <view data-type="fuwenben" v-if="item.type == 'fuwenben'" data-index="index">
    <div class="fuwenben_part">
      <block data-type="template" data-is="entry" data-attr="...item.article">
  <view :class="'h2w h2w-'">
    <view class="h2w__main">
      <!--<import src="./renderTemplate.wxml"></import>-->
      <!-- <block v-for="(item, index) in child" :key="index">
        <template is="m0" :data="item"></template>
      </block> -->
	  <view class="" v-html="item.article">
	  	
	  </view>
    </view>
  </view>
</block>
    </div>
  </view>
  <!--富文本 end -->

  <!-- 公告 start -->
  <view class="gonggao" data-type="gonggao" v-if="item.type == 'gonggao'" data-index="index">
    <view class="img">
      <image :src="img_url+'home_gonggao.png'" mode="widthFix"></image>
    </view>
    <view class="ani">
      <navigator :open-type="item.navigateType" :url="item.xcxPage" hover-class="none">
        <text>{{item.text}}</text>
      </navigator>
    </view>
  </view>
  <!-- 公告 end -->

  <!-- 搭配 start -->
  <view class="dapei" data-type="dapei" v-if="item.type == 'dapei'" data-index="index">
    <view class="dapei_top">
      <view class="dp_tj" v-if="item.dapei_title">{{item.dapei_title}}</view>
      <image :src="item.dapei_img" mode="widthFix" v-if="item.dapei_img"></image>
      <view class="dp_desc" v-if="item.dapei_desc">{{item.dapei_desc}}</view>
    </view>
    <scroll-view v-if="item.data.goods_info" scroll-x>
      <view v-for="(dpitem, dpindex) in item.data.goods_info" :key="dpindex" class="dp_item">
        <navigator :url="'/pages/goods_detail/goods_detail?gid=' + dpitem.gid" class="wrap">
          <view class="img">
            <image mode="aspectFit" :src="dpitem.goods_image"></image>
          </view>
          <text class="name">{{dpitem.goods_name}}</text>
          <view class="price"><text class="yens">{{$L('¥')}}</text> <text>{{dpitem.goods_price}}</text></view>
        </navigator>
      </view>
    </scroll-view>
  </view>
  <!-- 搭配 end -->


  <!-- 客服电话 start -->
  <view class="kefu" data-type="kefu" v-if="item.type == 'kefu'" data-index="index">
    <image :src="img_url+'call.png'" mode="widthFix"></image>
    <view>{{item.text}} {{item.tel}}</view>
  </view>
  <!-- 客服电话 end -->


  <!--辅助空白    -->
  <view data-type="fzkb" v-if="item.type == 'fzkb'" data-index="index">
    <div class="fzkb" :style="'width: 100%;height:' + item.text + 'px;background-color: #' + item.color"></div>
  </view>

  <!--辅助线  -->
  <view data-type="fzx" v-if="item.type == 'fzx'" data-index="index">
    <div class="fzx_part">
      <div :class="'fzx_content fzx_' + item.val">
      </div>
    </div>
  </view>

  <!--活动0 拼团 -->
  <view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==0  && item.data.left.top[0].goods_info!=null&& item.data.right.bottom[2].goods_info!=null && item.data.right.top[0].goods_info!=null" data-index="index">
    <div class="modules-huodong modules-slide">
      <div class="style_template">
        <div class="huodong-content">
          <div class="huodong-top">
            <navigator url="/integral/activity/pin_index/pin_index">
              <div class="huodong-top-bg">
                <image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-0.png'"></image>
              </div>
              <div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
            </navigator>
          </div>
          <div class="huodong-main">
            <div class="huodong-left" style=" position:relative">
              <image style=" width:100%;height: 100%; position:absolute;z-index:-10;left:0;top:0" :src="img_url+'huodong_left_bg.jpeg'"></image>
              <div class="huodong-left-top">
                <div class="huodong-left-top-layout">
                  <div class="main-title">{{item.data.left.top[0].title}}</div>
                  <div class="sub-title">
                    <span>{{item.data.left.top[0].subtitle}}</span>
                  </div>
                  <block v-if="item.data.left.top[0].gid">
                    <div class="countdown" :data-end_time_str="item.data.left.top[0].goods_info.extend_data.sld_end_time">
                      <div class="countdown-main" style="display: flex; align-items: center;">
                        <span style="font-size: 20rpx; transform: scale(1.3)">{{$L('距结束')}}：</span>
                        <span class="hours countdown-num">{{huodong_0.hours}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="min countdown-num">{{huodong_0.minutes}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="sec countdown-num">{{huodong_0.seconds}}</span>
                      </div>
                    </div>
                  </block>
                </div>
              </div>
              <div class="huodong-left-goods">
                <div class="huodong-left-goods-layout huodong-left-goods-item">
                  <block v-if="item.data.left.top[0].gid && item.data.left.top[0].goods_info.extend_data">
                    <navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.data.left.top[0].gid">
                      <div class="goods-thumb">
                        <block v-if="item.data.left.top[0].goods_info.goods_image">
                          <image mode="widthFix" :src="item.data.left.top[0].goods_info.goods_image"></image>
                        </block>
                        <block v-else>
                          <div class="empty-img"></div>
                        </block>
                      </div>
                      <div class="goods-price">
                        <div class="sale-price">
                          {{$L('¥')}}
                          <span class="money-number">{{item.data.left.top[0].goods_info.show_price}}</span>
                        </div>
                        <div class="market-price">
                          {{$L('¥')}}
                          <span class="money-number">{{item.data.left.top[0].goods_info.goods_price}}</span>
                        </div>
                      </div>
                      <div class="goods-other">
                        <div class="goods-extend-data">
                          <span>
                            <em>{{item.data.left.top[0].goods_info.extend_data.sld_team_count}}</em>{{$L('人团')}}</span>
                          <span style="margin: 0 30rpx;">|</span>
                          <span>{{$L('去开团')}}</span>
                        </div>
                      </div>
                    </navigator>
                  </block>
                  <block v-else>
                    <div style="text-align: center;font-size: 20rpx;height: 230rpx;line-height: 230rpx;display: table;padding: 20rpx;">
                      <p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择拼团活动')}}</p>
                    </div>
                  </block>
                </div>
              </div>
            </div>
            <div class="huodong-right">
              <div class="huodong-right-top">
                <div class="huodong-top-title">
                  <div class="main-title">{{item.data.right.top[0].title}}</div>
                  <div class="sub-title">
                    <span>{{item.data.right.top[0].subtitle}}</span>
                  </div>
                </div>
                <div class="huodong-goods-list">
                  <block v-if="item.data.right.top[0].gid">
                    <block v-if="item.data.right.top[0].goods_info">
                      <navigator v-for="(goods_info_item, goods_info_index) in item.data.right.top[0].goods_info" :key="goods_info_index" class="huodong-goods-item" :url="'/pages/goods_detail/goods_detail?gid=' + goods_info_item.gid">
                        <div class="goods-thumb">
                          <block v-if="goods_info_item.goods_image">
                            <image mode="aspectFit" :src="goods_info_item.goods_image"></image>       
                          
                          </block>
                          
                          <block v-else>
                            <div class="empty-img"></div>
                          </block>
                        </div>
                        <div class="huodong_priceBox">
                          <span class="huodong_priceText1">{{$L('￥')}}{{goods_info_item.show_price}}</span>
                          <!-- <span class="huodong_priceText2">{{$L('￥')}}{{goods_info_item.goods_marketprice}}</span> -->
                        </div>
                  
                      </navigator>
                    </block>
                  </block>
                </div>
              </div>
              <div class="huodong-right-bottom">
                <div class="huodong-goods-list">
                  <div class="huodong-goods-item">
                    <div class="huodong-top-title">
                      <div class="main-title">{{item.data.right.bottom[1].title}}</div>
                      <div class="sub-title">
                        <span>{{item.data.right.bottom[1].subtitle}}</span>
                      </div>
                    </div>
                    <navigator v-if="item.data.right.bottom[1].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.right.bottom[1].gid" class="goods-thumb">
                      <block v-if="item.data.right.bottom[1].goods_info[0].goods_image">
                        <image mode="aspectFit" :src="item.data.right.bottom[1].goods_info[0].goods_image"></image>
                      </block>
                      <block v-else>
                        <div class="empty-img"></div>
                      </block>
                      
                    </navigator>
                    <div class="huodong_priceBox">
                          <span class="huodong_priceText1">{{$L('￥')}}{{item.data.right.bottom[1].goods_info[0].show_price}}</span>
                          <span class="huodong_priceText2">{{$L('￥')}}{{item.data.right.bottom[1].goods_info[0].goods_price}}</span>
                        </div>
                  </div>
                  <div class="huodong-goods-item" style="border-width: 0.05rem 0 0 0;">
                    <div class="huodong-top-title">
                      <div class="main-title">{{item.data.right.bottom[2].title}}</div>
                      <div class="sub-title">
                        <span>{{item.data.right.bottom[2].subtitle}}</span>
                      </div>
                    </div>
                    <navigator v-if="item.data.right.bottom[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.right.bottom[2].gid" class="goods-thumb">
                      <block v-if="item.data.right.bottom[2].goods_info[0].goods_image">
                        <image mode="aspectFit" :src="item.data.right.bottom[2].goods_info[0].goods_image"></image>
                      </block>
                      <block v-else>
                        <div class="empty-img"></div>
                      </block>
                    </navigator>
                    <div class="huodong_priceBox">
                          <span class="huodong_priceText1">{{$L('￥')}}{{item.data.right.bottom[2].goods_info[0].show_price}}</span>
                          <span class="huodong_priceText2">{{$L('￥')}}{{item.data.right.bottom[2].goods_info[0].goods_price}}</span>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </view>

  <!--活动1 限时折扣 -->
  <view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==1 && item.data.bottom.left[1].goods_info!=null && item.data.bottom.mid[2].goods_info!=null && item.data.bottom.right[3].goods_info!=null" data-index="index">
    <div class="modules-huodong modules-slide">
      <div class="style_template">
        <div class="huodong-content style-1">
          <div class="huodong-top">
            <navigator url="/integral/activity/discount/discount">
              <div class="huodong-top-bg">
                <image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-1.jpg'"></image>
              </div>
              <div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
            </navigator>
          </div>
          <div class="huodong-main">
            <!--  -->
            <div class="huodong-goods-list">
              <div class="huodong-goods-item">
                <block v-if="item.data.bottom.left[1].gid && item.data.bottom.left[1].goods_info[0].extend_data">
                  <div class="huodong-top-title">
                    <div class="main-title">{{item.data.bottom.left[1].title}}</div>
                    <div class="sub-title">
                      <span>{{item.data.bottom.left[1].subtitle}}</span>
                    </div>
                    <div class="countdown" v-if="item.data.bottom.left[1].gid" :data-end_time_str="item.data.bottom.left[1].goods_info[0].extend_data.sld_end_time">
                      <div class="countdown-main">
                        <span class="hours countdown-num">{{huodong_1[0].hours}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="min countdown-num">{{huodong_1[0].minutes}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="sec countdown-num">{{huodong_1[0].seconds}}</span>
                      </div>
                    </div>
                  </div>
                  <navigator v-if="item.data.bottom.left[1].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.left[1].goods_info[0].gid" class="goods-thumb">
                    <block v-if="item.data.bottom.left[1].gid && item.data.bottom.left[1].goods_info[0].goods_image">
                      <image mode="aspectFit" :src="item.data.bottom.left[1].goods_info[0].goods_image"></image>
                    </block>
                    <block v-else>
                      <div class="empty-img"></div>
                    </block>
                  </navigator>
                  <div class="huodong-style-1-bottom" v-if="item.data.bottom.left[1].gid">
                    <div class="goods-price">
                      <div class="sale-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.left[1].goods_info[0].promotion_price}}</span>
                      </div>
                      <div class="market-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.left[1].goods_info[0].goods_marketprice}}</span>
                      </div>
                    </div>
                    <div class="goods-bottom-button">
                      <a href="javascript:;">抢</a>
                    </div>
                  </div>
                </block>
                <block v-else>
                  <div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
                    <p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
                  </div>
                </block>
              </div>
              <div class="huodong-goods-item">
                <block v-if="item.data.bottom.mid[2].gid && item.data.bottom.mid[2].goods_info[0].extend_data">
                  <div class="huodong-top-title">
                    <div class="main-title">{{item.data.bottom.mid[2].title}}</div>
                    <div class="sub-title">
                      <span>{{item.data.bottom.mid[2].subtitle}}</span>
                    </div>
                    <div class="countdown" v-if="item.data.bottom.mid[2].gid" :data-end_time_str="item.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time">
                      <div class="countdown-main">
                        <span class="hours countdown-num">{{huodong_1[1].hours}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="min countdown-num">{{huodong_1[1].minutes}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="sec countdown-num">{{huodong_1[1].seconds}}</span>
                      </div>
                    </div>
                  </div>
                  <navigator v-if="item.data.bottom.mid[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-thumb">
                    <block v-if="item.data.bottom.mid[2].goods_info[0].goods_image">
                      <image mode="aspectFit" :src="item.data.bottom.mid[2].goods_info[0].goods_image"></image>
                    </block>
                    <block v-else>
                      <div class="empty-img"></div>
                    </block>
                  </navigator>
                  <div class="huodong-style-1-bottom" v-if="item.data.bottom.mid[2].gid">
                    <div class="goods-price">
                      <div class="sale-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.mid[2].goods_info[0].promotion_price}}</span>
                      </div>
                      <div class="market-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.mid[2].goods_info[0].goods_marketprice}}</span>
                      </div>
                    </div>
                    <div class="goods-bottom-button">
                      <a href="javascript:;">{{$L('抢')}}</a>
                    </div>
                  </div>
                </block>
                <block v-else>
                  <div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
                    <p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
                  </div>
                </block>
              </div>
              <div class="huodong-goods-item">
                <block v-if="item.data.bottom.right[3].gid && item.data.bottom.right[3].goods_info[0].extend_data">
                  <div class="huodong-top-title">
                    <div class="main-title">{{item.data.bottom.right[3].title}}</div>
                    <div class="sub-title">
                      <span>{{item.data.bottom.right[3].subtitle}}</span>
                    </div>
                    <div class="countdown" v-if="item.data.bottom.right[3].gid" :data-end_time_str="item.data.bottom.right[3].goods_info[0].extend_data.sld_end_time">
                      <div class="countdown-main">
                        <span class="hours countdown-num">{{huodong_1[2].hours}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="min countdown-num">{{huodong_1[2].minutes}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="sec countdown-num">{{huodong_1[2].seconds}}</span>
                      </div>
                    </div>
                  </div>
                  <navigator v-if="item.data.bottom.right[3].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.right[3].goods_info[0].gid" class="goods-thumb">
                    <block v-if="item.data.bottom.right[3].goods_info[0].goods_image">
                      <image mode="aspectFit" :src="item.data.bottom.right[3].goods_info[0].goods_image"></image>
                    </block>
                    <block v-else>
                      <div class="empty-img"></div>
                    </block>
                  </navigator>
                  <div class="huodong-style-1-bottom" v-if="item.data.bottom.right[3].gid">
                    <div class="goods-price">
                      <div class="sale-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.right[3].goods_info[0].promotion_price}}</span>
                      </div>
                      <div class="market-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.right[3].goods_info[0].goods_marketprice}}</span>
                      </div>
                    </div>
                    <div class="goods-bottom-button">
                      <a href="javascript:;">{{$L('抢')}}</a>
                    </div>
                  </div>
                </block>
                <block v-else>
                  <div style="text-align: center;font-size: 20rpx;height: 332rpx;line-height: 230rpx;display: table;padding: 20rpx;">
                    <p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择限时折扣活动')}}</p>
                  </div>
                </block>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </view>

  <!--活动2 团购 -->
  <view data-type="huodong" v-if="item.type == 'huodong' && item.sele_style==2 && item.data.bottom.mid[2].goods_info!=null" data-index="index">
    <div class="modules-huodong modules-slide">
      <div class="style_template">

        <div class="huodong-content style-2">
          <div class="huodong-top">
            <navigator url="/integral/activity/tuan_index/tuan_index">
              <div class="huodong-top-bg">
                <image mode="widthFix" style="width:100%;" :src="img_url+'huodong_top_bg-2.jpg'"></image>
              </div>
              <div class="huodong-top-title">{{item.data.top.top[0].title}}</div>
            </navigator>
          </div>
          <div class="huodong-main" style="position: relative;">
            <image style=" width:100%;height:333.5rpx; position:absolute;z-index:-10;left:0;top:0" :src="img_url+'huodong_main_bg-2.jpg'"></image>
            <div class="huodong-goods-list">
              <div class="huodong-goods-item">
                <block v-if="item.data.bottom.mid[2].gid && item.data.bottom.mid[2].goods_info[0].extend_data">
                  <navigator v-if="item.data.bottom.mid[2].gid" :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-thumb">
                    <block v-if="item.data.bottom.mid[2].goods_info[0].goods_image">
                      <image mode="widthFix" :src="item.data.bottom.mid[2].goods_info[0].goods_image"></image>
                    </block>
                    <block v-else>
                      <div class="empty-img"></div>
                    </block>
                  </navigator>
                  <div class="huodong-style-2-right">
                    <div class="countdown tuangou" v-if="item.data.bottom.mid[2].gid" :data-end_time_str="item.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time">
                      <text>{{$L('距结束')}}</text>
                      <div class="countdown-main">
                        <span class="hours countdown-num">{{huodong_2.hours}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="min countdown-num">{{huodong_2.minutes}}</span>
                        <span class="countdown-break-flag">:</span>
                        <span class="sec countdown-num">{{huodong_2.seconds}}</span>
                      </div>
                    </div>
                    <div class="main-title">{{item.data.bottom.mid[2].title}}</div>
                    <div v-if="item.data.bottom.mid[2].gid" class="goods-price">
                      <div class="sale-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.mid[2].goods_info[0].promotion_price}}</span>
                      </div>
                      <div class="market-price">
                        {{$L('¥')}}
                        <span class="money-number">{{item.data.bottom.mid[2].goods_info[0].goods_marketprice}}</span>
                      </div>
                    </div>
                    <div class="goods-other">
                      <div class="goods-tuan-info">
                        {{$L('已团')}}
                        <span>{{item.data.bottom.mid[2].goods_info[0].extend_data.buyed_quantity}}</span>{{$L('件')}}
                      </div>
                      <div class="goods-tuan-btn">
                        <navigator :url="'/pages/goods_detail/goods_detail?gid=' + item.data.bottom.mid[2].goods_info[0].gid" class="goods-tuan-btn-navigator">
                          <span>{{$L('立即团')}}</span>
                          <span class="arrow-right">></span>
                        </navigator>
                      </div>
                    </div>
                  </div>
                </block>
                <block v-else>
                  <div style="text-align: center;font-size: 20rpx;height: 100%;line-height: 230rpx;display: table;padding: 20rpx;margin: 0 auto;">
                    <p style="line-height: 30rpx;display: table-cell;vertical-align: middle;color: #cccccc;">{{$L('该活动已结束，请重新选择团购活动')}}</p>
                  </div>
                </block>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </view>

  <view data-type="coupon" v-if="item.type == 'coupon'" data-index="index">
    <view class="modules-coupon">
      <view class="coupon-layout">
        <view class="coupon-title"> {{$L('优惠券')}}</view>
      </view>

      <view class="coupon-content">
        <scroll-view scroll-x="true" class="coupon-listScroll">
          <view v-for="(coupon_item, index2) in item.data.coupon_info" :key="index2" :data-id="coupon_item.id" class="coupon-item" @tap="ReceiveCoupon">
            <view class="coupon-money"><em style="font-size: 34rpx">{{$L('¥')}}</em>{{coupon_item.redinfo_money}}</view>
            <view class="coupon-item-desc">{{coupon_item.red_info_desc}}</view>
            <view class="coupon-item-time">{{$L('有效期：')}}{{coupon_item.red_info_time}}</view>
          </view>
        </scroll-view>
      </view>

    </view>
  </view>
</block>
</view>
</template>

<script>
// component/DiyPage/DiyPage.js
import request from "../../utils/request";
import { run_clock } from "../../utils/common";
const linkType = [{
  code: "keywords",
  // 装修数据的 url_type
  page: '/pages/goods_list/goods_list?keyword=',
  // 跳转的页面路径，绝对路径
  navigateType: 'navigate' // navigator 的 open-type

}, {
  code: "keyword",
  page: '/pages/goods_list/goods_list?keyword=',
  navigateType: 'navigate'
}, {
  code: "special",
  page: '/pages/found/subject?u=',
  navigateType: 'navigate'
}, {
  code: "category",
  page: '/pages/goods_list/goods_list?gc_id=',
  navigateType: 'navigate'
}, {
  code: "goods",
  page: '/pages/goods_detail/goods_detail?gid=',
  navigateType: 'navigate'
}, {
  code: "promote",
  child: [{
    childUrl: 'cwap_tuan',
    page: '/integral/activity/tuan_index/tuan_index',
    navigateType: 'navigate'
  }, {
    childUrl: 'cwap_discount',
    page: '/integral/activity/discount/discount',
    navigateType: 'navigate'
  }, {
    childUrl: 'pin_index',
    page: '/integral/activity/pin_index/pin_index',
    navigateType: 'navigate'
  }, {
    childUrl: 'ladder',
    page: '/addons/pages/ladderIndex/ladderIndex',
    navigateType: 'navigate'
  }, {
    childUrl: 'presale',
    page: '/addons/pages/presaleIndex/presaleIndex',
    navigateType: 'navigate'
  }]
}, {
  code: "shop",
  page: '/pages/shopHomePage/shopHomePage?vid=',
  navigateType: 'navigate'
}, {
  code: "checkin",
  page: '/pages/singIn/singIn',
  navigateType: 'navigate'
}, {
  code: "points",
  page: '/pages/integral/integral',
  navigateType: 'navigate'
}, {
  code: "getcoupon",
  page: '/pages/red/red_get_list',
  navigateType: 'navigate'
}, {
  code: "pointscenter",
  page: '/integral/pages/index/index',
  navigateType: 'navigate'
}, {
  code: "spleader",
  page: '/addons/pages/tsIndex/tsIndex',
  navigateType: 'navigate'
}, {
  code: "o2o",
  page: '/ldj/pages/index/index',
  navigateType: 'navigate'
}, {
  code: "live",
  page: '/addons/pages/liveList/liveList',
  navigateType: 'navigate'
}, {
  code: "svideo",
  page: '/addons/pages/svideoList/svideoList',
  navigateType: 'navigate'
}, {
  code: "shopstreet",
  page: '/pages/shoplist/shoplist',
  navigateType: 'navigate'
}, {
  code: "url",
  child: [{
    childUrl: 'points_shop',
    page: '/integral/pages/index/index',
    navigateType: 'navigate'
  }, {
    childUrl: 'ldj',
    page: '/ldj/pages/index/index',
    navigateType: 'navigate'
  }, {
    childUrl: 'vendorlist',
    page: '/pages/shoplist/shoplist',
    navigateType: 'navigate'
  }, {
    childUrl: 'goods',
    page: '/pages/goods_detail/goods_detail?gid=',
    navigateType: 'navigate'
  }, {
    childUrl: 'keyword',
    page: '/pages/goods_list/goods_list?keyword=',
    navigateType: 'navigate'
  }, {
    childUrl: 'goodslist',
    page: '/pages/goods_list/goods_list?keyword=',
    navigateType: 'navigate'
  }, {
    childUrl: 'special',
    page: '/pages/found/subject?u=',
    navigateType: 'navigate'
  }, {
    childUrl: 'goodscat',
    page: '/pages/goods_list/goods_list?gc_id=',
    navigateType: 'navigate'
  }, {
    childUrl: 'vendor',
    page: '/pages/shopHomePage/shopHomePage?vid=',
    navigateType: 'navigate'
  }, {
    childUrl: 'sighlogin',
    page: '/pages/singIn/singIn',
    navigateType: 'navigate'
  }, {
    childUrl: 'fenlei',
    page: '/pages/categroy/categroy',
    navigateType: 'switchTab'
  }, {
    childUrl: 'voucherlist',
    page: '/pages/red/red_get_list',
    navigateType: 'navigate'
  }, {
    childUrl: 'cart',
    page: '/pages/cart/cart',
    navigateType: 'switchTab'
  }, {
    childUrl: 'usercenter',
    page: '/pages/user/user',
    navigateType: 'switchTab'
  }, {
    childUrl: 'pin_index',
    page: '/integral/activity/pin_index/pin_index',
    navigateType: 'navigate'
  }, {
    childUrl: 'tuan_index',
    page: '/integral/activity/tuan_index/tuan_index',
    navigateType: 'navigate'
  }, {
    childUrl: 'xianshi_index',
    page: '/integral/activity/discount/discount',
    navigateType: 'navigate'
  }, {
    childUrl: 'presale_home',
    page: '/addons/pages/presaleIndex/presaleIndex',
    navigateType: 'navigate'
  }, {
    childUrl: 'ladder_home',
    page: '/addons/pages/ladderIndex/ladderIndex',
    navigateType: 'navigate'
  }, {
    childUrl: 'vendorgoodslist',
    //店铺商品列表
    page: '/pages/productSearch/productSearch',
    navigateType: 'navigate'
  }]
}, {
  code: "coupon",
  // 优惠券绑定ReceiveCoupon事件
  page: ''
}];

export default {
  data() {
    return {
      diyData: [],
      img_url: getApp().globalData.img_url,
      huodong_0: {
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      huodong_1: [{
        hours: '00',
        minutes: '00',
        seconds: '00'
      }, {
        hours: '00',
        minutes: '00',
        seconds: '00'
      }, {
        hours: '00',
        minutes: '00',
        seconds: '00'
      }],
      huodong_2: {
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    };
  },

  components: {},
  props: {
    sourceData: {
      // 装修数据， 必须
      type: Array,
      default: []
    },
    vid: {
      // 店铺id
      type: Number,
      default: 0
    },
    swiperSetting: {
      // 轮播图设置
      type: Object,
      default: () => ({
        autoplay: true,
        interval: 5000,
        duration: 500
      })
    }
  },

  mounted() {
    this.initFun();
  },
  
  watch: {
	sourceData(val) {
		this.initFun();
	}
  },

  methods: {
    initFun() {
      let {
        sourceData
      } = this;
      if (!sourceData && !sourceData.length) return;
      sourceData.forEach(el => {
        switch (el.type) {
          case 'lunbo':
            el.data.map(item => {
              let result = this.buildUrl(item);
              item.xcxPage = result.page;
              item.navigateType = result.navigateType;
            });
            break;

          case 'gonggao':
            let result = this.buildUrl(el);
            el.xcxPage = result.page;
            el.navigateType = result.navigateType;
			
            break;

          case 'nav':
            el.data.map(item => {
              let result = this.buildUrl(item);
              item.xcxPage = result.page;
              item.navigateType = result.navigateType;
            });
            break;

          case 'huodong':
            // 处理活动倒计时
            switch (el.sele_style) {
              case '0':
                if (el.data.left.top[0].goods_info && el.data.left.top[0].goods_info.extend_data && el.data.left.top[0].goods_info.extend_data.sld_end_time) {
                  run_clock(this, el.data.left.top[0].goods_info.extend_data.sld_end_time, 'huodong_0');
                }

                break;

              case '1':
                if (el.data.bottom.left[1].goods_info && el.data.bottom.left[1].goods_info[0] && el.data.bottom.left[1].goods_info[0].extend_data && el.data.bottom.left[1].goods_info[0].extend_data.sld_end_time) {
                  run_clock(this, el.data.bottom.left[1].goods_info[0].extend_data.sld_end_time, 'huodong_1[0]');
                }

                if (el.data.bottom.mid[2].goods_info && el.data.bottom.mid[2].goods_info[0] && el.data.bottom.mid[2].goods_info[0].extend_data && el.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time) {
                  run_clock(this, el.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time, 'huodong_1[1]');
                }

                if (el.data.bottom.right[3].goods_info && el.data.bottom.right[3].goods_info[0] && el.data.bottom.right[3].goods_info[0].extend_data && el.data.bottom.right[3].goods_info[0].extend_data.sld_end_time) {
                  run_clock(this, el.data.bottom.right[3].goods_info[0].extend_data.sld_end_time, 'huodong_1[2]');
                }

                break;

              case '2':
                if (el.data.bottom.mid[2].goods_info && el.data.bottom.mid[2].goods_info[0] && el.data.bottom.mid[2].goods_info[0].extend_data && el.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time) {
                  run_clock(this, el.data.bottom.mid[2].goods_info[0].extend_data.sld_end_time, 'huodong_2');
                }

                break;
            }

            break;

          case 'tupianzuhe':
            el.data.map(item => {
              let result = this.buildUrl(item);
              item.xcxPage = result.page;
              item.navigateType = result.navigateType;
            });
            break;

          case 'fuwenben':
            // 处理富文本
            el.article = el.text;
            break;

          default:
            break;
        }
      });
      this.setData({
        diyData: sourceData
      });
    },

    // 组装 url
    buildUrl(data) {
      let res = {
        page: '',
        navigateType: ''
      };

      for (let i = 0; i < linkType.length; i++) {
        let el = linkType[i];

        if (data.url_type === el.code) {
          if (el.code === 'promote') {
            el.child.forEach(item => {
              if (item.childUrl === data.url) {
                res.page = item.page;
                res.navigateType = item.navigateType;
              }
            });
          } else if (el.code === 'url') {
            el.child.forEach(item => {
              if (item.childUrl === data.url_type_new) {
                if (data.url_type_new == 'vendorgoodslist') {
                  res.page = item.page + '?searchVal=' + data.url_new.keyword + '&vid=' + data.url_new.vid;
                } else {
                  res.page = item.page + (data.url_new ? data.url_new : '');
                }

                res.navigateType = item.navigateType;
              }
            });
          } else if (el.page) {
            res.page = el.page + (data.url ? data.url : '');
            res.navigateType = el.navigateType;

            if (this.vid != undefined && this.vid) {
              if (el.code === 'keywords') {
				  if(data.url_type == 'keywords'){
					  res.page = '/pages/productSearch/productSearch?searchVal=' + data.url + '&vid=' + this.vid;
				  }
				  if(data.url_new != undefined && data.url_new.keyword ){
					   res.page = '/pages/productSearch/productSearch?searchVal=' + data.url_new.keyword + '&vid=' + data.url_new.vid;
				  }
                
              }
            }
          }

          break;
        }
      }

      return res;
    },

    // 领券
    ReceiveCoupon(e) {
      let id = e.currentTarget.dataset.id;
      let key = uni.getStorageSync('token');

      if (!key) {
        getApp().globalData.goLogin();
        return;
      } else {
        if (id) {
          request({
            url: getApp().globalData.ser_url + '/index.php?app=red&mod=send_red&sld_addons=red',
            data: {
              key: key,
              red_id: id
            },
            loading: true,
            loadingTxt: this.$L('正在领券')
          }).then(res => {
            if (res.datas == 1) {
              uni.showToast({
                title: this.$L('领取成功'),
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: res.datas,
                icon: 'none'
              });
            }
          });
        }
      }
    }

  }
};
</script>
<style>
.home_lunbo image {
  width: 100%;
  height: 100%;
}

.sld-img-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*导航样式  */

.modules-nav {
  display: block;
  clear: both;
  overflow: hidden;
  background-color: #fff;
}

.modules-nav div {
  box-sizing: border-box;
}

.mod-nav {
  display: flex;
  min-height: 120rpx;
  align-items: center;
}

.mod-nav li {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 60rpx;
  
}

.mod-nav image {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.mod-nav li .nav-item span.name_wrap {
  display: block;
  width: 101rpx;
  margin: 10rpx auto;
}

.mod-tag-nav li .nav-item span.name_wrap {
  margin-right: 23rpx;
}

.modules-nav .mod-nav li .nav-item span {
  font-size: 26rpx;
  text-align: center;
  
}

.mod-nav li .nav-item>span {
  display: block;
  margin: 0 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@-webkit-keyframes myfirst {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes endshow {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@-webkit-keyframes infirst {
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes endfirst {
  from {
    background: rgba(255, 255, 255, 1);
  }

  to {
    background: rgba(255, 255, 255, 0.6);
  }
}

input.htsearch-input::-webkit-input-placeholder {
  color: #000;
}

.bgshow_top {
  animation: myfirst 1s;
  -moz-animation: myfirst 1s;
  /* Firefox */
  -webkit-animation: myfirst 1s;
  /* Safari 和 Chrome */
  -o-animation: myfirst 1s;
  /* Opera */
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  /* Safari 和 Chrome */
}

.bghide_top {
  animation: endshow 1s;
  -moz-animation: endshow 1s;
  /* Firefox */
  -webkit-animation: endshow 1s;
  /* Safari 和 Chrome */
  -o-animation: endshow 1s;
  /* Opera */
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  /* Safari 和 Chrome */
}

.inputtm_top {
  animation: infirst 1s;
  -moz-animation: infirst 1s;
  /* Firefox */
  -webkit-animation: infirst 1s;
  /* Safari 和 Chrome */
  -o-animation: infirst 1s;
  /* Opera */
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  /* Safari 和 Chrome */
}

.inputntm_top {
  animation: endfirst 1s;
  -moz-animation: endfirst 1s;
  /* Firefox */
  -webkit-animation: endfirst 1s;
  /* Safari 和 Chrome */
  -o-animation: endfirst 1s;
  /* Opera */
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  /* Safari 和 Chrome */
}

.mod-tag-nav {
  padding: 16rpx 16rpx 0 0;
  clear: both;
  overflow: hidden;
  box-sizing: border-box;
  display: block;
}

.mod-tag-nav li {
  width: 50%;
  float: left;
  padding: 0 0 16rpx 16rpx;
  box-sizing: border-box;
}

.modules-nav section {
  display: block;
}

.mod-tag-nav li navigator {
  display: block;
  background: #fff;
  color: #555;
  padding: 10rpx;
  line-height: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mod-tag-nav li navigator image {
  margin-right: 23rpx;
}

.mod-tag-nav li navigator span {
  font-size: 27rpx;
  display: inline-block;
  vertical-align: middle;
}

.mod-nav.no-icon li navigator .name_wrap {
  display: none;
}

.mod-nav.no-icon li .name_wrap {
  display: none !important;
}

.mod-nav.no-icon li span {
  line-height: 80rpx;
}

.mod-nav.before-icon li span {
  padding: 0;
  line-height: 155rpx;
}

.mod-nav.before-icon li span>i,
.mod-nav.before-icon li navigator>span {
  display: inline-block;
}

/*辅助空白样式  */

.fzkb {
  display: block;
}

/*辅助线样式  */

.fzx_part {
  margin: 10rpx 16rpx;
  height: 2rpx;
  display: block;
}

.fzx_part .fzx_content.fzx_solid,
.fzx_part .fzx_content.fzx_dashed {
  position: relative;
}

.fzx_part .fzx_content.fzx_solid:after {
  height: 2rpx;
  content: '';
  width: 718rpx;
  border-top: 2rpx solid #e3e5e9;
  position: absolute;
  bottom: 0px;
  right: 0;
  left: 0;
  transform: scaleY(0.5);
  -webkit-transform: scaleY(0.5);
  z-index: 1;
}

.fzx_part .fzx_content.fzx_dashed:after {
  height: 2rpx;
  content: '';
  width: 718rpx;
  border-top: 2rpx dashed #e3e5e9;
  position: absolute;
  bottom: 0px;
  right: 0;
  left: 0;
  transform: scaleY(0.5);
  -webkit-transform: scaleY(0.5);
  z-index: 1;
}

/*商品组合样式  */

.goods {
  border: none;
  background: #fff;
  margin-top: 0;
}

.index_block {
  width: 750rpx;
  clear: both;
  overflow: hidden;
  background: #fff;
  display: block;
}

.goods .content {
  background: #f0f2f5;
  clear: both;
  overflow: hidden;
  display: block;
}

.goods .goods-small.goods-item:nth-child(2n+1) {
  padding-right: 8rpx;
}

.goods-small.goods-item {
  overflow: hidden;
  float: left;
  width: 375rpx;
  box-sizing: border-box;
  padding-bottom: 8rpx;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.goods-item navigator {
	/* width: 375rpx; */
  display: block;
  background: #fff;
}

.goods-item-pic {
  vertical-align: middle;
  line-height: 0;
  display: table-cell;
  text-align: center;
  width: calc(375rpx - 30rpx);
  height: calc(375rpx - 30rpx);
}

.goods-item-pic image {
  width: calc(375rpx - 30rpx);
  height: calc(375rpx - 30rpx);
}

.goods-small .goods-item-name {
  width: calc(375rpx - 55rpx);
  height: 66rpx;
  font-size: 26rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  color: #232326;
  margin-top: 10rpx;
  line-height: 33rpx;
  margin-bottom: 6rpx;
  padding: 0 8rpx;
}

.goods-item-price {
  width: calc(375rpx - 30rpx);
  color: #f23030;
  display: inline-block;
  padding: 0 10rpx 0 8rpx;
  position: relative;
  top: 2rpx;
  height: 50rpx;
  line-height: 50rpx;
}

.goods-item-price .yens {
  font-size: 26rpx;
}

.goods-item-price .bigprice {
  font-size: 32rpx;
  font-weight: bold;
  display: inline-block;
}

.goods-big.goods-item {
  overflow: hidden;
  float: left;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 8rpx;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 16rpx 16rpx 0;
}

.goods-item-name {
  height: 66rpx;
  font-size: 26rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  color: #232326;
  margin-top: 10rpx;
  line-height: 34rpx;
  margin-bottom: 6rpx;
  padding: 0 8rpx;
}

.goods-big .goods-item-price {
  color: #f23030;
  display: inline-block;
  padding: 0 10rpx 0 8rpx;
  position: relative;
  top: 2rpx;
  height: 50rpx;
  line-height: 50rpx;
}

.goods-big .goods-item-pic image {
  width: 734rpx;
  height: 734rpx;
  padding: 0 8rpx;
}

.hide_title .goods-item .goods-item-name {
  display: none !important;
}

.hide_price .goods-item .goods-item-price {
  display: none !important;
}

.goods-list.goods-item .goods-item-pic {
  float: left;
  width: 214rpx !important;
  height: 214rpx !important;
}

.goods-list.goods-item {
  overflow: hidden;
  float: left;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 8rpx;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background: #fff;
  margin-bottom: 16rpx;
}

.goods-list.goods-item .goods-item-pic image {
  width: 214rpx !important;
  height: 214rpx !important;
}

.goods-list .goods-item-name {
  padding-top: 40rpx;
}

.goods .new-content .goods-item.goods-list .goods-item-name {
  padding-top: 10rpx;
}



/*图片组合样式  */

.modules-slide {
  display: block;
}

.modules-slide .image-list.style0,
.modules-slide .image-list.style0 ul {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.modules-slide .image-list.style0,
.modules-slide .image-list.style0 ul {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: block;
}

.modules-slide .image-list ul {
  overflow: hidden;
  box-sizing: border-box;
  display: block;
}

.modules-slide .image-list.style0 ul li {
  display: block;
  box-sizing: border-box;
}

.modules-slide .image-list ul li navigator {
  display: block;
}

.modules-slide .image-list ul li navigator image {
  width: 100%;
  background: #f1f1f1;
  display: block !important;
}

.modules-slide image {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
  display: inline-block !important;
}

.modules-slide .image-list {
  overflow: hidden;
}

.modules-slide .image-list.style1 ul li {
  display: block;
  margin: 0 16rpx 16rpx;
}

.modules-slide .image-list.style1 ul li image {
  height: 100%;
}

.modules-slide .image-list ul li navigator image {
  width: 100%;
  background: #f1f1f1;
  display: block !important;
}

.modules-slide .image-list.style2 ul,
.modules-slide .image-list.style3 ul {
  padding-right: 16rpx;
}

.modules-slide .image-list.style2 ul li {
  box-sizing: border-box;
  padding: 0 0 16rpx 16rpx;
  width: 50%;
  float: left;
}

.modules-slide .image-list.style3 ul li {
  float: left;
  width: 33.33333%;
  box-sizing: border-box;
  padding: 0 0 16rpx 16rpx;
}

.modules-slide .image-ad {
  padding: 0 0 0 16rpx;
  box-sizing: border-box;
  display: block;
  clear: both;
  overflow: hidden;
}

.modules-slide .image-ad>div {
  float: left;
  width: 50%;
  box-sizing: border-box;
}

.modules-slide .image-ad div navigator {
  display: block;
  margin: 0 16rpx 16rpx 0;
  box-sizing: border-box;
}

.modules-slide .images-tpl image {
  width: 374rpx;
  vertical-align: middle;
  box-sizing: border-box;
}

.modules-slide .image-ad2 {
  margin: 0 16rpx 0 0;
  box-sizing: border-box;
  display: block;
  clear: both;
  overflow: hidden;
}

.modules-slide .image-ad2 .clearfix {
  display: block;
  clear: both;
  overflow: hidden;
}

.modules-slide .image-ad2 div:first-child navigator:nth-child(1),
.modules-slide .image-ad2 div:first-child navigator:nth-child(1) image {
  width: 228rpx;
}

.modules-slide .image-ad2 div:first-child .big:nth-child(2),
.modules-slide .image-ad2 div:first-child .big:nth-child(2) image {
  width: 473rpx;
}

.modules-slide .image-ad2 div navigator {
  display: block;
  float: left;
  margin: 0 0 16rpx 16rpx;
  box-sizing: border-box;
}

.modules-slide .images-tpl img {
  width: 100%;
  vertical-align: middle;
  box-sizing: border-box;
}

.modules-slide .image-ad2 div:last-child navigator:nth-child(1),
.modules-slide .image-ad2 div:last-child navigator:nth-child(1) image {
  width: 473rpx;
}

.modules-slide .image-ad2 div:last-child navigator:nth-child(2),
.modules-slide .image-ad2 div:last-child navigator:nth-child(2) image {
  width: 228rpx;
}

.modules-slide .image-ad3 {
  padding: 0 0 0 16rpx;
  box-sizing: border-box;
  display: block;
  clear: both;
  overflow: hidden;
}

.modules-slide .image-ad3 div {
  width: 367rpx;
  float: left;
  box-sizing: border-box;
}

.modules-slide .image-ad3 div image {
  width: 351rpx;
}

.modules-slide .image-ad3 div navigator {
  padding: 0 16rpx 16rpx 0;
  display: inline-block;
  box-sizing: border-box;
}

.modules-slide .image-ad4 {
  padding: 0 16rpx 16rpx 0;
  box-sizing: border-box;
  display: block;
}

.modules-slide .image-ad4 div {
  float: left;
  width: 33.33333%;
  box-sizing: border-box;
}

.modules-slide .image-ad4 div navigator {
  display: block;
  margin: 0 0 16rpx 16rpx;
}

/* 活动模版 样式0 */
.modules-huodong .huodong-content .huodong-top {
  height: 78.2rpx;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.modules-huodong .huodong-content .huodong-top a {
  display: block;
  width: 100%;
  height: 100%;
}

.modules-huodong .huodong-content .huodong-top .huodong-top-bg {
  height: 78.2rpx;
}

.modules-huodong .huodong-content .huodong-top .huodong-top-title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 78.2rpx;
  line-height: 87.4rpx;
  padding: 0 0 0 25%;
  font-size: 27.6rpx;
  color: rgb(199, 139, 89);
}

.modules-huodong .huodong-content .huodong-main {
  width: 100%;
  /* height: 460rpx; */
  overflow: hidden;
}

.modules-huodong .huodong-content .huodong-main .huodong-left {
  width: 40%;
  height: 100%;
  float: left;
  position: relative;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout {
  text-align: center;
  margin: 18.4rpx 23rpx 0 23rpx;
  color: #FFFFFF;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .main-title {
  font-size: 32.2rpx;
  font-weight: bold;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .sub-title {
  font-size: 27.6rpx;
  height: 27.6rpx;
  line-height: 27.6rpx;
  overflow: hidden;
  margin: 9.2rpx 0;

  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-top .huodong-left-top-layout .sub-title span {
  font-size: 46rpx;
  height: 55.2rpx;
  line-height: 55.2rpx;
  display: block;
  -webkit-transform: scale(-0.5);
  width: 200%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;

  display: inline-block;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
}

.countdown {
  width: 100%;
  height: 49.2rpx;
  line-height: 49.2rpx;
  font-size: 39.4rpx;
}

.countdown .countdown-name {
  float: left;
  display: block;
  -webkit-transform: scale(0.8);
}

.countdown .countdown-main {
  display: block;
  -webkit-transform: scale(0.8);
}

.countdown .countdown-num {
  background-color: #000000;
  display: inline-block;
  padding: 0 0rpx;
  width: 25px;
  height: 32.2rpx;
  line-height: 32.2rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods {
  clear: both;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout {
  padding: 23rpx;
  height: 317.4rpx;
  overflow: hidden;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout a {
  display: block;
}

.modules-huodong .huodong-content a:hover,
.modules-huodong .huodong-content a:focus {
  color: #FFFFFF;
  text-decoration: none;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb {
  width: 138rpx;
  height: 138rpx;
  overflow: hidden;
  margin: 23rpx auto;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb img {
  width: 138rpx;
  height: 138rpx;
  overflow: hidden;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-thumb .empty-img {
  width: 138rpx;
  height: 138rpx;
  overflow: hidden;
  background-color: #cccccc;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price {
  height: 32.2rpx;
  line-height: 32.2rpx;
  text-align: center;
  display: block;
  -webkit-transform: scale(-0.5);
  width: 200%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .sale-price {
  color: rgb(252, 30, 39);
  width: 50%;
  float: left;
  font-size: 27.6rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .sale-price .money-number {
  font-weight: bold;
  font-size: 43.7rpx;
  margin-left: 6.9rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-price .market-price {
  color: rgb(171, 172, 173);
  width: 50%;
  float: left;
  font-size: 34.5rpx;
  text-decoration: line-through;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-other {
  clear: both;
  text-align: center;
  margin: 0rpx 23rpx;
  height: 46rpx;
  line-height: 46rpx;
  overflow: hidden;
  display: block;
}

.modules-huodong .huodong-content .huodong-main .huodong-left .huodong-left-goods .huodong-left-goods-layout .goods-other .goods-extend-data {
  background-color: rgb(237, 26, 32);
  color: #FFFFFF;
  height: 92rpx;
  line-height: 92rpx;
  border-radius: 6.9rpx;
  font-size: 46rpx;
  margin: 0 auto;
  -webkit-transform: scale(-0.5);
  width: 200%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;
}

.modules-huodong .huodong-content .huodong-main .huodong-right {
  width: 60%;
  height: 100%;
  float: left;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top {
  padding: 12rpx 0 12rpx 19rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .main-title {
  color: #333333;
  font-size: 32rpx;
  overflow: hidden;
font-weight: bold;
  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .sub-title span {
  font-size: 22rpx;
  color: #666666;
  font-weight: 500;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .goods-thumb image  {
  max-width: 100%;
  height: 78rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .sub-title span {
  font-size:24rpx;
  white-space: nowrap;
  color: #666666;
  font-weight: 500;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list {
  width: 100%;
  height: 144.9rpx;
  display: block;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list .huodong-goods-item {
  width: 124.2rpx;
  /* height: 152.2rpx; */
  margin: 9.2rpx 10rpx 0 0;
  float: left;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .huodong-goods-list .huodong-goods-item:last-child {
  margin: 9.2rpx 0 0 0;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-top .goods-thumb {
  width: 100%;
  height: 140rpx;
  overflow: hidden;
  text-align: center;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .goods-thumb image {
  max-width: 100%;
  height: 100%;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .goods-thumb .empty-img {
  width: 100%;
  height: 100%;
  background-color: #cccccc;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom {
  height: 234.6rpx;
  width: 100%;
  display: block;
  overflow: hidden;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-list {
  width: 100%;
  height: 234.6rpx;
  display: block;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item {
  width: 39%;
  float: left;
  /* height: 234.6rpx; */
  display: block;
  padding: 4.6rpx 23rpx 11.5rpx 23rpx;
  border-style: solid;
  border-width: 2.3rpx 2.3rpx 0 0;
  border-color: #cccccc;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item .main-title {
  color: #333333;
  font-size: 30rpx;
  overflow: hidden;
  font-weight: bold;
  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong-goods-item .goods-thumb {
  width: 115rpx;
  /* height: 115rpx; */
  display: block;
  overflow: hidden;
  margin: 0 auto;
}

.modules-huodong .huodong-content.style-1 .countdown {
  font-size: 30rpx;
}

.modules-huodong .huodong-content.style-1 .huodong-top .huodong-top-title {
  padding: 0 0 0 33%;
}

.modules-huodong .huodong-content.style-1 .huodong-main {
  width: 100%;
  height: 437rpx;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list {
  width: 100%;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item {
  border-style: solid;
  border-color: #cccccc;
  border-width: 2.3rpx;
  width: 29%;
  height: 100%;
  text-align: center;
  padding: 18.4rpx 15.18rpx 9.2rpx 15.18rpx;
  float: left;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:first-child,
.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:last-child {
  border-width: 2.3rpx 0;
}

.modules-huodong .huodong-content.style-1 .countdown .countdown-main {
  float: none;
  color: #FFFFFF;
}

.modules-huodong .huodong-content.style-1 .countdown .countdown-num {
  background-color: rgb(101, 101, 101);
}

.modules-huodong .huodong-content.style-1 .countdown .countdown-main .countdown-break-flag {
  color: rgb(101, 101, 101);
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .main-title {
  color: rgb(235, 56, 221);
  font-size: 32.2rpx;
  overflow: hidden;

  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:first-child .huodong-top-title .main-title {
  color: rgb(56, 72, 223);
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item:last-child .huodong-top-title .main-title {
  color: rgb(237, 93, 48);
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .sub-title {
  display: block;
  height: 32.2rpx;
  margin: 4.6rpx 0;

  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-top-title .sub-title span {
  font-size: 46rpx;
  display: block;
  -webkit-transform: scale(-0.5);
  width: 200%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb {
  width: 100%;
  height: 170.2rpx;
  margin: 18.4rpx 0;
  overflow: hidden;
  display: block;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb image {
  max-width: 100%;
  height: 100%;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb .empty-img {
  width: 100%;
  height: 170.2rpx;
  overflow: hidden;
  background-color: #cccccc;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom {
  overflow: hidden;
  width: 100%;
  height: 78.2rpx;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price {
  float: left;
  width: 68%;
  height: 100%;
  overflow: hidden;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .sale-price {
  color: rgb(250, 30, 38);
  font-size: 27.6rpx;
  text-align: left;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .sale-price .money-number {
  color: rgb(250, 30, 38);
  font-size: 23rpx;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-price .market-price {
  text-decoration: line-through;
  text-align: left;
  color: rgb(192, 193, 194);
  font-size: 36.8rpx;
  display: block;
  -webkit-transform: scale(-0.5);
  width: 200%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-bottom-button {
  float: right;
  width: 18%;
  /*height: 100%;*/
  padding: 16.1rpx;
  overflow: hidden;
}

.modules-huodong .huodong-content.style-1 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-1-bottom .goods-bottom-button a {
  background-color: rgb(251, 30, 38);
  color: #FFFFFF;
  width: 46rpx;
  height: 46rpx;
  display: block;
  text-align: center;
  line-height: 46rpx;
  font-size: 27.6rpx;
  border-radius: 23rpx;
}

.modules-huodong .huodong-content.style-2 .huodong-main {
  width: 100%;
  height: 333.5rpx;
  overflow: hidden;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list {
  width: 100%;
  height: 100%;
  margin: 32.2rpx 50.6rpx 36.8rpx 48.3rpx;
  width: 639.4rpx;
  display: block;
  height: 266.8rpx;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item {
  width: 639.4rpx;
  height: 266.8rpx;
  padding: 18.4rpx 0 18.4rpx 18.4rpx;
  display: block;
  overflow: hidden;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb {
  width: 230rpx;
  height: 230rpx;
  display: block;
  overflow: hidden;
  float: left;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-thumb .empty-img {
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  background-color: #cccccc;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right {
  float: right;
  width: 368rpx;
  height: 230rpx;
  padding: 6.9rpx 18.4rpx;
  display: block;
  overflow: hidden;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .countdown {
  text-align: center;
  font-size: 17.11.5rpx;
  height: 41.4rpx;
  line-height: 41.4rpx;
  color: rgb(213, 69, 121);
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .countdown .countdown-num {
  height: 41.4rpx;
  line-height: 41.4rpx;
  color: #FFFFFF;
  background-color: rgb(213, 69, 121);
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .huodong-style-2-right .main-title {
  clear: both;
  height: 64.4rpx;
  margin: 6.9rpx 0 6.9rpx 0;
  line-height: 32.2rpx;
  font-size: 27.6rpx;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: normal;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price {
  height: 32.2rpx;
  line-height: 32.2rpx;
  text-align: left;
  display: block;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .sale-price {
  color: rgb(252, 30, 39);
  width: 50%;
  float: left;
  font-size: 23rpx;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .sale-price .money-number {
  font-weight: bold;
  font-size: 27.6rpx;
  margin-left: 6.9rpx;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-price .market-price {
  color: rgb(171, 172, 173);
  width: 50%;
  float: left;
  font-size: 22rpx;
  text-decoration: line-through;
  line-height: 39.1rpx;
  text-align: right;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other {
  clear: both;
  height: 52.9rpx;
  line-height: 52.9rpx;
  margin: 13.8rpx 0 0 0;
  width: 100%;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-info {
  width: 60%;
  float: left;
  font-size: 25rpx;
  color: rgb(120, 121, 122);
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn {
  width: 35%;
  float: right;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn .goods-tuan-btn-navigator {
  display: inline-block;
  text-align: center;
  height: 92rpx;
  line-height: 92rpx;
  color: #FFFFFF;
  padding: 0 20.7rpx;
  border-radius: 46rpx;
  background-color: rgb(213, 69, 121);
  font-size: 36.8rpx;
  display: block;
  -webkit-transform: scale(-0.5);
  width: 170%;
  -webkit-transform: scale(.5);
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform-origin: left top;
  white-space: nowrap;
}

.modules-huodong .huodong-content.style-2 .huodong-main .huodong-goods-list .huodong-goods-item .goods-other .goods-tuan-btn .goods-tuan-btn-navigator span {
  margin: 0 0 0 11.5rpx;
}


.gonggao {
  position: relative;
  height: 76rpx;
  line-height: 76rpx;
  background-color: #eee;
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
}

.gonggao .img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80rpx;
  text-align: center;
  background-color: #eee;
  z-index: 1;
}

.gonggao image {
  width: 40rpx;
  height: 0;
  transform: translateY(10rpx);
}

.gonggao .ani text {
  display: inline-block;
  white-space: nowrap;
  animation: mytransition 8s linear infinite;
}

@keyframes mytransition {
  0% {
    transform: translateX(750rpx);
  }

  100% {
    transform: translateX(-100%);
  }
}

.fuwenben_part {
  background: #fff;
  font-size: 26rpx;
  padding: 16rpx;
}

.fuwenben_part .wxParse-h1 {
  font-size: 36rpx;
  font-weight: 600;
}

.fuwenben_part .wxParse-h2 {
  font-size: 34rpx;
  font-weight: 600;
}

.fuwenben_part .wxParse-h3 {
  font-size: 32rpx;
}

.fuwenben_part .wxParse-h4 {
  font-size: 30rpx;
}

.fuwenben_part .wxParse-inline {
  display: inline;
}

.dapei {
  background-color: #fff;
  /* border-bottom: 1rpx solid #e2e2e2; */
}

.dapei .dapei_top {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border-bottom: 1rpx solid #e2e2e2; */
}

.dapei_top .dp_tj {
  display: block;
  width: 100%;
  font-size: 32rpx;
  color: #333;
  padding: 20rpx 0;
  font-weight: 600;
  text-align: center;
  border-bottom: 1rpx solid #e2e2e2;
}

.dapei_top image {
  width: 100%;
}

.dapei_top .dp_desc {
  font-size: 26rpx;
  padding: 7px;
}

.dapei scroll-view {
  width: 100%;
  white-space: nowrap;
  background: #F5F5F5;
  padding: 20rpx;
  box-sizing: border-box;
  height: 422rpx;
}

.dapei scroll-view .dp_item {
  position: relative;
  display: inline-block;
  width: 230rpx;
  height: 382rpx;
  margin-right: 15rpx;
  border-radius: 15rpx;
  overflow: hidden;
  background-color: #FFF;
  /* box-shadow:0px 0px 18px 2px rgba(153,153,153,0.2); */
}

.dapei scroll-view .dp_item:last-child {
  margin-right: 0;
}

.dapei .wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  overflow: hidden;
}

.dapei .wrap .img {
  width: 100%;
  height: 230rpx;
  overflow: hidden;
}

.dapei .wrap image {
  width: 100%;
  height: 100%;
}

.dapei .wrap .name {
  box-sizing: border-box;
  width: 100%;
  /* height: 60rpx; */
  line-height: 38rpx;
  padding: 0 18rpx;
  margin-top: 20rpx;
  color: #333;
  font-size: 27rpx;
  font-weight: 500;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dapei .wrap .price {
  position: absolute;
  bottom: 12rpx;
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 17rpx;
  margin-left: 18rpx;
  color: #FF2B20;
  font-size: 30rpx;
  font-weight: bold;
}

.dapei .wrap .price .yens{
    font-size: 13px;
    font-weight: 500;
    margin-right: 6rpx;
}

.kefu {
  display: flex;
  align-items: center;
  padding: 20rpx;
  line-height: 35rpx;
  color: #333;
  font-size: 26rpx;
}

.kefu image {
  width: 30rpx;
  height: 0;
  margin-right: 20rpx;
}

.modules-huodong .huodong-content .huodong-main .huodong-right .huodong-right-bottom .huodong_priceBox
 {
   text-align: center;
}

.huodong_priceText1 {
  font-size: 20rpx;
  color: #F62216;
  font-weight: 500;
}

.huodong_priceText2 {
  font-size: 18rpx;
  color: #999999;
  text-decoration: line-through;
  font-weight: 500;
}

.modules-coupon {
  margin: 20rpx;
}

.modules-coupon .coupon-layout {

}
.coupon-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.coupon-item {
  width: 60%;
  background: linear-gradient(45deg,#FF8580,#EA5165);
  border-radius: 10rpx;
  color: #fff;
  padding: 10rpx;
  margin-bottom: 20rpx;
  margin-top: 10rpx;
  margin-right: 20rpx;
  display: inline-block;
}
.coupon-item:last-child {
  margin-right: 0;
}
.coupon-money {
  font-size: 50rpx;
  font-weight: bold;
}
.coupon-item-desc {
  font-size: 46rpx;
}
.coupon-item-time {
  font-size: 24rpx;
}
.tuangou {
  display: flex;
}

.coupon-listScroll {
   white-space: nowrap;
   height: 200rpx;
}

/* 重写推荐商品列表样式 */
.goods .goods-small.goods-item:nth-child(2n) {
    padding-left: 0;
}
.goods .goods-small.goods-item:nth-child(2n+1) {
    padding-right: 0;
}
.goods .new-content {
    padding: 20rpx 20rpx 0 20rpx;
    background-color: #F5F5F5;
    clear: both;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.goods .new-content .goods-item.goods-small {
    width: calc(375rpx - 30rpx);
    height: 505rpx;
    border-radius: 15rpx;
    overflow: hidden;
    background-color: #FFF;
    margin-bottom: 20rpx;
    padding: 0;
}
.goods .new-content .goods-item goods-big .goods-item-pic {
    width: 100% !important;
    height: calc(375rpx - 30rpx) !important;
}
.goods .new-content .goods-item-pic img {
    width: 100%;
}
.goods .new-content .goods-small .goods-item-name {
    padding: 0;
    margin: 18rpx 18rpx 0 18rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    height: auto;
    line-height: 36.8rpx;
}
.goods .new-content .goods-small .goods-item-price {
    position: absolute;
    padding: 0;
    bottom: 12.2rpx;
    top: initial;
    left: 18rpx;
    height: auto;
    line-height: normal;
    color: #FF2B20;
    font-size: 32rpx;
    font-weight: bold;
}
em{
		font-style: normal;
	}
</style>