<template>
<view :class="'menu ' + (showMenu?'on':'')">
  <view class="menu_main" @tap="showMenuFun">
    <image :src="showMenu?img_url+'close_menu.png':img_url+'menu@2x.png'"></image>
  </view>
  <view class="menu_child">
    <view v-for="(item, index) in defaultMenu" :key="index" :class="'child m' + (index+1)" :data-url="item.url" @tap="jump">
      <image :src="item.img"></image>
    </view>
  </view>
</view>
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
	  img_url:getApp().globalData.img_url,
      defaultMenu: [{
        type: 'index',
        img: getApp().globalData.img_url+"home.png",
        url: '/pages/index/index'
      }, {
        type: 'points',
        img: getApp().globalData.img_url+"jf.png",
        url: '/integral/pages/index/index'
      },
      //  {
      //   type: 'ldj',
      //   img: getApp().globalData.img_url+"ldj.png",
      //   url: '/ldj/pages/index/index'
      // },
       {
        type: 'ts',
        img: getApp().globalData.img_url+this.$L("menu_ts.png"),
        url: '/addons/pages/tsIndex/tsIndex'
      }]
    };
  },
  props: {
    nowPage: {
      type: String,
    },
	isShowPackUpBtn:{
		type:Boolean
	}
  },

  mounted() {
    this.init();
  },

  methods: {
    showMenuFun() {
      this.setData({
        showMenu: !this.showMenu
      });
    },
	closeMenu(){
		if(this.showMenu == true){
			this.setData({
			  showMenu: false
			});
		}
	},
    jump(e) {
      let url = e.currentTarget.dataset.url;

      if (url) {
        if (url == '/pages/index/index') {
          uni.switchTab({
            url
          });
        } else {
          uni.reLaunch({
            url
          });
        }
      } else {
        this.setData({
          showMenu: false
        });
      }
    },

    init() {
      let {
        defaultMenu,nowPage
      } = this;
      defaultMenu = defaultMenu.filter(el => el.type != nowPage);
      this.setData({
        defaultMenu
      });
    },
  }
};
</script>
<style>
/* component/sldMenu/sldMenu.wxss */

.menu {
  position: fixed;
  bottom: 171rpx;
  right: 0;
  z-index: 999;
  left: 0;
  width: 750rpx;
  margin: 0 auto;
}

.menu .menu_main {
  position: absolute;
  width: 106rpx;
  height: 111rpx;
  z-index: 99;
  right: 23rpx;
  bottom: 0;
}

.menu .menu_main image {
  max-width: 100%;
  max-height: 100%;
}
.menu .menu_child{
	position: absolute;
	bottom: 55px;
	    right: 64px;
}
.menu .menu_child .child {
  position: absolute;
  top: 0;
  left: 0;
  width: 100rpx;
  height: 100rpx;
  opacity: 0;
  z-index: 98;
  transform: translate(0,0) scale(0);
  transition: all 0.3s;
}

.menu .menu_child .child image {
  max-width: 100%;
  max-height: 100%;
}

.menu .menu_child .m2{
  width: 94rpx;
  height: 102rpx;
}

.menu .menu_child .m3{
  width: 98rpx;
  height: 102rpx;
}

.menu.on .menu_child .m1{
  transform: translate(0,-120rpx) scale(1);
  opacity: 1;
}

.menu.on .menu_child .m2{
  transform: translate(-120rpx,-60rpx) scale(1);
  opacity: 1;
}

.menu.on .menu_child .m3{
  transform: translate(-120rpx,60rpx) scale(1);
  opacity: 1;
}
</style>