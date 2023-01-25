<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue'
import ChatListItem from '@/components/ChatListItem.vue'
import { ref, toRefs, watch } from 'vue'

export interface Props {
  items?: any[]
  modelValue?: string
}

export interface Emits {
  (e: 'update:modelValue', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [ ],
  modelValue: '',
})

const { items, modelValue } = toRefs(props)

const emit = defineEmits<Emits>()

const activeId = ref(modelValue.value)

watch(activeId, () => {
  emit('update:modelValue', activeId.value)
})

watch(modelValue, () => {
  if (modelValue.value === activeId.value) {
    return
  }

  activeId.value = modelValue.value
})
</script>

<template>
  <Flex
    dir="column"
    gap="0.5rem"
  >
    <FlexItem
      v-for="(item, index) of items"
      :key="index"
      basis="auto"
    >
      <ChatListItem
        :avatar="item.avatar"
        :name="item.name"
        :active="item.id == activeId"
        @click="activeId = item.id"
      />
    </FlexItem>
  </Flex>
</template>
