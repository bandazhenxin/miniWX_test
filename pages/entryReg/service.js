//reply
const app      = getApp();
const lang     = require('../../config/lang.js');
const config   = require('../../config/request.js');
const layer    = require('../../utils/webServer/layer.js');
const apiBasic = require('../../core/apiBasic.js');
const help     = require('../../utils/help.js');

//instance
const api      = new apiBasic();
const signMd5  = help.sign;
const mergeArr = help.mergeArr;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    entry_registration: config.entry_registration
  };
}

/**
 * 初始渲染
 */
service.prototype.initRender = function (that) {
  let index_page = that.getIndexPage();
  let params = that.vm.db.params;
  let jobInfo = index_page.vm.content_list[params.index][params.idx]
  that.renderDetail({
    basic_info: jobInfo
  });
}

/**
 * 提交入职信息
 */
service.prototype.save = function (that) {
  //init
  var self = this;

  //construct
  let params = {
    system:          config.system,
    version:         config.version,
    sign:            null,
    id:              that.vm.db.params.rid,
    name:            that.vm.db.form_data.name,
    id_card:         that.vm.db.form_data.id_card,
    entry_time:      that.vm.db.form_data.entry_time,
    entry_image_url: that.vm.db.form_data.entry_image_url,
    token:           app.globalData.token
  };

  //singn
  let url     = this.urlList.entry_registration;
  let sign    = signMd5(config.key, params);
  params.sign = sign;
  
  //post
  api.post(url, params).then(res => {
    if (res.status_code == 200) {
      //回传渲染报名状态
      let index_page = that.getIndexPage();
      let pre_list = index_page.vm.content_list;
      let params = that.vm.db.params;
      pre_list[params.index].splice(params.idx, 1);
      index_page.renderDetail({
        content_list: pre_list
      });
      layer.toast(lang.saveSuccess);
      that.goIndex();
    } else {
      layer.toast(res.message);
    }
  }, msg => {
    layer.toast(lang.networkError);
  });
}

module.exports = service;