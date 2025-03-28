<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { unallocatedUserList } from "@/api/system/role";
import Refresh from "@iconify-icons/ep/refresh";
import dayjs from "dayjs";
defineOptions({
  name: "SelectUser"
});
const props = defineProps({
  roleId: {
    type: Number,
    required: true
  }
});
const dialogForm = reactive({
  userName: "",
  phonenumber: "",
  roleId: props.roleId,
  pageNum: 1,
  pageSize: 10
});
const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const tableRef = ref();
const dataList = ref([]);
const loading = ref(false);
const selectedUserIds = ref<number[]>([]);

const columns = [
  {
    label: "勾选列",
    type: "selection",
    fixed: "left",
    reserveSelection: true
  },
  {
    label: "用户名称",
    prop: "userName"
  },
  {
    label: "用户昵称",
    prop: "nickName"
  },
  {
    label: "邮箱",
    prop: "email"
  },
  {
    label: "手机",
    prop: "phonenumber"
  },
  {
    label: "状态",
    prop: "status"
  },
  {
    label: "创建时间",
    formatter: ({ createTime }) =>
      dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  }
];

const fetchData = async () => {
  try {
    loading.value = true;
    const { rows, total } = await unallocatedUserList(dialogForm);
    dataList.value = rows;
    pagination.total = total;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  dialogForm.pageNum = 1;
  fetchData();
};

const resetDialogForm = () => {
  dialogForm.userName = "";
  dialogForm.phonenumber = "";
  handleSearch();
};

const handleSizeChange = (val: number) => {
  dialogForm.pageSize = val;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  dialogForm.pageNum = val;
  fetchData();
};

const handleSelectionChange = val => {
  selectedUserIds.value = val.map(item => item.userId);
};

defineExpose({
  selectedUserIds
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="dialogForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="用户名称：" prop="userName">
        <el-input
          v-model="dialogForm.userName"
          placeholder="请输入用户名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="手机号码：" prop="phonenumber">
        <el-input
          v-model="dialogForm.phonenumber"
          placeholder="请输入手机号码"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetDialogForm">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <pure-table
      ref="tableRef"
      row-key="userId"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
    >
      <template #empty>
        <el-empty description="暂无未分配用户" />
      </template>
    </pure-table>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
