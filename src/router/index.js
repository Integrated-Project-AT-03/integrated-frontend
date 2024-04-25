import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/task',
      name: 'Task',
      component: () => import('../views/Homeview.vue')
    },
    {
      path: '',
      redirect: '/task'
    }
  ]
})

export default router
