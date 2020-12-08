//index.js

const {
  request, getUserInfo
} = require("../../utils/util")

//获取应用实例
const app = getApp()

Page({
  data: {
    userid: app.globalData.userid,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showButtion: false
  },
  onShow: function () {
    var that = this
  },
  onLoad: function () {
    this.getSettingInfo
  },
  bindGetUserInfo(e) {
    if (!e.detail.userInfo) {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    } else {
      getUserInfo(getApp())
    }
  },

})