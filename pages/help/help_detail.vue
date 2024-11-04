<template>
<view>
<common :title="$L('帮助详情')"></common>

 <view class="help-list">
    <navigator v-for="(item, index) in article_list" :key="index" hover-class="none" class="help-item" :url="'/pages/help_info/help_info?i=' + item.id + '&type=' + type">
      <text>{{item.article_title}}</text>
      <image src="/static/images/arrow_right_b.png"></image>
    </navigator>
  </view>

<view class="empty" v-if="!article_list.length && isLoading">
  <view class="img">
    <image :src="img_url+'order_w.png'"></image>
  </view>
  <text>{{$L('暂无帮助信息')}}</text>
</view>
</view>
</template>

<script>

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      out_base_url: getApp().globalData.view_url,
      key: '',
      article_list: [],
      isLoading: false,
      i: "",
      n: "",
      type: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('帮助详情')
    });
    var i = options.i;
    var n = options.n;
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key,
        i,
        n,
        type: options.type ? options.type : ''
      });
      this.getHelpDetail();
    } else {
      getApp().globalData.goLogin();
    }

    uni.setNavigationBarTitle({
      title: n
    });
  },
  methods: {
    getHelpDetail() {
      let {
        i,
        type
      } = this;
      let url = getApp().globalData.ser_url + (type == 'ts' ? '/index.php?app=index&mod=article_list&sld_addons=spreader' : '/index.php?app=index&mod=article_list');
	  // let url = getApp().globalData.ser_url + (type == 'ts' ? '/index.php?app=index&mod=article_detail&sld_addons=spreader' : '/index.php?app=index&mod=article_detail');
      uni.request({
        url: url,
        data: {
          acid: i
        },
        success: res => {
          let data = res.data.datas;

          if (data.status == 1) {
            this.setData({
              article_list: data.article_list,
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

.empty text{
  color: #666;
  font-size: 28rpx;
  margin-top: 30rpx;
}

.empty .img image{
  width: 100rpx;
  height: 100rpx;
}
</style>