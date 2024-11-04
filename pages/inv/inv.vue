<template>
<view>
<!--管理发票信息-->
<view class="inv_info">
	<div id="invoice-wrapper" class="bbctouch-full-mask">
		<div class="bbctouch-full-mask-block">
			<div class="bbctouch-main-layout">
				<div class="bbctouch-sel-box">
					<view class="tit">{{$L('是否开据发票')}}</view>
					<div class="sel-con">
						<a href="javascript:void(0);" :class="need_inv==0?'sel':''" id="invoice-noneed" data-type="0" @tap.stop="need_invFun">{{$L('不需要发票')}}</a>
						<a href="javascript:void(0);" :class="need_inv==1?'sel':''" id="invoice-need" data-type="1" @tap.stop="need_invFun">{{$L('需要并填写发票信息')}}</a>
					</div>
				</div>
				<div id="invoice-div" class>
					<view id="invoice-list" class="bbctouch-sel-list"  v-if="need_inv != 0">
						<block v-for="(item, inv_index) in invoice_list" :key="inv_index">
							<label class="itemlabel" :class="invoice_id==item.inv_id?'checked':''" :data-inv-id="item.inv_id" :data-inv-index="inv_index" @tap.stop="sele_inv">
								<i></i>
								<!-- <input type="radio" name="invoice"></input> -->
								<view :id="'inv_' + item.inv_id" class="history_invoice_text">
									{{item.inv_state==1?$L('[普票] '):$L('[增票] ')}}{{item.inv_state==1?item.inv_title:item.inv_company}}{{item.inv_state==1?item.inv_content:""}}
								</view>
								<a class="del-invoice" href="javascript:void(0);" :data-inv-id="item.inv_id" @tap.stop="del_inv">
									<image style="width: 100%; height: 100%;" mode="aspectFill" :src="img_url+'del_b.png'"></image>
								</a>
							</label>
						</block>
						<block v-if="invoice_list.length < 10">
							<view class="invoice_des" @tap.stop="add_inv">
								<image :src="is_add2 == 1 ? img_url + 'site/cart_seleted.png' : img_url + 'site/cartlist_not_sle.png'" class="store_select"></image>
								<text class="add_inv_text">{{$L('新增发票内容')}}</text>
							</view>
						</block>
					</view>
					<view class="bbctouch-inp-con" id="invoice_add" v-if="is_add != 0">
						<ul class="form-box">
							<li class="form-item">
								<view class="inv_content_text">{{$L('发票类型')}}</view>
								<div class="input-box btn-style invoice_type_all">
									<text :class="sele_add_type=='person'?'active':''" @tap.stop="sele_add_inv('person')">{{$L('个人')}}</text>
									<text :class="sele_add_type=='company'?'active':''" @tap.stop="sele_add_inv('company')">{{$L('单位')}}</text>
									<text v-if="is_zengzhi!=0" :class="sele_add_type=='zengzhi'?'active':''" @tap.stop="sele_add_inv('zengzhi')">{{$L('增值税发票')}}</text>
								</div>
							</li>
							<li class="form-item" id="inv-title-li" v-if="add_com_title">
								<view class="inv_content_text">{{$L('发票抬头')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_title" data-in-con="com_taitou" @blur="get_input_con" :placeholder="$L('输入单位名称')"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item" id="inv-title-shuihao" v-if="add_com_shuihao">
								<view class="inv_content_text">{{$L('单位税号')}}</view>
								<div class="input-box">
									<input type="text" data-in-con="com_shuihao" @blur="get_input_con" class="inp" name="inv_title_shuihao" :placeholder="$L('输入单位税号')" v-model="com_shuihao"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item mingxi" v-if="add_mingxi">
								<view class="inv_content_text">{{$L('发票内容')}}</view>
								<div class="input-box">

									<picker @change="bindPickerChange" :value="index" :range="invoice_content_list">
										<view class="picker inv_content_text flex_des">
											<text>{{invoice_content}}</text>
											<image src="../../static/images/arrow_right_b.png" mode="" style="width: 24rpx;height: 24rpx;"></image>
										</view>
										
									</picker>
<!-- 
									<select id="jmysinv_content" name="inv_content" class="select">
									</select>
									<i class="arrow-down"></i> -->
								</div>
							</li>
							<!--增值税发票内容-->
							<li class="form-item zengzhili" id="inv-zeng-mincheng" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('单位名称')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_mincheng" :placeholder="$L('输入单位名称')" data-in-con="zz_danweiname" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-shuihao" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('纳税人号')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_shuihao" :placeholder="$L('输入纳税人识别号')" data-in-con="zz_shuihao" @blur="get_input_con" v-model="zz_shuihao"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-address" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('注册地址')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_address" :placeholder="$L('输入注册地址')" data-in-con="zz_regiateraddress" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-tel" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('注册电话')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_tel" :placeholder="$L('输入注册电话')" data-in-con="zz_registertel" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-bank" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('开户银行')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_bank" :placeholder="$L('输入开户银行')" data-in-con="zz_bank" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-account" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('银行账户')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_account" :placeholder="$L('输入银行账户')" data-in-con="zz_bank_account" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-con" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('发票内容')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_con" readonly :placeholder="$L('明细')" data-in-con="zz_con" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-shouname" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('收票人姓名')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_shouname" :placeholder="$L('输入收票人姓名')" data-in-con="zz_receivename" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-shoutel" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('收票人手机号')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_shoutel" :placeholder="$L('输入收票人手机号')" data-in-con="zz_receivetel" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
							<li class="form-item zengzhili" id="inv-zeng-shouaddress" v-if="add_zengzhi">
								<view class="inv_content_text">{{$L('送票地址')}}</view>
								<div class="input-box">
									<input type="text" class="inp" name="inv_zeng_shouaddress" :placeholder="$L('输入送票地址')" data-in-con="zz_receiveaddress" @blur="get_input_con"></input>
									<span class="input-del"></span>
								</div>
							</li>
						</ul>
					</view>
					<a href="javascript:void(0);" class="btn-l mt10" @tap.stop="confirm_inv">{{$L('确定')}}</a>
				</div>
			</div>
		</div>
	</div>
</view>
<view class="error-tips" :hidden="is_show_tip==1?false:true">
	{{tip_content}}
</view>

<common :title="$L('发票信息')"></common>
</view>
</template>

<script>
const app = getApp();
//获取发票列表
var get_inv_list = function (that) {
  uni.request({
    url: app.globalData.ser_url + '/index.php?app=invoice&mod=invoice_list',
    data: {
      key: that.key
    },
    header: {
      'content-type': 'application/json' // 默认值

    },
    success: function (res) {
      var inv_id = 0;

      if (res.data.datas.invoice_list.length > 0) {
        inv_id = res.data.datas.invoice_list[0].inv_id;
      }

      that.setData({
        invoice_list: res.data.datas.invoice_list,
        invoice_id: inv_id
      });
    }
  });
}; //提示事件
//提示事件
var errorTipsShow = function (that, err_con) {
  that.setData({
    is_show_tip: 1,
    tip_content: err_con
  });
  setTimeout(function () {
    that.setData({
      is_show_tip: 0
    });
  }, 2000);
};

export default {
  data() {
    return {
	  img_url: getApp().globalData.img_url,
      need_inv: 0,
      //默认不需要发票
      invoice_id: 0,
      //选中的发票id
      tip_content: '',
      //错误提示内容
      is_show_tip: 0,
      is_add: 0,
	  is_add2: 0,
      invoice_content: this.$L('明细'),
      add_mingxi: 1,
      add_com_title: 0,
      add_com_shuihao: 0,
      add_zengzhi: 0,
      sele_add_type: 'person',
      is_zengzhi: 0,
      com_taitou: '',
      //单位名称
      com_shuihao: '',
      //单位税号
      zz_danweiname: '',
      //增值税 单位名称
      zz_shuihao: '',
      //增值税 纳税人识别号
      zz_regiateraddress: '',
      //增值税 注册地址
      zz_registertel: '',
      //增值税 注册电话
      zz_bank: '',
      //增值税 开户银行
      zz_bank_account: '',
      //增值税 银行账户
      zz_con: '',
      //增值税 发票内容
      zz_receivename: '',
      //增值税 收票人姓名
      zz_receivetel: '',
      //增值税 收盘人手机号
      zz_receiveaddress: '' //增值税 送票地址
      ,
      invoice_list: "",
      key: "",
      invoice_content_list: "",
      invoice_id_index: "",
	  index:''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('发票信息')
    });
    //获取用户的key值
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        key: key
      });
    } else {
      getApp().globalData.goLogin();
    } //根据参数判断是否可以开增值税发票


    this.setData({
      is_zengzhi: options.zengzhi
    }); //获取发票的明细内容

    var that = this;
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=invoice&mod=invoice_content_list',
      data: {
        key: that.key
      },
      header: {
        'content-type': 'application/json' // 默认值

      },
      success: function (res) {
        that.setData({
          invoice_content_list: res.data.datas.invoice_content_list
        });
      }
    }); //根据用户key获取发票列表

    get_inv_list(this);
  },
  methods: {
    //选择是否需要发票
    need_invFun: function (e) {
      if (e.currentTarget.dataset.type == 0) {
        this.setData({
          need_inv: e.currentTarget.dataset.type,
          is_add: 0
        });
      } else {
        this.setData({
          need_inv: e.currentTarget.dataset.type
        }); // 默认选中的 发票

        if (this.invoice_list.length > 0) {
          var inv_id = this.invoice_list[0].inv_id;
        } else {
          var inv_id = '';
        }

        var inv_index = 0;
        this.setData({
          invoice_id: inv_id,
          is_add: 0,
          invoice_id_index: inv_index
        });
      }
    },
    //删除已有发票
    del_inv: function (e) {
      var that = this;
      var inv_id = e.currentTarget.dataset.invId;
      var sele_inv_id = uni.getStorageSync('sele_inv_id');
      uni.setStorageSync('has_sele_inv', 1);

      if (sele_inv_id == inv_id) {
        uni.removeStorage({
          key: 'is_need_inv'
        });
        uni.removeStorage({
          key: 'sele_inv_id'
        });
        uni.removeStorage({
          key: 'sele_inv_con'
        });
      }

      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=invoice&mod=invoice_del_xcx',
        data: {
          'key': that.key,
          'inv_id': inv_id
        },
        header: {
          'content-type': 'application/json' // 默认值

        },
        success: function (res) {
          if (res.data.state == 250) {
            errorTipsShow(this, res.data.msg);
          } else {
            get_inv_list(that); // wx.setStorageSync('is_need_inv', 0)
          }
        }
      });
    },
    //选择发票事件
    sele_inv: function (e) {
      var inv_id = e.currentTarget.dataset.invId;
      var inv_index = e.currentTarget.dataset.invIndex;
      this.setData({
        invoice_id: inv_id,
        is_add: 0,
        invoice_id_index: inv_index,
		is_add2: 0
      });
    },
    //新增发票事件
    add_inv: function () {
      this.setData({
        is_add: 1,
        invoice_id: "",
		is_add2: 1
      });
    },
    //选择明细事件
    bindPickerChange: function (e) {
      var index = e.detail.value;
      var inv_con = this.invoice_content_list[index];
      this.setData({
        invoice_content: inv_con
      });
    },
    //选择增值税发票
    sele_add_inv: function (type) {
      var sele_type = type;

      if (sele_type == "person") {
        this.setData({
          add_mingxi: 1,
          add_com_title: 0,
          add_com_shuihao: 0,
          add_zengzhi: 0,
          sele_add_type: sele_type
        });
      } else if (sele_type == "company") {
        this.setData({
          add_mingxi: 1,
          add_com_title: 1,
          add_com_shuihao: 1,
          add_zengzhi: 0,
          sele_add_type: sele_type
        });
      } else {
        this.setData({
          add_mingxi: 0,
          add_com_title: 0,
          add_com_shuihao: 0,
          add_zengzhi: 1,
          sele_add_type: sele_type
        });
      }
    },
    //获取input的内容
    get_input_con: function (e) {
      var data_con = e.currentTarget.dataset.inCon;

      if (data_con == 'com_taitou') {
        this.setData({
          com_taitou: e.detail.value
        });
      } else if (data_con == 'com_shuihao') {
		let val = e.detail.value;
		val = val.replace(/[\u4E00-\u9FA5]/g, '');
        this.setData({
            com_shuihao: val
        });
      } else if (data_con == 'zz_danweiname') {
        this.setData({
          zz_danweiname: e.detail.value
        });
      } else if (data_con == 'zz_shuihao') {
		let val = e.detail.value;
		val = val.replace(/[\u4E00-\u9FA5]/g, '');
        this.setData({
          zz_shuihao: val
        });
      } else if (data_con == 'zz_regiateraddress') {
        this.setData({
          zz_regiateraddress: e.detail.value
        });
      } else if (data_con == 'zz_registertel') {
        this.setData({
          zz_registertel: e.detail.value
        });
      } else if (data_con == 'zz_bank') {
        this.setData({
          zz_bank: e.detail.value
        });
      } else if (data_con == 'zz_bank_account') {
        this.setData({
          zz_bank_account: e.detail.value
        });
      } else if (data_con == 'zz_con') {
        this.setData({
          zz_con: e.detail.value
        });
      } else if (data_con == 'zz_receivename') {
        this.setData({
          zz_receivename: e.detail.value
        });
      } else if (data_con == 'zz_receivetel') {
        this.setData({
          zz_receivetel: e.detail.value
        });
      } else if (data_con == 'zz_receiveaddress') {
        this.setData({
          zz_receiveaddress: e.detail.value
        });
      }
    },
    //确定事件
    confirm_inv: function (e) {
      var has_sele_inv = 1;
      var inv_id = 0;
      var inv_con = '';
		
	  this.is_add2 = 0;
      if (this.need_inv == 0) {
        //不需要发票
        inv_id = 0;
        inv_con = this.$L('不需要发票'); //最后将数据存缓存

        uni.setStorageSync('has_sele_inv', 1);
        uni.setStorageSync('is_need_inv', inv_id);
        uni.setStorageSync('sele_inv_id', this.invoice_id);
        uni.setStorageSync('sele_inv_con', inv_con); //返回确认订单页面

        uni.navigateBack({
          delta: 1
        });
      } else {
        inv_id = 1;

        if (this.invoice_id > 0) {
          //选择发票列表
          var inv_index = this.invoice_id_index;
          var inv_content = this.invoice_list[inv_index];

          if (inv_content.inv_state == 1) {
            inv_con += this.$L('[普票] ') + inv_content.inv_title + inv_content.inv_content;
          } else {
            inv_con += this.$L('[增票] ') + inv_content.inv_company;
          } //最后将数据存缓存


          uni.setStorageSync('has_sele_inv', 1);
          uni.setStorageSync('is_need_inv', inv_id);
          uni.setStorageSync('sele_inv_id', this.invoice_id);
          uni.setStorageSync('sele_inv_con', inv_con); //返回确认订单页面

          uni.navigateBack({
            delta: 1
          });
        } else if (this.is_add == 1) {
          //新增发票
          var request_data = '';
          var inv_state = 1;
          var inv_title = '';
          var inv_content = this.invoice_content;

          if (!inv_content) {
            inv_content = this.$L('明细');
          }

          if (this.sele_add_type == 'person') {
            inv_state = 1;
            inv_title = this.$L('个人'); //个人发票

            request_data = {
              'key': this.key,
              'inv_state': inv_state,
              'inv_title': inv_title,
              'inv_content': inv_content,
              'inv_code': ''
            };
			this.confirm(request_data,inv_id,inv_state,inv_title,inv_con);
          } else if (this.sele_add_type == 'company') {
            if (!this.com_taitou || !this.com_shuihao) {
              errorTipsShow(this, this.$L('请补全信息'));
            }else{
				var inv_content = this.invoice_content;
				
				if (!inv_content) {
				  inv_content = this.$L('明细');
				}
				
				inv_state = 1;
				inv_title = this.com_taitou; //单位发票
				
				request_data = {
				  'key': this.key,
				  'inv_state': inv_state,
				  'inv_title': inv_title,
				  'inv_content': inv_content,
				  'inv_code': this.com_shuihao
				};
				this.confirm(request_data,inv_id,inv_state,inv_title,inv_con);
			}

           
          } else {
            if (!this.zz_danweiname || !this.zz_shuihao || !this.zz_regiateraddress || !this.zz_registertel || !this.zz_bank || !this.zz_bank_account || !this.zz_con || !this.zz_receivename || !this.zz_receivetel || !this.zz_receiveaddress) {
              errorTipsShow(this, this.$L('请补全信息'));
            }else{
				inv_state = 2; //增值税发票
				
				request_data = {
				  'key': this.key,
				  'inv_state': inv_state,
				  'inv_company': this.zz_danweiname,
				  'inv_code': this.zz_shuihao,
				  'inv_reg_addr': this.zz_regiateraddress,
				  'inv_reg_phone': this.zz_registertel,
				  'inv_reg_bname': this.zz_bank,
				  'inv_reg_baccount': this.zz_bank_account,
				  'inv_rec_name': this.zz_receivename,
				  'inv_rec_mobphone': this.zz_receivetel,
				  'inv_rec_province': '',
				  'inv_goto_addr': this.zz_receiveaddress
				};
				this.confirm(request_data,inv_id,inv_state,inv_title,inv_con);
				
			}

           
          } //存库


			
          // var that = this;
          // uni.request({
          //   url: getApp().globalData.ser_url + '/index.php?app=invoice&mod=invoice_add_xcx',
          //   data: request_data,
          //   dataType: 'json',
          //   success: function (result) {
          //     if (result.data.state == 250) {
          //       errorTipsShow(that, result.data.msg);
          //     } else {
          //       if (inv_state == 1) {
          //         inv_con += '[普票]  ' + inv_title + that.invoice_content;
          //       } else {
          //         inv_con += '[增票]  ' + that.zz_danweiname;
          //       } //最后将数据存缓存


          //       uni.setStorageSync('has_sele_inv', 1);
          //       uni.setStorageSync('is_need_inv', inv_id);
          //       uni.setStorageSync('sele_inv_id', result.data.inv_id);
          //       uni.setStorageSync('sele_inv_con', inv_con); //返回确认订单页面

          //       uni.navigateBack({
          //         delta: 1
          //       });
          //     }
          //   }
          // });
        } else if (this.invoice_id == 0) {
          //不需要发票
          inv_id = 0;
          inv_con = this.$L('不需要发票'); //最后将数据存缓存

          uni.setStorageSync('has_sele_inv', 1);
          uni.setStorageSync('is_need_inv', inv_id);
          uni.setStorageSync('sele_inv_id', this.invoice_id);
          uni.setStorageSync('sele_inv_con', inv_con); //返回确认订单页面

          uni.navigateBack({
            delta: 1
          });
        }
      }
    },
	confirm(request_data,inv_id,inv_state,inv_title,inv_con){
		var that = this;
		uni.request({
		  url: getApp().globalData.ser_url + '/index.php?app=invoice&mod=invoice_add_xcx',
		  data: request_data,
		  dataType: 'json',
		  success: function (result) {
		    if (result.data.state == 250) {
		      errorTipsShow(that, result.data.msg);
		    } else {
		      if (inv_state == 1) {
		        inv_con += that.$L('[普票]  ') + inv_title + that.invoice_content;
		      } else {
		        inv_con += that.$L('[增票]  ') + that.zz_danweiname;
		      } //最后将数据存缓存
		
		
		      uni.setStorageSync('has_sele_inv', 1);
		      uni.setStorageSync('is_need_inv', inv_id);
		      uni.setStorageSync('sele_inv_id', result.data.inv_id);
		      uni.setStorageSync('sele_inv_con', inv_con); //返回确认订单页面
		
		      uni.navigateBack({
		        delta: 1
		      });
		    }
		  }
		});
	}
  }
};
</script>
<style>
page {
  background-color: #f0f2f5;
  width: 750rpx;
  margin: 0 auto;
}

