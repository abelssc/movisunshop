<template>
<!--pages/buyShow/buyShow.wxml-->
<view class="buy_show" v-if="comment && comment.length">
    <view class="buy_show_title">{{$L('商品买家秀')}}<text>({{length}}{{$L('条')}})</text></view>
    <view class="buy_show_list">
        <view v-for="(item, index) in comment" :key="index">
         <view v-for="(item1, index2) in item.geval_images" :key="index2" class="buy_show_pre">
           <image :src="item1" class="goods_img"  @tap="previewImg" mode="aspectFit" :data-src="item1"></image>
            <view class="business">
                <image :src="item.member_logo" class="business_ava"></image>
                <text class="business_name">{{item.geval_frommembername}}</text>
            </view>
        </view>
        </view>
       
    </view>
</view>
</template>

<script>
var is_load = true;
var get_comments = function (that) {
  uni.request({
    url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getGoodsDetailComments_xcx',
    data: {
      gid: that.gid,
      commenttype: 'g_img',
      pn: that.pn,
      rows: that.rows
    },
    dataType: 'json',
    success: function (result) {
      var pn = that.pn; //如果是初次加载，直接赋值，否则数据追加

      if (pn == 1) {
        that.setData({
          comment: result.data.datas.comment
        });
      } else {
        let comment = result.data.datas.comment;
        that.setData({
          comment: that.comment.concat(comment)
        });
      }

      if (result.data.hasmore) {
        that.pn++;
        that.setData({
          hasmore: true
        });
      } else {
        that.setData({
          hasmore: false
        });
      }
    },

    complete() {
      that.setData({
        isloading: false
      });
    }

  });
};

export default {
  data() {
    return {
      gid: 0,
      comment_state: '',
      pn: 1,
      rows: 10,
      hasmore: true,
      show_go_top: true,
      scroll_height: 0,
      comment_list: [],
      isloading: true,
      comment: [],
      //评论
      imgUrls: [],
      length: 0 //买家秀总数
      ,
      scrren_height: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('买家秀')
    });
    this.setData({
      length: options.length
    }); //获取商品id

    this.setData({
      gid: options.gid
    }); //获取全部好评状态下的数据

    get_comments(this); //获取滚动区域的高度

    var new_that = this;
    uni.getSystemInfo({
      success: function (res) {
        var scroll_height = res.windowHeight;
        new_that.setData({
          scrren_height: scroll_height
        });
      }
    });
  },

  // 加载更多
  onReachBottom(e) {
    let {
      hasmore
    } = this;

    if (hasmore) {
      get_comments(this);
    }
  },

  methods: {
    selectComment: function (e) {
      var state = e.target.dataset.state;
      this.setData({
        comment_state: state,
        pn: 1
      });
      this.setData({
        scroll_height: 0
      }); //获取相应状态下的数据

      get_comments(this);
    },
    //滚动监听的方法
    scroll: function (e) {
      var is_show = true;

      if (e.detail.scrollTop > 200) {
        is_show = false;
      }

      this.setData({
        show_go_top: is_show
      });
    },
    //返回顶部事件
    go_top: function (e) {
      this.setData({
        scroll_height: 0,
        pn: 1
      });
    },

    //点击图片放大预览
    previewImg(e) {
		let src = e.currentTarget.dataset.src;
		if(src.indexOf('https:') != -1){
			src = e.currentTarget.dataset.src;
		}else{
		   src ='https:'+ e.currentTarget.dataset.src;
		} 
		uni.previewImage({
			current: src,
			//当前图片的http链接
			urls: [src] //必须是数组
		});
    }

  }
};
</script>
<style>
/* pages/buyShow/buyShow.wxss */
page{
    width: 750rpx;
    background: #F8F8F8;
	margin: 0 auto;
}
.buy_show{
    width: 100%;
    background: #FFFFFF;
    margin-top: 20rpx;
}
.buy_show_title{
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(45,45,45,1);
    line-height:45rpx;
    padding: 29rpx 0 0 20rpx;
    box-sizing: border-box;
}
.buy_show_title text{
    font-size: 22rpx;
}
.buy_show_list{
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    box-sizing: border-box;
}
.buy_show_pre{
    width:335rpx;
    height:345rpx;
    border-radius:15rpx;
    margin-right: 20rpx;
    position: relative;
    margin-bottom: 20rpx;
	background-color: #f8f8f8;
	text-align: center;
	display: inline-block;
}
.buy_show_pre:nth-of-type(2n){
    margin-right: 0;
}
.goods_img{
        height: 345rpx;
        border-radius: 15rpx;
        display: inline-block;
        width: 186rpx;
}
.business{
    position: absolute;
    bottom: 10rpx;
    left: 10rpx;
    display: flex;
    align-items: center;
}
.business_ava{
    width:36rpx;
    height:36rpx;
    border-radius: 50%;
}
.business_name{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:45rpx;
    margin-left: 10rpx;
}
</style>