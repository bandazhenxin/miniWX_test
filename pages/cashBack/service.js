//reply
const app      = getApp();
const config   = require('../../config/request.js');
const layer    = require('../../utils/webServer/layer.js');
const apiBasic = require('../../core/apiBasic.js');
const help     = require('../../utils/help.js');

//instance
const api     = new apiBasic();
const signMd5 = help.sign;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    job_details: config.job_details,
    cash_back_details: config.cash_back_details
  };

  /**
   * 构造职位详情
   */
  this.constructJobDetail = function (list) {
    //入职待遇
    list.condition_text_list = [list.salary_base];
    list.share_reward && list.condition_text_list.push(list.share_reward);
    list.entry_reward && list.condition_text_list.push(list.entry_reward);
    list.condition_text_list = list.condition_text_list.join(' | ');

    //提取返现金额
    list.cashBack = parseFloat(list.share_reward) + '元';

    //公司
    if (list.partner_name) list.job_partner_name = list.partner_name;

    return list;
  }
}

//public
service.prototype = {
  initRender: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      token: app.globalData.token,
      id: that.vm.basic.id
    };

    //sign
    let url = this.urlList.job_details;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      console.log(res);
      if (res.status_code == 200) {
        let list = this.constructJobDetail(res.data);
        that.renderDetail({
          job_info: list
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    });
  },
};

module.exports = service;