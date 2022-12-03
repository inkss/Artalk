import './style/main.less'

import ArtalkConfig from '~/types/artalk-config'
import { EventPayloadMap, Handler } from '~/types/event'
import ArtalkPlug from '~/types/plug'
import Context from '~/types/context'
import ConcreteContext from './context'
import defaults from './defaults'

import ListLite from './list/list-lite'
import CheckerLauncher from './lib/checker'
import Editor from './editor'
import List from './list'
import SidebarLayer from './layer/sidebar-layer'

import Layer from './layer'
import * as Utils from './lib/utils'
import * as Ui from './lib/ui'
import * as Stat from './lib/stat'

/**
 * Artalk
 *
 * @website https://artalk.js.org
 */
export default class Artalk {
  public static ListLite = ListLite
  public static readonly defaults: ArtalkConfig = defaults

  public conf!: ArtalkConfig
  public ctx!: Context
  public $root!: HTMLElement

  /** Plugins (in global scope)  */
  protected static Plugins: ArtalkPlug[] = [ Stat.PvCountWidget ]

  /** Plugins (in a instance scope) */
  protected instancePlugins: ArtalkPlug[] = []

  /** 禁用的组件 */
  public static DisabledComponents: string[] = []

  constructor(customConf: Partial<ArtalkConfig>) {
    /* 初始化基本配置 */
    this.conf = Artalk.HandelBaseConf(customConf)
    if (this.conf.el instanceof HTMLElement) this.$root = this.conf.el

    this.showOwoBig(this.conf.el as Node)

    /* 初始化 Context */
    this.ctx = new ConcreteContext(this.conf, this.$root)

    /* 初始化组件 */
    this.initComponents()
  }

