import {lang_zn} from "../static/language/zh.js";
import {lang_en} from "../static/language/en.js";
// #ifdef H5
var jweixin = require('../jweixin'); //引入微信浏览器分享的jssdk
// #endif 

// 倒计时 获取记录现在的 小时 分钟 秒
function getLeftTimerData(enddate) {
	var timer_data = {};
	enddate = enddate.replace(/-/g, '/');
	var leftTime = new Date(enddate) - new Date(); //计算剩余的毫秒数

	var day = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余天数

	var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余小时

	var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟

	var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
	//   var hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
	//   var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
	//   var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

	day = checkTime(day);
	hours = checkTime(hours);
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	timer_data.day = day;
	timer_data.hours = hours;
	timer_data.minutes = minutes;
	timer_data.seconds = seconds;
	return timer_data;
}

//将0-9的数字前面加上0，例1变为01
function checkTime(i) {
	if (i < 10) {
		i = i < 0 ? 0 : i;
		i = "0" + i;
	}

	return i;
} // e 			微信的 this
// time_obj		赋值的对象
// end_time_str	结束时间 字符串(例如：2018/12/03 12:32)


export function run_clock(e, end_time_str, time_obj = '') {
	var timer_data = {};
	let intervalId = '';

	if (end_time_str) {
		timer_data = getLeftTimerData(end_time_str);

		if (timer_data) {
			var starttime = new Date(end_time_str);
			intervalId = setInterval(function() {
				timer_data = getLeftTimerData(end_time_str);

				if (time_obj) {
					var item_obj = {};
					item_obj[time_obj] = timer_data;
					e.setData(item_obj);
				} else {
					e.setData(timer_data);
				}
			}, 1000);
		}
	}

	return intervalId;
}
/** 
 * 
 * json转字符串 
 */

export function stringToJson(data) {
	return JSON.parse(data);
}
/** 
 *字符串转json 
 */

export function jsonToString(data) {
	return JSON.stringify(data);
}
/** 
 *map转换为json 
 */

export function mapToJson(map) {
	return JSON.stringify(strMapToObj(map));
}
/** 
 *json转换为map 
 */

export function jsonToMap(jsonStr) {
	return objToStrMap(JSON.parse(jsonStr));
}
/** 
 *map转化为对象（map所有键都是字符串，可以将其转换为对象） 
 */

export function strMapToObj(strMap) {
	let obj = Object.create(null);

	for (let [k, v] of strMap) {
		obj[k] = v;
	}

	return obj;
}
/** 
 *对象转换为Map 
 */

export function objToStrMap(obj) {
	let strMap = new Map();

	for (let k of Object.keys(obj)) {
		strMap.set(k, obj[k]);
	}

	return strMap;
} // 检查字符串是否全是空格

export function checkSpace(str) {
	return str.trim() == "" ? true : false;
} // 获取分享的scene里面的参数纸

export function getSceneParam(str, key) {
	let res = '';
	let param_str = str.split('?');

	if (param_str[1]) {
		let param_array = param_str[1].split('&');

		for (let i in param_array) {
			let tmp_data = param_array[i].split('=');

			if (tmp_data[0] == key) {
				res = tmp_data[1];
				break;
			}
		}
	}

	return res;
}


