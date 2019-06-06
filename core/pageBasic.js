/**
 * 基类控制器
 */
const app = getApp();

function pageBasic(title){
  this.vm = null;
  this.title = title;
}

pageBasic.prototype = {
  onLoad: function (options){
    let me = this;
    if (this.title != null) this.setTitle(this.title);

    //私有初始化
    this.onPreload(options);
  },
  //设置页面标题
  setTitle: function (title) {
    this.title = title;
    wx.setNavigationBarTitle({ title: this.title });
  },
  //渲染数据
  render: function () {
    var data = {};
    for (var p in this.vm) {
      var value = this.vm[p];
      if (!this.vm.hasOwnProperty(p) || p == 'db') { 
        continue;
      }
      if (value == null || typeof (value) === 'function') {
        continue;
      }
      if (value.__route__ != null) {
        continue;
      }
      data[p] = this.vm[p];
    }
    this.setData(data);
  },
  //局部渲染
  renderDeatil: function(obj){
    this.setData(obj);
  },
  //页面重定向
  go: function (url, addToHistory) {
    if (addToHistory === false) {
      wx.redirectTo({ url: url });
    }else {
      wx.navigateTo({ url: url });
    }
  },
  //页面出栈
  goBack: function () {
    wx.navigateBack({});
  },
  //获取完整路径
  getFullUrl: function () {
    var url = this.route.indexOf('/') === 0 ? this.route : '/' + this.route;
    var parts = [];
    for (var p in this.options) {
      if (this.options.hasOwnProperty(p)) {
        parts.push(p + "=" + this.options[p]);
      }
    }
    if (parts.length > 0) {
      url += "?" + parts.join('&');
    }
    return url;
  },
  //判断是否是是首页
  isCurrentPage: function () {
    let pages = getCurrentPages();
    let is = pages.length > 0 ? pages[0] : null;
    return this === is;
  },
  //初始化 初始化方法
  onPreload:function (options) {

  }
};

module.exports = pageBasic;