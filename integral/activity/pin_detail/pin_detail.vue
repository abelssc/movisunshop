<template>
<view>
<navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + info.sld_gid + '&team_id=' + info.sld_team_id" class="item">
  <view class="img">
    <image class="goods-img" :src="info.sld_pic" mode="widthFix"></image>

    <image class="state-img" :src="info.sld_tuan_status==0?img_url+'team_status_0.png':(info.sld_tuan_status==1?img_url+'team_status_1.png':img_url+'team_status_2.png')"></image>
  </view>

  <view class="goods-info">
    <view class="name">{{info.goods_name}}</view>
    <view class="pro">{{info.sld_team_count}}{{$L('人团')}} | {{$L('已拼')}}{{info.sales}}{{$L('件')}}</view>
    <view class="price">
      <view class="red">{{$L('￥')}}
        <text>{{info.sld_pin_price}}</text>
      </view>
      <text class="s">{{$L('省')}}{{info.sheng}}{{$L('元')}}</text>
    </view>
  </view>
</navigator>

<view class="detail-info">
  <navigator url hover-class="none" class="pin-success-btn txt" v-if="info.sld_tuan_status==1">{{info.sld_team_count2}}{{$L('人拼团成功，恭喜哦！')}}</navigator>

  <view class="pin-fail txt" v-if="info.sld_tuan_status==2">{{$L('拼团失败，款项将退回到余额')}}</view>

  <navigator url hover-class="none" class="gp-pay-btn txt" v-if="info.sld_tuan_status==0 && info.has_join && info.order_state==10">{{$L('您已参与但还未付款，点击去付款')}}</navigator>

  <view class="txt" v-if="info.sld_tuan_status==0 && info.has_join && info.order_state!=10">{{$L('还有')}}<text>{{info.cha}}</text>{{$L('人拼团成功')}}</view>

  <view class="txt" v-if="info.sld_tuan_status==0 && !info.has_join">{{$L('还有')}}<text>{{info.cha}}</text>{{$L('个名额，赶快参团吧')}}</view>

  <view class="swiper">
    <view v-for="(item, index) in list" :key="index" class="slide">
      <image class="avator" :src="item.avatar" mode="aspectFit"></image>
      <text class="t" v-if="item.leader">{{$L('团长')}}</text>
    </view>
	
	<!-- #ifdef H5 -->
		<view  class="slide"  @tap.stop="sldShareBrower" v-if="isWeiXinBrower">
		  <image class="avator" :src="img_url + 'site/add_group.png'" mode="aspectFit"></image>
		  <text class="t" >{{$L('邀请好友')}}</text>
		</view>
	<!-- #endif -->
	
	<!-- #ifdef MP-WEIXIN -->
		<view  class="slide" open-type="share">
		  <image class="avator" :src="img_url + 'site/add_group.png'" mode="aspectFit"></image>
		  <text class="t" >{{$L('邀请好友')}}</text>
		</view>
	<!-- #endif -->
	
	<!-- #ifdef APP-PLUS-->
		<view  class="slide" @tap.stop="sldShare(0,'WXSceneSession')">
		  <image class="avator" :src="img_url + 'site/add_group.png'" mode="aspectFit"></image>
		  <text class="t" >{{$L('邀请好友')}}</text>
		</view>
	<!-- #endif -->
  </view>

  <view class="time" v-if="info.sld_tuan_status==0 && info.order_state==10">{{$L('您还未付款，付款后才会在团队中显示')}}</view>

  <view class="time_out" v-if="info.sld_tuan_status==0 && info.order_state!=10">
    <text>{{$L('距结束：')}}</text>
    <text class="time-con">{{time.d}}</text>{{$L('天')}}
    <text class="time-con">{{time.h}}</text>:
    <text class="time-con">{{time.m}}</text>:
    <text class="time-con">{{time.s}}</text>
  </view>

  <navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + info.gid + '&team_id=' + info.sld_team_id" class="buy-btn" v-if="info.sld_tuan_status>0">
    {{info.sld_tuan_status==1?$L('我还要买'):$L('重新拼团')}}
  </navigator>

  <navigator hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + info.gid + '&team_id=' + info.sld_team_id" class="buy-btn" v-if="info.has_join<=0">
    {{$L('立即参团')}}
  </navigator>
</view>

<view class="team-icon">
  <view class="team-item">
    <image :src="img_url+'team_detail_icon1.png'" mode="widthFix"></image>
    <text>{{$L('选择开团档')}}</text>
  </view>

  <view class="team-item">
    <image :src="img_url+'team_detail_icon2.png'" mode="widthFix"></image>
    <text>{{$L('邀请好友参加')}}</text>
  </view>

  <view class="team-item">
    <image :src="img_url+'team_detail_icon3.png'" mode="widthFix"></image>
    <text>{{$L('成团分别发货')}}</text>
  </view>

  <view class="team-item">
    <image :src="img_url+'team_detail_icon4.png'" mode="widthFix"></image>
    <text>{{$L('失败全部退款')}}</text>
  </view>
