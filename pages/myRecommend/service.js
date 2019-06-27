//reply
const app      = getApp();
const config   = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer    = require('../../utils/webServer/layer.js');
const help     = require('../../utils/help.js');
const lang     = require('../../config/lang.js');
const wxAsyn   = require('../../utils/webServer/asyn/wxAsyn.js');

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
    getIntroducerList: config.getIntroducerList //获取推荐列表
  };
}

//public
/**
 * 获取推荐列表
 * 默认团队 -2 下属 type -1
 */
service.prototype.getIntroducerList = function (that, type) {
  //construct
  if (!type) type = -2
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    type: type,
    page: 1,
    token: app.globalData.token
  }

  //sign
  let url = this.urlList.getIntroducerList
  let sign = signMd5(config.key, params)
  params.sign = sign

  //post
  api.post(url, params).then(res => {
    if (res.status_code === 200) {
      that.vm.recommendList = res.data.list;
      that.render();
    } else {
      layer.toast(res.message);
    }
  }, msg => {
    layer.toast(lang.networkError);
  })
}

module.exports = service;