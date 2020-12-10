const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-'
    + month_add + '-'
    + myDate.getDate()
  return formate_result;
}

module.exports = {
  formatTime: formatTime,
  formate_data: formate_data
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
module.exports.json2Form = json2Form

function request({
  url: url,
  data: data,
  method: method,
  success: success
}) {
  let header = {
  }
  if ( wx.getStorageSync('cookie') ) {
    header.Cookie = wx.getStorageSync('cookie')
  }
  return wx.request({
    url: url,
    data: data,
    enableCache: true,
    enableHttp2: true,
    enableQuic: true,
    header: header,
    method: method,
    timeout: 0,
    success: (result) => {
      success(result)
    },
    fail: (result) => {
      wx.setStorageSync('cookie', result.header['Set-Cookie']);
    },
    complete: (result) => {
      if(result.header['Set-Cookie']) {
        wx.setStorageSync('cookie', result.header['Set-Cookie']);
      }
    },
  })
}
module.exports.request = request

function getUserInfo(app) {
  console.log(app)
  wx.getUserInfo({
    success: userInfo => {
      if (userInfo.errMsg != 'getUserInfo:ok') {
        wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          title: '提示',
          content: '获取用户信息失败'
        })
      } else {
        app.globalData.userInfo = JSON.parse(userInfo.rawData)
        request({
          url: app.globalData.BaseURL + '/user/unionId',
          data: {
            userInfo: userInfo
          },
          method: 'post',
          success: function (res) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
      }
    }
  })
}

module.exports.getUserInfo = getUserInfo