// 装修类型判断
export function decoType(info) {
	let deco_obj = {}
	deco_obj.tupianzuhe = []
	// deco_obj.gonggao = []
	info.map(item => {
		if (item.type == 'more_tab') { //tab切换
			deco_obj.more_tab = {
				border_radius: item.border_radius,
				data: item.data,
			}
		} else if (item.type == 'lunbo') { //轮播图
			deco_obj.lunbo = {
				is_show: item.is_show,
				data: item.data
			}
		} else if (item.type == 'gonggao') { //公告
			if (item.show_style == 'one') {
				deco_obj.gonggao1 = {
					show_style: item.show_style,
					text: item.text,
					is_show: item.is_show,
				}
			} else {
				deco_obj.gonggao2 = {
					show_style: item.show_style,
					text: item.text,
					is_show: item.is_show,
				}
			}
		} else if (item.type == 'top_cat_nav') { //顶部轮播图
			deco_obj.top_cat_nav = {
				swiper_bg_style: item.swiper_bg_style,
				data: item.data
			}
		} else if (item.type == 'nav') { //导航
			deco_obj.nav = {
				is_show: item.is_show,
				data: item.data,
				icon_set: item.icon_set
			}
		} else if (item.type == 'kefu') { //客服
			deco_obj.kefu = {
				is_show: item.is_show,
				tel: item.tel,
				text: item.text
			}
		} else if (item.type == 'fuwenben') { //富文本
			deco_obj.fuwenben = {
				is_show: item.is_show,
				text: item.text
			}
		} else if (item.type == 'tupianzuhe') { //图片组合
			deco_obj.tupianzuhe.push({
				is_show: item.is_show,
				sele_style: item.sele_style,
				width: item.width,
				height: item.height,
				data: item.data,
			})
		} else if (item.type == 'dapei') { //搭配
			deco_obj.dapei = {
				is_show: item.is_show,
				dapei_desc: item.dapei_desc,
				dapei_img: item.dapei_img,
				data: item.data,
				width: item.width,
				height: item.height
			}
		} else if (item.type == 'fzx') { //辅助线
			deco_obj.fzx = {
				color: item.color,
				is_show: item.is_show,
				lrmargin: item.lrmargin,
				tbmargin: item.tbmargin,
				type: item.val
			}
		} else if (item.type == 'tuijianshangpin') { //推荐商品
			deco_obj.recommond_goods = {
				border_style: item.border_style,
				data: item.data,
				goods_margin: item.goods_margin,
				is_show: item.is_show,
				page_margin: item.page_margin,
				show_style: item.small,
				text_align: item.text_align,
				text_style: item.normal,
				isshow_sales: item.isshow_sales
			}
		} else if (item.type == 'fzkb') { //辅助空白
			deco_obj.fzkb = {
				color: item.color,
				is_show: item.is_show,
				text: item.text,
			}
		}
	})
	return deco_obj
}

/*
 * 返回一个数字的整数和小数
 * number 需要处理的数据
 * type: 要获取的数据 int 整数  decimal 小数
 */
export function getPartNumber(number, type) {
	let target = '';
	if (number == undefined) {
		return false;
	}
	number = number.toString();
	if (type == 'int') {
		target = number.split('.')[0];
	} else if (type == 'decimal') {
		target = number.split('.')[1] != undefined ? ('.' + number.split('.')[1]) : '.00';
		if (target.length < 3) {
			target += '0';
		}
	}
	return target;
}

//设置cookie，判断是否弹出开屏
export function setCookie() {
	uni.setStorage({
		key: 'cookie',
		data: 'cookie'
	});
}

