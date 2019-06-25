//reply
const config   = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer    = require('../../utils/webServer/layer.js');
const help     = require('../../utils/help.js');
const lang     = require('../../config/lang.js');

//instance
const api     = new apiBasic();
const signMd5 = help.sign;
const isEmpty = help.isEmpty;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    evaluate_info: config.evaluate_info
  };

  this.constructList = function (list) {
    let info = [];
    for (let val1 of list){
      let item = [];
      for (let val2 of val1){
        val2.stars = this.contructStars(val2.rate);
        item.push(val2);
      }
      info.push(item);
    }
    return info;
  };

  /**
   * 构造打星布尔数组
   */
  this.contructStars = function (num) {
    num = parseFloat(num);
    num = Math.round(num);
    let preObj = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    let length = preObj.length;
    let obj = preObj.slice(length / 2 - num, length - num);
    return obj;
  }
}

//public
service.prototype = {
  /**
   * 初始渲染
   */
  initRender: function(that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      partner_id : that.vm.id
    };

    //sign
    let url = this.urlList.evaluate_info;
    let sign = signMd5(config.key, params);
    params.sign = sign;
    
    //post
    layer.busy('加载中', 0);
    api.post(url, params).then(res => {
      layer.busy(false);
      if (res.status_code == 200) {
        let info = res.data;
        that.renderDetail({
          company_info: {
            logo: info.partner_info.avatar,
            name: info.partner_info.name,
            info_list: info.partner_info.desc,
            stars: this.contructStars(info.partner_info.rate),
            number_info: '已有' + info.partner_info.count + '人参与评价'
          },
          evaluate_list: this.constructList(info.list)
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.busy(false);
      layer.toast('网络错误');
    });
  }
};

module.exports = service;