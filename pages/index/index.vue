<template>
	<view class="content">
		<!-- 占位状态栏 start -->
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"></view>
		<!-- #endif -->
		<!-- <view class="fixed_top_status_bar" ></view> -->
		<!-- 占位状态栏 end -->
		<!-- #ifdef APP-PLUS -->
		<view class="privacy_policy_model" v-if="privacyPolicyModel" @touchmove.stop.prevent="moveHandle">
			<view class="privacy_model" @touchmove.stop.prevent="moveHandle">
				<view class="privacy_model_title">{{$L('用户隐私政策')}}</view>
				<scroll-view class="privacy_policy" scroll-y="true" @touchmove.stop.prevent="moveHandle">
					<rich-text :nodes="privacyPolicyHtml"></rich-text>
				</scroll-view>
				<view class="privacy_model_confirm" @click="confirmPrivacy">{{$L('同意，继续使用')}}</view>
				<view class="privacy_model_cancel" @click="cancelPrivacy">{{$L('不同意，退出APP')}}>></view>
			</view>
		</view>
		<!-- #endif -->
		<view class="homepage" v-if="!siteClose">
			<block v-if="not_data">
				<view class="fixed_top_status_bar" :hidden="isshow==0"></view>
				<header class="main fixed">
					<div class="header-wrap" id="sousuo_header">
						<div :class="'ss_header_bg ' + (isshow==1?'bgshow_top':'bghide_top')" :style="'background: #' + headerBgColor + ';'"></div>
						<div class="htsearch-wrap with-home-logo">
							<view class="city_sel" v-if="city_site_open" @click.stop="chooseCity">
								<text style="color: #000">{{ area_name ? area_name : $L('全国')}}</text>
								<view class="img">
									<image :src="img_url+'more_site.png'" mode="widthFix"></image>
								</view>
							</view>
							<input disabled="true" @tap.stop="go_search" type="text" :class="'htsearch-input ' + (hastm==1?'inputtm_top':'inputntm_top') + ' ' + (city_site_open?'':'big')"
							 value='' id="keyword" :placeholder="$L('搜索商品')"></input>
							<a class="search-btn" @tap.stop="go_search">
								<image style="width:75%;height:75%;" :src="img_url+'3s.png'"></image>
							</a>
						</div>
					</div>
				</header>
				<view class="not_city_data">
					<image :src="img_url+'not_city_data.png'"></image>
					<view class="no-data" v-if="!not_data_type">
						<text>{{$L('该城市暂未装修~')}}</text>
						<view class="time" v-if="is_back_master == 1">
							<text>{{city_time_out}}</text>{{$L('秒后页面自动跳转至主站！')}}
							<view @tap="goMainSite">{{$L('去主站')}}
								<image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
					<text v-if="not_data_type">{{$L('首页还没有装修~')}}</text>
				</view>
			</block>
			<block v-else>
				<view>
					<view class="fixed_top_status_bar"></view>
					<header class="main fixed">
						<div class="header-wrap" id="sousuo_header">
							<div :class="'ss_header_bg ' + (isshow==1?'bgshow_top':'bghide_top')" :style="'background: #' + headerBgColor + ';'"></div>
							<div class="htsearch-wrap with-home-logo">
								<view class="city_sel" v-if="city_site_open" @click.stop="chooseCity">
									<text>{{area_name}}</text>
									<view class="img">
										<image :src="img_url+'more.png'" mode="aspectFit"></image>
									</view>
								</view>
								<input disabled="true" @tap.stop="go_search" type="text" :class="'htsearch-input ' + (hastm==1?'inputtm_top':'inputntm_top') + ' ' + (city_site_open?'':'big')"
								 value='' id="keyword" :placeholder="$L('搜索商品')"></input>
								<a class="search-btn" @tap.stop="go_search">
									<image style="width:75%;height:75%;" :src="img_url+'3s.png'"></image>
								</a>
							</div>
						</div>
					</header>
				</view>
