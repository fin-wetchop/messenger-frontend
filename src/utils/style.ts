import { useCssModule } from '@vue/runtime-dom'

export function $c(...args: (string | boolean)[])
{
  const classes = [ ]

  let prevClass = ""
  let shouldPush = false

  for (const argument of args)
  {
    if (typeof argument !== 'string')
    {
      shouldPush = argument

      continue
    }

    if (shouldPush)
      classes.push(prevClass)

    prevClass = argument
    shouldPush = true
  }

  if (shouldPush)
    classes.push(prevClass)

  return classes
}

export function $mc(...args: (string | boolean)[])
{
  const styles = useCssModule()
  
  return $c(...args).map(className => styles[className])
}
