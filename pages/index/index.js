 //reply
const app          = getApp();
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const layer        = require('../../utils/webServer/layer.js');
const help         = require('../../utils/help.js');
const config       = require('../../config/basic.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function IndexPage(title) {
  pageBasic.call(this,title);
  this.vm = {
    db:{},
    isGo: false,//是否可跳转，只有与重定向页面有关的异步调用结束后才可以跳转
    isOpen: false,//是否可以打开页面
    isScroll: false,
    motto: 'Hello World',
    userInfo: {},
    hasBasicUserInfo: false,
    hasUserPhone: false,
    position_item: [],
    latitude: config.latitude,
    longitude: config.longitude,
    accuracy: config.accuracy,
    province: config.province,
    city: config.city,
    list_position: 320,
    sort_name: '',
    sort: '',
    sort_is_recommend: 1,
    sort_salary_order: 1,
    sort_subsidy_order: 1,
    sort_reward_order: 1
  }
};
IndexPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
IndexPage.prototype.onPreload = function(option){
  //init
  wx.hideTabBar();
  if (!isEmpty(app.globalData.userBasicInfo)) this.vm.hasBasicUserInfo = true;
  if (app.globalData.userBasicInfo.hasOwnProperty('mobile')) this.vm.hasUserPhone = true;
  this.render();

  //初始回调
  app.initBack = res => {
    this.vm.isOpen = true;
    layer.busy(false);
    this.render();
  }

  //注册回调
  app.initCallback = res => {
    this.vm.hasBasicUserInfo = true;
    this.vm.isOpen = true;
    this.vm.isGo = true;
    if (app.globalData.userBasicInfo.hasOwnProperty('mobile')) this.vm.hasUserPhone = true;
    layer.busy(false);
    this.render();
    
    //职位初始渲染与初始定位
    service.indexRender(this);
  }
}

/**
 * 获取用户信息
 */
IndexPage.prototype.getUserInfo = function (e) {
  service.init(app, this, e.detail);
}

/**
 * 获取用户手机信息
 */
IndexPage.prototype.getPhoneNumber = function(e){
  service.getMobile(app, this, e.detail);
}

/**
 * 排序事件搜索搜索
 */
IndexPage.prototype.sortSearch = function(e){
  //init
  let datail   = e.currentTarget.dataset;
  let sortname = datail.sortname;
  let sort     = (datail.sort === 0)?1:0;
  let dataObj  = {
    sort_name: sortname,
    sort: sort
  };

  //控制样式
  this.vm.sort_name = sortname;
  this.vm.sort = sort;
  this.vm['sort_' + sortname] = sort;
  dataObj['sort_' + sortname] = sort;
  this.renderDeatil(dataObj);

  //渲染职位列表
  service.basicRender(this);
}




/** ui逻辑控制 **/

/**
 * 释放滑动判断
 */
IndexPage.prototype.backTop = function(event){
  let y = event.detail.y;
  this.vm.isScroll = (parseFloat(y) <= 0);
  this.renderDeatil({
    isScroll: this.vm.isScroll
  });
}

/**
 * 点击搜索框置顶
 */
IndexPage.prototype.roof = function(){
  this.vm.list_position = 0;
  this.render();
}

Page(new IndexPage('悠聘'));