<!-- v-if='home_info' -->
				<NewDiy @changeGids='changeGids' :city_site_open='city_site_open' :deco_info="home_info" :city="area_name" :is_show_top="true" :home_is_show_top_cat="home_is_show_top_cat" ref="diyPage"></NewDiy>
				
			</block>
		</view>
		<view v-if="siteClose" class="center">
			<block data-type="template" data-is="entry" data-attr="...siteCloseInfo">
				<view :class="'h2w h2w-' + theme">
					<view class="h2w__main">
						<!--<import src="./renderTemplate.wxml"></import>-->
						<block v-for="(item, index) in child" :key="index">
							<template is="m0" :data="item"></template>
						</block>
					</view>
				</view>
			</block>
		</view>
		<!-- 开屏框 start -->
		<view class="open_screen" v-if="isCookie == true && home_page_img.length > 0 && home_page_img[0].imgUrl">
			<view :style="{ width: width + 'rpx', 'height': height + 'rpx' }"  class="open_screen_con" @click="gotoGoods_detail">
				<view class="con_img" @click.stop="close_openScreen">
					<image :src="openscnImg"></image>
				</view>
				<image class="open_screen_con_img" :src="home_page_img[0].imgUrl" mode="widthFix"></image>
			</view>
		</view>
		<!-- 开屏框 end -->
		<common :title="$L('首页')" :gids="gids" v-if="gids.length"></common>
	</view>
</template>

