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
function NewsListPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},

    catalog: '',
    news_list: []
  }
}
NewsListPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
NewsListPage.prototype.onPreload = function (option) {
  //init
  let catalog = option.catalog;
  this.vm.catalog = catalog;
  this.render();

  //title
  this.setTitle(option.title);

  service.initRender(this);
}

/**
 * 显示时
 */
NewsListPage.prototype.onShow = function () {
  this.onLoad();
}

/**
 * 跳转详情
 */
NewsListPage.prototype.goDetail = function (e) {
  let catalog = e.currentTarget.dataset.catalog;
  let id = e.currentTarget.dataset.id;
  this.go('/pages/newsDetail/newsDetail?catalog=' + catalog + '&id=' + id);
}

Page(new NewsListPage(lang.news));