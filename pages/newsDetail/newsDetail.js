//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');

//instance
const service = new serviceClass();
const { isEmpty } = help;

//继承基类
function NewsDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},

    catalog: '',
    id: '',
    jid: '',
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
  let { catalog, id, jid } = option;
  this.vm.catalog = catalog;
  this.vm.id = id;
  this.vm.jid = jid;
  this.render();

  service.initRender(this);
}

/**
 * 跳转职位详情
 */
NewsDetailPage.prototype.goDetail = function (e) {
  let data = e.currentTarget.dataset;
  let suffix = this.creatUrlParams(data);
  
  this.go(lang.jobDetailPage + suffix);
}

Page(new NewsDetailPage(lang.newsDetail));