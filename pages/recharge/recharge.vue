<template>
<view>
<view class="balance">
  <view class="balance_top">
    <image class="bg" :src="img_url+'bg.png'" mode="widthFix"></image>
    <view class="cz" @tap.stop="go">{{$L('充值')}}</view>
    <view class="right">
      <text>{{$L('我的余额')}}</text>
      <text>{{predepoit}}</text>
    </view>
  </view>

  <view class="balance_bottom">
    <scroll-view scroll-y v-if="chargeLogList.length>0" @scrolltolower="getmore">
      <view v-for="(item, index) in chargeLogList" :key="index" class="item">
        <view class="item_top">
          <view>
            <text>{{$L('充值单号：')}}{{item.pdr_sn}}</text>
          </view>
          <view>
            <text>{{$L('创建时间：')}}{{item.pdr_add_time_str}}</text>
          </view>
          <view v-if="item.pdr_payment_state !=0">
            <text>{{$L('付款时间：')}}{{item.pdr_payment_time_str}}</text>
          </view>
          <view v-if="item.pdr_payment_state !=0">
            <text>{{$L('交易号：')}}{{item.pdr_trade_sn?item.pdr_trade_sn:''}}</text>
          </view>
          <view v-if="item.pdr_payment_state !=0">
            <text>{{$L('支付方式：')}}{{item.pdr_payment_name}}</text>
          </view>
          <view>
            <text>{{$L('充值金额：')}}{{item.pdr_amount}}</text>
            <text v-if="item.pdr_payment_state==0">{{item.pdr_payment_name ? $L('支付方式：')+item.pdr_payment_name:''}}</text>
            <text v-else>{{$L('状态： 已支付')}}</text>

          </view>


        </view>

        <view class="item_bottom" v-if="item.pdr_payment_state ==0">
          <view :data-id="item.pdr_id" @tap="del" class="btn">{{$L('删除')}}</view>
          <view class="btn btn_red" :data-id="item.pdr_sn" @tap="repay">{{$L('充值')}}</view>
        </view>
      </view>
    </scroll-view>

    <view  v-if="chargeLogList.length==0&&!isLoading" class="not">
      <view class="img">
        <image :src="img_url+'search_w.png'"></image>
      </view>
      <text>{{$L('您还没有充值记录')}}</text>
    </view>
  </view>

</view>

