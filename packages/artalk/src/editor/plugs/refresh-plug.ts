import EditorPlug from "@/editor/plugs/editor-plug";
import Editor from "@/editor";

export default class RefreshPlug extends EditorPlug {
  public static Name = 'refresh'

  public constructor(editor: Editor) {
    super(editor);

    const $btn = this.registerBtn(`${this.ctx.$t('refresh')}`)

    $btn.onclick = () => {
      this.ctx.listReload()
    }

  }

}