  /** 表情包放大  */
  private showOwoBig(target:Node) {
    const ratio = 2
    const maxLength = 200
    const body = document.querySelector('body')

    let div = document.createElement('div')
    if (document.querySelector('#owo-big')) {
      div = document.querySelector('#owo-big')
    } else {
      div.id = 'owo-big'
      body.appendChild(div)
    }

    const observer = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i++){
        const dom = mutations[i].addedNodes
        let flag = 1
        let owoTime = 0
        /**
         * 放大项：
         * ① 表情包
         * ② 评论行
         * ③ 预览窗（只有一张图）
         * ④ 预览窗（任意）
         */
        if(dom[0]?.classList?.contains('atk-grp')
            || dom[0]?.classList?.contains('atk-comment-wrap')
            || (!!dom[0]?.attributes && !!dom[0]?.attributes['atk-emoticon'])
            || (typeof dom[0]?.querySelector === 'function' && dom[0]?.querySelector('img[atk-emoticon]'))) {
          dom[0].onmouseover = (e) => {
            // 如果需要只放大表情包可以添加
            if (flag && e.target.tagName === 'IMG' && !!e.target.attributes['atk-emoticon']) {
              flag = 0;
              owoTime = setTimeout(() => {
                const alt = e.path[0].getAttribute("notitle") === "true" ? '' : e.path[0].alt || '';
                const clientHeight = e.path[0].clientHeight
                const clientWidth = e.path[0].clientWidth
                if(clientHeight <= maxLength && clientWidth <= maxLength) {
                  const naturalHeight = e.path[0].naturalHeight
                  const naturalWidth = e.path[0].naturalWidth
                  const zoomHeight = clientHeight * ratio
                  const zoomWidth = clientWidth * ratio
                  // eslint-disable-next-line no-nested-ternary
                  const height = naturalHeight > clientHeight
                    ?  zoomHeight < naturalHeight && naturalHeight < maxLength ? zoomHeight : naturalHeight
                    : clientHeight
                  // eslint-disable-next-line no-nested-ternary
                  const width = naturalWidth > clientWidth
                    ? zoomWidth < naturalWidth && naturalWidth < maxLength ? zoomWidth : naturalWidth
                    : clientWidth
                  let tempWidth = 0;
                  let tempHeight = 0;
                  if(width / height >= 1) {
                    if(width >= maxLength) {
                      tempWidth = maxLength
                      tempHeight = (height * maxLength) / width
                    } else {
                      tempWidth = width
                      tempHeight = height
                    }
                  } else {
                    if(height >= maxLength) {
                      tempHeight = maxLength
                      tempWidth = (width * maxLength) / height
                    } else {
                      tempWidth = width
                      tempHeight = height
                    }
                  }
                  const top = e.y - e.offsetY
                  let  left = (e.x - e.offsetX) - (tempWidth - e.path[0].clientWidth) / 2
                  if ((left + tempWidth) > body.clientWidth) left -= ((left + tempWidth) - body.clientWidth + 10)
                  if (left < 0) left = 10
                  if (alt !== '') tempHeight += 10
                  div.style.cssText = `display:block;height:${tempHeight+34}px;width:${tempWidth+34}px;left:${left}px;top:${top}px;`;
                  div.innerHTML = `<img src="${e.target.src}"><p>${alt}</p>`
                }
              }, 300);
            }
          };
          dom[0].onmouseout = () => {
            flag = 1
            div.style.display = 'none'
            clearTimeout(owoTime)
          }
        }
      }
    })
    observer.observe(target, { subtree: true, childList: true }) // 监听的 元素 和 配置项
  }

  /** 组件初始化 */
  private initComponents() {
    this.initLocale()
    this.initLayer()
    Utils.initMarked(this.ctx)

    const Components: { [name: string]: () => void } = {
      // CheckerLauncher
      checkerLauncher: () => {
        const checkerLauncher = new CheckerLauncher(this.ctx)
        this.ctx.setCheckerLauncher(checkerLauncher)
      },

      // 编辑器
      editor: () => {
        const editor = new Editor(this.ctx)
        this.ctx.setEditor(editor)
        this.$root.appendChild(editor.$el)
      },

      // 评论列表
      list: () => {
        // 评论列表
        const list = new List(this.ctx)
        this.ctx.setList(list)
        this.$root.appendChild(list.$el)

        // 评论获取
        list.fetchComments(0)
      },

      // 侧边栏 Layer
      sidebarLayer: () => {
        const sidebarLayer = new SidebarLayer(this.ctx)
        this.ctx.setSidebarLayer(sidebarLayer)
      },

      // 默认事件绑定
      eventsDefault: () => {
        this.initEventBind()
      }
    }

    // 组件初始化
    Object.entries(Components).forEach(([name, initComponent]) => {
      if (Artalk.DisabledComponents.includes(name)) return

      initComponent()
    })

    // 插件初始化 (global scope)
    Artalk.Plugins.forEach(plugin => {
      if (typeof plugin === 'function')
        plugin(this.ctx)
    })
  }

  /** 基本配置初始化 */
  public static HandelBaseConf(customConf: Partial<ArtalkConfig>): ArtalkConfig {
    // 合并默认配置
    const conf: ArtalkConfig = Utils.mergeDeep(Artalk.defaults, customConf)

    // 绑定元素
    if (typeof conf.el === 'string' && !!conf.el) {
      try {
        const findEl = document.querySelector<HTMLElement>(conf.el)
        if (!findEl) throw Error(`Target element "${conf.el}" was not found.`)
        conf.el = findEl
      } catch (e) {
        console.error(e)
        throw new Error('Please check your Artalk `el` config.')
      }
    }

    // 服务器配置
    conf.server = conf.server.replace(/\/$/, '').replace(/\/api\/?$/, '')

    // 默认 pageKey
    if (!conf.pageKey) {
      // @link http://bl.ocks.org/abernier/3070589
      conf.pageKey = `${window.location.pathname}`
    }

    // 默认 pageTitle
    if (!conf.pageTitle) {
      conf.pageTitle = `${document.title}`
    }

    return conf
  }

  /** 事件绑定初始化 */
  private initEventBind() {
    // 锚点快速跳转评论
    window.addEventListener('hashchange', () => {
      this.ctx.listHashGotoCheck()
    })

    // 本地用户数据变更
    this.ctx.on('user-changed', () => {
      this.ctx.checkAdminShowEl()
      this.ctx.listRefreshUI()
    })
  }

  /** 语言初始化 */
  private initLocale() {
    if (this.conf.locale === 'auto') { // 自适应语言
      this.conf.locale = navigator.language
    }
  }

  /** Layer 初始化 */
  private initLayer() {
    // 记录页面原始 Styles
    Layer.BodyOrgOverflow = document.body.style.overflow
    Layer.BodyOrgPaddingRight = document.body.style.paddingRight
  }

  /** 监听事件 */
  public on<K extends keyof EventPayloadMap>(name: K, handler: Handler<EventPayloadMap[K]>) {
    this.ctx.on(name, handler, 'external')
  }

  /** 解除监听事件 */
  public off<K extends keyof EventPayloadMap>(name: K, handler: Handler<EventPayloadMap[K]>) {
    this.ctx.off(name, handler, 'external')
  }

  /** 触发事件 */
  public trigger<K extends keyof EventPayloadMap>(name: K, payload?: EventPayloadMap[K]) {
    this.ctx.trigger(name, payload, 'external')
  }

  /** 重新加载 */
  public reload() {
    this.ctx.listReload()
  }

  /** 设置暗黑模式 */
  public setDarkMode(darkMode: boolean) {
    this.ctx.setDarkMode(darkMode)
  }

  /** Use Plugin (specific instance) */
  public use(plugin: ArtalkPlug) {
    this.instancePlugins.push(plugin)
    if (typeof plugin === 'function') plugin(this.ctx)
  }

  /** Use Plugin (static method for global scope) */
  public static use(plugin: ArtalkPlug) {
    this.Plugins.push(plugin)
  }

  /** @deprecated Please replace it with lowercase function name `use(...)`. */
  public static Use(plugin: ArtalkPlug) {
    this.use(plugin)
    console.warn('`Use(...)` is deprecated, replace it with lowercase `use(...)`.')
  }

  /** 装载数量统计元素 */
  public static LoadCountWidget(customConf: Partial<ArtalkConfig>) {
    const conf = this.HandelBaseConf(customConf)
    const ctx = new ConcreteContext(conf)
    Stat.initCountWidget({ ctx, pvAdd: false })
  }
}
