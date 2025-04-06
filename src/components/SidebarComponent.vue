<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import { ref, onMounted } from 'vue'
import Avatar from 'primevue/avatar'
import axios from 'axios'

import SplitButton from 'primevue/splitbutton'

import { useUserStore } from '../stores/user.ts'
const userStore = useUserStore()

import { useRouter } from 'vue-router'
const router = useRouter()

import { useToast } from 'primevue/usetoast'
const toast = useToast()

import { useDialog } from 'primevue/usedialog'
const dialog = useDialog()

import CreateGroupDialog from './modals/CreateGroupDialog.vue'
import JoinGroupDialog from './modals/JoinGroupDialog.vue'

const items = ref([])

const name = ref('Test')
const email = ref('wewe')

function updateGroupList() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/list', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
    })
    .then((response) => {
      items.value = response.data.map((group) => ({
        name: group.group_name,
        to: `/group/${group.group_id}`,
        owner: group.group_owner,
      }))
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
  // get /user/me
  axios
    .get('https://studentlibrary.tactilelibrary.net/user/me', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
    })
    .then((response) => {
      name.value = response.data.username
      email.value = response.data.email
    })
    .catch((error) => {
      console.log(error)
      userStore.toekn = undefined
      router.push('/login')
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Login expired',
        life: 3000,
      })
    })

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
  <aside class="sidebar w-80 p-4 h-full bg-surface-900 flex flex-col">
    <div class="mb-4 text-center">
      <h1 class="text-2xl font-bold">Student Library</h1>
    </div>
    <div class="h-full overflow-y-scroll">
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
      <PanelMenu :model="items">
        <template #item="{ item }">
          <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
            <a class="flex flex-col cursor-pointer px-4 py-2" :href="href" @click="navigate">
              <span class="ml-2 font-bold text-lg">{{ item.name }}</span>
              <span class="ml-2 text-sm text-surface-400">{{ item.owner }}</span>
            </a>
          </router-link>
        </template>
      </PanelMenu>
    </div>
    <div class="flex items-center justify-start mt-4">
      <Avatar :label="name[0].toUpperCase()" size="large" shape="circle" class="bg-primary!" />
      <div class="ml-2">
        <div class="text-lg font-bold">{{ name }}</div>
        <div class="text-sm text-surface-500">{{ email }}</div>
      </div>
    </div>
  </aside>
</template>
