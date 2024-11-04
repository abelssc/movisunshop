<template>
<view>
<view class="refund">
  <view class="order_list">
    <view class="v_name" :data-vid="order_info.vid" @tap="store_detail">
      <image src="/static/images/store_b.png" mode="widthFix"></image>
      <text>{{order_info.store_name}}</text>
      <image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
    </view>

    <view class="goods_list">
      <view v-for="(item, index) in order_info.goods_list" :key="index" class="goods_item" :data-gid="item.gid" @tap="goods_detail">
        <view class="item_left">
          <image :src="item.image_url"></image>
          <text>{{item.goods_name}}</text>
        </view>
        <view class="item_right">
          <view class="price">{{$L('￥')}}{{item.goods_price}}</view>
          <view class="num">x{{item.goods_num}}</view>
        </view>
      </view>
    </view>

    <view class="refund_info">
      <view class="refund_item">
        <view class="title">{{$L('退货原因')}}</view>
        <input type="text" :placeholder="$L('请填写退货原因')" :value="tyuan" :disabled="type==1" @input="yInput"></input>
      </view>

      <view class="refund_item">
        <view class="title">{{$L('退款金额')}}</view>
        <input type="text" placeholder :value="$L('￥') + refund_money" disabled="true" v-if="type==1"></input>
        <view class="txt" v-if="type!=1">
          <input type="text" placeholder :value="$L('￥') + refund_money" disabled="true"></input>
          <view class="txt_right">
            <text>{{$L('￥')}}{{refund_money}}</text>
            <text>{{$L('最多可退金额')}}</text>
          </view>
        </view>
      </view>

      <view class="refund_item" v-if="type!=1">
        <view class="title">{{$L('退货数量')}}</view>
        <view class="txt">
          <input type="text" placeholder :value="num" disabled="true"></input>
          <view class="txt_right">
            <text>{{num}}</text>
            <text>{{$L('最多可退数量')}}</text>
          </view>
        </view>
      </view>

      <view class="refund_item" v-if="type==1">
        <view class="title">{{$L('退款说明')}}</view>
        <input type="text" :placeholder="$L('请填写原因')" value @input="y2Input"></input>
      </view>

      <view class="sumbit" @tap="sumbit">{{$L('提交')}}</view>
    </view>
  </view>
