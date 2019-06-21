//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function NewsDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},

    catalog: '',
    id: '',
    detail: {}
  }
}
NewsDetailPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
NewsDetailPage.prototype.onPreload = function (option) {
  //init
  let catalog = option.catalog;
  let id = option.id;
  this.vm.catalog = catalog;
  this.vm.id = id;
  this.render();

  service.initRender(this);
}

Page(new NewsDetailPage(lang.newsDetail));