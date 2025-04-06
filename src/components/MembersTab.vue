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
const code = ref('')
const bannedMembers = ref([])

function getCode() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/code', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      params: {
        id: props.id,
      },
    })
    .then((response) => {
      code.value = response.data
    })
    .catch((err) => {
      if (err.status === 403) {
        code.value = ''
      } else {
        cose.value = 'ERROR'
        console.log(err)
      }
    })
}

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
      members.value = []
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response.data,
        life: 3000,
      })
    })
}

function getBannedMembers() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/bannedMembers', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      params: {
        id: props.id,
      },
    })
    .then((response) => {
      bannedMembers.value = response.data.map((member: { name: string; id: string }) => ({
        name: member.name,
        id: member.id,
      }))
    })
    .catch((error) => {
      bannedMembers.value = []
      if (error.status != 403) {
        console.log(error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data,
          life: 3000,
        })
      }
    })
}

watch(
  () => props.id,
  () => {
    getCode()
    getMembers()
    getBannedMembers()
  },
)

onMounted(() => {
  getCode()
  getMembers()
  getBannedMembers()
})
</script>

<template>
  <h1 class="text-2xl font-bold mb-4" v-if="code">Invite code: {{ code }}</h1>
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
  <h1 class="text-2xl font-bold my-4" v-if="bannedMembers.length">
    Banned members ({{ bannedMembers.length }})
  </h1>
  <PanelMenu :model="bannedMembers">
    <template #item="{ item }">
      <div class="flex justify-between px-4 py-2">
        <div id="user-data" class="flex items-center gap-4">
          <Avatar :label="item.name[0].toUpperCase()" shape="circle" class="bg-primary!" />
          <div class="text-lg font-bold">{{ item.name }}</div>
        </div>
        <div id="user-actions">wee</div>
      </div>
    </template>
  </PanelMenu>
</template>
