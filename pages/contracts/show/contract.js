// pages/ contract/contractShow/contractShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contracts: {}
  },

  onShow: function () {
    var that = this
    that.setData({
      contracts: [
        {id:1,}
      ]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})