import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/Homeview.vue"
import EmptyModal from "@/components/EmptyModal.vue"
import AddTaskModal from "@/components/AddTaskModal.vue"
import ShowTaskModal from "@/components/ShowTaskModal.vue"
import { getItems } from "./../assets/fetch.js"
import DeleteTaskModal from "@/components/DeleteTaskModal.vue"
import TaskStatus from "@/components/TaskStatus.vue"
import Homeview from "../views/Homeview.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/task",
      name: "Task",
      component: HomeView,
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
            },
            {
              path: "delete",
              name: "Delete",
              component: DeleteTaskModal
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
      component: TaskStatus
    },
    {
      path: "/",
      redirect: "/task"
    }
  ]
})

export default router
