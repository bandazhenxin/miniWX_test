//reply
const lang         = require('../../config/lang.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const serviceClass = require('service.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function CashBackPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db:{},

    basic: {},
    cashBackCondition: lang.cashBackCondition,

    job_info: {}
  };
}
CashBackPage.prototype = new pageBasic();



/* 业务逻辑 */

/**
 * 初始化
 */
CashBackPage.prototype.onPreload = function (option) {
  this.vm.basic = option;
  this.render();
  
  service.initRender(this);
}

/**
 * 跳转引导下载页
 */
CashBackPage.prototype.webGo = function () {
  this.go(lang.webGoPage);
}

Page(new CashBackPage(lang.cashBack));