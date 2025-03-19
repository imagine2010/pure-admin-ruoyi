<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { treeselect } from "@/api/system/menu";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    roleName: "",
    roleKey: "",
    remark: "",
    roleSort: 0,
    status: "1",
    menuIds: [],
    menuCheckStrictly: true
  })
});

const treeRef = ref();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const treeProps = {
  value: "id",
  children: "children",
  label: "label"
};
const isExpandAll = ref(false);
const isSelectAll = ref(false);
const isLinkage = ref(false);
const treeData = ref();
treeselect().then(res => {
  treeData.value = res.data;
});
function getRef() {
  return ruleFormRef.value;
}
function getTreeRef() {
  return treeRef.value;
}

defineExpose({ getRef, getTreeRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="角色名称" prop="roleName">
      <el-input
        v-model="newFormInline.roleName"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="角色标识" prop="roleKey">
      <el-input
        v-model="newFormInline.roleKey"
        clearable
        placeholder="请输入角色标识"
      />
    </el-form-item>
    <el-form-item label="排序" prop="roleSort">
      <el-input-number v-model="newFormInline.roleSort" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio value="0">启用</el-radio>
        <el-radio value="1">停用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="菜单权限" prop="menuIds">
      <!-- <el-input
        v-model="treeSearchValue"
        placeholder="请输入菜单进行搜索"
        class="mb-1"
        clearable
        @input="onQueryChanged"
      /> -->
      <div class="flex flex-wrap">
        <el-checkbox v-model="isExpandAll" label="展开/折叠" />
        <el-checkbox v-model="isSelectAll" label="全选/全不选" />
        <el-checkbox v-model="isLinkage" label="父子联动" />
        <el-tree
          ref="treeRef"
          show-checkbox
          :data="treeData"
          :props="treeProps"
        />
      </div>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