<common :title="$L('充值')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      predepoit: 0,
      chargeLogList: [],
      img_url: getApp().globalData.img_url,
	  flag: true,
	  isLoading: true,
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('充值')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }
  },
  onShow: function () {
    this.setData({
      chargeLogList: []
    });
    this.currentPage = 1;
    this.hasmore = true;
    this.getMyAvailable();
    this.rechargeLogList();
  },
  methods: {
    // 获取余额
    getMyAvailable() {
      let that = this,
          key = that.key;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key,
        method: 'GET',

        success(res) {
          that.setData({
            predepoit: res.data.datas.predepoit
          });
        },

        error: function (err) {}
      });
    },

    //充值记录
    rechargeLogList() {
      let that = this,
          key = that.key;
      uni.showLoading({
        title: that.$L('加载中...')
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=cash&mod=rechargeLogList&key=' + key,
        method: 'GET',
        data: {
          pageSize: 10,
          currentPage: that.currentPage
        },

        success(res) {
          if (res.data.state == 200) {
			  if(res.data.data.list!=undefined&&res.data.data.list.length > 0){
				 if (that.currentPage == 1) {
				   that.setData({
				     chargeLogList: res.data.data.list,
					 isLoading:false
				   });
				 } else {
				   that.setData({
				     chargeLogList: that.chargeLogList.concat(res.data.data.list)
				   });
				 }
				 
				 if (that.chargeLogList.length < res.data.data.pagination.total) {
				   that.currentPage++;
				 } else {
				   that.hasmore = false;
				 } 
			  }
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        },

        error: function (err) {},
        complete: function () {
          uni.hideLoading();
        }
      });
    },

    // 分页加载
    getmore() {
      if (this.hasmore) {
        this.rechargeLogList();
      }
    },

    // 前往充值
    go() {
      uni.navigateTo({
        url: '/pages/recharge/detail'
      });
    },

    // 删除充值记录
    del(e) {
      let that = this,
          key = that.key,
          id = e.currentTarget.dataset.id;
      uni.showModal({
        title: that.$L('提示'),
        content: that.$L('是否删除该条记录'),
        success: function (re) {
          if (re.confirm) {
            uni.request({
              url: getApp().globalData.ser_url + '/index.php?app=cash&mod=delRechargeLog&key=' + key,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                id: id
              },
              success: function (res) {
                if (res.data.state == 200) {
                  let chargeLogList = that.chargeLogList;
                  chargeLogList = chargeLogList.filter(el => el.pdr_id != id);
                  that.setData({
                    chargeLogList
                  });
                }
              }
            });
          }
        }
      });
    },

    // 再次发起充值
    repay(e) {
      let that = this,
          key = that.key,
          pay_sn = e.currentTarget.dataset.id;

      if (that.flag) {
        that.flag = false;
        uni.login({
          success: code => {
            uni.request({
              url: getApp().globalData.ser_url + '/index.php?app=pay&mod=pay_new_xcx&code=' + code.code,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                key: key,
                pay_sn: pay_sn
              },
              success: function (res) {
                if (res.data.state == 200) {
                  let info = res.data.info;
                  uni.requestPayment({
                    // 调用微信支付
                    timeStamp: info.timeStamp,
                    nonceStr: info.nonceStr,
                    package: info.package,
                    signType: info.signType,
                    paySign: info.paySign,
                    success: function (result) {
                      that.replaceList(pay_sn); // 成功之后替换该项信息
                    },
                    error: function (er) {
                    },
                    complete: function () {
                      that.flag = true;
                    }
                  });
                } else {
                  uni.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              },
              error: function (err) {
              }
            });
          }
        });
      }
    },

    // 获得修改项的新信息，并替换
    replaceList(id) {
      let that = this,
          key = that.key;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=cash&mod=rechargeLogList&key=' + key,
        method: 'GET',
        data: {
          pageSize: that.chargeLogList.length,
          currentPage: 1
        },

        success(res) {
          if (res.data.state == 200) {
			  if(res.data.data.list!=undefined&&res.data.data.list.length > 0){
				  let chargeLogList = that.chargeLogList;
				  let newList = res.data.data.list;
				  let newItem = newList.filter(el => el.pdr_sn == id);
				  
				  if (newItem[0]) {
				    for (let i = 0; i < chargeLogList.length; i++) {
				      if (chargeLogList[i].pdr_sn == id) {
				        chargeLogList[i] = newItem[0];
				        break;
				      }
				    }
				  
				    that.setData({
				      chargeLogList
				    });
				  }
			  }
          }
        },

        error: function (err) {}
      });
    }

  }
};
</script>
<style>
.balance {
  width: 750rpx;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.balance .balance_top {
  position: relative;
  height: 136rpx;
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
  /* min-width: 115rpx; */
  height: 50rpx;
  padding: 0 10rpx;
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
  height: calc(100vh - 176rpx);
  padding: 30rpx 30rpx 10rpx;
}

.balance_bottom scroll-view {
  height: 100%;
  overflow: hidden;
}

.item {
  background-color: #fff;
  margin-bottom: 30rpx;
  padding: 30rpx;
  border-radius: 8rpx;
  color: #666;
  font-size: 26rpx;
}

.item .item_top>view {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.item .item_bottom {
  display: block;
  text-align: right;
  overflow: hidden;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.item .item_bottom .btn {
  display: inline-block;
  width: 150rpx;
  height: 55rpx;
  line-height: 55rpx;
  color: #fff;
  background-color: #c1c1c1;
  font-size: 28rpx;
  text-align: center;
  border-radius: 8rpx;
  margin-left: 15rpx;
}

.item .item_bottom .btn_red {
  background-color: #fc496d;
}

.item:last-child {
  margin-bottom: 0;
}

.placeholder_style {
  color: #9f9f9f;
  font-size: 34rpx;
}

.not {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}

.not .img {
  width: 140rpx;
  height: 140rpx;
  background-color: #ddd;
  border-radius: 50%;
  overflow: hidden;
}

.not .img image {
  width: 80rpx;
  height: 80rpx;
  margin-top: 31rpx;
  margin-left: 29rpx;
}

.not text {
  margin-top: 30rpx;
  font-size: 30rpx;
  color: #000;
}

.item .item_left .ye {
  display: inline;
  color: #f5a623;
}

</style>