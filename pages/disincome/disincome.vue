<template>
<view>
<view class="balance">
  <view class="balance_top" :style="'background: url('+img_url+'fx_bg.png) no-repeat; background-size:100%'">
    <view class="fx_leiji">
            <text class="fx_leiji_text1">{{$L('累计收入(元)')}}</text>
            <text class="fx_leiji_text2">{{fenxiao_info.jiesuan_yongji}}</text>
    </view>
	<view  class="link-hr"></view>
    <view class="priceBox">
        <view class="price_item">
                <text class="price_item_text1">{{$L('冻结金额(元)')}} </text><text class="price_item_text2 dongjie_yongji ellipsis">{{fenxiao_info.dongjie_yongji}}</text>
        </view>
        <view class="price_item">
            <text class="price_item_text1">{{$L('失效金额(元)')}} </text><text class="price_item_text2 shixiao_yongji ellipsis">{{fenxiao_info.shixiao_yongji}}</text>
        </view>
    </view>
  </view>

  <view class="balance_bottom">
	<view class="nav-container">
		<view :class="'nav-item ' + (type=='0'?'on':'')" data-state="0" @tap="changeNav">
			<text>{{$L('全部')}}</text>
		</view>
		<view :class="'nav-item ' + (type=='1'?'on':'')" data-state="1" @tap="changeNav">
			<text>{{$L('冻结')}}</text>
		</view>
		<view :class="'nav-item ' + (type=='2'?'on':'')" data-state="2" @tap="changeNav">
			<text>{{$L('失效')}}</text>
		</view>
	</view>
    <scroll-view class="scroll_list" scroll-y :scroll-top="scroll_height" v-if="fenxiao_list.length > 0" @scrolltolower="loadMore">
		<view class="fx_list">
			<view v-for="(item, index) in fenxiao_list" :key="index" class="fx_list_item">
                    <view class="fx_list_item_top">
                        <text>{{$L('订单号')}}：{{item.order_sn}}</text>
                        <text>{{item.order_desc}}</text>
                    </view>
                    <view class="link"></view>
                    <view class="fx_list_item_center">
                        <view class="fx_center_left">
                            <image :src="item.member_avatar" mode="widthFix"></image>
                            <view class="fx_center_left_text1">{{item.contribution_member_name}}</view>
                            <view class="fx_center_left_text2">{{item.member_mobile}}</view>
                        </view>
                        <view class="fx_center_center">
                            <view class="fx_center_center_text1">{{$L('订单佣金')}}：{{$L('￥')}}{{item.yongjin}}</view>
                            <view class="fx_center_center_text2">{{$L('付款金额')}}:{{$L('￥')}}{{item.order_total}}</view>
                        </view>
                        <view class="fx_center_right">
                            <image :src="img_url + item.fenxiao_status_img" mode="widthFix"></image>
                            <view class="fx_center_right_text1" :style="'color: ' + item.color">{{item.fenxiao_status_desc}}</view>
                        </view>
                    </view>
                    <view class="fx_timeBox">
                        <text class="fx_time">{{$L('下单时间')}}:{{item.order_add_time}}</text>
                    </view>
                </view>
		</view>
    </scroll-view>

    <view class="empty" v-else>
        <image class="empty_img" :src="img_url+ 'fx_empty.png'" mode="widthFix"></image>
      <view class="empty_text1">{{$L('暂无数据')}}</view>
      <view class="empty_text2">{{$L('快快分享给好友赚取巨额佣金吧')}}</view>
    </view>
  </view>

</view>

<common :title="$L('分销佣金明细')"></common>
</view>
</template>

<script>
import request from "../../utils/request";
var is_load = true;

