import {getCurLanguage} from './common.js'
const defaultOptions = {
  method: 'GET',
  dataType: 'json',
  loading: false,
  loadingTxt: getCurLanguage('加载中...')
};
/*
  params: wx.request 的参数，
          额外增加 loading：boolean， 
                  loadingTxt: string 
*/

export default function request(params) {
  let config = { ...defaultOptions,
    ...params
  };
  config.method = config.method.toLocaleUpperCase();

  if (config.method === 'POST') {
    config.header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  if (config.loading) {
    uni.showLoading({
      title: config.loadingTxt
    });
  }

  return new Promise((resolve, reject) => {
    uni.request({ ...config,
      success: res => {
        if (res.data != '') {
          if (res.data.state == 258||res.data.msg == '当前模块未开启'||res.data.msg == '当前活动尚未开启'||res.data.msg == '模块未开启') {
            uni.redirectTo({
              url: '/pages/module_close/module_close'
            });
          } else if (res.data.state == 266) {
            uni.showModal({
              title: getCurLanguage('温馨提示!'),
              content: `${getCurLanguage.$L('需要登录才能操作')}`,
              cancelText:getCurLanguage('取消'),
              confirmText:getCurLanguage('确定'),
              success: res => {
                if (res.confirm) {
                  getApp().globalData.goLogin();
                }
              }
            });
          }
        }

        resolve(res.data);
      },
      error: err => {
        reject(err);
      },
      complete: () => {
        if (config.loading) {
          uni.hideLoading();
        }
      }
    });
  });
}