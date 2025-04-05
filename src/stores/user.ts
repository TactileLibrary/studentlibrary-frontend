import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token: Ref<string | undefined> = ref(undefined)

    return { token }
  },
  {
    persist: true,
  },
)
