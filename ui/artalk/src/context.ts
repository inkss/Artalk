/* eslint-disable @typescript-eslint/no-loop-func */
import type { ArtalkConfig, CommentData, ListFetchParams, ContextApi, EventPayloadMap, SidebarShowPayload } from '@/types'
import type { TInjectedServices } from './service'
import Api from './api'

import * as marked from './lib/marked'
import { mergeDeep } from './lib/merge-deep'
import { CheckerCaptchaPayload, CheckerPayload } from './components/checker'

import { DataManager } from './data'
import * as I18n from './i18n'

import EventManager from './lib/event-manager'
import { convertApiOptions, handelCustomConf } from './config'

// Auto dependency injection
interface Context extends TInjectedServices { }

/**
 * Artalk Context
 */
class Context implements ContextApi {
  /* 运行参数 */
  public conf: ArtalkConfig
  public data: DataManager
  public $root: HTMLElement

  /* Event Manager */
  private events = new EventManager<EventPayloadMap>()

  public constructor(conf: ArtalkConfig) {
    this.conf = conf

    this.$root = conf.el as HTMLElement
    this.$root.classList.add('artalk')
    this.$root.innerHTML = ''

    this.data = new DataManager(this.events)
  }

  public inject(depName: string, obj: any) {
    this[depName] = obj
  }

  public get(depName: string) {
    return this[depName]
  }

  public getApi() {
    return new Api(convertApiOptions(this.conf, this))
  }

  public getData() {
    return this.data
  }

  public replyComment(commentData: CommentData, $comment: HTMLElement): void {
    this.editor.setReply(commentData, $comment)
  }

  public editComment(commentData: CommentData, $comment: HTMLElement): void {
    this.editor.setEditComment(commentData, $comment)
  }

  public fetch(params: Partial<ListFetchParams>): void {
    this.data.fetchComments(params)
  }

  public reload(): void {
    this.data.fetchComments({ offset: 0 })
  }

  public listGotoFirst(): void {
    this.events.trigger('list-goto-first')
  }

  /* 编辑器 */
  public editorShowLoading(): void {
    this.editor.showLoading()
  }

  public editorHideLoading(): void {
    this.editor.hideLoading()
  }

  public editorShowNotify(msg, type): void {
    this.editor.showNotify(msg, type)
  }

  public editorResetState(): void {
    this.editor.resetState()
  }

  /* 侧边栏 */
  public showSidebar(payload?: SidebarShowPayload): void {
    this.sidebarLayer.show(payload)
  }

  public hideSidebar(): void {
    this.sidebarLayer.hide()
  }

  /* 权限检测 */
  public checkAdmin(payload: CheckerPayload): void {
    this.checkerLauncher.checkAdmin(payload)
  }

  public checkCaptcha(payload: CheckerCaptchaPayload): void {
    this.checkerLauncher.checkCaptcha(payload)
  }

  /* Events */
  public on(name: any, handler: any) {
    this.events.on(name, handler)
  }

  public off(name: any, handler: any) {
    this.events.off(name, handler)
  }

  public trigger(name: any, payload?: any) {
    this.events.trigger(name, payload)
  }

  /* i18n */
  public $t(key: I18n.I18nKeys, args: {[key: string]: string} = {}): string {
    return I18n.t(key, args)
  }

  public setDarkMode(darkMode: boolean|'auto'): void {
    // prevent trigger 'conf-loaded' to improve performance
    // this.updateConf({ ...this.conf, darkMode })
    this.conf.darkMode = darkMode
    this.events.trigger('dark-mode-changed', darkMode)

    const owoShow = document.querySelector('#owo-big')
    if (this.conf.darkMode) owoShow?.classList.add('atk-dark-mode')
    else owoShow?.classList.remove('atk-dark-mode')
  }

  public updateConf(nConf: Partial<ArtalkConfig>): void {
    this.conf = mergeDeep(this.conf, handelCustomConf(nConf, false))
    this.events.trigger('conf-loaded', this.conf)
  }

