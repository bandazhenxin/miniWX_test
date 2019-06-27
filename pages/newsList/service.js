//reply
const app = getApp();
const config = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');

//instance
const api = new apiBasic();
const signMd5 = help.sign;
const isEmpty = help.isEmpty;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    messages_list: config.messages_list
  };

  /**
   * 构造列表数据
   */
  this.constructList = function (list) {
    let info = [];
    for(let val of list){
      if (val.contents.length >= 60){
        val.contents = val.contents.substr(0,60) + '...';
      }
      info.push(val);
    }
    return info;
  }
}

//public
/**
 * 初始渲染
 */
service.prototype.initRender = function (that) {
  //init
  var self = this;

  //construct
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    catalog: that.vm.catalog,
    uid: app.globalData.userBasicInfo.user_id
  };

  //singn
  let url = this.urlList.messages_list;
  let sign = signMd5(config.key, params);
  params.sign = sign;

  //post
  api.post(url, params).then(res => {
    console.log(res);
    if (res.status_code == 200) {
      that.renderDetail({
        news_list: this.constructList(res.data.list)
      });
    } else {
      layer.toast(res.message);
    }
  }, msg => {
    layer.toast(lang.networkError);
  });
}

module.exports = service;