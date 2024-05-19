import { createRouter, createWebHistory } from "vue-router"
import EmptyModal from "@/components/EmptyModal.vue"
import AddTaskModal from "@/components/AddTaskModal.vue"
import ShowTaskModal from "@/components/ShowTaskModal.vue"
import StatusManagerPage from "./../views/TaskStatusPage.vue"
import TaskManagerPage from "./../views/TaskManagerPage.vue"
import EditStatusModal from "@/components/EditStatusModal.vue"
import AddStatusModal from "@/components/AddStatusModal.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/task",
      name: "Task",
      component: TaskManagerPage,
      children: [
        {
          path: ":id",
          name: "TaskDetail",
          component: ShowTaskModal,
          children: [
            {
              path: ":mode",
              name: "TaskEdit",
              component: EmptyModal
            }
          ]
        },

        {
          path: "/task/add",
          name: "AddTask",
          component: AddTaskModal
        }
      ]
    },

    {
      path: "/statuses",
      name: "Statuses",
      component: StatusManagerPage,
      children: [
        {
          path: ":id/edit",
          name: "EditStatus",
          component: EditStatusModal
        },
        {
          path: "add",
          name: "AddStatus",
          component: AddStatusModal
        }
      ]
    },
    {
      path: "/",
      redirect: "/task"
    }
  ]
})

export default router
