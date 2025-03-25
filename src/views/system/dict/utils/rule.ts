import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  dictName: [{ required: true, message: "字典名称为必填项", trigger: "blur" }],
  dictType: [{ required: true, message: "字典类型为必填项", trigger: "blur" }]
});
