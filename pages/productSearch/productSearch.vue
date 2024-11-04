<template>
<!--pages/productSearch/productSearch.wxml-->
<view class="shop_homepage">

    <view class="content">
		<!-- 占位状态栏 start -->
		<!-- #ifdef H5 || APP-PLUS -->
		<view class="fixed_top_status_bar"></view>
		<!-- #endif -->
		
		<!-- 占位状态栏 end -->
         <!-- 搜索 -->
        <view class="search1">
			<!-- #ifdef H5 || APP-PLUS  -->
			<image class="top_w_b" @tap="go_back" :src="img_url+'to_right.png'" mode="widthFix"></image>
			<!-- #endif -->
            <view class="search_input">
                <image :src="img_url+'shop_list_search.png'"></image>
                <input :placeholder="$L('搜索店铺内商品')" :value="searchVal" @input="searchInput" @confirm="search"></input>
                <image class="cancel" :src="img_url+'guanbi.png'" @tap="cancel" v-if="searchVal != ''"></image>
            </view>
            <view class="search_text" @tap="search">{{$L('搜索')}}</view>
        </view>		
        <!-- 店铺信息-->
        <view class="shop_des" v-if="show">
            <view class="des_con1'">
                <!-- 全部商品 -->
                <view class="all_commodities">
                    <view :class="'all_commodities_nav ' + (searchShow ? 'nav1' : '')">
                        <view class="comprehensive" @tap="commoditiesNav" data-index="0">
                            <text :class="'pre_title ' + (commodNavIdx == 0 ? 'active' : '')">{{$L('综合')}}</text>
                        </view>
                        <view :class="'sales_volume ' + (commodNavIdx == 1 ? 'active' : '')" @tap="commoditiesNav" data-index="1" data-isAscendingOrder="0">{{$L('销量')}}</view>
                        <view class="price" @tap="commoditiesNav" data-index="2">
                            <text :class="'pre_title ' + (commodNavIdx == 2 ? 'active' : '')">{{$L('价格')}}</text>
                            <view class="price_switch">
                                <image class="xiala_up" :src="commodNavIdx == 2 && isAscendingOrder == 1 ? img_url+'xiala_up1.png' : img_url+'xiala_up.png'"></image>
                                <image class="xiala_down" :src="commodNavIdx != 2 ? img_url+'xiala_down.png' : commodNavIdx == 2 && isAscendingOrder == 1 ? img_url+'xiala_down.png' : img_url+'xiala_down1.png'"></image>
							</view>
                        </view>
                        <view :class="'sales_volume ' + (commodNavIdx == 3 ? 'active' : '')" @tap="commoditiesNav" data-index="3">{{$L('人气')}}</view>
                        <view class="layout" @tap="layoutSwitch">
                            <image :src="grid_list ? img_url+'fenlei1.png' : img_url+'fenlei2.png'"></image>
                        </view>
                    </view>
                    <view :class="grid_list ? 'all_commodities_list' : 'list'" v-if="productList.length > 0">
                        <view v-for="(item, index) in productList" :key="index" class="list_pre" :data-gid="item.gid" @tap="goods_detail">
                            <view class="pre_img">
                                <image :src="item.goods_image_url" mode="aspectFit"></image>
                            </view>
                            <view class="pre_des">
                                <view class="des_name">{{item.goods_name}}</view>
                                <view class="des_info">{{item.goods_jingle}}</view>
                                <view v-for="(item1, index2) in item.limited_activities" :key="index2" class="time_limited">
                                    <view class="time_limited_discount" :style="'background:linear-gradient(to right,' + item1.color[0] + ',' + item1.color[1] + ');'">{{item1.name}}</view>
                                </view>
                                <view class="des_desc">
                                 	<view class="commodity_price"><text>{{$L('￥')}}</text><text>{{filters.toSplit(item.goods_price)[0]}}</text>.<text>{{filters.toSplit(item.goods_price)[1]}}</text></view>
                                    <text class="salenum" v-if="grid_list && item.goods_price < 999999.99">{{item.goods_salenum}}{{$L('人已付款')}}</text>
                                    <text class="salenum" v-if="!grid_list">{{item.goods_salenum}}{{$L('人已付款')}}</text>
                                </view>
                            </view>
                        </view>
                        <view class="is_more">{{hasmore ? $L('数据加载中...') : $L('数据加载完毕~')}}</view>
                    </view>
                    <view class="no_content" v-if="no_content_product && productList.length == 0">
                        <image :src="img_url + 'site/no_content.png'"></image>
                        <text>{{$L('暂无任何商品~')}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>

<script>

export default {
  data() {
    return {
      bid: '',
      vid: '',
      store_list: [],
      searchVal: '',
      //搜索框内的值
      searchList: [],
      show: false,
      productList: [],
      //全部商品列表
      pn: '1',
      //默认第一页
      commodNavIdx: '0',
      //商品列表nav默认第一项
      isAscendingOrder: 1,
      //是否升序
      grid_list: true,
      //是否是两列grid_list布局
      stc_id: '',
      //商品分类id
      stc_name: '',
      //商品分类的名称
      no_more: false,
      //没有更多数据了
      img_url: getApp().globalData.img_url,
      //图片地址
      hasmore: true,
      //有无更多
      no_content_product: false //没有商品
      ,
      city_site_open: "",
      searchShow: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('商品搜索')
    });
    let city_site_open = uni.getStorageSync('city_site_open');

    if (city_site_open) {
      let city_site_bind_id = uni.getStorageSync('city_site_bind_id');
      let vid = options.vid;
      let stc_id = options.stc_id;
      let stc_name = options.stc_name;

      if (stc_id) {
        this.setData({
          searchVal: stc_name,
          stc_id: stc_id,
          vid: vid,
          bid: city_site_bind_id,
          city_site_open: city_site_open
        });
        this.search();
      }

      this.setData({
        bid: city_site_bind_id,
        city_site_open: city_site_open,
        vid: vid,
        stc_id: stc_id
      });
    }else{
		let vid = options.vid;
		let stc_id = options.stc_id;
		let stc_name = options.stc_name;
		
		if (stc_id) {
		  this.setData({
		    searchVal: stc_name,
		    stc_id: stc_id,
		    vid: vid
		  });
		  this.search();
		}
		
		this.setData({
		  vid: vid,
		  stc_id: stc_id
		});
	}

    if (options.searchVal != undefined && options.searchVal) {
      this.setData({
        searchVal: options.searchVal,
        show: true,
        vid: options.vid
      });
      this.getProductList();
    }
  },

  // 加载更多
  onReachBottom(e) {
    if (this.hasmore) {
      this.getProductList();
    }
  },

  methods: {
    //获取滚动条的当前位置 
    onPageScroll: function (e) {
      if (e.scrollTop > 150) {
        this.setData({
          searchShow: true
        });
      } else {
        this.setData({
          searchShow: false
        });
      }
    },
	go_back(){
	  uni.navigateBack({});
	},

    //清空搜索输入框内容
    cancel() {
      this.searchVal = '';
      this.setData({
        searchVal: '',
        show: false
      });
      this.getProductList();
    },

    // 获取全部商品列表
    getProductList() {
      let that = this,
          bid = that.bid,
          key = uni.getStorageSync('token'),
          city_site_open = that.city_site_open,
          commodNavIdx = that.commodNavIdx;
      let data = {
        page: 10,
        pn: that.pn,
        key: commodNavIdx == 0 ? '' : commodNavIdx == 1 ? '3' : commodNavIdx == 2 ? '2' : commodNavIdx == 3 ? '4' : '',
        order: that.isAscendingOrder == 1 ? "1" : '0',
        //排序：1降序，0升序
        stc_id: that.stc_id || '',
        vid: that.vid
      };

      if (city_site_open && bid != '0') {
        data.bid = bid;
      }

      if (this.searchVal) {
        data.keyword = this.searchVal;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=store&mod=goods_list',
        method: 'GET',
        data,
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.datas.goods_list.length == 0) {
				let productList = res.data.datas.goods_list;
				that.setData({
					no_content_product: true,
					productList
				});
            } else {
              //如果是初次加载，直接赋值，否则数据追加
              if (that.pn == 1) {
                let productList = res.data.datas.goods_list;
                that.setData({
                  productList
                });
              } else {
                let productList = res.data.datas.goods_list;
                that.setData({
                  productList: that.productList.concat(productList)
                });
              }

              if (res.data.hasmore) {
                that.pn++;
                that.setData({
                  hasmore: true
                });
              } else {
                that.setData({
                  hasmore: false
                });
              }
            }
          }
        },
        error: function (err) {},
        complete: function () {
          uni.hideLoading();
        }
      });
    },

    //商品列表tab切换
    commoditiesNav(e) {
      //切换时回到页面的顶部
      if (uni.pageScrollTo) {
        //判断这个方法是否可用
        uni.pageScrollTo({
          scrollTop: 0
        });
      } else {
        uni.showModal({
          title: this.$L('提示'),
          content: this.$L('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
        });
      }

      let commodNavIdx = e.currentTarget.dataset.index;
      this.setData({
        commodNavIdx,
        pn: '1'
      });

      if (commodNavIdx == 2) {
        this.setData({
          isAscendingOrder: this.isAscendingOrder == 1 ? '0' : '1'
        });
      }

      this.getProductList();
    },

    //布局切换
    layoutSwitch() {
      this.setData({
        grid_list: !this.grid_list
      });
    },

    // 商品详情
    goods_detail(e) {
      let gid = e.currentTarget.dataset.gid;

      if (gid) {
        uni.navigateTo({
          url: '/pages/goods_detail/goods_detail?gid=' + gid
        });
      }
    },

    //获取搜索框内的值
    searchInput(e) {
      this.setData({
        searchVal: e.detail.value,
        pn: '1'
      });
    },

    //搜索
    search() {
      this.setData({
        pn: '1',
        show: true
      });
      this.getProductList();
    },

    getmore() {
      let that = this;

      if (!that.flag && that.search_hasmore) {
        that.search();
      }
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
/* pages/productSearch/productSearch.wxss */
page{
	/* width: 100%; */
	height: 100%;
	background: #F5F5F5;
	width: 750rpx;
	margin: 0 auto;
}
.shop_homepage {
    width: 750rpx;
}
.status_bar{
	height: var(--status-bar-height);
	/* width: 100%; */
	width: 750rpx;
	background: #FFFFFF;
	
}
.fixed_top_status_bar {
	position: fixed;
	/* #ifdef APP-PLUS */
	height: var(--status-bar-height);
	/* #endif */
	/* #ifndef APP-PLUS */
	height: 0;
	/* #endif */
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
	background: #fff;
}
.content{
    /* width: 100%; */
	width: 750rpx;
    /* height: 754rpx; */
    /* background: black; */
    background-size: 100%;
}
/* 搜索框 */
.search{
	width: 750rpx;
    /* width: 100%; */
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25rpx 0 55rpx;
    box-sizing: border-box;
    position: fixed;
    top: 0;
	top: var(--status-bar-height);
    z-index: 10;
}
.search_input{
    width:580rpx;
    height:65rpx;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
    background:rgba(248,248,248,1);
    border-radius:33px;
}
.search_input1{
    width:580rpx;
    height:65rpx;
    background:rgba(255,255,255,1);
    border:2rpx solid rgba(255,12,12,1);
    border-radius:33rpx;
}
.search_input image{
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
}
.search_input .cancel{
    width: 47rpx;
    height: 47rpx;
}
.search input{
    width: 500rpx;
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(148,148,148,1);
    line-height:32rpx;
}
.more{
    width: 50rpx;
    height: 50rpx;
}

/* 搜索框 */
/* #ifdef MP-WEIXIN*/
.search1{
    /* width: 100%; */
	width: 750rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35rpx;
    box-sizing: border-box;
    position: fixed;
	top: 0;
    z-index: 10;
    background: #FFFFFF;
   }
   	/* #endif */
	/* #ifdef H5 || APP-PLUS*/
   .search1{
	   /* width: 100%; */
	   width: 750rpx;
	   height: 88rpx;
	   display: flex;
	   align-items: center;
	   justify-content: space-between;
	   padding: 0 35rpx;
	   box-sizing: border-box;
	   position: fixed;
	   top: var(--status-bar-height);
	   z-index: 10;
	   background: #FFFFFF;
	   padding:0  15rpx 0 0;
   }
   /* #endif */
   
.search1 .search_input{
    width:570rpx;
    height:65rpx;
    border:2rpx solid rgba(225,37,27,1);
    border-radius:33rpx;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
    background: #FFFFFF;
}
.search1 .search_input image{
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
}
.search1 .search_input .cancel{
    width: 47rpx;
    height: 47rpx;
}
.search1 input{
    width: 500rpx;
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(148,148,148,1);
    line-height:32rpx;
}
.search1 .search_text{
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
/* 店铺详情 */
.shop_des{
    width: 100%;
    color:rgba(255,255,255,1);
    /* padding-top: 70rpx; */
    padding-top: 62rpx;
    box-sizing: border-box;
    background-size: 100%;
}
.des_top{
    width: 100%;
    height: 449rpx;
}
.shop_info{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 31rpx 20rpx 39rpx;
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
.info_right{
    width:110rpx;
    height:50rpx;
    background:linear-gradient(-50deg,rgba(252,28,28,1) 0%,rgba(255,104,3,1) 100%);
    box-shadow:0rpx 3rpx 8rpx 0rpx rgba(252,28,28,0.2);
    border-radius:25rpx;
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.info_right1{
    width:110rpx;
    height:50rpx;
    border:1rpx solid rgba(255,255,255,1);
    box-shadow:0rpx 3rpx 8rpx 0rpx rgba(252,28,28,0.2);
    border-radius:25rpx;
    font-size:26rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.select_nav{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nav_item{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.nav_item image{
    width: 64rpx;
    height: 64rpx;
    margin-bottom: 10rpx;
}
.nav_item text{
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:32rpx;
}
.nav1{
    position: fixed;
    top: 88rpx;
    z-index: 5;
}
.des_con{
    margin-top: -145rpx;
    width: 100%;
    height: 100%;
    background:rgba(255,255,255,1);
    border-radius:15rpx;
    position: absolute;
    z-index: 5;
}
.des_con1{
    margin-top: 0;
    width: 100%;
    height: 100%;
    /* background:rgba(255,255,255,1); */
    background: #F5F5F5;
    border-radius:15rpx;
    position: absolute;
    z-index: 5;
}
.all_commodities{
    width: 100%;
    box-sizing: border-box;
    padding-top: 26rpx;
    background: #F5F5F5;
    position: absolute;
}
.all_commodities_nav{
    /* width: 100%; */
	width: 750rpx;
    height: 90rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 40rpx;
    box-sizing: border-box;
    background: #FFFFFF;
}
.comprehensive{
    display: flex;
    align-items: center;
}
.comprehensive .pre_title{
    font-size:28rpx;
    font-family:PingFang SC;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
.all_commodities_nav .active{
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(243,30,30,1);
    line-height:32rpx;
}
.comprehensive image{
    width: 14rpx;
    height: 9rpx;
    margin-left: 10rpx;
}
.sales_volume{
    font-size:28rpx;
    font-family:PingFang SC;
    color:rgba(45,45,45,1);
    line-height:32rpx;
    display: flex;
    align-items: center;
}
.price{
    display: flex;
}
.price .pre_title{
    font-size:28rpx;
    font-family:PingFang SC;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
.price .active{
    font-size:30rpx;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(243,30,30,1);
    line-height:32rpx;
}
.price_switch{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 10rpx;
}
.price_switch image{
    width: 14rpx;
    height: 9rpx;
}
.price_switch image:nth-child(1){
    margin-bottom: 5rpx;
}
.sales_volume{
    font-size:28rpx;
    font-family:PingFang SC;
    color:rgba(45,45,45,1);
    line-height:32rpx;
}
.layout{
    box-sizing: border-box;
    position: relative;
    padding: 0 26rpx 0 0;
    box-sizing: border-box;
}
.layout::before{
    content: "";
    width: 1rpx;
    height:40rpx;
    position: absolute;
    top: 5rpx;
    left: -26rpx;
    background: rgba(187,187,187,1);
}
.layout image{
    width: 50rpx;
    height: 50rpx;
}

/* 全部商品列表 */
/* list布局 */
.list{
    width: 100%;
	width: 750rpx;
    background: #F5F5F5;
    padding: 20rpx 20rpx 102rpx;
    box-sizing: border-box;
}
.list .list_pre{
    width:100%;
    background:rgba(255,255,255,1);
    border-radius:15rpx 0 0 15rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
}
.list .pre_img{
    width:294rpx;
    height:294rpx;
    border-radius:15rpx 0 0 15rpx;
}
.list .pre_img image{
    width:294rpx;
    height:294rpx;
    border-radius: 15rpx 0 0 15rpx;
}
.list .pre_des{
    width: 394rpx;
}
.time_limited{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.list .pre_des .time_limited_discount{
    /* width:106rpx; */
    padding: 0 11rpx;
    height:30rpx;
    /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
    border-radius:15rpx;
    font-size:22rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18rpx;
}
.list .list_pre .des_desc{
    margin-top: 43rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.list .list_pre .des_info{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(102,102,102,1);
    width: 310rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    height: 35rpx;
    margin-top: 20rpx;
}
/* grid网格布局 */
.all_commodities_list{
    background: #F5F5F5;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
	width: 750rpx;
}
.product1{
    margin-top: 90rpx;
}
.all_commodities_list .list_pre{
    width:345rpx;
    background:rgba(255,255,255,1);
    border-radius:15rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
}
.all_commodities_list .list_pre:nth-of-type(2n){
    margin-right: 0;
}
.all_commodities_list .list_pre .pre_img{
    width:345rpx;
    height:345rpx;
    border-radius:15rpx;
}
.all_commodities_list .list_pre .pre_img image{
    width:345rpx;
    height:345rpx;
    border-radius:15rpx 15rpx 0 0;
}
.all_commodities_list .pre_des{
    padding: 20rpx;
    height: 272rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.list .list_pre .pre_des{
    padding: 20rpx 0 20rpx 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.list_pre .des_name{
    width:310rpx;
    font-size:28rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(45,45,45,1);
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    font-weight: bold;
}
.all_commodities_list .list_pre .des_info{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(102,102,102,1);
    width: 310rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    height: 39rpx;
    margin-top: 9rpx;
}
.discount{
    display: flex;
}
.list_pre .time_limited_discount{
    /* width:106rpx; */
    padding: 0 11rpx;
    height:30rpx;
    /* background:linear-gradient(45deg,rgba(255,108,0,1) 0%,rgba(255,192,83,1) 100%); */
    border-radius:15rpx;
    font-size:22rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:39rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15rpx;
}
.all_commodities_list .list_pre .des_desc{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 31rpx;
}
.list_pre .des_desc .commodity_price{
    font-size:34rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(252,28,28,1);
    font-weight: bold;
}
.commodity_price{
    font-size:34rpx;
    font-family:PingFang SC;
    color:rgba(252,28,28,1);
    line-height:32rpx;
    font-weight: bold;
  }
  .commodity_price text:nth-child(1),.commodity_price text:nth-last-child(1){
    font-size: 22rpx;
  }
.list_pre .des_desc .salenum{
    font-size:22rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(153,153,153,1);
}
/* 无商品 */
.no_content{
    margin: 167rpx auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.no_content image{
    width: 200rpx;
    height: 200rpx;
}
.no_content text{
    font-size:24rpx;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:32rpx;
    margin-top: 30rpx;
}
.no_more{
    padding-bottom: 105rpx;
    color:#BBBBBB;
    font-size: 28rpx;
    z-index: 5;
    text-align: center;
    background: #F8F8F8;
}
  /* 加载更多，没有更多 */
  .is_more{
    /* width: 100%; */
	width: 750rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    color: #999999;
    line-height: 22rpx;
    margin: 10rpx 0 30rpx;
    background: #F5F5F5;
  }
  
  .top_w_b {
  	height: 34rpx;
  	width: 34rpx;
  	margin: 0 0 0 10rpx ;
  	display: block;
  }	
</style>