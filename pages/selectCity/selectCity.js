//reply
const lang         = require('../../config/lang.js');
const basic        = require('../../config/basic.js');
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function SelectCityPage(title){
  pageBasic.call(this, title);
  this.vm = {
    db: {
      top: 0,//视口顶部的高度,用于渲染字母索引
    },
    indexes: 'A',
    indexes_list: basic.letter,
    city_list: {},
  }
}
SelectCityPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
SelectCityPage.prototype.onPreload = function (option) {
  this.render();

  //城市渲染
  service.cityRender(this);
}



/** ui控制 **/
/**
 * 滑动事件
 */
SelectCityPage.prototype.cityScroll = function (e){
  let city_list = this.vm.city_list;
  let top = this.vm.db.top;
  let self = this;

  Object.keys(city_list).forEach(function (key) {
    let query = wx.createSelectorQuery();
    query.select('#area_' + key).boundingClientRect();
    query.exec(function (res) {
      let diff = Math.abs(res[0].top - top);
      if (diff <= 10){
        self.renderDetail({
          indexes: key
        });
      }
    })
  })
}

/**
 * 索引跳转
 */
SelectCityPage.prototype.tapArea = function (e) {
  console.log(e);
  let indexes = e.currentTarget.dataset.indexes;
  this.renderDetail({
    indexes: indexes
  });
}

//点击回传

Page(new SelectCityPage(lang.city));