const {
  request,
  getPreMonth,
  getNowFormatDate,
  compareDate
} = require("../../../utils/util")

const app = getApp();

// pages/ contract/contractShow/contractShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contracts: [],
    contractsList: {
      expire: [],
      close: [],
      realdy: [],
      cancel: []
    },
    currtab: 0,
    swipertab: [{
      name: '即将过期',
      index: 0
    }, {
      name: '已过期',
      index: 1
    }, {
      name: '已签订',
      index: 2
    }, {
      name: '已取消',
      index: 3
    }],
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
      url: app.globalData.BaseURL + '/contracts/list',
      data: {},
      method: 'get',
      success: function (res) {
        var contractsList = {
          expire: [],
          close: [],
          realdy: [],
          cancel: []
        }
        for (let i = 0; i < res.data.length; i++) {
          let nowDate = getNowFormatDate();
          if (compareDate(nowDate, res.data[i]['end_day'])) {
            contractsList['close'].push(res.data[i])
            continue
          }
          if (res.data[i]['status'] === "4") {
            let preDate = getPreMonth(nowDate);
            contractsList['realdy'].push(res.data[i])
            console.log(preDate)
            console.log(res.data[i]['end_day'])
            console.log(compareDate(res.data[i]['end_day'], preDate))
            if (compareDate(res.data[i]['end_day'], preDate)) {
              contractsList['expire'].push(res.data[i])
            }
          } else if (res.data[i]['status'] === "2") {
            contractsList['cancel'].push(res.data[i])
          } else if (res.data[i]['status'] === "3") {
            contractsList['expire'].push(res.data[i])
          }
        }
        that.setData({
          contractsList: contractsList,
        })
        console.log(contractsList)
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
      url: '/pages/contracts/show/show?id=' + e.currentTarget.dataset.id
    })
  },
  orderShow: function () {
    let that = this
    let data = {}
    switch (this.data.currtab) {
      case 0:
        data = that.data.contractsList['expire']
        break
      case 1:
        data = that.data.contractsList['close']
        break
      case 2:
        data = that.data.contractsList['realdy']
        break
      case 3:
        data = that.data.contractsList['cancel']
        break
    }
    that.setData({
      contracts: data
    })
  },
})