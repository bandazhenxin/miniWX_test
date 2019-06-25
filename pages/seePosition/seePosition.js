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
    db: {},
    job_info: {},
    sign_info: {}
  }
}
SeePositionPage.prototype = new pageBasic();



/* 业务逻辑 */

/**
 * 初始化
 */
SeePositionPage.prototype.onPreload = function (option) {
  this.vm.db.data = option;
  service.jobInfo(this);
  service.signInfo(this);
}

Page(new SeePositionPage(lang.signUp));