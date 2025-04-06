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

const dialogRef = inject('dialogRef')

const emit = defineEmits(['change'])

const initialValues = reactive({
  code: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      code: z.string().trim().length(8, { message: 'Code must be 8 characters long.' }),
    }),
  ),
)

const onFormSubmit = ({ valid, values }) => {
  if (valid) {
    axios
      .post(
        'https://studentlibrary.tactilelibrary.net/group/join',
        {
          groupCode: values.code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userStore.token,
          },
        },
      )
      .then((response) => {
        emit('change')
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data,
          life: 3000,
        })
        dialogRef.value.close()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data,
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
      <InputText name="code" type="text" placeholder="Invite code" fluid autofocus />
      <Message v-if="$form.code?.invalid" severity="error" size="small" variant="simple">{{
        $form.code.error?.message
      }}</Message>
    </div>
    <Button type="submit" severity="secondary" label="Join" :disabled="!$form.valid" />
  </Form>
</template>
