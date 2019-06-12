//reply
const config       = require('../../config/request.js');
const basic        = require('../../config/basic.js');
const lang         = require('../../config/lang.js');
const storageClass = require('../../core/storage.js');
const help         = require('../../utils/help.js');
const apiBasic     = require('../../core/apiBasic.js');
const layer        = require('../../utils/webServer/layer.js');

//instance
const storage = new storageClass();
const signMd5 = help.sign;
const api     = new apiBasic();

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    hot_search: config.hot_search,
    job_list: config.job_list,
  };

  /**
   * 处理热门记录数据
   */
  this.handleHotInfo = function(info){
    let word = [];
    for (let val of info){
      word.push(val.word);
    }
    return word;
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

  /**
   * 搜索
   */
  this.search = function(that,keyword){
    //获取父页实例
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];

    //搜索

    //init
    let self = this;
    let page = 1;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      unionid: storage.getData('unionid'),
      page: page,
      city_name: prePage.vm.city,
      province_name: prePage.vm.province
    };
    if (keyword) params.keyWord = keyword

    //sign
    let url = this.urlList.job_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //render 更新
    layer.busy('加载中', 0);
    api.post(url, params).then(res => {
      layer.busy(false);
      if (res.status_code == 200) {
        let listArr = self.handleJobInfo(res.data.list);
        console.log('dddccc');
        console.log(listArr);
        let bottom_is = (listArr.length < 10) ? false : true;
        prePage.vm.db.page = 1;
        prePage.renderDetail({
          sort_name: '',
          sort: '',
          sort_is_recommend: 1,
          sort_salary_order: 1,
          sort_subsidy_order: 1,
          sort_reward_order: 1,
          tags_select: [],
          position_item: listArr,
          bottom_is: bottom_is,
          search_text: keyword ? keyword : lang.search
        });
        that.goBack();
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.busy(false);
      layer.toast(msg.message);
    });
  }
}

//public
service.prototype = {
  /**
   * 渲染历史记录
   */
  historyRender:function(that){
    let history_list = storage.getData('history_list');
    history_list = history_list ? history_list : [];
    that.vm.history_list = history_list;
    that.renderDetail({
      history_list: history_list
    });
  },

  /**
   * 热门搜索记录
   */
  hotRender:function(that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      unionid: storage.getData('unionid')
    };

    //sign
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    let url = this.urlList.hot_search;
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        let listArr = self.handleHotInfo(res.data);
        that.vm.hot_list = listArr;
        that.renderDetail({
          hot_list: listArr
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  },

  /**
   * 清除历史记录
   */
  clearHistory: function(that){
    if (storage.delData('history_list')){
      that.vm.history_list = [];
      that.renderDetail({
        history_list: []
      });
    }else{
      layer.toast('清除失败');
    }
  },

  /**
   * 点击搜索
   */
  pointSearch: function (that, search_text){
    //增加本地搜索记录
    let pre_data = storage.getData('history_list');
    pre_data = pre_data ? pre_data : [];
    if (!pre_data.includes(search_text) && search_text){
      if (pre_data.length >= basic.history_num) pre_data.shift();
      pre_data.push(search_text);
      storage.setData('history_list', pre_data);

      //ui
      that.vm.history_list = pre_data;
      that.renderDetail({
        history_list: pre_data
      });
    }

    //visit
    this.search(that, search_text);
  }
}

module.exports = service;