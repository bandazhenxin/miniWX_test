//reply
const app = getApp();
const config = require('../../config/request.js');
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');
const wxAsyn = require('../../utils/webServer/asyn/wxAsyn.js');
//instance
const api = new apiBasic();
const signMd5 = help.sign;
const mergeObj = help.mergeObj;
//private
function service() {
    /**
     * 接口路径
     */
    this.urlList = {
        invitingFriends: 'https://wx.upjob.com.cn/api/v1/get_qrcode_images'
    };
}

//public
service.prototype = {
    // 获取当前职位
    invitingFriends: function (that) {
        wx.showLoading({
            title: '加载中',
        })
        let params = {
            system: config.system,
            version: config.version,
            sign: null,
            token: app.globalData.token,
            is_refresh: 1
        }
        // console.log(app.globalData)
        let url = this.urlList.invitingFriends
        let sign = signMd5(config.key, params)
        // console.log(params)
        params.sign = sign
        api.post(url, params).then(res => {
            wx.hideLoading()
            if (res.status_code === 200) {
                that.vm.qrList = res.data.list;
                app.globalData.imgSrc=res.data.list[0]
                layer.busy(false);
                that.render();
            } else {
                layer.busy(false);
                layer.toast(res.message);
            }
        }, msg => {
            layer.toast(lang.networkError);
        })
    }
}

module.exports = service;