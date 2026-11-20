import './preview.scss'

import EditorPlugin from './_plug'
import type PlugKit from './_kit'
import * as Utils from '@/lib/utils'
import $t from '@/i18n'

export default class Preview extends EditorPlugin {
  private isPlugPanelShow = false

  constructor(kit: PlugKit) {
    super(kit)
    this.independentPanel = true

    this.kit.useMounted(() => {
      this.usePanel(`<div class="atk-editor-plug-preview"></div>`)

      // initialize plug button
      const iconHtml = Utils.htmlDecode($t('preview'))
      const iconLabel = iconHtml.replace(/<[^>]*>/g, '').trim() || 'Preview'
      const $btn = this.useBtn('')
      $btn.innerHTML = `<span role="img" aria-label="${iconLabel}">${iconHtml}</span>`
    })
    this.kit.useUnmounted(() => {})

    // function to update content
    this.kit.useEvents().on('content-updated', (content) => {
      this.isPlugPanelShow && this.updateContent()
    })

    // 评论提交后关闭预览
    this.kit.useEvents().on('editor-submitted', () => {
      this.isPlugPanelShow && this.toggle()
    })
  }

  updateContent() {
    this.$panel!.innerHTML = this.kit.useEditor().getContentMarked()
    this.$panel!.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
      img.src = img.dataset.src!
    })
  }

  toggle() {
    if (this.isPlugPanelShow) {
      this.isPlugPanelShow = false
      this.$panel!.style.display = 'none'
      this.$btn!.classList.remove('active')
    } else {
      this.isPlugPanelShow = true
      this.$panel!.style.display = ''
      this.$btn!.classList.add('active')
      this.updateContent()
    }
  }
}
