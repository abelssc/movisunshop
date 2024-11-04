<template>
<view class="store_introduction">
	<view class="content">
		<view class="store_con" :style="'background-image:url( ' + store_banner + ');background-size:100% 100%;background-repeat:no-repeat'">
            <!--  店铺详情  -->
			<view class="info_left" v-if="vender_detail">
				<image class="avat" :src="vender_detail.store_label" mode="aspectFill"></image>
				<view class="info_des">
					<view class="info_top">
						<text>{{vender_detail.store_name}}</text>
						<text v-if="vender_detail.is_own_shop == 1">{{$L('自营')}}</text>
					</view>
					<view class="info_bot">
						<image :src="img_url+'renqizhi.png'"></image>
						<text>{{$L('人气：')}}{{vender_detail.store_collect}}</text>
					</view>
				</view>
			</view>
            <!-- 店铺二维码 -->
            <view class="store_code">
                <view class="store_code_top">
                    <text>{{$L('店铺二维码')}}</text>
                    <image :src="img_url+'erweima.png'" @tap="handleShare"></image>
                </view>
                <view class="store_code_des">
                    <view class="des_pre">
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_desccredit.text:''}}</text>
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_desccredit.credit:''}}</text>
                    </view>
                    <view class="des_pre">
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_servicecredit.text:''}}</text>
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_servicecredit.credit:''}}</text>
                    </view>
                    <view class="des_pre">
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_deliverycredit.text:''}}</text>
                        <text>{{vender_detail.store_credit?vender_detail.store_credit.store_deliverycredit.credit:''}}</text>
                    </view>
                </view>
            </view>
            <!-- 公司相关 -->
            <view class="company_related">
                <view class="related_pre">
                    <text>{{$L('公司名称')}}</text>
                    <text>{{vender_detail.store_company_name ? vender_detail.store_company_name : ''}}</text>
                </view>
                <view class="related_pre">
                    <text>{{$L('公司所在地')}}</text>
                    <text>{{vender_detail.area_info ? vender_detail.area_info : ''}}</text>
                </view>
                <view class="related_pre">
                    <text>{{$L('开店时间')}}</text>
                    <text>{{vender_detail.open_time ? vender_detail.open_time : ''}}</text>
                </view>
                <view class="related_yewu">
                    <text>{{$L('主营商品')}}</text>
                    <text>{{vender_detail.store_zy ? vender_detail.store_zy : ''}}</text>
                </view>
            </view>
		</view>
	</view>
    <!-- 遮罩层 -->
    <view class="mask" catchtouchmove="preventTouchMove" v-if="modalDlg" @tap="close"></view>
    <!-- 二维码分享弹框 -->
    <view class="modalDlg" v-if="modalDlg">
        <text>{{vender_detail.store_name}}</text>
        <text>{{$L('邀请好友来扫一扫分享店铺给TA')}}</text>
        <image :src="vender_detail.share_img"></image>
    </view>

</view>
</template>

<script>

