import Vue from 'vue';
import App from './App';
import {getPartNumber, setCookie, countDown,isWeiXinBrower,linkTo,weiXinBrowerShare,weiXinAppShare,groupNum,formatPercent,checkUpdate,toFloat,toNum,toSplit,getCurLanguage} from './utils/common.js'
import common from "./component/common/common";

Vue.prototype.$getPartNumber = getPartNumber;
Vue.prototype.$countDown = countDown
Vue.prototype.$setCookie = setCookie;
Vue.prototype.$isWeiXinBrower = isWeiXinBrower;
Vue.prototype.$weiXinBrowerShare = weiXinBrowerShare;
Vue.prototype.$weiXinAppShare = weiXinAppShare;
Vue.prototype.$linkTo = linkTo
Vue.prototype.$groupNum = groupNum
Vue.prototype.$formatPercent = formatPercent
Vue.prototype.$checkUpdate = checkUpdate;
Vue.prototype.$toFloat = toFloat;
Vue.prototype.$toNum = toNum;
Vue.prototype.$toSplit = toSplit;
Vue.prototype.$L = getCurLanguage;
Vue.component("common", common);

import DiyTabBar from "./component/DiyTabBar/DiyTabBar";
Vue.component("DiyTabBar", DiyTabBar);

import tsCommon from "./component/tsCommon/tsCommon";
Vue.component("tsCommon", tsCommon);

import sldMenu from "./component/sldMenu/sldMenu";
Vue.component("sldMenu", sldMenu);

import addressSelect from "./component/addressSelect/addressSelect";
Vue.component("addressSelect", addressSelect);

import DiyPage from "./component/DiyPage/DiyPage";
Vue.component("DiyPage", DiyPage);

Vue.config.productionTip = false;


Vue.mixin({
	methods: {
		setData: function(obj, callback) {
			let that = this;
			const handleData = (tepData, tepKey, afterKey) => {
				tepKey = tepKey.split('.');
				tepKey.forEach(item => {
					if (tepData[item] === null || tepData[item] === undefined) {
						let reg = /^[0-9]+$/;
						tepData[item] = reg.test(afterKey) ? [] : {};
						tepData = tepData[item];
					} else {
						tepData = tepData[item];
					}
				});
				return tepData;
			};
			const isFn = function(value) {
				return typeof value == 'function' || false;
			};
			Object.keys(obj).forEach(function(key) {
				let val = obj[key];
				key = key.replace(/\]/g, '').replace(/\[/g, '.');
				let front, after;
				let index_after = key.lastIndexOf('.');
				if (index_after != -1) {
					after = key.slice(index_after + 1);
					front = handleData(that, key.slice(0, index_after), after);
				} else {
					after = key;
					front = that;
				}
				if (front.$data && front.$data[after] === undefined) {
					Object.defineProperty(front, after, {
						get() {
							return front.$data[after];
						},
						set(newValue) {
							front.$data[after] = newValue;
							that.$forceUpdate();
						},
						enumerable: true,
						configurable: true
					});
					front[after] = val;
				} else {
					that.$set(front, after, val);
				}
			});
			// this.$forceUpdate();
			isFn(callback) && this.$nextTick(callback);
		}
	}
});

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
