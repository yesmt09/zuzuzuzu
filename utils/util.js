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

function formate_data(myDate, month = 1) {
  let month_add = myDate.getMonth() + month;
  let year_add = myDate.getFullYear();
  if (month_add > 12) {
    year_add = year_add + 1
    month_add = 1;
  }
  var formate_result = year_add + '-'
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
      success(result.data)
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

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
module.exports.getNowFormatDate = getNowFormatDate

//比较日期大小
function compareDate(date1, date2) {
  var date1 = new Date(date1);
  var date2 = new Date(date2);
  if (date1.getTime() > date2.getTime()) {
      return true;
  } else {
      return false;
  }
}
module.exports.compareDate = compareDate

function getPreMonth(date) {  
  var arr = date.split('-');  
  var year = arr[0]; //获取当前日期的年份  
  var month = arr[1]; //获取当前日期的月份  
  var day = arr[2]; //获取当前日期的日  
  var days = new Date(year, month, 0);  
  days = days.getDate(); //获取当前日期中月的天数  
  var year2 = year;  
  var month2 = parseInt(month) + 1;  
  if (month2 > 12) {  
      year2 = parseInt(year2) + 1;  
      month2 = 1;  
  }  
  var day2 = day;  
  var days2 = new Date(year2, month2, 0);  
  days2 = days2.getDate();  
  if (day2 > days2) {  
      day2 = days2;  
  }  
  if (month2 < 10) {  
      month2 = '0' + month2;  
  }  
  var t2 = year2 + '-' + month2 + '-' + day2;  
  return t2;  
}  

module.exports.getPreMonth = getPreMonth