<script>
	import privacyPolicy from "../../utils/privacyPolicy.js";
	var amapFile = require("../../libs/amap-wx.js");
	var myAmapFun = new amapFile.AMapWX({
		key: getApp().globalData.key
	});
	import {linkTo,getSceneParam,UpdateCart} from '@/utils/common.js'
	import NewDiy from '../../component/NewDiy/NewDiy.vue'
	export default {
		data() {
			return {
				home_is_show_top_cat: true,//是否显示顶部分类，默认显示
				indicatorDots: true,
				userInfo: {},
				botnav: 'index',
				isshow: 0,
				hastm: 0,
				lp: 0,
				not_data: false,
				// 分站是否有数据
				city_site_open: false,
				// 城市分站是否打开
				area_name: '',
				stop_load: 0,
				site_name: this.$L('商城首页'),
				img_url: getApp().globalData.img_url,
				not_data_type: '',
				share_img: '',
				gids: [],
				// 统计的gid
				city_time_out: 3,
				siteClose: false,
				// 网站是否关闭
				siteCloseInfo: '',
				// 网站关闭信息
				headerBgColor: '',
				home_info: '',
				has_more: "",
				is_back_master: "",
				client:'' ,//客户端类型
				home_page_img:[] , //首页开屏图列表
				isCookie: false, //开屏图数据
				openscnImg: getApp().globalData.img_url+'index/close_screen.png',
				height: 100,
				width: 100,
				uuid:'',
				privacyPolicyHtml:'', //隐私政策协议的富文本
				privacyPolicyModel:true,
				isFirst:true,
        siteFlag:false
			};
		},

		components: {
			NewDiy
		},
		props: {},
		onShow() {
      uni.setTabBarItem({
      	index: 0,
      	text: this.$L('首页')
      })
      uni.setTabBarItem({
      	index: 1,
      	text: this.$L('分类')
      })
      uni.setTabBarItem({
      	index: 2,
      	text:this.$L('发现')
      })
      uni.setTabBarItem({
      	index: 3,
      	text: this.$L('购物车')
      })
      uni.setTabBarItem({
      	index: 4,
      	text: this.$L('我的')
      })
      if(this.siteFlag==false){
        uni.setNavigationBarTitle({
            title: this.$L('商城首页')
        }); 
      }
      if(uni.getStorageSync('curLangs')){
        if(uni.getStorageSync('curLangs')!=uni.getStorageSync('curLang')){
          uni.setNavigationBarTitle({
              title: this.$L('商城首页')
          }); 
          this.load_tmp_data();
          uni.setStorageSync('curLangs',uni.getStorageSync('curLang'))
        }
      }
			this.getHeaderColor()
			if(uni.getStorageSync('cityInfo')){
				this.setCityInfo(uni.getStorageSync('cityInfo').bid, uni.getStorageSync('cityInfo').city_site_area_name, uni.getStorageSync('cityInfo').city_site_site_id)
			    uni.removeStorage({
			    	key:'cityInfo'
			    })
			}
			// #ifdef APP-PLUS
			let privacyPolicyHtml = uni.getStorageSync('privacyPolicy');
			if(privacyPolicyHtml){
				this.privacyPolicyModel = false;
			}
			// #endif
			UpdateCart();	//更新购物车数据
		},
		
		onLoad: function(options) {
      this.getTitle()
			/**
			*渠道来源统计
			* @ww 11-14
			*/
		   // #ifdef APP-PLUS
		   this.privacyPolicyHtml=privacyPolicy.user_privacy_policy_content;
		   let privacyPolicyHtml = uni.getStorageSync('privacyPolicy');
		   if(privacyPolicyHtml){
		   	this.privacyPolicyModel = false;
		   }
		   // #endif
			// #ifdef MP
			if (getSceneParam(decodeURIComponent(options.scene),'channel_id')) {
			     wx.setStorage({
			      key: 'channel',
			      data: getSceneParam(decodeURIComponent(options.scene),'channel_id'),
			    })
			    }
			// #endif
			// #ifdef H5
			if (options.s_channel) {
				uni.setStorage({
					key: 'channel',
					data: options.s_channel
				});
			}
			// #endif
			if (options.id) {
				uni.setStorage({
					key: 'channel',
					data: options.id
				});
			}
			if (options.site) {
        this.siteFlag = true
				this.siteCloseHandle(options);
			} else {
				// uni.showLoading({
				// 	title: '加载中'
				// });
				this.check_city_site_open();
			}
			let cookievalue = uni.getStorageSync('cookie');
			if(cookievalue == ''){
				this.isCookie = true;
				this.$setCookie();
			}else{
				this.isCookie = false;
			}

			// 获取用户唯一标识UUID(规则：客户端类型+下划线+36位唯一字符串uuid)
			
			
			let key = uni.getStorageSync('token');
			let uuid = uni.getStorageSync('uuid');
			
			if (key) {
				this.setData({
					key: 'key'
				});
			} else if (!uuid) {
				let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app
			
				uni.setStorageSync('uuid', uuid);
			} else {
				let uuid = uni.getStorageSync('uuid');
				this.setData({
					uuid
				});
			}

			this.initData();
			this.load_tmp_data();
			// #ifdef H5
			this.loadScrpit();
			// #endif
		},
		onReachBottom() {
			this.$refs.diyPage.$refs.menuTab.getMoreData();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(options) {
			let {
				share_img
			} = this;
			return {
				title: this.site_name,
				path: '/pages/index/index',
				imageUrl: share_img ? share_img : this.img_url + "index-share.jpeg"
			};
		},
		onShareTimeline: function(options) {
			let {
				share_img
			} = this;
			return {
				title: this.site_name,
				path: '/pages/index/index',
				imageUrl: share_img ? share_img : this.img_url + "index-share.jpeg"
			};
		},
		methods: {
      getTitle(){
        uni.request({
        	url: getApp().globalData.ser_url + '/index.php?app=index&mod=index_title',
        	success: res => {
        		if (res.data.code == 200) {
        			uni.setStorageSync('curLang',res.data.datas.lang_type)
        			uni.setStorageSync('curLangs',res.data.datas.lang_type)
              getApp().globalData.curLang =res.data.datas.lang_type
              uni.setTabBarItem({
              	index: 0,
              	text: this.$L('首页')
              })
              uni.setTabBarItem({
              	index: 1,
              	text: this.$L('分类')
              })
              uni.setTabBarItem({
              	index: 2,
              	text:this.$L('发现')
              })
              uni.setTabBarItem({
              	index: 3,
              	text: this.$L('购物车')
              })
              uni.setTabBarItem({
              	index: 4,
              	text: this.$L('我的')
              })
        		}
        	}
        });
      },
			changeGids(gids){
				this.gids=gids
			},
			loadScrpit(){
			  var script = document.createElement('script');
			  script.src = "https://webapi.amap.com/maps?v=1.4.15&key="+getApp().globalData.amap_h5_key+"&callback=mapInit";
			  document.body.appendChild(script);
			},
			initData() {
				this.getHeaderColor();
			},
			//阻止模态框下页面滚动
			moveHandle(){},
			//同意，继续使用
			confirmPrivacy(){
				this.privacyPolicyModel = false;
				uni.setStorageSync('privacyPolicy',this.privacyPolicyHtml);
			},
			//不同意，退出app
			cancelPrivacy(){
				this.privacyPolicyModel = false;
				uni.clearStorageSync('privacyPolicy');
				//退出app
				// #ifdef APP-PLUS
				 if (plus.os.name.toLowerCase() === 'android') {
					 plus.runtime.quit();
				 }
				 else{ 
					 const threadClass = plus.ios.importClass("NSThread");
					 const mainThread = plus.ios.invoke(threadClass, "mainThread");
					 plus.ios.invoke(mainThread, "exit");
				 }
				// #endif
			},
			//关闭广告屏
			close_openScreen(){
				this.isCookie = false;
			},
			//点击广告屏跳转到详情页面
			gotoGoods_detail(){
				this.isCookie = false;
				let osValue = this.home_page_img[0];
				let secKey = '';
				if(osValue.link_type == 'url'){
					secKey = osValue.link_value;	
				}else if(osValue.link_type == 'keyword'){
					secKey = osValue.link_value;
				}else if(osValue.link_type == 'goods'){
					secKey = osValue.info.gid;
				}else if(osValue.link_type == 'category'){
					secKey = osValue.info.gc_id;
				}else if(osValue.link_type == 'topic'){ //待测 专题
					secKey = osValue.info.topic_id;
				}else if(osValue.link_type == 'store'){
					secKey = osValue.info.vid;
				}else if(osValue.link_type == 'live'){
					secKey = osValue.info.live_id;
				}else if(osValue.link_type == 'svideo'){
					secKey = osValue.info.video_id;
				}
				linkTo(osValue.link_type,secKey);
			},
			getHeaderColor() {
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=index_title',
					success: res => {
						if (res.data.code == 200) {
							this.setData({
								headerBgColor: res.data.datas.sousuo_color
							});
						}
					}
				});
			},

			// 网站关闭处理
			siteCloseHandle(options) {
				uni.setNavigationBarTitle({
					title: this.$L('网站已关闭')
				});
				uni.hideTabBar({});
				let article = decodeURIComponent(options.info);
				this.setData({
					siteClose: true,
					siteCloseInfo: article
				});
			},

			load_tmp_data: function(lp = 0) {
				setTimeout(()=>{
					this.$refs.diyPage.is_show_index = true
					this.$refs.diyPage.tab_index = 0
					this.$refs.diyPage.returnHome()
					this.$refs.diyPage.getSortList()
				},500)
				//获取首页数据
				var that = this;
				var lp_url_param_str = '';

				if (lp > 0) {
					lp_url_param_str += '&lp=' + lp;
				}

				var data = {};
				var isopen = uni.getStorageSync('city_site_open');

				if (that.bid && that.bid != 0 && isopen) {
					data.bid = that.bid;
				}

				// #ifdef H5
				this.client = 'h5'
				// #endif
				
				// #ifdef APP-PLUS
				switch(uni.getSystemInfoSync().platform){
					case 'android':
					   this.client = 'android'
					   break;
					case 'ios':
					   this.client = 'ios'
					   break;
					default:
					   break;
				}
				// #endif
				
				// #ifdef MP
				this.client = 'weixin_xcx'
				// #endif
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=index_new&client_type=' + this.client,
					data,
					dataType: 'json',
					success: function(result) {
						if(result.data.state == 200){
							const {windowWidth,windowHeight} = uni.getSystemInfoSync();
							that.home_info = result.data.data.data;
							let gids=[]
              if(result.data.data.data){
                result.data.data.data.forEach(item=>{
                  if(item.type=='tuijianshangpin'||item.type=='dapei'){
                    item.data.ids.forEach(id=>{
                    gids.push(id)
                    })
                  }
                  if(item.type=='more_tab'){
                    if(item.data[0].data_type=='goods'){
                      item.data[0].ids.forEach(id=>{
                      gids.push(id)
                      })
                    }
                  }
                })
                
              }
							that.setData({
								gids
							})
							that.home_page_img = result.data.data.show_tip != null ? result.data.data.show_tip : [];
							if(that.home_info&&that.home_info.length!=undefined&&that.home_info.length>0){
								that.home_is_show_top_cat = that.home_info[0].type == 'top_cat_nav'?true:false;
							}
							if(that.home_info && that.home_page_img && that.home_page_img.length > 0){
								that.height=result.data.data.show_tip[0].height || windowWidth*0.75;
								that.width=result.data.data.show_tip[0].width || windowHeight*0.56;
							}else{
								that.height = windowWidth*0.75;
								that.width = windowHeight*0.56;
							}
							// uni.hideLoading();
							//#ifdef MP-WEIXIN
							if (result.data.data.share_img_xcx_url) {
								that.setData({
									share_img: result.data.data.share_img_xcx_url
								});
							}
							//#endif 
							if (that.isFirst&&that.city_site_open) {
								that.isFirst = false;
							    that.isToggleCity(); 
							}
						}
						
					}
				});
			},

			goMainSite() {
				this.bid = 0;
				this.area_name = this.$L('全国');
				this.site_id = 0;
				clearInterval(this.timer);
				this.setCityInfo(0, this.$L('全国'), 0);
			},

			find_goods: function(event) {
				uni.redirectTo({
					url: '../goods_detail/goods_detail'
				});
			},
			//监测页面滚动
			onPageScroll: function(e) {
				if (e.scrollTop > 50) {
					this.setData({
						isshow: 1,
						hastm: 1
					});
				} else {
					this.setData({
						isshow: 0,
						hastm: 0
					});
				}
			},
			//跳转搜索页
			go_search: function(e) {
				uni.navigateTo({
					url: '../search/search'
				});
			},

			chooseCity(){
				uni.navigateTo({
					url: '/pages/city/city'
				});
			},

			//1-检查城市分站是否打开
			check_city_site_open() {
				let that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=get_city_site',
					method: 'GET',
					success: function(res) {
						if (res.data.datas.sld_city_site) {
							// 城市分站打开
							uni.setStorage({
								key: 'city_site_open',
								data: true
							});
							that.setData({
								city_site_open: true
							}); // 获取本地存储是否有城市分站信息
							that.getCityInfo();
						} else {
							// 没有打开
							uni.setStorage({
								key: 'city_site_open',
								data: false
							});
							that.setData({
								city_site_open: false
							});
							that.setCityInfo(0, that.$L('全国'), 0); // this.bid = 0;
							// this.area_name = '全国';
							// this.site_id = 0;
						}

						that.setData({
							is_back_master: res.data.datas.is_allow_back_mall
						});
					},
					error: function(err) {}
				});
			},

			// 存储城市分站信息
			setCityInfo(city_site_bind_id, city_site_area_name, city_site_site_id) {

				let that = this;
				uni.setStorage({
					key: 'city_site_bind_id',
					data: city_site_bind_id
				});
				uni.setStorage({
					key: 'city_site_area_name',
					data: city_site_area_name
				});
				uni.setStorage({
					key: 'city_site_site_id',
					data: city_site_site_id
				});
				that.bid = city_site_bind_id;
				that.area_name = city_site_area_name;
				that.site_id = city_site_site_id; //获取首页数据

				that.setData({
					area_name: that.area_name
				});
				that.load_tmp_data(that.lp);
			},

			// 获取本地存储中的城市分站信息
			getCityInfo() {
				let that = this;
				let flag = uni.getStorageSync('city_site_bind_id'); 
				let bid = flag || 0;
				let area_name = uni.getStorageSync('city_site_area_name') || that.$L('全国');
				let site_id = uni.getStorageSync('city_site_site_id') || 0;
				this.bid = bid;
				this.area_name = area_name;
				this.site_id = site_id;
				if (!flag && flag !== 0) {
					// 获取当前位置
					that.getLocation(); // 本地存储中bid为0或没有
				} else {
					// 
					//获取首页数据
					that.setData({
						area_name
					});
					that.load_tmp_data(that.lp);
				}
			},

			// 获取当前位置
			getLocation() {
				let that = this;
				// #ifndef H5
				myAmapFun.getRegeo({
					success: function(res) {
						let city_info = {};
						city_info.province = res[0].regeocodeData.addressComponent.province;
						city_info.district = res[0].regeocodeData.addressComponent.district;
						that.check_has_city_site(city_info);
						let co = res[0].regeocodeData.addressComponent;
						let region = co.city.length ? co.city : co.province;
						uni.setStorage({
							key: 'region',
							data: region
						});
					},
					fail: function(err) {
						that.setCityInfo(0, that.$L('全国'), 0);
					}
				});
				//#endif
				// #ifdef H5
				//这里要加window., loadScrpit的callback才会执行
				window.mapInit = function(){
				  let mapObj = new AMap.Map('iCenter');
				  mapObj.plugin('AMap.Geolocation', function () {
				      let geolocation = new AMap.Geolocation({
				          enableHighAccuracy: false,//是否使用高精度定位，默认:true
				          timeout: 5000,          //超过5秒后停止定位，默认：无穷大
				      });
				      mapObj.addControl(geolocation);
				      geolocation.getCurrentPosition();
				      //返回定位信息
				      AMap.event.addListener(geolocation, 'complete', function (res) {
						  let city_info = {};
						  city_info.province = res.addressComponent.province;
						  city_info.district = res.addressComponent.district;
						  that.check_has_city_site(city_info);
						  let co = res.addressComponent;
						  let region = co.city ? co.city : co.province;
						  uni.setStorage({
						  	key: 'region',
						  	data: region
						  });
						  
				      });
				      //返回定位出错信息
				      AMap.event.addListener(geolocation, 'error', function (err) {
				      });
				  });
				}
				//#endif
			},

			// 验证当前城市是否有分站
			check_has_city_site(option) {
				let that = this;
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=check_city_site',
					method: 'GET',
					data: {
						city_info: option
					},
					dataType: 'json',
					success: function(res) {
						if (res.data.code == 200 && !Array.isArray(res.data.datas)) {
							that.bid = res.data.datas.bid;
							that.area_name = res.data.datas.area_name;
							that.site_id = res.data.datas.site_id;
							that.setCityInfo(that.bid, that.area_name, that.site_id); // 当前城市有分站，存储到本地存储
						} else {
							uni.showToast({
								title: that.$L('该城市分站还未开通'),
								icon: 'none'
							});
							that.setCityInfo(0, that.$L('全国'), 0);
						}
					},
					error: function(err) {
					}
				});
			},

			isToggleCity() {
				let that = this;
				// #ifndef H5 
				myAmapFun.getRegeo({
					success: function(res) {
						let addressComponent = res[0].regeocodeData.addressComponent;
						let p = addressComponent.province;
						let c = addressComponent.city.length ? addressComponent.city : addressComponent.province;
						let d = addressComponent.district;
						uni.request({
							url: getApp().globalData.ser_url + '/index.php?app=index&mod=checkAreaInCitySite',
							data: {
								'city_info[province]': p,
								'city_info[city]': c,
								'city_info[district]': d,
								'city_info[bid]': that.bid
							},
							success: result => {
								if (result.data.datas.city_site.length) {
									let item = result.data.datas.city_site[0];
									let bid = item.area_id || item.city_id || item.province_id;
									let name = item.sld_city_site_name;
									uni.showModal({
										title: that.$L('提示'),
										content: `${this.$L('系统定位到您在')} ${name},${this.$L('需要切换至')} ${name} ${this.$L('吗？')}`,
										success: res2 => { 
											if (res2.confirm) {
												that.setCityInfo(bid, name, item.id);
											}
										}
									});
								}
							}
						});
						let region = addressComponent.city.length ? addressComponent.city : addressComponent.province;
						uni.setStorage({
							key: 'region',
							data: region
						});
					},
					fail: err => {
					}
				});
				// #endif
				// #ifdef H5
				//这里要加window., loadScrpit的callback才会执行
				window.mapInit = function(){
				  let mapObj = new AMap.Map('iCenter');
				  mapObj.plugin('AMap.Geolocation', function () {
				      let geolocation = new AMap.Geolocation({
				          enableHighAccuracy: false,//是否使用高精度定位，默认:true
				          timeout: 5000,          //超过5秒后停止定位，默认：无穷大
				      });
				      mapObj.addControl(geolocation);
				      geolocation.getCurrentPosition();
				      //返回定位信息
				      AMap.event.addListener(geolocation, 'complete', function (res) {
						  let addressComponent = res.addressComponent;
						  let p = addressComponent.province;
						  let c = addressComponent.city.length ? addressComponent.city : addressComponent.province;
						  let d = addressComponent.district;
						  uni.request({
						  	url: getApp().globalData.ser_url + '/index.php?app=index&mod=checkAreaInCitySite',
						  	data: {
						  		'city_info[province]': p,
						  		'city_info[city]': c,
						  		'city_info[district]': d,
						  		'city_info[bid]': that.bid
						  	},
						  	success: result => {
						  		if (result.data.datas.city_site.length) {
						  			let item = result.data.datas.city_site[0];
						  			let bid = item.area_id || item.city_id || item.province_id;
						  			let name = item.sld_city_site_name;
						  			uni.showModal({
						  				title: that.$L('提示'),
						  				content: `${this.$L('系统定位到您在')} ${name},${this.$L('需要切换至')} ${name} ${this.$L('吗？')}`,
						  				success: res2 => {
						  					if (res2.confirm) {
						  						that.setCityInfo(bid, name, item.id);
						  					}
						  				}
						  			});
						  		}
						  	}
						  });
						  let region = addressComponent.city.length ? addressComponent.city : addressComponent.province;
						  uni.setStorage({
						  	key: 'region',
						  	data: region
						  });
				      });
				      //返回定位出错信息
				      AMap.event.addListener(geolocation, 'error', function (err) {
				      });
				  });
				}
				// #endif
			}

		}
	};
