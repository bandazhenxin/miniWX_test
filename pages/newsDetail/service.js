//reply
const app      = getApp();
const config   = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer    = require('../../utils/webServer/layer.js');
const help     = require('../../utils/help.js');
const lang     = require('../../config/lang.js');

//instance
const api        = new apiBasic();
const signMd5    = help.sign;
const isEmpty    = help.isEmpty;
const feedFilter = help.feedFilter;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    messages_detail: config.messages_detail
  };
}

//public
service.prototype = {
  initRender: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      token: app.globalData.token,
      catalog: that.vm.catalog,
      id: that.vm.id
    };

    //singn
    let url = this.urlList.messages_detail;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        res.data.contents = feedFilter(res.data.contents);
        that.renderDetail({
          detail: res.data
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    });
  },
}

module.exports = service;