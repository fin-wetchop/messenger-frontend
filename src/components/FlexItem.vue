<script lang="ts" setup>
import { Property } from 'csstype'
import { $mc } from '@/utils/style'
import { toRefs } from 'vue'

interface Props {
	grow?: Property.FlexGrow,
  shrink?: Property.FlexShrink,
  basis?: Property.FlexBasis,
}

const props = withDefaults(defineProps<Props>(), {
  grow: 1,
  shrink: 0,
  basis: '0%',
})

const { grow, shrink, basis } = toRefs(props)
</script>

<template>
  <div :class="$mc('root')">
    <slot />
  </div>
</template>

<style lang="scss" module>
.root {
  flex: v-bind(grow) v-bind(shrink) v-bind(basis);
}
</style>
