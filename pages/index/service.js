//reply
const config       = require('../../config/request.js');
const basic        = require('../../config/basic.js');
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

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    init:config.initUrl,
    getMobile: config.get_mobile,
    job_list: config.job_list
  };

  /**
   * 职位信息数据格式处理
   */
  this.handleJobInfo = function(info){
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
        that.vm.isGo = true;
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
        console.log(that.vm.position_item);
      }else{
        layer.toast(res.message);
      }
      that.render();

      console.log(that.data);
    },msg => {
      layer.toast(msg.message);
      that.render();
    });
  },
};

module.exports = service;