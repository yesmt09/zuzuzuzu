//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userid: app.globalData.userid,
    code:''
  },
  onShow: function () {
    var that=this
  },
  onGotUserInfo (e) {
    console.log(e)
  }
})
