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
      basic: {}
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
 * 跳转领取返现
 */
SeePositionPage.prototype.cashBack = function (e) {
  let data = e.currentTarget.dataset;
  this.go('/pages/cashBack/cashBack?id=' + data.id + '&rid=' + data.rid);
}

Page(new SeePositionPage(lang.signUp));