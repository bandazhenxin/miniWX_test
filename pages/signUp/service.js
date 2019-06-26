//reply
const app      = getApp();
const config   = require('../../config/request.js');
const layer    = require('../../utils/webServer/layer.js');
const apiBasic = require('../../core/apiBasic.js');
const help     = require('../../utils/help.js');

//instance
const api      = new apiBasic();
const signMd5  = help.sign;
const mergeArr = help.mergeArr;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    enroll_list: config.enroll_list,
    confirm_interview: config.confirm_interview,
    collection: config.collection
  };

  /**
   * 职位信息数据格式处理
   */
  this.handleJobInfo = function (info) {
    for (let val of info) {
      //入职待遇
      val.condition_text_list = [val.salary_base];
      val.share_reward && val.condition_text_list.push(val.share_reward);
      val.entry_reward && val.condition_text_list.push(val.entry_reward);
      val.condition_text_list = val.condition_text_list.join(' | ');
    }
    return info;
  }
}


//public

/**
 * 列表数据渲染
 */
service.prototype.basicRender = function (that, type) {
  //init
  var self = this;

  //construct
  let active_index = that.vm.activeIndex;
  let enroll_type = that.vm.db.type_map[active_index];
  let page = type ? that.vm.db.page_list[active_index] + 1 : that.vm.db.page_list[active_index];
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    token: app.globalData.token,
    page: page,
    enroll_type: enroll_type
  };

  //singn
  let url = this.urlList.enroll_list;
  let sign = signMd5(config.key, params);
  params.sign = sign;
  
  //post
  layer.busy('加载中', 0);
  api.post(url, params).then(res => {
    layer.busy(false);
    if (res.status_code == 200) {
      let list = this.handleJobInfo(res.data.list);
      let preList = that.vm.content_list;
      preList[active_index] = type ? mergeArr(preList[active_index], list) : list;
      that.renderDetail({
        content_list: preList
      });
      if(res.data.list.length > 0) that.vm.db.page_list[active_index] = page;
    } else if (res.status_code != 200) {
      layer.toast(res.message);
    }
  }, msg => {
    layer.busy(false);
    layer.toast(lang.networkError);
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
      let prelist = that.vm.content_list;
      prelist[index].splice(idx, 1);
      that.renderDetail({
        content_list: prelist
      });
    } else {
      layer.toast(res.message);
    }
  }, msg => {
    layer.busy(false);
    layer.toast(lang.networkError);
  });
}

/**
 * 刷新
 */
service.prototype.refresh = function (that) {
  let index = that.vm.activeIndex;
  that.vm.db.page_list[index] = 1;
  this.basicRender(that);
}

/**
 * 删除收藏
 */
service.prototype.collectionDel = function (that,data) {
  //init
  var self = this;

  //construct
  let params = {
    system: config.system,
    version: config.version,
    sign: null,
    token: app.globalData.token,
    job_id: data.id,
    user_id: app.globalData.userBasicInfo.user_id
  };

  //singn
  let url = this.urlList.collection;
  let sign = signMd5(config.key, params);
  params.sign = sign;

  //post
  layer.busy('删除中', 0);
  api.post(url, params).then(res => {
    layer.busy(false);
    if (res.status_code == 200) {
      let index = data.index;
      let idx = data.idx;
      let prelist = that.vm.content_list;
      prelist[index].splice(idx, 1);
      that.renderDetail({
        content_list: prelist
      });
      layer.toast(res.message);
    } else if (res.status_code != 200) {
      layer.toast(res.message);
    }
  }, msg => {
    layer.busy(false);
    layer.toast(lang.networkError);
  });
}

module.exports = service;