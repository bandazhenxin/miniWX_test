//小程序启动模型业务
const apiBasic = require('core/api.js');

//集成基础通信类
function api(){
  apiBasic.call(this);
}
api.prototype = new apiBasic();

module.exports = api;