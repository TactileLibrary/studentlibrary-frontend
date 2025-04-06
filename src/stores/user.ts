import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token: Ref<string | undefined> = ref(undefined)
    const name: Ref<string | undefined> = ref(undefined)
    const email: Ref<string | undefined> = ref(undefined)
    const id: Ref<string | undefined> = ref(undefined)

    return { token, name, email, id }
  },
  {
    persist: true,
  },
)