</view>
<common :title="$L('退款退货')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      type: '',
      orderid: '',
      gid: '',
      order_info: '',
      refund_money: 0,
      // 退了金额
      tyuan: this.$L('取消订单，全部退款'),
      // 退款原因
      yy: '' // 退款说明
      ,
      key: "",
      num: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('申请退货')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key
      });
    } else {
      getApp().globalData.goLogin();
    }

    let type = options.type,
        orderid = options.orderid,
        gid = options.gid,
        tyuan;

    if (type != 1) {
      tyuan = '';
    } else {
      tyuan = this.$L('取消订单，全部退款');
    }

    this.setData({
      type,
      orderid,
      gid,
      tyuan
    });
    this.getOrderInfo();
  },
  methods: {
    // 获取订单信息
    getOrderInfo() {
      var that = this,
          key = that.key,
          type = that.type,
          order_id = that.orderid;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_info',
        data: {
          key,
          order_id
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 200) {
            var order_info = res.data.datas.order_info;
            var num = 0;
            let goods_list;

            if (type != 1) {
              goods_list = order_info.goods_list.filter(el => el.rec_id == that.gid);
              goods_list.forEach(el => {
                if (el.goods_num) {
                  num += parseInt(el.goods_num);
                }
              });
            }

            var refund_money;

            if (type == 1) {
              refund_money = res.data.datas.order_info.real_pay_amount;
            } else {
              if (order_info.payment_code == 'offline' && order_info.order_state < 40) {
                refund_money = 0;
              } else {
                refund_money = parseFloat(goods_list[0].goods_pay_price);
              }

              order_info.goods_list = goods_list;
            }

            that.setData({
              order_info: order_info,
              refund_money,
              num
            });
          } else {
            uni.showToast({
              title: res.data.datas.error,
              icon: 'none'
            });
          }
        }
      });
    },

    // 店铺
    store_detail(e) {
      let vid = e.currentTarget.dataset.vid;

      if (getCurrentPages().length > 8) {
        uni.redirectTo({
          url: '/pages/shopHomePage/shopHomePage?vid=' + vid
        });
      } else {
        uni.navigateTo({
          url: '/pages/shopHomePage/shopHomePage?vid=' + vid
        });
      }
    },

    // 商品
    goods_detail(e) {
      let gid = e.currentTarget.dataset.gid;

      if (getCurrentPages().length > 8) {
        uni.redirectTo({
          url: '/pages/goods_detail/goods_detail?gid=' + gid
        });
      } else {
        uni.navigateTo({
          url: '/pages/goods_detail/goods_detail?gid=' + gid
        });
      }
    },

    // 退款原因
    yInput(e) {
      this.setData({
        tyuan: e.detail.value
      });
    },

    y2Input(e) {
      this.setData({
        yy: e.detail.value
      });
    },

    // 提交
    sumbit() {
      var that = this;
      var key = that.key,
          order_id = that.orderid,
          gid = that.gid,
          type = that.type,
          yy = that.yy,
          refund_amount = that.refund_money;

      if (type == 1) {
        if (!yy) {
          uni.showToast({
            title: that.$L('请填写退款说明'),
            icon: 'none'
          });
          return;
        }

        uni.request({
          url: app.globalData.ser_url + '/index.php?app=userorder&mod=add_refund_all',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key,
            buyer_message: yy,
            order_id
          },
          success: function (res) {

            if (res.data.datas.state == 'failuer') {
              uni.showToast({
                title: res.data.datas.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: that.$L('申请提交成功')
              });
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/user/user'
                });
              }, 2000);
            }
          }
        });
      } else {
        var refund_type = type == 'refund' ? 1 : 2;
        var num = that.num;
        var refund_amount = that.refund_money;
        var refund_msg = that.tyuan;
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=add_refund',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key,
            goods_num: num,
            gid,
            order_id,
            refund_msg,
            refund_type,
            refund_amount
          },
          success: function (res) {
            if (res.data.datas.state == "failuer") {
              uni.showToast({
                title: res.data.datas.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: that.$L('申请成功')
              });
              setTimeout(() => {
                if (refund_type == 1) {
                  uni.navigateTo({
                    url: '/pages/refund/list?type=1'
                  });
                } else {
                  uni.navigateTo({
                    url: '/pages/refund/list?type=2'
                  });
                }
              }, 2000);
            }
          }
        });
      }
    }

  }
};
</script>
<style>
/* pages/refund/detail.wxss */

.refund {
  padding: 0 30rpx;
  box-sizing: border-box;
  width: 750rpx;
  margin: 0 auto;
}

.order_list {
  font-size: 28rpx;
  color: #333;
}

.order_list .v_name {
  display: flex;
  align-items: center;
  height: 80rpx;
  overflow: hidden;
}

.order_list .v_name text {
  display: block;
  margin: 0 20rpx;
}

.order_list .v_name image {
  width: 30rpx;
}

.order_list .v_name image:last-child {
  width: 20rpx;
}

.order_list .goods_list {
  padding: 30rpx 0;
}

.order_list .goods_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.goods_item .item_left {
  display: flex;
  max-width: 500rpx;
}

.item_left image {
  flex: 0 0 140rpx;
  width: 140rpx;
  height: 140rpx;
  border: 1rpx solid #e2e2e2;
}

.item_left text {
  padding-top: 30rpx;
  font-size: 26rpx;
  padding-left: 10rpx;
}

.item_right {
  font-size: 26rpx;
  text-align: right;
  color: #000;
}

.item_right .num {
  color: #999;
}

.refund_info .refund_item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.refund_item view.title {
  flex: 0 0 130rpx;
  width: 130rpx;
  color: #666;
  font-size: 26rpx;
}

.refund_item input {
  height: 80rpx;
  flex: 1;
}

.refund_info .sumbit {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #F23030;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  border-radius: 10rpx;
  margin: 50rpx 10rpx 0;
}

.txt{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.txt .txt_right text{
  display: block;
  text-align: right;
  font-size: 26rpx;
  color: #999;
}

.txt .txt_right text:first-child{
  color: #ffb03f;
}
</style>