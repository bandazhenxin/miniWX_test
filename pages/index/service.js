//reply
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const wxAsyn = require('../../utils/webServer/asyn/wxAsyn.js');
const storageClass = require('../../core/storage.js');
const help = require('../../utils/help.js');

//instance
const api = new apiBasic();
const storage = new storageClass();
const signMd5 = help.sign;

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
    wxAsyn.login().then(res => {//登录
      code = res.code;
      return wxAsyn.getUserInfo();
    }).then(res => {//获取用户信息
      let params = {
        system: 'wechat',
        version: 1,
        sign: null,
        code: code,
        rawData: res.rawData,
        signature: res.signature,
        encryptedData: res.encryptedData,
        iv: res.iv
      };
      let url = this.urlList.init;
      let sign = signMd5(params);
      params.sign = sign;
      console.log(params);
      return api.post(url,params);
    }).then(res => {//服务端解密
      console.log(res);
    });
  },
};

module.exports = service;