//获取应用实例
var app = getApp()
var {
  formate_data,
  request
} = require("../../../utils/util.js")
var that;
var to_day = new Date();
//格式化日期
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    isdisabled: false,
    TopTips: '',
    notice_status: false,
    agreeButton: false,
    begin_day: formate_data(to_day),
    end_day: formate_data(to_day),
    images: [],
    noteNowLen: 0, //备注当前字数
    roomList: [],
    userList: [],
    selectShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectIndex: 0, //选择的下拉列表下标
    userIndex: 0,
    userSelectShow:false,
    noteMaxLen: 200, //备注最多字数
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
 //改变活动类别
 bindTypeChange: function (e) {
  this.setData({
    typeIndex: e.detail.value
  })
},
  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value,
      noteNowLen: len
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({ //初始化数据
      isLoading: false,
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
    var to_day = new Date();
    that.setData({
      begin_day: formate_data(to_day),
      end_day: formate_data(to_day, 2),
    })
    request({
      url: app.globalData.BaseURL + '/rooms/list',
      method: 'get',
      data: {
        status: 1
      },
      success: function (res) {
        if (res.data.length === 0) {
          that.setData({
            showTopTips: true,
            TopTips: '无房间可出租',
            isLoading: true,
          });
        } else {
          that.setData({
            roomList: res.data
          })
        }
      }
    })

    request({
      url: app.globalData.BaseURL + '/user/list',
      method: 'get',
      data: [],
      success: function (res) {
        that.setData({
          userList: res.data
        })
      }
    })
  },
  bindBeginDayChange(e) {
    this.setData({
      begin_day: e.detail.value
    })
  },
  bindEndDayChange(e) {
    this.setData({
      end_day: e.detail.value
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
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      selectIndex: index,
      selectShow: !this.data.selectShow
    });
  },
  selectNickNameTap() {
    this.setData({
      userSelectShow: !this.data.userSelectShow
    });
  },
  // 点击下拉列表
  optionNickNameTap(e) {
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      userIndex: index,
      userSelectShow: !this.data.userSelectShow
    });
  },

  //上传活动图片
  uploadPic: function () { //选择图标
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
  clearPic: function () { //删除图片
    that.setData({
      images: []
    })
  },

  //上传身份证正面
  uploadIdcardImg0: function () { //选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
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

  //上传身份证反面
  uploadIdcardImg1: function () { //选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
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

  //删除身份证正反面照片
  clearCodePic: function () {
    that.setData({
      idcard_img_0: "",
      idcard_img_1: ""
    })
  },
  bindAgreeChange: function(){
    that.setData({
      agreeButton: !this.data.agreeButton
    })
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
    console.log(e)
    if (that.data.agreeButton == false) {
      this.setData({
        showTopTips: true,
        TopTips: '请先阅读并同意《租房合同须知》'
      });
      return;
    }
    var room_id = that.data.roomList[that.data.selectIndex].id;
    if (room_id == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请选择房间'
      });
      return;
    }
    var user_id = that.data.userList[that.data.userIndex].id;
    var begin_day = that.data.begin_day; 
    
    var end_day = that.data.end_day; 
    var ext_content = e.detail.value.ext_content; 
    var cash_pledge_num = e.detail.value.cash_pledge_num; 
    var interval_time = e.detail.value.interval_time; 
    var water_num = e.detail.value.water_num; 
    var electricity_num = e.detail.value.electricity_num; 
    var gas_num = e.detail.value.gas_num; 
    var rent_num = e.detail.value.rent_num; 
    var heating_fee = e.detail.value.heating_fee; 
    var title = e.detail.value.title; 
    var phone = e.detail.value.phone; 
    var wx = e.detail.value.wx; 
    var peoplenum = e.detail.value.peoplenum; 
    var realname = e.detail.value.realname; 
    var idcard = e.detail.value.idcard; 
    var idcard_img_0 = e.detail.value.idcard_img_0; 
    var idcard_img_1 = e.detail.value.idcard_img_1; 
    
    //------发布者真实信息------
    var realname = e.detail.value.realname;
    var idcard = e.detail.value.idcard;
    var phoneReg = /^1[34578]\d{9}$/;
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
    //先进行表单非空验证
    if (!this.checkData(user_id, '请输入 user_id')) {
      return ;
    }  
    if (!this.checkData(begin_day, '请输入 begin_day')) {
          return ;
    }  
    if (!this.checkData(end_day, '请输入 end_day')) {
          return ;
    }  
    if (!this.checkData(room_id, '请输入 room_id')) {
          return ;
    }  
    if (!this.checkData(ext_content, '请输入 ext_content')) {
          return ;
    }  
    if (!this.checkData(cash_pledge_num, '请输入 cash_pledge_num')) {
          return ;
    }  
    if (!this.checkData(interval_time, '请输入 interval_time')) {
          return ;
    }  
    if (!this.checkData(water_num, '请输入 water_num')) {
          return ;
    }  
    if (!this.checkData(electricity_num, '请输入 electricity_num')) {
          return ;
    }  
    if (!this.checkData(gas_num, '请输入 gas_num')) {
          return ;
    }  
    if (!this.checkData(rent_num, '请输入 rent_num')) {
          return ;
    }  
    if (!this.checkData(heating_fee, '请输入 heating_fee')) {
          return ;
    }  
    if (!this.checkData(title, '请输入 title')) {
          return ;
    }  
    if (!this.checkData(phone, '请输入 phone')) {
          return ;
    }  
    if (!this.checkData(wx, '请输入 wx')) {
          return ;
    }  
    if (!this.checkData(peoplenum, '请输入 peoplenum')) {
          return ;
    }  
    if (!this.checkData(realname, '请输入 realname')) {
          return ;
    }  
    if (!this.checkData(idcard, '请输入 idcard')) {
          return ;
    }  
    // if (realname != "" && !nameReg.test(realname)) {
    //   this.setData({
    //     showTopTips: true,
    //     TopTips: '真实姓名一般为2-4位汉字'
    //   });
    //   return;
    // }
    // if (idcard == "") {
    //   this.setData({
    //     showTopTips: true,
    //     TopTips: '请输入身份号'
    //   });
    //   return;
    // }
    // if (!phoneReg.test(phone)) {
    //   this.setData({
    //     showTopTips: true,
    //     TopTips: '手机号格式不正确'
    //   });
    //   return;
    // }
    that.setData({
      isLoading: true,
      isdisabled: true
    })
    request({
      url: app.globalData.BaseURL + '/contracts/new',
      data: {
        user_id: user_id,
        begin_day: begin_day, 
        end_day: end_day, 
        room_id: room_id, 
        ext_content: ext_content, 
        cash_pledge_num: cash_pledge_num, 
        interval_time: interval_time, 
        water_num: water_num, 
        electricity_num: electricity_num, 
        gas_num: gas_num, 
        rent_num: rent_num, 
        title: title, 
        phone: phone, 
        wx: wx, 
        peoplenum: peoplenum, 
        realname: realname, 
        idcard: idcard, 
        idcard_img_0: idcard_img_0, 
        idcard_img_1: idcard_img_1, 
        heating_fee: heating_fee,
      },
      method: 'post',
      success: function (res) {
        if(res.data.error !=0) {
          that.setData({
            showTopTips: true,
            TopTips: res.data.message,
            isLoading: false,
          });
        } else {
          that.setData({
            showTopTips: true,
            TopTips: '保存成功',
            isLoading: false,
          });
        }
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    })
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  checkData: function (param,  msg) {
      if(!param && param != 0) {
        this.setData({
          showTopTips: true,
          TopTips: msg
        });
        return false;
      } else {
        return true;
      }
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