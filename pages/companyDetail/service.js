//reply
const config = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');

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
    company_datails: config.company_datails
  };

  /**
   * 构造评价列表
   */
  this.constructList = function (list) {
    let arr = [];
    for (let val of list) {
      arr.push({
        title: val.title,
        star: this.contructStars(val.score)
      });
    }
    return arr;
  }

  /**
   * 构造打星布尔数组
   */
  this.contructStars = function (num) {
    num = parseInt(num);
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
  initRender: function (that) {
    //init
    var self = this;

    //construct
    let params = {
      system: config.system,
      version: config.version,
      sign: null,
      organ_id: that.vm.id
    };

    //sign
    let url = this.urlList.company_datails;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      //获取上个页面的数据
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2];
      let preData = prePage.vm;

      if (res.status_code == 200) {
        let info = res.data;
        console.log(info);
        that.renderDetail({
          banner_list: info.images,
          company_info: {
            logo: preData.company_info.logo,
            name: preData.company_info.name
          },
          reward: [
            {
              label: 'companyDescribe',
              title: lang.companyDescribe,
              info: ''
            }, {
              label: 'linkType',
              title: lang.linkType,
              info: lang.companyAddress + '：' + info.address + '\n' + lang.linkPhone + ':',
            }
          ],
          evaluate: {
            count: preData.evaluate.count,
            list: preData.evaluate.list
          },
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast('网络错误');
    });
  }
};

module.exports = service;