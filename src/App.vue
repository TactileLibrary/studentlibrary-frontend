<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'

import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter()

import { useRoute } from 'vue-router'
const route = useRoute()

import { onMounted, watch } from 'vue'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

function getUserData() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/user/me', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
    })
    .then((response) => {
      userStore.name = response.data.username
      userStore.email = response.data.email
      userStore.id = response.data.id
    })
    .catch((error) => {
      console.log(error)
      userStore.token = undefined
      userStore.name = undefined
      userStore.email = undefined
      userStore.id = undefined
      router.push('/login')
    })
}

watch(
  () => route.path,
  () => {
    console.log('Getting user data')
    getUserData()
  },
)

onMounted(() => {
  getUserData()
})
</script>

<template>
  <DynamicDialog />
  <Toast position="bottom-right" />
  <div class="w-screen h-screen flex overflow-x-hidden">
    <RouterView />
  </div>
</template>
