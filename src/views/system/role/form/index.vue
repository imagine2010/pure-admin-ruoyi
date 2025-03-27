<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { formRules } from "../utils/rule";
import { FormItemProps } from "../utils/types";

interface Tree {
  [key: string]: any;
}
const props = withDefaults(
  defineProps<{
    formInline: FormItemProps;
    treeData: any[];
    treeIds?: number[];
  }>(),
  {
    formInline: () => ({
      roleName: "",
      roleKey: "",
      remark: "",
      roleSort: 0,
      status: "1",
      menuIds: [],
      menuCheckStrictly: true
    }),
    treeData: () => [],
    treeIds: () => []
  }
);

const treeRef = ref();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const treeData = ref(props.treeData);
const localTreeIds = ref(props.treeIds);
const treeProps = {
  value: "id",
  children: "children",
  label: "label"
};
const isExpandAll = ref(false);
const isSelectAll = ref(false);
const treeSearchValue = ref("");

function getRef() {
  return ruleFormRef.value;
}
function getTreeRef() {
  return treeRef.value;
}
onMounted(() => {
  nextTick(() => {
    treeRef.value?.setCheckedKeys(props.formInline.menuIds);
  });
});
watch(
  () => props.formInline.menuIds,
  newVal => {
    nextTick(() => {
      treeRef.value?.setCheckedKeys(newVal);
    });
  },
  { deep: true }
);
watch(
  () => props.treeIds,
  newVal => {
    localTreeIds.value = newVal;
  }
);

watch(isExpandAll, val => {
  let treeList = treeData.value;
  for (let i = 0; i < treeList.length; i++) {
    treeRef.value.store.nodesMap[treeList[i].id].expanded = val;
  }
});
watch(isSelectAll, val => {
  val
    ? treeRef.value?.setCheckedKeys(localTreeIds.value)
    : treeRef.value?.setCheckedKeys([]);
});

watch(treeSearchValue, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

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
      <div class="flex flex-wrap">
        <el-checkbox v-model="isExpandAll" label="展开/折叠" />
        <el-checkbox v-model="isSelectAll" label="全选/全不选" />
        <el-checkbox
          v-model="newFormInline.menuCheckStrictly"
          label="父子联动"
        />
        <el-input
          v-model="treeSearchValue"
          placeholder="请输入菜单进行搜索"
          class="mb-1"
          clearable
        />
        <el-tree
          ref="treeRef"
          class="block w-[200px]"
          show-checkbox
          node-key="id"
          :data="treeData"
          :props="treeProps"
          empty-text="加载中，请稍候"
          :check-strictly="!newFormInline.menuCheckStrictly"
          :filter-node-method="filterNode"
          :default-checked-keys="newFormInline.menuIds"
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
