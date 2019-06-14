//reply
const config = require('../../config/request.js');
const lang = require('../../config/lang.js');
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
    job_type_list: config.job_type_list
  };
}

//public
service.prototype = {
  /**
   * 工种列表渲染
   */
  jobTypeRender: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null
    };

    //sign
    let url = this.urlList.job_type_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        let listArr = res.data;

        //render
        that.renderDetail({
          job_type_list: listArr
        });

        //获取设置首区域高度 第一个区域的高度
        let top_arr = [];
        for (let list_key in listArr) {
          let query = wx.createSelectorQuery();
          query.select('#area_' + list_key).boundingClientRect();
          query.exec(function (res) {
            that.vm.db.top = res[0].top;
          })
          return;
        }
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  }
};

module.exports = service;