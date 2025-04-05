import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  if (
    // make sure the user is authenticated
    userStore.token === undefined &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login' &&
    to.name !== 'Register'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
})

export default router
