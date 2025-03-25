import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive(<FormRules>{
  jobName: [{ required: true, message: "任务名称为必填项", trigger: "blur" }],
  invokeTarget: [
    { required: true, message: "调用方法为必填项", trigger: "blur" }
  ],
  cronExpression: [
    { required: true, message: "cron表达式为必填项", trigger: "blur" }
  ]
});
