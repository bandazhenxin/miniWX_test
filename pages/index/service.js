//reply
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const wxAsyn = require('../../utils/webServer/asyn/wxAsyn.js');
const storageClass = require('../../core/storage.js');

//instance
const api = new apiBasic();
const storage = new storageClass();

//private
function service() {
  //接口路径
  this.urlList = {
    init:'https://'
  };
}

//public
service.prototype = {
  /**
   * 授权登录初始化
   */
  init:function(app,that,detail){
    var code = null;
    wxAsyn.login().then(res => {
      code = res.code;
      return wxAsyn.getUserInfo();
    }).then(res => {
      let params = {
        code: code,
        encryptedData: res.encryptedData,
        iv: res.iv,
        rawData: res.rawData,
        signature: res.signature
      };
      let url = this.urlList.init;
      console.log(params);
      return api.post(url,params);
    }).then(res => {
      console.log(res);
    });
  },
};

module.exports = service;