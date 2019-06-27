//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const link         = require('../../config/link.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function CompanyDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      company_jobs: []
    },
    id: '',
    tabs: [
      {
        label: 'companyDescribe',
        value: lang.companyDescribe
      }, {
        label: 'linkType',
        value: lang.linkType
      }, {
        label: 'companyEvaluate',
        value: lang.companyEvaluate
      }, {
        label: 'relevantPositions',
        value: lang.relevantPositions
      }
    ],
    banner_list: [],
    company_info: {},
    reward: {},
    evaluate: {},
    company_jobs: {},

    link:link,

    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  }
}
CompanyDetailPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
CompanyDetailPage.prototype.onPreload = function (option) {
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

  service.initRender(this);
}

/**
 * 更多职位
 */
CompanyDetailPage.prototype.completeJob = function(){
  service.completeJob(this);
}

/**
 * 查看详细评价
 */
CompanyDetailPage.prototype.goEvaluate = function(){
  this.go('/pages/evaluate/evaluate?id=' + this.vm.company_info.pid);
}

/**
 * 跳转详情页
 */
CompanyDetailPage.prototype.goDetail = function (e) {
  let detail = e.currentTarget.dataset;
  this.go('/pages/jobDetail/jobDetail?id=' + detail.id);
}


/** ui **/

/**
 * 选项卡事件
 */
CompanyDetailPage.prototype.tabClick = function (e) {
  let detail = e.currentTarget.dataset;

  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id,
    scroll_into: detail.label
  });
}

Page(new CompanyDetailPage(lang.companyDetail));