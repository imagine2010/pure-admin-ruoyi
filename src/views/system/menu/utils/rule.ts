import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  menuName: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  parentId: [{ required: true, message: "上级菜单为必填项", trigger: "blur" }],
  orderNum: [{ required: true, message: "显示顺序为必填项", trigger: "blur" }],
  // component: [{ required: true, message: "组件路径为必填项", trigger: "blur" }],
  // name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "路由路径为必填项", trigger: "blur" }]
  // perms: [{ required: true, message: "权限标识为必填项", trigger: "blur" }]
});
