//reply
const serviceClass  = require('service.js');
const pageBasic     = require('../../core/pageBasic.js');
const help          = require('../../utils/help.js');
const lang          = require('../../config/lang.js');
const layer         = require('../../utils/webServer/layer.js');
const validataClass = require('../../utils/webServer/validata.js');

//instance
const service  = new serviceClass();
const isEmpty  = help.isEmpty;
const Validata = new validataClass();

//继承基类
function SignDetailPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      nation_id: 0,
      education_id: 0,
      form_data: {}
    },

    id: 0,

    job_info: {},
    nation_list: [],
    education_list: [],
    nation_text: '',
    education_text: '',
    sex_text: '',
    birthda_text: ''
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



/* ui */

/**
 * 民族选择
 */
SignDetailPage.prototype.nationChange = function (e) {
  let val = e.detail.value;
  this.vm.db.nation_id = this.vm.nation_list[val].mz_id;
  this.renderDetail({
    nation_text: this.vm.nation_list[val].mzname
  });
}

/**
 * 学历选择
 */
SignDetailPage.prototype.educationChange = function (e) {
  let val = e.detail.value;
  this.vm.db.education_id = this.vm.education_list[val].id;
  this.renderDetail({
    education_text: this.vm.education_list[val].education_name
  });
}

/**
 * 立即报名
 */
SignDetailPage.prototype.signUp = function (e) {
  //init
  let data = e.detail.value;
  
  //validata
  //require
  if (!data.name){
    layer.toast('请输入姓名');
    return;
  }
  if (!data.id_card) {
    layer.toast('请输入身份证号');
    return;
  }
  if (!data.mobile) {
    layer.toast('请输入手机号');
    return;
  }

  //身份证
  let isCard = Validata.isCardID(data.id_card);
  if (isCard !== true){
    layer.toast(isCard);
    return;
  }

  //手机号
  let isMobile = Validata.checkPhone(data.mobile);
  if (isMobile !== true) {
    layer.toast(isMobile);
    return;
  }

  //报名操作
  this.vm.db.form_data = data;
  service.signUp(this);
}

/**
 * 渲染性别与出生日期
 */
SignDetailPage.prototype.idchange = function (e) {
  let cardInfo = Validata.getIDInfo(e.detail.value);
  let params = {};
  params.birthda_text = cardInfo.birthday ? cardInfo.birthday : '';
  params.sex_text = cardInfo.sex ? cardInfo.sex : '';
  this.renderDetail(params);
}

Page(new SignDetailPage(lang.signUp));