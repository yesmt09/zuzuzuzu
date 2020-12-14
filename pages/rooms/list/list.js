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
    roomsData: [],
    currtab: 0,
    swipertab: [{ name: '空闲中', index: 0 }, { name: '快到期', index: 1 }, { name: '在租中', index: 2 }],
  },

  onShow: function () {
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
            roomsData: res.data.data,
            roomsList: roomsList,
          })
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  gotoShow: function (e) {
    wx.navigateTo({
      url: '/pages/rooms/show/show?id=' + e.currentTarget.dataset.id
    })
  }
})