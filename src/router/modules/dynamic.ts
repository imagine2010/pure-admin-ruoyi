const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/system/role-auth",
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
          showLink: true,
          title: "分配用户",
          activePath: "/system/role",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/system/dict-data",
    component: Layout,
    meta: {
      showLink: false,
      title: "字典数据",
      rank: 102
    },
    // permissions: ["system:dict:list"],
    children: [
      {
        path: "/system/dict/:dictId(\\d+)",
        name: "DictData",
        component: () => import("@/views/system/dict/data.vue"),
        meta: {
          showLink: true,
          title: "字典数据",
          activePath: "/system/dict",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/monitor/job-log",
    component: Layout,
    meta: {
      showLink: false,
      title: "调度日志",
      rank: 103
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
