//通信层启动
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
service.prototype.initGet = function (that){
  wxAsyn.login().then(res => {
    let params = this.urlList.miniInitUrl + '?code=' + res.code;
    return api.get(params);
  }).then(res => {
    console.log(res);
  },msg => {
    layer.busy(msg);
  }).catch(msg => {
    layer.busy(msg);
  });
} 

module.exports = service;