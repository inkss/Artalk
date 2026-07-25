import { marked, Tokens } from 'marked'
import { renderCode } from './highlight'
import type { Config } from '@/types'

export interface RendererOptions {
  imgLazyLoad: Config['imgLazyLoad']
}

export function getRenderer(options: RendererOptions) {
  const renderer = new marked.Renderer()
  renderer.link = markedLinkRenderer(renderer, renderer.link)
  renderer.code = markedCodeRenderer()
  renderer.image = markedImageRenderer(renderer, renderer.image, options)
  return renderer
}

const markedLinkRenderer =
  (renderer: any, orgLinkRenderer: (args: Tokens.Link) => string) => (args: Tokens.Link) => {
    const getLinkOrigin = (link: string) => {
      try {
        return new URL(link).origin
      } catch {
        return ''
      }
    }
    const isSameOriginLink = getLinkOrigin(args.href) === window.location.origin
    const html = orgLinkRenderer.call(renderer, args)

    // 外部链接经由中转页跳转
    const { href } = args
    const myWebName = 'inkss.cn'
    let newHref = href
    if (window.location.hostname === myWebName && getLinkOrigin(href) !== `https://${myWebName}`) {
      newHref = `https://inkss.cn/link.html?target=${href}`
    }

    return html
      .replace(
        /^<a /,
        `<a target="_blank" ${!isSameOriginLink ? `rel="noreferrer noopener nofollow ugc"` : ''} `,
      )
      .replace(href, newHref)
  }

const markedCodeRenderer =
  () =>
  ({ lang, text }: Tokens.Code): string => {
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

const markedImageRenderer =
  (
    renderer: any,
    orgImageRenderer: (args: Tokens.Image) => string,
    { imgLazyLoad }: RendererOptions,
  ) =>
  (args: Tokens.Image): string => {
    const html = orgImageRenderer.call(renderer, args)
    // 图片懒加载（自定义：始终使用 data-src，由 lazyLoadImages 统一处理）
    return html.replace('src=', 'data-src=')
  }
