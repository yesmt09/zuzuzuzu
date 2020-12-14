//获取应用实例
var app = getApp()
var Bmob = require("../../../utils/bmob.js");
var common = require("../../../utils/getCode.js")
var {formate_data, request} = require("../../../utils/util.js")
var that;
var myDate = new Date();
//格式化日期
console.log(myDate)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    isdisabled: false,
    TopTips: '',
    notice_status: false,
    isAgree: false,
    title: '',
    phone: '',
    wx: '',
    begin_day: formate_data(myDate),
    end_day: formate_data(myDate),
    peoplenum: 2,
    content: "",
    images: [],
    noteNowLen: 0,//备注当前字数
    idcard: '',//显示输入真实姓名,,
    realname: '',//显示输入真实姓名,,
    idcard_img_0: '',
    idcard_img_1: '',
    roomList: [],
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectIndex: 0,//选择的下拉列表下标
    noteMaxLen: 200,//备注最多字数
  },
  
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },

  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({//初始化数据
      isLoading: false,
      loading: true,
      showTopTips: false,
      TopTips: '',
      notice_status: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    request({
      url: app.globalData.BaseURL + '/rooms/list',
      method: 'get',
      data:{
        status: 1
      },
      success: function (res) {
        that.setData({
          roomList: res.data.data
        })
      }
    })
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      selectIndex: index,
      selectShow: !this.data.selectShow
    });
  },

  //上传活动图片
  uploadPic: function () {//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let images = that.data.images
        that.setData({
          images: images.push(tempFilePaths)
        })
      }
    })
  },

  //删除图片
  clearPic: function () {//删除图片
    that.setData({
      images: []
    })
  },

  //上传身份证正面
  uploadIdcardImg1: function () {//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],//压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          idcard_img_1: tempFilePaths
        })
      }
    })
  },

    //上传身份证反面
    uploadIdcardImg1: function () {//选择图标
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'],//压缩图
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          that.setData({
            idcard_img_0: tempFilePaths
          })
        }
      })
    },

  //删除身份证正反面照片
  clearCodePic: function () {
    that.setData({
      idcard_img_0: "",
      idcard_img_1: ""
    })
  },

  //限制人数
  changePeoplenum: function (e) {
    this.setData({
      peoplenum: e.detail.value
    })
  },

  bindBeginDayChange: function (e) {
    this.setData({
      begin_day: e.detail.value
    })
  },
  bindEndDayChange: function (e) {
    this.setData({
      end_day: e.detail.value
    })
  },
  //改变手机号  
  bindPhoneChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //改变微信联系方式

  bindWxChange: function (e) {
    this.setData({
      wx: e.detail.value
    })
  },
  //同意相关条例
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      showInput: !this.data.showInput
    });
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var that = this;
   
    if (that.data.showInput == false) {
      wx.showModal({
        title: '提示',
        content: '请先阅读《发起须知》'
      })
      return;
    }
    var title = e.detail.value.title;
    var end_day = e.detail.value.end_day;
    var begn_day = e.detail.value.begn_day;
    var peoplenum = e.detail.value.peoplenum;
    var content = e.detail.value.content;
    //------发布者真实信息------
    var realname = e.detail.value.realname;
    var idcard = e.detail.value.idcard;
    var phone = e.detail.value.phone;
    var wx = e.detail.value.wx;

    var wxReg = new RegExp("^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$");
    var phoneReg = /^1[34578]\d{9}$/;
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入主题'
      });
    } else if (peoplenum == false) {
      this.setData({
        showTopTips: true,
        TopTips: '请输入人数'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入补充内容'
      });
    }else if (realname == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入真实姓名'
      });
    } else if (realname != "" && !nameReg.test(realname)) {
      this.setData({
        showTopTips: true,
        TopTips: '真实姓名一般为2-4位汉字'
      });
    } else if (idcard == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入身份号'
      });
    } else if ( !wxReg.test(wx)) {
      this.setData({
        showTopTips: true,
        TopTips: '微信号格式不正确'
      });
    } else if (!phoneReg.test(phone)) {
      this.setData({
        showTopTips: true,
        TopTips: '手机号格式不正确'
      });
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//根据活动类型获取活动类型名称
function getTypeName(acttype) {
  var acttypeName = "";
  if (acttype == 1) acttypeName = "运动";
  else if (acttype == 2) acttypeName = "游戏";
  else if (acttype == 3) acttypeName = "交友";
  else if (acttype == 4) acttypeName = "旅行";
  else if (acttype == 5) acttypeName = "读书";
  else if (acttype == 6) acttypeName = "竞赛";
  else if (acttype == 7) acttypeName = "电影";
  else if (acttype == 8) acttypeName = "音乐";
  else if (acttype == 9) acttypeName = "其他";
  return acttypeName;
}