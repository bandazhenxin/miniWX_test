//reply
const lang         = require('../../config/lang.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const serviceClass = require('service.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function SignUpPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db: {
      page_list: [1,1,1,1,1,1],
      type_map: [1,2,3,4,5,6]
    },
    tabs: [lang.enrolled, lang.toBeInterview, lang.toBeAdmitted, lang.checkIn, lang.itsOver, lang.collected],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    content_list: [[],[],[],[],[],[]]
  }
}
SignUpPage.prototype = new pageBasic();



/* 业务逻辑 */

/**
 * 初始化
 */
SignUpPage.prototype.onPreload = function (option) {
  this.render();
  let that = this;
  let sliderWidth = 96;
  wx.getSystemInfo({
    success: function (res) {
      that.renderDetail({
        sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
        sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
      });
    }
  });

  service.basicRender(this);
}

/**
 * 翻页
 */
SignUpPage.prototype.scrollRender = function (e) {
  service.basicRender(this,1);
}

/**
 * 下拉更新
 */
SignUpPage.prototype.onPullDownRefresh = function (e) {
  service.refresh(this);
}

/**
 * 确认面试
 */
SignUpPage.prototype.sureInterview = function (e) {
  let data = e.currentTarget.dataset;
  service.sureInterview(this, data);
}

/**
 * 推荐给好友
 */
SignUpPage.prototype.onShareAppMessage = function (e) {
  let data = e.target.dataset;
  return {
    title: lang.shareJob + '：' + data.title,
    path: '/pages/jobDetail/jobDetail?id=' + data.id
  }
}

/**
 * 查看职位详情
 */
SignUpPage.prototype.goInfo = function (e) {
  let data = e.currentTarget.dataset;
  let index = data.index;
  let type = this.vm.db.type_map[index];
  this.go('/pages/seePosition/seePosition?id=' + data.id + '&rid=' + data.rid + '&type=' + type);
}

/**
 * 跳转详情页
 */
SignUpPage.prototype.goDetail = function (e) {
  let detail = e.currentTarget.dataset;
  this.go('/pages/jobDetail/jobDetail?id=' + detail.id);
}



/** ui **/

/**
 * 选项卡事件
 */
SignUpPage.prototype.tabClick = function (e) {
  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
  service.basicRender(this);
}

Page(new SignUpPage(lang.signUp));