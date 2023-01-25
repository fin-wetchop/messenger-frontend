<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue'
import Scroller from '@/components/Scroller.vue'
import Avatar from '@/components/Avatar.vue'
import ChatList from '@/components/ChatList.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import Channel from '@/models/Channel'
import User from '@/models/User'
import { $mc } from '@/utils/style'
import { computed, onMounted, watch } from '@vue/runtime-core'
import { ref } from 'vue'
import ChannelMember from '@/models/ChannelMember'
import { useAuth } from '@websanova/vue-auth'
import ChannelMessage from '@/models/ChannelMessage'

const auth = useAuth()

const user = computed(() => auth.user())

const search = ref('')
const activeChatId = ref('')
const message = ref('')

const chScroller = ref<typeof Scroller | null>(null)

const channels = computed(() => Channel.query().withAllRecursive().get())
const processedChannels = computed(() =>
  channels.value
    .map((channel: Channel) => ({
      id: channel.$id as string,
      avatar: channel.members?.[0]?.avatar,
      name: channel.name,
    }))
)
const filteredChannels = computed(() =>
  processedChannels.value
    .filter(channel =>
      (channel.name?.indexOf(search.value) ?? 0) != -1
    )
)

const activeChat = computed(() => channels.value.find(chat => chat.$id == activeChatId.value))

const activeChatInitiatives = computed(() => activeChat.value?.name!.split(' ').slice(0, 2).map(name => name.charAt(0)).join(''))

const activeChatMessages = computed(() =>
  (activeChat.value?.messages ?? [ ])
    .map(message => ({
      id: message.id,
      content: message.content,
      side: user.value.id === message.authorId
        ? 'right'
        : 'left'
    }))
)

watch(activeChat, () => {
  chScroller.value?.scrollYToEnd()
})

watch(activeChatId, () => {
  if (!activeChatId.value)
    return

  ChannelMessage.api.index(activeChatId.value)
})

function sendMessage () {
  if (message.value.length == 0) {
    return
  }

  activeChat.value?.send(message.value)
  message.value = ''

  chScroller.value?.scrollYToEnd()
}

function deleteMessage (id: string) {
  activeChat.value?.remove(id)
}

onMounted(async () => {
  await User.api.index()
  await Channel.api.index()
  
  await Promise.all(
    Channel.query()
      .all()
      .map(async channel => await ChannelMember.api.index(channel.id!))
  )
})
</script>

<template>
  <Flex
    class="w-100 h-100 p-2"
    :class="$mc('selected', !!activeChat)"
    dir="row"
    wrap="nowrap"
    gap="0.5rem"
  >
    <Flex
      class="w-100 h-100"
      :class="$mc('sidebar')"
      dir="column"
      wrap="nowrap"
      gap="0.5rem"
    >
      <FlexItem grow="0" basis="auto" class="card card-body">
        <div class="input-group">
          <span class="input-group-text" id="basic-addon1"><fa icon="search" /></span>
          <input v-model="search" type="text" class="form-control" placeholder="Search...">
        </div>
      </FlexItem>
      <div class="card card-body overflow-auto pe-1">
        <Scroller y="scroll">
          <ChatList
            :items="filteredChannels"
            v-model="activeChatId"
          />
        </Scroller>
      </div>
    </Flex>
    <Flex
      class="w-100 h-100"
      :class="$mc('main')"
      dir="column"
      wrap="nowrap"
      gap="0.5rem"
    >
      <FlexItem v-if="activeChat" grow="0" basis="auto" class="card card-body">
        <Flex
          dir="row"
          wrap="nowrap"
          gap="1rem"
          align="center"
        >
          <FlexItem
            :class="$mc('back-button')"
            grow="0"
            basis="auto"
          >
            <button
              class="btn"
              @click="activeChatId = ''"
            >
              <fa icon="arrow-left" />
            </button>
          </FlexItem>
          <FlexItem grow="0" basis="auto">
            <Avatar
              :alt="activeChatInitiatives" size="4rem" />
          </FlexItem>
          <div>
            {{ activeChat.name }}
          </div>
        </Flex>
      </FlexItem>
      <div class="card card-body overflow-auto pe-1">
        <Flex
          class="w-100 h-100"
          v-if="!activeChat"
          align="center"
          justify="center"
        >
          <h5 class="text-center m-0 user-select-none">
            Please, select any chat
          </h5>
        </Flex>
        <Scroller
          ref="chScroller"
          v-else
          y="auto"
          y-to-end
        >
          <ChatHistory
            class="w-100 h-100"
            :messages="activeChatMessages"
            @remove="deleteMessage"
          />
        </Scroller>
      </div>
      <FlexItem v-show="activeChat" grow="0" basis="auto" class="card card-body">
        <div class="input-group">
          <input
            v-model="message"
            type="text"
            class="form-control"
            placeholder="Type something..."
            @keyup.enter="sendMessage"
          >
          <button
            class="btn btn-outline-secondary"
            @click="sendMessage"
          >
            <fa icon="paper-plane" />
          </button>
        </div>
      </FlexItem>
    </Flex>
  </Flex>
</template>

<style lang="scss" module>
.sidebar {
  @include media-breakpoint-up(sm) {
    flex: 0 0 18.75rem;
  }
}

.back-button {
  display: none;
}

@include media-breakpoint-down(sm) {
  .main {
    display: none;
  }

  .selected {
    .back-button {
      display: unset;
    }

    .main {
      display: flex;
    }

    .sidebar {
      display: none;
    }
  }
}
</style>
