// pages/ contract/contractShow/contractShow.js
const {
  request
} = require("../../utils/util")

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    select:false,
    grade_name:'已逾期',
    grades: [
        '快到期',
        '已逾期',
        '空闲中',
      ]
  },/**
 *  点击下拉框
 */
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
/**
 * 已选下拉框
 */
  mySelect: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    this.setData({
      grade_name: this.data.grades[id],
      select: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})