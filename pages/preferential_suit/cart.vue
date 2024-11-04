<template>
<view>
<block v-if="bl_id && gid && base_data && goods_list">

<!-- <view class="title">
优惠套装 <span>{{$L('￥')}}{{base_data.bl_discount_price}}</span><em>立省:{{$L('￥')}}{{base_data.sheng_price}}</em>
</view> -->

<!-- nav -->
<scroll-view class="combination_nav" scroll-x="true">
  <view v-for="(item, index) in bundling_array" :key="index" :class="'combination_nav_pre ' + (currentTargetId == item.id ? 'active' : '')" @tap="handleNav" :data-index="index" :data-id="item.id">{{item.name}}</view>
</scroll-view>
	


<view class="list">
  <view v-for="(goods_item, i) in list" :key="i" class="pre">
    <view class="pre_left">
      <navigator :url="'../goods_detail/goods_detail?gid=' + goods_item.id">
        <image :src="goods_item.image"></image>
      </navigator>
    </view>
    <view class="pre_right">
      <view class="goods_name">{{goods_item.name}}</view>
      <view class="goods_jingle">{{goods_item.goods_jingle}}</view>
      <view class="goods_spec">
        <text></text>
        <text>*1</text>
      </view>
      <view class="pre_price">
        <view class="bl_goods_price">
          <text>{{$L('¥')}}</text>
          <text>{{filters.toSplit(goods_item.price)[0]}}</text>.
          <text>{{filters.toSplit(goods_item.price)[1]}}</text>
         </view>
        <view class="old_price">{{$L('￥')}}{{goods_item.shop_price}}</view>
      </view>
    </view>
   </view>
</view>
 <view class="package_amount">
    <view class="package_amount_title"> {{$L('套餐金额：')}}</view>
    <view class="package_price">
      <text>{{$L('￥')}}</text>
      <text>{{filters.toSplit(package_price)[0]}}</text>.
      <text>{{filters.toSplit(package_price)[1]}}</text>
    </view>
  </view>
  <view class="preferential_amount">
    <view class="preferential_amount_title">{{$L('优惠金额')}}:</view>
    <view class="preferential_price">{{$L('￥')}}{{filters.toFix(preferential_price)}}</view>
</view>

<view class="all_amount">
  <view class="all_amount_price">
    <view class="all_amout_title">{{$L('合计：')}}</view>
    <view class="all_amout_price">
      <text>{{$L('￥')}}</text>
      <text>{{filters.toSplit(filters.toFix(all_amout_price))[0]}}</text>.
      <text>{{filters.toSplit(filters.toFix(all_amout_price))[1]}}</text>
    </view>
  </view>
  <view class="all_amount_btn1" @tap="goToPay">{{$L('立即购买')}}</view>
  <!-- <view class="all_amount_btn">
    <view class="add_cart">加入购物车</view>
    <view class="now_buy" bindtap='goToPay'>立即购买</view>
  </view> -->
</view>


<!-- <view class='other' wx:if="{{bundling_data.bundling_array.length}}">
  <view class='biaoti'>
    <span></span><em>其他套装</em><span></span>  
  </view>

  <view class="titlea" wx:for="{{bundling_data.bundling_array}}" wx:for-index="i" wx:for-item="bl_item">
      <view class='goodsBox'>
        <block wx:for="{{bundling_data.b_goods_array[bl_item.id]}}" wx:for-index="j" wx:for-item="b_goods_array_item">
          <navigator url="../goods_detail/goods_detail?gid={{b_goods_array_item.id}}">
            <image  style='width:130rpx;height:130rpx;' src='{{b_goods_array_item.image}}'></image>
          </navigator>
          <block wx:if="{{j != bundling_data.b_goods_array[bl_item.id].length - 1}}">
            <span>+</span>
          </block>
        </block>
      </view> 
      <view class='zhifu'>
        <p>组合价 <span>{{$L('￥')}}{{bl_item.price*1}}</span></p>
        <view data-bl_id="{{bl_item.id}}" bindtap='gmBtn'>立即购买</view>
      </view>
  </view>
</view> -->

<!-- <view class='js_btn'>
  <view class='yf'>应付:<span>{{$L('￥')}}{{base_data.bl_discount_price}}</span></view>
  <view bindtap='goToPay' class='ljzf'>立即支付</view>
</view> -->
</block>
<common :title="$L('优惠套装')"></common>
</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>

