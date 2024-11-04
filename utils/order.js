export const confirm_order = (e, that, cb) => {
  var order_id = e.currentTarget.dataset.orderId;
  var state_cancle = that;
  uni.showModal({
    title: '',
    content: state_cancle.$L('确定收到了货物吗？'),
    cancelText:state_cancle.$L('取消'),
		confirmText:state_cancle.$L('确定'),
    success: function (res) {
      if (res.confirm) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_receive_xcx',
          data: {
            key: state_cancle.key,
            order_id: order_id
          },
          dataType: 'json',
          success: function (result) {
            if (result.data.state == 250) {
              uni.showModal({
                title: '',
                content: result.data.error,
                showCancel: false,
                confirmColor: '#333',
		            confirmText:state_cancle.$L('确定'),
              });
            } else {
              cb && cb();
            }
          }
        });
      }
    }
  });
};
export const cancle_order = (e, that, cb) => {
  var order_id = e.currentTarget.dataset.orderId;
  var state_cancle = that;
  uni.showModal({
    title: '',
    content: state_cancle.$L('确定取消订单？'),
    cancelText:state_cancle.$L('取消'),
		confirmText:state_cancle.$L('确定'),
    success: function (res) {
      if (res.confirm) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_cancel_xcx',
          data: {
            key: state_cancle.key,
            order_id: order_id
          },
          dataType: 'json',
          success: function (result) {
            var msgtip = '';

            if (result.data.state == 250) {
              uni.showModal({
                title: '',
                content: result.data.error,
                showCancel: false,
                confirmColor: '#333',
		            confirmText:state_cancle.$L('确定'),
              });
            } else {
              cb && cb();
            }
          }
        });
      }
    }
  });
};
export const del_order = (e, that, cb) => {
  let order_id = e.currentTarget.dataset.orderId;
  let key = that.key;
  uni.showModal({
    title: that.$L('移除订单'),
    content: '',
    cancelText:that.$L('取消'),
		confirmText:that.$L('确定'),
    success: function (res) {
      if (res.confirm) {
        uni.request({
          url: getApp().globalData.ser_url + '/index.php?app=userorder&mod=order_delete',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            key: key,
            order_id: order_id
          },
          success: function (data) {
            if (data.data.code == 200) {
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
};