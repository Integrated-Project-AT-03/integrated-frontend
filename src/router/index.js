import { createRouter, createWebHistory } from "vue-router";
import EmptyModal from "@/components/EmptyModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import ShowTaskModal from "@/components/ShowTaskModal.vue";
import StatusManagerPage from "./../views/TaskStatusPage.vue";
import TaskManagerPage from "./../views/TaskManagerPage.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import AddStatusModal from "@/components/AddStatusModal.vue";
import LoginPage from "../views/LoginPage.vue";
import AppPage from "@/views/AppPage.vue";
import CreateBoardModal from "../components/CreateBoardModal.vue";
import BoardManagerPage from "../views/BoardManagerPage.vue";
import { getUserInfo, validateToken } from "../services/apiAuth";
import { useUserStore } from "../stores/useUserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "Boards" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/board",
      component: AppPage,
      // meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "Boards",
          component: BoardManagerPage,

          children: [
            {
              path: "add",
              name: "AddBoard",
              component: CreateBoardModal,
            },
          ],
        },
        {
          path: ":oid",
          redirect: { name: "Task" },
        },
        {
          path: ":oid/task",
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
                  component: EmptyModal,
                },
              ],
            },

            {
              path: "add",
              name: "AddTask",
              component: AddTaskModal,
            },
          ],
        },

        {
          path: ":oid/status",
          name: "Status",
          component: StatusManagerPage,
          children: [
            {
              path: ":id/edit",
              name: "EditStatus",
              component: EditStatusModal,
            },
            {
              path: "add",
              name: "AddStatus",
              component: AddStatusModal,
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  try {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const tokenValidationResponse = await validateToken();

      if (tokenValidationResponse.httpStatus === 200) {
        next();
      } else {
        next("/login");
      }
    } else {
      next();
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    next("/login");
  }
});

export default router;
