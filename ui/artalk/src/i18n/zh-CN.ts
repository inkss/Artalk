import type { I18n } from '.'

const zhCN: I18n = {
  /* Editor */
  placeholder: '键入内容...',
  noComment: '「此时无声胜有声」',
  send: '发送评论',
  save: '保存评论',
  nick: '昵称',
  email: '邮箱',
  link: '网址',
  emoticon: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z" fill="currentColor"></path></svg>',
  preview: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0" fill="currentColor"></path><path d="M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0" fill="currentColor"></path></svg>',
  image: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z" fill="currentColor"></path><path d="M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z" fill="currentColor"></path></svg>',
  refresh: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M512.34133333 931.38488889c-49.94844445 0-98.87288889-8.64711111-145.29422222-25.82755556-44.94222222-16.61155555-86.35733333-40.61866667-123.22133333-71.45244444-74.29688889-61.89511111-125.15555555-148.02488889-143.24622223-242.34666667l71.45244445-13.76711111c31.28888889 162.58844445 174.42133333 280.576 340.30933333 280.576 70.08711111 0 137.55733333-20.82133333 195.12888889-60.07466666 56.32-38.45688889 99.66933333-91.93244445 125.49688889-154.73777778l67.35644444 27.648c-31.28888889 76.00355555-83.74044445 140.74311111-151.77955555 187.16444444-69.85955555 47.67288889-151.43822222 72.81777778-236.20266667 72.81777778zM846.848 421.43288889C827.392 349.29777778 783.92888889 284.33066667 724.65066667 238.13688889c-61.21244445-47.55911111-134.59911111-72.704-212.30933334-72.704-69.97333333 0-137.44355555 20.70755555-194.90133333 59.96088889-56.32 38.57066667-99.78311111 91.93244445-125.61066667 154.624l-67.35644444-27.76177778c31.28888889-75.88977778 83.74044445-140.40177778 151.77955556-186.82311111 69.74577778-47.55911111 151.32444445-72.704 235.9751111-72.704 47.33155555 0 93.86666667 7.85066667 138.12622223 23.32444444 42.89422222 14.90488889 82.83022222 36.75022222 118.784 64.62577778 35.61244445 27.648 66.33244445 60.64355555 91.47733333 98.07644444 25.48622222 38.00177778 44.48711111 79.64444445 56.32 123.67644445l-70.08711111 19.00088889z" fill="currentColor"></path><path d="M30.26488889 669.35466667l93.52533333-162.58844445 162.58844445 93.52533333M997.71733333 345.20177778l-83.28533333 168.16355555-168.16355555-83.17155555" fill="currentColor"></path></svg>',
  uploadFail: '上传失败',
  commentFail: '评论失败',
  restoredMsg: '内容已自动恢复',
  onlyAdminCanReply: '仅管理员可评论',
  uploadLoginMsg: '填入你的名字邮箱才能上传哦',

  /* List */
  counter: '{count} 条评论',
  sortLatest: '最新',
  sortOldest: '最早',
  sortBest: '最热',
  sortAuthor: '作者',
  openComment: '打开评论',
  closeComment: '关闭评论',
  listLoadFailMsg: '无法获取评论列表数据',
  listRetry: '点击重新获取',
  loadMore: '加载更多',

  /* Comment */
  admin: '管理员',
  reply: '回复',
  voteUp: '赞同',
  voteDown: '反对',
  voteFail: '投票失败',
  readMore: '阅读更多',
  actionConfirm: '确认操作',
  collapse: '折叠',
  collapsed: '已折叠',
  collapsedMsg: '该评论已被系统或管理员折叠',
  expand: '展开',
  approved: '已审',
  pending: '待审',
  pendingMsg: '审核中，仅本人可见。',
  edit: '编辑',
  editCancel: '取消编辑',
  delete: '删除',
  deleteConfirm: '确认删除',
  pin: '置顶',
  unpin: '取消置顶',

  /* Time */
  seconds: '秒前',
  minutes: '分钟前',
  hours: '小时前',
  days: '天前',
  now: '刚刚',

  /* Checker */
  adminCheck: '键入密码来验证管理员身份：',
  captchaCheck: '键入验证码继续：',
  confirm: '确认',
  cancel: '取消',

  /* Sidebar */
  msgCenter: '通知中心',
  ctrlCenter: '控制中心',

  /* General */
  frontend: '前端',
  backend: '后端',
  loading: '加载中',
  loadFail: '加载失败',
  editing: '修改中',
  editFail: '修改失败',
  deleting: '删除中',
  deleteFail: '删除失败',
  reqGot: '请求响应',
  reqAborted: '请求超时或意外终止',
  updateMsg: '请更新 Artalk {name} 以获得完整体验',
  currentVersion: '当前版本',
  ignore: '忽略',
  open: '打开',
}

export default zhCN
