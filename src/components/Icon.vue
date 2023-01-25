<script lang="ts" setup>
import { Property } from 'csstype'
import { $mc } from '@/utils/style'
import { toRefs } from 'vue'

interface Props {
  id: string
  size: Property.Width | Property.Height
  variant: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: '',
})

const { id, size, variant } = toRefs(props)
</script>

<template>
  <svg :class="[
    $mc('root'),
    { [`icon-${variant}`]: variant.length !== 0 },
  ]">
    <use :href="`${require('@/assets/icons.svg')}#${id}`"></use>
  </svg>
</template>

<style lang="scss" module>
.root {
  width: v-bind(size);
  height: v-bind(size);
}
</style>
