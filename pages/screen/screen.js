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
  this.selectRender = function(vm_name,value,name){
    //多选模式
    // let pre = this.vm[vm_name];
    // if (!pre.hasOwnProperty(value)) pre[value] = true;

    //单选模式
    let pre = {};
    pre[value] = name;

    let params = {};
    params[vm_name] = pre;
    this.renderDetail(params);
    this.backIndex();
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
    this.backIndex();
  }

  /**
   * 数据传回首页并渲染
   */
  this.backIndex = function(){
    //data
    let self = this;
    let params = {
      city_select: self.vm.city_select,
      type_select: self.vm.type_select,
      range_select: self.vm.range_select,
      catalog_select: self.vm.catalog_select
    };
    let pages = getCurrentPages();
    let index_page = pages[pages.length - 2];

    //render
    index_page.renderDetail({
      screen_tags: params
    });
    index_page.screenTextRender();
  }

  /**
   * 同步首页数据
   */
  this.synData = function(){
    //get
    let pages = getCurrentPages();
    let index_page = pages[pages.length - 2];
    let select_data = index_page.vm.screen_tags;

    //render
    this.renderDetail(select_data);
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

  //同步父页面数据
  this.synData();
}

/**
 * 跳转选择
 */
ScreenPage.prototype.goSelect = function (e){
  let route = e.currentTarget.dataset.route;
  this.go('/pages/' + route + '/' + route);
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
  let name = detail.name;

  this.selectRender(select_name, value, name);
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