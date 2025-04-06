<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from 'vue'

import axios from 'axios'

import PanelMenu from 'primevue/panelmenu'
import Avatar from 'primevue/avatar'

const props = defineProps({
  id: String,
})

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const members = ref([])

function getMembers() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/members', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      params: {
        id: props.id,
      },
    })
    .then((response) => {
      members.value = response.data.map((member: { name: string; id?: string }) => ({
        name: member.name,
        id: member.id,
      }))
    })
    .catch((error) => {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch members',
        life: 3000,
      })
    })
}

watch(
  () => props.id,
  () => {
    getMembers()
  },
)

onMounted(() => {
  getMembers()
})
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Members ({{ members.length }})</h1>
  <PanelMenu :model="members">
    <template #item="{ item }">
      <div class="flex justify-between px-4 py-2">
        <div id="user-data" class="flex items-center gap-4">
          <Avatar :label="item.name[0].toUpperCase()" shape="circle" class="bg-primary!" />
          <div class="text-lg font-bold">{{ item.name }}</div>
        </div>
        <div id="user-actions" v-if="item.id">wee</div>
      </div>
    </template>
  </PanelMenu>
</template>