  public getConf(): ArtalkConfig {
    return this.conf
  }

  public getEl(): HTMLElement {
    return this.$root
  }

  public getMarked() {
    return marked.getInstance()
  }

  public showOwoBig(target:Node) {
    console.log(target)
    const ratio = 2
    const maxLength = 200
    const body = document.querySelector('body') || document.createElement('body')
    let div = document.createElement('div')
    if (document.querySelector('#owo-big')) {
      div = document.querySelector('#owo-big') as HTMLDivElement
    } else {
      div.id = 'owo-big'
      body.appendChild(div)
    }

    const observer = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i++){
        let flag = 1
        let owoTime = 0
        /**
         * 放大项：
         * ① 表情包
         * ② 评论行
         * ③ 预览窗（只有一张图）
         * ④ 预览窗（任意）
         */
        const dom = mutations[i].addedNodes.forEach(node => {
          const addedNodes = node as any;
          if (addedNodes.classList?.contains('atk-grp') 
                || addedNodes.classList?.contains('atk-comment-wrap')
                || (!!addedNodes.attributes && addedNodes.attributes['atk-emoticon'])
                || (typeof addedNodes.querySelector === 'function' && addedNodes.querySelector('img[atk-emoticon]'))) {
            addedNodes.onmouseover = e => {
              const eve = (e as any).target
              if (flag && eve.tagName === 'IMG' && eve.attributes['atk-emoticon']) {
                flag = 0;
                owoTime = window.setTimeout(() => {
                  const alt = eve.getAttribute("notitle") === "true" ? '' : eve.alt || '';
                  const clientHeight = eve.clientHeight
                  const clientWidth = eve.clientWidth
                  if (clientHeight <= maxLength && clientWidth <= maxLength) {
                    const naturalHeight = eve.naturalHeight
                    const naturalWidth = eve.naturalWidth
                    const zoomHeight = clientHeight * ratio
                    const zoomWidth = clientWidth * ratio
                    // eslint-disable-next-line no-nested-ternary
                    const height = naturalHeight > clientHeight
                      ? zoomHeight < naturalHeight && naturalHeight < maxLength ? zoomHeight : naturalHeight
                      : clientHeight
                    // eslint-disable-next-line no-nested-ternary
                    const width = naturalWidth > clientWidth
                      ? zoomWidth < naturalWidth && naturalWidth < maxLength ? zoomWidth : naturalWidth
                      : clientWidth
                    let tempWidth = 0;
                    let tempHeight = 0;
                    if (width / height >= 1) {
                      if (width >= maxLength) {
                        tempWidth = maxLength
                        tempHeight = (height * maxLength) / width
                      } else {
                        tempWidth = width
                        tempHeight = height
                      }
                    } else {
                      if (height >= maxLength) {
                        tempHeight = maxLength
                        tempWidth = (width * maxLength) / height
                      } else {
                        tempWidth = width
                        tempHeight = height
                      }
                    }
                    const top = e.y - e.offsetY
                    let left = (e.x - e.offsetX) - (tempWidth - eve.clientWidth) / 2
                    if ((left + tempWidth) > body.clientWidth) left -= ((left + tempWidth) - body.clientWidth + 10)
                    if (left < 0) left = 10
                    if (alt !== '') tempHeight += 10
                    div.style.cssText = `display:block;height:${tempHeight + 34}px;width:${tempWidth + 34}px;left:${left}px;top:${top}px;`;
                    div.innerHTML = `<img src="${eve.src}"><p>${alt}</p>`
                  }
                }, 300);
              }
            }
          }
          addedNodes.onmouseout = () => {
            flag = 1
            div.style.display = 'none'
            clearTimeout(owoTime)
          }
        })
      }
    })
    observer.observe(target, { subtree: true, childList: true })
  }
}

export default Context
