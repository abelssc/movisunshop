<template>
<view>
<common :title="$L('领券中心')"></common>
<view v-for="(item, index) in voucherList" :key="index" v-if="voucherList.length > 0">
  <voucher :info="item" :type="2" @reveive="reveive"></voucher>
</view>
<!-- 底部站位栏 -->
<view class="iphone_view" :style="'height:'+bottomSateArea"></view>
<!-- 无数据 -->
<view class="no_content" v-if="voucherList.length <= 0&& noData=='1'">
  <image :src="img_url + 'site/no_coupon.png'"></image>
    <text>{{$L('暂无优惠券~')}}</text>
</view>
</view>
</template>

<script>
import voucher from "../../component/voucher/voucher";

export default {
  data() {
    return {
      out_base_url: getApp().globalData.view_url,
      key: '',
      voucherList: [],
      img_url: getApp().globalData.img_url ,//图片地址
      noData:0,
	  bottomSateArea:getApp().globalData.bottomSateArea,//iphone手机底部一条黑线的高度
    };
  },
  components: {
    voucher
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('领券中心')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      // getApp().globalData.goLogin();
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
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=red&mod=red_get_list&sld_addons=red',
        data: {
          page: 10,
          pn: this.pn,
          key: this.key
        },
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.red;

            if (this.pn == 1) {
              this.setData({
                voucherList: list
              })
			   this.noData=1
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
        }
      });
    },

    reveive(e) {
      let id = e.detail.id;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=red&mod=send_red&sld_addons=red',
        data: {
          key: this.key,
          red_id: id
        },
        success: res => {
          if (res.data.code == 200) {
			uni.showToast({
				title: this.$L('领取成功'),
				icon: 'none',
				duration: 2000
			});
            let {
              voucherList
            } = this;

            for (let i = 0; i < voucherList.length; i++) {
              let item = voucherList[i];

              if (item.id == id) {
                item.have++;
                item.red_hasget = item.red_hasget * 1 + 1;
				item.prent = res.data.data.per;
                break;
              }
            }

            this.setData({
              voucherList: voucherList
            });
			
			setTimeout(() => {
				let pages = getCurrentPages();
				if (pages[pages.length - 2].$vm.updateList) {
				  pages[pages.length - 2].$vm.updateList();
				}
			}, 2500);
          } else {
            uni.showToast({
              title:this.$L('领取失败') ,
              icon: 'none',
			  duration: 2000
            });
          }
        }
      });
    }

  }
};
</script>
<style>
/* pages/red/red_get_list.wxss */
page{
  height: 100%;
  width: 750rpx;
  margin: 0 auto;
}
.no_content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: calc(100vh - 884rpx);
}
.no_content image{
  width: 200rpx;
  height: 200rpx;
}
.no_content text{
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:32rpx;
  margin-top: 30rpx;
}
.iphone_view{
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
	}
</style>