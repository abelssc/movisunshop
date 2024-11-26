<template>
<view>
<!-- 会员顶部 start -->
<view class="member-top">

    <view class="setting">
        <view  data-url="/pages/setting/setting" class="navigator" @tap="drup" hover-class="none">
            <image :src="img_url+'/site/mine_set.png'" mode="widthFix"></image>
        </view>
        <view  data-url="/pages/msg/msg?u=cwap_user_msg_xcx.html" @tap="drup"  class="navigator" hover-class="none">
            <image :src="img_url+'/site/mine_msg.png'" mode="widthFix"></image>
            <view class="msgCount" v-if="msg_count>0">
              <text class="msgText">{{ msg_count > 9 ? '9+' : msg_count }}</text>
            </view>
        </view>
    </view>

    <view class="member-card normal-member">
        <!-- 已登录 -->
        <view class="member-base-info" v-if="!show_log_btn">
            <view class="user-avatar" data-url="/pages/user/profile" @tap="drup">
                <view class="user-avator2" v-if="member_info.avator" :style="'background: url(' + member_info.avator + ') no-repeat center center #fff;background-size: 100% 100%;'">
					        <image :src="member_info.avator" mode="aspectFill"></image>
                </view>
                <view class="user-avator2" v-else>
                    <image class="avator-img" :src="img_url+'no-login.png'" mode="widthFix"></image>
                </view>
            </view>
            <view class="user_new_info">
                <view class="user-name">
                    <text class="user-info-name-txt">{{member_info.member_nickname?member_info.member_nickname:member_info.member_name}}</text>
                    <text v-if="member_info.member_nickname">{{$L('会员名')}}:{{member_info.member_name}}</text>
                </view>
                <!--
                <view class="user-level">
                  <view class="user-level1">
                      {{$L('会员等级')}}:{{member_info.grade_info.grade_name}}
                  </view>                 
                </view>
                -->
            </view>
            <view class="action">
                <view  data-url="/pages/favorites/favorites" class="navigator" @tap="drup" hover-class="none">
                  <text class="action-top">{{(member_info.goodsNum||member_info.goodsNum===0)?member_info.goodsNum:'--'}}</text>
                    <view>
                        <image :src="img_url+'/site/mine_like.svg'" mode="widthFix"></image>
                    </view>
                   
                </view>
                <view data-url="/pages/footprint/footprint" class="navigator" @tap="drup" hover-class="none">
                  <text class="action-top">{{(member_info.BrowseHistoryNum||member_info.BrowseHistoryNum===0)?member_info.BrowseHistoryNum:'--'}}</text>
                    <view>
                        <image :src="img_url+'/site/mine_footprint_white.png'" mode="widthFix"></image>
                    </view>
                </view>
            </view>

        </view>

        <!-- 未登录 -->
		
		<view class="member-base-info no_login" @tap="gotoLogin" v-if="show_log_btn">
		    <view class=" user-avatar">
		        <view class="user-avator2">
		            <image class="avator-img" :src="img_url+'/site/mine_default_avator.png'" mode="widthFix"></image>
		        </view>
		    </view>
		    <view class="user_new_info">
		        {{$L('登录/注册')}}
		        <image :src="img_url+'user_ltr.png'" mode="widthFix"></image>
		    </view>
		</view>
		<!-- #ifdef H5||APP-PLUS -->
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
       <!-- <button class="member-base-info no_login" @tap="getUserProfile" v-if="show_log_btn&&canIUseGetUserProfile">
            <view class=" user-avatar">
                <view class="user-avator2">
                    <image class="avator-img" :src="img_url+'/site/mine_default_avator.png'" mode="widthFix"></image>
                </view>
            </view>
            <view class="user_new_info">
                {{$L('登录/注册')}}
                <image :src="img_url+'user_ltr.png'" mode="widthFix"></image>
            </view>
        </button>
		<button class="member-base-info no_login" open-type="getUserInfo" @getuserinfo="getUser" v-if="show_log_btn&&!canIUseGetUserProfile">
		    <view class=" user-avatar">
		        <view class="user-avator2">
		            <image class="avator-img" :src="img_url+'/site/mine_default_avator.png'" mode="widthFix"></image>
		        </view>
		    </view>
		    <view class="user_new_info">
		        {{$L('登录/注册')}}
		        <image :src="img_url+'user_ltr.png'" mode="widthFix"></image>
		    </view>
		</button> -->
		<!-- #endif -->
        <!--
        <view class="check-in" data-url="/pages/singIn/singIn" @tap="drup">
            <image :src="img_url+ 'site/mine_time.png'" mode="widthFix"></image>
            {{$L('去签到')}}
        </view>
        -->
    </view>
