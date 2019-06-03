//reply
const apiBasic = require('core/apiBasic.js');
const layer = require('utils/webServer/layer.js');
const wxAsyn = require('utils/webServer/asyn/wxAsyn.js');
const api = new apiBasic();

function service(){
  //接口路径
  this.urlList = {
    init: 'https://coolthings.goho.co/get/miniInit'
  };
}

//业务初始化，获取token
service.prototype.initGet = function (that,callback){
  var code = null;
  wxAsyn.getSetting().then(res => {
    code = res.code;
    return wxAsyn.getUserInfo();
  }).then(res => {//后端初始化
    console.log(res);
    return wxAsyn.getSetting();
  },msg => {
    layer.busy(msg);
  }).then(res => {//判断授权登录
    console.log('授权：');
    console.log(res);
    console.log(res.authSetting['scope.userLocation']);
    if (res.authSetting['scope.userInfo']){
      console.log(res.authSetting['scope.userInfo']);
      return wxAsyn.getUserInfo(); 
    }
  }).then(res => {//获取用户信息 
    console.log('getuserinfo:')
    console.log(res);
    (typeof callback === "function") && callback();
  });
} 

module.exports = service;