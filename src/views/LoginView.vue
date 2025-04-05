<script setup lang="ts">
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

import { reactive } from 'vue'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

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
    console.log('Form submitted with values:', values)
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
      :validateOnMount="['email']"
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
  </main>
</template>
