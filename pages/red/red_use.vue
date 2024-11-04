<template>
<view style="background-color: #f5f5f5;">
<common :title="$L('商品分类')"></common>
<view id="red-wrapper">
    <div class="bbctouch-main-layout">
        <div class="bbctouch-sel-box" style="padding: 0 10px;background-color: white;">
            <!-- <input type="radio" checked name="red_id" value="0" id="red_id_null"></input> -->
            <label class="big_row_radio" for="red_id_null" v-if="currentcheck === 'none' || currentcheck === ''">{{$L('暂不使用优惠券')}}<span style="background:#fff; background-size: 70%;border-color: #c53b3b;"><image style="width: 90%;height: 90%;" :src="img_url+'ok.png'"></image></span></label>
            <label class="big_row_radio" for="red_id_null" data-id="none" @tap.stop="select_red_item" v-else>{{$L('暂不使用优惠券')}}<span></span></label>
        </div>
        <div class="bbctouch-red-list">
        	<ul class="bbctouch-tickets" id="red-list">

	        <block v-if="red">
	        	<li v-for="(reditem, index) in red" :key="index" class="ticket-item">
			        <!-- <input type="radio" name="red_id" :value="index" :id="'red_id_' + index"></input> -->
			        <view class="circle_radio a" :for="'red_id_' + index" :data-id="index" @tap.stop="select_red_item">
			            <div class="item_top" style="position: relative;">
			                <s v-if="reditem.red_type == 2"></s>
			                <span class="red_h1"><em>{{reditem.redinfo_money}}</em> {{$L('元')}}</span>
			                <span class="red_h2">
			                	<em>
			                	<block v-if="reditem.redinfo_money == reditem.redinfo_full">
			                		{{reditem.redinfo_full}}{{$L('元直减')}}
			                	</block>
			                	<block v-else>
			                		{{$L('满')}}{{reditem.redinfo_full}}{{$L('减')}}{{reditem.redinfo_money}}
			                	</block>
			                	</em>
			                	{{reditem.redinfo_start_text}}-{{reditem.redinfo_end_text}}
			                </span>
			                <span class="red_h4 flex_row_center_center" style="background:#fff;border: 1px solid #fc1c1c;" v-if="currentcheck === index"><image style=" width: 40rpx; height: 40rpx; border-radius: 50%;padding-left: 7rpx;padding-top: 9rpx;" :src="img_url+'ok.png'"></image></span>
			                <span class="red_h4" style="background:#fff;border: 1px solid #fc1c1c;" v-else></span>
			            </div>
			        </view>
			        <p>{{reditem.str}}</p>
			    </li>
	        </block>
	        <block v-else>
	        	<div class="bbctouch-norecord red">
			        <images :src="img_url+'nothave.png'" width="50%"></images>
			        <dl>
			            <dt>{{$L('暂无优惠券')}}</dt>
			        </dl>
			    </div>
	        </block>

		    </ul>
        </div>
        <div class="pickup-bomb-btn" @tap.stop="confirm_red"><a href="javascript:void(0)">{{$L('确定')}}</a></div>
    </div>

</view>
</view>
</template>

<script>
import { objToStrMap, jsonToString, mapToJson, strMapToObj, jsonToMap, stringToJson } from "../../utils/common";

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      out_base_url: getApp().globalData.view_url,
      key: '',
      red: {},
      currentcheck: 'none'
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('选择优惠券')
    });
    var key = uni.getStorageSync('token'); // jsonToString(mapToJson(objToStrMap(options)));
    var store_key_red_name = 'red_list_confrim';
    var store_key_current = 'current_confrim';
    options.current = uni.getStorageSync(store_key_current);
    options.red = uni.getStorageSync(store_key_red_name);

    if (options.current >= 0 || options.current == 'none') {
      this.setData({
        currentcheck: options.current
      });
    }

    if (options.red) {
      this.setData({
        red: options.red
      });
    } //获取token  如果没有跳转登录注册页 否则进入个人中心


    var key = uni.getStorageSync('token');

    if (key) {
      //将可以存到data里
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    }
  },
  methods: {
    // 选择优惠券
    select_red_item(e) {
      var reditem_id = e.currentTarget.dataset.id;
       this.currentcheck = reditem_id
    },
    // 确认选择的优惠券
    confirm_red(e) {
      var that = this;
      var currentcheck = that.currentcheck; //最后将数据存缓存

      uni.setStorageSync('use_red', currentcheck);

      if (currentcheck >= 0 || currentcheck == 'none') {
        var currentredCon = that.red;
        uni.setStorageSync('use_red_con', currentredCon);
      } else {
        uni.setStorageSync('use_red_con', '');
      } //返回确认订单页面


      uni.navigateBack({
        delta: 1
      });
    }
  }
};
</script>
<style>
/* pages/red/red_use.wxss */
@import "../templates/wxss/red.css";
a{
	text-decoration: none;
}
em{
	font-style: normal;
}
</style>