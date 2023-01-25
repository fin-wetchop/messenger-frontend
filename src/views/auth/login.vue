<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue';
import { useAuth } from '@websanova/vue-auth';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

interface LoginData {
  data: {
    uid: string
    password: string
  }
  staySignedIn: boolean
}

const router = useRouter()
const auth = useAuth()

async function login() {
  blocked.value = true
  
  try {
    await auth.login(data)
  } catch {
    // TODO: Show error
  }

  if (auth.ready()) {
    router.push({ name: 'default' })
  }

  blocked.value = false
}

const blocked = ref<boolean>(false);

const data = reactive<LoginData>({
  data: {
    uid: '',
    password: ''
  },
  staySignedIn: false
})

</script>

<template>
  <Flex
    maxed-width
    maxed-height

    align="center"
    justify="center"
  >
    <FlexItem grow="0" shrink="1" basis="auto" style="max-width: 90%; width: 400px;">
      <div class="card card-body" style="width: 100%;">
        <Flex
          dir="column"
          wrap="nowrap"
          gap="15px"
          align="stretch"
        >
          <h1 class="mb-4 text-center">
            Login
          </h1>
          <div>
            <label class="form-label">Email/Username</label>
            <input v-model="data.data.uid" type="text" class="form-control" placeholder="super@user.com/super_user">
          </div>
          <div>
            <label class="form-label">Password</label>
            <input v-model="data.data.password" type="text" class="form-control" placeholder="********">
          </div>
          <div class="form-check">
            <input v-model="data.staySignedIn" class="form-check-input" type="checkbox" value="">
            <label class="form-check-label">
              Remember me
            </label>
          </div>
          <div class="mt-2">
            <Flex
              maxed-width

              dir="row"
              align="center"
              justify="space-between"
            >
              <FlexItem grow="0" shrink="1" basis="auto">
                <a
                  class="link-secondary"
                  href="/register"

                  @click.prevent="router.push({ name: 'register' })"
                >
                  Register
                </a>
              </FlexItem>
              <FlexItem grow="0" shrink="1" basis="auto">
                <button :disabled="blocked" @click="login" type="button" class="btn btn-primary">Login</button>
              </FlexItem>
            </Flex>
          </div>
        </Flex>
      </div>
    </FlexItem>
  </Flex>
</template>
