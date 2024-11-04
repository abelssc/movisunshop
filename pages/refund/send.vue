<template>
<view>
<form @submit="submit">

  <view class="form-item">
    <picker mode="selector" :range="express_list" range-key="value" @change="selectExpress">
      <view :class="'handle ' + (express?'h':'w')">{{express?express:$L('选择物流公司')}}</view>
      <input :placeholder="$L('选择物流公司')" class="hide" :value="wuliu_company" name="wuliu_company"></input>
    </picker>
  </view>

  <view class="form-item">
     <input class="handle" :placeholder="$L('录入物流单号')" name="refund_wuliu_order"></input>
  </view>

  <button form-type="submit">{{$L('提交')}}</button>
</form>

<common :title="$L('发货')"></common>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      key: '',
      refund_id: '',
      express: '',
      express_list: "",
      wuliu_company: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('发货')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.setData({ ...options
    });
    this.initData();
  },
  methods: {
    initData() {
      let {
        key,
        refund_id
      } = this;
      request({
        url: getApp().globalData.ser_url + `/index.php?app=userorder&mod=get_refund_info&key=${key}&refund_id=${refund_id}`
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            express_list: res.datas.express_list
          });
        }
      });
    },

    //
    selectExpress(e) {
      let {
        express_list
      } = this;
      let item = express_list[e.detail.value];
      this.setData({
        express: item.value,
        wuliu_company: item.id
      });
    },

    //submit
    submit(e) {
      let params = e.detail.value;
      let {
        key,
        refund_id
      } = this;

      if (!params.refund_wuliu_order || !params.wuliu_company) {
        uni.showToast({
          title: this.$L('物流公司及物流单号必须填写'),
          icon: 'none'
        });
        return;
      }

      params.key = key;
      params.id = refund_id;
      request({
        url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=update_fahuo',
        method: 'post',
        data: params
      }).then(res => {
        if (res.datas.state == "failuer") {
          uni.showToast({
            title: res.datas.error,
            icon: 'none'
          });
        } else {
          uni.showToast({
            title:this.$L('发货成功'),
            icon: 'none'
          });
          setTimeout(() => {
            let page = getCurrentPages();

            if (page[page.length - 2].$vm.updata) {
              page[page.length - 2].$vm.updata(refund_id);
            }

            uni.navigateBack({});
          }, 1500);
        }
      });
    }

  }
};
</script>
<style>
/* pages/refund/send.wxss */
page{
  background-color: #f5f5f5;
}

.form-item{
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
}

.handle{
  width: 400rpx;
  height: 70rpx;
  border-radius: 10rpx;
  background-color: #f5f5f5;
  padding: 0 15rpx;
  font-size: 26rpx;
  line-height: 70rpx;
  color: #333;
}

.handle.h{
  color: #333;
}

.handle.w{
  color: #999;
}

button{
  width: 600rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background-color: #F23030;
  border-radius: 15rpx;
  color: #fff;
  font-size: 26rpx;
  margin-top: 80rpx;
}
</style>