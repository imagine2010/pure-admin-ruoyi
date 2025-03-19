<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
// import { transformI18n } from "@/plugins/i18n";
import { IconSelect } from "@/components/ReIcon";
import Segmented from "@/components/ReSegmented";
// import ReAnimateSelector from "@/components/ReAnimateSelector";
import {
  menuTypeOptions,
  visibleOptions,
  statusOptions,
  keepAliveOptions
} from "./utils/enums";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    menuType: "M",
    higherMenuOptions: [],
    parentId: 0,
    menuName: "",
    // name: "",
    path: "",
    component: "",
    orderNum: 99,
    icon: "",
    perms: "",
    status: "1",
    isCache: "0",
    visible: "0",
    menuId: 0,
    parentName: "",
    isFrame: "0"
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
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="newFormInline.menuType">
            <el-radio
              v-for="option in menuTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="newFormInline.higherMenuOptions"
            :props="{
              value: 'id',
              label: 'menuName',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.menuName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="newFormInline.menuName"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>
      <!-- <re-col
        v-if="newFormInline.menuType !== 'M'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </re-col> -->

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="组件路径">
          <el-input
            v-model="newFormInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单排序" prop="orderNum">
          <el-input-number
            v-model="newFormInline.orderNum"
            class="!w-full"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单图标">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否缓存">
          <el-radio-group v-model="newFormInline.isCache">
            <el-radio
              v-for="option in keepAliveOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示状态">
          <el-radio-group v-model="newFormInline.visible">
            <el-radio
              v-for="option in visibleOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单状态">
          <el-radio-group v-model="newFormInline.status">
            <el-radio
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <!-- 按钮级别权限设置 -->
        <el-form-item label="权限标识" prop="perms">
          <el-input
            v-model="newFormInline.perms"
            clearable
            placeholder="请输入权限标识"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
