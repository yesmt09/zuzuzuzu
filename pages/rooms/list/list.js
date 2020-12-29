const {
  request, getNowFormatDate, compareDate, getPreMonth
} = require("../../../utils/util")

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomAll: [],
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
          for (let i = 0; i < res.data.length; i++) {
            if(res.data[i]['status'] === "4") {
              let preDate = getPreMonth(getNowFormatDate());
              if (compareDate(preDate, res.data[i]['contract']['end_day'])) {
                roomsList['expire'].push(res.data[i])
              } else {
                roomsList['ing'].push(res.data[i])
              }
            } else {
              roomsList['free'].push(res.data[i])
            }
          }
          that.setData({
            roomAll: res.data,
            roomsData: res.data,
            roomsList: roomsList,
          })
        }
    })
  },
  
  selectIng: function (e) {
    this.setData({
      roomsData: this.data.roomsList['expire'] + this.data.roomsList['ing']
    })
  },

  selectFree: function (e) {
    this.setData({
      roomsData: this.data.roomsList['free']
    })
  },

  findRoom: function (e) {
    var roomId = this.validateNumber(e.detail.value)
    var roomAll = this.data.roomAll
    if (roomId === ''){
      this.setData({
        roomsData: roomAll
      })
      return 
    }
    this.setData({
      roomsData: []
    })
    console.log(this.validateNumber(roomId))
    for (let i = 0; i<roomAll.length;i++) {
      console.log(roomAll[i].number)
        if (roomAll[i].number == roomId) {
          this.setData({
            roomsData: [roomAll[i]]
          })
          return;
        }
    }
  },
  validateNumber: function(val) {
    return val.replace(/\D/g, '')
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