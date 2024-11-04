<template>
<view>
<navigationBar :text="$L('推手首页')"></navigationBar>
<view class="fixed_top_status_bar"></view>
<view class="clearfix">
  <DiyPage :sourceData="home_info" v-if="home_info.length"></DiyPage> 
</view>

<view class="hot-list-title">
  <text class="title">{{$L('热门分享')}}</text>
  <navigator hover-class="none" class="more" url="/addons/pages/tsGoodsList/tsGoodsList">
    <text>{{$L('查看更多')}}</text>
    <image :src="img_url+'addons/sld_jiantou.png'"></image>
  </navigator>
</view>

<view class="list">
  <view v-for="(item, index) in hotList" :DiyPagekey="index" class="item">
    <navigator :url="'/addons/pages/tsGoodsDetail/tsGoodsDetail?gid=' + item.gid + '&amount=' + item.yj_amount" class="item-left" hover-class="none">
      <image :src="item.goods_image" mode="aspectFit"></image>
    </navigator>
    <view class="item-right">
      <navigator :url="'/addons/pages/tsGoodsDetail/tsGoodsDetail?gid=' + item.gid + '&amount=' + item.yj_amount" hover-class="none" class="goods-name">{{item.goods_name}}</navigator>
      <text class="goods-price">{{$L('￥')}}{{item.goods_price}}</text>
      <view class="jl">
        <text>{{$L('奖励')}}</text>
        <text>{{$L('￥')}}{{item.yj_amount}}</text>
      </view>

      <button class="share-wrap" :data-id="item.gid" @tap="share">
        <image :src="img_url+'addons/sld_share.png'"></image>
      </button>
    
    </view>
  </view> 
</view>

<!-- <view class='share-tip' wx:if="{{show}}">
  <view class='modal'>
    <view class='modal-goods'>
      <view class='modal-goods-img'>
        <image src='{{shareGoods.goods_image}}' mode='aspectFit'></image>
      </view>
      <view class='modal-goods-info'>
        <view class='modal-name'>{{shareGoods.goods_name}}</view>
        <view class='modal-price'>{{$L('￥')}}{{shareGoods.goods_price}}</view> 
      </view>
    </view>

    <view class='modal-btn'>
      <button class='cancel-btn' bindtap='cancelShare'>取消</button>
      <button class='confirm-btn' open-type='share'>分享</button>
    </view>

  </view>
</view> -->
<sldMenu nowPage="ts"></sldMenu> 
<DiyTabBar :tabBar="tabBar"></DiyTabBar>
<!-- <tsCommon></tsCommon> -->
<common :title="$L('推手首页')"></common>

<TsShare :show="show" :gid="shareGoods.gid" :goodsInfo="shareData" :goodsData="shareGoods" @close="cancelShare"></TsShare>
</view>
</template>

<script>
import navigationBar from "@/component/navigationBar/navigationBar";
import TsShare from "@/component/TsShare/TsShare";
import request from "@/utils/request";
export default {
  data() {
    return {
      tabBar: {
        // tabBar 配置
        color: "#5C5C5C",
        // 文字颜色
        selectedColor: "#FC3559",
        // 选中的颜色
        selectItem: 0,
        list: [{
          pagePath: "/addons/pages/tsIndex/tsIndex",
          text: this.$L('必推好货'),
          iconPath: getApp().globalData.img_url + "ts/ts1.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts11.png"
        }, {
          pagePath: "/addons/pages/tsOrderList/tsOrderList",
          text: this.$L('订单明细'),
          iconPath: getApp().globalData.img_url + "ts/ts2.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts22.png"
        }, {
          pagePath: "/addons/pages/tsUserCenter/tsUserCenter",
          text: this.$L('推手中心'),
          iconPath: getApp().globalData.img_url + "ts/ts3.png",
          selectedIconPath: getApp().globalData.img_url + "ts/ts33.png"
        }]
      },
      autoplay: true,
      interval: 5000,
      duration: 1000, 
      indicatorDots: true,
      hotList: [],
      shareData: {},
      show: false,
      img_url: getApp().globalData.img_url,
      shareGoods: {},
      shareGid: '',
      imgUrl: getApp().globalData.img_url,
      shareId: "",
      home_info: "",
	  is_can_share: 0,    //不能分享
    };
  },

  components: {
    navigationBar,
    TsShare,
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('推手首页')
    });
    const shareId = uni.getStorageSync('ssys_share_code');

    if (shareId) {
      this.setData({
        shareId: shareId
      });
    }

    this.getHotGoods();
	this.getIndexData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      shareData
    } = this;
    this.setData({
      show: false
    });
    return shareData;
  },
  onShareTimeline: function () {
    const {
      shareData
    } = this;
    this.setData({
      show: false
    });
    return shareData;
  },
  methods: {
    // 获取首页装修数据
    getIndexData() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&sld_addons=spreader',
        success: res => {
          let home_info_data = res.data.datas;
          this.setData({
            home_info: home_info_data
          });
        }
      });
    },

    // 获取热门推荐
    getHotGoods() {
			  let uid = uni.getStorageSync('uid');
      uni.request({
        // url: getApp().globalData.ser_url + '/index.php?app=ssys_goods&mod=index&sld_addons=spreader&shareId='+this.shareId,
		url: getApp().globalData.ser_url + '/index.php?app=ssys_goods&mod=index&sld_addons=spreader&shareId='+ this.shareId + '&shop_member_id=' + uid,
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.list;
            this.setData({
              hotList: list,
			  is_can_share: res.data.datas.is_can_share
            });
          }
		  if(res.data.datas.is_can_share == 0){
		    uni.redirectTo({
		  	  url: '/addons/pages/tsApplyFor/tsApplyFor'
		    })
		  }
        }
      });
    },

    share(e) {
      let id = e.currentTarget.dataset.id;
      const {
        hotList,
        shareId
      } = this;
      let item = hotList.filter(el => el.gid == id)[0];
      this.setData({
        show: true,
        shareData: {
          title: item.goods_name,
          path: '/pages/goods_detail/goods_detail?gid=' + item.gid + '&s=' + shareId,
          imageUrl: item.goods_image
        },
        shareGoods: item
      });
    },

    cancelShare() {
      this.setData({
        show: false,
        shareData: {},
        shareGoods: {}
      });
    }

  }
};
</script>
<style>
page{
  padding-bottom: 100rpx;
  width: 750rpx;
  margin: 0 auto;
}
	.fixed_top_status_bar {
		position: fixed;
		/* #ifdef MP||APP-PLUS */
		height: var(--status-bar-height);
		/* #endif */
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background: #fff;
	}
