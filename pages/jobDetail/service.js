//reply
const config   = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer    = require('../../utils/webServer/layer.js');
const help     = require('../../utils/help.js');
const lang     = require('../../config/lang.js');

//instance
const api     = new apiBasic();
const signMd5 = help.sign;
const isEmpty = help.isEmpty;

//private
function service() {
  /**
   * 接口路径
   */
  this.urlList = {
    recruit_datails: config.recruit_datails
  };
}

//public
service.prototype = {
  /**
   * 渲染初始页面
   */
  initRender: function (that) {
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
    let url = this.urlList.recruit_datails;
    let sign = signMd5(config.key, params);
    params.sign = sign;

    //post
    api.post(url, params).then(res => {
      console.log(res);
      if (res.status_code == 200) {
        let info = res.data;
        that.renderDetail({
          banner_list: info.company_images,
          company_info: {
            logo: info.logo_images,
            name: info.partner_name,
            info_list: info.partner_province + info.partner_province+ '|' + info.scale + '|' + info.industry_name
          },
          position_info: {
            title: info.position_name,
            area: info.province_name + ' ' + info.city_name,
            pay: info.salary_entry,
            type: info.is_full_time,
            reward: lang.reward + '：' + info.entry_reward_details,
            whatReward: lang.whatReward
          },
          reward: [
            {
              label: 'treatment',
              title: lang.treatment,
              info: [
                {
                  'name': lang.payrollDay + '：',
                  'value': info.salary_pay_date
                },{
                  'name': lang.salaryType + '：',
                  'value': info.salary_pay_type
                },{
                  'name': lang.basicSalary + '：',
                  'value': info.salary_base
                },{
                  'name': lang.fullAttendance + '：',
                  'value': isEmpty(parseFloat(info.entry_reward)) ? lang.none : info.entry_reward
                },{
                  'name': lang.overtimeReward + '：',
                  'value': isEmpty(parseFloat(info.salary_overtime)) ? lang.none : info.salary_overtime
                }
              ]
            },{
              label: 'jobDescription',
              title: lang.jobDescription,
              info: [
                {
                  'name': lang.jobContent + '：',
                  'value': info.work_content
                },{
                  'name': lang.jobTime + '：',
                  'value': info.work_time
                },{
                  'name': lang.jobTimes + '：',
                  'value': info.work_shift
                },{
                  'name': lang.jobExplain + '：',
                  'value': isEmpty(info.work_remark) ? lang.none : info.work_remark
                }
              ]
            },{
              label: 'welfare',
              title: lang.welfare,
              info: [
                {
                  'name': lang.basicWelfare + '：',
                  'value': ''
                },{
                  'name': lang.entryDuration + '：',
                  'value': info.full_roll_days
                },{
                  'name': lang.returnCash + '：',
                  'value': info.entry_reward
                }
              ]
            },{
              label: 'admissionCondition',
              title: lang.admissionCondition,
              info: [
                {
                  'name': lang.sexCondition + '：',
                  'value': info.hire_gender
                },{
                  'name': lang.ageCondition + '：',
                  'value': info.hire_age
                },{
                  'name': lang.educationCondition + '：',
                  'value': info.hire_education
                },{
                  'name': lang.workExperience + '：',
                  'value': info.hire_expert
                }
              ]
            }
          ]
        });
      } else {
        layer.toast(res.message);
      }
    }, msg => {
      layer.toast(msg.message);
    });
  }
}

module.exports = service;