export default {
  data() {
    return {
      bl_id: 0,
      gid: 0,
      key: '',
      base_data: {},
      goods_list: {},
      bundling_data: {},
      b_goods_array: {},
      //内容区
      bundling_array: [],
      //头部
      currentTargetId: '',
      //当前id
      list: [],
      package_price: 0,
      //当前套餐金额
      preferential_price: 0,
      //当前优惠金额
      all_amout_price: 0,
      //当前合计金额
      currentTargetIndex: 0 //当前项

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('优惠套装')
    });
    var bl_id = options.bl_id;
    var gid = options.gid;
    let key = uni.getStorageSync('token');
    this.setData({
      key
    });

    if (bl_id && gid) {
      this.setData({
        'bl_id': bl_id,
        'gid': gid
      }); //获取套餐详情信息

      this.get_bundling_des(); // 获取当前优惠套装信息
      // this.get_bundling_data();
      // 获取 当前商品的 其他优惠套装信息
      // this.get_bundling_other_data();
    } else {
      // 缺少参数 跳转首页
      uni.switchTab({
        url: '../index/index'
      });
    }
  },
  methods: {
    //获取优惠套装信息
    get_bundling_des() {
      let that = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=goods&mod=getBundlindDataV2',
        data: {
          gid: that.gid,
          key: that.key
        },
        dataType: 'json',
        success: function (res) {
          if (res.data.code == 200) {
            let b_goods_array = res.data.datas.bundling_data.b_goods_array;
            let bundling_array = res.data.datas.bundling_data.bundling_array;
            that.setData({
              b_goods_array,
              bundling_array
            });
          }

          let {
            currentTargetIndex
          } = that;
          that.setData({
            currentTargetId: that.currentTargetId ? that.currentTargetId : that.bundling_array[0].id,
            all_amout_price: that.bundling_array[currentTargetIndex].total_amount,
            package_price: that.bundling_array[currentTargetIndex].price,
            //当前套餐金额
            preferential_price: that.bundling_array[currentTargetIndex].discount_amount //当前优惠金额

          });
          let list = that.b_goods_array[that.currentTargetId];
          that.setData({
            list
          });
        }
      });
    },

    //nav导航切换
    handleNav(e) {
      let that = this;
      that.setData({
        currentTargetId: e.currentTarget.dataset.id,
        currentTargetIndex: e.currentTarget.dataset.index
      });
      this.get_bundling_des();
    },
	
    // 优惠套装前往结算页
    gmBtn: function (e) {
      var bl_id = e.currentTarget.dataset.bl_id;
      ;
      uni.navigateTo({
        url: '../preferential_suit/cart?bl_id=' + bl_id + '&gid=' + this.gid
      });
    },
    // 去下单
    goToPay: function () {
      var that = this;
      var bl_id = that.currentTargetId;
      uni.navigateTo({
        url: '../confirm_order/confirm_order?bl_id=' + bl_id
      });
    }
  }
};
</script>
<style>
page{
  padding-bottom: 120rpx;
}
/* nav */
.combination_nav{
  width: 100%;
  white-space: nowrap;
  overflow:hidden;
  line-height: 60rpx;
  position: fixed;
  padding: 0 20rpx;
  box-sizing: border-box;
  height:90rpx;
  background:rgba(255,255,255,1);
  z-index: 10;
  text-align: left;
  border-bottom: 20rpx solid #F5F5F5;
}
.combination_nav_pre{
  display: inline-block;
  white-space: normal;
  text-align: center;
  margin-right: 60rpx;
  line-height: 90rpx;
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 32rpx;
  position: relative;
}
.combination_nav_pre:nth-last-of-type(1),.combination_nav .active:nth-last-of-type(1){
  margin-right: 0;
}
.combination_nav .active{  
  display: inline-block;
  white-space: normal;
  text-align: center;
  margin-right: 60rpx;
  color:rgba(251,27,27,1);
  font-weight: bold;
  line-height: 50rpx;
  font-size: 30rpx;
  font-family:PingFang SC;
  z-index: 20;
  border-bottom: 5rpx solid red;
}


