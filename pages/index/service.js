//reply
const config       = require('../../config/request.js');
const apiBasic     = require('../../core/apiBasic.js');
const storageClass = require('../../core/storage.js');
const layer        = require('../../utils/webServer/layer.js');
const wxAsyn       = require('../../utils/webServer/asyn/wxAsyn.js');
const help         = require('../../utils/help.js');

//instance
const api     = new apiBasic();
const storage = new storageClass();
const signMd5 = help.sign;

//private
function service() {
  //接口路径
  this.urlList = {
    init:config.initUrl,
    job_list: config.job_list
  };
}

//public
service.prototype = {
  /**
   * 授权登录初始化
   */
  init:function(app,that,detail){
    var code = null;
    wxAsyn.login().then(res => {//登录
      code = res.code;
      return wxAsyn.getUserInfo();
    }).then(res => {//获取用户信息
      let params = {
        system: config.system,
        version: config.version,
        sign: null,
        code: code,
        rawData: res.rawData,
        signature: res.signature,
        encryptedData: res.encryptedData,
        iv: res.iv
      };
      let url = this.urlList.init;
      let sign = signMd5(config.key,params);
      params.sign = sign;
      return api.post(url,params);
    }).then(res => {//服务端解密
      console.log(res);
    });
  },

  /**
   * 职位初始渲染
   */
  jobListIndex:function(app,that){
    let code = '';
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      code: code
    };
    let url = this.urlList.job_list;
    let sign = signMd5(config.key, params);
  },
};

module.exports = service;