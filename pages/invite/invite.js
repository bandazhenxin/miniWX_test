//reply
const serviceClass = require('service.js');
const pageBasic = require('../../core/pageBasic.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');
const layer = require('../../utils/webServer/layer.js');
const app = getApp()
//instance
const service = new serviceClass();
//继承基类
function Invite(title) {
  pageBasic.call(this, title);
  this.vm = {
    db: {},
    qrList: [],
    index: 1,
    imgSrc: '',
    current: 0,
    swiperShow: true
  }
}
Invite.prototype = new pageBasic();


/**
 * 逻辑初始化
 */
Invite.prototype.onPreload = function (option) {
  //init
  if (option && option.imgSrc) {
    this.vm.swiperShow = false
    app.globalData.imgSrc = option.imgSrc
  }
  // 获取轮播图
  service.invitingFriends(this)
  this.render();
}
// 轮播
Invite.prototype.onSlideChangeEnd = function (e) {
  // console.log(e.detail.current)
  if (!swiperShow) return
  var that = this;
  that.vm.index = e.detail.current + 1
  that.setData({
    index: e.detail.current + 1
  })
  app.globalData.imgSrc = that.vm.qrList[that.vm.index - 1]
}
// 分享并保存图片
Invite.prototype.share = function () {
  var that = this
  console.log(that.vm.index)
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
//转发
Invite.prototype.onShareAppMessage = function (res) {
  // console.log( app.globalData)
  if (res.from === 'button') {
    return {
      title: '',
      imageUrl: app.globalData.imgSrc,
      path: '/pages/invite/invite?imgSrc=' + app.globalData.imgSrc,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })
      }
    }
  }
}
/**
 * 显示时
 */
Invite.prototype.onShow = function (option) {
  this.onLoad();
}

Page(new Invite());