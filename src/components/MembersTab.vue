<script setup lang="ts">
import { defineProps, ref, onMounted, watch, type Ref } from 'vue'

import axios from 'axios'

import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import BanUserDialog from '@/components/modals/BanUserDialog.vue'

const props = defineProps({
  id: String,
})

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

import { useToast } from 'primevue/usetoast'
const toast = useToast()

import { useDialog } from 'primevue/usedialog'
const dialog = useDialog()

import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

const members: Ref<{ name: string; id?: string }[]> = ref([])
const code = ref('')
const bannedMembers: Ref<{ name: string; id: string }[]> = ref([])

function banUser(id: string, name: string) {
  dialog.open(BanUserDialog, {
    props: {
      header: 'Ban ' + name,
    },
    data: {
      userId: id,
      groupId: props.id,
    },
    emits: {
      onChange: () => {
        console.log('Refreshing members')
        getMembers()
        getBannedMembers()
      },
    },
  })
}

function unbanUser(id: string, name: string) {
  confirm.require({
    message: `Are you sure you want to unban ${name}?`,
    header: 'Unban confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Unban',
    },
    accept: () => {
      axios
        .post(
          'https://studentlibrary.tactilelibrary.net/group/unban',
          {
            id: id,
            groupID: props.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + userStore.token,
            },
          },
        )
        .then(() => {
          toast.add({
            severity: 'success',
            summary: 'User unbanned',
            detail: 'The user has been unbanned successfully.',
            life: 3000,
          })
          getMembers()
          getBannedMembers()
        })
        .catch((error) => {
          toast.add({
            severity: 'error',
            summary: 'Error unbanning user',
            detail: error.response.data.message,
            life: 3000,
          })
          getMembers()
          getBannedMembers()
        })
    },
  })
}

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
        code.value = 'ERROR'
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
  <ConfirmDialog></ConfirmDialog>

  <h1 class="text-2xl font-bold mb-4" v-if="code">Invite code: {{ code }}</h1>
  <h1 class="text-2xl font-bold mb-4">Members ({{ members.length }})</h1>

  <div class="flex flex-col gap-2">
    <div
      class="flex justify-between px-4 py-2 group border border-surface-600 rounded-md"
      v-for="item in members"
      :key="item.name"
    >
      <div id="user-data" class="flex items-center gap-4">
        <Avatar :label="item.name[0].toUpperCase()" shape="circle" class="bg-primary!" />
        <div class="text-lg font-bold">{{ item.name }}</div>
      </div>
      <div
        class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        id="user-actions"
        v-if="item.id && item.id != userStore.id"
      >
        <Button label="Ban" icon="pi pi-ban" @click="banUser(item.id, item.name)" />
      </div>
    </div>
  </div>

  <h1 class="text-2xl font-bold my-4" v-if="bannedMembers.length">
    Banned members ({{ bannedMembers.length }})
  </h1>
  <div class="flex flex-col gap-2">
    <div
      class="flex justify-between px-4 py-2 group border border-surface-600 rounded-md"
      v-for="item in bannedMembers"
      :key="item.name"
    >
      <div id="user-data" class="flex items-center gap-4">
        <Avatar :label="item.name[0].toUpperCase()" shape="circle" class="bg-primary!" />
        <div class="text-lg font-bold">{{ item.name }}</div>
      </div>
      <div
        class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        id="user-actions"
      >
        <Button label="Unban" icon="pi pi-check" @click="unbanUser(item.id, item.name)" />
      </div>
    </div>
  </div>
</template>