</script>
<style>
	page{
		/* width: 750rpx; */
		/* overflow-x: hidden; */
		display: flex;
		justify-content: center;
		background: #F5F5F5;
	}
	::-webkit-scrollbar {  
	    display: none;
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	.content{
		width: 750rpx;
		/* height: 100%; */
		background: #F5F5F5;
	}
	/* 用户政策与隐私协议 start */
	/* #ifdef APP-PLUS */
	.privacy_policy_model{
		width: 750rpx;
		height:100vh;
		background: rgba(0,0,0,0.7);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999999;
		overflow: hidden;
	}
	.privacy_model{
		width: 625rpx;
		height:70vh;
		background: #FFFFFF;
		border-radius: 15rpx;
		margin: 0 auto;
		margin-top: 17vh;
		padding-bottom: 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.privacy_model_title{
		height: 104rpx;
		font-size: 34rpx;
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: #000000;
		line-height: 104rpx;
		text-align: center;
		border-bottom: 1rpx solid #F2F2F2;
	}
	.privacy_policy{
		width: 625rpx;
		height: 50vh;
		padding:0 43rpx;
		box-sizing: border-box;
	}
	.privacy_model_confirm{
		width: 542rpx;
		height: 72rpx;
		background: linear-gradient(90deg, #FC1C1C 0%, #FF7918 100%);
		border-radius: 36rpx;
		font-size: 28rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 72rpx;
		text-align: center;
		margin: 20rpx auto;
	}
	.privacy_model_cancel{
		font-size: 28rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #FF991E;
		text-align: center;
		line-height: 28rpx;
	}
	/* #endif */
	/* 用户政策与隐私协议 end */
	/* 开屏 -- start */
		.open_screen{
			width: 750rpx;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
		    background-color: rgba(0,0,0,0.3);
			z-index: 99999;
		}
		.open_screen .open_screen_con{
			maring: 0 auto;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			border-radius: 15rpx;
		}
		.open_screen .open_screen_con .open_screen_con_img{
			width: 100%;
			height: 100%;
			background-size: contain;
			border-radius: 15rpx;
		}
		.open_screen .open_screen_con .con_img{
			width: 58rpx;
			height: 58rpx;
			position: absolute;
			top: -58rpx;
			right: -58rpx;
		}
		.open_screen_con .con_img image{
			width: 100%;
			height: 100%;
		}
		/* 开屏 -- end */
	.slide-image {
		width: 100%;
	}

	.homepage {}

	.home_sousuo {
		text-align: center;
		width: 90%;
		position: absolute;
		top: 20rpx;
		z-index: 2;
		height: 80rpx;
		background: #fff;
		border-radius: 40rpx;
		margin: 0 5%;
	}

	.sousuo_text {
		color: #d2d2d2;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
	}

	.home_nav {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.home_nav view {
		display: flex;
		flex-direction: column;
	}

	.home_nav image {
		width: 100rpx;
		height: 100rpx;
	}

	.home_nav label {
		font-size: 30rpx;
	}

	.home_goods_area {
		margin-bottom: 100rpx;
	}

	.home_images_area image {
		width: 100%;
	}

	.home_goods_area .goods {
		width: 370rpx;
		display: inline-block;
		margin-bottom: 20rpx;
	}

	.home_goods_area .goods image {
		width: 370rpx;
		height: 370rpx;
	}

	.home_goods_area .goods .name {
		font-size: 28rpx;
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}

	.home_goods_area .goods .price {
		color: #f23030;
	}

	/*顶部搜索样式*/
	
	.fixed_top_status_bar{
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
		z-index: 9999;
		background: #fff;
	}

	header.fixed {
		position: fixed;
		z-index: 9;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		right: 0;
		left: 0;
		height: 78rpx;
		display: flex;
		justify-content: center;
	}

	.header-wrap {
		width: 750rpx;
		height: 78rpx;
		background: none;
	}

	.ss_header_bg {
		background: #de181b;
		position: absolute;
		top: 0;
		margin: 0 auto;
		width: 750rpx;
		height: 78rpx;
		opacity: 0;
		transition: all 0.3s;
	}

	.htsearch-wrap {
		display: block;
		width: 750rpx;
		height: 78rpx;
		position: relative;
	}

	.city_sel {
		position: absolute;
		top: 0;
		left: 0;
		width: 151rpx;
		height: 100%;
		line-height: 78rpx;
		font-size: 28rpx;
		color: #fff;
		padding-left: 20rpx;
		display: flex;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.city_sel .img {
		width: 24rpx;
		height: 24rpx;
		overflow: hidden;
	}

	.city_sel .img image {
		width: 100%;
		margin-top: 10rpx;
	}

	.htsearch-input {
		height: 58rpx;
		width: 467rpx;
		vertical-align: middle;
		font-weight: normal;
		font-size: 24rpx;
		-webkit-appearance: none;
		background: #fff;
		opacity: 0.6;
		border-radius: 30rpx !important;
		border: none !important;
		color: #232326;
		position: absolute;
		top: 12rpx;
		right: 92rpx;
		left: 171rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.htsearch-input.big {
		left: 20rpx;
		width: 638rpx;
	}

	.htsearch-wrap .search-btn {
		top: 20rpx;
		right: 20rpx;
	}

	.search-btn {
		position: absolute;
		top: -2rpx;
		right: 0;
		height: 50rpx;
		width: 50rpx;
	}

	.clearfix {
		clear: both;
		overflow: hidden;
	}

	.not_city_data {
		display: flex;
		width: 750rpx;
		padding-top: 20vh;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.not_city_data image {
		width: 292rpx;
		height: 277rpx;
	}

	.not_city_data text {
		display: block;
		text-align: center;
		color: #666;
		font-size: 36rpx;
		margin-top: 30rpx;
	}

	.not_city_data .no-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #949494;
		font-size: 28rpx;
	}

	.not_city_data .no-data .time {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 89rpx;
		font-size: 24rpx;
	}

	.not_city_data .time text {
		color: #333333;
		margin: 0;
		font-size: 24rpx;
	}

	.not_city_data .time view {
		display: flex;
		align-items: center;
		color: #333333;
		margin-left: 6rpx;
	}

	.not_city_data .time view image {
		width: 22rpx;
		height: 0;
		margin-top: 0;
	}

	.not_city_data button {
		width: 480rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: linear-gradient(45deg, #FF3D33, #E1251B);
		color: #fff;
		font-size: 34rpx;
		font-weight: bold;
	}

	.center {
		display: flex;
		width: 750rpx;
		height: 100vh;
		/* align-items: center;
  justify-content: center; */
	}

	.bghide_top {
		opacity: 0;
	}

	.bgshow_top {
		opacity: 1;
	}
	em{
		font-style: normal;
	}
	.fixed_top_status_bar{
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
	 	z-index: 9999;
	 	background: #fff;
	 }
	 .status_bar{
	 	height: var(--status-bar-height);
		top: 0;
	 	width: 100%;
	 	background-color: #FFFFFF;
		z-index: 9999;
	 }
</style>
