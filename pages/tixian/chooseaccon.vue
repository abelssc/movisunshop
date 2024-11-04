<template>
<view>
<view class="accon">
  <view v-for="(item, index) in CashAccountList" :key="index" class="list" :data-id="index" @tap="choose">
    <image :src="img_url+item.url" mode="widthFix"></image>
    <view>
      <text>{{item.account_bank_name?item.account_bank_name:item.account_type_name}}</text>
      <text>{{item.account_name}} {{item.account_user}}</text>
    </view>
  </view>
</view>
<common :title="$L('历史账号')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      CashAccountList: [],
	  img_url:getApp().globalData.img_url,
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('历史账号')
    });
    this.getCashAccountList();
  },

  // 加载更多
  onReachBottom() {
    if (this.hasmore) {
      this.getCashAccountList();
    }
  },

  methods: {
    // 获取充值账号
    getCashAccountList() {
      let that = this,
          key = uni.getStorageSync('token');
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=cash&mod=getCashAccountList&key=' + key,
        method: 'GET',
        data: {
          pageSize: 15,
          currentPage: that.pn
        },

        success(res) {
          if (res.data.state == 200) {
            let dat = res.data.data.list;
            dat.map(el => {
              if (el.account_type_name == that.$L('支付宝')) {
                el.url = 'zifubao@2x.png';
              }

              if (el.account_type_name == that.$L('银行卡')) {
                el.url = 'yinghangka@2x.png';
              }

              if (el.account_type_name == that.$L('微信')) {
                el.url = 'Group4@2x.png';
              }
            });
            that.setData({
              CashAccountList: res.data.data.list
            });

            if (that.CashAccountList.length < res.data.data.pagination.total) {
              that.pn++;
            } else {
              that.hasmore = false;
            }
          }
        },

        error: function (err) {}
      });
    },

    // 选择账号
    choose(e) {
      let id = this.CashAccountList[e.currentTarget.dataset.id];
      if (id) {
        const page = getCurrentPages();
        let len = page.length;
        page[len - 2].$vm.choose(id);
        uni.navigateBack({});
      }
    }
  }
};
</script>
<style>
.accon {
  width: 750rpx;
  height: calc(100vh - 30rpx);
  padding-top: 30rpx;
  background-color: #f5f5f5;
}

.list {
  display: flex;
  align-items: center;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 30rpx;
  color: #555;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
  padding-left: 30rpx;
}

.list:last-child{
  border: none
}

.list image {
  width: 50rpx;
  margin-right: 30rpx;
}

.list view text {
  display: block;
  font-size: 28rpx;
  line-height: 30rpx;
}

</style>