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
function NewsPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      option:{}
    },
    news_list: []
  }
}
NewsPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
NewsPage.prototype.onPreload = function (option) {
  this.vm.db.option = option;
  service.initRender(this);
}

/**
 * 下拉更新
 */
NewsPage.prototype.onPullDownRefresh = function (e) {
  service.initRender(this);
}

/**
 * 显示时
 */
NewsPage.prototype.onShow = function () {
  this.onLoad(this.vm.db.option);
}

/**
 * 消息详情
 */
NewsPage.prototype.goDetail = function (e) {
  let catalog = e.currentTarget.dataset.id;
  let title = e.currentTarget.dataset.title;
  this.go('/pages/newsList/newsList?catalog=' + catalog + '&title=' + title);
}

Page(new NewsPage(lang.news));