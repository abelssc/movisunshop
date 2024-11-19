<template>
<view>
  <common :title="$L('足迹')" :gids="gids" v-if="gids.length"></common>

  <view class="del" v-if="list.length">
    <text @tap="clearAll" class="clearAll">
      {{$L('清空')}}
    </text>
  </view>

  <view class="list" v-if="list.length">
    <navigator v-for="(item, index) in list" :key="index" class="goods" hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid">
      <view class="img">
        <image :src="item.goods_image" mode="aspectFit"></image>
      </view>
      <view class="goods-info">
        <view class="name">{{item.goods_name}}</view>
        <!--
        <view class="goods_jingle">{{item.goods_jingle}}</view>
        -->
        <view class="price">{{$L('￥')}}{{item.show_price}}</view>
      </view>
    <view class="cancel-box">
      <text class="cancel-collect" :data-id="item.gid" @tap.stop="cancel">
        <image :src="img_url+'trash.svg'" mode="widthFix"></image>
      </text>
    </view>
    </navigator>
  </view>

  <view class="empty" v-if="!list.length && !isloading">
    <view class="noorder">
      <view class="noorder_content">
        <view class="img">
          <image :src="img_url+'goods-browse_w.png'" mode="widthFix"></image>
        </view>
        <text>{{$L('暂无您的浏览记录')}}</text>
        <text>{{$L('可以去看看哪些想要买的')}}</text>
        <navigator hover-class="none" class="btn" url="/pages/index/index" open-type="switchTab">{{$L('随便逛逛')}}</navigator>
      </view>
    </view>

    <view class="cart-comment">
      <view class="goods-list">
        <navigator v-for="(item, index) in goods_list" :key="index" hover-class="none" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid">
          <view class="img">
            <image :src="item.goods_img_url" mode="aspectFit"></image>
          </view>

          <view class="goods-name">{{item.goods_name}}</view>

          <view class="price-wrap">
            <view class="price">{{$L('￥')}}
              <text>{{item.goods_price}}</text>
            </view>
            <view class="sale">{{item.goods_salenum}}{{$L('人付款')}}</view>
          </view>
        </navigator>
      </view>
    </view>
  </view>
  <view class="cart-brand">
		<image class="avatar" src="https://www.movisunshop.com/data/upload/mall/store/07656731789056289.jpg" mode="aspectFit"></image>
	</view>
</view>
</template>

<script>
import request from "../../utils/request";

export default {
  data() {
    return {
      key: '',
      list: [],
      goods_list: [],
      isloading: true,
      img_url: getApp().globalData.img_url, //图片地址
	  gids:[],
	  pn:1,
	  hasmore: true,
	  refresh: true
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('足迹')
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
    this.getRecGoodsList();
	},
	onReachBottom() {
		if (this.hasmore) {
			this.initData();
		}
	},
  methods: {
    initData() {
		request({
			url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=getUserFootorList&key=' + this.key + '&pn=' + this.pn
		}).then(res => {
			if (res.code == 200) {
				let data='';
				let pn=this.pn;
				if (pn == 1) {
					data = res.datas.browse_history;
				} else {
					data = this.list.concat(res.datas.browse_history);
				}
				if (res.hasmore) {
					pn = pn + 1;
				}; //如果hasmore为true，则
				this.setData({
					pn: pn,
					list: data,
					hasmore: res.hasmore || false
				});
			}

			this.setData({
			  isloading: false
			});
		}).catch(err => {
			this.setData({
			  isloading: false
			});
			
			if (this.refresh) {
				uni.stopPullDownRefresh();
				this.setData({
					refresh: false
				});
			}
		});
    },

    // 推荐商品
    getRecGoodsList() {
      request({
        url: getApp().globalData.ser_url + "/index.php?app=goods&mod=getRecGoodsList"
      }).then(res => {
        if (res.datas.goods_list && res.datas.goods_list.length) {
			let gids = [];
			res.datas.goods_list.forEach(el => {
				gids.push(el.gid);
			});
			this.setData({
				gids
			});
          let goods_list = res.datas.goods_list;
          this.setData({
            goods_list: goods_list
          });
        }
      });
    },

    clearAll() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=delFooter',
        method: 'post',
        data: {
          key: this.key,
          gid: 'all'
        }
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            list: []
          });
        } else {
          uni.showToast({
            title: res.datas.error,
            icon: 'none'
          });
        }
      });
    },
	cancel(e){
		let gid = e.currentTarget.dataset.id;
	  request({
		url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=delFooter',
		method: 'post',
		data: {
		  key: this.key,
		  gid: gid
		}
	  }).then(res => {
		if (res.code == 200) {
			let {
				list
			} = this;
			let index = list.findIndex(el => el.gid == gid);
			list.splice(index, 1);
			this.setData({
				list
			});
		} else {
		  uni.showToast({
			title: res.datas.error,
			icon: 'none'
		  });
		}
	  });
	}

  }
};
</script>
<style>
page{
  background-color: #fff;
  width: 750rpx;
  margin: 0 auto;
}

