<template>
  <view class="switchLanguage">
    <view class="switch_box"  @click="language_ty('zh_cn')">
      <text>{{$L('中文')}}</text>
      <image :src="img_url+'ok.png'" mode="widthFix" v-if="lan=='zh_cn'"></image>
    </view>
    <view class="switch_box" @click="language_ty('en')">
      <text>Español</text>
      <image :src="img_url+'ok.png'" mode="widthFix" v-if="lan=='en'"></image>
    </view>
    <common :title="$L('切换语言')"></common>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        img_url: getApp().globalData.img_url,
        lan: getApp().globalData.curLang,
      };
    },
    onLoad() {
      uni.setNavigationBarTitle({
      	title:this.$L('切换语言')
      })
    },
    methods:{
      language_ty(type){
        if(this.lan!=type){
            let biao = ''
              if(type == 'zh_cn'){
                getApp().globalData.curLang ='zh_cn'
                uni.setStorageSync('curLang','zh_cn')
                biao = 'zh_cn'
                
              }else if(type == 'en'){
                getApp().globalData.curLang ='en'
                uni.setStorageSync('curLang','en')
                biao = 'en'
              }
              // this.lan = getApp().globalData.curLang
              // uni.setNavigationBarTitle({
              // 	title:this.$L('切换语言')
              // })
              // if(getApp().globalData.curLang == 'zh'){
                
              // }else if(getApp().globalData.curLang == 'en'){
              //   console.log(111);
              //   this.lan = 'English'
              // }else if(getApp().globalData.curLang == 'pt'){
              //   this.lan = 'Português'
              // }
              let param = {}
              param.url = getApp().globalData.ser_url + '/index.php?app=index&mod=setLang'
              param.method = 'GET'
              param.data = {};
              param.data.lang_type = biao
              uni.request(param).then(res => {
              	let result_lang = res[1].data
                if(result_lang.state==200){
                this.lan = getApp().globalData.curLang
                
                uni.showToast({
                	title:this.$L('切换语言成功'),
                	icon:'none'
                })
					this.getindex_title()
                }
               
              })
              
              // setTimeout(()=>{
              // 	uni.reLaunch({
              // 		url: '/pages/user/user',
              // 	})
              // },1000)
            
          }
        },
        getindex_title(){
          let param = {}
          param.url = getApp().globalData.ser_url + '/index.php?app=index&mod=index_title'
          param.method = 'GET'
          uni.request(param).then(res => {
            if(res[1].data.code==200){
              if(res[1].data.datas.lang_type=='zh_cn'){
                getApp().globalData.curLang='zh_cn'
                this.lan = '中文'
                uni.setStorageSync('curLang','zh_cn')
              }else if(res[1].data.datas.lang_type=='en'){
                getApp().globalData.curLang='en'
                this.lan = 'English'
                uni.setStorageSync('curLang','en')
              }
              // else if(res[1].data.datas.lang_type=='pt'){
              //   getApp().globalData.curLang='pt'
              //   uni.setStorageSync('curLang','pt')
              //   this.lan = 'Português'
              // } 
              uni.showToast({
                	title:this.$L('切换语言成功'),
                	icon:'none'
                })
                setTimeout(()=>{
                	uni.reLaunch({
                		url: '/pages/user/user',
                	})
                },1000)
              
              	// uni.setTabBarItem({
              	// 	index: 0,
              	// 	text: this.$L('首页')
              	// })
              	// uni.setTabBarItem({
              	// 	index: 1,
              	// 	text: this.$L('分类')
              	// })
               //  uni.setTabBarItem({
               //  	index: 2,
               //  	text:this.$L('发现')
               //  })
               //  uni.setTabBarItem({
               //  	index: 3,
               //  	text: this.$L('购物车')
               //  })
               //  uni.setTabBarItem({
               //  	index: 4,
               //  	text: this.$L('我的')
               //  })
            }
          })
        }
     
      
    },
    onShow() {
      
    },
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f5f5;
    width: 750rpx;
    margin: 0 auto;
    
  }
.switchLanguage{
  .switch_box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 100rpx;
    background-color: #fff;
    font-size: 28rpx;
    color: #333;
    padding: 15rpx 20rpx;
    box-sizing: border-box;
    // margin-bottom: 20rpx;
    margin-bottom: 2rpx;
    image{
      width: 40rpx;
      height: 0;
      opacity: 0.6;
    }
    text {
    	display: block;
    }
  }
}
</style>
