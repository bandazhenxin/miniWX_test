const serviceClass = require('service.js');
const service = new serviceClass();

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化登录
    service.initGet(this);
  },
  userInfoReadyCallback: null,
  globalData: {
    userBasicInfo: null
  }
})