.favorites {
  width: 100%;
  min-height: 100vh;
}

.del {
  height: 60rpx;
  line-height: 60rpx;
  text-align: right;
  padding: 0 30rpx;
  color: #f02323;
  font-size: 30rpx;
  background-color: #fff;
}

.goods_jingle{
	font-size: 24rpx;
	color: #5f5f5f;
	min-height: 68rpx;
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.list {
  padding: 0 20rpx;
  background-color: #fff;
}

.list .goods {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #e2e2e2;
  padding: 10rpx 0;
  position: relative;
}

.list .goods .img {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 212rpx;
  width: 212rpx;
  height: 212rpx;
}

.list .img image {
  width: 212rpx;
  height: 100%;
}

.goods .goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30rpx;
  padding-right: 30rpx;
  height: 212rpx;
}

.goods .goods-info .name {
  font-size: 26rpx;
  font-weight: bold;
  width: 100%;
  color: #333;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  box-sizing: border-box;
}

.goods .goods-info .price {
  color: #f02323;
  font-size: 28rpx;
}

.noorder {
  width: 100%;
}

.noorder .noorder_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10vh 0;
}

.noorder .noorder_content .img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #ddd;
  overflow: hidden;
  text-align: center;
}

.noorder .noorder_content .img image {
  width: 110rpx;
  height: 110rpx;
  margin-top: 20rpx;
}

.noorder .noorder_content text:nth-of-type(1) {
  font-size: 32rpx;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}

.noorder .noorder_content text:nth-of-type(2) {
  font-size: 26rpx;
  color: #666;
}

.noorder .noorder_content .btn {
  line-height: 60rpx;
  background-color: #fff;
  font-size: 26rpx;
  text-align: center;
  padding: 0 30rpx;
  border-radius: 10rpx;
  border: 1rpx solid #e3e5e9;
  margin-top: 30rpx;
}

.tj {
  background-color: #fff;
  margin-top: 100rpx;
}

.tj .tj-title {
  position: relative;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.tj-title::after, .tj-title::before {
  position: absolute;
  content: '...';
  font-size: 30rpx;
  line-height: 1;
  font-weight: normal;
  top: 40%;
  color: #666;
  transform: translateY(-50%);
}

.tj-title::after {
  left: 230rpx;
}

.tj-title::before {
  right: 230rpx;
}

.tj swiper {
  margin-top: 20rpx;
}

.tj .wrap {
  display: flex;
  align-items: center;
}

.tj .wrap .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(33vw - 20rpx);
  margin: 0 10rpx;
}

.tj .item .img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180rpx;
  height: 180rpx;
}

.tj .img image {
  width: 180rpx;
  height: 0;
}

.tj .name {
  width: 180rpx;
  color: #333;
  font-size: 26rpx;
  margin: 15rpx 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tj .price {
  width: 180rpx;
  color: #ba1418;
  font-size: 28rpx;
}

.cart-comment .cart-comment-title {
  margin: 41rpx 0 23rpx;
  text-align: center;
}

.cart-comment-title image {
  width: 427rpx;
  height: 48rpx;
}

.cart-comment .goods-list {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  box-sizing: border-box;
  padding: 0;
  background-color: transparent;
}

.cart-brand {
	margin: 41rpx 0 23rpx;
	text-align: center;
}

.cart-brand image {
	width: 427rpx;
	height: 48rpx;
}

.goods-list navigator {
  width: 345rpx;
  margin-bottom: 20rpx;
  border-radius: 14rpx;
  margin-left: 20rpx;
  overflow: hidden;
  background-color: #fff;
}

.goods-list .img {
  width: 345rpx;
  height: 345rpx;
}

.goods-list .img image {
  width: 100%;
  height: 100%;
}

.goods-list .goods-name {
  height: 85rpx;
  padding-top: 10rpx;
  line-height: 39rpx;
  color: #2d2d2d;
  font-size: 28rpx;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  padding: 10rpx 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.goods-list .price-wrap {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 0 20rpx 20rpx;
}

.price-wrap .price {
  color: #e1251b;
  font-size: 24rpx;
}

.price-wrap .price text {
  font-size: 38rpx;
  font-weight: bold;
}

.price-wrap .sale {
  margin-left: 10rpx;
  color: #949494;
  font-size: 24rpx;
}

.cancel-box{
  height: 22px;
  line-height: 21px;
  padding: 0 5px;
  color: #686868;
  border: 1px solid #686868;
  border-radius: 3px;
  image{
    width: 20px;
    height: 20px;
  }
}
.clearAll{
  padding: 2px 4px;
  border:1px solid #686868;
  border-radius: 3px;
  color: #000;
  font-size: 26rpx;
}
</style>