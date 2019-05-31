//reply
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const wxAsyn = require('../../utils/webServer/asyn/wxAsyn.js');
const api = new apiBasic();

function service() {
  //接口路径
  this.urlList = {};
}

module.exports = service;