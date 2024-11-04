<template>
<view>
<scroll-view scroll-x class="nav" v-if="list.length" :style="{backgroundImage:'url('+ bgImg +')'}">
  <view :class="'nav_item ' + (active=='0'?'on':'')" @tap="changeNav" data-id='0'>
    <text>{{$L('首页')}}</text>
  </view>
  <view v-for="(item, index) in list" :key="index" :class="'nav_item ' + (active==item.id?'on':'')" @tap="changeNav" :data-id="item.id">
    <text>{{item.class_name}}</text>
  </view>
</scroll-view>

<view class="clearfix" :hidden="active!=''">
   <DiyPage :sourceData="home_info" v-if="home_info.length"></DiyPage> 
</view>

<view class="goods_list" v-if="goodsList.length">
  <navigator v-for="(item, index) in goodsList" :key="index" class="goods_item" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid + '&type=ladder'" hover-class="none">
    <view class="item_left">
      <image :src="item.sld_pic" mode="aspectFit"></image>
    </view>
    <view class="item_right">
      <view class="goods_name">
		<view  class="goods_name_img" >
          <image :src="icon" mode="widthFix"></image>
		</view>
		 <text>{{item.goods_name}}</text>
	 </view>
      <view class="goods_info">
        <!-- <view class="goods_price">
          <text>{{$L('￥')}}<text>{{item.goods_price}}</text></text>
          <text>已拼{{item.sales}}件</text>
        </view> -->
		<view class="price">
			<view class="small_price">{{$L('￥')}}<text class="big_price">{{item.goods_price.split('.')[0]}}</text>.<text class="small_price" style="margin-right:10rpx;">{{item.goods_price.split('.')[1]}}</text></view>
			<text class="num">{{$L('￥')}}80.00</text>
		</view>
		<view class="group_now">
			<view class="group_now_left" :style="{backgroundImage:'url(' +img_url + 'addons/ladder_regiment.png)'}">{{$L('马上拼')}} ></view>
			<view class="group_now_right">{{$L('已团')}}{{item.sales}}{{$L('件')}}</view>
		</view>
        <!-- <view class="goods_btn">去拼团
          <image :src="img_url+'addons/ico_011.png'" mode="widthFix"></image>
        </view> -->
      </view>
    </view>
  </navigator>
</view>
<view class="empty" v-if="!goodsList.length && !loading">
  <image :src="img_url+'active1.png'"></image>
  <text>{{$L('该分类暂无商品')}}</text>
</view>
<view class="top_wrap" v-show="isShowTopBtn == true">
	<image :src="topImg" mode="" @click="top"></image>
</view>
<common :title="$L('阶梯团')"></common>
</view>
</template>

<script>
import request from "../../../utils/request"; 
export default {
  data() {
    return {
      list: [],
      active: '0',
      goodsList: [],
      autoplay: true,
      interval: 5000,
      duration: 1000,
      indicatorDots: true,
      loading: true,
      img_url: getApp().globalData.img_url ,//图片地址
      home_info: "",
	  bgImg:getApp().globalData.img_url+'addons/ladder_bg.png',
	  icon:getApp().globalData.img_url+this.$L('addons/icon2.png'),
	  topImg:getApp().globalData.img_url+'addons/top.png',
	  isShowTopBtn:false,
	  ifOnShow:false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('阶梯团')
    });
    this.getClassList();
    this.getIndexData();
  },

  onReachBottom() {
    if (this.hasmore) {
      this.getGoodsList();
    }
  },
  // onHide(){
	 //  this.ifOnShow = true
  // },
  // onShow(){
	 //  if(this.ifOnShow){
		//   this.getClassList();
		//   this.getIndexData();
	 //  }
  // },
  methods: {
    // 获取装修数据
    getIndexData() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=index_data&sld_addons=pin_ladder',
        success: res => {
          let home_info_data = res.data.datas.tmp_data;
          this.setData({
            home_info: home_info_data
          });
        }
      });
    },

    // 获取阶梯团分类
    getClassList() {
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=index&sld_addons=pin_ladder',
        success: res => {
          if (res.data.status == 200) {
            let list = res.data.data;
            this.setData({
              list: list // active: list.length > 0 ? list[0].id : ''

            });
            this.getGoodsList();
          }
        }
      });
    },

    // 获取商品列表
    getGoodsList() {
      let {
        active,
        goodsList
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=data&sld_addons=pin_ladder',
        data: {
          tid: active*1>0?active:'',
          page: 10,
          pn: this.pn
        },
        success: res => {
          if (res.data.code == 200) {
            let list = res.data.datas.goods;

            if (this.pn == 1) {
              this.setData({
                goodsList: list,
                loading: false
              });
            } else {
              this.setData({
                goodsList: goodsList.concat(list)
              });
            }

            if (res.data.hasmore) {
              this.pn++;
            } else {
              this.hasmore = false;
            }
          }
        }
      });
    },

    // 
    changeNav(e) {
      let id = e.currentTarget.dataset.id;
      let {
        active
      } = this;
      if (active == id) return;
      this.setData({
        active: id,
        loading: true
      });
      this.pn = 1;
      this.hasmore = true;
      this.getGoodsList();
    },
	// 获取滚动距离
	onPageScroll(e){ //根据距离顶部距离是否显示回到顶部按钮
		if(e.scrollTop>600){ //当距离大于600时显示回到顶部按钮
			this.isShowTopBtn = true
		}else{ //当距离小于600时隐藏回到顶部按钮
			this.isShowTopBtn = false
		}
	},
	// 回到顶部
	top(){
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
	}
  }
};
</script>
<style>
page {
  background-color: #F5F5F5;
  padding-top: 80rpx;
  width: 750rpx;
  margin: 0 auto;
}
/* #ifdef H5 */
page {
  padding-top: 0rpx;
}

