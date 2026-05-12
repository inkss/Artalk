import { getEnabledPlugs } from './editor'
import EditorPlug from './editor/_plug'
import PlugKit from './editor/_kit'
import Emoticons from './editor/emoticons'
import Preview from './editor/preview'
import type { EditorApi, ArtalkPlugin } from '@/types'
import EventManager from '@/lib/event-manager'

export interface EditorEventPayloadMap {
  mounted: undefined
  unmounted: undefined
  'header-input': { field: string; $input: HTMLInputElement }
  'header-change': { field: string; $input: HTMLInputElement }
  'content-updated': string
  'panel-show': EditorPlug
  'panel-hide': EditorPlug
  'panel-close': undefined

  'editor-close': undefined
  'editor-open': undefined
}

export const EditorKit: ArtalkPlugin = (ctx) => {
  const editor = ctx.get('editor')

  const editorPlugs = new PlugManager(editor)
  ctx.inject('editorPlugs', editorPlugs)
}

export class PlugManager {
  private plugs: EditorPlug[] = []
  private openedPlug: EditorPlug | null = null
  private events = new EventManager<EditorEventPayloadMap>()

  getPlugs() {
    return this.plugs
  }
  getEvents() {
    return this.events
  }

  private clear() {
    this.plugs = []
    this.events = new EventManager()
    if (this.openedPlug) this.closePlugPanel()
  }

  constructor(public editor: EditorApi) {
    let confLoaded = false // config not loaded at first time
    this.editor.ctx.watchConf(
      ['imgUpload', 'emoticons', 'preview', 'editorTravel', 'locale'],
      (conf) => {
        // trigger unmount event will call all plugs' unmount function
        // (this will only be called while conf reloaded, not be called at first time)
        confLoaded && this.getEvents().trigger('unmounted')

        // reset the plugs
        this.clear()

        // init the all enabled plugs
        getEnabledPlugs(conf).forEach((Plug) => {
          // create the plug instance
          const kit = new PlugKit(this)
          this.plugs.push(new Plug(kit))
        })

        // trigger event for plug initialization
        this.getEvents().trigger('mounted')
        confLoaded = true

        // refresh the plug UI
        this.loadPluginUI()
      },
    )

    this.events.on('panel-close', () => this.closePlugPanel())
  }

  private loadPluginUI() {
    // handle ui, clear and reset the plug btns and plug panels
    this.editor.getUI().$plugPanelWrap.innerHTML = ''
    this.editor.getUI().$plugPanelWrap.style.display = 'none'
    this.editor.getUI().$plugBtnWrap.innerHTML = ''
    // 清理独立面板
    this.editor.getUI().$plugPanelWrap.parentElement
      ?.querySelectorAll('.atk-editor-plug-preview')
      .forEach((el) => el.remove())

    // load the plug UI
    this.plugs.forEach((plug) => this.loadPluginItem(plug))
  }

  /** Load the plug btn and plug panel on editor ui */
  private loadPluginItem(plug: EditorPlug) {
    const $btn = plug.$btn
    if (!$btn) return
    this.editor.getUI().$plugBtnWrap.appendChild($btn)

    // 独立面板由插件自己管理点击事件
    if (plug.independentPanel) {
      const $panel = plug.$panel
      if ($panel) {
        $panel.style.display = 'none'
        // 独立面板插入到 $plugPanelWrap 之后，不受其 display 影响
        this.editor.getUI().$plugPanelWrap.after($panel)
      }
      $btn.onclick = () => {
        // 独立面板由插件自己管理 toggle
        if (plug instanceof Preview) {
          (plug as Preview).toggle()
        }
      }
      return
    }

    // bind the event when click plug btn
    !$btn.onclick &&
      ($btn.onclick = () => {
        // if the plug is not the same as the openedPlug,
        if (plug !== this.openedPlug) {
          // then open the plug current clicked plug panel
          this.openPlugPanel(plug)

          // add active class for current plug panel
          $btn.classList.add('active')
        } else {
          // then close the plug
          this.closePlugPanel()
        }
      })

    // initialization of plug panel
    const $panel = plug.$panel
    if ($panel) {
      $panel.style.display = 'none'
      this.editor.getUI().$plugPanelWrap.appendChild($panel)
    }
  }

  get<T extends typeof EditorPlug>(plug: T) {
    return this.plugs.find((p) => p instanceof plug) as InstanceType<T> | undefined
  }

  /** Open the editor plug panel */
  openPlugPanel(plug: EditorPlug) {
    this.plugs.forEach((aPlug) => {
      const plugPanel = aPlug.$panel
      if (!plugPanel) return

      if (aPlug === plug) {
        plugPanel.style.display = ''
        this.events.trigger('panel-show', plug)
      } else if (!aPlug.independentPanel) {
        plugPanel.style.display = 'none'
      }
    })

    this.editor.getUI().$plugPanelWrap.style.display = ''
    this.openedPlug = plug

    window.setTimeout(() => {
      if(plug instanceof Emoticons) {
        // 为表情弹窗添加关闭事件监听
        document.addEventListener('click', () => {
          this.closePlugPanel()
        }, { once: true })
      }
    }, 100)
  }

  /** Close the editor plug panel */
  closePlugPanel() {
    if (!this.openedPlug) return

    this.editor.getUI().$plugPanelWrap.style.display = 'none'
    this.events.trigger('panel-hide', this.openedPlug)
    // 只移除被关闭面板对应按钮的高亮
    if (this.openedPlug.$btn) this.openedPlug.$btn.classList.remove('active')
    this.openedPlug = null
  }

  /** Get the content which is transformed by plugs */
  getTransformedContent(rawContent: string) {
    let result = rawContent
    this.plugs.forEach((aPlug) => {
      if (!aPlug.contentTransformer) return
      result = aPlug.contentTransformer(result)
    })
    return result
  }
}
