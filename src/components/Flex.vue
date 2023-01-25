<script lang="ts" setup>
import { Property } from 'csstype'
import { $mc } from '@/utils/style'
import { computed, toRefs } from 'vue'

interface Props {
  dir?: Property.FlexDirection
  wrap?: Property.FlexWrap
  gap?: Property.Gap
  align?: Property.AlignItems
  justify?: Property.JustifyContent

  maxedWidth?: boolean
  maxedHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dir: 'row',
  wrap: 'unset',
  gap: 0,
  align: 'unset',
  justify: 'unset',

  maxedWidth: false,
  maxedHeight: false,
})

const { dir, wrap, gap, align, justify, maxedWidth, maxedHeight } = toRefs(props)

const width = computed(() => maxedWidth.value ? '100%' : undefined)
const height = computed(() => maxedHeight.value ? '100%' : undefined)
</script>

<template>
  <div :class="$mc('root')">
    <slot />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  
  width: v-bind(width);
  height: v-bind(height);

  flex-direction: v-bind(dir);
  flex-wrap: v-bind(wrap);
  
  gap: v-bind(gap);

  align-items: v-bind(align);
  justify-content: v-bind(justify);

  & > * {
    flex: 1 0 0%;
  }
}
</style>
