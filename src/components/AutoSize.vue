<template>
  <div
    ref="elRef"
    class="auto-size"
    :style="{
      '--auto-size-width': mappedSize?.width,
      '--auto-size-height': mappedSize?.height,
      width: 'var(--auto-size-width)',
      height: 'var(--auto-size-height)',
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useResizeObserver, useMutationObserver } from '@vueuse/core'
import { interpolate } from '../utils/interpolate'
import { easeOutQuad } from '../utils/easings'

interface MagicAutoSizeProps {
  width?: boolean
  height?: boolean
  duration?: number
  easing?: (t: number) => number
}

const {
  width = true,
  height = true,
  duration = 150,
  easing = easeOutQuad,
} = defineProps<MagicAutoSizeProps>()

const elRef = ref<HTMLElement | undefined>(undefined)

const size = reactive({
  width: 0,
  height: 0,
})

const interpolated = reactive({
  width: 0,
  height: 0,
})

const content = ref<HTMLElement | undefined>(undefined)

const mappedSize = computed(() => {
  if (size) {
    switch (true) {
      case width && height:
        console.log('width:', interpolated.width)
        console.log('height:', interpolated.height)
        return {
          width: `${interpolated.width}px`,
          height: `${interpolated.height}px`,
        }
      case width:
        return {
          width: `${interpolated.width}px`,
        }
      case height:
        return {
          height: `${interpolated.height}px`,
        }
      default:
        return undefined
    }
  } else {
    return undefined
  }
})

const padding = computed(() => {
  if (elRef.value) {
    const style = getComputedStyle(elRef.value, null)
    const top = parseFloat(style.getPropertyValue('padding-top'))
    const left = parseFloat(style.getPropertyValue('padding-left'))
    const right = parseFloat(style.getPropertyValue('padding-right'))
    const bottom = parseFloat(style.getPropertyValue('padding-bottom'))
    return { x: right + left, y: top + bottom }
  } else {
    return { x: 0, y: 0 }
  }
})

const child = computed(() => {
  return Array.from(elRef.value?.childNodes ?? []).find(
    (n) => n instanceof HTMLElement
  )
})

useMutationObserver(
  elRef,
  (mutations) => {
    const addedNode = mutations
      .flatMap((m) => [...m.addedNodes])
      .find((n) => n instanceof HTMLElement)

    const addedComment = mutations
      .flatMap((m) => [...m.addedNodes])
      .find((n) => n instanceof Comment)

    if (!!addedNode && addedNode instanceof HTMLElement) {
      content.value = addedNode
    }

    // Reset the size when a comment is added and no children are present
    // Vue sets a placeholder comment for a v-if
    if (!!addedComment && !child.value) {
      content.value = undefined

      size.width = 0
      size.height = 0
    }

    // If the node is removed, reset the size
    if (!child.value) {
      content.value = undefined

      size.width = 0
      size.height = 0
    }
  },
  {
    childList: true,
    subtree: true,
  }
)

useResizeObserver(content, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  console.log('height:', height)

  size.width = width + padding.value.x
  size.height = height + padding.value.y
})

onMounted(() => {
  if (elRef.value) {
    const elements = elRef.value.querySelectorAll('*')
    const filtered = Array.from(elements).find(
      (node) => node instanceof HTMLElement
    )

    if (!!filtered && filtered instanceof HTMLElement) {
      content.value = filtered
      size.width = filtered.offsetWidth + padding.value.x
      size.height = filtered.offsetHeight + padding.value.y
    } else {
      size.width = 0
      size.height = 0
    }

    // Skip animation, check against NaN
    widthCallback(size.width)
    heightCallback(size.height)
  }
})

function widthCallback(value: number) {
  if (!isNaN(value)) {
    interpolated.width = value
  }
}

function heightCallback(value: number) {
  if (!isNaN(value)) {
    interpolated.height = value
  }
}

watch(
  () => size.width,
  (value) => {
    if (value !== interpolated.width) {
      interpolate({
        from: interpolated.width,
        to: value,
        duration: duration,
        easing: easing,
        callback: widthCallback,
      })
    }
  }
)

watch(
  () => size.height,
  (value) => {
    if (value !== interpolated.width) {
      interpolate({
        from: interpolated.height,
        to: value,
        duration: duration,
        easing: easing,
        callback: heightCallback,
      })
    }
  }
)
</script>
