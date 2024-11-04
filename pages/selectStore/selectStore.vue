<template>
<!--pages/store/store.wxml-->
<view class="store">
   <map id="map" :scale="scale" :controls="controls" @controltap="controltap" :markers="markers" @markertap="markertap"  :longitude="longitude" :latitude="latitude" @regionchange="regionchange" enable-zoom="true" show-location :style="'width: 750rpx;height:' + StoreHeight + 'px'" v-if="showMap"></map>
    <!-- 可适配手机，使用rpx -->
    <cover-view class="cover_view" :style="'top:' + coverviewtop + 'rpx;'" @tap="controltap">
        <cover-image v-if="bigmap" :src="img_url+'site/enlarge.png'"></cover-image>
		<cover-image v-else :src="img_url+'site/narrow.png'"></cover-image>
    </cover-view>
    <!-- 门店信息 -->
    <view class="store_info" :style="'bottom:'+bottomSateArea">
        <view class="info_bg">
            <image :src="img_url + 'site/store_bg.png'"></image>
        </view>
        <view class="store_list">
            <view v-for="(item, index) in storeInfo" :key="index" :class="(index+1)==storeInfo.length?'store_pre store_pre1':'store_pre'">
                <view>
                    
					<view class="select_store_con">
						<image class="select_store" v-if="!item.selected" :src="img_url+'/store_not_select.png'" @click="selectStore(item)" mode=""></image>
						<image class="select_store" v-else :src="img_url+'/store_select.png'" mode=""></image>
						<view class="store_name">{{item.dian_name}}</view>
					</view>
                    <view class="store_con">
                        <image class="address" :src="img_url + 'site/address.png'" @tap="handleAddress" data-a="1" :data-lat="item.dian_lat" :data-lng="item.dian_lng"></image>
                        <view class="store_des">
                            <view class="store_adress" @tap="handleAddress" data-a="1" :data-lat="item.dian_lat" :data-lng="item.dian_lng">
                                <text>{{item.dian_address}}</text>
                                <text>{{$L('距您')}}{{item.juli}}</text>
                            </view>
                            <view class="store_phone">{{$L('联系电话：')}}{{item.dian_phone[0]}}</view>
                        </view>
                    </view>
                </view>
                <!-- <view class="line"></view> -->
                <!-- <image class="phone" @tap="handlePhone" :data-phone="item.dian_phone[0]" :src="img_url + 'site/phone.png'"></image> -->
            </view>
        </view>
    </view>
	<view class="confirm_btn" @click="confirm">
		{{$L('确定')}}
	</view>
	<view class="confirm_btn_white">
	</view>
</view>
</template>

<script>
var markers = [];

