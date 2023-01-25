<script lang="ts" setup>
import { Property } from 'csstype'
import { $mc } from '@/utils/style'
import { nextTick, onMounted, ref, toRefs, watch } from 'vue'

interface Props {
  x?: Property.OverflowX
  y?: Property.OverflowY
  xToEnd?: boolean
  yToEnd?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  x: 'hidden',
  y: 'hidden',
  xToEnd: false,
  yToEnd: false,
})

const { x, y, xToEnd, yToEnd } = toRefs(props)

const container = ref(null as any)

function scrollXToEnd (immediately: boolean = false) {
  if (immediately) {
    container.value.scrollLeft = container.value.scrollWidth
  
    return
  }

  nextTick(() => scrollXToEnd(true))
}

function scrollYToEnd (immediately: boolean = false) {
  if (immediately) {
    container.value.scrollTop = container.value.scrollHeight
  
    return
  }

  nextTick(() => scrollYToEnd(true))
}

watch(xToEnd, () => {
  if (xToEnd.value) {
    scrollXToEnd()
  }
})

watch(yToEnd, () => {
  if (yToEnd.value) {
    scrollYToEnd()
  }
})

onMounted(() => {
  if (xToEnd.value) {
    scrollXToEnd()
  }
  
  if (yToEnd.value) {
    scrollYToEnd()
  }
})

defineExpose({
  scrollXToEnd,
  scrollYToEnd,
})
</script>

<template>
  <div ref="container" :class="$mc('root')">
    <slot />
  </div>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  height: 100%;

  overflow-x: v-bind(x);
  overflow-y: v-bind(y);

  &::-webkit-scrollbar {
    width: 0.875rem;
  }

  &::-webkit-scrollbar-thumb {
    border: 0.35rem solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 50rem;
    background-color: $gray-600;
  }
}
</style>