.hot-list-title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  padding: 0 20rpx;
}

.hot-list-title .title{
  color: #363636;
  font-size: 38rpx;
  font-weight: 600;
}

.hot-list-title .more{
  display: flex;
  align-items: center;
  color: #5C5C5C;
  font-size: 24rpx;
}

.hot-list-title .more text{
  margin-right: 15rpx;
}

.hot-list-title .more image{
  width: 13rpx;
  height: 23rpx;
}

.list{
  padding:  0 20rpx;
}

.list .item{
  display: flex;
  align-items: center;
  height: 260rpx;
  border-bottom: 1rpx solid #EEEEEE;
}

.item .item-left{
  flex: 0 0 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220rpx;
  height: 220rpx;
  margin-right: 30rpx;
  overflow: hidden;
}

.item .item-left image{
  width: 100%;
  height: 100%;
}

.item .item-right{
  flex: 1;
  height: 220rpx;
  position: relative;
}

.item-right .goods-name{
  width: 450rpx;
  color: #5C5C5C;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.item-right .goods-price{
  display: block;
  color: #5C5C5C;
  font-size: 24rpx;
  margin: 30rpx 0;
}

.item-right .jl{
  display: flex;
  align-items: center;
  color: #FC3357;
  font-size: 24rpx;
}

.item-right .jl text:last-child{
  font-size: 38rpx;
  margin-left: 20rpx;
}

.item-right .share-wrap{
  position: absolute;
  right: 20rpx;
  top: 70rpx;
  width: 50rpx;
  height: 50rpx;
  padding: 0;
  background: transparent;
  border: none;
  line-height: 1;
}

.item-right .share-wrap::after{
  border: none;
}

.item-right .share-wrap image{
  width: 50rpx;
  height: 50rpx;
}

.share-tip{
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 100vh;
  background-color: rgba(0,0,0,.5);
  z-index: 998;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share-tip .modal{
  width: 569rpx;
  height: 360rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
  padding: 28rpx;
}

.share-tip .modal-goods{
  display: flex;
  align-items: center;
}

.share-tip .modal-goods .modal-goods-img{
  flex: 0 0 180rpx;
  width: 180rpx;
  height: 180rpx;
  margin-right: 15rpx;
}

.share-tip .modal-goods-img image{
  width: 100%;
  height: 100%;
}

.share-tip .modal-goods .modal-goods-info{
  flex: 1;
  height: 180rpx;
  color: #333333;
  font-size: 26rpx; 
}

.share-tip .modal-goods .modal-price{
  margin-top: 26rpx;
  color: #FF1D1D;
}

.share-tip .modal-btn{
  margin-top: 64rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share-tip .modal-btn button{
  width: 233rpx;
  height: 60rpx;
  border-radius: 30rpx;
  padding: 0;
  line-height: 58rpx;
  font-size: 26rpx;
}

.share-tip .modal-btn .cancel-btn{
  border: 1rpx solid #BFBFBF;
  color: #909090;
  background-color: #fff;
}

.share-tip .modal-btn .confirm-btn{
  border: 1rpx solid #FB3157;
  color: #fff;
  background-color: #FB3157;
}

.banner{
  width: 100%;
  height: 0;
}
</style>