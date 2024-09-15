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
import { parseJwt } from "@/utils/helper";
import { ref } from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
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
          name: "Board",
          component: BoardManagerPage,
          meta: { requiresAuth: true },
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

const jwtPayload = ref();

function isTokenValid(token) {
  if (!token) {
    return false;
  }
  try {
    const token = localStorage.getItem("token");
    jwtPayload.value = parseJwt(token);
    const currenTime = Date.now() / 1000;
    if (token.exp < currenTime) {
      console.log("Token is expired");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Invalid token");
    return false;
  }
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isTokenValid(token)) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
