//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userid: app.globalData.userid,
    buttonShow: '',
    buttonJur:'',
    getCount:{

    },
    code:''
  },
  onShow: function () {
    var that=this
    that.setData({
      userid: wx.getStorageSync('userid')
    })
    if (that.data.userid == null) {
      app.getSystemInfo().then(function (res) {
        if (res.data.id != null) {
          that.setData({
            userid: wx.getStorageSync('openid')
          })
        }
      })
    }
  },
  buttonshow:function(id){
    var that = this
    var urlStr = app.globalData.BaseURL + 'Appweixin/userManger/buttonShow';
    wx.request({
      url: urlStr,
      method: 'get',
      data: {
        userid: id
      },
      success: function (res) {
        if (res.data.info == 0) {
          that.setData({
            buttonShow: res.data.buttonShow
          })
        } else {
          that.setData({
            buttonShow: false
          })
        }
      }
    })
  },
  jurisdiction: function (id) {
    var that = this
    var urlStr = app.globalData.BaseURL + 'Appweixin/userManger/jurisdiction';
    wx.request({
      url: urlStr,
      method: 'get',
      data: {
        userid: id
      },
      success: function (res) {
        var arr = [];
        if (res.data.info == 0 && res.data.buttonJur!=null) {
          var dateList = res.data.buttonJur.split(",");
          for (var i in dateList) {
            arr = arr.concat(dateList[i]);
            if (1 == arr[i]) {
              that.setData({
                buttonJur: true
              })
            } 
          }
        } else {
          that.setData({
            buttonJur: true
          })
        }
      }
    })
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})
