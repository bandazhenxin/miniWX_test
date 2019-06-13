 //reply
const app          = getApp();
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const layer        = require('../../utils/webServer/layer.js');
const help         = require('../../utils/help.js');
const config       = require('../../config/basic.js');
const lang         = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function IndexPage(title) {
  pageBasic.call(this,title);
  this.vm = {
    db:{
      page: 1,
      is_pulldown: null,
    },

    isOpen:    false,//是否可以打开页面
    isScroll:  false,
    bottom_is: true,

    userInfo:         {},
    hasBasicUserInfo: false,
    hasUserPhone:     false,
    position_item:    [],
    latitude:         config.latitude,
    longitude:        config.longitude,
    accuracy:         config.accuracy,
    province:         config.province,
    city:             config.city,
    list_position:    320,

    sort_name:          '',
    sort:               '',
    sort_is_recommend:  1,
    sort_salary_order:  1,
    sort_subsidy_order: 1,
    sort_reward_order:  1,

    tags_list:  {},
    tags_select: [],
    search_text: lang.search,
    screen_text: '',
    screen_tags: {}
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
    if (app.globalData.userBasicInfo.hasOwnProperty('mobile')) this.vm.hasUserPhone = true;
    layer.busy(false);
    this.render();
    
    //职位初始渲染与初始定位
    service.indexRender(this);
  }

  //渲染标签列表
  service.tagsRender(this);
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
 * 排序
 */
IndexPage.prototype.sortSearch = function(e){
  //init
  let detail   = e.currentTarget.dataset;
  let sortname = detail.sortname;
  let sort     = (detail.sort === 0)?1:0;
  let dataObj  = {
    sort_name: sortname,
    sort: sort
  };

  //ui
  this.vm.sort_name = sortname;
  this.vm.sort = sort;
  this.vm['sort_' + sortname] = sort;
  dataObj['sort_' + sortname] = sort;
  this.renderDetail(dataObj);

  //service
  service.basicRender(this,0);
}

/**
 * 添加标签
 */
IndexPage.prototype.tagsSearch = function(e){
  //init
  let detail  = e.currentTarget.dataset;
  let tags    = detail.tagsname;
  let id      = detail.id;
  
  //ui
  let tags_select = this.vm.tags_select;
  tags_select[id] = tags;
  this.renderDetail({
    tags_select: tags_select
  });

  //service
  service.basicRender(this,0);
}

/**
 * 撤除标签
 */
IndexPage.prototype.delTags = function(e){
  //init
  let detail = e.currentTarget.dataset;
  let id = detail.id;
  
  //ui
  let tags_select = this.vm.tags_select;
  if (tags_select[id]) delete tags_select[id]; //删除元素
  this.renderDetail({
    tags_select: tags_select
  });

  //service
  service.basicRender(this, 0);
}

/**
 * 滚动翻页
 */
IndexPage.prototype.pageRender = function (event){
  service.basicRender(this,1);
}

/**
 * 跳转筛选页面
 */
IndexPage.prototype.goScreen = function (event){
  this.go('/pages/screen/screen');
}



/** ui逻辑控制 **/

/**
 * 释放滑动判断 && 下拉更新
 */
IndexPage.prototype.backTop = function(event){
  let y = event.detail.y;
  this.vm.isScroll = (parseFloat(y) <= 0);
  this.renderDetail({
    isScroll: this.vm.isScroll
  });

  //下拉更新，惰性单例
  if(this.vm.db.is_pulldown === null && y >= 175){
    this.vm.db.is_pulldown = true;
    wx.startPullDownRefresh();
    service.refresh(this);
  }
}

/**
 * 点击搜索框置顶
 */
IndexPage.prototype.roof = function(){
  //本页置顶
  this.vm.list_position = 0;
  this.renderDetail({
    list_position: 0
  });

  //重定向至下一页
  this.go('/pages/search/search');
}

/**
 * 渲染筛选标签
 */
IndexPage.prototype.screenTextRender = function (){
  //handle
  let text = [];
  let screen_tags = this.vm.screen_tags;
  Object.keys(screen_tags).forEach(function (key){
    let value = screen_tags[key];
    Object.keys(value).forEach(function (item_ley) {
      text.push(value[item_ley]);
    })
  })

  //render text
  text = text.join(' | ');
  this.renderDetail({
    screen_text: text
  });

  //render list
  service.basicRender(this);
}

/**
 * 清空筛选标签
 */
IndexPage.prototype.clearHistory = function (){
  this.renderDetail({
    screen_tags: {}
  });

  //render
  this.screenTextRender();
}

Page(new IndexPage(lang.up));
