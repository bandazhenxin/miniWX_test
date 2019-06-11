//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const lang         = require('../../config/lang.js');

//instance
const service = new serviceClass();

//继承
function SearchPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {}
  }
};
SearchPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 初始化
 */
SearchPage.prototype.onPreload = function (option){
  //初始化历史记录
  service.historyRender(this);
}

Page(new SearchPage(lang.search))