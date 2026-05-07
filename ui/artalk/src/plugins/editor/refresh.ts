import PlugKit from './_kit';
import EditorPlug from './_plug'
import $t from '@/i18n'

export default class Refresh extends EditorPlug {

  constructor(kit: PlugKit) {
    super(kit);

    const btnText = $t('refresh');
    const $btn = this.useBtn(btnText);

    $btn.onclick = () => {
      kit.useEditor().ctx.reload()
    }
  }
}