//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');

//instance
const service = new serviceClass();
const isEmpty = help.isEmpty;

//继承基类
function SignDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},

    id: 0,

    job_info: {},
    nation_list: {},
    education_list: {}
  }
}
SignDetailPage.prototype = new pageBasic();



/** 业务逻辑控制 **/

/**
 * 逻辑初始化
 */
SignDetailPage.prototype.onPreload = function (option) {
  //init
  let id = option.id;
  this.vm.id = id;
  this.render();

  //渲染职位信息
  service.jobInfo(this);

  //渲染民族数据
  service.nationList(this);

  //渲染学历数据
  service.educationList(this);
}

Page(new SignDetailPage(lang.signUp));