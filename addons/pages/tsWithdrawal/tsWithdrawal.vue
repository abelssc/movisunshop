<template>
<view>
<tsCommon></tsCommon>

<view class="withdrawal">
  <label for="cash_amount">{{$L('提现金额')}}</label>
  <input id="cash_amount" @input="cashAmountInput" type="number"></input>
</view>

<text class="tip">{{$L('注意事项:可用金额必须大于')}}{{ssys_min_cash_amount_once}}{{$L('元可申请提现。提现金额会进入商城系统的账户余额。')}}</text>

<button @tap="cashApply" hover-class="none">{{$L('提交申请')}}</button>

<common :title="$L('提现申请')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      ssys_key: '',
      ssys_min_cash_amount_once: 10,
      // 最小提现金额，默认10
      cash_amount: '' //提现金额

    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('提现申请')
    });
    const ssys_key = uni.getStorageSync('ssys_key');
    this.setData({
      ssys_key: ssys_key
    });
    this.getCashSetting(); // 获取最小提现金额
  },
  methods: {
    getCashSetting() {
      const {
        ssys_key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=api&mod=get_cash_setting&sld_addons=spreader',
        data: {
          ssys_key
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          let ssys_min_cash_amount_once = res.data.ssys_min_cash_amount_once ? res.data.ssys_min_cash_amount_once : 10;
          this.setData({
            ssys_min_cash_amount_once: ssys_min_cash_amount_once
          });
        }
      });
    },

    cashAmountInput(e) {
      this.setData({
        cash_amount: e.detail.value
      });
    },

    cashApply() {
      const {
        ssys_min_cash_amount_once,
        ssys_key,
        cash_amount
      } = this;

      if (!cash_amount) {
        uni.showToast({
          title: this.$L('请输入提现金额'),
          icon: 'none'
        });
        return;
      }

      if (cash_amount * 1 < ssys_min_cash_amount_once * 1) {
        uni.showToast({
          title: this.$L('最小提现金额为') + ssys_min_cash_amount_once,
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=ssys_cash&mod=cash_apply&sld_addons=spreader',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          cash_amount: cash_amount,
          ssys_key: ssys_key
        },
        success: res => {
          if (res.data.datas.error) {
            uni.showToast({
              title: res.data.datas.error,
              icon: 'none'
            });
          } else {
            const page = getCurrentPages();

            if (page[page.length - 2].route == "addons/pages/tsTiXian/tsTiXian") {
              // 更新上一页数据
              page[page.length - 2].$vm.updateData();
            }

            uni.showToast({
              title: res.data.datas.msg,
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  uni.navigateBack({});
                }, 2000);
              }
            });
          }
        }
      });
    }

  }
};
</script>
<style>
/* addons/pages/tsWithdrawal/tsWithdrawal.wxss */
page{
  background-color: #f7f8fb;
}

.withdrawal{
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  height: 94rpx;
  border-top: 1rpx solid #ececec;
  border-bottom: 1rpx solid #ececec;
  padding: 0 30rpx;
  background-color: #fff;
}

.withdrawal label{
  color: #333;
  font-size: 30rpx;
}

.withdrawal input{
  flex: 1;
  padding-left: 15rpx;
  font-size: 28rpx;
  color: #666;
}

.tip{
  display: block;
  color: #c2c2c2;
  font-size: 24rpx;
  padding: 20rpx 30rpx;
}

button{
  width: 658rpx;
  height: 94rpx;
  margin-top: 80rpx;
  border-radius: 10rpx;
  color: #fff;
  background-color: #FC3357;
  font-size: 36rpx;
  line-height: 94rpx;
}


</style>