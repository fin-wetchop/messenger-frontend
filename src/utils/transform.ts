import { set, get, cloneDeep, camelCase, snakeCase, merge } from 'lodash'

const pathMatch = /^((?:.(?!(?:[^.]+)?$))+)?\.?(.+$)?/im

export type Data = Record<string, any>

abstract class Transformation {
  abstract process (data: Data): Data
}

class KeysToTransformation extends Transformation {
  type = 'camelCase'
  
  constructor (type: 'camel-case' | 'snake-case') {
    super()

    this.type = type
  }
  
  process (data: Data) {
    const transformFunc = this.type == 'camel-case'
      ? camelCase
      : this.type == 'snake-case'
        ? snakeCase
        : (key: any) => key

    Object.keys(data).forEach(key => {
      let value = data[key]

      if (typeof value === 'object' && value && !Array.isArray(value)) {
        value = this.process(value)
      }

      delete data[key]

      data[transformFunc(key)] = value
    })

    return data
  }
}

class DeliveryTransformation extends Transformation {
  type: 'move' | 'copy' | '' = ''
  from: string = ''
  to: string = ''

  constructor (type: 'move' | 'copy', from: string, to: string = '') {
    super()

    this.type = type
    this.from = from
    this.to = to
  }

  process (data: Data) {
    const [ _, orderPath, orderNode ] = pathMatch.exec(this.from)!.map(node => node ?? '')
    const order = orderPath == '' ? data : get(data, orderPath)

    if (!orderNode || !order) {
      return data
    }

    const destination = this.to == '' ? data : get(data, this.to)

    if (!destination) {
      set(data, this.to, order[orderNode])
    } else {
      merge(destination, order[orderNode])
    }

    if (this.type == 'move') {
      delete order[orderNode]
    }

    return data
  }
}

class DeleteTransformation extends Transformation {
  paths: string[] = [ ]

  constructor (paths: string | string[]) {
    super()

    if (typeof paths === 'string') {
      paths = [ paths ]
    }

    this.paths = paths
  }

  process (data: Data) {
    this.paths.forEach(path => {
      const [ _, orderPath, orderNode ] = pathMatch.exec(path)!.map(node => node ?? '')
      const order = orderPath == '' ? data : get(data, orderPath)

      if (!orderNode || !order) {
        return data
      }

      delete order[orderNode]
    })

    return data
  }
}

class OnlyTransformation extends Transformation {
  paths: string[] = [ ]

  constructor (paths: string | string[]) {
    super()

    if (typeof paths === 'string') {
      paths = [ paths ]
    }

    this.paths = paths
  }

  process (data: Data) {
    return this.paths.reduce((accumulator, path) => {
      set(accumulator, path, get(data, path))

      return accumulator
    }, { })
  }
}

class ApplyTransformation extends Transformation {
  path: string = ''
  transformer: Transformer | Transformer["process"] | null = null

  constructor (path: string, transformer: Transformer | Transformer["process"]) {
    super()

    if (!(transformer instanceof Transformer) && typeof transformer !== 'function') {
      throw new Error('Second ApplyTransformation constructor argument must be instance of Transformer or function.')
    }

    this.path = path
    this.transformer = transformer
  }

  process (data: Data) {
    let processData = get(data, this.path)

    if (!processData) {
      return data
    }

    processData = this.transformer instanceof Transformer
      ? this.transformer.process(processData)
      : this.transformer?.call(null, processData)

    set(data, this.path, processData)

    return data
  }
}

class DefaultTransformation extends Transformation {
  path: string = ''
  value: (() => any) | any = null

  constructor (path: string, value: (() => any) | any) {
    super()

    this.path = path
    this.value = value
  }

  process (data: Data) {
    if (get(data, this.path) != null) {
      return data
    }

    set(data, this.path, typeof this.value === 'function' ? this.value() : this.value)

    return data
  }
}

export default class Transformer {
  #transformations: Transformation[] = [ ]

  keysTo (type: 'camel-case' | 'snake-case') {
    this.#transformations.push(
      new KeysToTransformation(type)
    )

    return this
  }

  move (from: string, to?: string) {
    this.#transformations.push(
      new DeliveryTransformation('move', from, to)
    )

    return this
  }

  copy (from: string, to: string) {
    this.#transformations.push(
      new DeliveryTransformation('copy', from, to)
    )

    return this
  }

  delete (path: string) {
    this.#transformations.push(
      new DeleteTransformation(path)
    )
    
    return this
  }

  only (paths: string | string[]) {
    this.#transformations.push(
      new OnlyTransformation(paths)
    )

    return this
  }

  apply (path: string, transformer: Transformer | Transformer["process"]) {
    this.#transformations.push(
      new ApplyTransformation(path, transformer)
    )

    return this
  }

  default (path: string, value: any) {
    this.#transformations.push(
      new DefaultTransformation(path, value)
    )

    return this
  }

  process (data: Data) {
    data = cloneDeep(data)

    for (let transformation of this.#transformations) {
      data = transformation.process(data)
    }

    return data
  }
}
