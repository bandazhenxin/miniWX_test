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

    id: 0,
    tabs: [lang.treatment, lang.jobDescription, lang.welfare, lang.admissionCondition],
    banner_list: [],
    company_info: {},
    position_info: {},
    reward:{},

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
}



/** ui **/

/**
 * 选项卡事件
 */
JobDetailPage.prototype.tabClick = function (e) {
  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
}


Page(new JobDetailPage(lang.up))