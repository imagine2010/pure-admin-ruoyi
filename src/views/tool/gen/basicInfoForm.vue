<template>
  <el-form
    ref="basicInfoForm"
    :model="localInfo"
    :rules="rules"
    label-width="150px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="localInfo.tableName"
            placeholder="请输入仓库名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input v-model="localInfo.tableComment" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实体类名称" prop="className">
          <el-input v-model="localInfo.className" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input v-model="localInfo.functionAuthor" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="localInfo.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { watch, reactive, defineProps, defineEmits } from "vue";

const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["update:info"]);

// 创建本地响应式副本
const localInfo = reactive({ ...props.info });

// 监听父组件传递的 props 变化
watch(
  () => props.info,
  newVal => {
    Object.assign(localInfo, newVal);
  }
);

// 监听本地副本变化并触发更新事件
watch(
  () => ({ ...localInfo }),
  newVal => {
    emit("update:info", newVal);
  },
  { deep: true }
);

// 表单校验规则保持不变
const rules = ref({
  tableName: [{ required: true, message: "请输入表名称", trigger: "blur" }],
  tableComment: [{ required: true, message: "请输入表描述", trigger: "blur" }],
  className: [{ required: true, message: "请输入实体类名称", trigger: "blur" }],
  functionAuthor: [{ required: true, message: "请输入作者", trigger: "blur" }]
});
</script>
