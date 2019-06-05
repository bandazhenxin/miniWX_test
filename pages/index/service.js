//reply
const config       = require('../../config/request.js');
const apiBasic     = require('../../core/apiBasic.js');
const storageClass = require('../../core/storage.js');
const layer        = require('../../utils/webServer/layer.js');
const wxAsyn       = require('../../utils/webServer/asyn/wxAsyn.js');
const help         = require('../../utils/help.js');

//instance
const api      = new apiBasic();
const storage  = new storageClass();
const signMd5  = help.sign;
const mergeObj = help.mergeObj;

//private
function service() {
  //接口路径
  this.urlList = {
    init:config.initUrl,
    getMobile: config.get_mobile,
    job_list: config.job_list
  };
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
        this.indexRender(app, that);
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
  indexRender:function(app,that){
    //auth
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          layer.alert('请求授权当前位置', '需要获取您的地理位置，请确认授权', function (res) {
            if (res.cancel) {
              layer.toast('拒绝授权');
              this.indexJobRender(app, that);
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    layer.toast('授权成功');
                    this.indexRenderContinue(app, that);
                  } else {
                    layer.toast('授权失败');
                    this.indexJobRender(app, that);
                  }
                }
              })
            }
          });
        }else{
          this.indexRenderContinue(app, that);
        }
      }
    });

    // let params = {
    //   system: config.system,
    //   version: config.version,
    //   sign: null,
    //   unionid: storage.getData('unionid'),
    //   page: 1,
    //   city_name: '上海',
    //   province_name: '上海'
    // };
    // let url = this.urlList.job_list;
    // let sign = signMd5(config.key, params);
    // params.sign = sign;
    // console.log(params);
  },

  /**
   * 继续初始渲染
   */
  indexRenderContinue: function (app, that) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  /**
   * 初始职位渲染
   */
  indexJobRender: function (app, that){

  },
};

module.exports = service;