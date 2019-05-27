const client = requier('../utils/webServer/webClient');

//继承基础通信交互方法
function api(){
  client.call(this);
}
api.prototype = new client();

//登录接口
api.prototype.login = function (userInfo, callback) {
  wx.login({
    success: function (res) {
      api.login(userInfo, res.code, function (value) {
        callback && callback(value);
      });
    }
  });
};

//是否有内置接口权限
api.prototype.isSetting = function (scope, callback){
  wx.getSetting({
    success: function (res) {
      callback(res.authSetting[scope] === true);
    }
  });
}

module.exports = api;