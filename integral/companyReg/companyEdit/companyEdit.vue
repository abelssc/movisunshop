<template>
<view>
<view class="editHeader">
  <view class="cancel" @tap="calcelHandle">{{$L('取消')}}</view>
  <view class="confirm" @tap="confirmHandle">{{$L('确定')}}</view>
</view> 

<view class="text-wrap" v-if="type!='address' && type!='date' && type!='picker' && type!='picker1' && type!='category'">
	<!-- #ifdef MP-WEIXIN -->
  <input class="txt" :type="type=='idcard'?'idcard':((type=='phone'||type=='number')?'number':'text')" v-model="val" :placeholder="$L('请输入')+title" @input="inputHandle" :maxlength="maxLength"></input>
  <!-- #endif -->
  <!-- #ifndef MP-WEIXIN -->
  <input class="txt" :type="type=='idcard'?'idcard':((type=='phone'||type=='number')?'number':'text')" :value="val" :placeholder="$L('请输入')+title" @input="inputHandle" :maxlength="maxLength"></input>
  <!-- #endif -->
</view>


<view class="text-wrap" v-if="type=='address'">
  <picker mode="multiSelector" :range="addressPickerData" :value="addressSel" range-key="label" @columnchange="addressChange" @change="selAddress">
    <text class="txt">{{val?val:$L('请选择地址')}}</text>
  </picker>
</view>

<view class="text-wrap" v-if="type=='date'">
  <picker mode="date" :range="addressPickerData" @change="selDate">
    <text class="txt">{{val?val:$L('请选择日期')}}</text>
  </picker>
</view>

<view class="text-wrap" v-if="type=='picker'">
  <picker mode="selector" :range="pickerData" :range-key="pickerKey" @change="selPicker">
    <text class="txt">{{val?val:$L('请选择')+title}}</text>
  </picker>
</view>
<view class="text-wrap" v-if="type=='picker1'">
	<picker mode="multiSelector" :range="classifyArr" :range-key="key" @change="classifyChange"
		@columnchange="columnchange" :value="classifyIndex">
		<text class="txt">{{val?val:$L('请选择店铺分类')}}</text>
	</picker>
</view>

<view class="text-wrap" v-if="type=='category'">
  <view class="table">
    <view class="table-title">{{$L('经营类目列表')}}</view>
    <view class="tab-list">
      <text>{{$L('一级类目')}}</text>
      <text>{{$L('二级类目')}}</text>
      <text>{{$L('三级类目')}}</text>
      <text>{{$L('操作')}}</text>
    </view>
    <block v-if="tabList.length">
      <view v-for="(item, index) in tabList" :key="index" class="tab-list tab-item">
        <text>{{item.gc_name1}}</text>
        <text>{{item.gc_name2}}</text>
        <text>{{item.gc_name3}}</text>
        <text :data-index="index" class="del-list" @tap="delcate">{{$L('删除')}}</text>
      </view>
    </block>
  </view>
  <picker mode="multiSelector" :range="categoryData" :value="cateSel" range-key="gc_name" @columnchange="cateChange" @change="selCate">
    <text class="txt">{{$L('请选择经营类目')}}</text>
  </picker>
</view>

<common :title="$L('编辑')"></common>
</view>
</template>

<script>
import request from '../../../utils/request';
function tip(txt, icon) {
  uni.showToast({
    title: txt,
    icon: icon ? icon : 'none'
  });
}

