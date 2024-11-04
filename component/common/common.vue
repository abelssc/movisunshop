<template>
<view class="sld-success-wrap" v-if="regWrapShow">
  <view class="sld-reg-success">
    <view class="sld-reg-close" @tap="closeRegWrap">
      <image :src="img_url+'reg_voucher_close.png'"></image>
    </view>
    <view data-url="/pages/red/red" class="navigator" @tap="goVoucher">
      <image :src="red_img?red_img:'../../images/reg_voucher.png'" mode="widthFix"></image>
    </view>
  </view>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      regWrapShow: false,
      red_img: ""
    };
  },

  components: {},
  props: {
    title: {
      type: String // 页面标题 必须

    },
    gids: {
      type: Array // 页面gid集合

    },
    gid: {
      type: Number,
      // 商品详情gid
      default: 0
    }
  },

  mounted() {
    this.initFun();
  },

  beforeDestroy() {
    this.pageExit(); 
  },
watch: {
	gids() {
		this.pageReady();
	}
  },
  methods: {
    initFun() {
      this.registerVoucherFun();
      this.pageReady();
    },

    // 注册成功后的弹层
    registerVoucherFun() {
      const red_money = uni.getStorageSync('red_money');
      const red_img = uni.getStorageSync('red_img');
      const key = uni.getStorageSync('token');
      if (!red_money || !key) return;
      this.setData({
        regWrapShow: true,
        red_img: red_img ? red_img : ''
      });
      uni.removeStorage({
        key: 'red_money',
        success: function (res) {}
      });
      uni.removeStorage({
        key: 'red_img',
        success: function (res) {}
      });
    },

    closeRegWrap() {
      this.setData({
        regWrapShow: false
      });
    },

    goVoucher(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        this.setData({
          regWrapShow: false
        });
        uni.navigateTo({
          url: url
        });
      }
    },

    // 生成随机字符串
    generateRdStr() {
      let text = "sld_";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      text += new Date().getTime();
      return text;
    },

    // 页面打开统计
    pageReady() {
      this.start_time = new Date().getTime();
	  let title = this.title;
	  let gids = this.gids;
	  let gid = this.gid;

      if (uni.getStorageSync('isnew') == 1) {
        uni.setStorage({
          key: 'isnew',
          data: 0
        });
      }

      let arrive = parseInt(this.start_time / 1000);
      let key = uni.getStorageSync('generateRdStr');

      if (!key) {
        key = this.generateRdStr();
        uni.setStorageSync('generateRdStr', key);
      }

      let end = 2;//2H5 3小程序  4IOS 5android
	  // #ifdef H5
		end = 2;
	  // #endif
	  // #ifdef MP-WEIXIN
	  		end = 3;
	  // #endif
	  // #ifdef APP-PLUS
	  if(uni.getSystemInfoSync().platform == 'android'){
		  end = 5;
	  }else{
		  end = 4;
	  }
	  // #endif
      let pages = getCurrentPages(),
          len = pages.length,
          refer,
          url = pages[len - 1].route;

      if (len > 2) {
        refer = pages[len - 2].route;
      }

      let isnew = uni.getStorageSync('isnew');
      let uid = uni.getStorageSync('token') || 0;
      let region = uni.getStorageSync('region');
      let channel = uni.getStorageSync('channel') || '';
	  // #ifdef MP-WEIXIN
      let not_web = 1;
	  // #endif
	  // #ifndef MP-WEIXIN
	  let not_web = 0;
	  // #endif

      if (isnew == 1) {
        uni.setStorage({
          key: 'isnew',
          data: 0
        });
      }

      let requesturl = getApp().globalData.ser_url;
	  setTimeout(() => {
	    request({
	      url: requesturl + '/index.php?app=stats_handle',
	      method: 'POST',
	      data: {
	        key,
	        arrive,
	        end,
	        refer: refer || '',
	        title: title,
	        url,
	        is_new: isnew,
	        uid,
	        gid,
	        gids,
	        region,
	        channel,
	        not_web
	      }
	    });
	  }, 1500);
    },

    // 页面关闭统计
    pageExit() {
      this.end_time = new Date().getTime();
      let stay = this.end_time - this.start_time;
      let key = uni.getStorageSync('generateRdStr');
      let arrive = parseInt(this.start_time / 1000);
	  let url = getApp().globalData.ser_url
      request({
        url: url + '/index.php?app=stats_handle&mod=change_val',
        method: 'post',
        data: {
          key,
          arrive,
          stay
        }
      });
    }

  }
};
</script>
<style>
.sld-success-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* width: 750rpx; */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.sld-success-wrap .sld-btns button.confirm{
  color: #576B95;
  border-left: 1px solid #eee;
}

.sld-success-wrap .sld-btns button::after{
  border: 0;
}

.sld-reg-success{
  position: relative;
}

.sld-reg-success .sld-reg-close{
  position: absolute;
  top: -56rpx;
  right: 20rpx;
  width: 56rpx;
  height: 56rpx;
}

.sld-reg-success .sld-reg-close image{
  width: 100%;
  height: 100%;
}

.sld-reg-success .navigator image{
  width: 514rpx;
  height: 0;
}

</style>