export default {
  data() {
    return {
      bid: '',
      vid: '',
      store_list: [],
      vender_detail: '',
      //店铺详情
      modalDlg: false,
      //模态框
      img_url: getApp().globalData.img_url,
      //图片地址
      store_banner: '', //店铺首页banner图
      city_site_open: "",
      searchList: [],
      show: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('店铺介绍')
    });
    let city_site_open = uni.getStorageSync('city_site_open');

    if (city_site_open) {
      let city_site_bind_id = uni.getStorageSync('city_site_bind_id');
      let vid = options.vid;
      this.setData({
        bid: city_site_bind_id,
        city_site_open: city_site_open,
        vid: vid
      });
    }

    this.venderDetail(); //店铺详情
  },
  methods: {
    // 商铺详情
    venderDetail(e) {
      let key = uni.getStorageSync('token');
      let that = this;
      let {
        vid
      } = that;
      let client=''
	  // #ifdef MP
	  client='wx_xcx'
	  // #endif
      if (vid) {
        let url = getApp().globalData.ser_url + '/index.php?app=store&mod=store_detail';
        uni.request({
          url: url,
          method: 'GET',
          data: {
            vid,
            key,
			client
          },
          success: function (res) {
            if (res.data.code == 200) {
              let vender_detail = res.data.datas;
              that.setData({
                vender_detail: vender_detail,
                store_banner: vender_detail.store_banner
              });
            }
          },
          error: function (err) {
          }
        });
      }
    },

    //点击二维码分享
    handleShare(e) {
      this.setData({
        modalDlg: true
      });
    },

    // 禁止屏幕滚动
    preventTouchMove: function () {},

    //关闭弹框
    close(e) {
      this.setData({
        modalDlg: false
      });
    },

    back() {
      this.setData({
        searchList: [],
        show: false
      });
      this.searchPn = 1;
      this.search_hasmore = true;
    }

  }
};
</script>
<style>
/* pages/storeIntroduction/storeIntroduction.wxss */
.store_introduction{
    width: 100%;
    height: 100%;
    background: #F5F5F5;
}
.content{
    width: 751rpx;
    height: 100%;
    background-size: 100%;
    background: #F5F5F5;
    position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
.store_top{
    width: 100%;
    height: 47rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 18rpx;
    box-sizing: border-box;
    position: fixed;
    top: 0;
}
.store_top text{
    font-size:36rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:32rpx;
}
.store_top image{
    width: 48rpx;
    height: 40rpx;
    margin-left: 239rpx;
}
.store_con{
    width: 100%;
    height: 566rpx;
    padding-top: 40rpx;
    background: #F8F8F8;
    padding-left: 21rpx;
    box-sizing: border-box;
}
.info_left{
    width: 100%;
    display: flex;
    align-items: center;
}
.info_left .avat{
    width:80rpx;
    height:80rpx;
    border-radius:50%;
    margin-right: 16rpx;
}
.info_des{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
}
.info_top{
    display: flex;
    align-items: center;
}
.info_top text:nth-of-type(1){
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:32rpx;
    margin-right: 20rpx;
}
.info_top image{
    width: 40rpx;
    height: 40rpx;
    margin-right: 14rpx;
}
.info_top text:nth-of-type(2){
    width:60rpx;
    height:30rpx;
    background:rgba(252,28,28,1);
    border-radius:15rpx;
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height: 30rpx;
    text-align: center;
}
.info_bot{
    display: flex;
    align-items: center;
    margin-top: 13rpx;
}
.info_bot image{
    width: 40rpx;
    height: 40rpx;
    margin-right: 8rpx;
}
.info_bot text{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:32rpx;
}
.store_code{
    width:710rpx;
    height:283rpx;
    background:rgba(255,255,255,1);
    border-radius:15rpx;
    margin: 30rpx 0 20rpx;
}
.store_code_top{
    /* width: 100%; */
    height: 89rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #F2F2F2;
    border-radius: 15rpx 15rpx 0 0;
}
.store_code_top text{
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
.store_code_top image{
    width: 35rpx;
    height: 35rpx;
}
.store_code_des{
    width: 100%;
    height: 193rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25rpx 0;
    box-sizing: border-box;
}
.des_pre{
    display: flex;
    align-items: center;
    padding-left: 20rpx;
    box-sizing: border-box;
}
.des_pre text:nth-child(1){
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(102,102,102,1);
    line-height:32rpx;
}
.des_pre text:nth-child(2){
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:#FE811C;
    line-height:32rpx;
    margin-left: 200rpx;
}
.company_related{
    width:710rpx;
    /* height:476rpx; */
    padding-bottom: 29rpx;
    background:rgba(255,255,255,1);
    border-radius:15rpx;
}
.related_pre{
    /* width: 100%; */
    height: 89rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left:20rpx;
    padding-right: 20rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #F2F2F2;
}
.related_pre text:nth-child(1){
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
.related_pre text:nth-child(2){
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:32rpx;
    width: 500rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    text-align: right;
}
.related_yewu{
    display: flex;
    flex-direction: column;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.related_yewu text:nth-child(1){
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(45,45,45,1);
    line-height:32rpx;
    display: flex;
    height: 88rpx;
    padding: 32rpx 0 0 0;
    box-sizing: border-box;
}
.related_yewu text:nth-child(2){
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:36rpx;
}
.mask{
    width:750rpx;
    height:100%;
    position:fixed;
    top:0;
    left:0;
	right: 0;
	margin: 0 auto;
    background:#000;
    z-index:9000;
    opacity:0.5;
}
/* 弹出层 */
.modalDlg{
    width:620rpx;
    height:650rpx;
    background:rgba(255,255,255,1);
    border:1px solid rgba(187,187,187,1);
    border-radius:15px;
    position:fixed;
    top:359rpx;
    left:0;
    right:0;
    z-index:9999;
    margin:0 auto;
    display: flex;
    flex-direction: column;
    align-items:center;
}
.modalDlg text:nth-child(1){
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(45,45,45,1);
    line-height:32rpx;
    margin: 48rpx 0 20rpx;
}
.modalDlg text:nth-child(2){
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(102,102,102,1);
    line-height:32rpx;
}
.modalDlg image{
    width:388rpx;
    height:389rpx;
    margin-top: 59rpx;
}

</style>