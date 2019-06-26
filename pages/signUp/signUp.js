//reply
const lang         = require('../../config/lang.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const layer        = require('../../utils/webServer/layer.js');
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
  let sliderWidth = 70;
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
 * 跳转领取返现
 */
SignUpPage.prototype.cashBack = function (e) {
  let data = e.currentTarget.dataset;
  this.go('/pages/cashBack/cashBack?id=' + data.id + '&rid=' + data.rid);
}

/**
 * 跳转入职登记
 */
SignUpPage.prototype.entryReg = function (e) {
  let data = e.currentTarget.dataset;
  this.go('/pages/entryReg/entryReg?id=' + data.id + '&rid=' + data.rid + '&index=' + data.index + '&idx=' + data.idx);
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
  let { index, id, rid, idx, iid  } = data;
  let type = this.vm.db.type_map[index];
  let basic_url = '/pages/seePosition/seePosition?id='
  this.go(basic_url + id + '&rid=' + rid + '&type=' + type + '&index=' + index + '&idx=' + idx + '&iid=' + iid);
}

/**
 * 跳转详情页
 */
SignUpPage.prototype.goDetail = function (e) {
  let detail = e.currentTarget.dataset;
  this.go('/pages/jobDetail/jobDetail?id=' + detail.id);
}

/**
 * 删除 即 取消收藏
 */
SignUpPage.prototype.collectionDel = function (e) {
  let data   = e.currentTarget.dataset;
  let that   = this;
  let handle = {};
  handle[lang.thinking] = false;
  handle[lang.sure] = function(){
    service.collectionDel(that, data)
  };
  layer.confirm(lang.sureDel, lang.delTips, handle);
}

/**
 * 回退刷新
 */
SignUpPage.prototype.onShow = function () {
  this.onLoad();
}

/**
 * 跳转立即报名
 */
SignUpPage.prototype.signDetail = function (e) {
  let detail = e.currentTarget.dataset;
  let { id, index, idx } = detail
  this.go('/pages/signDetail/signDetail?id=' + id + '&index=' + index + '&idx=' + idx);
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

/**
 * 报名成功回传
 */
SignUpPage.prototype.signUpSuccess = function (option) {
  let { index,idx } = option;
  let prelist = this.vm.content_list;
  prelist[index][idx].is_enroll = 0;
  this.renderDetail({
    content_list: prelist
  });
}

Page(new SignUpPage(lang.signUp));