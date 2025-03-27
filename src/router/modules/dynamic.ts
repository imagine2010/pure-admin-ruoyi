const Layout = () => import("@/layout/index.vue");

export default [
  //  // params 传参模式
  //   {
  //     path: "/tabs/params-detail/:id",
  //     component: "params-detail",
  //     name: "TabParamsDetail",
  //     meta: {
  //       // 不在menu菜单中显示
  //       showLink: false,
  //       activePath: "/tabs/index",
  //       roles: ["admin", "common"]
  //     }
  //   }

  // {
  //   path: "/system/user-auth",
  //   // name: "userAuth",
  //   component: Layout,
  //   meta: {
  //     showLink: false,
  //     title: "分配角色",
  //     rank: 100
  //   },
  //   // permissions: ["system:user:edit"],
  //   children: [
  //     {
  //       path: "/system/user-auth/:id(\\d+)",
  //       name: "AuthRole",
  //       component: () => import("@/views/system/user/form/authRole.vue"),
  //       meta: {
  //         showLink: false,
  //         title: "分配角色",
  //         activePath: "/system/user",
  //         roles: ["admin"]
  //       }
  //     }
  //   ]
  // },
  {
    path: "/system/role-auth",
    // name: "userAuth",
    component: Layout,
    meta: {
      showLink: false,
      title: "分配用户",
      rank: 101
    },
    // permissions: ["system:role:edit"],
    children: [
      {
        path: "/system/user-auth/:id(\\d+)",
        name: "AuthUser",
        component: () => import("@/views/system/role/authUser.vue"),
        meta: {
          showLink: false,
          title: "分配用户",
          activePath: "/system/role",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/monitor/job-log",
    // name: "userAuth",
    component: Layout,
    meta: {
      showLink: false,
      title: "调度日志",
      rank: 102
    },
    // permissions: ['monitor:job:list'],
    children: [
      {
        path: "index/:jobId(\\d+)",
        name: "JobLog",
        component: () => import("@/views/monitor/job/log.vue"),
        meta: {
          showLink: false,
          title: "调度日志",
          activePath: "/monitor/job",
          roles: ["admin"]
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