</view>
<view class="fixed_top_status_bar" :hidden="scrollTopH==0"></view>
<view class="member-top fixed" :hidden="!fixed">
    <image :src="img_url+'member_top_bg2.png'" class="member-bg"></image>

    <view class="setting">
        <navigator :url="member_info.member_id?'/pages/setting/setting':''" hover-class="none">
            <image :src="img_url+'set_w.png'" mode="widthFix"></image>
        </navigator>
        <navigator :url="member_info.member_id?'/pages/msg/msg?u=cwap_user_msg_xcx.html':''" hover-class="none">
            <image :src="img_url+'msg_top.png'" mode="widthFix"></image>
            <view class="msgCount" v-if="msg_count>0">
              <text class="msgText">{{ msg_count > 9 ? '9+' : msg_count }}</text>
            </view>
        </navigator>
    </view>

    <view class="member-card normal-member">
        <!-- 已登录 -->
        <view class="member-base-info" v-if="!show_log_btn">
            <view class="user-avatar" data-url="/pages/user/profile" @tap="drup">
                <view class="user-avator2" v-if="member_info.avator" :style="'background: url(' + member_info.avator + ') no-repeat center center #fff;background-size: cover;'">
                </view>
                <view class="user-avator2" v-else>
                    <image class="avator-img" :src="img_url+'no-login.png'" mode="widthFix"></image>
                </view>
            </view>
            <view class="user_new_info" data-url="/pages/member_grade/member_grade" @tap="drup">
                <view class="user-name">
                    <text class="user-info-name-txt">{{member_info.member_nickname?member_info.member_nickname:member_info.member_name}}</text>
                    <text v-if="member_info.member_nickname">{{$L('会员名')}}:{{member_info.member_name}}</text>
                </view>
            </view>
        </view>
        <!-- 未登录 -->
		<!-- #ifdef MP-WEIXIN -->
        <button class="member-base-info no_login" @tap="getUserProfile" v-if="show_log_btn&&canIUseGetUserProfile">
            <view class=" user-avatar">
                <view class="user-avator2">
                    <image class="avator-img" :src="img_url+'no-login.png'" mode="widthFix"></image>
                </view>
            </view>
            <view class="user_new_info">
                {{$L('登录/注册')}}
                <image :src="img_url+'user_ltr.png'" mode="widthFix"></image>
            </view>
        </button>
		<button class="member-base-info no_login" open-type="getUserInfo" @getuserinfo="getUser" v-if="show_log_btn&&!canIUseGetUserProfile">
		    <view class=" user-avatar">
		        <view class="user-avator2">
		            <image class="avator-img" :src="img_url+'no-login.png'" mode="widthFix"></image>
		        </view>
		    </view>
		    <view class="user_new_info">
		        {{$L('登录/注册')}}
		        <image :src="img_url+'user_ltr.png'" mode="widthFix"></image>
		    </view>
		</button>
		<!-- #endif -->
    </view>
</view>
<!-- 会员顶部 end -->

<!-- 订单 -->

<view class="wrap-title order-title">
    <text>{{$L('我的订单')}}</text>
    <view class="more " data-url="/pages/order/order?s=" @tap="drup">
        {{$L('查看全部')}}
        <image src="/static/images/arrow_right_b.png" mode="widthFix"></image>
    </view>
</view>

<view class="order-list">
    <view class="order-item" data-url="/pages/order/order?s=1" @tap="drup">
        <image :src="img_url+'por_pagar.png'"></image>
        <view>{{$L('待付款')}}</view>
        <text class="item-num" v-if="member_info.dai_fu> 0">{{member_info.dai_fu}}</text>
    </view>

    <view class="order-item" data-url="/pages/order/order?s=256" @tap="drup">
        <image :src="img_url+'en_camino.png'"></image>
        <view>{{$L('待发货')}}</view>
        <text class="item-num" v-if="member_info.dai_fahuo > 0">{{member_info.dai_fahuo}}</text>
    </view>

    <view class="order-item" data-url="/pages/order/order?s=1024" @tap="drup">
        <image :src="img_url+'entregado.png'"></image>
        <view>{{$L('待收货')}}</view>
        <text class="item-num" v-if="member_info.dai_send > 0">{{member_info.dai_send}}</text>
    </view>

    <view class="order-item" data-url="/pages/order/order?s=nocomment" @tap="drup">
        <image :src="img_url+'comentarios.png'"></image>
        <view>{{$L('待评价')}}</view>
        <text class="item-num" v-if="member_info.dai_ping > 0">{{member_info.dai_ping}}</text>
    </view>

    <view class="order-item" data-url="/pages/refund/list" @tap="drup">
        <image :src="img_url+'devoluciones.png'"></image>
        <view>{{$L('退款/退货')}}</view>
        <text class="item-num" v-if="member_info.refund_count > 0">{{member_info.refund_count}}</text>
    </view>
</view>

<view class="live_wrap" @tap="goLiveUserCenter" data-curTab="live" v-if="member_info.is_open_live == 1 && !member_info.is_shenhe">
    <image class="live" :src="img_url + $L('live_entry.png')"></image>
    <text>{{$L('进入直播')}}</text>
</view>
<image class="svideo" @tap="goLiveUserCenter" data-curTab="video" v-if="member_info.is_open_svideo == 1 && !member_info.is_shenhe" :src="img_url + $L('svideo_entry.gif')"></image>

<!-- 我的服务 -->
<view class="wrap-title service-title">
    <text>{{$L('我的服务')}}</text>
</view>

<view class="my-service">
    <!--
    <view v-if="key && !member_info.wx_xcx_checking" class="ser-item" data-url="/pages/Balance/Balance?type=banance" @tap="drup">
        <image class="left_icon" :src="img_url+'my_s_09.png'"></image>
        <text>{{$L('预存款')}}</text>
    </view>
    -->
    <!--
    <view class="ser-item" data-url="/pages/red/red" @tap="drup">
        <image class="left_icon" :src="img_url+'my_s_05.png'"></image>
        <text>{{$L('优惠券')}}</text>
    </view>
    -->
    <view class="ser-item" data-url="/integral/activity/pin_list/pin_list" @tap="drup" v-if="moduleInfo.pin_isuse==1">
        <image class="left_icon" :src="img_url+'my_s_03.png'"></image>
        <text>{{$L('拼团')}}</text>
    </view>

    <view class="ser-item" data-url="/pages/Balance/Balance?type=points" @tap="drup" v-if="moduleInfo.points_isuse==1">
        <image class="left_icon" :src="img_url+'my_s_04.png'"></image>
        <text>{{$L('积分')}}</text>
    </view>

    <view class="ser-item" data-url="/pages/address/address" @tap="drup">
        <image class="left_icon" :src="img_url+'my_s_06.svg'"></image>
        <text>{{$L('地址')}}</text>
    </view>

    <view class="ser-item" data-url="/pages/red/red_get_list" @tap="drup">
        <image class="left_icon" :src="img_url+'my_s_01.svg'"></image>
        <text>{{$L('领劵')}}</text>
    </view>

    <view class="ser-item" data-url="/pages/help/help" @tap="drup">
        <image class="left_icon" :src="img_url+'my_s_08.svg'"></image>
        <text>{{$L('帮助')}}</text>
    </view>

    <view class="ser-item" :data-phone="site_phone" @tap.stop="call_phone">
        <image class="left_icon" :src="img_url+'my_s_07.svg'"></image>
        <text>{{$L('投诉')}}</text>
    </view>
    <!--
    <view class="ser-item" data-url="/pages/recharge/recharge" @tap="drup" v-if="key && !member_info.wx_xcx_checking && member_info.allow_deposit==1">
        <image class="left_icon" :src="img_url+'sld_chongzhi_icon.png'"></image>
        <text>{{$L('充值')}}</text>
    </view>
    -->
    <!--
    <view v-if="key && !member_info.wx_xcx_checking" class="ser-item" data-url="/pages/recharge/tixian" @tap="drup">
        <image class="left_icon" :src="img_url+'sld_tixian_icon.png'"></image>
        <text>{{$L('提现')}}</text>
    </view>
    -->
    <view class="ser-item" data-url="/addons/pages/ladderOrder/ladderOrder" @tap="drup" v-if="moduleInfo.pin_ladder_isuse==1">
        <image class="left_icon" :src="img_url + 'jtt@2x.png'"></image>
        <text>{{$L('阶梯团')}}</text>
    </view>

    <view class="ser-item" data-url="/addons/pages/presaleOrder/presaleOrder" @tap="drup" v-if="moduleInfo.pin_presale_isuse==1">
        <image class="left_icon" :src="img_url + 'ys@2x.png'"></image>
        <text>{{$L('预售')}}</text>
    </view>
