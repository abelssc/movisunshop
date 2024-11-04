<template>
<view>
<!--subject.wxml-->

<view class="foundpage">
   <NewDiy @changeGids='changeGids' :deco_info="home_info" :is_show_top="false" :topic_name="topicName"></NewDiy> 
</view>
<common :title="$L('发现详情')"></common>
</view>
</template>

<script>
// 加载js
import { run_clock } from "../../utils/common";
import NewDiy from '../../component/NewDiy/NewDiy.vue'
export default {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      userInfo: {},
      isshow: 0,
      hastm: 0,
      share_title: '',
      share_url: '',
      topic_id: "",
      share_img: "",
      home_info: "",
	  topicName:'',
	  gids:[]
    };
  },

  components: {
	  NewDiy
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
	uni.showLoading({
		title:this.$L('加载中...')
	})
    // 获取专题详情页
    var index_data = this;

    if (options.u) {
      // 获取专题页面标题及相关分享内容
      this.setData({
        topic_id: options.u
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=topic_title',
        data: {
          topic_id: options.u
        },
        dataType: 'json',
        success: function (result) {
          if (result.data.code == 200) {
            uni.setNavigationBarTitle({
              title: result.data.datas.title
            });
            index_data.setData({
              share_title: result.data.datas.title,
              share_url: '/pages/found/subject?u=' + options.u,
              share_img: result.data.datas.share_img
            });
          }
        }
      });
      uni.setNavigationBarTitle({
        title: index_data.$L('当前页面')
      }); // 获取专题 页面 装修内容

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=topic_new',
        data: {
          topic_id: options.u
        },
        dataType: 'json',
        success: function (result) {
          let home_info_data = result.data.data.data;
		  if(home_info_data == null){
			  index_data.setData({
				  home_info:[],
				  topicName:result.data.data.name
			  })
		  }else{
			index_data.setData({
				home_info: home_info_data,
				topicName:result.data.data.name
			});
		  }
		  uni.hideLoading()
        }
      });
    }
  },

  onShareAppMessage() {
    const {
      share_title,
      share_url,
      share_img
    } = this;
    return {
      title: share_title,
      path: share_url,
      imageUrl: share_img
    };
  },
  onShareTimeline() {
    const {
      share_title,
      share_url,
      share_img
    } = this;
    return {
      title: share_title,
      path: share_url,
      imageUrl: share_img
    };
  },

  methods: {
	  changeGids(gids){
	  	this.gids=gids
	  },
    get_default_share_data: function () {
      var topicDesc_string = '';
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=index&mod=get_site_name',
        data: {},
        dataType: 'json',
        success: function (result) {
          topicDesc_string = result.datas.site_name;
        }
      });
      return topicDesc_string;
    },
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
	page{
		width: 750rpx;
		margin: 0 auto;
	}
/**subject.wxss**/
.slide-image {
  width: 100%;
}

.foundpage {
  height:100vw;
}

</style>