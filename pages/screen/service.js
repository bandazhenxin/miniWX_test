//reply
const config       = require('../../config/request.js');
const basic        = require('../../config/basic.js');
const lang         = require('../../config/lang.js');
const apiBasic     = require('../../core/apiBasic.js');
const layer        = require('../../utils/webServer/layer.js');
const help         = require('../../utils/help.js');
const storageClass = require('../../core/storage.js');

//instance
const api     = new apiBasic();
const signMd5 = help.sign;
const storage = new storageClass();

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    screen_list: config.screen_list
  };
}

//public
service.prototype = {
  tagsRender: function (that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      unionid: storage.getData('unionid'),
    };

    //sign
    let url = this.urlList.screen_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      console.log('screen');
      console.log(res.data);
      if (res.status_code == 200) {
        let listArr = res.data;
        that.renderDetail({
          city_list: listArr.city,
          type_list: listArr.salary_type,
          range_list: listArr.salary_range,
          catalog_list: listArr.job_type
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  },
}

module.exports = service;