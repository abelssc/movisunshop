<template>
<view>
<view class="accon">
  <view class="list">
    <label for="user">{{$L('姓名')}}</label>
    <input id="user" :value="user" :placeholder="$L('输入账号对应的真实姓名')" @input="getuser"></input>
  </view>

  <view class="list" v-if="id==2">
    <label for="yh">{{$L('银行名称')}}</label>
    <input id="yh" :value="yh" :placeholder="$L('输入银行名称')" @input="getyh"></input>
  </view>

  <view class="list" v-if="id!=3">
    <label for="zh">{{$L('账号')}}</label>
    <input id="zh" :value="zh" :placeholder="$L('填写提现账号')" @input="getzh"></input>
  </view>
  <!--  disabled='{{!user||!zh}}' -->
  <button @tap="getaddCashAccount">{{$L('确认')}}</button>
</view>
<common :title="$L('添加提现账号')"></common>
</view>
</template>

<script>

export default {
  data() {
    return {
      key: '',
      user: '',
      zh: '',
      yh: '',
      id: '',
	  old_time:'', //上一次点击时间
	  isClick:false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.$L('添加提现账号')
    });

    let id = options.id;

    if (id) {
      this.setData({
        id
      });
    }
  },
  methods: {
    getuser(e) {
      let user = e.detail.value;
      this.setData({
        user: user
      });
    },

    getzh(e) {
      let zh = e.detail.value;
      this.setData({
        zh: zh
      });
    },

    getyh(e) {
      let yh = e.detail.value;
      this.setData({
        yh: yh
      });
    },

    // 添加账号
    getaddCashAccount() {
		let that = this
		  that.key = uni.getStorageSync('token')
		  let user = that.user
		  let zh = that.zh
		  let yh = that.yh
		  let id = that.id
		  let data = {
			ac_name: user,
			ac_account: zh,
			ac_type: id,
		}

      if (!user) {
        uni.showToast({
          title: that.$L('请填写姓名'),
          icon: 'none'
        });
        return;
      }

      if (!zh && id != 3) {
        uni.showToast({
          title: that.$L('请填写账号'),
          icon: 'none'
        });
        return;
      }

      if (!yh && id == 2) {
        uni.showToast({
          title: that.$L('请填写银行名称'),
          icon: 'none'
        });
        return;
      }

      if (user) {
		uni.showLoading({
			title:that.$L('加载中...'),
			duration:2000
		})
        if (id == 2) {
          data.ac_bank_name = yh;
        }
		if(that.isClick == false){
			that.isClick = true
			uni.request({
			  url: getApp().globalData.ser_url + '/index.php?app=cash&mod=addCashAccount&key=' + that.key,
			  method: 'POST',
			  header: {
			    'Content-Type': 'application/x-www-form-urlencoded'
			  },
			  data: data,
			
			  success(res) {
			    if (res.data.state == 200) {
			      uni.showToast({
			        title: res.data.msg,
			        // duration: 1600
			      });
				  that.isClick = false
			      let id = res.data.data.account_id;
			      const page = getCurrentPages();
			      let len = page.length;
			      page[len - 3].$vm.choose(id);
			      // setTimeout(() => {
			        uni.navigateBack({
			          delta: 2
			        });
			      // }, 1600);
			    }
			  },
			  error: function (err) {}
			});
		}else{
			return false
		}
      }
    }
  }
};
</script>
<style>
.accon {
  width: 750rpx;
  height: calc(100vh - 30rpx);
  padding-top: 30rpx;
  background-color: #f5f5f5;
}

.list {
  display: flex;
  align-items: center;
  height: 100rpx;
  font-size: 32rpx;
  color: #555;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
  padding-left: 30rpx;
}

.list label {
  display: block;
  margin-right: 30rpx;
  white-space: nowrap;
}

.list input {
  flex: 1;
  padding-right: 20rpx;
}

button {
  margin: 0 30rpx;
  font-size: 24rpx;
  color: #fff;
  line-height: 90rpx;
  margin-top: 50rpx;
  background-color: #ffb80f;
}

</style>