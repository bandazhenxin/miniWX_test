//小程序启动业务
const apiClass = require('api.js');
const api = new apiClass();

function service(){}

//业务初始化，获取token
service.prototype.initGet = function(){
  let me = this;
  api.miniInit(function(res){
    console.log(res);
  });
} 

module.exports = service;