// 首页装修跳转
export function linkTo(key, url, info) {
	let token = uni.getStorageSync('token');
	if (key == 'url') { //链接地址
		// #ifdef H5
		window.open(url)
		// #endif

		// #ifdef APP-PLUS
		plus.runtime.openURL(url) //这里默认使用外部浏览器打开而不是内部web-view组件打开
		// #endif

		// #ifdef MP
		// uni.navigateTo({
		// 	url: '/pages/index/skip_to?url=' + url
		// })
		// #endif
	} else if (key == 'keyword') { //关键字
		uni.navigateTo({
			url: '/pages/goods_list/goods_list?keyword=' + url
		})
	} else if (key == 'goods') { //商品详情
		uni.navigateTo({
			url: '/pages/goods_detail/goods_detail?gid=' + (info ? info.gid : url)
		})
	} else if (key == 'category') { //商品分类
		uni.navigateTo({
			url: '/pages/goods_list/goods_list?gc_id=' + (info ? info.gc_id : url)
		})
	} else if (key == 'topic') { //专题
		uni.navigateTo({
			url: '/pages/found/subject?u=' + info.id
		})
	} else if (key == 'store') { //店铺
		uni.navigateTo({
			url: '/pages/shopHomePage/shopHomePage?vid=' + (info ? info.vid : url)
		})
	} else if (key == 'voucher') { //优惠券
		if (!token) {
			uni.showToast({
				title: getCurLanguage('请登录'),
				icon: 'none'
			});
			return
		}
		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=red&mod=send_red&sld_addons=red',
			data: {
				key: token,
				red_id: info.id
			},
			success: res => {
				if (res.data.datas == 1) {
					uni.showToast({
						title: getCurLanguage('领取成功'),
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.data.datas,
						icon: 'none'
					});
				}
			}
		});
	} else if (key == 'live') { //直播
		uni.navigateTo({
			url: '/addons/pages/livePlay/livePlay?live_id=' + (info ? info.live_id : url)
		})
	} else if (key == 'svideo') { //短视频
		uni.navigateTo({
			url: '/addons/pages/svideoPlay/svideoPlay?video_id=' + (info ? info.video_id : url)
		})
	} else if (key == 'sign') { //签到
		if (!token) {
			uni.showToast({
				title: getCurLanguage('请登录'),
				icon: 'none'
			});
			return
		}
		uni.navigateTo({
			url: '/pages/singIn/singIn'
		})
	} else if (key == 'store_list') { //店铺街
		uni.navigateTo({
			url: '/pages/shoplist/shoplist'
		})
	} else if (key == 'voucher_center') { //领券中心
		if (!token) {
			uni.showToast({
				title: getCurLanguage('请登录'),
				icon: 'none'
			});
			return
		}
		uni.navigateTo({
			url: '/pages/red/red_get_list'
		})
	} else if (key == 'spreader') { //推手系统
		uni.navigateTo({
			url: '/addons/pages/tsIndex/tsIndex'
		})
	} else if (key == 'O2O') { //O2O模块
		uni.navigateTo({
			url: '/ldj/pages/index/index'
		})
	} else if (key == 'svideo_home') { //短视频首页
		uni.navigateTo({
			url: '/addons/pages/svideoList/svideoList'
		})
	} else if (key == 'live_home') { //直播首页
		uni.navigateTo({
			url: '/addons/pages/liveList/liveList'
		})
	} else if (key == 'points') { //积分商城
		uni.navigateTo({
			url: '/integral/pages/index/index'
		})
	} else if (key == 'group_home') { //团购首页
		uni.navigateTo({
			url: '/integral/activity/tuan_index/tuan_index'
		})
	} else if (key == 'discount_home') { //限时折扣首页
		uni.navigateTo({
			url: '/integral/activity/discount/discount'
		})
	} else if (key == 'pin_home') { //拼团首页
		uni.navigateTo({
			url: '/integral/activity/pin_index/pin_index'
		})
	} else if (key == 'presale_home') { //预售首页
		uni.navigateTo({
			url: '/addons/pages/presaleIndex/presaleIndex'
		})
	} else if (key == 'ladder_home') { //阶梯团首页
		uni.navigateTo({
			url: '/addons/pages/ladderIndex/ladderIndex'
		})
	} else if (key == 'seckill') { //秒杀首页
		uni.navigateTo({
			url: '/addons/pages/seckill/seckill?activity_id='+url
		})  
	}
}

// 倒计时
export function countDown(time) {
	let now_date = new Date()
	let date = now_date.getTime()
	let last_time = time * 1000 - date
	var d = Math.floor(last_time / 1000 / 60 / 60 / 24);
	var h = Math.floor(last_time / 1000 / 60 / 60 % 24);
	var m = Math.floor(last_time / 1000 / 60 % 60);
	var s = Math.floor(last_time / 1000 % 60);
	return h + ':' + m + ':' + s
}
// 首页装修已团件数格式化处理
export function groupNum(num){
	if(num > 0 && num < 100){
		return num
	}else if(num >= 100 && num < 10000){
		return '99+'
	}else{
		return (num/10000).toFixed(1)
	}
}

/** 
 * 判断是否是微信浏览器
 * 
 * @zjf-2020-11-06
 */
export function isWeiXinBrower() {
	//#ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true; // 微信中打开
	} else {
		return false; // 普通浏览器中打开
	}
	//#endif
	//#ifndef H5
	 return false;
	//#endif
}