</view>


<view class="mt" @tap="crdrmp" v-if="key && member_info.ban_enter_shop!=1 && !member_info.is_shenhe">
    <image :src="img_url + $L('enterin.png')" mode="widthFix"></image>
    <text>{{$L('立即入驻')}}</text>
</view>

<view class="mt ts" @tap="tip" v-if="member_info.if_spreader && !member_info.is_shenhe">
    <image :src="img_url+$L('shop_become_spreader.png')" mode="widthFix"></image>
    <text>{{member_info.is_spreader?$L('进入推手'):$L('成为推手')}}</text>
</view>

<view class="mt" @tap="drup" data-url="/pages/Feedback/Feedback">
    <image :src="img_url+$L('questionnaire.png')" mode="widthFix"></image>
</view>

<!-- 分销 -->
<block v-if="member_info.is_distribution == 1 && !member_info.is_shenhe">
    <view class="wrap-title">
        <text>{{$L('我的分销')}}</text>
    </view>
    <view class="fx_list">
        <view class="navigator" data-url="/pages/tuig/tuig" @tap="drup">
            <image :src="img_url+'tg001.png'"></image>
            <text>{{$L('我要推广')}}</text>
        </view>
        <view class="navigator" data-url="/pages/team/team" @tap="drup">
            <image :src="img_url+'tg002.png'"></image>
            <text>{{$L('我的团队')}}</text>
        </view>
        <view class="navigator" data-url="/pages/disincome/disincome" @tap="drup">
            <image :src="img_url+'tg003.png'"></image>
            <text>{{$L('分销收入')}}</text>
        </view>
    </view>
</block>



<!-- 授权成功后弹层 -->

<view :class="'sld-success-wrap-new ' + (showModal?'on':'')" v-if="!key">
    <view class="sld-success">
        <view class="sld-success-title">{{$L('是否绑定已有账号')}}</view>
        <view class="sld-success-content">{{$L('绑定已有账号可以同步历史订单，购物车等数据；不绑定后续数据无法同步')}}</view>
        <view class="sld-btns">
            <button open-type="getPhoneNumber" @getphonenumber="cancelBindHandle">{{$L('暂不')}}</button>
            <button class="confirm" @tap="confirmBindHandle">{{$L('去绑定')}}</button>
        </view>
    </view>
</view>


<!-- 注册成功弹层 -->
<view class="sld-success-wrap" v-if="regWrapShow">
    <view class="sld-reg-success">
        <view class="sld-reg-close" @tap="closeRegWrap">
            <image :src="img_url+'reg_voucher_close.png'"></image>
        </view>
        <view data-url="/pages/red/red" class="navigator" @tap="goVoucher">
            <image :src="red_img?red_img:'/images/reg_voucher.png'" mode="widthFix"></image>
        </view>
    </view>
</view>

<common :title="$L('个人中心')"></common>
</view>
</template>

<script>
//获取应用实例
import request from "../../utils/request";
import { UpdateCart } from "@/utils/common.js";
let _self;

