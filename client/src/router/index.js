import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import PDC from '../views/Pdc.vue'
import Slurry from '../views/Slurry.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/pdc',
      name: 'pdc',
      component: PDC
    },
    {
      path: '/slurry',
      name: 'slurry',
      component: Slurry
    }
  ]
})

export default router
