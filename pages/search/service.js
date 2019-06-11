//reply
const config       = require('../../config/request.js');
const storageClass = require('../../core/storage.js');

//instance
const storage = new storageClass();

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    init: config.initUrl,
    getMobile: config.get_mobile,
    job_list: config.job_list,
    tags_list: config.tags_list
  };
}

//public
service.prototype = {
  /**
   * 渲染历史记录
   */
  historyRender:function(that){

  }
}

module.exports = service;