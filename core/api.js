const client = requier('../utils/webServer/webClient');

//继承基础通信交互方法
function api(){
  client.call(this);
}
api.prototype = new client();

//登录接口
api.prototype.login = function (userInfo, callback) {
  var me = this;
  wx.login({
    success: function (res) {
      api.login(userInfo, res.code, function (value) {
        app.accessToken = value.token;
        callback && callback(value);
      });
    }
  });
};

module.exports = api;