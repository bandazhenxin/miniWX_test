//reply
const lang         = require('../../config/lang.js');
const basic        = require('../../config/basic.js');
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');

//instance
const service     = new serviceClass();
const isEmpty     = help.isEmpty;
const levenshtein = help.levenshtein;
const sortObj     = help.sortObj;

//继承基类
function SelectCityPage(title){
  pageBasic.call(this, title);
  this.vm = {
    db: {
      top: 0,//视口顶部的高度,用于渲染字母索引
    },
    indexes: 'A',
    scroll_id: 'A',
    indexes_list: basic.letter,
    city_list: {},
  }
}
SelectCityPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
SelectCityPage.prototype.onPreload = function (option) {
  this.render();

  //城市渲染
  service.cityRender(this);
}



/** ui控制 **/
/**
 * 滑动事件
 */
SelectCityPage.prototype.cityScroll = function (e){
  let city_list = this.vm.city_list;
  let top = this.vm.db.top;
  let self = this;

  Object.keys(city_list).forEach(function (key) {
    let query = wx.createSelectorQuery();
    query.select('#area_' + key).boundingClientRect();
    query.exec(function (res) {
      let diff = Math.abs(res[0].top - top);
      if (diff <= 10){
        self.renderDetail({
          indexes: key
        });
      }
    })
  });
}

/**
 * 索引跳转
 */
SelectCityPage.prototype.tapArea = function (e) {
  let indexes = e.currentTarget.dataset.indexes;
  this.renderDetail({
    indexes: indexes,
    scroll_id: indexes
  });
}

/**
 * 城市搜索
 */
SelectCityPage.prototype.formSubmit = function (e){
  //init
  let text = e.detail.value.search_text;
  let city_list = this.vm.city_list;
  let distance_arr = [];

  //编辑距离列表
  Object.keys(city_list).forEach(function (key){
    let indexes = key;
    let value   = city_list[key];
    Object.keys(value).forEach(function (item_key){
      let distance = levenshtein(text, value[item_key]['city_name']);
      distance_arr.push({
        distance: distance,
        indexes: indexes,
        code: value[item_key]['code'],
        city: value[item_key]['city_name']
      });
    });
  });

  //取最近编辑距离
  distance_arr = sortObj(distance_arr, 'distance');
  let distance = distance_arr[0];
  this.renderDetail({
    indexes: distance.indexes,
    scroll_id: distance.code
  });
}

/**
 * 点击回传
 */
SelectCityPage.prototype.selectCity = function (e){
  //init
  let detail  = e.currentTarget.dataset;
  let pages   = getCurrentPages();
  let prePage = pages[pages.length - 2];

  //数据回传
  prePage.backCity(detail);
  this.goBack();
}

Page(new SelectCityPage(lang.city));