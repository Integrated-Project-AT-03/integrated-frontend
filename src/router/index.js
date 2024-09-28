import AddStatusModal from "@/components/AddStatusModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import EmptyModal from "@/components/EmptyModal.vue";
import ShowTaskModal from "@/components/ShowTaskModal.vue";
import AppPage from "@/views/AppPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import CreateBoardModal from "../components/CreateBoardModal.vue";
import ErrorResponse from "../components/ErrorResponse.vue";
import { validateToken } from "../services/apiAuth";
import BoardManagerPage from "../views/BoardManagerPage.vue";
import LoginPage from "../views/LoginPage.vue";
import TaskManagerPage from "./../views/TaskManagerPage.vue";
import StatusManagerPage from "./../views/TaskStatusPage.vue";
import { useBoardStore } from "./../stores/useBoardStore";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/board",
      component: AppPage,
      children: [
        {
          path: "",
          name: "Boards",
          meta: { requiresAuth: true },
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
                  meta: { ownerAccess: true },
                },
              ],
            },
            {
              path: "add",
              name: "AddTask",
              component: AddTaskModal,
              meta: { ownerAccess: true },
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
              meta: { ownerAccess: true },
            },
            {
              path: "add",
              name: "AddStatus",
              component: AddStatusModal,
              meta: { ownerAccess: true },
            },
          ],
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: ErrorResponse,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  try {
    if (to.matched.some((record) => record.meta.ownerAccess)) {
      const boardStore = useBoardStore();
      boardStore.getCurrentBoard().access === "OWNER" ? next() : next("/board");
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const tokenValidationResponse = await validateToken();
      tokenValidationResponse.httpStatus === 200 ? next() : next("/login");
    }
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    next("/login");
  }
});

export default router;
