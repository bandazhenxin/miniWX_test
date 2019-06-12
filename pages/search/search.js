//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');

//instance
const service = new serviceClass();

//继承
function SearchPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    history_list: [],
    hot_list: [],
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

  //初始化热门搜索
  service.hotRender(this);
}

/**
 * 清除历史记录
 */
SearchPage.prototype.clearHistory = function (e){
  service.clearHistory(this);
}

/**
 * 点击搜索
 */
SearchPage.prototype.formSubmit = function (e){
  let search_text = e.detail.value.search_text;
  service.pointSearch(this, search_text);
}

/**
 * 记录搜索
 */
SearchPage.prototype.wordSearch = function (e){
  let search_text = e.currentTarget.dataset.text;
  service.pointSearch(this, search_text);
}

Page(new SearchPage(lang.search))