.bbctouch-main-layout {
  display: block;
  background-color: #f5f5f5;
  width: 750rpx;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
}

.bbctouch-main-layout:after {
  height: 1px;
  content: '';
  width: 100%;
  border-top: 1px solid #e3e5e9;
  position: absolute;
  top: 0;
  right: 0;
  transform: scaleY(0.5);
  -webkit-transform: scaleY(0.5);
  z-index: 1;
}

.bbctouch-sel-box {
  display: block;
  background: #fff;
  padding: 0 37rpx;
}

.bbctouch-sel-box .tit {
  display: block;
  padding: 23rpx 0;
  font-size: 30rpx;
  line-height: 42rpx;
  color: #232326;
}

.bbctouch-sel-box .sel-con {
  padding: 0 0 23rpx 0;
  display: block;
}

.bbctouch-sel-box .sel-con a {
  display: inline-block;
  width: auto;
  /* height: 42rpx; */
  padding: 7rpx 23rpx;
  margin: 14rpx 014rpx 0 0;
  font-size: 25rpx;
  color: #888;
  line-height: 42rpx;
  background: #fff;
  border: solid 1rpx #eee;
  border-radius: 7rpx;
}

.bbctouch-sel-box .sel-con a {
  display: inline-block;
  /* height: 42rpx; */
  padding: 7rpx 23rpx;
  margin: 14rpx 14rpx 0 0;
  font-size: 25rpx;
  color: #888;
  line-height: 42rpx;
  background: #fff;
  border: solid 1rpx #eee;
  border-radius: 7rpx;
}

