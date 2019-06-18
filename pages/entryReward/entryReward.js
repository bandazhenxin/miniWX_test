//reply
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function EntryRewardPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      phone: ''
    },
    detail: [],
    tips: ''
  }
}
EntryRewardPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
EntryRewardPage.prototype.onPreload = function (option) {
  this.render();
  service.initRender(this);
}

/**
 * 打电话
 */
EntryRewardPage.prototype.goLink = function (){
  wx.makePhoneCall({
    phoneNumber: this.vm.db.phone
  })
}



/** ui **/

Page(new EntryRewardPage(lang.entryReward))