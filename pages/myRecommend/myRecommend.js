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
function MyRecommend(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    grade: '',
    teamList: [],
    currentTab: 0,
    subordinateList: []
  }
}
MyRecommend.prototype = new pageBasic();


/**
 * 逻辑初始化
 */
MyRecommend.prototype.onPreload = function (option) {
  //init
  let grade = option.grade;
  this.vm.grade = grade;
  this.render()
  // 获取下属推荐列表
  service.getIntroducerList(this)
}

/**
 * 显示时
 */
// MyRecommend.prototype.onShow = function () {
//   this.onLoad();
// }

// 切换tab
MyRecommend.prototype.clickTab = function (e) {
  var that = this;
  if (that.vm.currentTab === e.target.dataset.id) {
    return
  } else {
    that.vm.currentTab = e.target.dataset.id
  }
}

Page(new MyRecommend(lang.MyRecommend));