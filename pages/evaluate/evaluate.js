//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function EvaluatelPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db:{},
    id: '',
    tabs: [{ 
        label: 'newest', 
        name: lang.newest 
      }, { 
        label: 'praise', 
        name: lang.praise 
      }, { 
        label: 'passable', 
        name: lang.passable 
      }, { 
        label: 'negative', 
        name: lang.negative 
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    company_info: {},
    evaluate_list: []
  }
}
EvaluatelPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
EvaluatelPage.prototype.onPreload = function (option) {
  //init
  this.vm.id = option.id;
  this.render();

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
};

/**
 * 去web中转页
 */
EvaluatelPage.prototype.webGo = function () {
  this.go('/pages/webGo/webGo');
}



/** ui **/

/**
 * 选项卡事件
 */
EvaluatelPage.prototype.tabClick = function (e) {
  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
}

Page(new EvaluatelPage(lang.evaluate));