/* #endif */

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 750rpx;
  height: 88rpx;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  z-index: 9999;
  background-size: 100% 100%;
}

.nav_item {
  display: inline-block;
  line-height: 90rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  padding: 0 30rpx;
  overflow: hidden;
}

.nav_item.on {
  font-weight: bold;
  font-size: 32rpx;
}

.goods_list{
	padding:0 20rpx;
	padding-bottom: 20rpx;
}
.goods_list .goods_item {
  width:100%;
  height:310rpx;
  display:flex;
  background-color: #fff;
  border-radius: 15rpx;
  box-sizing: border-box;
  margin-top:20rpx;
  padding:20rpx;
}

.goods_item .item_left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 270rpx;
  height: 270rpx;
  margin-right:20rpx;
}

.goods_item .item_left image {
  width:100%;
  height:270rpx;
  background-color: #f7f7f7;
  border-radius: 15rpx;
}

.goods_item .item_right {
  display: flex;
  min-height: 200rpx;
  flex-direction: column;
  justify-content: space-around;
  position:relative;
}

.goods_item .item_right .goods_name {
  width:370rpx;
  font-size: 28rpx;
  line-height:44rpx;
  font-weight: 600;
  color:#2D2D2D;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: -20px;
}
.goods_name_img{
	display: inline-block;
	box-sizing: border-box;
}

.goods_item .item_right .goods_name image{
  display: inline-block;
  width: 122rpx;
  height:31rpx;
 margin-bottom: -5rpx;
  margin-right:10rpx;

}

.item_right .goods_info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods_info .price {
	display: flex;
	align-items: center;
	font-weight: bold;
	color:#FC1C1C;
	margin-top: 20rpx;
	margin-right:10rpx;
	position: absolute;
	bottom:82rpx;
	left:0;
}
.goods_info .small_price{
	font-size:24rpx;
}
.goods_info .big_price{
	font-size:34rpx;
}
/* .goods_info .goods_price>text:nth-child(1) {
  color: #EE1B21;
  font-size: 34rpx;
}

.goods_info .goods_price>text text{
  font-size: 50rpx;
}

.goods_info .goods_price text:nth-child(2) {
  color: #808080;
  font-size: 24rpx;
  margin-left: 30rpx;
  margin-top: 20rpx;
} */
	.group_now{
		position:absolute;
		bottom:10rpx;
		left:0;
		// width:270rpx;
		height:50rpx;
		line-height: 50rpx;
		border-radius: 25px;
		display:flex;
		align-items: center;
		border:1rpx solid #FFA63D;
		box-sizing: border-box;
	}
	.group_now .group_now_left{
		font-size:26rpx;
		color:#fff;
		width:160rpx;
		text-align: center;
		border-radius: 25rpx 0 0 25rpx;
		/* background:#FE9A22; */
		background-size: 100% 100%;
		box-sizing: border-box;
		margin-left:-1rpx;
	}
	.group_now .group_now_right{
		min-width:122rpx;
		text-align: center;
    padding: 0 10rpx;
		font-size:22rpx;
		color:#FE9A22;
		font-weight: 400;
		box-sizing: border-box;
	}
	.goods_info .price .num {
		font-weight: 500;
		color: #9A9A9A;
		font-size: 24rpx;
		text-decoration: line-through;
	}
	.goods_info .goods_btn {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 172rpx;
	  height: 64rpx;
	  border-radius: 32rpx;
	  color: #fff;
	  font-size: 28rpx;
	  background: #ED6307;
	}

.goods_info .goods_btn image{
  width: 10rpx;
  height: 18rpx;
  margin-left: 15rpx;
  transform: rotate(180deg);
}

.empty{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
}

.empty image{
  width:372rpx;
  height: 263rpx;
  margin-bottom: 30rpx;
}

.empty text{
  color: #333;
  font-size: 28rpx;
}
.top_wrap{
	position: fixed;
	right:46rpx;
	bottom:66rpx;
	width:85rpx;
	height:85rpx;
	left: 0;
	right: 0;
	margin: 0 auto;
	transform: translateX(286rpx);
}
.top_wrap image{
	width:85rpx;
	height:85rpx;
}
</style>