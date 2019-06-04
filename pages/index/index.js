 //reply
const app = getApp();
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');

//instance
const service = new serviceClass();

//继承基类
function IndexPage(title) {
  pageBasic.call(this,title);
  this.vm = {
    db:{},
    isMove: true,
    isScroll:false,
    motto: 'Hello World',
    userInfo: {},
    hasBasicUserInfo: false,
    hasUserPhone: false,
    canIUseUser: wx.canIUse('button.open-type.getUserInfo'),
    canIUsePhone: wx.canIUse('button.open-type.getPhoneNumber'),
    position_item: []
  }
};
IndexPage.prototype = new pageBasic();

//逻辑初始化
IndexPage.prototype.onPreload = function(option){
  //授权判断
  if (app.globalData.userBasicInfo){
    this.vm.hasBasicUserInfo = true;
  }else{
    //注册初始化回调
    app.userInfoReadyCallback = res => {
      this.vm.hasBasicUserInfo = true;
      this.render();
    }
  }
  if (app.globalData.userPhone) this.vm.hasUserPhone = true;

  //职位初始渲染
  service.jobListIndex(this);

  //这个可以在职位初始渲染里渲染，这边可以去掉
  this.render();
}

//点击头像跳转日志记录页
IndexPage.prototype.bindViewTap = function () {
  wx.navigateTo({
    url: '../logs/logs'
  })
}

//获取用户信息
IndexPage.prototype.getUserInfo = function (e) {
  service.init(app, this, e.detail.userInfo);
}

//获取用户手机信息
IndexPage.prototype.getPhoneNumber = function(e){
  service.getPhone();
}

//释放滑动判断
IndexPage.prototype.backTop = function(event){
  let y = event.detail.y;
  let top = event.currentTarget.offsetTop;
  // this.vm.isMove = false;
  this.vm.isScroll = (y * (-1) == top);
  this.render();
}

Page(new IndexPage('悠聘'));
