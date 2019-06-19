//reply
const config       = require('../../config/request.js');
const apiBasic     = require('../../core/apiBasic.js');
const storageClass = require('../../core/storage.js');
const layer        = require('../../utils/webServer/layer.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');

//instance
const api     = new apiBasic();
const storage = new storageClass();
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
    num = parseFloat(num);
    num = Math.round(num);
    let preObj = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    let length = preObj.length;
    let obj = preObj.slice(length / 2 - num, length - num);
    return obj;
  }

  /**
   * 职位信息数据格式处理
   */
  this.handleJobInfo = function (info) {
    for (let val of info) {
      //入职待遇
      val.condition_text_list = [val.salary_base];
      val.share_reward && val.condition_text_list.push(val.share_reward);
      val.entry_reward && val.condition_text_list.push(val.entry_reward);
      val.condition_text_list = val.condition_text_list.join('　|　');

      //partner_role_text
      val.partner_role = val.partner_role_text;
    }
    return info;
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
    layer.busy('加载中', 0);
    api.post(url, params).then(res => {
      layer.busy(false);

      //获取上个页面的数据
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2];
      let preData = prePage.vm;

      if (res.status_code == 200) {
        let info = res.data;
        let pickup_list = self.handleJobInfo(info.pickup_list);
        console.log(info);
        that.vm.db.company_jobs = pickup_list;
        that.renderDetail({
          banner_list: info.images,
          company_info: {
            pid: info.partner_id,
            logo: info.logo,
            name: info.evaluate_name
          },
          reward: [
            {
              label: 'companyDescribe',
              title: lang.companyDescribe,
              info: info.summary
            }, {
              label: 'linkType',
              title: lang.linkType,
              info: lang.companyAddress + '：' + info.address + '\n' + lang.linkPhone + ':' + info.telephone,
            }
          ],
          evaluate: {
            label: 'companyEvaluate',
            count: info.evaluate_average.count,
            list: this.constructList(info.evaluate_average.list)
          },
          company_jobs:{
            is_complete: pickup_list.length <= 2,
            label: 'relevantPositions',
            list: pickup_list.slice(0, 2)
          }
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.busy(false);
      layer.toast('网络错误');
    });
  },

  /**
   * 更多职位
   */
  completeJob: function (that) {
    layer.busy('加载中', 0);
    that.renderDetail({
      company_jobs: {
        is_complete: true,
        label: 'relevantPositions',
        list: that.vm.db.company_jobs
      }
    });
    layer.busy(false);
  },
};

module.exports = service;