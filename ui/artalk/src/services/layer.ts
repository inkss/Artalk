import type { ArtalkPlugin } from '@/types'
import { LayerManager } from '@/layer'

export const LayersService: ArtalkPlugin = (ctx) => {
  ctx.provide('layers', () => {
    const layerManager = new LayerManager()

    // 避免重复添加
    const className = layerManager.getEl().getAttribute('class') || 'atk-layer-wrap'
    if (!document.body.getElementsByClassName(className).length) {
      document.body.appendChild(layerManager.getEl())
    }
    ctx.on('unmounted', () => {
      layerManager?.destroy()
    })
    return layerManager
  })
}
