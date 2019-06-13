//reply
const config       = require('../../config/request.js');
const basic        = require('../../config/basic.js');
const lang         = require('../../config/lang.js');
const apiBasic     = require('../../core/apiBasic.js');
const storageClass = require('../../core/storage.js');
const layer        = require('../../utils/webServer/layer.js');
const wxAsyn       = require('../../utils/webServer/asyn/wxAsyn.js');
const QQMapWX      = require('../../utils/webServer/qqmap-wx-jssdk.js');
const help         = require('../../utils/help.js');

//instance
const api      = new apiBasic();
const storage  = new storageClass();
const signMd5  = help.sign;
const mergeObj = help.mergeObj;
const mergeArr = help.mergeArr;
const isEmpty  = help.isEmpty;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    init:      config.initUrl,
    getMobile: config.get_mobile,
    job_list:  config.job_list,
    tags_list: config.tags_list
  };

  /**
   * 职位信息数据格式处理
   */
  this.handleJobInfo = function(info){
    for(let val of info){
      //入职待遇
      val.condition_text_list = [val.salary_base];
      val.share_reward && val.condition_text_list.push(val.share_reward);
      val.entry_reward && val.condition_text_list.push(val.entry_reward);
      val.condition_text_list = val.condition_text_list.join(' | ');
    }
    return info;
  }

  /**
   * 处理标签信息格式
   */
  this.handleTagsInfo = function(info){
    return info;
  }
}

