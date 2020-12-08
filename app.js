//app.js
App({
  globalData: {
    adminUserViewId: "",
    openid: "",
    token: "",
    userid: "",
    userInfo: null,
    BaseURL: "http://192.168.2.178:8087",
  },

  onShow: function (options) {
    this.updataApp();
  },
  onLaunch: function (options) {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    wx.setStorageSync('logs', logs)
    // 获取用户信000900000
    if (typeof __wxConfig == "object") {
      let version = __wxConfig.envVersion;
      if (version == "develop") {
        //开发环境
        that.globalData.BaseURL = "http://192.168.2.178:8087/api/v1"
      } else if (version == "trial") {
        //测试环境(体验版)
      } else if (version == "release") {}
    }
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
            console.log(res)
              wx.request({
                url: that.globalData.BaseURL + '/user/unionId',
                method: 'post',
                data: {
                  code: res.code,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log("user login",res)
                  that.globalData.userid = res.data.data.openid
                  wx.setStorageSync('userid', res.data.data.openid); //存储openid
                  resolve(res);
                }
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
    this.updataApp();
    this.getSystemInfo();
  },
  updataApp: function () { //版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) { // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({ // 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  getSystemInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      //判断在企业微信还是微信中登录
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: that.globalData.BaseURL + '/user/authentication',
              method: 'post',
              data: {
                code: res.code,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log("user login",res)
                that.globalData.userid = res.data.data.openid
                wx.setStorageSync('userid', res.data.data.openid); //存储openid
                resolve(res);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    })
  }
})