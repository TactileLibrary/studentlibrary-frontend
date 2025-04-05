<script setup lang="ts">
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

import { type AxiosResponse } from 'axios'

import { useUserStore } from '../stores/user.ts'
const userStore = useUserStore()

import { useRouter } from 'vue-router'
const router = useRouter()

import axios from 'axios'

import { reactive } from 'vue'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

const initialValues = reactive({
  email: '',
  password: '',
})

const resolver = zodResolver(
  z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
      message: 'Password is invalid',
    }),
  }),
)

const onSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  if (valid) {
    const { email, password } = values

    axios
      .post(
        'https://studentlibrary.tactilelibrary.net/user/login',
        {
          email,
          password,
        },
        {
          responseType: 'text',
        },
      )
      .then((response: AxiosResponse<string>) => {
        // the request worked and it returned success
        userStore.token = response.data
        router.push('/')
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
  }
}
</script>

<template>
  <main class="flex flex-col items-center justify-center w-screen h-screen gap-4">
    <h1 class="text-4xl font-bold mb-4">Welcome back!</h1>
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
        <InputText name="password" type="password" placeholder="Password" fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error.message
        }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Login" :disabled="!$form.valid" />
    </Form>
    <RouterLink to="/register">Don't have an account? Register instead.</RouterLink>
  </main>
</template>
