<template>
<view>
<!-- <block wx:if="{{!type}}">
  <web-view src="{{out_base_url}}/cwap_help_center_xcx.html?key={{key}}"></web-view>
</block> -->

<block>
  <view class="help-list">
    <navigator v-for="(item, index) in helpList" :key="index" hover-class="none" class="help-item" :url="'/pages/help/help_detail?i=' + item.acid + '&n=' + item.ac_name + '&type=' + type">
      <text>{{item.ac_name}}</text>
      <image src="/static/images/arrow_right_b.png"></image>
    </navigator>
  </view>
</block>

<view class="empty" v-if="!helpList.length && isLoading">
  <view class="img">
    <image :src="img_url+'order_w.png'"></image>
  </view>
  <text>{{$L('暂无帮助信息')}}</text>
</view>

<common :title="$L('帮助中心')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      out_base_url: getApp().globalData.view_url,
      key: '',
      type: '',
      helpList: [],
      isLoading: false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('帮助中心')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });

      if (options.type) {
        this.setData({
          type: options.type // type==ts 推手的帮助

        });
        this.getHelpList();
      } else {
        this.getArticleHelp();
      }
    } else {
      getApp().globalData.goLogin();
    }
  },
  methods: {
    getHelpList() {
      uni.request({
		
        // url: getApp().globalData.ser_url + '/index.php?app=index&mod=article_help&sld_addons=spreader',
		url: getApp().globalData.ser_url + '/index.php?app=index&mod=article_list&sld_addons=spreader',
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              // helpList: res.data.datas.article_list_class,
			  helpList: res.data.datas.article_list,
              isLoading: true
            });
          }
        },
        complete: () => {
          this.setData({
            isLoading: true
          });
        }
      });
    },

    getArticleHelp() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=article_help',
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              helpList: res.data.datas.article_list_class,
              isLoading: true
            });
          }
        },
        complete: () => {
          this.setData({
            isLoading: true
          });
        }
      });
    }

  }
};
</script>
<style>
	page{
		width: 750rpx;
		margin: 0 auto;
	}
/* pages/help/help.wxss */
.help-list{
  margin-top: 20rpx;
  padding: 0 20rpx;
}

.help-list .help-item{
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #eee;
}

.help-item text{
  color: #666;
  font-size: 28rpx;
  width: 550rpx;
  overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
}

.help-item image{
  width: 24rpx;
  height: 24rpx;
  opacity: 0.7;
}

.empty{
  height: 750rpx;
  width: 750rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.empty .img{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #ddd;
}

.empty .img image{
  width: 100rpx;
  height: 100rpx;
}

.empty text{
  color: #666;
  font-size: 28rpx;
  margin-top: 30rpx;
}

</style>