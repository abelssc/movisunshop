<template>
<view>
<tsCommon></tsCommon>
<view class="goods-detail" v-if="is_show == true">
  <view class="swiper">
    <swiper>
      <swiper-item v-if="goodsDetail.goods_info.video_url" class="video-wrap">
        <video :src="goodsDetail.goods_info.video_url" autoplay="false"></video>
      </swiper-item>
      <swiper-item v-for="(item, index) in imgSrc" :key="index">
        <image :src="item" mode="aspectFit"></image>
      </swiper-item>
    </swiper>
  </view>

  <view class="goods-info">
    <view class="goods-name">{{goodsDetail.goods_info.goods_name}}</view>

    <view class="goods-price">
      <text class="price">{{$L('￥')}}{{goodsDetail.goods_info.goods_price}}</text>
      <text class="amount">{{$L('奖励：')}}{{$L('￥')}}{{amount}}</text>
    </view>
  </view>

  <view class="goods-desc">
    <view class="desc-l">

    </view>
  </view>

  <view class="goods-body">
    <view class="title">{{$L('商品详情')}}</view>
    <view class="con">
      <block data-type="template" data-is="entry" data-attr="...article">
  <view :class="'h2w h2w-' + theme">
    <view class="h2w__main">
		<view style="width: 100%;background: #fff;">
			<!-- 已经包含了顶部和底部关联版式 -->
			<rich-text :nodes="show_rich_text"></rich-text>
		</view>
    </view>
  </view>
</block>
    </view>
  </view>

  <button class="share" @tap="share">{{$L('分享')}}</button>
</view>

<common :title="$L('商品详情')"></common>

<TsShare :show="show" :gid="gid" :goodsInfo="shareData" @close="cancelShare" :goodsData="shareGoods"></TsShare>
</view>
</template>

<script>
import TsShare from "../../../component/TsShare/TsShare";
var graceRichText = require("../../../libs/richText.js");
export default {
	
  data() {
    return {
	  show_rich_text: '', //商品详情富文本展示
      ssys_key: '',
      gid: '',
      key: '',
      goodsDetail: '',
      imgSrc: [],
      shareId: "",
      article: "",
      show: false,
      shareData: {},
	  shareGoods: {},
	  is_show:false
    };
  },

  components: {
    TsShare
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('商品详情')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    const key = uni.getStorageSync('token');
    const shareId = uni.getStorageSync('ssys_share_code');
    this.setData({
      ssys_key,
      key,
      shareId,
      ...options
    });
    this.getGoodsDetail();
    this.getGoodsBody();
  },
  onShareAppMessage: function () {
    const {
      goodsDetail: {
        goods_info: {
          goods_name
        }
      },
      imgSrc,
      gid,
      amount,
      shareId
    } = this;
    return {
      title: goods_name,
      path: '/pages/goods_detail/goods_detail?gid=' + gid + '&shareId=' + shareId,
      imageUrl: imgSrc[0]
    };
  },
  onShareTimeline: function () {
    const {
      goodsDetail: {
        goods_info: {
          goods_name
        }
      },
      imgSrc,
      gid,
      amount,
      shareId
    } = this;
    return {
      title: goods_name,
      path: '/pages/goods_detail/goods_detail?gid=' + gid + '&shareId=' + shareId,
      imageUrl: imgSrc[0]
    };
  },
  methods: {
    getGoodsDetail() {
      const {
        key,
        gid
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_detail',
        data: {
          gid: gid,
          key: key
        },
        success: res => {
          if (res.data.code == 200) {
            let imgs = res.data.datas.goods_image;
            this.setData({
              goodsDetail: res.data.datas,
              imgSrc: imgs.split(','),
			  is_show:true
            });
          }
        }
      });
    },

    getGoodsBody() {
      const {
        gid
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=goods&mod=goods_body_xcx',
        data: {
          gid: gid
        },
        success: res => {
          this.setData({
            show_rich_text:graceRichText.format(res.data.goods_detail.goods_body)
          });

          this['__bind_tap'] = e => {
            // 预览图片
            let el = e.currentTarget.dataset._el;

            if (el.tag == 'image') {
              let imgSrc = el.attr.src;

              if (imgSrc) {
                uni.previewImage({
                  urls: [imgSrc]
                });
              }
            }
          };
        }
      });
    },

    share() {
	  let _this = this;
      this.setData({
        show: true,
        shareData: {
          title: _this.goodsDetail.goods_info.goods_name,
          path: '/pages/goods_detail/goods_detail?gid=' + _this.gid + '&shareId=' + _this.shareId,
          imageUrl: _this.imgSrc[0]
        },
		shareGoods:{
			share_link:_this.goodsDetail.share_url,
			goods_name:_this.goodsDetail.goods_info.goods_name,
			goods_jingle:_this.goodsDetail.goods_info.goods_jingle,
			goods_image:_this.imgSrc[0],
		}
      });
    },

    cancelShare() {
      this.setData({
        show: false
      });
    }

  }
};
</script>
<style>

page{
  background-color: #f6f6f6;
  padding-bottom: 120rpx;
  width: 750rpx;
  margin: 0 auto;
}

.goods-detail .swiper,.goods-detail swiper{
  width: 750rpx;
  height: 750rpx;
}

.goods-detail .swiper image{
  width: 750rpx;
  height: 750rpx;
}

.goods-detail .goods-info{
  padding: 30rpx 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.goods-info .goods-name{
  color: #333;
  font-size: 32rpx;
}

.goods-info .goods-price{
  display: flex;
  align-items: center;
  margin-top: 38rpx;
}

.goods-price .price{
  color: #ba1418;
  font-size: 38rpx;
  font-weight: 600;
  margin-right: 50rpx;
}

.goods-price .amount{
  color: #FC3357;
  font-size: 28rpx;
}

.goods-body{
  padding: 0 20rpx;
  background-color: #fff;
}

.goods-body .title{
  position: relative;
  padding: 30rpx 0;
  text-align: center;
  color: #333;
  font-weight: 600;
  font-size: 36rpx;
}

.goods-body .title::after,.goods-body .title::before{
  position: absolute;
  content: '...';
  color: #999;
  top: 22rpx;
  font-weight: 400;
}

.goods-body .title::after{
  left: 200rpx;
}

.goods-body .title::before{
  right: 200rpx;
}

.share{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 100rpx;
  background-color: #f23030;
  color: #fff;
  font-size: 36rpx;
  border: none;
  line-height: 100rpx;
  z-index: 999;
  border-radius: 0;
  letter-spacing: 20rpx;
  right: 0;
  margin: 0 auto;
}

.video-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-wrap video{
  max-width: 750rpx;
  max-height: 750rpx;
}
</style>