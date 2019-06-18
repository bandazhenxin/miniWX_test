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

  /**
   * 构造代理机构
   */
  this.constructAgency = function (agency) {
    if (isEmpty(agency)) return false;

    return {
      id: agency.sp_id,
      name: agency.custom_name,
      address: lang.companyAddress + '：' + agency.address
    };
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
        that.renderDetail({
          banner_list: info.images,
          company_info: {
            logo: preData.company_info.logo,
            name: preData.company_info.name
          },
          // position_info: {
          //   title: info.position_name,
          //   area: info.province_name + ' ' + info.city_name,
          //   pay: info.salary_entry,
          //   type: info.is_full_time,
          //   reward: lang.reward + '：' + info.entry_reward_details,
          //   whatReward: lang.whatReward
          // },
          // reward: [
          //   {
          //     label: 'treatment',
          //     title: lang.treatment,
          //     info: [
          //       {
          //         name: lang.payrollDay + '：',
          //         value: info.salary_pay_date
          //       }, {
          //         name: lang.salaryType + '：',
          //         value: info.salary_pay_type
          //       }, {
          //         name: lang.basicSalary + '：',
          //         value: info.salary_base
          //       }, {
          //         name: lang.fullAttendance + '：',
          //         value: isEmpty(parseFloat(info.entry_reward)) ? lang.none : info.entry_reward
          //       }, {
          //         name: lang.overtimeReward + '：',
          //         value: isEmpty(parseFloat(info.salary_overtime)) ? lang.none : info.salary_overtime
          //       }
          //     ]
          //   }, {
          //     label: 'jobDescription',
          //     title: lang.jobDescription,
          //     info: [
          //       {
          //         name: lang.jobContent + '：',
          //         value: info.work_content
          //       }, {
          //         name: lang.jobTime + '：',
          //         value: info.work_time
          //       }, {
          //         name: lang.jobTimes + '：',
          //         value: info.work_shift
          //       }, {
          //         name: lang.jobExplain + '：',
          //         value: isEmpty(info.work_remark) ? lang.none : info.work_remark
          //       }
          //     ]
          //   }, {
          //     label: 'welfare',
          //     title: lang.welfare,
          //     info: [
          //       {
          //         name: lang.basicWelfare + '：',
          //         value: info.benefits_tags
          //       }, {
          //         name: lang.entryDuration + '：',
          //         value: info.full_roll_days
          //       }, {
          //         name: lang.returnCash + '：',
          //         value: info.entry_reward
          //       }
          //     ]
          //   }, {
          //     label: 'admissionCondition',
          //     title: lang.admissionCondition,
          //     info: [
          //       {
          //         name: lang.sexCondition + '：',
          //         value: info.hire_gender
          //       }, {
          //         name: lang.ageCondition + '：',
          //         value: info.hire_age
          //       }, {
          //         name: lang.educationCondition + '：',
          //         value: info.hire_education
          //       }, {
          //         name: lang.workExperience + '：',
          //         value: info.hire_expert
          //       }
          //     ]
          //   }
          // ],
          // evaluate: {
          //   count: info.evaluate_statistics.count,
          //   list: this.constructList(info.evaluate_statistics.list)
          // },
          // agency: this.constructAgency(info.partner_agency)
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