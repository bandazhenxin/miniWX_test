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
    registration_datails: config.registration_datails,
    job_details: config.job_details,
    confirm_interview: config.confirm_interview,
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

    //公司
    if (list.partner_name) list.job_partner_name = list.partner_name;

    return list;
  }
}

//public
/**
 * 渲染职位信息
 */
service.prototype.jobInfo = function (that) {
  //init
  var self = this;

  //construct
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    id: that.vm.basic.id
  };

  //sign
  let url = this.urlList.job_details;
  let sign = signMd5(config.key, params);
  params.sign = sign;

  //post
  api.post(url, params).then(res => {
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
}

/**
 * 渲染报名信息
 */
service.prototype.signInfo = function (that) {
  //init
  var self = this;

  //construct
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    token: app.globalData.token,
    id: that.vm.basic.rid
  };

  //sign
  let url = this.urlList.registration_datails;
  let sign = signMd5(config.key, params);
  params.sign = sign;
  console.log(params);
  //post
  api.post(url, params).then(res => {
    console.log(res);
    if (res.status_code == 200) {
      that.renderDetail({
        sign_info: res.data
      });
    } else {
      layer.toast(res.message);
      that.goBack();
    }
  }, msg => {
    layer.toast(lang.networkError);
    that.goBack();
  });
}

/**
 * 确认面试
 */
service.prototype.sureInterview = function (that, data) {
  //init
  var self = this;

  //construct
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    id: data.rid,
    token: app.globalData.token
  };

  //sign
  let url = this.urlList.confirm_interview;
  let sign = signMd5(config.key, params);
  params.sign = sign;

  //post
  layer.busy('加载中', 0);
  api.post(url, params).then(res => {
    layer.busy(false);
    if (res.status_code == 200) {
      let index = data.index;
      let idx = data.idx;
      let indexPage = that.getIndexPage();
      let prelist = indexPage.vm.content_list;
      prelist[index].splice(idx, 1);
      indexPage.renderDetail({
        content_list: prelist
      });
      layer.toast(res.message);
      that.goIndex();
    } else {
      layer.toast(res.message);
    }
  }, msg => {
    layer.busy(false);
    layer.toast(lang.networkError);
  });
}

module.exports = service;