export default {
  data() {
    return {
      key: "",
      botnav: 'user',
      member_info: {},
      show_log_btn: true,
      site_phone: '',
      showModal: false,
      regWrapShow: false,
      img_url: getApp().globalData.img_url,
      red_img: '',
      fixed: false,
      fixedStyle: '',
      moduleInfo: {},
      share_u: '',
      msg_count: 0, //系统未读消息数量
	  uuid: '', //用户未登录，唯一标识（前端）
      keys: "",
	  scrollTopH:0,
	  canIUseGetUserProfile: false,//是否可以使用getUserProfile获取用户信息，用于微信小程序
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
	  //#ifdef MP-WEIXIN
	  if (uni.getUserProfile) {
	      this.canIUseGetUserProfile = true;
	  }
	  //#endif
    if (options.u) {
      // let scene = decodeURIComponent(options.scene);
      // let u = scene.split('=')[1];
      let u = options.u;
      this.setData({
        share_u: u
      });
      uni.setStorage({
        key: 'share_u',
        data: u
      });
    } else {
      let u = uni.getStorageSync('share_u');

      if (u) {
        this.setData({
          share_u: u
        });
      }
    } // 获取 投诉电话

	// #ifdef H5
	if(this.$isWeiXinBrower){
		//微信浏览器特殊处理
		if(options.key){
			uni.setStorageSync('token',options.key);
		}
	}
	// #endif

    let that = this;
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=index&mod=get_site_phone',
      data: {},
      dataType: 'json',
      success: function (result) {
        if (result.data.code == 200 && result.data.datas.site_phone) {
          that.setData({
            site_phone: result.data.datas.site_phone
          });
        }
      }
    });
    _self = this;
    this.getActivityStatus();
	
	// 获取用户唯一标识UUID(规则：客户端类型+下划线+36位唯一字符串uuid)
	let uuid = wx.getStorageSync('uuid');
	if(!uuid){
		let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app
		wx.setStorageSync('uuid', uuid)
	}
  },
  onShow: function (options) {
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
    uni.setNavigationBarTitle({
      title: this.$L('个人中心')
    });
	   var key = wx.getStorageSync('token');
	   let uuid = wx.getStorageSync('uuid');
	   if(key==''||!key){
		   this.setData({
			   show_log_btn:true
		   })
		   this.setData({
		     msg_count: 0
		   });
		    this.member_info={}
		   return
	   }
	   if (key) {
		   this.setData({
			   key
		   })
		   this.getuserInfo();
		   this.getMsgCount();
	   }else{
		   // 获取用户唯一标识UUID(规则：客户端类型+下划线+36位唯一字符串uuid)
		   let uuid = wx.getStorageSync('uuid');
		   if(!uuid){
			  	let uuid = getApp().globalData.initUUID('2'); //client  1 h5 ,2 wx_xcx,  3  app
			   wx.setStorageSync('uuid', uuid)
		   }else{

		   }
	   }
		UpdateCart();	//更新购物车数据
  },

  onHide() {
    if (uni.getStorageSync('fromurl')) {
      uni.removeStorage({
        key: 'fromurl',
        success: function (res) {}
      });
    }
  },

  methods: {
	//登录事件
	gotoLogin() {
		uni.setStorageSync('fromurl', '/pages/user/user');
		 // #ifdef APP-PLUS || MP-WEIXIN
		uni.navigateTo({
		    url: '/pages/login/login'
		});
		// #endif
		
		// #ifdef H5
		let isWexin = this.$isWeiXinBrower();
		let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
		let spreader = '';
		let time = 0;
		if (tsGoodsInfo) {
		  for (let key in tsGoodsInfo) {
		    if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
		      spreader = tsGoodsInfo[key].shareId;
		      time = tsGoodsInfo[key].ssys_expire_day_time * 1;
		    }
		  }
		}
		if(isWexin){
			// 暂时关闭微信授权登陆--S
			// let uricode = getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_login&ukey=' + uni.getStorageSync('uuid')+'&shareId='+spreader;
			// if(location.href.indexOf('#')>-1){
			// 	let splitData = location.href.split('#');
			// 	uricode += '&sld_referrer_url='+splitData[0]+'&sld_referrer_url_after='+splitData[1];
			// }
			// uricode = encodeURIComponent(uricode)
			// window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+getApp().globalData.h5_appid+'&redirect_uri=' + uricode + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
			// 暂时关闭微信授权登陆--E
			uni.navigateTo({
			    url: '/pages/login/login'
			});
		}else{
			uni.navigateTo({
			    url: '/pages/login/login'
			});
		}
		// #endif
	},
	  
    getActivityStatus() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=getActivityStatus'
      }).then(res => {
        if (res.state == 200) {
          this.setData({
            moduleInfo: res.data
          });
        }
      });
    },

    checkLogin() {
      var key = uni.getStorageSync('token');

      if (key) {
        this.setData({
          key: key
        });
        return true;
      } else {
        return false;
      }
    },

    getuserInfo() {
      var that = this;
      var key = uni.getStorageSync('token');
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=memberInfo_xcx',
        data: {
          'key': key
        },
        dataType: 'json',
        success: function (result) {
          if (result.data.state != '266') {
            // 验证 用户 信息 查看用户 是否有openid
            if (result.data.member_info.member_id) {
              that.setData({
                member_info: result.data.member_info,
                show_log_btn: false,
                key: key
              });
              uni.setStorage({
                key: 'member_name',
                data: result.data.member_info.member_name
              });

              if (!uni.getStorageSync('uid')) {
                uni.setStorage({
                  key: 'uid',
                  data: result.data.member_info.member_id
                });
              }
            } else {
              uni.removeStorage({
                key: 'member_name'
              });
              uni.removeStorage({
                key: 'member_id'
              });
              uni.removeStorage({
                key: 'token'
              });
              uni.navigateTo({
                url: '../bind_account/bind_account'
              });
              that.setData({
                key: ''
              });
            }
          } else {
            uni.removeStorage({
              key: 'token'
            });
            that.setData({
              key: ''
            });
          }
        }
      });
    },

    // 推手
    tip() {
      let islogin = this.checkLogin();

      if (!islogin) {
        uni.showToast({
          title: this.$L('请登录'),
          icon: 'none'
        });
        return;
      }

      let that = this;
      let member_info = that.member_info;

      if (member_info.is_spreader && member_info.spreader_url) {
		  //#ifdef MP-WEIXIN
        uni.login({
          success: res => {
            if (res.code) {
              uni.request({
                url: getApp().globalData.ser_url + '/index.php?app=login&mod=xcx_login&sld_addons=spreader',
                data: {
                  code: res.code
                },
                success: result => {
                  uni.setStorageSync("ssys_username", result.data.reinfo.member_name);
                  uni.setStorageSync('ssys_key', result.data.reinfo.token);
                  uni.setStorageSync('ssys_share_code', result.data.reinfo.ssys_share_code);
                  uni.reLaunch({
                    url: '/addons/pages/tsIndex/tsIndex'
                  });
                }
              });
            }
          }
        });
		//#endif
		//#ifdef APP-PLUS || H5
		//获取推手的key并直接进入推手系统
		this.tsInit();
		//#endif
      } else {
        var key = uni.getStorageSync('token'); 
        uni.showModal({
          title: that.$L('提示'),
          content: that.$L('成为推手？'),
          cancelText:this.$L('取消'),
          confirmText:this.$L('确定'),
          success: function (res) {
            if (res.confirm) {
              uni.request({
                url: getApp().globalData.ser_url + '/index.php?app=api&mod=become_spreader&sld_addons=spreader',
                data: {
                  "key": key
                },
                dataType: 'json',
                success: function (result) {
                  if (result.data.state == 200) {
                    that.getuserInfo();
                  } else {
                    uni.showToast({
                      title: result.data.msg,
                      icon: "none",
                      mask: true,
                      duration: 2000
                    });
                  }
                }
              });
            }
          }
        });
      }
    },
	
	//如果有推手key，直接进入推手系统，否则，根据会员的key获取推手的key进入推手系统
	tsInit() {
		let ssys_key = uni.getStorageSync('ssys_key');
		if(ssys_key){
			uni.reLaunch({
			  url: '/addons/pages/tsIndex/tsIndex'
			});
		}else{
			let data = {
			    "ssys_key": uni.getStorageSync('token')
			  }
			uni.request({
			  url: getApp().globalData.ser_url + '/index.php?app=index&mod=check_Jurisdiction&sld_addons=spreader',
			  method: 'POST',
			  header: {
			    'Content-Type': 'application/x-www-form-urlencoded'
			  },
			  data,
			  success: function (result) {
			    if (result.data.status != 200) {
			      //跳转申请成为推手页面
				  uni.reLaunch({
				    url: '/addons/pages/tsLogin/tsLogin'
				  });
			    } else {
			      uni.reLaunch({
			        url: '/addons/pages/tsIndex/tsIndex'
			      });
			    }
			  }
			});
		}
	},

    // 客服电话
    call_phone: function (e) {
      var phoneNum = e.currentTarget.dataset.phone;

      if (phoneNum) {
        uni.makePhoneCall({
          phoneNumber: phoneNum
        });
      } else {
        uni.showToast({
          title: this.$L('还未设置400电话。'),
          icon: "none",
          mask: true,
          duration: 2000
        });
      }
    },

    drup(e) {
      let url = e.currentTarget.dataset.url;
      let islogin = this.checkLogin();

      if (!islogin&&url!='/pages/setting/language') {
        uni.showToast({
          title: this.$L('请登录'),
          icon: 'none'
        });
        return;
      }

      uni.navigateTo({
        url
      });
    },
	
	getUserProfile(e) {
	   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
	   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
	   uni.getUserProfile({
	     desc: this.$L('用于完善个人信息'), // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
	     success: (res) => {
			  if(res.errMsg == "getUserProfile:ok"){
				  let userinfo = res.userInfo;
				  this.getWxXcxCoce(userinfo,{encryptedData:res.encryptedData,iv:res.iv,rawData:res.rawData,siguature:res.siguature});
			  }
	     }
	   })
	 },
	 
	 //微信小程序根据用户信息获取code
	 getWxXcxCoce(userinfo,jmData) {
		  uni.showLoading({
		    title: this.$L('正在请求...'),
		    mask: true
		  });
		  uni.login({
		    success: code => {
		      
		  	let cart_list_storage = uni.getStorageSync('cart_list_storage');
		  	var str = "";
		  	
		  	if (cart_list_storage) {
		  	  cart_list_storage.map((item, index) => {
		  	    item[2].map((item1, index1) => {
		  	      if (str == '') {
		  	        str = item1.gid + ',' + item1.goods_num;
		  	      } else {
		  	        str = str + '|' + (item1.gid + ',' + item1.goods_num);
		  	      }
		  	    });
		  	  });
		  	}
		          let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
		  		let spreader = '';
		  		let time = 0;
		  		let inviteid =uni.getStorageSync('share_u')
		  		if (tsGoodsInfo) {
		  		  for (let key in tsGoodsInfo) {
		  		    if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
		  		      spreader = tsGoodsInfo[key].shareId;
		  		      time = tsGoodsInfo[key].ssys_expire_day_time * 1;
		  		    }
		  		  }
		  		}
		      uni.request({
		        url: getApp().globalData.ser_url + '/index.php?app=login&mod=xcx_login',
		        data: {
		          code: code.code,
		          userinfo: userinfo,
		          goods_cart: str,
		  		jmData: jmData,
		  		ukey:wx.getStorageSync('uuid'),
		  		shareId:spreader?spreader:'',
		        },
		        success: res => {
		          if (res.data.data.state == 200) {
		            uni.setStorageSync('token', res.data.data.token);
		            this.getuserInfo();
		            let fromurl = uni.getStorageSync('fromurl');
		  
		            if (fromurl) {
		              uni.removeStorage({
		                key: 'fromurl',
		                success: function (res) {}
		              });
		              uni.navigateTo({
		                url: fromurl
		              });
		            }
		          } else if (res.data.data.state == 100) {
		            this.setData({
		              showModal: true,
		              keys: res.data.data.reinfo.keys
		            });
		          } else {}
		        },
		        complete: () => {
		          uni.hideLoading();
		        }
		      });
		    }
		  });
	 },
	 

    getUser(e) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        let userinfo = e.detail.userInfo;
		this.getWxXcxCoce(userinfo,e.detail)
      }
    },
	
    confirmBindHandle() {
      const {
        keys
      } = this;
      this.setData({
        showModal: false
      });
      uni.navigateTo({
        url: '/pages/bindAccount/bindAccount?keys=' + keys
      });
    },

    cancelBindHandle(e) {
      const {
        keys,
        share_u
      } = this;
      this.setData({
        showModal: false
      });
     
      let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');
      let spreader = '';
      let time = 0;

      if (tsGoodsInfo) {
        for (let key in tsGoodsInfo) {
          if (tsGoodsInfo[key].ssys_expire_day_time * 1 > time) {
            spreader = tsGoodsInfo[key].shareId;
            time = tsGoodsInfo[key].ssys_expire_day_time * 1;
          }
        }
      }

      let params = {
		ukey: uni.getStorageSync('uuid'),
        keys: keys,
        client: 'wx_xcx',
        shareId: spreader
      };

      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        params.phonedata = e.detail.encryptedData;
        params.phonedataiv = e.detail.iv;
      }

      if (share_u) {
        params.inviteid = share_u;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_auto_register_xcx',
        data: params,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.state == 200) {
            uni.setStorageSync('token', res.data.data.key);
            this.getuserInfo();
            let fromurl = uni.getStorageSync('fromurl');

            if (fromurl) {
              if (res.data.data.red_money * 1 > 0) {
                uni.setStorageSync('red_money', res.data.data.red_money);
              }

              if (res.data.data.red_img) {
                uni.setStorageSync('red_img', res.data.data.red_img);
              }

              uni.removeStorage({
                key: 'fromurl',
                success: function (res) {}
              });
              uni.removeStorage({
                key: 'share_u',
                success: function (res) {}
              });
              uni.navigateTo({
                url: fromurl
              });
            } else {
              if (res.data.data.red_money > 0) {
                this.setData({
                  regWrapShow: true,
                  red_img: res.data.data.red_img ? res.data.data.red_img : ''
                });
              }
            }
          } else {
            uni.showModal({
              content: this.$L('该手机号已被其他账号绑定，确认将解除之前的绑定，是否确认?'),
              cancelText:this.$L('取消'),
              confirmText:this.$L('确定'),
              success: res => {

                if (res.confirm) {
                  this.relievePhone(params);
                } else {
                  this.zhuce(0, params);
                }
              }
            });
          }
        }
      });
    },

    closeWrap() {
      this.setData({
        showModal: false
      });
    },

    closeRegWrap() {
      this.setData({
        regWrapShow: false
      });
    },

    goVoucher(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        this.setData({
          regWrapShow: false
        });
        uni.navigateTo({
          url: url
        });
      }
    },

    // 商户入驻
    crdrmp() {
      let {
        key
      } = this;
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=checkApplyState&key=' + key + '&reapply=0&step=0&flag=0',
        success: res => {
          let state = res.data.datas.state;
          let url = '';
			if (state == '255'){
				uni.navigateTo({
				  url: '../setpw/setpw'
				});
			}
          switch (state) {
            case 200:
              url = '/integral/companyReg/crApplication/crApplication';
              break;

            case 311:
              let msg = res.data.datas.msg;

              if (msg == this.$L('进入第二步')) {
                url = '/integral/companyReg/crStep2/crStep2';
              } else if (msg == this.$L('进入第三步')) {
                url = '/integral/companyReg/crStep3/crStep3';
              }

              for (let i in res.data.datas.enterStatus) {
                if (url.indexOf('?') > -1) {
                  url += `&${i}=${res.data.datas.enterStatus[i]}`;
                } else {
                  url += `?${i}=${res.data.datas.enterStatus[i]}`;
                }
              }

              break;

            case 302:
              url = '/integral/companyReg/crStep4/crStep4?type=3&errorTip=' + res.data.datas.msg;
              break;

            case 305:
              url = '/integral/companyReg/crStep4/crStep4?type=2';
              break;

            case 304:
              uni.getStorageInfo({
                success: function (res) {
                  if (res.keys.length) {
                    res.keys.map(el => {
                      if (el.indexOf('enterin') > -1) {
                        // 删除所有入驻信息
                        uni.removeStorage({
                          key: el,
                          success: function (res) {}
                        });
                      }
                    });
                  }
                }
              });
              url = '/integral/companyReg/crStep4/crStep4?type=5';
              break;

            case 301:
              url = '/integral/companyReg/crStep4/crStep4?type=1';
              break;

            case 306:
              url = '/integral/companyReg/crStep4/crStep4?type=4';
              break;

            case 303:
              url = '/integral/companyReg/crStep4/crStep4?type=6';
              break;

            default:
              break;
          }

          uni.navigateTo({
            url: url
          });
        }
      });
    },

    onPageScroll(e) {
      let scrollTop = e.scrollTop;
      let {
        fixed,scrollTopH
      } = this;
	 
	  let scroll = 210-50;
	  
	  if(scrollTopH == 0&&e.scrollTop){
		  this.scrollTopH = e.scrollTop;
	  }
	  
	  if(scrollTopH > 0&&e.scrollTop == 0){
	  		  this.scrollTopH = 0;
	  }

      if (scrollTop > scroll && !fixed) {
        this.setData({
          fixed: true,
          fixedStyle: 'transition: all 0.3s;'
        });
        return;
      }

      if (scrollTop < scroll && fixed) {
        this.setData({
          fixed: false,
          fixedStyle: ''
        });
      }
    },

    //进入直播个人中心
    goLiveUserCenter(e) {
      var curTab = e.currentTarget.dataset.curtab;
      uni.navigateTo({
        url: '/addons/pages/liveUserCenter/liveUserCenter?curTab=' + curTab
      });
    },

    // 注册登录手机号已存在，点击弹框确认解除绑定手机号
    relievePhone(params) {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=login&mod=change_phone',
        method: 'post',
        data: {
          phonedata: params.phonedata,
          phonedataiv: params.phonedataiv,
          keys: params.keys
        }
      }).then(res => {
        if (res.state == 200) {
          this.zhuce(1, params);
        }
      });
    },

    // 注册登录手机号已存在，点击弹框按钮调取此接口, type 0取消  1确定
    zhuce(type, params) {
      if (type == 0) {
        delete params.phonedata;
        delete params.phonedataiv;
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=login&mod=gzh_auto_register_xcx',
        data: params,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.state == 200) {
            uni.setStorageSync('token', res.data.data.key);
            this.getuserInfo();
            let fromurl = uni.getStorageSync('fromurl');

            if (fromurl) {
              if (res.data.data.red_money * 1 > 0) {
                uni.setStorageSync('red_money', res.data.data.red_money);
              }

              if (res.data.data.red_img) {
                uni.setStorageSync('red_img', res.data.data.red_img);
              }

              uni.removeStorage({
                key: 'fromurl',
                success: function (res) {}
              });
              uni.removeStorage({
                key: 'share_u',
                success: function (res) {}
              });
              uni.navigateTo({
                url: fromurl
              });
            } else {
              if (res.data.data.red_money > 0) {
                this.setData({
                  regWrapShow: true,
                  red_img: res.data.data.red_img ? res.data.data.red_img : ''
                });
              }
            }
          } else {
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        }
      });
    },

    //获取系统未读消息数量
    getMsgCount() {
      request({
        url: getApp().globalData.ser_url + '/index.php?app=usercenter&mod=receivedSystemNewNum',
        method: 'post',
        data: {
          key: this.key
        }
      }).then(result => {
        if (result.code == 200) {
          if (result.datas.countnum != undefined) {
            this.setData({
              msg_count: result.datas.countnum
            });
          } else {
            this.setData({
              msg_count: 0
            });
          }
        }
      });
    },

    goLogin() {
      uni.navigateTo({
        url: "/pages/login/login"
      });
    }

  }
};
</script>
<style>
page {
    background-color: #f8f8f8;
	width: 750rpx;
	margin: 0 auto;
}

