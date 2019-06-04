//reply
const config       = require('config/request.js');
const apiBasic     = require('core/apiBasic.js');
const storageClass = require('core/storage.js');
const layer        = require('utils/webServer/layer.js');
const wxAsyn       = require('utils/webServer/asyn/wxAsyn.js');
const help         = require('utils/help.js');

//instance
const api        = new apiBasic();
const storage    = new storageClass();
const signMd5    = help.sign;
const isFunction = help.isFunction;
const mergeObj   = help.mergeObj;

function service(){
  //接口路径
  this.urlList = {
    init: config.initUrl
  };
}

//业务初始化，获取token
service.prototype.initGet = function (that){
  var code = null;
  var pass = false;
  wxAsyn.getSetting().then(res => {
    if (res.authSetting['scope.userInfo']){
      pass = true;
      return wxAsyn.login();
    }
  }).then(res => {
    if (pass){
      code = res.code;
      return wxAsyn.getUserInfo();
    }
  }).then(res => {
    if (pass){
      let params = {
        system: config.system,
        version: config.version,
        sign: null,
        code: code,
        raw_data: res.rawData,
        signature: res.signature,
        encrypted_data: res.encryptedData,
        iv: res.iv
      };
      let url = this.urlList.init;
      let sign = signMd5(config.key, params);
      params.sign = sign;
      console.log(JSON.stringify(params))
      return api.post(url, params);
    }
  }).then(res => { 
    if(pass){
      console.log(res);
      if(res.status_code == 200){
        storage.setData('unionid', res.data.union_id);
        console.log(mergeObj(res.data.sys_user_info, res.data.wx_user_info));
        // that.globalData.userBasicInfo = res.data
        if (isFunction(that.userInfoReadyCallback)) that.userInfoReadyCallback(res);
      }else{
        pass = false;
        layer.busy(res.message);
      }
    }
  });
} 

module.exports = service;