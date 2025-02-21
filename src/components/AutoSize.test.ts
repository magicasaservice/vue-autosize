import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { default as AutoSize } from './AutoSize.vue'

describe('AutoSize', () => {
  it('should render element correctly', () => {
    const wrapper = mount(AutoSize)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('should resize according to child', async () => {
    const wrapper = mount(AutoSize, {
      slots: {
        default: `
        <div style="{width: '100px', height: '100px', padding: '2rem'}" />
        `,
      },
    })

    setTimeout(() => {
      const element = wrapper.find('div')
      expect(element.attributes('style')).toBe(
        '--auto-size-width: 100px; --auto-size-height: 100px;'
      )
    }, 500)
  })
})
