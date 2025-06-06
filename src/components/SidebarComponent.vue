<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import Avatar from 'primevue/avatar'
import axios from 'axios'

import SplitButton from 'primevue/splitbutton'

import { useUserStore } from '../stores/user.ts'
const userStore = useUserStore()

import { useToast } from 'primevue/usetoast'
const toast = useToast()

import { useDialog } from 'primevue/usedialog'
const dialog = useDialog()

import CreateGroupDialog from './modals/CreateGroupDialog.vue'
import JoinGroupDialog from './modals/JoinGroupDialog.vue'

const items: Ref<{ name: string; to: string; owner: string; id: string }[]> = ref([])

function updateGroupList() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/list', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
    })
    .then((response) => {
      items.value = response.data.map(
        (group: { group_name: string; group_id: string; group_owner: string }) => ({
          name: group.group_name,
          to: `/group/${group.group_id}`,
          owner: group.group_owner,
          id: group.group_id,
        }),
      )
    })
    .catch((error) => {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch groups',
        life: 3000,
      })
    })
}

onMounted(() => {
  updateGroupList()
})

const newGroupItems = [
  {
    label: 'Create new group',
    command: () => {
      dialog.open(CreateGroupDialog, {
        props: {
          modal: true,
          header: 'Create a new group',
        },
        emits: {
          onChange: () => {
            console.log('Refreshing groups')
            updateGroupList()
          },
        },
      })
    },
  },
]
</script>

<template>
  <aside class="sidebar w-80 py-4 h-full bg-surface-900 flex flex-col">
    <div class="mb-4 text-center">
      <h1 class="text-2xl font-bold">Student Library</h1>
    </div>
    <div class="h-full overflow-y-auto px-4">
      <SplitButton
        @click="
          dialog.open(JoinGroupDialog, {
            props: {
              modal: true,
              header: 'Join a group',
            },
            emits: {
              onChange: () => {
                console.log('Refreshing groups')
                updateGroupList()
              },
            },
          })
        "
        class="mb-4"
        label="Join new group"
        :model="newGroupItems"
        fluid
      />
      <div class="flex flex-col gap-2 flex-grow scroll-y-auto">
        <router-link
          v-for="item in items"
          :key="item.id"
          v-slot="{ href, navigate }"
          :to="item.to"
          custom
        >
          <a
            class="flex flex-col cursor-pointer px-4 py-2 border border-surface-600 hover:bg-surface-700 transition-color duration-100 rounded-md"
            :href="href"
            @click="navigate"
          >
            <p class="ml-2 font-bold text-lg">{{ item.name }}</p>
            <p class="ml-2 text-sm text-surface-400">{{ item.owner }}</p>
          </a>
        </router-link>
      </div>
    </div>
    <div class="flex items-center justify-start mt-4 px-4">
      <Avatar
        :label="userStore.name?.charAt(0).toUpperCase()"
        size="large"
        shape="circle"
        class="bg-primary!"
      />
      <div class="ml-2">
        <p class="text-lg font-bold">{{ userStore.name }}</p>
        <p class="text-sm text-surface-500">{{ userStore.email }}</p>
      </div>
    </div>
  </aside>
</template>
