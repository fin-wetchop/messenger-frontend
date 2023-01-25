type RequireContext = __WebpackModuleApi.RequireContext
type ContextCallback = (module: any, path: string) => void

export function context (context: RequireContext, callback: ContextCallback) {
  const keys = context.keys()

  for (let key of keys)
  {
    const module = context(key)
    
    if (!module)
      continue

    callback(module, key)
  }
}

export default {
  context,
}