</view>

<view class="more-pin">
  <view class="more-title">{{$L('更多拼团')}}</view>

  <view class="goods-list">
    <navigator v-for="(item, index) in goodslist" :key="index" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid" hover-class="none" class="goods-item">
      <view class="goods-img">
        <image :src="item.sld_pic" mode="aspectFit"></image>
      </view>
      <view class="goods-name">{{item.goods_name?item.goods_name:''}}</view>
      <view class="price">
        <view class="red">{{$L('￥')}}
          <text>{{item.sld_pin_price}}</text>
        </view>
        <text class="s">{{$L('省')}}{{item.sheng}}{{$L('元')}}</text>
      </view>
    </navigator>
  </view>
</view>

<common :title="$L('拼团详情')"></common>
</view>
</template>

<script>
import request from "../../../utils/request";

export default {
  data() {
    return {
      key: '',
      info: '',
      list: [],
      goodslist: [],
	  img_url: getApp().globalData.img_url,
      time: {},
	  gid:'',
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('拼团详情')
    });
	  this.getShareImg()
    var key = uni.getStorageSync('token') || '';

    if (!key) {
		this.gid = options.id
      getApp().globalData.goLogin();
    }

    this.setData({ ...options,
      key
    });
    this.initData();
  },

  onShareAppMessage() {
    const {
      info
    } = this;
    return {
      title: this.$L('我正在拼团，有好东西推荐给你，觉得好就一起加入吧！'),
      path:  `https://www.slodon.cn/cwap/pages/goods_detail/goods_detail?gid=${info.sld_gid}`,
      imageUrl: info.sld_pic
    };
  },
  onShareTimeline() {
    const {
      info
    } = this;
    return {
      title: this.$L('我正在拼团，有好东西推荐给你，觉得好就一起加入吧！'),
      path:  `https://www.slodon.cn/cwap/pages/goods_detail/goods_detail?gid=${info.sld_gid}`,
      imageUrl: info.sld_pic
    };
  },

  methods: {
	  getShareImg() {
	  	let {
	  		gid
	  	} = this;
	  	let systemType = '';
	  	//#ifdef APP-PLUS || H5
	  	systemType = '';
	  	//#endif
	  	//#ifdef MP-WEIXIN
	  	systemType = 'wx_xcx';
	  	//#endif
	  	wx.request({
	  		url: getApp().globalData.ser_url + '/index.php?app=goods&mod=shareimg',
	  		data: {
	  			gid,
	  			client: systemType
	  		},
	  		success: res => {
	  			if (res.data.status == 200) {
	  				this.setData({
	  					shareImg: res.data.img
	  				})
	  			}
	  		}
	  	})
	  },
	  //分享 type：分享类型 0 图文 2图片，scene 场景 WXSceneSession：分享朋友  WXSenceTimeline：分享朋友圈
	  sldShare: function(type,scene) {
	  	let shareData = {};
	  	if(type == 0){
	  		shareData.href = `https://www.slodon.cn/cwap/pages/goods_detail/goods_detail?gid=${this.info.sld_gid}`;
	  		shareData.title = this.info.goods_name;
	  		shareData.summary = this.info.goods_jingle;
	  		shareData.imageUrl = this.info.share_goods_img;
	  	}else if(type == 2){
	  		shareData.imageUrl = this.shareImg;
	  	}
	  	this.$weiXinAppShare(type,scene,shareData);
	  },
    initData() {
      this.getPinDetail();
    },

    getPinDetail() {
      let {
        id,
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=team&mod=detail&sld_addons=pin&team_id=' + id,
        data: {
          key: key
        },
        method: 'post'
      }).then(res => {
        if (res.code == 200) {
          let info = res.datas.info;
          this.setData({
            info: info,
            list: res.datas.list
          });
          this.getMorePin(res.datas.info.sld_pin_id);

          if (info.sld_tuan_status == 0 && info.order_state != 10) {
            // 倒计时
            this.time_out(info.sld_end_datetime);
          }
        }
      });
    },

    getMorePin(id) {
      let {
        key
      } = this;
      request({
        url: getApp().globalData.ser_url + `/index.php?app=team&mod=more&sld_addons=pin&pn=${this.pn}&pin_id=${id}`,
        method: 'post',
        data: {
          key
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.datas.goods;

          if (this.pn == 1) {
            this.setData({
              goodslist: data
            });
          } else {
            let {
              goodslist
            } = this;
            this.setData({
              goodslist: goodslist.concat(data)
            });
          }
        }

        if (res.hasmore) {
          this.pn++;
        } else {
          this.hasmore = true;
        }
      });
    },

    time_out(time) {
      let date = new Date(time).getTime();
      let that = this;
      djs();

      function djs() {
        if (that.timer) {
          clearTimeout(that.timer);
        }

        let now = new Date().getTime();
        let diff = Math.round((date - now) / 1000);

        if (diff > 0) {
          let d = parseInt(diff / 3600 / 24);
          let h = parseInt(diff / 3600 % 24);
          let m = parseInt(diff / 60 % 60);
          let s = parseInt(diff % 60);
          that.setData({
            time: {
              str: '',
              d: init(d),
              h: init(h),
              m: init(m),
              s: init(s)
            }
          });
          that.timer = setTimeout(djs, 1000);
        } else {
          that.setData({
            time: {
              str: that.$L('已结束'),
              d: '00',
              h: '00',
              m: '00',
              s: '00'
            }
          });
        }
      }

      function init(val) {
        return val > 9 ? val : '0' + val;
      }
    }

  }
};
</script>
<style>
/* integral/activity/pin_detail/pin_detail.wxss */

