import ArtalkConfig from "~/types/artalk-config"

const defaults: ArtalkConfig = {
  el: '',
  pageKey: '',
  pageTitle: '',
  server: '',
  site: '',

  placeholder: '',
  noComment: '',
  sendBtn: '',
  darkMode: false,
  editorTravel: true,

  flatMode: 'auto',
  nestMax: 3,
  nestSort: 'DATE_ASC',

  emoticons: "https://o.static.szyink.com/storage/owo.json",

  vote: true,
  voteDown: true,
  uaBadge: false,
  listSort: true,
  preview: true,
  countEl: '#ArtalkCount',
  pvEl: '#ArtalkPV',

  gravatar: {
    default: 'mp',
    mirror: 'https://cravatar.cn/avatar/',
  },

  pagination: {
    pageSize: 20,
    readMore: true,
    autoLoad: true,
  },

  heightLimit: {
    content: 300,
    children: 400,
  },

  imgUpload: true,
  reqTimeout: 15000,
  versionCheck: true,
  useBackendConf: false,

  locale: 'zh-CN',
}

if (ARTALK_LITE) {
  defaults.vote = false
  defaults.uaBadge = false
  defaults.emoticons = false
}

export default defaults
