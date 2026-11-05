export type InterpolateArgs = {
  from: number
  to: number
  duration: number
  easing?: (t: number) => number
  callback: (result: number) => void
}

// Returns a function that stops the run before it lands
export function interpolate(args: InterpolateArgs) {
  const { from, to, duration, callback, easing = (t) => t * (2 - t) } = args

  let frame: number

  function cancel() {
    cancelAnimationFrame(frame)
  }

  // Immediately execute if no valid duration is set.
  if (!(duration > 0)) {
    frame = requestAnimationFrame(() => callback(to))
    return cancel
  }

  let startTime: number

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp

    const progress = Math.min(1, (timestamp - startTime) / duration)
    const easedProgress = easing(progress)
    const value = from + (to - from) * easedProgress

    callback(value)

    if (progress < 1) {
      frame = requestAnimationFrame(animate)
    }
  }

  frame = requestAnimationFrame(animate)

  return cancel
}
