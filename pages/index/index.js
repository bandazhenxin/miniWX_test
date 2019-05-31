//获取应用实例
const app = getApp();
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const service = new serviceClass();

//继承基类
function IndexPage(title) {
  pageBasic.call(this,title);
  this.vm = {
    db:{},
    isMove: true,
    isScroll:false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hasUserPhone: false,
    canIUseUser: wx.canIUse('button.open-type.getUserInfo'),
    canIUsePhone: wx.canIUse('button.open-type.getPhoneNumber')
  }
};
IndexPage.prototype = new pageBasic();

//逻辑初始化
IndexPage.prototype.onPreload = function(option){
  this.render()
  if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  } else if (this.data.canIUseUser) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  } else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
}

//点击头像跳转日志记录页
IndexPage.prototype.bindViewTap = function () {
  wx.navigateTo({
    url: '../logs/logs'
  })
}

//获取用户信息
IndexPage.prototype.getUserInfo = function (e) {
  console.log(e)
  app.globalData.userInfo = e.detail.userInfo
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
}

//拉到顶部固定 释放滑动
IndexPage.prototype.backTop = function(event){
  let y = event.detail.y;
  let top = event.currentTarget.offsetTop;
  // this.vm.isMove = false;
  this.vm.isScroll = (y * (-1) == top);
  this.render();
}

Page(new IndexPage('悠聘'));
