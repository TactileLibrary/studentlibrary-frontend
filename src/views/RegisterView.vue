<script setup lang="ts">
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

import { RouterLink } from 'vue-router'

import { type AxiosResponse } from 'axios'

import { reactive } from 'vue'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

import { useUserStore } from '../stores/user.ts'
const userStore = useUserStore()

import axios from 'axios'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const initialValues = reactive({
  email: '',
  password: '',
  username: '',
  confirmation: '',
})

const resolver = zodResolver(
  z
    .object({
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
      password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: 'Password is invalid',
      }),
      username: z.string().trim().min(1, { message: 'Name is required' }),
      confirmation: z.string().trim().min(1, { message: 'Confirmation is required' }),
    })
    .refine((data) => data.password === data.confirmation, {
      message: 'Passwords do not match',
      path: ['confirmation'],
    }),
)

const onSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  delete values.confirmation

  if (valid) {
    const { email, username, password } = values

    axios
      .post(
        'https://studentlibrary.tactilelibrary.net/user/register',
        {
          email,
          username,
          password,
        },
        {
          responseType: 'text',
        },
      )
      .then((response: AxiosResponse<string>) => {
        // the request worked and it returned success
        userStore.token = response.data
        toast.add({
          severity: 'info',
          summary: 'Info',
          detail: response.data,
          life: 3000,
        })
      })
      .catch((error) => {
        console.error(error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data,
          life: 3000,
        })
      })
    console.log('Form submitted with values:', values)
  }
}
</script>

<template>
  <main class="flex flex-col items-center justify-center w-full h-full gap-4">
    <h1 class="text-4xl font-bold mb-4">Hello there!</h1>
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      :validateOnValueUpdate="true"
      :validateOnMount="true"
      @submit="onSubmit"
      class="flex flex-col gap-4 w-96"
    >
      <div class="flex flex-col gap-1">
        <InputText name="email" type="email" placeholder="Email" fluid autofocus />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Name" fluid />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
          $form.username.error.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="password" type="password" placeholder="Password" fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="confirmation" type="password" placeholder="Confirmation" fluid />
        <Message
          v-if="$form.confirmation?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.confirmation.error.message }}</Message
        >
      </div>
      <Button type="submit" severity="secondary" label="Register" :disabled="!$form.valid" />
    </Form>
    <RouterLink to="/login">Already have an account? Login instead.</RouterLink>
  </main>
</template>
