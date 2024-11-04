<template>
<view :class="'voucher-item ' + ((type==1 && info.reduser_use!=0)?'disable':'')">
  <view class="voucher-top">
    <view class="price">{{$L('¥')}}{{info.redinfo_money}}
     
    </view>
    <view class="info">
      <text v-if="!info.redinfo_full || info.redinfo_money>=info.redinfo_full">{{$L('无门槛优惠券')}}</text>
      <text v-else>{{$L('满')}}{{info.redinfo_full}}{{$L('减')}}{{info.redinfo_money}}</text>
      <text>{{info.redinfo_start_text}}~{{info.redinfo_end_text}}</text>
    </view>
    <view>
      <navigator hover-class="none" :url="'/pages/goods_list/goods_list?red_id=' + info.redinfo_id" class="use" v-if="type==1 && info.reduser_use==0">
        <view class="btn">{{$L('去使用')}}</view>
      </navigator>

      <view class="ling" v-if="type==2">
        <view class="status">{{info.prent?(info.prent==100?$L('已抢完'):$L('已抢')+info.prent+'%'):$L('已枪0%')}}</view>
        <view class="pro-wrap">
          <view class="pro" :style="'width: ' + info.prent + '%'"></view>
        </view>
		
		<view v-if="info.prent==100 ||info.have*1>=info.red_rach_max*1" :class="'btn ' + ((info.prent==100 || info.have*1>=info.red_rach_max*1)?'dis':'')" :data-id="info.id" >
		{{info.prent==100?$L('已抢完'):(info.have < info.red_rach_max?$L('领取'):$L('已领'))}}
		</view>
		
        <view v-if="!(info.prent==100 ||info.have*1>=info.red_rach_max*1)" :class="'btn ' + ((info.prent==100 || info.have*1>=info.red_rach_max*1)?'dis':'')" :data-id="info.id" @tap="reveiveVoucher">
		{{info.prent==100?$L('已抢完'):(info.have < info.red_rach_max?$L('领取'):$L('已领'))}}
        </view>
      </view>
	  
    </view>
</view>
    <view class="voucher-bottom">
      <text>{{info.str}}</text>
    </view>
  </view>
  </view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Number,
      default: 1 // 1：展示  2： 领券

    }
  },
  methods: {
    reveiveVoucher(e) {
      let id = e.currentTarget.dataset.id;
      this.$emit('reveive', {
        detail: {
          id: id
        }
      });
    }

  }
};
</script>
<style>
/* component/voucher/voucher.wxss */
.voucher-item{
  height: 280rpx;
  margin: 20rpx;
  border-radius: 30rpx;
  overflow: hidden;
  font-size: 26rpx;
}

.voucher-item .voucher-top{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 190rpx;
  padding: 0 30rpx;
  background: linear-gradient(45deg,#FF8580,#EA5165);
  color: #fff;
  border-bottom: 2rpx dashed #fff;
}

.voucher-item .voucher-top .price{
  font-size: 50rpx;
  font-weight: bold;
  // width: 150rpx;
}

.voucher-item .voucher-top .price text{
  font-size: 28rpx;
  font-weight: normal;
}

.voucher-item .voucher-top .info{
  flex: 0 0 290rpx;
  display: flex;
  flex-direction: column;
}

.voucher-item .voucher-top .btn{
  height: 60rpx;
 /* line-height: 60rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  background-color: #f9ccd1;
  font-size: 28rpx;
  color: #ec5667;
  border-radius: 8rpx;
}

.voucher-item .voucher-top::after,.voucher-item .voucher-top::before{
  position: absolute;
  content: '';
  bottom: -10rpx;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #fff;
  z-index: 2;
}

.voucher-item .voucher-top::after{
  left: -12rpx;
}

.voucher-item .voucher-top::before{
  right: -12rpx;
}

.voucher-item .voucher-bottom{
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 20rpx;
  background: linear-gradient(to right,#d6706b,#c44654);
  color: #84292b;
} 

.voucher-item .voucher-bottom text{
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.voucher-item.disable .voucher-top{
  background: linear-gradient(45deg,#c1cdd8,#a2adbe);
}

.voucher-item.disable .voucher-bottom{
  background: linear-gradient(to right,#a2adbe,#c1cdd8);
  color: #5e6679;
} 

.ling{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ling .status{
  color: #fff;
  font-size: 22rpx;
  line-height: 30rpx;
}

.ling .pro-wrap{
  margin: 15rpx 0;
  width: 140rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background-color: #eaaa6c;
  overflow: hidden;
}

.ling .pro-wrap .pro{
  height: 12rpx;
  width: 0;
  border-radius: 6rpx;
  background-color: #e57f11;
}

.voucher-item .ling .btn{
  width: 140rpx;
  padding: 0;
  text-align: center;
  background-color: #e6cd10;
} 

.voucher-item .ling .btn.dis{
  background-color: #ccc;
  color: #999;
}
</style>