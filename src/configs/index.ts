import includer from '@/utils/includer'
import { set } from 'lodash'

export default function configs (path: string) {
  const nodes = path.split('.')

  let result = configs as any

  for (let index = 0; index < nodes.length; index++)
  {
    let key = nodes[index]

    result = result[key]

    if (typeof result !== 'object')
      return index == nodes.length - 1 ? result : undefined
  }

  return result
}

includer.context(
  require.context('./', true, /^\.\/(?!index).*\.(js|ts|json)$/i),
  (data, path) => {
    path = path
      .replace(/^\.\//, '')
      .replace(/\.\w+$/, '')
      .replace(/\/+/, '.')

      
    if (data.__esModule) {
      data = data.default
    }

    set(configs, path, data)
  }
)