export default {
  data() {
    return {
      key: '',
      img_url: getApp().globalData.img_url,
      type: 0,
      fenxiao_info: {},
      fenxiao_list: [],
      pn: 1,
      page: 10,
      scroll_height: 0,
      hasmore: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('分销收入')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.initData();
  },
  methods: {
    //加载更多事件
    loadMore: function (e) {
      if (is_load) {
        is_load = false;
        this.getList();
      }
    },

    changeNav(e) {
      let news = e.currentTarget.dataset.state;
      let {
        type
      } = this;
      if (news == type) return;
      this.setData({
        type: news,
        pn: 1,
        hasmore: true,
        scroll_height: 0
      });
      this.getList();
    },

    // 获取列表
    getList() {
      let {
        type,
        pn,
        page,
        key,
        fenxiao_list
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=gerDisIncomeList',
        data: {
          pn,
          page,
          key,
          status: type
        },
        dataType: 'json',
        success: res => {
          var data = res.data.datas;
          var list = [];

          if (res.data.code == 200) {
            let fenxiao_status_img = {
              '0': 'fx_dongjie.png',
              '1': 'fx_jiesuan.png',
              '2': 'fx_tishi.png'
            };
            let feixiao_status_color = {
              '0': '#FF182E',
              '1': '#4467FE',
              '2': '#666666'
            };

            for (let i = 0; i < data.fenxiao_info.length; i++) {
              var status = data.fenxiao_info[i].status;

              if (data.fenxiao_info[i].order_add_time) {
                data.fenxiao_info[i].order_add_time = this.formatDate(data.fenxiao_info[i].order_add_time);
              }

              data.fenxiao_info[i].fenxiao_status_img = fenxiao_status_img[status];
              data.fenxiao_info[i].color = feixiao_status_color[status];
            }

            if (pn == 1) {
              list = data.fenxiao_info;
            } else {
              list = fenxiao_list.concat(data.fenxiao_info);
            }

            if (res.data.hasmore) {
              pn = pn + 1;
              is_load = true;
            } else {
              is_load = false;
            }

            this.setData({
              fenxiao_info: data,
              fenxiao_list: list,
              pn
            });
          }
        }
      });
    },

    initData() {
      this.getList();
    },

    formatDate(time) {
      var now = new Date(parseInt(time) * 1000);
      var year = now.getFullYear(); //取得4位数的年份

      var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月

      var date = now.getDate(); //返回日期月份中的天数（1到31）

      var hour = now.getHours(); //返回日期中的小时数（0到23）

      var minute = now.getMinutes(); //返回日期中的分钟数（0到59）

      var second = now.getSeconds(); //返回日期中的秒数（0到59）

      if (month < 10) {
        month = '0' + month;
      }

      ;

      if (date < 10) {
        date = '0' + date;
      }

      if (hour < 10) {
        hour = '0' + hour;
      }

      if (minute < 10) {
        minute = '0' + minute;
      }

      if (second < 10) {
        second = '0' + second;
      }

      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }

  }
};
</script>
<style>
/* pages/disincome/disincome.wxss */
page{
	width: 750rpx;
	margin: 0 auto;
}

