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
    catalog_select: {},
    isNull:         true
  }

  /**
   * 判断是否选择
   */
  this.isText = function(){
    this.renderDetail({
      isNull: isEmpty(this.vm.city_select) && isEmpty(this.vm.range_select) && isEmpty(this.vm.catalog_select)
    });
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
    this.isText();
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
    this.linkageHack();//薪资联动检查
    this.backIndex();
    this.isText();
  }

  /**
   * 补充
   * 取消薪资范围联动取消薪资类型
   * 这是一个补充函数
   */
  this.linkageHack = function(){
    if (isEmpty(this.vm.range_select)){
      this.renderDetail({
        type_select: {}
      });
    }
  }

  /**
   * 传回筛选列表
   */
  this.backList = function(){
    //instance
    let pages = getCurrentPages();
    let index_page = pages[pages.length - 2];
    index_page = index_page.isCurrentPage() ? index_page : pages[pages.length - 3];

    //render
    index_page.vm.db.screen_list = {
      city_list: this.vm.city_list,
      type_list: this.vm.type_list,
      range_list: this.vm.range_list,
      catalog_list: this.vm.catalog_list
    }
  }

  /**
   * 同步筛选列表
   */
  this.synList = function(){
    //instance
    let pages = getCurrentPages();
    let index_page = pages[pages.length - 2];
    index_page = index_page.isCurrentPage() ? index_page : pages[pages.length - 3];

    //render
    let screen_list = index_page.vm.db.screen_list;
    if (!isEmpty(screen_list)){
      this.renderDetail(screen_list);
      return true;
    }else{
      return false;
    }
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
    index_page = index_page.isCurrentPage() ? index_page : pages[pages.length - 3];
    
    //render
    index_page.renderDetail({
      screen_tags: params
    });
    index_page.screenTextRender();
  }

  /**
   * 同步首页筛选数据
   */
  this.synData = function(){
    //get
    let pages = getCurrentPages();
    let index_page = pages[pages.length - 2];
    let select_data = index_page.vm.screen_tags;

    //render
    this.renderDetail(select_data);
    this.isText();
  }
};
ScreenPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
ScreenPage.prototype.onPreload = function (option){
  //标签渲染
  if (!this.synList()) service.tagsRender(this);

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

/**
 * 更多城市回传
 */
ScreenPage.prototype.backCity = function (e){
  //init
  let pre_city_list = this.vm.city_list;

  //添加城市
  let pass = true;
  Object.keys(pre_city_list).forEach(function(key){//判断城市是否已存在
    if (pre_city_list[key]['code'] == e.code) pass = false;
  });
  if (pass){
    pre_city_list.push({
      name: e.name,
      city_name: e.city,
      province_name: e.province,
      code: e.code
    });
  }
  this.renderDetail({
    city_list: pre_city_list
  });
  this.backList();

  //select
  this.selectRender('city_select', e.code, e.name); 
}

/**
 * 更多工种回传
 */
ScreenPage.prototype.backJobType = function (e){
  //init
  let pre_catalog_list = this.vm.catalog_list;

  //添加工种
  let pass = true;
  Object.keys(pre_catalog_list).forEach(function (key) {//判断城市是否已存在
    if (pre_catalog_list[key]['id'] == e.id) pass = false;
  });
  if (pass) {
    pre_catalog_list.push({
      position_name: e.name,
      id: e.id
    });
  }
  this.renderDetail({
    catalog_list: pre_catalog_list
  });
  this.backList();

  //select
  this.selectRender('catalog_select', e.id, e.name); 
}

/**
 * 更多薪资范围回传
 */
ScreenPage.prototype.backSalary = function (e){
  //init
  let pre_range_list = this.vm.range_list;

  //添加薪资范围
  let pass = true;
  Object.keys(pre_range_list).forEach(function (key) {//判断城市是否已存在
    if (pre_range_list[key]['var_label'] == e.label) pass = false;
  });
  if (pass) {
    pre_range_list.push({
      var_label: e.label,
      var_value: e.value
    });
  }
  this.renderDetail({
    range_list: pre_range_list
  });
  this.backList();

  //select
  this.selectRender('type_select', e.type, e.type_name); 
  this.selectRender('range_select', e.value , e.label);
}

/**
 * 回首页
 */
ScreenPage.prototype.goback = function (){
  this.goBack();
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