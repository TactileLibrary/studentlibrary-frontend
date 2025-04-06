<script setup lang="ts">
import axios from 'axios'
import { defineProps, ref, onMounted, watch, type Ref } from 'vue'
import { useUserStore } from '../stores/user.ts'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const userStore = useUserStore()
const props = defineProps({
  groupID: String,
})

const activities: Ref<
  { groupID: string; name: String; time: String; location: String; details: String }[]
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
        (activity: {
          groupID: string
          name: String
          time: String
          location: String
          details: String
        }) => ({
          groupID: activity.groupID,
          name: activity.name,
          time: activity.time,
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
      class="flex justify-between px-4 py-2 group border border-surface-600 rounded-md"
      v-for="item in activities"
      :key="item.groupID"
    >
      <div id="user-data" class="flex items-center gap-4">
        <div class="text-lg font-bold">{{ item.name }}</div>
        <div class="text-lg font-bold">{{ item.details }}</div>
      </div>
    </div>
  </div>
</template>
