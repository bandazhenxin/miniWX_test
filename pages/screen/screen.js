//reply
const lang         = require('../../config/lang.js');
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function ScreenPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
    },
    city_list:      [],
    type_list:      [],
    range_list:     [],
    catalog_list:   [],
    city_select:    {},
    type_select:    {},
    range_select:   {},
    catalog_select: {}
  }

  /**
   * 选择渲染
   */
  this.selectRender = function(vm_name,value){
    //多选模式
    // let pre = this.vm[vm_name];
    // if (!pre.hasOwnProperty(value)) pre[value] = true;

    //单选模式
    let pre = {};
    pre[value] = true;

    let params = {};
    params[vm_name] = pre;
    this.renderDetail(params);
  }

  /**
   * 取消渲染
   */
  this.selectDel = function (vm_name, value){
    let pre = this.vm[vm_name];
    if (pre.hasOwnProperty(value)) delete pre[value];

    let params = {};
    params[vm_name] = pre;
    this.renderDetail(params);
  }
};
ScreenPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
ScreenPage.prototype.onPreload = function (option){
  //标签渲染
  service.tagsRender(this);
}



/** ui控制 */

/**
 * 选择
 */
ScreenPage.prototype.pointSelect = function (e){
  //construct
  let detail = e.currentTarget.dataset;
  let select_name = detail.selectname;
  let value = detail.key;

  this.selectRender(select_name, value);
}

/**
 * 取消
 */
ScreenPage.prototype.delSelect = function (e){
  //construct
  let detail = e.currentTarget.dataset;
  let select_name = detail.selectname;
  let value = detail.key;

  this.selectDel(select_name, value);
}

Page(new ScreenPage(lang.screen));