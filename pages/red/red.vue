<template>
<view>
<view class="nav">
  <view :class="'nav-item ' + (type=='not_used'?'on':'')" data-type="not_used" @tap="changeNav">{{$L('未使用')}}</view>
  <view :class="'nav-item ' + (type=='used'?'on':'')" data-type="used" @tap="changeNav">{{$L('已使用')}}</view>
  <view :class="'nav-item ' + (type=='expired'?'on':'')" data-type="expired" @tap="changeNav">{{$L('已过期')}}</view>
</view>

<view class="red-list">
  <block v-if="voucherList.length">
	  <view v-for="(item, index) in voucherList" :key="index" v-if="voucherList.length > 0">
	    <voucher :info="item" :type="1"></voucher>
	  </view>
  </block>
  <block v-if="!voucherList.length && !isLoading">
    <view class="empty"> 
      <image :src="img_url+'nothave.png'" mode="widthFix"></image>
      <view>{{$L('暂无优惠券')}}</view>
    </view>
  </block>
</view>

<navigator hover-class="none" url="/pages/red/red_get_list" class="voucher-center">
  <image :src="img_url+$L('ling_btn.png')" mode="widthFix"></image>
</navigator>

<common :title="$L('优惠券')"></common>
</view>
</template>

<script>
import voucher from "../../component/voucher/voucher";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      key: '',
      type: 'not_used',
      voucherList: [],
      isLoading: true,
	  pn: 1,
	  hasmore:true
    };
  },

  components: {
    voucher
  },
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('优惠券')
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

  onReachBottom() {
    if (this.hasmore) {
      this.initData();
    }
  },

  methods: {
    initData() {
		uni.showLoading({
			title: ''
		});
      let {
        type,
        key
      } = this;
      let params = {
        key: key,
        page: 10,
        pn: this.pn,
        red_status: type
      };
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=red&mod=red_list&sld_addons=red',
        data: params,
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.red;

            if (this.pn == 1) {
              this.setData({
                voucherList: list
              });
            } else {
              let {
                voucherList
              } = this;
              this.setData({
                voucherList: voucherList.concat(list)
              });
            }
          }

          if (res.data.hasmore) {
            this.pn++;
          } else {
            this.hasmore = false;
          }
        },
        complete: () => {
          if (this.pn == 1) {
            this.setData({
              isLoading: false
            });
          }
		  uni.hideLoading()
        }
      });
    },

    changeNav(e) {
      let {
        type
      } = this;
      let newType = e.currentTarget.dataset.type;

      if (type == newType) {
        return;
      }

      this.setData({
        type: newType
      });
      this.pn = 1;
      this.hasmore = true;
      this.initData();
    },

    updateList() {
      this.pn = 1;
      this.hasmore = true;
      this.initData();
    }

  }
};
</script>
<style>
/* pages/red/red.wxss */

page {
  padding: 84rpx 0 120rpx;
  width: 750rpx;
  margin: 0 auto;
}

.nav {
  position: fixed;
  top: 0;
  /* left: 0; */
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 84rpx;
  background-color: #fff;
  color: #333;
  font-size: 30rpx;
  z-index: 99;
}
/* #ifdef H5 */
	.nav{
		top: 88rpx
	}
/* #endif */
.nav .nav-item {
  flex: 1;
  height: 100%;
  text-align: center;
  line-height: 81rpx;
  border-bottom: 3rpx solid transparent;
}

.nav-item.on {
  border-bottom: 3rpx solid #e17701;
  color: #e17701;
}

.voucher-center {
	width: 750rpx;
  position: fixed;
  bottom: 30rpx;
  left: 0;
  right: 0;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  margin: 0 30rpx;
  border: 1rpx solid #e74310;
  border-radius: 8rpx;
  z-index: 99;
  margin: 0 auto;
}

.voucher-center image {
  width: 340rpx;
  height: 0;
}

.empty {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 26rpx;
}

.empty image{
  width: 120rpx;
  height: 0;
  margin-bottom: 30rpx;
}



</style>