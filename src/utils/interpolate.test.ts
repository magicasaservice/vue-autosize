import { describe, it } from 'vitest'
import { interpolate } from './interpolate'
import { linear } from './easings'

describe('interpolate', () => {
  it('should land on the target with a duration of zero', async ({
    expect,
  }) => {
    const values: number[] = []

    interpolate({
      from: 0,
      to: 100,
      duration: 0,
      easing: linear,
      callback: (value) => values.push(value),
    })

    await expect.poll(() => values.at(-1), { timeout: 200 }).toBe(100)
    expect(values.every((value) => !isNaN(value))).toBe(true)
    expect(values.length).toBe(1)
  })

  it('should land on the target with a negative duration', async ({
    expect,
  }) => {
    const values: number[] = []

    interpolate({
      from: 0,
      to: 100,
      duration: -10,
      easing: linear,
      callback: (value) => values.push(value),
    })

    await expect.poll(() => values.at(-1), { timeout: 200 }).toBe(100)
  })

  it('should land on the target with a duration of one', async ({ expect }) => {
    const values: number[] = []

    interpolate({
      from: 0,
      to: 100,
      duration: 1,
      easing: linear,
      callback: (value) => values.push(value),
    })

    await expect.poll(() => values.at(-1), { timeout: 500 }).toBe(100)
    expect(values.every((value) => !isNaN(value))).toBe(true)
  })

  it('should interpolate over a regular duration', async ({ expect }) => {
    const values: number[] = []

    interpolate({
      from: 0,
      to: 100,
      duration: 150,
      easing: linear,
      callback: (value) => values.push(value),
    })

    await expect.poll(() => values.at(-1), { timeout: 500 }).toBe(100)
    expect(values.length).toBeGreaterThan(1)
  })
})
