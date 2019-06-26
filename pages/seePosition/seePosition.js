//reply
const lang         = require('../../config/lang.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const serviceClass = require('service.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function SeePositionPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db: {
      basic: {},
    },
    job_info: {},
    sign_info: {},
    basic: {}
  }
}
SeePositionPage.prototype = new pageBasic();



/* 业务逻辑 */

/**
 * 初始化
 */
SeePositionPage.prototype.onPreload = function (option) {
  this.renderDetail({
    basic: option
  });

  service.jobInfo(this);
  service.signInfo(this);
}

/**
 * 确认面试
 */
SeePositionPage.prototype.sureInterview = function (e) {
  let data = e.currentTarget.dataset;
  service.sureInterview(this, data);
}

/**
 * 跳转领取返现
 */
SeePositionPage.prototype.cashBack = function (e) {
  let data = e.currentTarget.dataset;
  let { id, rid } = data;
  this.go('/pages/cashBack/cashBack?id=' + id + '&rid=' + rid);
}

/**
 * 跳转入职登记
 */
SeePositionPage.prototype.entryReg = function (e) {
  let data = e.currentTarget.dataset;
  let { id, rid, index, idx } = data;
  this.go('/pages/entryReg/entryReg?id=' + id + '&rid=' + rid + '&index=' + index + '&idx=' + idx);
}

Page(new SeePositionPage(lang.signUp));