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

module.exports = {
  formatTime: formatTime
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
      wx.setStorageSync('cookie', result.header['Set-Cookie']);
      success(result)
    },
    fail: (result) => {
      wx.setStorageSync('cookie', result.header['Set-Cookie']);
    },
    complete: (res) => {},
  })
}
module.exports.request = request