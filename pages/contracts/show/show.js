//获取应用实例
var app = getApp()
var {request} = require("../../../utils/util.js")
var that;
var myDate = new Date();
//格式化日期
console.log(myDate)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contract_id: 0,
    contract: {},
    showTopTips: false,
    TopTips: '',
  },
  
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    that.setData({//初始化数据
      contract_id: options.id
    })
    request({
      url: app.globalData.BaseURL + '/contracts/one',
      method: 'get',
      data: {
        id : options.id,
      },
      success: function (res) {
          that.setData({
            contract: res.data.data
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})