//reply
const lang = require('../../config/lang.js');
const pageBasic = require('../../core/pageBasic.js');
const serviceClass = require('service.js');

//instance
const service = new serviceClass();

//继承基类
function SelectSalaryPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db: {
      type_map: [0,1,2,3]
    },
    tabs: ['月薪', '日薪', '周薪', '时薪'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],
    select: {}
  }

  /**
   * 数据回传
   */
  this.backScreen = function(){
    //instance
    let pages = getCurrentPages();
    let prepage = pages[pages.length - 2];

    prepage.backSalary(this.vm.select);
  }
}
SelectSalaryPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
SelectSalaryPage.prototype.onPreload = function (option) {
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

  //列表渲染
  service.listRender(this);
}

/**
 * 选择薪资
 */
SelectSalaryPage.prototype.selectSalary = function (e) {
  let detail = e.currentTarget.dataset;
  let data = {
    label: detail.label,
    value: detail.value,
    type: this.vm.db.type_map[detail.indexes],
    type_name: this.vm.tabs[detail.indexes]
  };

  this.renderDetail({
    select: data
  });

  //数据回传
  this.backScreen();
}



/** ui **/

/**
 * 选项卡事件
 */
SelectSalaryPage.prototype.tabClick = function (e) {
  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  });
}

Page(new SelectSalaryPage(lang.salaryRange));