//public
service.prototype = {
  /**
   * 授权登录初始化
   */
  init:function(app,that,detail){
    //init
    var code = null;
    var pass = false;
    if (!detail.hasOwnProperty('userInfo')){
      layer.toast('请授权登录');
      return;
    }
    layer.busy('登录中', 0);

    //login
    wxAsyn.login().then(res => {
      code = res.code;
      app.globalData.code = code;
      return wxAsyn.getUserInfo();
    },msg => {
      layer.busy(false);
      layer.toast('登录失败');
    })
    //获取用户信息
    .then(res => {
      let params = {
        system: config.system,
        version: config.version,
        sign: null,
        code: code,
        raw_data: res.rawData,
        signature: res.signature,
        encrypted_data: res.encryptedData,
        iv: res.iv
      };
      let url = this.urlList.init;
      let sign = signMd5(config.key,params);
      params.sign = sign;
      return api.post(url,params);
    },msg => {
      layer.busy(false);
      layer.toast('登录失败');
    })
    //服务端解密
    .then(res => {
      if (res.status_code == 200) {
        storage.setData('unionid', res.data.union_id);
        app.globalData.userBasicInfo = mergeObj(res.data.sys_user_info, res.data.wx_user_info);
        app.globalData.token = res.data.token;
        that.vm.hasBasicUserInfo = true;
        if (app.globalData.userBasicInfo.hasOwnProperty('mobile')) that.vm.hasUserPhone = true;
        layer.busy(false);
        that.render();

        //职位初始渲染与初始定位
        this.indexRender(that);
      } else {
        layer.busy(false);
        layer.toast(res.message);
      }
    },msg => {
      layer.busy(false);
      layer.toast('登录失败');
    });
  },

  /**
   * 获取手机号
   */
  getMobile: function (app, that, detail){
    if (!detail.hasOwnProperty('encryptedData')) {
      layer.toast('请授权手机信息');
      return;
    }
    layer.busy('注册中', 0);

    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      code: app.globalData.code,
      encrypted_data: detail.encryptedData,
      iv: detail.iv
    };
    let url = this.urlList.getMobile;
    let sign = signMd5(config.key, params);
    params.sign = sign;
    api.post(url, params).then(res => {
      console.log(res);
      return;
      if (res.status_code == 200) {
        app.globalData.token = res.data.token;
        app.globalData.userBasicInfo.mobile = res.data.mobile;
        that.vm.hasUserPhone = true;
        layer.busy(false);
        that.render();
      } else {
        layer.busy(false);
        layer.toast(res.message);
      }
    }, msg => {
      layer.busy(false);
      layer.toast('网络错误');
    });
  },

  /**
   * 职位初始渲染与初始定位
   * 不强制授权
   */
  indexRender:function(that){
    var self = this;

    //auth
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          layer.alert('请求授权当前位置', '需要获取您的地理位置，请确认授权', function (res) {
            if (res.cancel) {
              layer.toast('拒绝授权');
              self.indexJobRender(app, that);
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    layer.toast('授权成功');
                    self.indexRenderContinue(that);
                  } else {
                    layer.toast('授权失败');
                    self.indexJobRender(that);
                  }
                }
              })
            }
          });
        }else{
          self.indexRenderContinue(that);
        }
      }
    });
  },

  /**
   * 继续初始渲染
   */
  indexRenderContinue: function (that) {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        that.vm.latitude = res.latitude;
        that.vm.longitude = res.longitude;
        that.vm.speed = res.speed;
        that.vm.accuracy = res.accuracy;

        //腾讯地图获取地址
        let qqmapsdk = new QQMapWX({ key: basic.qqmap_key});
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.vm.latitude,
            longitude: that.vm.longitude
          },
          success: function (res) {
            console.log(res);
            let province = res.result.ad_info.province
            let city = res.result.ad_info.city
            that.vm.province = province;
            that.vm.city = city;
            self.indexJobRender(that);
          },
          fail: function (res) {
            layer.toast(res.message);
            self.indexJobRender(that);
          }
        });
      },
      fail: function (res) {
        layer.toast(res.errMsg);
        self.indexJobRender(that);
      }
    })
  },

  /**
   * 初始职位渲染
   */
  indexJobRender: function (that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      unionid: storage.getData('unionid'),
      page: 1,
      city_name: that.vm.city,
      province_name: that.vm.province
    };
    let url = this.urlList.job_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;
    api.post(url, params).then(res => {
      if (res.status_code == 200){
        let listArr = self.handleJobInfo(res.data.list);
        that.vm.position_item = mergeArr(that.data.position_item,listArr);
      }else{
        layer.toast(res.message);
      }
      that.render();
      wx.showTabBar();
    },msg => {
      layer.toast(msg.message);
      that.render();
      wx.showTabBar();
    });
  },

  /**
   * 标签渲染
   */
  tagsRender: function(that){
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null
    };

    //sign
    let url = this.urlList.tags_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      console.log('cdd');
      console.log(res);
      if (res.status_code == 200) {
        let listArr = self.handleTagsInfo(res.data);
        that.vm.tags_list = listArr;
        that.renderDetail({
          tags_list: listArr
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  },

  /**
   * 下拉更新
   */
  refresh: function (that) {
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
      city_name: that.vm.city,
      province_name: that.vm.province
    };

    //sign
    let url = this.urlList.job_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //render 更新
    api.post(url, params).then(res => {
      if (res.status_code == 200) {
        let listArr = self.handleJobInfo(res.data.list);
        let bottom_is = (listArr.length < 10) ? false : true;
        that.vm.db.page = 1;
        that.renderDetail({
          sort_name: '',
          sort: '',
          sort_is_recommend: 1,
          sort_salary_order: 1,
          sort_subsidy_order: 1,
          sort_reward_order: 1,
          tags_select: [],
          position_item: listArr,
          bottom_is: bottom_is,
          search_text: lang.search
        });
      } else {
        layer.toast(res.message);
      }
      that.vm.db.is_pulldown = null;
      wx.stopPullDownRefresh();
    }, msg => {
      that.vm.db.is_pulldown = null;
      wx.stopPullDownRefresh();
      layer.toast(msg.message);
    });
  },
  
  /**
   * 基本渲染
   */
  basicRender: function (that, type){
    //init
    var self = this;
    let page = type === 1 ? that.vm.db.page + 1:1;

    //construct
    //basic
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      unionid: storage.getData('unionid'),
      page: page,
      city_name: that.vm.city,
      province_name: that.vm.province
    };
    //sort
    if (that.vm.sort_name) params[that.vm.sort_name] = that.vm.sort; 
    //tags
    if (that.vm.tags_select){
      let tags_ids = '';
      that.vm.tags_select.forEach(function (val, index) {
        tags_ids += tags_ids ? ',' + index : index;
      });
      params.benefits_tag = tags_ids;
    }
    //screen
    if (!isEmpty(that.vm.screen_tags)){
      let screen_tags = that.vm.screen_tags;
      let name_map = {
        city_select: 'area_id',
        type_select: 'salary_type',
        range_select: 'salary_range',
        catalog_select: 'position_catalog_id'
      };
      Object.keys(screen_tags).forEach(function (key) {
        let value = screen_tags[key];
        Object.keys(value).forEach(function (item_ley) {
          params[name_map[key]] = item_ley;
        })
      })
    }

    //sign
    let url = this.urlList.job_list;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //render
    if (type !== 1) layer.busy('加载中', 0);
    api.post(url, params).then(res => {
      layer.busy(false);
      if (res.status_code == 200) {
        let listArr = self.handleJobInfo(res.data.list);
        let bottom_is = (listArr.length < 10) ? false : true;
        if(type === 1){
          that.vm.db.page += 1;
          listArr = mergeArr(that.data.position_item, listArr)
        }else{
          that.vm.db.page = 1;
        }
        that.vm.position_item = listArr;
        that.vm.bottom_is = bottom_is;
        that.renderDetail({
          position_item: listArr,
          bottom_is: bottom_is
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.busy(false);
      layer.toast(msg.message);
    });
  },
};

module.exports = service;