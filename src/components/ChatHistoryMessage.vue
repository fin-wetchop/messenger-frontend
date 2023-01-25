<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue'
import { $mc } from '@/utils/style'
import { toRefs } from 'vue'

export interface Props {
  side: 'left' | 'right'
  content?: string
}

export interface Emits {
  (e: 'remove'): void
}

const props = withDefaults(defineProps<Props>(), {
  side: 'left',
  content: '',
})

const { side, content } = toRefs(props)

const emit = defineEmits<Emits>()
</script>

<template>
  <Flex
    dir="row"
    :justify="
      side == 'left'
        ? 'start'
        : 'end'
    "
  >
    <FlexItem grow="0" shrink="1" basis="auto">
      <Flex dir="row" wrap="nowrap" gap="10px" align="end">
        <FlexItem grow="0" shrink="1" basis="auto">
          <fa
            v-if="side === 'right'"
            style="opacity: 50%; cursor: pointer;"
            icon="trash"
            @click="emit('remove')"
          />
        </FlexItem>
        <div :class="$mc('content', `content--${side}`)">
          {{ content }}
        </div>
      </Flex>
    </FlexItem>
  </Flex>
</template>

<style lang="scss" module>
.content {
  flex: unset;
  max-width: min(85%, 30rem);

  border-radius: $border-radius-lg;

  padding: 1rem;

  &--left {
    background-color: $gray-400;
    border-bottom-left-radius: 0;
  }

  &--right {
    background-color: $gray-500;
    border-bottom-right-radius: 0;
  }
}
</style>
