//reply
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');
const layer = require('../../utils/webServer/layer.js');
const app = getApp()
//instance
const service = new serviceClass();
//继承基类
function Personal(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    userInfo: {},
  }
}
Personal.prototype = new pageBasic();


/**
 * 逻辑初始化
 */
Personal.prototype.onPreload = function (option) {
  //init
  this.vm.userInfo = app.globalData.userBasicInfo
  this.render();
  // 获取个人中心信息
  service.getPersonalInfo(this)

}

/**
 * 显示时
 */
Personal.prototype.onShow = function () {
  this.onLoad();
}

// 跳转我的推荐

Personal.prototype.goMyRecommend = function (e) {
  let { grade } = this.vm.userInfo ;
  this.go('/pages/myRecommend/myRecommend?grade=' + grade)
}

Page(new Personal());