import { marked as libMarked, Tokens } from 'marked'
import { renderCode } from './highlight'

export function getRenderer() {
  const renderer = new libMarked.Renderer()
  renderer.link = markedLinkRenderer(renderer, renderer.link)
  renderer.code = markedCodeRenderer()
  renderer.image = markedImageRenderer(renderer, renderer.image)
  return renderer
}

export const markedLinkRenderer =
  (renderer: any, orgLinkRenderer: (args: Tokens.Link) => string) =>
  (args: Tokens.Link): string => {
    const { href } = args
    const localLink = href?.startsWith(`${window.location.protocol}//${window.location.hostname}`)
    const html = orgLinkRenderer.call(renderer, args)
    const myWebName = 'inkss.cn'
    let newHref = href
    if (window.location.hostname === myWebName && new URL(href).hostname !== myWebName) {
      newHref = `https://inkss.cn/link.html?target=${href}`
    }
    return html
      .replace(/^<a /,`<a target="_blank" ${!localLink ? `rel="noreferrer noopener nofollow"` : ''} `,)
      .replace(href, newHref)
  }

export const markedCodeRenderer =
  () =>
  ({ text, lang }: Tokens.Code): string => {
    // Colorize the block only if the language is known to highlight.js
    const realLang = !lang ? 'plaintext' : lang
    let colorized = text
    if ((window as any).hljs) {
      if (realLang && (window as any).hljs.getLanguage(realLang)) {
        colorized = (window as any).hljs.highlight(realLang, text).value
      }
    } else {
      colorized = renderCode(text)
    }

    return (
      `<pre rel="${realLang}">\n` +
      `<code class="hljs language-${realLang}">${colorized.replace(/&amp;/g, '&')}</code>\n` +
      `</pre>`
    )
  }

// 图片懒加载
export const markedImageRenderer =
  (renderer: any, orgImageRenderer: (args: Tokens.Image) => string) =>
  (args: Tokens.Image): string => {
    const html = orgImageRenderer.call(renderer, args)
    return html.replace('src=', 'data-src=')
  }
