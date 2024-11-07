import AddStatusModal from "@/components/AddStatusModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import EmptyModal from "@/components/EmptyModal.vue";
import ShowTaskModal from "@/components/ShowTaskModal.vue";
import AppPage from "@/views/AppPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import CreateBoardModal from "../components/CreateBoardModal.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import { validateToken } from "../services/apiAuth";
import BoardManagerPage from "../views/BoardManagerPage.vue";
import LoginPage from "../views/LoginPage.vue";
import NotAllowPage from "../views/NotAllowPage.vue";
import TaskManagerPage from "../views/TaskManagerPage.vue";
import StatusManagerPage from "../views/TaskStatusPage.vue";
import InvitePage from "../views/InvitePage.vue"; // เพิ่ม Invite Page
import { useBoardStore } from "../stores/useBoardStore";
import { getBoardByNanoId } from "../services/apiBoard";
import { useToast } from "vue-toastification";
import CollaboratorManagerPage from "../views/CollaboratorManagerPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/not-allow-page",
      name: "NotAllowPage",
      component: NotAllowPage,
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
          path: ":oid/collab",
          name: "Collab",
          component: CollaboratorManagerPage,
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
        {
          path: ":NanoId/invitations", 
          name: "InvitePage",
          component: InvitePage,
        },
      ],
    },
    {
      path: "/",
      redirect: { name: "Boards" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFoundPage",
      component: NotFoundPage,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const toast = useToast();
  try {
    const boardStore = useBoardStore();

    if (to.matched.some((record) => record.meta.ownerAccess)) {
      const res = await getBoardByNanoId(to.params.oid);
      boardStore.setCurrentBoard(res.data);

      if (["OWNER", "WRITER"].includes(boardStore.getCurrentBoard().access))
        next();
      else {
        next({ name: "NotAllowPage" });
      }
      return;
    }

    if (to.name === "InvitePage") {
      // ตรวจสอบสถานะของบอร์ดก่อนเข้าถึงหน้า Invite
      const res = await getBoardByNanoId(to.params.boardNanoId);
      boardStore.setCurrentBoard(res.data);

      if (res.data.status === "Pending") {
        next();
      } else {
        next({ name: "NotAllowPage" });
      }
      return;
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      const tokenValidationResponse = await validateToken();
      tokenValidationResponse.httpStatus === 200 ? next() : next("/login");

      return;
    }
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    next("/login");
  }
});

export default router;