.list{
  width: 100%;
  padding-top: 100rpx;
}
.other{
  width: 750rpx;
}
.biaoti{
  width: 100%;
  text-align: center;
  line-height: 96rpx;
  height: 96rpx;
  border-bottom:1px solid #eee;

}
.biaoti span{
  display: inline-block;
  width:67rpx;
  height: 1rpx;
  background:#ccc; 
  position: relative;
  bottom: 10rpx;
}
.biaoti em{
  margin: 0 22rpx;
}
.titlea{
  position: relative;
  border-bottom: 1rpx solid #eee;
  height:190rpx;
}
.goodsBox{
  display: flex;
  height: 130rpx;
  line-height: 130rpx;
  padding-left: 31rpx;
  padding-right: 84rpx;
  padding-top: 30rpx;
  color:#929292;
  width: 464rpx;
}
.goodsBox image{
  border: 1rpx solid #eee;
}
.zhifu{
  position: absolute;
  right:21rpx;
  top:32rpx;
  font-size:26rpx;
  text-align: right;
}
.zhifu p span{
  color: #F41919;
}
.zhifu view{
  margin-top: 25rpx;
  color: #F41919;
  border:1rpx solid #F41919;
  border-radius:17rpx;
  text-align: center;
  height: 34rpx;
  width: 127rpx;
  margin-left: 15rpx;
}
.js_btn{
  width: 718rpx;
  position: fixed;
  bottom: 0;
  background: #fff;
  padding-left:32rpx;
  height: 120rpx;
  line-height: 120rpx;
  font-size: 32rpx;
  border-top: 1rpx solid #ccc;
}
.yf{
  float: left;
}
.yf span{
  color: #F41919;
  }
  .ljzf{
    float: right;
    width: 293rpx;
    height: 120rpx;
    background: #F41919;
    color: #fff;
    font-size: 36rpx;
    text-align: center;
  }

.pre{
  display: flex;
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
}
.pre_left{
  width:294rpx;
  height:294rpx;
  border-radius:15rpx;
}
.pre_left image{
  width:294rpx;
  height:294rpx;
  border-radius:15rpx;
}
.pre_right{
  display: flex;
  flex-direction: column;
  width: 395rpx;
  margin-left: 20rpx;
  justify-content: space-between;
  padding: 20rpx 0;
  box-sizing:border-box;
}
.goods_name{
  width: 395rpx;
  font-size:28rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(45,45,45,1);
  line-height:39rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods_jingle{
  width: 395rpx;
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(101,101,101,1);
  line-height:40rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.goods_spec{
  display: flex;
  align-items: center;
}
.goods_spec text:nth-child(1){
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(153,153,153,1);
  line-height:39rpx;
  width: 385rpx;
  justify-content: space-between;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.goods_spec text:nth-child(2){
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(101,101,101,1);
  line-height:39rpx;
}
.pre_price{
  display: flex;
  align-items: flex-end;
}
.bl_goods_price{
  font-size:22rpx;
  font-family:PingFang SC;
  font-weight:600;
  color:rgba(251,27,27,1);
}
.bl_goods_price text:nth-child(2){
  font-size: 34rpx;
}
.old_price{
  font-size:20rpx;
  font-family:PingFang SC;
  font-weight:500;
  text-decoration:line-through;
  color:rgba(153,153,153,1);
  line-height:36rpx;
  margin-left: 9rpx;
}
.package_amount{
  display: flex;
  justify-content: flex-end;
  padding: 0 20rpx;
  box-sizing: border-box;
  margin: 20rpx 0;
}
.package_amount_title{
  font-size:30rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(45,45,45,1);
  line-height:32rpx;
}
.package_price{
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(252,28,28,1);
  line-height:32rpx;
}
.package_price text:nth-of-type(2){
  font-size:34rpx;
}
.preferential_amount{
  display: flex;
  justify-content: flex-end;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.preferential_amount_title{
  font-size:26rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(45,45,45,1);
  line-height:32rpx;
}
.preferential_price{
  font-size:20rpx;
  font-family:PingFang SC;
  font-weight:600;
  color:rgba(252,28,28,1);
  line-height:32rpx;
}
.all_amount{
  position: fixed;
  bottom: 0;
  width: 100%;
  height:98rpx;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 20px 0px rgba(86,86,86,0.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.all_amount_price{
  display: flex;
}
.all_amout_title{
  font-size:30rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(45,45,45,1);
  line-height:32rpx;
}
.all_amout_price{
  font-size:24rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(252,28,28,1);
  line-height:32rpx;
}
.all_amout_price text:nth-of-type(2){
  font-size: 34rpx;
  font-weight: bold;
}
.all_amount_btn{
  display: flex;
  align-items: center;
}
.add_cart{
  width:223rpx;
  height:70rpx;
  background:linear-gradient(45deg,rgba(255,122,24,1) 0%,rgba(254,161,14,1) 100%);
  border-radius:35rpx 0 0 35rpx;
  text-align: center;
  line-height: 70rpx;
  font-size:28rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
}
.now_buy{
  width:197rpx;
  height:70rpx;
  background:linear-gradient(45deg,rgba(252,45,45,1) 0%,rgba(253,87,43,1) 100%);
  border-radius:0 35rpx 35rpx 0;
  font-size:28rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  line-height:70rpx;
  text-align: center;
}
.all_amount_btn1{
  width:180rpx;
  height:60rpx;
  background:rgba(251,27,27,1);
  border-radius:30rpx;
  font-size:28rpx;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
  line-height:60rpx;
  text-align: center;
  margin-left: 20rpx;
}
</style>