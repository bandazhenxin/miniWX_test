//reply
const lang = require('../../config/lang.js');
const basic = require('../../config/basic.js');
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const help = require('../../utils/help.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;
const levenshtein = help.levenshtein;
const sortObj = help.sortObj;

//继承基类
function SelectJobTypePage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      top: 0,//视口顶部的高度,用于渲染字母索引
    },
    indexes: 'A',
    scroll_id: 'A',
    indexes_list: basic.letter,
    job_type_list: {},
  }
}
SelectJobTypePage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
SelectJobTypePage.prototype.onPreload = function (option) {
  this.render();

  //城市渲染
  service.jobTypeRender(this);
}



/** ui控制 **/
/**
 * 滑动事件
 */
SelectJobTypePage.prototype.jobTypeScroll = function (e) {
  let job_type_list = this.vm.job_type_list;
  let top = this.vm.db.top;
  let self = this;

  Object.keys(job_type_list).forEach(function (key) {
    let query = wx.createSelectorQuery();
    query.select('#area_' + key).boundingClientRect();
    query.exec(function (res) {
      let diff = Math.abs(res[0].top - top);
      if (diff <= 10) {
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
SelectJobTypePage.prototype.tapArea = function (e) {
  let indexes = e.currentTarget.dataset.indexes;
  this.renderDetail({
    indexes: indexes,
    scroll_id: indexes
  });
}

/**
 * 搜索
 */
SelectJobTypePage.prototype.formSubmit = function (e) {
  //init
  let text = e.detail.value.search_text;
  let job_type_list = this.vm.job_type_list;
  let distance_arr = [];

  //编辑距离列表
  Object.keys(job_type_list).forEach(function (key) {
    let indexes = key;
    let value = job_type_list[key];
    Object.keys(value).forEach(function (item_key) {
      let distance = levenshtein(text, value[item_key]['position_name']);
      distance_arr.push({
        distance: distance,
        indexes: indexes,
        id: value[item_key]['id'],
        name: value[item_key]['position_name']
      });
    });
  });

  //取最近编辑距离
  distance_arr = sortObj(distance_arr, 'distance');
  let distance = distance_arr[0];
  this.renderDetail({
    indexes: distance.indexes,
    scroll_id: distance.id
  });
}

/**
 * 点击回传
 */
SelectJobTypePage.prototype.selectJob = function (e) {
  //init
  let detail = e.currentTarget.dataset;
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];

  //数据回传
  prePage.backJobType(detail);
  this.goBack();
}

Page(new SelectJobTypePage(lang.jobType));