const layer = require('../utils/webServer/layer');

function application(){

}

application.prototype = {
  onLaunch:function(){
    let me = this;

  },
  scope:{
    userInfo: 'scope.userInfo',                 //用户信息权限
    userLocation: 'scope.userLocation',         //地理位置权限
    address: 'scope.address',                   //通讯地址权限
    invoiceTitle: 'scope.invoiceTitle',         //发票抬头权限
    invoice: 'scope.invoice',                   //获取发票权限
    werun: 'scope.werun',                       //微信运动步数权限
    record: 'scope.record',                     //录音功能权限
    writePhotosAlbum: 'scope.writePhotosAlbum', //保存到相册权限
    camera: 'scope.camera'                      //摄像头权限
  },
};