page {
  background-color: #f5f5f5;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 212rpx;
  padding: 20rpx;
  background-color: #fff;
  margin: 20rpx 0;
}

.item .img {
  flex: 0 212rpx;
  position: relative;
  width: 212rpx;
  height: 212rpx;
  align-items: center;
  justify-content: center;
}

.item .img .goods-img {
  width: 212rpx;
  height: 0;
}

.item .img .state-img {
  position: absolute;
  bottom: 0rpx;
  right: 0rpx;
  width: 110rpx;
  height: 110rpx;
}

.item .goods-info {
  flex: 1;
  width: 100%;
  padding-left: 30rpx;
}

.item .goods-info .name {
  height: 84rpx;
  font-size: 28rpx;
  color: #222;
  line-height: 42rpx;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item .goods-info .pro {
  color: #999;
  font-size: 24rpx;
  margin: 20rpx 0;
}

.price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
}

.price .red {
  color: #ef1b21;
}

.red text {
  font-size: 40rpx;
}

.price .s {
  color: #999;
}

.detail-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 0;
  margin-top: 20rpx;
  background-color: #fff;
}

.detail-info .txt {
  line-height: 60rpx;
  color: #6d6d6d;
  font-size: 26rpx;
}

.detail-info .txt text {
  color: #ee1b21;
  font-weight: bold;
}

.detail-info .swiper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 650rpx;
  margin: 30rpx 0;
  white-space: nowrap;
  overflow-x: auto;
}

.detail-info .swiper .slide {
  position: relative;
  display: inline-block;
  width: 120rpx;
  height: 100rpx;
  padding: 0 20rpx;
  text-align: center;
}

.swiper .slide .avator {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
}

.swiper .slide .t {
  position: absolute;
  top: 60rpx;
  left: 50%;
  height: 40rpx;
  transform: translateX(-50%);
  padding: 0 15rpx;
  border-radius: 6rpx;
  color: #fff;
  line-height: 40rpx;
  font-size: 24rpx;
  white-space: nowrap;
  background-color: #fd4348;
}

.detail-info .time_out {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 26rpx;
}

.time_out .time-con {
  width: 40rpx;
  height: 32rpx;
  background-color: #e1e1e1;
  text-align: center;
  border-radius: 4rpx;
  margin: 0 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  margin-top: 20rpx;
  background-color: #fff;
}

.team-icon .team-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  font-size: 24rpx;
  margin: 0 10rpx;
}

.team-item image {
  width: 56rpx;
  height: 56rpx;
  margin-bottom: 20rpx;
}

.more-pin {
  background-color: #fff;
  margin-top: 20rpx;
}

.more-pin .more-title {
  position: relative;
  line-height: 80rpx;
  text-align: center;
  color: #333;
  font-size: 30rpx;
}

.more-title::after, .more-title::before {
  position: absolute;
  content: '';
  top: 40rpx;
  width: 110rpx;
  height: 1rpx;
  background-color: #e1e1e1;
}

.more-title::after {
  left: 150rpx;
}

.more-title::before {
  right: 150rpx;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx 30rpx;
}

.goods-list .goods-item {
  width: calc(50vw - 50rpx);
  margin-bottom: 30rpx;
  margin-right: 30rpx;
  box-sizing: border-box;
}

.goods-list .goods-item:nth-child(2n) {
  margin-right: 0;
}

.goods-list .goods-item .goods-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(50vw - 50rpx);
  height: calc(50vw - 50rpx);
}

.goods-item .goods-img image {
  width: 100%;
  height: 100%;
}

.goods-item .goods-name {
  color: #222;
  font-size: 32rpx;
  width: 100%;
  height: 84rpx;
  line-height: 42rpx;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.buy-btn{
  width: 600rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: #fff;
  font-size: 26rpx;
  border-radius: 40rpx;
  margin-top: 40rpx;
  background-color: #EE1B21;
}
</style>