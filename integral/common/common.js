
export const cancelOrder = (e, that, cb) => {

  let id = e.currentTarget.dataset.id,
      key = that.key;
  uni.showModal({
    title: that.$L('提示'),
    content: that.$L('取消订单？'),
    cancelText:that.$L('取消'),
		confirmText:that.$L('确定'),
    success: function (re) {
      if (re.confirm) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=rollbackorder&sld_addons=points',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key,
            order_id: id
          },
          success: function (res) {
            if (res.data.status == 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              }); //  let orderList = that.orderList;
              //  orderList = orderList.filter(el => el.point_orderid != id)
              //  that.setData({
              //    orderList
              //  })

              cb && cb();
            } else {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            }
          }
        });
      }
    }
  });
}; // 再次购买

export const rebuy = (e, that) => {
  let id = e.currentTarget.dataset.id,
      key = that.key;

  if (id) {
    uni.request({
      url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=buyagainorder&sld_addons=points',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        key,
        order_id: id
      },
      success: function (res) {
        if (res.data.status == 200) {
          uni.reLaunch({
            url: '/integral/pages/cart/cart'
          });
        }
      }
    });
  }
}; // 确认收货

export const confirmSh = (e, that, cb) => {
  let id = e.currentTarget.dataset.id,
      key = that.key;
  uni.showModal({
    title: that.$L('提示'),
    content: that.$L('确认收货？'),
    cancelText:that.$L('取消'),
		confirmText:that.$L('确定'),
    success: function (re) {
      if (re.confirm) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=confirmation&sld_addons=points',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key,
            order_id: id
          },
          success: function (res) {

            if (res.data.status == 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
              cb && cb();
            } else {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            }
          }
        });
      }
    }
  });
}; // 去兑换

export const pay = (e, that, cb) => {
  let id = e.currentTarget.dataset.id,
      key = that.key;
  uni.showModal({
    title: that.$L('提示'),
    content: that.$L('确认兑换'),
    cancelText:that.$L('取消'),
		confirmText:that.$L('确定'),
    success: function (res) {
      if (res.confirm) {
        if (id) {
          uni.request({
            url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=gotopayorder&sld_addons=points',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              key,
              order_id: id
            },
            success: function (res) {
              if (res.data.status == 200) {
                uni.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
                cb && cb();
              } else {
                uni.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
              }
            }
          });
        }
      }
    }
  });
};