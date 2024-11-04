<template>
<view>
<scroll-view scroll-x class="nav" v-if="list.length" :style="{backgroundImage:'url('+ bgImg +')'}">
  <view :class="'nav_item ' + (active=='0'?'on':'')" @tap="changeNav" data-id="0">
    <text>{{$L('首页')}}</text>
  </view>
  <view v-for="(item, index) in list" :key="index" :class="'nav_item ' + (active==item.id?'on':'')" @tap="changeNav" :data-id="item.id">
    <text>{{item.class_name}}</text>
  </view>
</scroll-view>

<view class="goods_list" v-if="goodsList.length">
  <navigator v-for="(item, index) in goodsList" :key="index" class="goods_item" :url="'/pages/goods_detail/goods_detail?gid=' + item.gid + '&type=presale'" hover-class="none">
    <view class="item_left">
      <image :src="item.pre_pic" mode="" style="width:294rpx;height:294rpx;"></image>
    </view>
    <view class="item_right">
      <text class="goods_name">{{item.goods_name}}</text>
      <view class="goods_info">
        <view class="goods_price">
			<view class="now_price">
				<text class="small_price">{{$L('￥')}}</text><text class="big_price">{{item.pre_sale_price.split('.')[0]}}.</text><text class="small_price">{{item.pre_sale_price.split('.')[1]}}</text>
			</view>
			<view class="old_price">{{$L('￥')}}{{item.goods_price}}</view>
        </view>
      </view>
	  <view class="presale_btn_wrap">
		  <view class="presale_num_wrap">
		  	<image :src="iconImg" mode="" class="iconImg"></image>
		  	<text>{{$L('已预定')}}{{item.pre_total_num}}{{$L('人')}}</text>
		  </view>
	  	<view class="goods_btn">{{$L('立即预定')}}</view>
	  </view>
    </view>
  </navigator>
</view>
<view class="empty" v-if="!goodsList.length && !loading">
  <image :src="img_url+'index/empty.png'"></image>
  <text>{{$L('该分类暂无商品')}}</text>
</view>
<view class="top_wrap" v-show="isShowTopBtn == true">
	<image :src="topImg" mode="" @click="top"></image>
</view>
<common :title="$L('预售')" :gids="gids" v-if="gids.length"></common>
</view>
</template>

<script>
// addons/pages/presaleIndex.js
const app = getApp();
import request from "@/utils/request"; 
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
      img_url: app.globalData.img_url,
      loading: true,
      home_info: "",
	  pn: 1,
	  hasmore: true,
	  isShowTopBtn:false,
	  bgImg:getApp().globalData.img_url+'addons/presale_bg.png',
	  iconImg:getApp().globalData.img_url+'addons/icon4.png',
	  topImg:getApp().globalData.img_url+'addons/top.png',
	  gids:[]
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('预售')
    });
    this.getClassList();
    this.getIndexData();
  },

  onReachBottom() {
    if (this.hasmore) {
      this.getGoodsList();
    }
  },

  methods: {
	bigPrice(val){
		return val.split('.')[0]
	},
	smallPrice(val){
		return val.split('.')[1]
	},
    // 获取装修数据
    getIndexData() {
      request({
        url: app.globalData.ser_url + '/index.php?app=index&mod=index_data&sld_addons=presale',
      }).then(res=>{
		  let home_info_data = res.datas.tmp_data;
		  this.setData({
		    home_info: home_info_data
		  });
	  });
    },

    // 获取预售分类
    getClassList() {
      request({
        url: app.globalData.ser_url + '/index.php?app=goods&mod=getclasslist&sld_addons=presale',
      }).then(res=>{
		  if (res.status == 200) {
		    let list = res.list;
		    this.setData({
		      list: list // active: list.length > 0 ? list[0].id : ''
		  
		    });
		    this.getGoodsList();
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
        url: app.globalData.ser_url + '/index.php?app=goods&mod=index&sld_addons=presale',
        data: {
          class_id: active*1>0?active:'',
          page: 10,
          pn: this.pn
        },
        success: res => {
          if (res.data.status == 200) {
            let list = res.data.data.list;
                let gids = [];
                res.data.data.list.forEach(el => {
                	gids.push(el.gid);
                });
                this.setData({
                	gids
                });
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

            if (res.data.data.ismore.hasmore) {
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
		})
	}
  }
};
</script>
<style>
/* addons/pages/presaleIndex.wxss */
page {
	background-color: #F5F5F5;
  padding-top: 82rpx;
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
  width: 750rpx;
  height: 88rpx;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  z-index: 9999;
  right: 0;
  margin: 0 auto;
}

.nav_item {
  display: inline-block;
  line-height: 90rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  padding: 0 20rpx;
  
}

.nav_item.on {
  font-size: 30rpx;
}

.nav_item.on text {
  font-weight: bold;
  font-size: 32rpx;
  display: inline-block;
  padding: 0 10rpx;
  line-height: 50rpx;
}

.goods_list {
  padding: 0 20rpx;
  background-color: white;
}

.goods_list .goods_item {
  height:334rpx;
  display: flex;
  align-items: center;
  border-bottom:1rpx solid #F2F2F2;
}
.goods_list navigator:nth-last-child(1){
	border-bottom:none;
}
.goods_item .item_left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 294rpx;
  height:294rpx;
}

.goods_item .item_left image {
  width: 294rpx;
  height:294rpx;
  border-radius: 15rpx;
}

.goods_item .item_right {
  flex: 1;
  display: flex;
  min-height: 200rpx;
  flex-direction: column;
  margin-left: 20rpx;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 20rpx;
  box-sizing: border-box;
  position: relative;
}

.goods_item .item_right .goods_name {
  margin-top:43rpx;
  font-size: 28rpx;
  color:#2D2D2D;
  font-weight: 600;
  line-height: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.item_right .goods_info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods_info .goods_price{
	display:flex;
	align-items: flex-end;
	position:absolute;
	bottom:100rpx;
}
.now_price{
	color:#FE006D;
	font-weight: bold;
}
.now_price .small_price{
	font-size:24rpx;
}
.now_price .big_price{
	font-size:34rpx;
}
.goods_price .old_price{
	color:#999;
	font-size:24rpx;
	text-decoration: line-through;
	margin-left:10rpx;
	padding-bottom: 4rpx;
}
.presale_btn_wrap{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50rpx;
	color: #333;
	font-size: 24rpx;
	border-radius: 25rpx;
	position:absolute;
	bottom:40rpx;
	left:0;
}
.presale_num_wrap{
	display: flex;
	align-items: center;
	height: 46rpx;
	color:#333333;
	font-size:25rpx;
	border-radius: 25rpx 0 0 25rpx;
	border:1rpx solid #A92DC9; 
	padding-right: 40rpx;
	padding-left: 20rpx;
	white-space:nowrap;
}
.presale_num_wrap text{
  width: 180rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.presale_num_wrap .iconImg{
	width: 29rpx;
	height: 34rpx;
	margin-right:10rpx;
}
.goods_btn {
  min-width: 140rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 25rpx 25rpx 25rpx;
  color: #fff;
  font-size: 26rpx;
  background: linear-gradient(45deg, #A92DC9 0%, #FE006D 100%);
  margin-left:-30rpx;
}

.empty{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
}

.empty image{
  width: 200rpx;
  height: 200rpx;
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
}
.top_wrap image{
	width:85rpx;
	height:85rpx;
}
</style>