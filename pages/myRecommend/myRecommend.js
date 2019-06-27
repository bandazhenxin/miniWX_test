//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');
const app          = getApp()
const link          = require('../../config/link.js');

//instance
const service = new serviceClass();

//继承基类
function MyRecommendPage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    grade: '',
    recommendList: [],
    tabs: ['团队', '下属'],
    activeIndex: 0,
    teamShow: true,
    subordinateList: [],
    sliderOffset: 0,
    sliderLeft: 0,
    link: link
  }
}
MyRecommendPage.prototype = new pageBasic();


/**
 * 逻辑初始化
 */
MyRecommendPage.prototype.onPreload = function (option) {
  //init
  let grade = option.grade;
  this.vm.grade = grade;
  this.render()
  // 获取下属推荐列表
  service.getIntroducerList(this)
}

// 切换tab
MyRecommendPage.prototype.clickTab = function (e) {
  this.renderDetail({
    sliderOffset: e.currentTarget.offsetLeft,
    activeIndex: e.currentTarget.id
  })
  
  // 团队 下属
  if (e.currentTarget.id == 0) {
    service.getIntroducerList(this, -1)
  } else {
    service.getIntroducerList(this, -2)
  }
}

Page(new MyRecommendPage(lang.myRecommend));