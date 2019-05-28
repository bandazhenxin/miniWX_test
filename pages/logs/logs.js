//logs.js
const util = require('../../utils/help.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.date(new Date(log))
      })
    })
  }
})
