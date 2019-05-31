//reply
const apiBasic = require('core/apiBasic.js');
const layer = require('utils/webServer/layer.js');
const wxAsyn = require('utils/webServer/asyn/wxAsyn.js');
const api = new apiBasic();

function service(){
  //接口路径
  this.urlList = {
    miniInitUrl: 'https://coolthings.goho.co/get/miniInit'
  };
}

//业务初始化，获取token
service.prototype.initGet = function (that,callback){
  wxAsyn.login().then(res => {
    let params = this.urlList.miniInitUrl + '?code=' + res.code;
    return api.get(params);
  }).then(res => {//后端初始化
    console.log(res);
    return wxAsyn.getSetting();
  },msg => {
    layer.busy(msg);
  }).then(res => {//判断授权登录
    console.log(res);
    if (res.authSetting['scope.userInfo']){
      console.log(res.authSetting['scope.userInfo']);
    }
    return wxAsyn.getUserInfo();
  }).then(res => {//获取用户信息 
    console.log(res);
    (typeof callback === "function") && callback();
  });
} 

module.exports = service;