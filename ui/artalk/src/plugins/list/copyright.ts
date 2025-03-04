import type { ArtalkPlugin } from '@/types'
import { version as ARTALK_VERSION } from '~/package.json'

export const Copyright: ArtalkPlugin = (ctx) => {
  ctx.on('mounted', () => {
    const list = ctx.get('list')

    const $copyright = list.$el.querySelector<HTMLElement>('.atk-copyright')
    if (!$copyright) return

    const myWebName = window.location.hostname === 'inkss.cn' ? 'https://inkss.cn/link.html?target=' : ''

    $copyright.innerHTML =
      `Powered By <a href="${myWebName}https://artalk.js.org" ` +
      `target="_blank" title="Artalk v${ARTALK_VERSION}">` +
      `Artalk</a>`
  })
}
