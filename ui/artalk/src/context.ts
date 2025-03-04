import type {
  ArtalkConfig,
  CommentData,
  ListFetchParams,
  ContextApi,
  EventPayloadMap,
  SidebarShowPayload,
} from '@/types'
import type { TInjectedServices } from './service'
import { Api, ApiHandlers } from './api'

import * as marked from './lib/marked'
import { mergeDeep } from './lib/merge-deep'
import { CheckerCaptchaPayload, CheckerPayload } from './components/checker'

import { DataManager } from './data'
import * as I18n from './i18n'

import EventManager from './lib/event-manager'
import { convertApiOptions, createNewApiHandlers, handelCustomConf } from './config'
import { watchConf } from './lib/watch-conf'

// Auto dependency injection
interface Context extends TInjectedServices {}

/**
 * Artalk Context
 */
class Context implements ContextApi {
  /* 运行参数 */
  conf: ArtalkConfig
  data: DataManager
  $root: HTMLElement

  /* Event Manager */
  private events = new EventManager<EventPayloadMap>()
  private mounted = false

  constructor(conf: ArtalkConfig) {
    this.conf = conf

    this.$root = conf.el as HTMLElement
    this.$root.classList.add('artalk')
    this.$root.innerHTML = ''

    this.data = new DataManager(this.events)

    this.on('mounted', () => {
      this.mounted = true
    })
  }

  inject(depName: string, obj: any) {
    this[depName] = obj
  }

  get(depName: string) {
    return this[depName]
  }

  getApi() {
    return new Api(convertApiOptions(this.conf, this))
  }

  private apiHandlers = <ApiHandlers | null>null
  getApiHandlers() {
    if (!this.apiHandlers) this.apiHandlers = createNewApiHandlers(this)
    return this.apiHandlers
  }

  getData() {
    return this.data
  }

  replyComment(commentData: CommentData, $comment: HTMLElement): void {
    this.editor.setReply(commentData, $comment)
  }

  editComment(commentData: CommentData, $comment: HTMLElement): void {
    this.editor.setEditComment(commentData, $comment)
  }

  fetch(params: Partial<ListFetchParams>): void {
    this.data.fetchComments(params)
  }

  reload(): void {
    this.data.fetchComments({ offset: 0 })
  }

  /* List */
  listGotoFirst(): void {
    this.events.trigger('list-goto-first')
  }

  getCommentNodes() {
    return this.list.getCommentNodes()
  }

  getComments() {
    return this.data.getComments()
  }

  getCommentList = this.getCommentNodes
  getCommentDataList = this.getComments

  /* Editor */
  editorShowLoading(): void {
    this.editor.showLoading()
  }

  editorHideLoading(): void {
    this.editor.hideLoading()
  }

  editorShowNotify(msg, type): void {
    this.editor.showNotify(msg, type)
  }

  editorResetState(): void {
    this.editor.resetState()
  }

  /* Sidebar */
  showSidebar(payload?: SidebarShowPayload): void {
    this.sidebarLayer.show(payload)
  }

  hideSidebar(): void {
    this.sidebarLayer.hide()
  }

  /* Checker */
  checkAdmin(payload: CheckerPayload): Promise<void> {
    return this.checkerLauncher.checkAdmin(payload)
  }

  checkCaptcha(payload: CheckerCaptchaPayload): Promise<void> {
    return this.checkerLauncher.checkCaptcha(payload)
  }

  /* Events */
  on(name: any, handler: any) {
    this.events.on(name, handler)
  }

  off(name: any, handler: any) {
    this.events.off(name, handler)
  }

  trigger(name: any, payload?: any) {
    this.events.trigger(name, payload)
  }

  /* i18n */
  $t(key: I18n.I18nKeys, args: { [key: string]: string } = {}): string {
    return I18n.t(key, args)
  }

  setDarkMode(darkMode: boolean | 'auto'): void {
    this.updateConf({ darkMode })

    const owoShow = document.querySelector('#owo-big')
    if (this.conf.darkMode) owoShow?.classList.add('atk-dark-mode')
    else owoShow?.classList.remove('atk-dark-mode')
  }

  updateConf(nConf: Partial<ArtalkConfig>): void {
    this.conf = mergeDeep(this.conf, handelCustomConf(nConf, false))
    this.mounted && this.events.trigger('updated', this.conf)
  }

  getConf(): ArtalkConfig {
    return this.conf
  }

  getEl(): HTMLElement {
    return this.$root
  }

  getMarked() {
    return marked.getInstance()
  }

  watchConf<T extends (keyof ArtalkConfig)[]>(
    keys: T,
    effect: (conf: Pick<ArtalkConfig, T[number]>) => void,
  ): void {
    watchConf(this, keys, effect)
  }