/* 会员 中心 顶部 */

.member-top {
    position: relative;
    width: 100%;
	/* #ifdef APP-PLUS */
    height: calc(var(--status-bar-height) + 420rpx);
	/* #endif */
	/* #ifndef APP-PLUS */
	height: 135px;
	/* #endif */
    text-align: center;
    background: #05092d;
    z-index: 1;
    overflow: hidden;
}

.member-bg {
    position: absolute;
	/* #ifdef APP-PLUS */
	top: var(--status-bar-height);
	/* #endif */
	/* #ifndef APP-PLUS */
	top: 0;
	/* #endif */
    left: 0px;
    width: 100%;
    height: 400rpx;
    z-index: 0;
}

.avator-img {
    width: 100%;
    height: 100%;
}

.member-base-info {
    position: absolute;
	/* #ifdef APP-PLUS */
	/* #endif */
	/* #ifndef APP-PLUS */
	top: 40px;
	/* #endif */
    left: 0;
    height: 115rpx;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    z-index: 2;
    transition: all 0.3s;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.member-base-info .user-avatar {
    width: 115rpx;
    height: 115rpx;
    overflow: hidden;
    border-radius: 50%;
    border-style: solid;
    border-color: rgb(255, 255, 255, 0.5);
    border-width: 10rpx;
    box-sizing: border-box;
    transition: all 0.3s;
}

.member-base-info .user-avator2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
}

