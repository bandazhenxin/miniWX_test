//reply
const lang          = require('../../config/lang.js');
const pageBasic     = require('../../core/pageBasic.js');
const layer         = require('../../utils/webServer/layer.js');
const help          = require('../../utils/help.js');
const serviceClass  = require('service.js');
const validataClass = require('../../utils/webServer/validata.js');

//instance
const service  = new serviceClass();
const isEmpty  = help.isEmpty;
const Validata = new validataClass();

//继承基类
function EntryRegPage(title) {
  pageBasic.call(this, title);

  this.vm = {
    db: {
      params: {},
      form_data: {}
    },
    basic_info: {},
    file: false,
    time_text: ''
  };
}
EntryRegPage.prototype = new pageBasic();



/* 业务逻辑 */

/**
 * 初始化
 */
EntryRegPage.prototype.onPreload = function (option) {
  this.vm.db.params = option;
  service.initRender(this);
}

/**
 * 上传图片
 */
EntryRegPage.prototype.chooseImage = function (e) {
  let that = this;
  wx.chooseImage({
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      that.renderDetail({
        file: res.tempFilePaths[0]
      });
    }
  })
}

EntryRegPage.prototype.save = function (e) {
  //init
  let data = e.detail.value;

  //validata
  //require
  if (!data.name) {
    layer.toast(lang.nameTips);
    return;
  }
  if (!data.id_card) {
    layer.toast(lang.idCardTips);
    return;
  }
  if (!data.entry_time) {
    layer.toast(lang.entryTimeTips);
    return;
  }
  if (!data.entry_image_url) {
    layer.toast(lang.entryImageTips);
    return;
  }

  //身份证
  let isCard = Validata.isCardID(data.id_card);
  if (isCard !== true) {
    layer.toast(isCard);
    return;
  }

  //报名操作
  this.vm.db.form_data = data;
  service.save(this);
}



/* ui */

/**
 * 日期选择
 */
EntryRegPage.prototype.bindDateChange = function (e) {
  let val = e.detail.value;
  this.renderDetail({
    time_text: val
  });
}

Page(new EntryRegPage(lang.entryReg));