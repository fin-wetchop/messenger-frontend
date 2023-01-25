<script lang="ts" setup>
import Flex from '@/components/Flex.vue'
import FlexItem from '@/components/FlexItem.vue';
import { Axios } from 'axios';
import { inject, reactive } from 'vue';
import { useRouter } from 'vue-router';

interface RegisterData {
  name: string
  username: string
  email: string
  password: string
  confirmation: string
}

const data = reactive<RegisterData>({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmation: '',
})

async function register() {
  if (data.password !== data.confirmation)
    return

  try {
    await axois.post('/auth/register', data)

    router.push({ name: 'login' })
  } catch {
    // TODO: Show error
  }
}

const router = useRouter()
const axois = inject('axios') as Axios

</script>

<template>
  <Flex
    maxed-width
    maxed-height

    align="center"
    justify="center"
  >
    <FlexItem grow="0" shrink="1" basis="auto" style="max-width: 90%; width: 400px;">
      <div class="card card-body" style="width: 100%">
        <Flex
          dir="column"
          wrap="nowrap"
          gap="15px"
          align="stretch"
        >
          <h1 class="mb-4 text-center">
            Register
          </h1>
          <div>
            <label class="form-label">Name</label>
            <input v-model="data.name" type="text" class="form-control" placeholder="Super User">
          </div>
          <div>
            <label class="form-label">Username</label>
            <input v-model="data.username" type="text" class="form-control" placeholder="super_user">
          </div>
          <div>
            <label class="form-label">Email</label>
            <input v-model="data.email" type="text" class="form-control" placeholder="super@user.com">
          </div>
          <div>
            <label class="form-label">Password</label>
            <input v-model="data.password" type="text" class="form-control" placeholder="********">
          </div>
          <div>
            <label class="form-label">Confirm password</label>
            <input v-model="data.confirmation" type="text" class="form-control" placeholder="********">
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
                  href="/login"

                  @click.prevent="router.push({ name: 'login' })"
                >
                  Login
                </a>
              </FlexItem>
              <FlexItem grow="0" shrink="1" basis="auto">
                <button @click="register" type="button" class="btn btn-primary">Register</button>
              </FlexItem>
            </Flex>
          </div>
        </Flex>
      </div>
    </FlexItem>
  </Flex>
</template>