.bbctouch-sel-box .sel-con a.sel {
  color: #fff;
  background: #f23030;
}

.bbctouch-sel-list {
  background-color: #fff;
  margin-top: 23rpx;
  display: block;
  padding: 20rpx;
}

.bbctouch-sel-list label{
	display: flex;
	align-items: center;
	flex-direction: row;
	padding-bottom: 5rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.bbctouch-sel-list label i {
  position: relative;
  display: inline-block;
  width: 35rpx;
  height: 35rpx;
  margin-right: 10rpx;
  background-color: #f5f5f5;
  border: 1rpx solid #ccc;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  vertical-align: middle;
}

.bbctouch-sel-list label input[type="radio"] {
  display: none;
}

.bbctouch-sel-list a.del-invoice {
  position: absolute;
  z-index: 1;
  top: 23rpx;
  right: 23rpx;
  display: block;
  width: 37rpx;
  height: 42rpx;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 80%;
}

.del-invoice, .del-address {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  color: #f4133d;
}

.bbctouch-sel-list .add_inv {
  position: relative;
  z-index: 1;
  display: inline-block;
  height: 42rpx;
  padding: 23rpx 0;
  margin: 0 23rpx;
  font-size: 26rpx;
  line-height: 42rpx;
  border-bottom: solid 1rpx #eee;
  color: #232326;
}

.btn-l {
  display: inline-block;
  width: 90%;
  margin: 0 5%;
  font-size: 30rpx;
  line-height: 79rpx;
  text-align: center;
  color: #fff;
  background: #f23030;
  border-radius: 12rpx;
  margin-bottom: 46rpx;
}

.mt10 {
  margin-top: 46rpx !important;
}

.bbctouch-sel-list label.checked i {
  border-color: #f23030;
  background-color: #f23030;
}

.bbctouch-sel-list label.checked i:after {
  content: '';
  position: absolute;
  left: 6rpx;
  top: 8rpx;
  width: 19rpx;
  height: 10rpx;
  border-left: 3rpx solid #fff;
  border-bottom: 3rpx solid #fff;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.bbctouch-inp-con {
  display: block;
  clear: both;
}

.bbctouch-inp-con ul {
  background: #fff;
  display: block;
}

.bbctouch-inp-con ul li {
  position: relative;
  z-index: 1;
  display: block;
  min-height: 90rpx;
  margin-left: 23rpx;
  background-color: #fff;
  border-bottom: solid #eee 1rpx;
}

.bbctouch-inp-con ul li .inv_content_text {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 140rpx;
  font-size: 28rpx;
  line-height: 90rpx;
  color: #444;
  text-align: left;
}

.bbctouch-inp-con ul li .input-box {
  display: block;
  height: 88rpx;
  margin: 0 23rpx 0 161rpx;
  position: relative;
  z-index: 1;
}

.bbctouch-inp-con .input-box.btn-style label.checked {
  padding: 7rpx 25rpx !important;
  color: #fff !important;
  background: #f23030 !important;
  border: none !important;
}

.bbctouch-inp-con .input-box.btn-style label {
  display: inline-block !important;
  height: 42rpx !important;
  padding: 7rpx 23rpx !important;
  margin: 14rpx 14rpx 0 0 !important;
  font-size: 26rpx !important;
  color: #888 !important;
  line-height: 42rpx !important;
  background: #fff !important;
  border: solid 3rpx #bbb !important;
  border-radius: 7rpx !important;
}

.bbctouch-inp-con .input-box.btn-style .add_inv_text{
	display: inline-block;
	margin-left: 10rpx;
}

.error-tips {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20rpx 0;
  text-align: center;
  border-radius: 8rpx;
  position: fixed;
  z-index: 9999;
  top: 40%;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: #fff;
  font-size: 28rpx;
  line-height: 46rpx;
  box-shadow: 0 0 46rpx rgba(0, 0, 0, 0.15);
  width: 350rpx;
  box-sizing: border-box;
}

.bbctouch-inp-con .input-box label input[type="radio"] {
  display: none;
}

body, input, textarea, select, button, table {
  line-height: 58rpx;
}

.bbctouch-inp-con ul li .input-box .inp {
  height: 88rpx;
  padding: 22rpx;
  border: 0 none;
  font-size: 28rpx;
  line-height: 88rpx;
  color: #000;
}
a{
	text-decoration: none;
}
.store_select {
	width: 32rpx;
	height: 32rpx;
	margin-right: 20rpx;
	}
	.invoice_des{
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		height: 90rpx;
	}
	.invoice_des text{
		font-size: 26rpx;
	}
.bbctouch-inp-con .input-box.btn-style{
	display: flex;
	align-items: center;
}
.bbctouch-inp-con .input-box.btn-style .active{
	padding: 7rpx 25rpx !important;
	color: #fff !important;
	background: #f23030 !important;
	border: none !important;
}
.bbctouch-inp-con .input-box.btn-style text {
  display: inline-block !important;
  /* height: 42rpx !important; */
  padding: 7rpx 23rpx !important;
  margin: 14rpx 14rpx 0 0 !important;
  font-size: 26rpx !important;
  color: #888 !important;
  line-height: 42rpx !important;
  background: #fff !important;
  border: solid 3rpx #bbb !important;
  border-radius: 7rpx !important;
}
.flex_des{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 550rpx!important;
}
.history_invoice_text{
	width:648rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	padding: 12rpx 0;
}
</style>