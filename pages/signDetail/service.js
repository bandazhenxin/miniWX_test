//reply
const app      = getApp();
const config   = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer    = require('../../utils/webServer/layer.js');
const help     = require('../../utils/help.js');
const lang     = require('../../config/lang.js');

//instance
const api = new apiBasic();
const signMd5 = help.sign;
const isEmpty = help.isEmpty;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    nation_list: config.nation_list,
    job_details: config.job_details,
    education_list: config.education_list,
    registration: config.registration
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
service.prototype = {
  /**
   * 初始渲染
   * 渲染职位详情
   */
  jobInfo: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      id: that.vm.id
    };

    //singn
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
  },

  /**
   * 渲染民族数据
   */
  nationList: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null
    };

    //singn
    let url = this.urlList.nation_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        that.renderDetail({
          nation_list: res.data,
          nation_text: res.data[0].mzname
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    });
  },

  /**
   * 渲染学历数据
   */
  educationList: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null
    };

    //singn
    let url = this.urlList.education_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        that.renderDetail({
          education_list: res.data,
          education_text: res.data[0].education_name
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    });
  },

  /**
   * 报名
   */
  signUp: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      token: app.globalData.token,
      job_id: that.vm.id,
      name: that.vm.db.form_data.name,
      id_card: that.vm.db.form_data.id_card,
      nation: that.vm.nation_list[that.vm.db.form_data.nation].mz_id,
      education: that.vm.education_list[that.vm.db.form_data.education].id,
      mobile: that.vm.db.form_data.mobile
    };
    if (that.vm.db.form_data.wechat) params.wechat = that.vm.db.form_data.wechat;
    
    //singn
    let url = this.urlList.registration;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        //回传渲染报名状态
        let pages = getCurrentPages();
        let prepage = pages[pages.length - 2];
        prepage.renderDetail({
          is_enroll: true
        });
        layer.toast(lang.signUpSuccess);
        that.goBack();
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(lang.networkError);
    });
  },
}

module.exports = service;