# Vue Autosize

Autosize is a component that automatically interpolates its size to its child’s size.

## 📦 Install

```sh
pnpm install @maas/vue-autosize
```

## 🚀 Usage

```vue
<script setup>
import { AutoSize } from '@maas/vue-autosize'
</script>

<template>
  <auto-size>
    <!-- your content -->
  </auto-size>
</template>
```

> [!IMPORTANT]
> The component’s children need to be either given a fixed width or rendered as `inline`, `inline-block`, or `inline-flex` elements.

## ✅ Peer Dependencies

If you haven’t installed the required peer dependencies automatically, you’ll need to install the following packages manually to use the component.

```sh
pnpm install @vueuse/core vue
```

## 🐛 Found a Bug?

If you see something that doesn’t look right, [submit a bug report](https://github.com/magicasaservice/vue-autosize/issues/new?assignees=&labels=bug%2Cpending+triage&template=bug_report.yml). See it. Say it. Sorted.

## 📄 License

[MIT License](https://github.com/magicasaservice/vue-autosize/blob/main/LICENSE) © 2025-PRESENT [Magic as a Service GmbH](https://github.com/magicasaservice)
