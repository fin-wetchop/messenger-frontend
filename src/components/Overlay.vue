<script lang="ts" setup>
import { $mc } from '@/utils/style'
</script>

<template>
  <div :class="$mc('root')">
    <div :class="$mc('content')">
      <slot />
    </div>
    <div :class="$mc('cover')">
      <slot name="cover" />
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
}

.content {
  width: 100%;
  height: 100%;
}

.cover {
  position: absolute;
  
  width: 100%;
  height: 100%;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;

  & > * {
    pointer-events: all;
  }
}
</style>