.user-avator2 image {
    width: 95rpx;
    height: 0;
    transition: all 0.3s;
}

.user_new_info {
    color: #fff;
}

.no_login .user_new_info {
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    font-weight: bold;
}

.no_login .user_new_info image {
    width: 15rpx;
    height: 0;
    margin-left: 5rpx;
}

.member-base-info .user-level {
    display: inline-block;
    height: 26rpx;
    /* line-height: 26rpx; */
	vertical-align: middle;
    padding: 0 6rpx;
    font-size: 20rpx;
    color: #fff;
    border-radius: 13rpx;
	/* #ifdef MP || H5 */
	border: 1rpx solid #fff;
	/* #endif */
	/* #ifdef APP-PLUS */
	border: 2rpx solid #fff;
	/* #endif */
    margin-top: 2rpx;
    margin-left: 10rpx;
}
.user-level1{
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
}

.check-in {
    position: absolute;
	/* #ifdef APP-PLUS */
    top: calc(var(--status-bar-height) + 120rpx);
	/* #endif */
	/* #ifndef APP-PLUS */
	top: 120rpx;
	/* #endif */
    right: 0;
    width: 120rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24rpx 0 0 24rpx;
    color: #fff;
    font-size: 24rpx;
	background: rgba(250,250,250,0.2);
}