export default {
  data() {
    return {
      pn: 1,
      key: '',
      gid: '',
      //商品id,
      storeInfo: [],
      showMap: false,
      scale: 14,
      longitude: '',
      //默认定位经度
      latitude: '',
      //默认定位纬度
      markers: [],
      //地图标记点
      marker_latitude: '',
      marker_longitude: '',
      title: '',
      callout: [],
      //地图标记点的气泡
      isScale: false,
      circle: [{
        fillColor: '#F6E7DB',
        radius: 100
      }],
      img_url: getApp().globalData.img_url,
      StoreHeight: 0,
      //获取门店信息元素到页面的顶部的距离
      CoverViewHeight: 0,
      //控件的高度
      coverviewtop: 0, // 控件到页面顶部的top值
      controls: [],
	  bigmap:true,
	  bottomSateArea:getApp().globalData.bottomSateArea,//iphone手机底部一条黑线的高度
	  selected_store:''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('选择门店')
    });
    let that = this;
    that.setData({
      gid: options.gid
    });
    that.getStoreInfo();
    uni.getLocation({
      type: 'wgs84',
      //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {//使用wxwx.createMapContext('mapId', component)获取map上下文
    // this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  if(uni.getStorageSync('store_info')){
		  this.selected_store=uni.getStorageSync('store_info')
	  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    getStorHeight() {
      let that = this; //获取门店信息元素的top值
      uni.createSelectorQuery().select('.store_info').boundingClientRect(function (rect) {
        var StoreHeight = rect.top;
        that.setData({
          StoreHeight: StoreHeight
        });
      }).exec(); //获取控件的元素高度

      uni.createSelectorQuery().select('.cover_view').boundingClientRect(function (rect) {
        var CoverViewHeight = rect.height; 
        that.setData({
          CoverViewHeight: CoverViewHeight
        }); //控件到页面顶部的top值

        var coverviewtop = that.StoreHeight - that.CoverViewHeight;
        that.setData({
          coverviewtop
        });
      }).exec();
    },

    //获取门店信息
    getStoreInfo() {
      let that = this,
          bid = that.bid,
          key = uni.getStorageSync('token'),
          city_site_open = that.city_site_open;
      let data = {
        page: 10,
        pn: that.pn,
        key: key,
        gid: that.gid,
        isgaode: 0
      };

      if (city_site_open && bid != '0') {
        data.bid = bid;
      }

      uni.showLoading({
        title: that.$L('加载中'),
        icon: 'loading',
        duration: 800
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=goods&mod=get_dians_by_gid',
        method: 'GET',
        data,
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              storeInfo: res.data.datas.data,
              latitude: res.data.datas.lat,
              longitude: res.data.datas.lng
            });

            for (var i = 0; i < that.storeInfo.length; i++) {
              markers = markers.concat({
                iconPath: that.img_url+"dibiao_icon.png",
                id: that.storeInfo[i].id,
                callout: {
                  content: that.storeInfo[i].dian_address,
                  fontSize: '16',
                  padding: true,
                  color: '#444',
                  display: 'ALWAYS',
                  textAlign: 'center',
                  borderRadius: 15
                },
                latitude: that.storeInfo[i].dian_lat,
                longitude: that.storeInfo[i].dian_lng,
                width: 18,
                height: 36
              });
            }
            that.storeInfo.map(item=>{
				that.$set(item,'selected',false)
			})
			if(uni.getStorageSync('store_info')){
				that.storeInfo.map(item=>{
					if(uni.getStorageSync('store_info').id==item.id){
						item.selected=true
					}
				})
			}
            that.setData({
              markers: markers,
              latitude: that.storeInfo[0].dian_lat,
              longitude: that.storeInfo[0].dian_lng,
              showMap: true
            },()=>{
				that.getStorHeight();
			});
			
          }
        },
        error: function (err) {},
        complete: function () {
          uni.hideLoading();
        }
      });
    },
    //选择门店
	selectStore(storeItem){
		this.storeInfo.map(item=>{
			item.selected=false
		})
		storeItem.selected=true
		this.selected_store=storeItem
	},
    //点击定位地址
    handleAddress(e) {
      let that = this;
      let lat = e.currentTarget.dataset.lat;
      let lng = e.currentTarget.dataset.lng;
      that.setData({
        latitude: lat,
        longitude: lng
      });
    },

    //标识店移动触发
    regionchange(e) {
    },

    //点击标识点触发
    markertap(e) {
      let that = this;

      for (var i = 0; i < that.storeInfo.length; i++) {
        if (e.markerId == that.storeInfo[i].id) {
          this.setData({
            marker_latitude: that.storeInfo[i].dian_lat,
            marker_longitude: that.storeInfo[i].dian_lng,
            title: that.storeInfo[i].dian_address
          });
        }
      }

      uni.openLocation({
        latitude: Number(that.marker_latitude),
        longitude: Number(that.marker_longitude),
        name: that.title,
        scale: 28
      });
    },

    //点击控件触发 控制点击时间
    controltap(e) {
      let that = this;
      that.setData({
        isScale: !that.isScale,
        scale: that.isScale ? 16 : 12 // scale: isScale ? Number(that.scale) + 1 : Number(that.scale) - 1,

      });
      that.controls.map((item, index) => {
        item.iconPath = that.isScale ? that.img_url+"enlarge1.png" : that.img_url+"enlarge.png";
      });
      that.setData({
        controls: that.controls,
		bigmap:!that.bigmap
      }); // this.moveToLocation()
    },

    // 移动到自己位置
    moveToLocation: function () {
      let mpCtx = uni.createMapContext("map");
      mpCtx.moveToLocation();
    },

    /**
    * 还有地图标识，可以在name上面动手
    */
    //调起拨打电话功能
    handlePhone(e) {
      let phone = e.currentTarget.dataset.phone;
      uni.makePhoneCall({
        phoneNumber: phone //电话号码

      });
    },
	confirm(){
		if(!this.selected_store){
			uni.showToast({
				title:this.$L('请选择门店'),
				icon:'none'
			})
		}else{
			uni.setStorageSync('store_info',this.selected_store)
			uni.navigateBack()
		}
	}

  }
};
</script>
<style>
/* pages/store/store.wxss */
.store_info{
    width: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0rpx 0rpx 18rpx 2rpx rgba(51,51,51,0.1);
    opacity:0.95;
    border-radius:32rpx 32rpx 0rpx 0rpx;
    max-height: 824rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #FFFFFF;
	z-index: 99;
}
.info_bg{
    width: 100%;
    height: 198rpx;
    display: flex;
    align-items: center;
    padding: 0 14rpx 0 29rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #F6F6F6;
}
.info_bg image{
    width: 707rpx;
    height: 150rpx;
}
.store_list{
    width: 100%;
    overflow-y: scroll;
    max-height: 610rpx;
}
.store_pre{
    width: 100%;
    height: 226rpx;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #F6F6F6;
    display: flex;
    align-items: center;
}
.store_pre1 {
	border: none;
	margin-bottom: 72rpx;
}
.select_store_con{
	display: flex;
	align-items: center;
}
.store_name{
	margin-left: 29rpx;
    font-size:32rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    width: 518rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
	line-height: 32rpx;
}
.select_store{
	width: 33rpx;
	height: 33rpx;
}
.store_con{
    display: flex;
    margin-top: 30rpx;
	margin-left: 58rpx;
}
.address{
    width: 35rpx;
    height: 31rpx;
}
.store_des{
    display: flex;
    flex-direction: column;
    width: 564rpx;
    margin: 0 0 0 31rpx;
}
.store_adress{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:36rpx;
}
.store_adress text:nth-child(1){
    font-size:28rpx;
}
.store_adress text:nth-child(2){
    font-size: 26rpx;
    margin-left: 20rpx;
}
.store_phone{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:#999;
    margin-top: 19rpx;
}
.line{
    width: 1rpx;
    height: 166rpx;
    background: #000000;
    opacity: 0.05;
}
.phone{
    width: 57rpx;
    height: 57rpx;
    margin-left: 43rpx;
}
.cover_view{
    position: fixed;
    z-index: 10;
    width: 100rpx;
    height: 100rpx;
    /* top: 460rpx; */
    /* top: calc(50% - 50rpx); */
    /* bottom: 879rpx; */
    right: 0rpx;
}
.cover-image{
    width: 113prx;
    height: 113rpx;
    position: absolute;
    
}
.confirm_btn{
	    width: 690rpx;
	    height: 70rpx;
	    background: linear-gradient(45deg, #FB2D2D 0%, #FC572A 100%);
	    border-radius: 35rpx;
	    font-size: 28rpx;
	    font-family: PingFang SC;
	    font-weight: 500;
	    color: #FFFFFF;
	    line-height: 32rpx;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		position: fixed;
		bottom: 20rpx;
		left: 0;
		right: 0;
		z-index: 9999;
		margin: 0 auto;
		
}
.confirm_btn_white{
	background-color: white;
	height: 20rpx;
	width: 100%;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 9999;
	position: fixed;
}
.h50{
	height: 110rpx;
	width: 100%;
}
</style>