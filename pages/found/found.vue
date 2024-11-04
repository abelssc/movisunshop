<template>
<view>
<!--found.wxml-->

<view class="foundpage">
   <NewDiy @changeGids='changeGids' :deco_info="home_info" :is_show_top="false" :topic_name="topicName"></NewDiy> 
</view>

<common :title="$L('发现')"></common>
</view>
</template>

<script>
import NewDiy from '../../component/NewDiy/NewDiy.vue'
export default {
  data() {
    return {
      indicatorDots: true,
      userInfo: {},
      botnav: 'found',
      isshow: 0,
      hastm: 0,
      home_info: "",
	  topicName:this.$L('发现'),
    };
  },

  components: {
  	  NewDiy
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
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
        title: this.$L('发现')
    });
    // 获取发现页面
    var index_data = this;
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=index&mod=topic',
      data: {
        activity_type: 'wapcmshome'
      },
      dataType: 'json',
      success: function (result) {
        let home_info_data = result.data.data.data || [];
        index_data.setData({
          home_info: home_info_data
        });
      }
    });
  },
  methods: {
    //监测页面滚动
    onPageScroll: function (e) {
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
    }
  }
};
</script>
<style>
/**found.wxss**/
page{
	width: 750rpx;
	/* justify-content: center; */
	/* display: flex; */
	/* position: relative; */
	margin: 0 auto;
}
.slide-image {
  width: 100%;
}

.foundpage {

}

</style>