const client = require('../utils/webServer/webClient.js');

//继承基础通信交互方法
function apiBasic(){
  client.call(this);
}
apiBasic.prototype = new client();

//接口路径
api.prototype.urlList = {};

module.exports = apiBasic;