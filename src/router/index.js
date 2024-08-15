import { createRouter, createWebHistory } from 'vue-router';
import EmptyModal from '@/components/EmptyModal.vue';
import AddTaskModal from '@/components/AddTaskModal.vue';
import ShowTaskModal from '@/components/ShowTaskModal.vue';
import StatusManagerPage from './../views/TaskStatusPage.vue';
import TaskManagerPage from './../views/TaskManagerPage.vue';
import EditStatusModal from '@/components/EditStatusModal.vue';
import AddStatusModal from '@/components/AddStatusModal.vue';
import LoginPage from '../views/LoginPage.vue';
import AppPage from '@/views/AppPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/app',
      name: 'App',
      component: AppPage,
      children: [
        {
          path: '/app',
          redirect: 'app/task',
        },
        {
          path: 'task',
          name: 'Task',
          component: TaskManagerPage,
          children: [
            {
              path: ':id',
              name: 'TaskDetail',
              component: ShowTaskModal,
              children: [
                {
                  path: ':mode',
                  name: 'TaskEdit',
                  component: EmptyModal,
                },
              ],
            },

            {
              path: 'task/add',
              name: 'AddTask',
              component: AddTaskModal,
            },
          ],
        },

        {
          path: 'status',
          name: 'Status',
          component: StatusManagerPage,
          children: [
            {
              path: ':id/edit',
              name: 'EditStatus',
              component: EditStatusModal,
            },
            {
              path: 'add',
              name: 'AddStatus',
              component: AddStatusModal,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
