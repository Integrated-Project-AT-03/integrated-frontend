import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Homeview.vue";
import TaskModal from "@/components/TaskModal.vue";
import EmptyModal from "@/components/EmptyModal.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/task",
      name: "Task",
      component: EmptyModal,
    },
    {
      path: "/task/:id",
      name: "TaskDetail",
      component: TaskModal,
    },
    {
      path: "/",
      redirect: "/task",
    },
  ],
});

export default router;
