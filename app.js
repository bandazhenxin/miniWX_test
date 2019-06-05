const serviceClass = require('service.js');
const service = new serviceClass();

//app.js
App({
  onLaunch: function () {
    // 初始化登录
    service.initGet(this);
  },
  initCallback: null,
  initBack: null,
  globalData: {
    userBasicInfo: {},
    token: null,
    code: null
  }
})