/**
 * 通信配置
 */
let request = {
  key:        'GhU6G4FK5iiyeCRoLw',
  system:     'wechat',
  version:    1,
  initUrl:    'https://wx.upjob.com.cn/api/v2/login/mini_login',
  job_list:   'https://wx.upjob.com.cn/api/v2/index/get_index_job_list',
  get_mobile: 'https://wx.upjob.com.cn/api/v2/login/mini_bind_mobile',
  tags_list:  'https://wx.upjob.com.cn/api/v2/public/benefits_tag_List',
};

module.exports = request;