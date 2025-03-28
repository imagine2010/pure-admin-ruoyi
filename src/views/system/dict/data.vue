<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { deviceDetection, downloadByData } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import { useDictStoreHook } from "@/store/modules/dict";
import { message } from "@/utils/message";

import {
  listData,
  getData,
  getDicts,
  addData,
  updateData,
  delData,
  exportDictData
} from "@/api/system/dict/data";
import {
  optionselect as getDictOptionselect,
  getType
} from "@/api/system/dict/type";

import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
type formData = {
  dictValue: string;
  dictLabel: string;
  dictType?: string;
  status?: string;
  remark?: string;
  dictCode?: string;
  cssClass?: string;
  listClass?: string;
  dictSort: number;
};
defineOptions({
  name: "DictData"
});
const route = useRoute();
const router = useRouter();

const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dictType: undefined,
    dictLabel: undefined,
    status: undefined
  },
  pagination: {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  },
  form: {
    dictCode: undefined,
    dictLabel: undefined,
    dictValue: undefined,
    cssClass: undefined,
    listClass: "default",
    dictSort: 0,
    status: "0",
    remark: undefined
  } as formData,
  rules: {
    dictLabel: [
      { required: true, message: "数据标签不能为空", trigger: "blur" }
    ],
    dictValue: [
      { required: true, message: "数据键值不能为空", trigger: "blur" }
    ],
    dictSort: [{ required: true, message: "数据顺序不能为空", trigger: "blur" }]
  }
});

const { queryParams, pagination, form, rules } = toRefs(state);

const formRef = ref();
const tableRef = ref();
const contentRef = ref();

const dataList = ref([]);
const loading = ref(true);
const isShow = ref(false);
const selectedNum = ref(0);
const ids = ref([]);
const open = ref(false);
const title = ref("");
const typeOptions = ref([]);
const defaultDictType = ref("");

const columns: TableColumnList = [
  {
    label: "勾选列",
    type: "selection",
    fixed: "left",
    reserveSelection: true
  },
  {
    label: "字典编码",
    prop: "dictCode"
  },
  {
    label: "字典标签",
    prop: "dictLabel"
  },
  {
    label: "字典键值",
    prop: "dictValue"
  },
  {
    label: "字典排序",
    prop: "dictSort"
  },
  {
    label: "状态",
    prop: "status"
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: 180
  },
  {
    label: "备注",
    prop: "remark",
    width: 600
  },
  {
    label: "操作",
    fixed: "right",
    width: 160,
    slot: "operation"
  }
];

const getList = async () => {
  loading.value = true;
  try {
    const res = await listData(queryParams.value);
    dataList.value = res.rows;
    pagination.value.total = res.total;
  } finally {
    loading.value = false;
  }
};
const getDictsOption = async () => {
  const res = await getDictOptionselect();
  typeOptions.value = res.data;
};
const getTypes = async dictId => {
  const res = await getType(dictId);
  queryParams.value.dictType = res.data.dictType;
  defaultDictType.value = res.data.dictType;
  getList();
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    dictType: undefined,
    dictLabel: undefined,
    status: undefined
  };
  handleQuery();
};

const handleAdd = () => {
  open.value = true;
  title.value = "新增字典";
  state.form = {
    dictLabel: "",
    dictValue: "",
    dictSort: 0,
    dictType: defaultDictType.value
  };
};

const handleUpdate = row => {
  open.value = true;
  title.value = "修改字典";
  state.form = { ...row };
};
const submitForm = async () => {
  try {
    await formRef.value.validate();
    if (title.value == "修改字典") {
      await updateData(state.form);
    } else {
      await addData(state.form);
    }
    message("操作成功", { type: "success" });
    open.value = false;
    await getList();
  } catch (error) {
    console.error("表单提交失败:", error);
  }
};

const handleDelete = row => {
  const dictCodes = row.dictCode || ids.value;
  delData(dictCodes).then(res => {
    if (res.code === 200) {
      message("操作成功", { type: "success" });
      getList();
    }
  });
};
const handleExport = () => {
  exportDictData(queryParams.value).then(res => {
    downloadByData(res as Blob, `dict_data_${new Date().getTime()}.xlsx`);
  });
};
const handleClose = () => {
  router.go(-1);
};

const handleSelectionChange = val => {
  ids.value = val.map(v => v.dictCode);
  selectedNum.value = val.length;
};
const handleCurrentChange = val => {
  queryParams.value.pageNum = val;
  pagination.value.currentPage = val;
  getList();
};
const handleSizeChange = val => {
  queryParams.value.pageSize = val;
  pagination.value.pageSize = val;
  getList();
};
const onSelectionCancel = () => {
  tableRef.value.clearSelection();
};
// 数据标签回显样式
const listClassOptions = ref([
  { value: "default", label: "默认" },
  { value: "primary", label: "主要" },
  { value: "success", label: "成功" },
  { value: "info", label: "信息" },
  { value: "warning", label: "警告" },
  { value: "danger", label: "危险" }
]);

onMounted(() => {
  getTypes(route.params && route.params.dictId);
  getDictsOption();
});
</script>

<template>
  <div class="main">
    <el-form
      :inline="true"
      :model="queryParams"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="字典类型" prop="dictType">
        <el-select v-model="queryParams.dictType" class="!w-[180px]">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['flex', deviceDetection() ? 'flex-wrap' : '']"
    >
      <PureTableBar
        :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full']"
        style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
        title="字典数据列表"
        :columns="columns"
        @refresh="getList"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="handleExport"
          >
            导出
          </el-button>
          <el-button
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="handleClose"
          >
            关闭
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认批量删除?" @confirm="handleDelete">
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量取消授权
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            row-key="dictCode"
            :data="dataList"
            align-whole="center"
            showOverflowTooltip
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            :columns="dynamicColumns"
            :size="size"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :loading="loading"
            :pagination="{
              ...pagination,
              size
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                link
                type="primary"
                :icon="useRenderIcon(EditPen)"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                :icon="useRenderIcon(Delete)"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>

    <el-dialog v-model="open" :title="title" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number
            v-model="form.dictSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="form.listClass">
            <el-option
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label + '(' + item.value + ')'"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
