import regeneratorRuntime from "../libs/regenerator-runtime/runtime-module";
let ssys_expire_day = 0; // 推手过期天数

const one_day_time = 24 * 60 * 60 * 1000; // 商品详情推手

const tsGoodsInit = async (gid, shareId) => {
  let tsStatus = await checkTsStatus();

  if (tsStatus) {
    ssys_expire_day = await getTsSetting();
    getAllGid(gid, shareId, ssys_expire_day);
  }
}; // 确认订单推手


const tsConfirmOrderInit = async (gids, that) => {
  let tsStatus = await checkTsStatus();

  if (tsStatus) {
    let tsGoodsInfo = uni.getStorageSync('tsGoodsInfo');

    if (tsGoodsInfo) {
      getTsGoodsInfo(gids, tsGoodsInfo, that);
    }
  }
}; // 检查推手是否开启


const checkTsStatus = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=api&mod=addons_status&sld_addons=spreader',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}; // 获取推手相关配置


const getTsSetting = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=api&mod=get_share_setting&sld_addons=spreader',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.ssys_expire_day) {
          resolve(res.data.ssys_expire_day);
        } else {
          resolve(0);
        }
      }
    });
  });
}; // 获取当前商品下的所有gid


const getAllGid = (gid, shareId, ssys_expire_day) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=api&mod=get_spu_all_gid&sld_addons=spreader',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        spreader_gid: gid
      },
      success: res => {
        if (res.data.state == 200) {
          let spreader_gids = res.data.data;

          if (spreader_gids.length) {
              saveTsGoodsInfo(spreader_gids, shareId, ssys_expire_day); 
          }
        }
      }
    });
  });
}; // 将推手的相关信息存入storage中

/** 
 * gid: 商品id,
 * shareId: 分享id, 
 * ssys_expire_day: 过期时间
 */


const saveTsGoodsInfo = (gid, shareId, ssys_expire_day) => {
  let tsGoodsInfo = {}
  gid.map(item=>{
	  let ssys_expire_day_time = (new Date().getTime() + ssys_expire_day * one_day_time) * 1;
	  tsGoodsInfo['ssy' + item] = {
	    gid: item,
	    shareId: shareId,
	    ssys_expire_day_time: ssys_expire_day_time
	  };
  })
   // 检查是否有过期信息，过期则删除
  let nowTime = new Date().getTime();
  for (let i in tsGoodsInfo) {
    if (nowTime * 1 > tsGoodsInfo[i].ssys_expire_day_time * 1) {
      delete tsGoodsInfo[i];
    }
  }

  uni.setStorage({
    key: 'tsGoodsInfo',
    data: tsGoodsInfo
  });
}; // 确认订单时获取推手信息


const getTsGoodsInfo = (gids, tsGoodsInfo, that) => {
  let result = [];
  gids.map(el => {
    if (tsGoodsInfo['ssy' + el]) {
      let nowTime = new Date().getTime();
      let ssys_expire_day_time = tsGoodsInfo['ssy' + el].ssys_expire_day_time * 1;

      if (nowTime <= ssys_expire_day_time || ssys_expire_day_time) {
        result.push(`${tsGoodsInfo['ssy' + el].gid}|${tsGoodsInfo['ssy' + el].shareId}`);
      }
    }
  });
  that.setData({
    spreader: result.join(',')
  });
};

module.exports = {
  tsGoodsInit: tsGoodsInit,
  tsConfirmOrderInit: tsConfirmOrderInit
};