.balance {
  width: 750rpx;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.balance .balance_top {
  position: relative;
  height: 446rpx;
  z-index: 100;
  overflow: hidden;
}

.balance_top .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.balance_top .bg image {
  width: 100%;
}

.balance_top .cz {
  position: absolute;
  top: 66rpx;
  left: 18rpx;
  width: 115rpx;
  height: 50rpx;
  line-height: 50rpx;
  background-color: #c7900d;
  color: #fff;
  font-size: 28rpx;
  z-index: 3;
  text-align: center;
  border-radius: 8rpx;
}

.balance_top>view.right {
  position: relative;
  text-align: right;
  z-index: 2;
  color: #fff;
  padding-top: 20rpx;
  padding-right: 30rpx;
}

.balance_top>view text {
  display: block;
}

.balance_top>view text:nth-child(1) {
  font-size: 28rpx;
}

.balance_top>view text:nth-child(2) {
  font-size: 46rpx;
}

.balance .balance_bottom {
  height: calc(100vh - 446rpx);
  position: relative;
  padding-top: 60rpx;
}

.balance_bottom .scroll_list {
 height: calc(100vh - 525rpx);
  overflow: hidden;
}

.item {
  background-color: #fff;
  color: #666;
  padding: 20rpx;
  font-size: 28rpx;
  border-bottom: 1rpx solid #e3e5e9;
}

.item_top{
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.item_top .desc{
  flex: 1;
  font-size: 26rpx;
  color: #232326;
}

.item_top .num{
  font-size: 26rpx;
  color: #6d6d6d;
}

.item_top .num.red{
  color: #f23030
}

.item_bottom{
  text-align: right;
  color: #848689;
  font-size: 24rpx;
  margin-top: 15rpx;
}

.item:last-child {
  margin-bottom: 0;
}

.placeholder_style {
  color: #9f9f9f;
  font-size: 34rpx;
}
.empty{
  display: flex;
  width: 750rpx;
  height: calc(100vh - 525rpx);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}



.fx_leiji {
    color: #FFF;
    margin-left: 40rpx;
    margin-top: 120rpx;
}
.fx_leiji .fx_leiji_text1 {
    font-size: .606rem;


}
.fx_leiji .fx_leiji_text2 {
    font-size: 26rpx;
    font-weight: bold;
}
.priceBox {
    margin-left:40rpx;
    display: flex;
}
.priceBox .price_item {
    color: #FFF;
}
.priceBox .price_item:last-child {
    margin-left: 1.5rem;
}
.priceBox .price_item_text1 {
    font-size: .7rem;
}
.priceBox .price_item_text2 {
    font-size: .7rem;
    font-weight: bold;
	width: 200rpx;
}

.nav-container{
 position: absolute;
  top: -20rpx;
  left: 0;
  width: 750rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 99;
}

.nav-container .nav-item{
  margin-top: 11rpx;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item text{
  display: block;
  color: #333;
  font-size: 30rpx;
  height: 100%;
  line-height: 86rpx;
  border-bottom: 2rpx solid transparent
}

.nav-item.on text{
  color: #FC1C1C;
  font-weight: bold;
  position: relative;
}
.nav-item.on text:after{
	position: absolute;
	bottom: 5rpx;
	left: 7rpx;
    content: '';
 	width:40rpx;
	height:6rpx;
	background:#FC1C1C;
	border-radius:4rpx;
}

.fx_list {
    padding: 0 .435rem;
    padding-bottom: .435rem;
    /* padding-top: 75rpx; */
}
.fx_list_item {
    margin-top: .435rem;
    background-color: #FFF;
    border-radius:.326rem;
    padding: .435rem;
}
.fx_list_item_top {
  margin-top: .2rem;
    display: flex;
    justify-content: space-between;
    
}
.link {
    margin-top: .5rem;
    width: 100%;
    height: .072rem;
    background:rgba(0,0,0,1);
    opacity:0.05;
}
.fx_list_item_top text {
    color: #333333;
    font-weight:400;
    font-size: 26rpx;
}
.fx_list_item_center {
    margin-top: .5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.1rem;
}
.fx_center_left {
    text-align: center;
	  position: relative;
    margin-left: 22rpx;
}
.fx_center_left:after {
    position: absolute;
    content: '';
    top: 0;
    right: -40rpx;
    width: 1px;
    height: 100%;
    background-color: #000000;
    opacity: 0.05;
}
.fx_center_left image{
    width: 65rpx;
    height: 65rpx;
    border-radius: 50%;
}
.fx_center_left_text1 {
    font-size: 22rpx;
    color: #333333;
}
.fx_center_left_text2 {
    font-size: 20rpx;
    color: #666666;
    line-height: .5rem;
}
.fx_center_center_text1 {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
}
.fx_center_center_text2 {
    font-size: 24rpx;
    color: #666666;
	margin-top: 12rpx;
}
.fx_center_right {
    text-align: center;
	margin-right: 16rpx;
}
.fx_center_right_text1 {
	color: #FF182E;
	font-size: 26rpx;
}
.fx_center_right image {
    width: 46rpx;
    height: 48rpx;
}
.fx_center_right p {
    font-size: 26rpx;
    font-weight: 500;
    color: #FF182E;
}
.fx_timeBox {
	margin-top: 17rpx;
}
.fx_timeBox .fx_time {
    font-size: 24rpx;
    color: #999999;
}

.empty_text1 {
	margin-left: -23rpx;
    color: #333333;
    font-size: 28rpx;
    font-weight:500;
}
.empty_text2 {
	margin-top: 10rpx;
    font-size: 26rpx;
    color: #666666;

}
.empty_img {
    width: 301rpx;
    height: 148rpx;
}

.link-hr {
    width: 386rpx;
    margin-top: 30rpx;
    margin-bottom: 30rpx;
    margin-left: .94rem;
    height: 2rpx;
    background: rgba(255,255,255,1);
    opacity: 0.2;
}

.ellipsis{
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;
    }
</style>