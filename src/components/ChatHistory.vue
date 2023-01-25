<script lang="ts" setup>
import ChatHistoryMessage from '@/components/ChatHistoryMessage.vue'
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue'
import { toRefs } from 'vue'

export interface Props {
  messages?: any[]
}

export interface Emits {
  (e: 'remove', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [ ],
})

const { messages } = toRefs(props)

const emit = defineEmits<Emits>()
</script>

<template>
  <Flex
    dir="column"
    wrap="nowrap"
    gap="1rem"
  >
    <FlexItem
      v-for="message of messages"
      :key="message.id"
      grow="0"
      basis="auto"
    >
      <ChatHistoryMessage
        :content="message.content"
        :side="message.side"
        @remove="emit('remove', message.id)"
      />
    </FlexItem>
  </Flex>
</template>
