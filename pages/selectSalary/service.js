//reply
const config = require('../../config/request.js');
const layer = require('../../utils/webServer/layer.js');
const apiBasic = require('../../core/apiBasic.js');
const help = require('../../utils/help.js');

//instance
const api = new apiBasic();
const signMd5 = help.sign;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    salary_range: config.salary_range
  };
}

//public
service.prototype = {
  /**
   * 薪资列表渲染
   */
  listRender: function (that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null
    };

    //sign
    let url = this.urlList.salary_range;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      console.log('salary');
      console.log(res);
      if (res.status_code == 200) {
        let listArr = res.data;
        that.renderDetail({
          list: listArr
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  }
};

module.exports = service;