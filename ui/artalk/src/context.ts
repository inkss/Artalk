import type {
  Config,
  ConfigPartial,
  CommentData,
  ListFetchParams,
  Context as IContext,
  SidebarShowPayload,
  Services,
} from './types'
import * as I18n from './i18n'
import * as marked from './lib/marked'
import { createInjectionContainer } from './lib/injection'
import type { CheckerCaptchaPayload, CheckerPayload } from './components/checker'

/**
 * Artalk Context
 */
class Context implements IContext {
  private _deps = createInjectionContainer<Services>()

  constructor(private _$root: HTMLElement) {}

  getEl(): HTMLElement {
    return this._$root
  }

  destroy(): void {
    this.trigger('unmounted')
    while (this._$root.firstChild) {
      this._$root.removeChild(this._$root.firstChild)
    }
  }

  // -------------------------------------------------------------------
  //  Dependency Injection
  // -------------------------------------------------------------------
  provide: IContext['provide'] = (key, impl, deps, opts) => {
    this._deps.provide(key, impl, deps, opts)
  }

  inject: IContext['inject'] = (key) => {
    return this._deps.inject(key)
  }
  get = this.inject

  /** @deprecated Use `getData()` or `inject('data')` instead. */
  get data() {
    return this.inject('data')
  }

  /** @deprecated Use `getUser()` or `inject('user')` instead. */
  get user() {
    return this.inject('user')
  }

  /** @deprecated Use `inject('editor')` instead. */
  get editor() {
    return this.inject('editor')
  }

  /** @deprecated Use `inject('list')` instead. */
  get list() {
    return this.inject('list')
  }

  /** @deprecated Use `inject('layers')` instead. */
  get layerManager() {
    return this.inject('layers')
  }

  /** @deprecated Use `inject('checkers')` instead. */
  get checkerLauncher() {
    return this.inject('checkers')
  }

  /** @deprecated Use `inject('sidebar')` instead. */
  get sidebarLayer() {
    return this.inject('sidebar')
  }

  /** @deprecated Use `inject('editorPlugs')` instead. */
  get editorPlugs() {
    return this.inject('editorPlugs')
  }

  // -------------------------------------------------------------------
  //  Event Manager
  // -------------------------------------------------------------------
  on: IContext['on'] = (name, handler) => {
    this.inject('events').on(name, handler)
  }

  off: IContext['off'] = (name, handler) => {
    this.inject('events').off(name, handler)
  }

  trigger: IContext['trigger'] = (name, payload) => {
    this.inject('events').trigger(name, payload)
  }

  // -------------------------------------------------------------------
  //  Configurations
  // -------------------------------------------------------------------
  getConf(): Config {
    return this.inject('config').get()
  }

  updateConf(conf: ConfigPartial): void {
    this.inject('config').update(conf)
  }

  watchConf<T extends (keyof Config)[]>(
    keys: T,
    effect: (conf: Pick<Config, T[number]>) => void,
  ): void {
    this.inject('config').watchConf(keys, effect)
  }

  getMarked() {
    return marked.getInstance()
  }

  setDarkMode(darkMode: boolean | 'auto'): void {
    this.updateConf({ darkMode })

    const owoShow = document.querySelector('#owo-big')
    if (this.conf.darkMode) owoShow?.classList.add('atk-dark-mode')
    else owoShow?.classList.remove('atk-dark-mode')
  }

  get conf() {
    return this.getConf()
  }
  set conf(_val) {
    throw new Error('Cannot replace ctx.conf directly; call ctx.updateConf() instead')
  }
  get $root() {
    return this.getEl()
  }
  set $root(_val) {
    throw new Error('Cannot replace ctx.$root; create a new Artalk instance instead')
  }

  // -------------------------------------------------------------------
  //  I18n: Internationalization
  // -------------------------------------------------------------------
  $t(key: I18n.I18nKeys, args: { [key: string]: string } = {}): string {
    return I18n.t(key, args)
  }

  // -------------------------------------------------------------------
  //  HTTP API Client
  // -------------------------------------------------------------------
  getApi() {
    return this.inject('api')
  }

  getApiHandlers() {
    return this.inject('apiHandlers')
  }

  // -------------------------------------------------------------------
  //  User Manager
  // -------------------------------------------------------------------
  getUser() {
    return this.inject('user')
  }

  // -------------------------------------------------------------------
  //  Data Manager
  // -------------------------------------------------------------------
  getData() {
    return this.inject('data')
  }

  fetch(params: Partial<ListFetchParams>): void {
    this.getData().fetchComments(params)
  }

  reload(): void {
    this.getData().fetchComments({ offset: 0 })
  }

  // -------------------------------------------------------------------
  //  List
  // -------------------------------------------------------------------
  listGotoFirst(): void {
    this.trigger('list-goto-first')
  }

  getCommentList = this.getCommentNodes
  getCommentNodes() {
    return this.inject('list').getCommentNodes()
  }

  getCommentDataList = this.getComments
  getComments() {
    return this.getData().getComments()
  }

  // -------------------------------------------------------------------
  //  Editor
  // -------------------------------------------------------------------
  replyComment(commentData: CommentData, $comment: HTMLElement): void {
    this.inject('editor').setReplyComment(commentData, $comment)
  }

  editComment(commentData: CommentData, $comment: HTMLElement): void {
    this.inject('editor').setEditComment(commentData, $comment)
  }

  editorShowLoading(): void {
    this.inject('editor').showLoading()
  }

  editorHideLoading(): void {
    this.inject('editor').hideLoading()
  }

  editorShowNotify(msg, type): void {
    this.inject('editor').showNotify(msg, type)
  }

  editorResetState(): void {
    this.inject('editor').resetState()
  }