.check-in image {
    width: 21rpx;
    height: 23rpx;
    margin-right: 5rpx;
}

.no_login {
    display: flex;
    align-items: center;
    border: none;
    background-color: transparent;
}

.no_login::after {
    border: 0;
}
.action{
  flex: 1;
  display: flex;
  justify-content: end;
  align-items:center;
}
.action .navigator{
  position: relative;
  padding: 10px;
  display: flex;
}
.action image{
  width: 22px;
  height: 22px;
}
.action .action-top{
    position: absolute;
    top: 0;
    right: 0;
    background: #ffffff87;
    color: #000;
    width: 14px;
    height: 14px;
    display: block;
    border-radius: 50%;
    /* z-index: 1; */
    padding: 2px;
    font-size: 10px;
}


.member-top .setting {
    position: absolute;
	/* #ifdef APP-PLUS */
	/* #endif */
	/* #ifndef APP-PLUS */
    top: 0;
	/* #endif */
    z-index: 9;
    right: 10rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.member-top .setting .navigator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    padding: 20rpx;
    position: relative;
}
.member-top .setting navigator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30rpx;
    height: 30rpx;
    padding: 20rpx;
    position: relative;
}
.member-top .setting image {
    width: 30rpx;
    height: 30rpx;
	position: absolute;
}

/*个人信息 样式*/

.wrap-title {
    line-height: 30rpx;
    padding: 30rpx 20rpx 20rpx;
}

.wrap-title.order-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    padding: 0 20rpx;
    background-color: #fff;
}
.wrap-title.service-title{
  background-color: #fff;
  padding: 25rpx;
}

.wrap-title text {
    font-size: 14px;
    color: #2d2d2d;
}

.wrap-title .more {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 22rpx;
    color: #666;
}

.wrap-title .more image {
    width: 20rpx;
    height: 0;
    opacity: 0.6;
    margin-left: 15rpx;
}

.order-list {
    display: flex;
    /* align-items: center; */
    justify-content: space-evenly;
    padding: 30rpx 20rpx;
    background-color: #fff;
}

.order-list .order-item {
    flex: 1;
    position: relative;
    text-align: center;
    font-size: 22rpx;
    color: #333;
    box-sizing: border-box;
}

.order-item image {
    display: block;
    color: #565656;
    width: 60rpx;
    height: 60rpx;
    text-align: center;
    margin: 0 auto 10rpx;
}

.order-item .item-num {
    position: absolute;
    top: -20rpx;
    left: 90rpx;
    width: 14px;
    height: 14px;
    padding: 2px;
    border-radius: 50%;
    background-color: #e1251bb8;
    color: #fff;
    font-size: 10px;
    font-weight: normal;
    z-index: 2;
}

.my-service {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
}