  /** 表情包放大 */
  showOwoBig(target: Node) {
    const RATIO = 2;
    const MaxLength = 200;
    const body = document.querySelector('body') || document.createElement('body');
    let div = document.querySelector('#owo-big') as HTMLElement;

    if (!div) {
      div = document.createElement('div');
      div.id = 'owo-big';
      body.appendChild(div);
    }

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          const element = node as HTMLElement;

          if (shouldEnlarge(element)) {
            setupHoverEffects(element);
          }
        });
      });
    });

    observer.observe(target, { subtree: true, childList: true });

    function shouldEnlarge(element: HTMLElement): boolean {
      return element.classList?.contains('atk-grp')
        || element.classList?.contains('atk-comment-wrap')
        || !!element.attributes?.['atk-emoticon']
        || !!element.querySelector?.('img[atk-emoticon]');
    }

    function setupHoverEffects(element: HTMLElement) {
      let flag = true;
      let owoTime: number;
      element.addEventListener('pointerover', (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;

        const imgElement = e.target as HTMLImageElement;
        if (flag && imgElement.tagName === 'IMG' && imgElement.hasAttribute('atk-emoticon')) {
          flag = false;
          owoTime = window.setTimeout(() => {
            const alt = imgElement.getAttribute("notitle") === "true" ? '' : imgElement.alt || '';
            const { clientHeight, clientWidth, naturalHeight, naturalWidth } = imgElement;

            if (clientHeight <= MaxLength && clientWidth <= MaxLength) {
              const { tempWidth, tempHeight } = calculateSize(clientHeight, clientWidth, naturalHeight, naturalWidth, RATIO, MaxLength);
              const { top, left } = calculatePosition(e, tempWidth, clientWidth, body);

              div.style.cssText = `
                display: block;
                width: ${tempWidth + 32}px; // div padding: 16px;
                left: ${left}px;
                top: ${top}px;
              `;
              div.innerHTML = `
                <img src="${imgElement.src}" style="height: ${tempHeight}px;width: ${tempWidth}px" onerror="this.classList.add('error')">
                <p>${alt.trim().replace(/\s+/g, ' ').replace(/ /g, '<br>')}</p>
              `;
            }
          }, 300);
        }
      });

      element.addEventListener('pointerout', () => {
        flag = true;
        div.style.display = 'none';
        clearTimeout(owoTime);
      });
    }

    function calculateSize(
      clientHeight: number,
      clientWidth: number,
      naturalHeight: number,
      naturalWidth: number,
      ratio: number,
      maxLength: number
    ): { tempWidth: number, tempHeight: number } {
      const zoomHeight = clientHeight * ratio;
      const zoomWidth = clientWidth * ratio;
      const constrainedHeight = Math.min(zoomHeight, maxLength, Math.max(clientHeight, naturalHeight));
      const constrainedWidth = Math.min(zoomWidth, maxLength, Math.max(clientWidth, naturalWidth));
      const aspectRatio = constrainedWidth / constrainedHeight;
      const tempWidth = aspectRatio >= 1
        ? Math.min(constrainedWidth, maxLength)
        : Math.min((constrainedWidth * maxLength) / constrainedHeight, constrainedWidth);
      const tempHeight = aspectRatio < 1
        ? Math.min(constrainedHeight, maxLength)
        : Math.min((constrainedHeight * maxLength) / constrainedWidth, constrainedHeight);
      return { tempWidth, tempHeight };
    }

    function calculatePosition(
      e: MouseEvent,
      tempWidth: number,
      clientWidth: number,
      bodyElement: HTMLElement
    ): { top: number, left: number } {
      const top = e.clientY - e.offsetY;
      let left = e.clientX - e.offsetX - (tempWidth - clientWidth) / 2;
      left = Math.max(10, Math.min(left, bodyElement.clientWidth - tempWidth - 10));
      return { top, left };
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
      if (dataSrc) {
        img.setAttribute('src', dataSrc);
        (img as HTMLElement).onload = () => {
          const parent = img.parentElement;
          if (parent && parent.classList.contains('loading-spinner-wrapper')) {
            parent.replaceWith(img);
          }
        };
      }
    };

    const wrapImgWithSpinner = (img: Element) => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        const wrapper = document.createElement('div');
        wrapper.className = 'loading-spinner-wrapper';
        wrapper.innerHTML = '<div class="loading-spinner"></div>';
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }
    };

    if ('IntersectionObserver' in window) {
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
        const initialImgs = target.querySelectorAll('img');
        initialImgs.forEach(img => {
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          if (!img.parentElement?.classList.contains('loading-spinner-wrapper')) {
            wrapImgWithSpinner(img);
          }
          ioObserver.observe(img);
        });
      }

      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              const imgs = node.querySelectorAll('img');
              imgs.forEach(img => {
                if (!img.hasAttribute('loading')) {
                  img.setAttribute('loading', 'lazy');
                }
                if (!img.parentElement?.classList.contains('loading-spinner-wrapper')) {
                  wrapImgWithSpinner(img);
                }
                ioObserver.observe(img);
              });
            }
          });
        });
      });

      mutationObserver.observe(target, { childList: true, subtree: true });
    }
  }
  
}

export default Context
