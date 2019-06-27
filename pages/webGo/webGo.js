//reply
const pageBasic = require('../../core/pageBasic.js');
const lang      = require('../../config/lang.js');
const link      = require('../../config/link.js');
const layer     = require('../../utils/webServer/layer.js');

//继承基类
function WebGoPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    link: link.web.goApp
  }
}
WebGoPage.prototype = new pageBasic();

WebGoPage.prototype.onPreload = function (option) {
  this.render();
}



/* 业务 */
/**
 * 加载失败
 */
WebGoPage.prototype.goFail = function (e) {
  layer.toast(lang.networkError);
  this.goBack();
}

Page(new WebGoPage(lang.goApp));