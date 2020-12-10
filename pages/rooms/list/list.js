const {
  request
} = require("../../../utils/util")

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooms: [],
    roomsList: {
      free:[],
      expire: [],
      ing: []
    },
    currtab: 0,
    swipertab: [{ name: '空闲中', index: 0 }, { name: '快到期', index: 1 }, { name: '在租中', index: 2 }],
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
        url: app.globalData.BaseURL + '/rooms/list',
        data: {},
        method: 'get',
        success: function (res) {
          var roomsList = {
            free:[],
            expire: [],
            ing: []
          }
          for (let i = 0; i < res.data.data.length; i++) {
            if(res.data.data[i]['status'] === "4") {
              if (res.data.data[i]['contract']['end_day'] === "2020") {
                roomsList['ing'].push(res.data.data[i])
              } else {
                roomsList['expire'].push(res.data.data[i])
              }
            } else {
              roomsList['free'].push(res.data.data[i])
            }
          }
          that.setData({
            roomsList: roomsList,
          })
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
      this.orderShow()
    }
  },
  gotoShow: function (e) {
    wx.navigateTo({
      url: '/pages/rooms/show/show?id=' + e.currentTarget.dataset.id
    })
  },
  orderShow: function () {
    let that = this
    let data = {}
    switch (this.data.currtab) {
      case 0:
        data = that.data.roomsList['free']
        break
      case 1:
        data = that.data.roomsList['expire']
        break
      case 2:
        data = that.data.roomsList['ing']
        break
    }
    that.setData({
      rooms: data
    })
  },
})