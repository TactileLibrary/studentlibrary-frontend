<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'

import SidebarComponent from './components/SidebarComponent.vue'

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <DynamicDialog />
  <Toast position="bottom-right" />
  <div class="w-screen h-screen flex overflow-x-hidden">
    <SidebarComponent
      v-if="
        router.currentRoute.value.name !== 'Login' && router.currentRoute.value.name !== 'Register'
      "
    />
    <RouterView />
  </div>
</template>
