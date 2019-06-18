//reply
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function CompanyDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
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
    agency: false,

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

Page(new CompanyDetailPage(lang.companyDetail));