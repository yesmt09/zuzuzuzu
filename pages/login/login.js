//index.js

const {
  request
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
      this.getSystemInfo().then(this.getSettingInfo)
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
      this.getUserInfo()
    }
  },

  getSystemInfo() {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          if (res.code) {
            request({
              url: app.globalData.BaseURL + '/user/authentication',
              data: {
                code: res.code,
              },
              method: 'post',
              success: function (res) {
                console.log(res)
                if (res.data.error === 0) {
                  app.globalData.userid = res.data.data.openid
                  wx.setStorageSync('userid', res.data.data.openid); //存储openid
                  resolve(res);
                } else {
                  wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                    title: '提示',
                    content: '登录失败，验证失败！'
                  })
                }
              }
            })
          } else {
            wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
              title: '提示',
              content: '登录失败！' + res.errMsg
            })
          }
        }
      })
  })
  },

  getSettingInfo: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            that.getUserInfo()
          } else {
            that.setData({
              showButtion: true,
            })
          }
        }
      })
    })
  },

  getUserInfo() {
    var that = this
    wx.getUserInfo({
      success: userInfo => {
        if (userInfo.errMsg != 'getUserInfo:ok') {
          wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            title: '提示',
            content: '获取用户信息失败'
          })
        } else {
          getApp().globalData.userInfo = JSON.parse(userInfo.rawData)
          request({
            url: app.globalData.BaseURL + '/user/unionId',
            data: {
              userInfo: userInfo
            },
            method: 'post',
            success: function (res) {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      }
    })
  }
})