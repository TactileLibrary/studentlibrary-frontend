<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <DynamicDialog />
  <Toast position="bottom-right" />
  <div class="w-screen h-screen flex overflow-x-hidden">
    <RouterView />
  </div>
</template>
