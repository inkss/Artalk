import PlugKit from './_kit';
import EditorPlug from './_plug'
import * as Utils from '@/lib/utils'
import $t from '@/i18n'

export default class Refresh extends EditorPlug {

  constructor(kit: PlugKit) {
    super(kit);

    const iconHtml = Utils.htmlDecode($t('refresh'))
    const iconLabel = iconHtml.replace(/<[^>]*>/g, '').trim() || 'Refresh'
    const $btn = this.useBtn('')
    $btn.innerHTML = `<span role="img" aria-label="${iconLabel}">${iconHtml}</span>`

    $btn.onclick = () => {
      kit.useData().fetchComments({ offset: 0 })
    }
  }
}