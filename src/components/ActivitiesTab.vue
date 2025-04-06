<script setup lang="ts">
import axios from 'axios'
import { defineProps, ref, onMounted, watch, type Ref } from 'vue'
import { useUserStore } from '../stores/user.ts'

import { marked } from 'marked'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const userStore = useUserStore()
const props = defineProps({
  groupID: String,
})

const activities: Ref<
  { groupID: string; name: String; time: Date; location: String; details: String }[]
> = ref([])

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
        (activity: { name: String; time: String; location: Date; details: String }) => ({
          name: activity.name,
          time: new Date(activity.time.replace(' ', 'T')),
          location: activity.location,
          details: activity.details,
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

watch(
  () => props.groupID,
  () => {
    getActivities()
  },
)

onMounted(() => {
  getActivities()
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-col px-4 py-2 group border border-surface-600 prose-xl rounded-md max-w-prose w-full mx-auto"
      v-for="item in activities"
      :key="item.name"
    >
      <div class="flex flex-col items-start pb-2">
        <h1 class="text-4xl font-bold mb-0">{{ item.name }}</h1>
        <p class="text-sm text-surface-600">
          {{ item.time.toLocaleString() }} - {{ item.location }}
        </p>
      </div>
      <div
        class="prose prose-invert prose-xl border-t border-surface-600 prose-headings:mb-0"
        v-html="marked.parse(item.details)"
        v-if="item.details"
      ></div>
    </div>
  </div>
</template>
