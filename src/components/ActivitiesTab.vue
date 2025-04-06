<script setup lang="ts">
import axios from 'axios'
import { defineProps, ref, onMounted, watch, type Ref } from 'vue'
import { useUserStore } from '../stores/user.ts'

import Button from 'primevue/button'

import { marked } from 'marked'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

import { useDialog } from 'primevue/usedialog'
const dialog = useDialog()

const userStore = useUserStore()
const props = defineProps({
  groupID: String,
})

const isAdmin = ref(false)

const activities: Ref<
  { groupID: string; name: String; time: Date; location: String; details: String; id: number }[]
> = ref([])

import CreateActivityDialog from './modals/CreateActivityDialog.vue'

function addActivity() {
  dialog.open(CreateActivityDialog, {
    props: {
      header: 'Create new activity',
      style: {
        width: '500px',
      },
      maximizable: true,
    },
    data: {
      groupID: props.groupID,
    },
    events: {
      onChange: () => {
        getActivities()
      },
    },
  })
}

function getActivities() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/activity/list', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      params: {
        groupID: props.groupID,
      },
    })
    .then((response) => {
      activities.value = response.data.map(
        (activity: {
          name: String
          time: String
          location: Date
          details: String
          id: number
        }) => ({
          name: activity.name,
          time: new Date(activity.time.replace(' ', 'T')),
          location: activity.location,
          details: activity.details,
          id: activity.id,
        }),
      )
    })
    .catch((error) => {
      activities.value = []
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response.data,
        life: 3000,
      })
    })
}

function getAdmin() {
  axios
    .get('https://studentlibrary.tactilelibrary.net/group/admin/', {
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      params: {
        groupID: props.groupID,
      },
    })
    .then(() => {
      isAdmin.value = true
    })
    .catch(() => {
      isAdmin.value = false
    })
}

watch(
  () => props.groupID,
  () => {
    getActivities()
    getAdmin()
  },
)

onMounted(() => {
  getActivities()
  getAdmin()
})
</script>

<template>
  <div class="flex flex-col gap-2 prose-xl max-w-prose mx-auto">
    <Button
      v-if="isAdmin"
      label="Add Activity"
      icon="pi pi-plus"
      class="w-full mx-auto"
      @click="addActivity()"
    />
    <div
      class="flex flex-col px-4 py-2 group border border-surface-600 rounded-md w-full"
      v-for="item in activities"
      :key="item.id as number"
    >
      <div class="flex flex-col items-start pb-2">
        <h1 class="text-4xl font-bold mb-0">{{ item.name }}</h1>
        <p class="text-sm text-surface-600">
          {{ item.time.toLocaleString() }} - {{ item.location }}
        </p>
      </div>
      <div
        class="prose prose-invert prose-xl border-t border-surface-600 prose-headings:mb-0"
        v-html="marked.parse(item.details as string)"
        v-if="item.details"
      ></div>
    </div>
    <small class="text-sm text-surface-600 text-center"> End of activity list.</small>
  </div>
</template>
