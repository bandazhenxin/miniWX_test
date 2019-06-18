//reply
const config = require('../../config/request.js');
const basic = require('../../config/basic.js');
const apiBasic = require('../../core/apiBasic.js');
const layer = require('../../utils/webServer/layer.js');
const help = require('../../utils/help.js');
const lang = require('../../config/lang.js');

//instance
const api = new apiBasic();
const signMd5 = help.sign;
const isEmpty = help.isEmpty;

//private
function service() {

}

//public
service.prototype = {
  /**
   * 渲染初始化
   */
  initRender: function (that) {
    that.renderDetail({
      detail: [
        {
          name: lang.whatEntryReward,
          words: lang.whatEntryRewardWords,
        }, {
          name: lang.whatHasEntryReward,
          words: lang.whatHasEntryRewardWords,
        }, {
          name: lang.entryRewardProcess,
          words: lang.entryRewardProcessWords,
        }, {
          name: lang.reminder,
          words: lang.reminderWords,
        }
      ],
      tips: lang.entryRewardTips
    });
    that.vm.db.phone = basic.linkPhone;
  }
};

module.exports = service;