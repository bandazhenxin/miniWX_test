//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function JobDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},

    scroll_into: '',
    is_collect:false,
    is_enroll: false,

    id: 0,
    tabs: [
      {
        label: 'treatment',
        value: lang.treatment
      },{
        label: 'jobDescription',
        value: lang.jobDescription
      },{
        label: 'welfare',
        value: lang.welfare
      },{
        label: 'admissionCondition',
        value: lang.admissionCondition
      }
    ],
    banner_list: [],
    company_info: {},
    position_info: {},
    reward:{},
    evaluate:{},
    agency: false,

    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  }
}
JobDetailPage.prototype = new pageBasic();




/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
JobDetailPage.prototype.onPreload = function (option) {
  //init
  let id = option.id;
  this.vm.id = id;
  this.render();
  
  //导航栏初始化
  let that = this;
  let sliderWidth = 96;
  wx.getSystemInfo({
    success: function (res) {
      that.renderDetail({
        sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
        sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
      });
    }
  });

  //渲染初始页面
  service.initRender(this);

  //获取收藏信息
  service.getCollect(this);

  //是否已报名
  service.isEnroll(this);
}

/**
 * 分享操作
 */
JobDetailPage.prototype.onShareAppMessage = function (e) {
  return {
    title: lang.shareJob + '：' + this.vm.position_info.title
  }
}

/**
 * 收藏和取消收藏
 */
JobDetailPage.prototype.collectAction = function (e) {
  service.collection(this);
}

/**
 * 跳转页面
 */
JobDetailPage.prototype.goLink = function (e){
  let route = e.currentTarget.dataset.route;
  let params = e.currentTarget.dataset.params;
  this.go('/pages/' + route + '/' + route + params);
}



/** ui **/

/**
 * 选项卡事件
 */
JobDetailPage.prototype.tabClick = function (e) {
  let detail = e.currentTarget.dataset;

  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id,
    scroll_into: detail.label
  });
}

/**
 * 报名成功回传
 */
JobDetailPage.prototype.signUpSuccess = function (option) {
  this.renderDetail({
    is_enroll: true
  });
}


Page(new JobDetailPage(lang.up))