  // -------------------------------------------------------------------
  //  Sidebar
  // -------------------------------------------------------------------
  showSidebar(payload?: SidebarShowPayload): void {
    this.inject('sidebar').show(payload)
  }

  hideSidebar(): void {
    this.inject('sidebar').hide()
  }

  // -------------------------------------------------------------------
  //  Checker
  // -------------------------------------------------------------------
  checkAdmin(payload: CheckerPayload): Promise<void> {
    return this.inject('checkers').checkAdmin(payload)
  }

  checkCaptcha(payload: CheckerCaptchaPayload): Promise<void> {
    return this.inject('checkers').checkCaptcha(payload)
  }

  /** 表情包放大 */
  showOwoBig(target: Node) {
    const RATIO = 2
    const MaxLength = 200
    const body = document.querySelector('body') || document.createElement('body')
    let div = document.querySelector('#owo-big') as HTMLElement

    if (!div) {
      div = document.createElement('div')
      div.id = 'owo-big'
      body.appendChild(div)
    }

    let owoTime: number

    // 事件委托：在 target 上统一监听，而非逐个元素绑定
    target.addEventListener('pointerover', ((e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const img = e.target as HTMLImageElement
      if (img.tagName !== 'IMG' || !img.hasAttribute('atk-emoticon')) return

      clearTimeout(owoTime)
      owoTime = window.setTimeout(() => {
        const alt = img.getAttribute('notitle') === 'true' ? '' : img.alt || ''
        const { clientHeight, clientWidth, naturalHeight, naturalWidth } = img

        if (clientHeight <= MaxLength && clientWidth <= MaxLength) {
          const { tempWidth, tempHeight } = calculateSize(clientHeight, clientWidth, naturalHeight, naturalWidth, RATIO, MaxLength)
          const { top, left } = calculatePosition(e, tempWidth, clientWidth, body)

          div.style.cssText = `display:block;width:${tempWidth + 32}px;left:${left}px;top:${top}px`
          div.innerHTML = `<img src="${img.src}" style="height:${tempHeight}px;width:${tempWidth}px" onerror="this.classList.add('error')"><p>${alt.trim().replace(/\s+/g, ' ').replace(/ /g, '<br>')}</p>`
        }
      }, 300)
    }) as EventListener)

    target.addEventListener('pointerout', ((e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'IMG') return
      clearTimeout(owoTime)
      div.style.display = 'none'
    }) as EventListener)

    function calculateSize(
      clientHeight: number,
      clientWidth: number,
      naturalHeight: number,
      naturalWidth: number,
      ratio: number,
      maxLength: number
    ): { tempWidth: number, tempHeight: number } {
      const zoomHeight = clientHeight * ratio
      const zoomWidth = clientWidth * ratio
      const constrainedHeight = Math.min(zoomHeight, maxLength, Math.max(clientHeight, naturalHeight))
      const constrainedWidth = Math.min(zoomWidth, maxLength, Math.max(clientWidth, naturalWidth))
      const aspectRatio = constrainedWidth / constrainedHeight
      const tempWidth = aspectRatio >= 1
        ? Math.min(constrainedWidth, maxLength)
        : Math.min((constrainedWidth * maxLength) / constrainedHeight, constrainedWidth)
      const tempHeight = aspectRatio < 1
        ? Math.min(constrainedHeight, maxLength)
        : Math.min((constrainedHeight * maxLength) / constrainedWidth, constrainedHeight)
      return { tempWidth, tempHeight }
    }

    function calculatePosition(
      e: MouseEvent,
      tempWidth: number,
      clientWidth: number,
      bodyElement: HTMLElement
    ): { top: number, left: number } {
      const top = e.clientY - e.offsetY
      let left = e.clientX - e.offsetX - (tempWidth - clientWidth) / 2
      left = Math.max(10, Math.min(left, bodyElement.clientWidth - tempWidth - 10))
      return { top, left }
    }
  }

  handleImageLoadFailure(target: Node) {
    target.addEventListener('error', e => {
      const elem = e.target as any;
      if (elem?.tagName.toLowerCase() === 'img') {
        elem.classList.add('error');
        if(elem?.alt === '' && elem.getAttribute('atk-emoticon') !== null) {
          elem.alt = '表情加载失败'
        }
        const parent = elem.parentElement;
        if (parent && parent.classList.contains('loading-spinner-wrapper')) {
          parent.replaceWith(elem);
        }
      }
    }, true)
  }

  lazyLoadImages(target: Node) {
    const loadImg = (img: Element) => {
      const dataSrc = img.getAttribute('data-src');
      if (!dataSrc) return;
      img.setAttribute('src', dataSrc);
      if (img.parentElement?.classList.contains('loading-spinner-wrapper')) {
        (img as HTMLElement).onload = () => {
          img.parentElement?.classList.contains('loading-spinner-wrapper') && img.parentElement!.replaceWith(img);
        };
      }
    };

    const wrapImgWithSpinner = (img: Element) => {
      if (!img.getAttribute('data-src')) return;
      if (img.parentElement?.classList.contains('loading-spinner-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'loading-spinner-wrapper';
      wrapper.innerHTML = '<div class="loading-spinner"></div>';
      img.parentNode?.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    };

    const processImg = (img: Element) => {
      wrapImgWithSpinner(img);
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      ioObserver.observe(img);
    };

    if (!('IntersectionObserver' in window)) return;

    const ioObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          loadImg(img);
          observer.unobserve(img);
        }
      });
    });

    if (target instanceof HTMLElement) {
      target.querySelectorAll('img').forEach(processImg);
    }

    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            node.querySelectorAll('img').forEach(processImg);
          }
        });
      });
    });

    mutationObserver.observe(target, { childList: true, subtree: true });
  }
}

export default Context
