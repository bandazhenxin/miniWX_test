//reply
const serviceClass = require('service.js');
const pageBasic    = require('../../core/pageBasic.js');
const help         = require('../../utils/help.js');
const lang         = require('../../config/lang.js');
const layer        = require('../../utils/webServer/layer.js');
const app          = getApp()

//instance
const service = new serviceClass();

//继承基类
function InvitePage(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {
      imgSrc: ''
    },
    qrList: [],
    index: 1,
    imgSrc: '',
    current: 0,
    swiperHide: false,
    shareImg:''
  }
}
InvitePage.prototype = new pageBasic();


/**
 * 逻辑初始化
 */
InvitePage.prototype.onPreload = function (option) {
  //init
  if (option && option.imgSrc) {
    //被分享时
    this.vm.swiperHide = true
    this.vm.shareImg = option.imgSrc
    this.render();
  }else{
    this.vm.swiperHide = false
    this.render();

    // 获取轮播图
    service.invitingFriends(this)
  }
}

/**
 * 轮播
 */
InvitePage.prototype.onSlideChangeEnd = function (e) {
  if (this.vm.swiperHide) return;

  this.vm.index = e.detail.current + 1;
  this.renderDetail({
    index: e.detail.current + 1
  })
  this.vm.db.imgSrc = this.vm.qrList[this.vm.index - 1];
}

/**
 * 分享并保存图片
 */
InvitePage.prototype.share = function () {
  var that = this
  var imgSrc = that.vm.qrList[that.vm.index - 1]
  wx.downloadFile({
    url: imgSrc,
    success: function (res) {
      console.log(res);
      //图片保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (err) {
          console.log(err);
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            console.log("当初用户拒绝，再次发起授权")
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                } else {
                  console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            })
          }
        },
        complete(res) {
          console.log(res);
        }
      })
    }
  })
}

/**
 * 转发
 */
InvitePage.prototype.onShareAppMessage = function (res) {
  return {
    title: '',
    imageUrl: this.vm.db.imgSrc,
    path: '/pages/invite/invite?imgSrc=' + this.vm.db.imgSrc,
    success: function (res) {
      wx.showToast({
        title: '分享成功',
        icon: 'success'
      })
    }
  }
}

/**
 * 图片预览
 */
InvitePage.prototype.preview = function (e) {
  let { src } = e.currentTarget.dataset;
  wx.previewImage({
    current: src,
    urls: [src]
  })
}

Page(new InvitePage(lang.invite));