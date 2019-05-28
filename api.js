//小程序启动模型业务
const apiBasic = require('core/apiBasic.js');

//继承基础通信类
function api(){
  apiBasic.call(this);
}
api.prototype = new apiBasic();

//接口路径
api.prototype.urlList = {
  miniInitUrl: 'https://coolthings.goho.co/get/miniInit'
}

//小程序初始化
api.prototype.miniInit = function(callback){
  let me = this;
  wx.login({
    success: res => {
      me.get(me.urlList.miniInitUrl,callback);
    }
  })
}

module.exports = api;