<script setup lang="ts">
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from 'primevue/button'

import { reactive, ref, inject } from 'vue'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

import { useToast } from 'primevue/usetoast'
const toast = useToast()

import axios from 'axios'

const dialogRef: any = inject('dialogRef')

const emit = defineEmits(['change'])

const initialValues = reactive({
  reason: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      reason: z.string().trim().min(1, { message: 'Ban reason is required.' }),
    }),
  ),
)

const onFormSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  if (valid) {
    axios
      .post(
        'https://studentlibrary.tactilelibrary.net/group/ban',
        {
          userID: dialogRef.value.data.userId,
          groupID: dialogRef.value.data.groupId,
          reason: values.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        },
      )
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'User banned',
          detail: 'The user has been banned successfully.',
          life: 3000,
        })
        emit('change')
        dialogRef.value.close()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'Error banning user',
          detail: error.response.data.message,
          life: 3000,
        })
      })
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initialValues
    :resolver
    :validateOnMount="true"
    @submit="onFormSubmit"
    class="flex flex-col gap-4 w-full sm:w-56"
  >
    <div class="flex flex-col gap-1">
      <InputText name="reason" type="text" placeholder="Ban Reason" fluid autofocus />
      <Message v-if="$form.reason?.invalid" severity="error" size="small" variant="simple">{{
        $form.reason.error?.message
      }}</Message>
    </div>
    <Button type="submit" severity="secondary" label="Ban" :disabled="!$form.valid" />
  </Form>
</template>
