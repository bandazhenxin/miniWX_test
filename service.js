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
  //init
  var code = null;
  var pass = false;
  layer.busy(' ',0);
  
  //get
  //授权登录
  wxAsyn.getSetting().then(res => {
    if (res.authSetting['scope.userInfo']){
      pass = true;
      return wxAsyn.login();
    }else{
      pass = false;
      if (isFunction(that.initBack)) that.initBack(res);
      layer.busy(false);
    }
  },msg => {
    layer.busy(false);
    layer.toast(msg.errMsg);
  })
  //获取用户信息
  .then(res => {
    if (pass){
      code = res.code;
      that.globalData.code = code;
      return wxAsyn.getUserInfo();
    }
  },msg => {
    layer.busy(false);
    layer.toast('登录失败');
  })
  //初始化
  .then(res => {
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
      return api.post(url, params);
    } 
  },msg => {
    layer.busy(false);
    layer.toast('登录失败');
  })
  //数据初始化
  .then(res => { 
    if(pass){
      console.log(res);
      if(res.status_code == 200){
        storage.setData('unionid', res.data.union_id);
        that.globalData.userBasicInfo = mergeObj(res.data.sys_user_info, res.data.wx_user_info);
        that.globalData.token = res.data.token;
        if (isFunction(that.initCallback)) that.initCallback(res);
      }else{
        pass = false;
        layer.busy(false);
      }
    }
  },msg => {
    layer.busy(false);
    layer.toast('初始化失败');
  });
} 

module.exports = service;