.my-service .ser-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22rpx 0;
    font-size: 22rpx;
    color: #333;
    font-weight: 300;
    box-sizing: border-box;
    
    
}
.my-service .ser-item text{
  overflow: hidden;
   width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.my-service .ser-item image {
    width: 50rpx;
    height: 50rpx;
    margin-bottom: 15rpx;
}

.fx_list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 20rpx 20rpx;
    background-color: #fff;
    border-radius: 6rpx;
    box-shadow: 0 0 5px #e4e4e4;
}

.fx_list .navigator {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 20rpx;
}

.fx_list image {
    width: 107rpx;
    height: 107rpx;
}

.fx_list text {
    color: #2d2d2d;
    font-size: 24rpx;
    line-height: 1;
    font-weight: 300;
}

.mt {
    position: relative;
    height: auto;
    margin: 20rpx 20rpx 0;
}

.mt image {
    width: 100%;
    height: 0;
    overflow: hidden;
}

.mt text {
    position: absolute;
    top: 49rpx;
    right: 28rpx;
    width: 120rpx;
    height: 50rpx;
    text-align: center;
    padding: 0 5rpx;
    line-height: 50rpx;
    color: #2d2d2d;
    font-size: 24rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.mt.ts text {
    top: 51rpx;
}

.user_new_info {
    /* display: flex;
  flex-direction: column; */
    text-align: left;
    padding-left: 20rpx;
}

.user_new_info .user-name {
    display: flex;
    flex-direction: column;
    font-size: 30rpx;
    font-weight: bold;
    transition: all 0.3s;
}

.user_new_info .user-name text {
    font-weight: 300;
    font-size: 22rpx;
    margin-left: 10rpx;
}

.sld-success-wrap-new {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    opacity: 0;
    z-index: -1;
    transition: all 0.3s;
}

.sld-success-wrap-new.on {
    z-index: 999;
    opacity: 1;
}

.sld-success-wrap-new .sld-success {
    width: 750rpx;
    height: 440rpx;
    background-color: #fff;
    color: #666;
    font-size: 28rpx;
    text-align-last: center;
    transform: translateY(440rpx);
    transition: all 0.3s;
}

.sld-success-wrap-new.on .sld-success {
    transform: translateY(0);
}

.sld-success-wrap-new .sld-success .sld-success-title {
    line-height: 38rpx;
    font-size: 32rpx;
    color: #333;
    padding: 50rpx 30rpx;
}

.sld-success-wrap-new .sld-success .sld-success-content {
    line-height: 45rpx;
    margin-bottom: 30rpx;
    padding: 0 35rpx;
    color: #999;
    font-size: 26rpx;
}

.sld-success-wrap-new .sld-success .sld-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 90rpx;
}

.sld-success-wrap-new .sld-btns button {
    width: 230rpx;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    line-height: 80rpx;
    outline: none;
    background-color: #fff;
    color: #999;
    border: 1px solid #bfbfbf;
    margin: 0;
}

.sld-success-wrap-new .sld-btns button.confirm {
    color: #fff;
    background-color: #ec3633;
    border: 1px solid #ec3633;
    margin-left: 72rpx;
}

.sld-success-wrap-new .sld-btns button::after {
    border: 0;
}

.sld-success-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.sld-reg-success {
    position: relative;
}

.sld-reg-success .sld-reg-close {
    position: absolute;
    top: -56rpx;
    right: 20rpx;
    width: 56rpx;
    height: 56rpx;
}

.sld-reg-success .sld-reg-close image {
    width: 100%;
    height: 100%;
}

.sld-reg-success navigator image {
    width: 514rpx;
    height: 0;
}
.sld-reg-success .navigator image {
    width: 514rpx;
    height: 0;
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
	z-index: 99;
	background: #fff;
}
.fixed {
    position: fixed;
	/* #ifdef APP-PLUS */
    top: var(--status-bar-height);
	/* #endif */
	/* #ifndef APP-PLUS */
	top: 0;
	/* #endif */
    left: 0;
    width: 750rpx;
    height: 102rpx;
    z-index: 99;
    animation: fade 0.3s;
	right: 0;
	margin: 0 auto;
}

.fixed.member-top .setting {
	top: 16rpx;
	animation: fade 0.3s;
}

.fixed .member-bg {
    height: 102rpx;
	top: 0;
}

.fixed .member-base-info {
	top: 20rpx;
    left: 20rpx;
    height: 62rpx;
}

.fixed .member-base-info .user-avatar {
    width: 62rpx;
    height: 62rpx;
    border-width: 5rpx;
}

.fixed .member-base-info .user-avatar2 {
    border-width: 5rpx;
}

.fixed .user-avatar2 image {
    width: 52rpx;
    height: 0;
}

.fixed .user_new_info .user-name {
    font-weight: normal;
    font-size: 24rpx;
}

.fixed .user_new_info .user-name text {
    font-size: 16rpx;
}

.mt102 {
    margin-top: 102rpx;
}

.user_new_info .user-name .user-info-name-txt {
    max-width: 400rpx;
    font-size: 30rpx;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@keyframes fade {
    0% {
        opacity: 0.3;
    }

    100% {
        opacity: 1;
    }
}

.live_wrap {
    position: relative;
}

.live_wrap .live {
    width: 733rpx;
    height: 324rpx;
    margin-top: 10rpx;
    margin-left: 10rpx;
}

.live_wrap text {
    position: absolute;
    bottom: 67rpx;
    right: 60rpx;
    width: 183rpx;
    height: 60rpx;
    border: 1rpx solid #f2f2f2;
    border-radius: 30rpx;
    text-align: center;
    line-height: 60rpx;
    font-size: 34rpx;
    color: #fff;
}

.svideo {
    width: 723rpx;
    margin-left: 15rpx;
    height: 149rpx;
}
.msgCount {
		position: absolute;
		right: 2rpx;
		top: 8rpx;
		width: 28rpx;
		height: 28rpx;
		background: #fff;
		border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
	}
	.msgText {
		color: #e00c1a;
		font-size: 18rpx;
	}

</style>