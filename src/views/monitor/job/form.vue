<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    jobName: "",
    jobGroup: "",
    invokeTarget: "",
    cronExpression: "",
    misfirePolicy: "",
    concurrent: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :value="14" :xs="24" :sm="24">
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="newFormInline.jobName"
            clearable
            placeholder="请输入任务名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="10" :xs="24" :sm="24">
        <el-form-item label="任务分组" prop="jobGroup">
          <el-input
            v-model="newFormInline.jobGroup"
            clearable
            placeholder="请输入任务分组"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="调用方法" prop="invokeTarget">
          <el-input
            v-model="newFormInline.invokeTarget"
            clearable
            placeholder="请输入调用方法"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input
            v-model="newFormInline.cronExpression"
            clearable
            placeholder="请输入cron表达式"
          >
            <template #append>
              <el-button type="primary" size="small"> 生成表达式 </el-button>
            </template>
          </el-input>
        </el-form-item>
      </re-col>

      <re-col :value="14" :xs="24" :sm="24">
        <el-form-item label="执行策略" prop="misfirePolicy">
          <el-radio-group v-model="newFormInline.misfirePolicy" clearable>
            <el-radio-button label="1">立即执行</el-radio-button>
            <el-radio-button label="2">执行一次</el-radio-button>
            <el-radio-button label="3">放弃执行</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="10" :xs="24" :sm="24">
        <el-form-item label="是否并发" prop="concurrent">
          <el-radio-group v-model="newFormInline.concurrent" clearable>
            <el-radio-button label="0">允许</el-radio-button>
            <el-radio-button label="1">禁止</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
