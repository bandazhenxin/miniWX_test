//reply
const app = getApp();
const config = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');
const wxAsyn = require('../../utils/webServer/asyn/wxAsyn.js');
//instance
const api = new apiBasic();
const signMd5 = help.sign;
const mergeObj = help.mergeObj;
//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    getPersonalInfo: config.personal_info
  };
}

//public
service.prototype = {
  // 获取当前职位
  getPersonalInfo: function (that) {
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      token: app.globalData.token
    }
    console.log(app.globalData)
    let url = this.urlList.getPersonalInfo
    let sign = signMd5(config.key, params)
    console.log(params)
    params.sign = sign
    api.post(url, params).then(res => {
      if (res.status_code === 200) {
        var { mobile,grade} = res.data;
        that.vm.userInfo=mergeObj({mobile,grade},that.vm.userInfo)
        layer.busy(false);
        that.render();
      } else {
        layer.busy(false);
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    })
  }
}

module.exports = service;