/** 
 * 微信浏览器里面的分享功能
 * type 分享类型  1 为微信好友分享 2为微信朋友圈分享
 * shareData  分享数据数组 里面的参数分别如下：
 * 		title: '', // 分享标题
 * 		desc: '', // 分享描述
 * 		link: '', // 分享链接
 * 		imgUrl: '', // 分享图片
 * 		type: '', // 分享类型,music、video或link，不填默认为link
 * 		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
 * isTs 是否推手模块，默认false
 * @zjf-2020-11-06
 */
export function weiXinBrowerShare(type, shareData,isTs=false) {
	let tar_url = getApp().globalData.ser_url + '/index.php?app=jssdk&mod=getJssdkConfig';
	if(isTs){
		tar_url += '&sld_addons=spreader';
	}
	
	uni.request({
		url: tar_url,
		method: 'GET',
		data: {
			url: location.href
		},
		success(res) {
			let data = res.data;
			// #ifdef H5
			jweixin.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.datas.config.appId, // 必填，公众号的唯一标识
				timestamp: data.datas.config.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.datas.config.nonceStr, // 必填，生成签名的随机串
				signature: data.datas.config.signature, // 必填，签名
				jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表
			});
			jweixin.ready(function() {
				if (type == 1) {
					//获取“分享给朋友”按钮点击状态及自定义分享内容接口
					jweixin.updateAppMessageShareData({
						title: shareData.title!=undefined?shareData.title:'', // 分享标题
						desc: shareData.desc!=undefined?shareData.desc:'', // 分享描述
						link: shareData.link!=undefined?shareData.link:'', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: shareData.imgUrl, // 分享图标
						type: '', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {

						}
					})
				} else if (type == 2) {
					//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
					wx.updateTimelineShareData({ 
					    title: shareData.title!=undefined?shareData.title:'', // 分享标题
					    link: shareData.link!=undefined?shareData.link:'', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					    imgUrl: shareData.imgUrl, // 分享图标
					    success: function () {
					      // 设置成功
					    }
					  })

				}
			})
			//#endif
		}
	})
}

/** 
 * APP微信分享功能
 * type 分享类型  0 图文 2 图片
 * scene 场景  WXSceneSession 分享朋友   WXSenceTimeline 分享朋友圈
 * shareData  分享数据数组 里面的参数分别如下：
 * 	  1、图文数据
 * 		href: '', // 分享链接
 * 		title: '', // 分享标题
 * 		summary: '', // 分享描述
 * 		imageUrl: '', // 分享图片
 * 	  2、图片数据
 * 		imageUrl: '', // 分享图片
 * 
 * @zjf-2020-11-12
 */
export function weiXinAppShare(type, scene, shareData,gid,ssys_key) {
	if(type == 0){
		//分享图文
		uni.share({
		    provider: "weixin",
		    scene: scene,
		    type: type,//0为图文
		    href: shareData.href,
		    title: shareData.title,
		    summary: shareData.summary,
		    imageUrl: shareData.imageUrl,//图片,图片过大的话不展示，建议小于20kb
		    success: function (res) {
				if(gid&&ssys_key){
				uni.request({
					url: getApp().globalData.ser_url + '/index.php?app=index&mod=add_up_goods_num&sld_addons=spreader',
					method: 'GET',
					data: {
						ssys_key: ssys_key,
						gid:gid
					},
					success(res) {
						}
					})
				}
		    },
		    fail: function (err) {
		    }
		});
	}else if(type == 2){
		//分享图片
		uni.share({
		    provider: "weixin",
		    scene: scene,
		    type: type,//2为图片
		    imageUrl: shareData.imageUrl,//图片,图片过大的话不展示，建议小于20kb
		    success: function (res) {
		    },
		    fail: function (err) {
		    }
		});
	}
}

export function formatPercent(val){
	return val.substring(0,val.length-1)
}

/*
 * 检查APP是否需要更新
 */
