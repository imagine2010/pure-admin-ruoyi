import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  roleName: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  permissions: [
    { required: true, message: "角色权限字符为必填项", trigger: "blur" }
  ],
  status: [{ required: true, message: "角色状态为必填项", trigger: "blur" }],
  roleSort: [{ required: true, message: "角色排序为必填项", trigger: "blur" }]
});
