import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import { default as AutoSize } from './AutoSize.vue'

describe('AutoSize', () => {
  it('should render element correctly', ({ expect }) => {
    const wrapper = mount(AutoSize)
    expect(wrapper.find('.auto-size').exists()).toBe(true)
  })

  it('should resize according to child', async ({ expect }) => {
    const wrapper = mount(AutoSize, {
      attachTo: document.body,
      slots: {
        default: `
        <div style="width: 100px; height: 100px; background: red;" />
      `,
      },
    })

    const element = wrapper.find('.auto-size')
    const timeout = 500

    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-width: 100px')
    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-height: 100px')
  })

  it('should resize according to child and padding', async ({ expect }) => {
    const wrapper = mount(AutoSize, {
      attachTo: document.body,
      attrs: {
        style: {
          padding: '10px',
        },
      },
      slots: {
        default: `
        <div style="display: inline-block; width: 80px; height: 80px; background: green;" />
      `,
      },
    })

    const element = wrapper.find('.auto-size')
    const timeout = 500

    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-width: 100px')
    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-height: 100px')
  })

  it('should resize after a second child is added', async ({ expect }) => {
    const wrapper = mount(AutoSize, {
      attachTo: document.body,
      slots: {
        default: `
        <div style="display: inline-flex; flex-direction: column;">
          <div style="display: inline-block; width: 100px; height: 100px; background: blue;" />
        </div>
      `,
      },
    })

    const element = wrapper.find('.auto-size')
    const domElement = element.element

    await new Promise((resolve) => setTimeout(resolve, 100))

    mount(
      { template: '<div />' },
      {
        attachTo: domElement.firstElementChild ?? domElement,
        attrs: {
          style: {
            width: '100px',
            height: '50px',
            background: 'yellow',
          },
        },
      }
    )

    const timeout = 500

    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-width: 100px')
    await expect
      .poll(() => element.attributes('style'), { timeout })
      .toContain('--auto-size-height: 150px')
  })
})
