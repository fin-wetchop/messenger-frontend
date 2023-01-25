<script lang="ts" setup>
import { $mc } from '@/utils/style'
import { toRefs } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

export interface Props {
  url?: string
  alt?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  alt: '',
  size: '1rem',
})

const { url, alt, size } = toRefs(props)

const processedURL = computed(() => `url(${url.value})`)
</script>

<template>
  <div
    class="rounded-circle"
    :class="$mc('root')"
  >
    <div v-if="!url || url.length == 0">
      {{ alt }}
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  align-items: center;
  justify-content: center;

  width: v-bind(size);
  height: v-bind(size);
  font-size: calc(v-bind(size) * 0.4);

  background: no-repeat padding-box center / cover v-bind(processedURL);
  background-color: $gray-400;
}
</style>