export function checkUpdate() {
	let cur_platform = uni.getSystemInfoSync().platform;
	let cur_edition =  plus.runtime;
	let tar_url = getApp().globalData.ser_url + '/index.php?app=index&mod=getSldAppV2Info';
	uni.request({
		url: tar_url,
		method: 'GET',
		success(res) {
			if (res.data.state == 200) {  
					if(res.data.data[`appv2_${cur_platform}_version`]&&cur_edition.version*1 < res.data.data[`appv2_${cur_platform}_version`]*1){
						//需要整包升级
						uni.showModal({ //提醒用户更新   
							title: getCurLanguage('更新提示'),
							content: res.data.data[`appv2_${cur_platform}_update_tips`],  
							cancelText:getCurLanguage('取消'),
							confirmText:getCurLanguage('确定'),
							success: (result) => {   
								if (result.confirm) {    
									plus.runtime.openURL(res.data.data[`appv2_${cur_platform}_download`]);  
								}  
							}  
						})
						return;
					}
					if(res.data.data[`appv2_${cur_platform}_version`]&&res.data.data[`appv2_${cur_platform}_hot_version`]&&cur_edition.version*1 == res.data.data[`appv2_${cur_platform}_version`]*1&&cur_edition.versionCode < res.data.data[`appv2_${cur_platform}_hot_version`]*1){
						let curVersinCode = uni.getStorageSync('curVersionCode');
						if(curVersinCode&&curVersinCode*1>=res.data.data[`appv2_${cur_platform}_hot_version`]*1){
							return false;
						}
						//热更新
						uni.showModal({ //提醒用户更新
							title: getCurLanguage('更新提示'),
							content: res.data.data[`appv2_${cur_platform}_update_tips`],
							cancelText:getCurLanguage('取消'),
							confirmText:getCurLanguage('确定'),
							success: (result) => {  
								if (result.confirm) {
									uni.downloadFile({  
										url: res.data.data[`appv2_${cur_platform}_hot_download`],  
										success: (downloadResult) => {
											if (downloadResult.statusCode === 200) {  
												plus.runtime.install(downloadResult.tempFilePath, {  
													force: true  
												}, function() {  
													uni.setStorageSync('curVersionCode', res.data.data[`appv2_${cur_platform}_hot_version`]*1);
													console.log('install success...');  
													plus.runtime.restart();  
												}, function(e) {  
													console.error('install fail...',e);  
												});  
											}  
										}  
									});
								}  
							}  
						})  
						return;
					}
			} 
		}
	})
}

export function toFloat(value) {
    return parseFloat(value);
}

export function toNum(value) {
    return Number(value);
}

// 价格分割
export function toSplit(value) {
    return (value + "").split('.');
}

// 更新购物车角标
export function UpdateCart() {
	// console.log('------更新购物车角标------');
	let key = uni.getStorageSync('token');
	let uuid = uni.getStorageSync('uuid');
	if (!key) {
		//未登录
		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=cache_cart&mod=cart_list',
			data: {
				key: uuid,
				cart_type: 'buy'
			},
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
				let num = res.data.datas.cart_num
				// console.log('未登录:'+num);
				if(num>0){
					uni.setTabBarBadge({
						index: 3,
						text: ''+num
					})
				}else{
					uni.removeTabBarBadge({
						index: 3
					})
				}
			},
		});
	} else {
		//已登录
		uni.request({
			url: getApp().globalData.ser_url + '/index.php?app=cart&mod=cart_list_store_new',
			data: {
				key: key,
				cart_type: 'buy'
			},
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
				let num = res.data.datas.cart_num
				// console.log('已登录:'+num);
				if(num>0){
					uni.setTabBarBadge({
						index: 3,
						text: ''+num
					})
				}else{
					uni.removeTabBarBadge({
						index: 3
					})
				}
			}
		});
	}
}

/*
 * 获取当前语言下的数据 —— Object类型
 * 返回对象  语言数据对象
 * @zjf-2020-12-28
 * */
export function getCurLanguage(key) {
 // let curLang = getApp().globalData.curLang;
 let curLang = uni.getStorageSync('curLang') || 'zh_cn';
 if (curLang == 'zh_cn') {
  return key;
 } else {
  const language = {
   'en': lang_en,
  }
  let curData = language[curLang][key];
  return curData != undefined && curData ? curData : '语言包中缺少该数据'; //此处不要翻译
 }
}