import * as Utils from '../../lib/utils'
import type Render from '../render'

/**
 * 评论头像界面
 */
export default function renderAvatar(r: Render) {
  const $avatar = r.$el.querySelector<HTMLElement>('.atk-avatar')!
  const $avatarImg = Utils.createElement<HTMLImageElement>('<img />')

  const avatarURLBuilder = r.opts.avatarURLBuilder
  // $avatarImg.src = avatarURLBuilder ? avatarURLBuilder(r.data) : r.comment.getGravatarURL()
  // 头像图片懒加载
  $avatarImg.setAttribute('data-src', avatarURLBuilder ? avatarURLBuilder(r.data) : r.comment.getGravatarURL());
  if (!$avatarImg.hasAttribute('loading')) {
    $avatarImg.setAttribute('loading', 'lazy');
  }

  if (r.data.link) {
    const $avatarA = Utils.createElement<HTMLLinkElement>(
      '<a target="_blank" rel="noreferrer noopener nofollow"></a>',
    )
    $avatarA.href = Utils.isValidURL(r.data.link) ? r.data.link : `https://${r.data.link}`
    const myWebName = 'inkss.cn'
    if (window.location.hostname === myWebName && new URL($avatarA.href).hostname !== myWebName) {
      $avatarA.href = `https://inkss.cn/link.html?target=${$avatarA.href}`
    }
    $avatarA.append($avatarImg)
    $avatar.append($avatarA)
  } else {
    $avatar.append($avatarImg)
  }
}
