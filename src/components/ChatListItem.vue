<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue'
import Avatar from '@/components/Avatar.vue'
import { $mc } from '@/utils/style'
import { computed, toRefs } from 'vue'

export interface Props {
  avatar?: string
  name?: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  name: '',
  active: false,
})

const { avatar, name } = toRefs(props)

const initiatives = computed(() => name.value.split(' ').slice(0, 2).map(name => name.charAt(0)).join(''))
</script>

<template>
  <Flex
    class="user-select-none"
    :class="$mc(
      'root',
      'root--active', active,
    )"
    dir="row"
    wrap="nowrap"
    gap="1rem"
    align="center"
  >
    <FlexItem grow="0" basis="auto">
      <Avatar :url="avatar" :alt="initiatives" size="3rem" />
    </FlexItem>
    <div class="text-truncate">
      {{ name }}
    </div>
  </Flex>
</template>

<style lang="scss" module>
.root {
  border-radius: $border-radius;
  padding: 0.5rem;

  &:hover:not(.root--active) {
    background-color: $gray-200;
  }

  &--active {
    background-color: $gray-500;
  }
}
</style>