export default {
  data() {
    return {
      title: '',
      key: '',
      // text: 普通文本  phone：手机   idcard：身份证  address: 地址选择  email: 邮箱  date: 日期  number: 数字   tel: 座机或手机 picker: 单列选择器  category： 经营类目
      token: '',
      val: '',
      step: '',
      id: '',
      // 地址id
      addressSel: [0, 0, 0],
      pickerData: [],
      pickerKey: '',
      categoryData: [],
      cateSel: [0, 0, 0],
      tabList: [],
      valid: '',
      addressPickerData: [],
      cateData: "",
	  maxLength:-1,
	  typekey:'',
		classifyArr: [
			[],
			[]
		], // picker - 数据源
		classifyIndex: [0, 0], // picker - 索引
		childArr: [], // 二级分类数据源
		name: this.$L('请选择分类'),
		is_supplier:''
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    uni.setNavigationBarTitle({
        title: this.$L('编辑')
    });
    var key = uni.getStorageSync('token');

    if (key) {
      this.setData({
        token: key
      });
    } else {
      getApp().globalData.goLogin();
    }

    this.setData({ ...options
    });

    if (options.title) {
      uni.setNavigationBarTitle({
        title: options.title
      });
    }
	this.typekey = options.key || '';

    if (options.type == 'address') {
      this.addressInit();
    } else if (options.type == 'picker1') {
	  this.pickerInit1();
	} else if (options.type == 'picker') {
      this.pickerInit();
    } else if (options.type == 'category') {
      this.categoryInit();
      let tabList = uni.getStorageSync('enterin3_tabList') || [];
      this.setData({
        tabList: tabList
      });
    }
  },
  methods: {
    // 输入处理
    inputHandle(e) {
	let tmpData= e.detail.value;
		
	  if(this.typekey == 'paying_money_certificate_explain'){
	  	this.maxLength = 100;
	  }else{
	  	this.maxLength = -1;
	  }
	  
	  
	  if(this.typekey == 'company_registered_capital'){
	  	if(tmpData > 999999999){
	  		uni.showToast({
	  			title:this.$L('超出注册资金最大限制！'),
	  			icon:'none'
	  		})
			tmpData = 999999999;
	  	}
	  }
	  
	  let _this = this;
	  setTimeout(() => {
	  	_this.val = tmpData;
	  }, 0);

    },

    // 取消
    calcelHandle() {
      uni.navigateBack({});
    },

    validName(type, val) {
      return request({
        url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=ajax_check',
        data: {
          type: type,
          val: val,
          key: this.token
        }
      }).then(res => {
        if (res.state == 255) {
          tip(res.msg);
          return false;
        } else {
          return true;
        }
      }).catch(err => {
        return false;
      });
    },

    // 确定
    async confirmHandle() {
      let {
        val,
        type,
        key,
        title,
        id,
        step,
        tabList,
        valid
      } = this;
      let telReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      let phoneReg = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|17[012356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
      let errMsg = ''; // 校验值

      switch (type) {
        case 'text':
          if (!val) {
            errMsg = `${this.$L('请输入')}${title}`;
          }

          break;

        case 'phone':
          if (!val) {
            errMsg = `${this.$L('请输入')}${title}`;
          } else if (!phoneReg.test(val)) {
            errMsg = `${this.$L('请输入正确的')}${title}`;
          }

          break;

        case 'email':
          if (!val) {
            errMsg = `${this.$L('请输入')}${title}`;
          } else if (!emailReg.test(val)) {
            errMsg = `${this.$L('请输入正确的')}${title}`;
          }

          break;

        case 'address':
          if (!id) {
            errMsg = `${this.$L('请选择')}${title}`;
          }

          break;

        case 'idcard':
          if (!val) {
            errMsg = `${this.$L('请输入')}${title}`;
          } else if (!idcardReg.test(val)) {
            errMsg = `${this.$L('请输入正确的')}${title}`;
          }

          break;

        case 'tel':
          if (!val) {
            errMsg = `${this.$L('请输入')}${title}`;
          } else if (!(phoneReg.test(val) || telReg.test(val))) {
            errMsg = `${this.$L('请输入正确的')}${title}`;
          }

          break;

        case 'picker':
          if (!val) {
            errMsg = `${this.$L('请选择')}${title}`;
          }

          break;

        case 'category':
          if (!tabList.length) {
            errMsg = `${this.$L('请选择')}${title}`;
          }

          break;

        case 'date':
          if (!val) {
            errMsg = `${this.$L('请选择')}${title}`;
          }

        default:
          break;
      }

      if (errMsg) {
        tip(errMsg);
        return;
      } // 校验店铺名和商家账号是否存在


      if (valid) {
        let isValid = await this.validName(valid, val);

        if (!isValid) {
          return;
        }
      }

      let page = getCurrentPages();
      let prevPage = page[page.length - 2];
      if (prevPage.$vm.crEdit) {
        let params = {
          key: key,
          val: val
        };

        if (type == 'address') {
          if (key == 'business_licence_address') {
            params.business_licence_address_ids = id;
            uni.setStorage({
              key: 'enterin' + step + '_business_licence_address_ids',
              data: id
            });
          } else {
            params.company_address_ids = id;
            uni.setStorage({
              key: 'enterin' + step + '_company_address_ids',
              data: id
            });
          }
        } else if (id) {
          params.id = id;

          switch (key) {
            case 'sg_name':
              uni.setStorage({
                key: 'enterin' + step + '_sg_id',
                data: id
              });
              break;

            case 'joinin_year_show':
              uni.setStorage({
                key: 'enterin' + step + '_joinin_year',
                data: id
              });
              break;

            case 'sc_name':
              uni.setStorage({
                key: 'enterin' + step + '_sc_id',
                data: id
              });
              break;

            default:
              break;
          }
        }

        if (type == 'category') {
          // 经营类目  id 用逗号隔开， name 用|隔开
          let tval = [];
          let tid = [];
          tabList.map(el => {
            tid.push(el.ids);
            tval.push(el.names);
          });
          params.tabList = tabList;
          params.store_class_ids = tid.join(',');
          params.store_class_names = tval.join('|');
          uni.setStorage({
            key: 'enterin' + step + '_tabList',
            data: tabList
          });
          uni.setStorage({
            key: 'enterin' + step + '_store_class_ids',
            data: params.store_class_ids
          });
          uni.setStorage({
            key: 'enterin' + step + '_store_class_names',
            data: params.store_class_names
          });
        }

        prevPage.$vm.crEdit(params);

        if (val) {
          uni.setStorage({
            key: 'enterin' + step + '_' + key,
            data: val
          });
        }

        uni.navigateBack({});
      }
    },

    // 初始化地址
    addressInit() {
      // 获取地址列表
      let {
        token
      } = this;
      uni.showLoading({
		title: this.$L('正在初始化地址'),
        mask: true
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=address&mod=get_area_data&key=' + token,
        success: res => {
          if (res.data.code == 200) {
            this.addressInfo = res.data.datas.area_list;
            this.initAddressPicker();
          } else {
            uni.hideLoading();
          }
        },
        error: err => {
          uni.hideLoading();
        }
      });
    },

    // 初始化地址选择器
    initAddressPicker() {
      let p = [];
      let c = [];
      let a = [];
      this.addressInfo.map(el => {
        p.push({
          label: el.label,
          value: el.value
        });
      });
      this.addressInfo[0].children.map(el => {
        c.push({
          label: el.label,
          value: el.value
        });
      });
      this.addressInfo[0].children[0].children.map(el => {
        a.push({
          label: el.label,
          value: el.value
        });
      });
      this.setData({
        addressPickerData: [p, c, a],
        addressSel: [0, 0, 0]
      });
      uni.hideLoading();
    },

    // 地址变化
    addressChange(e) {
      let {
        column,
        value
      } = e.detail;
      let addressSel = this.addressSel;
      let c = [];
      let a = [];

      if (column == 0) {
        addressSel = [value, 0, 0];
      } else if (column == 1) {
        addressSel = [addressSel[0], value, 0];
      } else {
        addressSel = [addressSel[0], addressSel[1], value];
      }

      this.setData({
        addressSel
      });

      if (column == 0) {
        this.addressInfo[value].children.map(el => {
          c.push({
            label: el.label,
            value: el.value
          });
        });
        this.addressInfo[value].children[0].children.map(el => {
          a.push({
            label: el.label,
            value: el.value
          });
        });
        this.setData({
          'addressPickerData[1]': c,
          'addressPickerData[2]': a
        });
      }

      if (column == 1) {
        this.addressInfo[addressSel[0]].children[value].children.map(el => {
          a.push({
            label: el.label,
            value: el.value
          });
        });
        this.setData({
          'addressPickerData[2]': a
        });
      }
    },

    // 选择地址
    selAddress(e) {
      let value = e.detail.value;
      let {
        addressPickerData
      } = this;
      let val = `${addressPickerData[0][value[0]].label} ${addressPickerData[1][value[1]].label} ${addressPickerData[2][value[2]].label}`;
      let id = `${addressPickerData[0][value[0]].value}|${addressPickerData[1][value[1]].value}|${addressPickerData[2][value[2]].value}`;
      this.setData({
        addressSel: value,
        val: val,
        id: id
      });
    },

    // 选择日期
    selDate(e) {
      this.setData({
        val: e.detail.value
      });
    },

	columnchange(e) {
		if (e.detail.column == 0) {
			this.classifyArr[1] = this.childArr[e.detail.value];

			let c = this.childArr[e.detail.value]
			// #ifdef APP-PLUS
			this.classifyArr.splice(1, 1, c);
			// #endif
		}

	},
    // picker 类型
    selPicker(e) {
      let index = e.detail.value;
      let {
        key,
        pickerData
      } = this;
      let name = key == 'sg_name' ? 'sg_name' : key == 'sc_name' ? 'sc_name' : '';
      let nid = key == 'sg_name' ? 'sg_id' : key == 'sc_name' ? 'sc_id' : '';
      let val, id;

      if (key == 'joinin_year_show') {
        val = index == 1 ? this.$L('2年') : this.$L('1年');
        id = index == 1 ? '2' : '1';
      } else {
        val = pickerData[index][name];
        id = pickerData[index][nid];
      }

      this.setData({
        val: val,
        id: id
      });
    },

	classifyChange(e) {
		console.log(e);
		let value = e.target.value;
		this.classifyIndex = value;
		let ssm=e.detail.value[0];
		console.log(ssm);
		console.log(this.classifyArr)
		if(this.classifyArr[1][0]){
			uni.setStorageSync('sc_id', this.classifyArr[1][0].sc_id);
		}else{
			uni.setStorageSync('sc_id', this.classifyArr[0][ssm].sc_id);
		}
		
		if (this.classifyArr[0].length != 0) {
			this.val = this.classifyArr[0][this.classifyIndex[0]].sc_name
		};

		if (this.classifyArr[1].length != 0) {
			this.val += ',' + this.classifyArr[1][this.classifyIndex[1]].sc_name
		}
	},
	
    // pickerInit
    pickerInit() {
      let {
        key,
        token,
		is_supplier
      } = this;

      if (key == 'joinin_year_show') {
        this.setData({
          pickerData: [this.$L('1年'), this.$L('2年')]
        });
        return;
      }

      let url = key == 'sg_name' ? '/index.php?app=enterin&mod=getGradeList&is_supplier='+ is_supplier +'&key=' + token : key == 'sc_name' ? '/index.php?app=enterin&mod=getVendorCategoryList&key=' + token : '';
      uni.request({
        url: getApp().globalData.ser_url + url,
        success: res => {
          if (res.data.datas.state == 200) {
			this.classifyArr[0].forEach(item => {
				delete item.children
			})
            let arr = res.data.datas.data;
            let pickerKey = key == 'sg_name' ? 'sg_name' : key == 'sc_name' ? 'sc_name' : '';

            if (key == 'sc_name') {
              arr.forEach(el => {
                el.sc_name = el.sc_name.replace(new RegExp(/\&nbsp;/g), '');
              });
            }

            this.setData({
              pickerData: arr,
              pickerKey: pickerKey
            });
          }
        }
      });
    },
	pickerInit1() {
		let {
			key,
			token
		} = this;
		if (key == 'joinin_year_show') {
			this.setData({
				pickerData: [this.$L('1年'), this.$L('2年')]
			});
			return;
		}
		let url = key == 'sg_name' ? '/index.php?app=enterin&mod=getGradeList&key=' + token : key == 'sc_name' ?
			'/index.php?app=enterin&mod=getVendorCat&key=' + token : '';
		uni.request({
			url: getApp().globalData.ser_url + url,
			success: res => {
				console.log(res, 111);
				let dataLen = res.data.list;
				for (let i = 0; i < dataLen.length; i++) {
					this.childArr.push(dataLen[i].children)
				};
				this.classifyArr = [res.data.list, this.childArr[0]]
				this.classifyArr[0] = res.data.list;
				this.classifyArr[1] = this.childArr[0];
			}
		});
	},

    // 经营类目
    categoryInit() {
      uni.showLoading({
        title: this.$L('正在加载...')
      });
      uni.request({
        url: getApp().globalData.ser_url + '/index.php?app=enterin&mod=getAllGcList&key=' + this.token,
        success: res => {
          if (res.data.datas.state == 200) {
            let data = res.data.datas.data;
            let o = [];
            let w = [];
            let t = [];
            let categoryData = [];
            data.map(el => {
              o.push({
                gc_name: el.gc_name,
                gc_id: el.gc_id
              });
            });
            data[0].childs && data[0].childs.map(el => {
              w.push({
                gc_name: el.gc_name,
                gc_id: el.gc_id
              });
            });
            data[0].childs && data[0].childs[0].childs && data[0].childs[0].childs.map(el => {
              t.push({
                gc_name: el.gc_name,
                gc_id: el.gc_id
              });
            });

            if (o.length) {
              categoryData.push(o);
            }

            if (w.length) {
              categoryData.push(w);
            }

            if (t.length) {
              categoryData.push(t);
            }

            this.setData({
              categoryData: categoryData,
              cateData: data
            });
          }

          uni.hideLoading();
        }
      });
    },

    // 经营类目变化回调
    cateChange(e) {
      let {
        column,
        value
      } = e.detail;
      let cateData = this.cateData;
      let cateSel = this.cateSel;
      let w = [];
      let t = [];

      if (column == 0) {
        cateSel = [value, 0, 0];
      } else if (column == 1) {
        cateSel = [cateSel[0], value, 0];
      } else {
        cateSel = [cateSel[0], cateSel[1], value];
      }

      this.setData({
        cateSel
      });

      if (column == 0) {
        cateData[value].childs && cateData[value].childs.map(el => {
          w.push({
            gc_name: el.gc_name,
            gc_id: el.gc_id
          });
        });
        cateData[value].childs && cateData[value].childs[0].childs && cateData[value].childs[0].childs.map(el => {
          t.push({
            gc_name: el.gc_name,
            gc_id: el.gc_id
          });
        });
        this.setData({
          'categoryData[1]': w,
          'categoryData[2]': t
        });
      }

      if (column == 1) {
        cateData[cateSel[0]].childs[value].childs && cateData[cateSel[0]].childs[value].childs.map(el => {
          t.push({
            gc_name: el.gc_name,
            gc_id: el.gc_id
          });
        });
        this.setData({
          'categoryData[2]': t
        });
      }
    },

    selCate(e) {
      let value = e.detail.value;
      let {
        categoryData,
        tabList
      } = this;
      let ids = [categoryData[0][value[0]].gc_id],
          names = [categoryData[0][value[0]].gc_name];
      let val = {
        gc_name1: categoryData[0][value[0]].gc_name,
        gc_id1: categoryData[0][value[0]].gc_id
      };

      if (categoryData[1].length) {
        val.gc_name2 = categoryData[1][value[1]].gc_name;
        val.gc_id2 = categoryData[1][value[1]].gc_id;
        ids.push(categoryData[1][value[1]].gc_id);
        names.push(categoryData[1][value[1]].gc_name);
      }

      if (categoryData[2].length) {
        val.gc_name3 = categoryData[2][value[2]].gc_name;
        val.gc_id3 = categoryData[2][value[2]].gc_id;
        ids.push(categoryData[2][value[2]].gc_id);
        names.push(categoryData[2][value[2]].gc_name);
      }

      val.ids = ids.join('|');
      val.names = names.join(' ');

      for (let i in tabList) {
        if (tabList[i].ids == val.ids) {
          tip(this.$L('已存在该分类'));
          return;
        }
      }

      tabList.push(val);
      this.setData({
        cateSel: value,
        tabList: tabList
      });
    },

    // 删除经营类目 
    delcate(e) {
      let index = e.currentTarget.dataset.index;
      let {
        tabList
      } = this;
      tabList.splice(index, 1);
      this.setData({
        tabList: tabList
      });
    }

  }
};
</script>
<style>
page {
  background-color: #f3f3f3;
  width: 750rpx;
  margin: 0 auto;
}

.editHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  font-size: 30rpx;
  background-color: #fff;
}

.editHeader .cancel {
  line-height: 80rpx;
  padding: 0 30rpx;
  color: #ff4f4f;
}

.editHeader .confirm {
  line-height: 80rpx;
  padding: 0 30rpx;
  color: #4aa600;
}

.text-wrap {
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-top: 20rpx;
}

.text-wrap .txt {
  border: none;
  line-height: 40rpx;
  color: #333;
  font-size: 26rpx;
}

.table {
  text-align: center;
  margin-bottom: 30rpx;
}

.table-title {
  line-height: 60rpx;
  color: #313131;
  font-size: 30rpx;
}

.tab-list {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  width: 648rpx;
  margin: 0 auto;
}

.tab-list text {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 162rpx;
  border-right: 1rpx solid #fff;
  border-bottom: 1rpx solid #fff;
  height: 90rpx;
  line-height: 45rpx;
  padding: 0 10rpx;
  font-size: 26rpx;
  color: #6d6d6d;
  box-sizing: border-box;
  background-color: #f0eeee;
}

.tab-list.tab-item text {
  background-color: #f7f7f7;
  height: inherit;
  padding: 10rpx 10rpx;
}

.tab-list.tab-item text.del-list {
  font-size: 28rpx;
  color: #f00;
}

</style>