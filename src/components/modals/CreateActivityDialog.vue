<script setup lang="ts">
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'

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
  name: '',
  time: '',
  location: '',
  details: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: 'Name is required.' })
        .max(50, { message: 'Name is too long.' }),
      location: z
        .string()
        .min(1, { message: 'Location is required.' })
        .max(100, { message: 'Location is too long.' }),
      details: z
        .string()
        .min(1, { message: 'Details are required.' })
        .max(500, { message: 'Details are too long.' }),
      time: z.preprocess(
        (val) => {
          if (val === '' || val === null) {
            return null
          }

          return new Date(val as string)
        },
        z.union([
          z.date(),
          z.null().refine((val) => val !== null, { message: 'Time is required.' }),
        ]),
      ),
    }),
  ),
)
const onFormSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  if (valid) {
    axios
      .post(
        'https://studentlibrary.tactilelibrary.net/activity/create',
        {
          groupID: dialogRef.value.data.groupID,
          name: values.name,
          time: values.time,
          location: values.location,
          details: values.details,
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
    class="flex flex-col gap-4 w-full"
  >
    <div class="flex flex-col gap-1">
      <InputText name="name" type="text" placeholder="Name" fluid autofocus />
      <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
        $form.name.error?.message
      }}</Message>
      <DatePicker name="time" showTime hourFormat="24" fluid placeholder="Time" />
      <Message v-if="$form.time?.invalid" severity="error" size="small" variant="simple">{{
        $form.time.error?.message
      }}</Message>
      <InputText name="location" type="text" placeholder="Location" fluid />
      <Message v-if="$form.location?.invalid" severity="error" size="small" variant="simple">{{
        $form.location.error?.message
      }}</Message>
      <Textarea
        name="details"
        placeholder="Write more details here... (markdown supported)"
        fluid
      />
      <Message v-if="$form.details?.invalid" severity="error" size="small" variant="simple">{{
        $form.details.error?.message
      }}</Message>
    </div>
    <Button type="submit" severity="secondary" label="Create" :disabled="!$form.valid" />
  </Form>
</template>
