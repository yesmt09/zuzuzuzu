const {
  request
} = require("../../../utils/util")

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    billings: [],
    billingsList: {
      realdy:[],
      wait: [],
      cancel: []
    },
    currtab: 0,
    swipertab: [{ name: '已完成', index: 0 }, { name: '待付款', index: 1 }, { name: '已取消', index: 2 }],
  },

  onShow: function () {
    var that = this
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    request({
        url: app.globalData.BaseURL + '/billings/list',
        data: {},
        method: 'get',
        success: function (res) {
          var billingsList = {
            realdy: [],
            wait: [],
            cancel: []
          }
          for (let i = 0; i < res.data.length; i++) {
            if(res.data[i]['status'] === "4") {
              billingsList['realdy'].push(res.data[i])
            } else if (res.data[i]['status'] === "2") {
              billingsList['cancel'].push(res.data[i])
            } else {
              billingsList['wait'].push(res.data[i])
            }
          }
          that.setData({
            billingsList: billingsList,
          })
          console.log(that.data.billingsList)
          that.orderShow()
        }
    })
  },
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
      console.log(that.data.currtab)
      this.orderShow()
    }
  },
  gotoShow: function (e) {
    wx.navigateTo({
      url: '/pages/billings/show/show?id=' + e.currentTarget.dataset.id
    })
  },
  orderShow: function () {
    let that = this
    let data = {}
    console.log(that.data.billingsList)
    console.log(this.data.currtab)
    switch (this.data.currtab) {
      case 0:
        data = that.data.billingsList['realdy']
        break
      case 1:
        data = that.data.billingsList['wait']
        console.log(that.data.billingsList)
        break
      case 2:
        data = that.data.billingsList['cancel']
        break
    }
    console.log(data)
    that.setData({
      billings: data
    })
  },
})