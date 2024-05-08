import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/Homeview.vue"
import EmptyModal from "@/components/EmptyModal.vue"
import AddTaskModal from "@/components/AddTaskModal.vue"
import ShowTaskModal from "@/components/ShowTaskModal.vue"
import { getItems } from "./../assets/fetch.js"
import DeleteTaskModal from "@/components/DeleteTaskModal.vue"
import AddStatusModal from "@/components/AddStatusModal.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/task",
      name: "Task",
      component: EmptyModal
    },
    {
      path: "/task/:id",
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
      path: "/",
      redirect: "/task"
    },
    {
      path: "/task/add",
      name: "AddTask",
      component: AddTaskModal
    },
    {
      path: "/statuses",
      name: "Addstatus",
      component: AddStatusModal
    }
  ]
})

export default router
