//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');
const link         = require('../../config/link.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function NewsListPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      option: {}
    },

    catalog: '',
    news_list: [],
    link: link
  }
}
NewsListPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
NewsListPage.prototype.onPreload = function (option) {
  this.vm.db.option = option;
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
  this.onLoad(this.vm.db.option);
}

/**
 * 跳转详情
 */
NewsListPage.prototype.goDetail = function (e) {
  let data = e.currentTarget.dataset;
  let { catalog, id, jid } = data;
  this.go('/pages/newsDetail/newsDetail?catalog=' + catalog + '&id=' + id + '&jid=' + jid);
}

Page(new NewsListPage(lang.news));