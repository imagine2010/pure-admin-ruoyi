import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getOnlineLogsList, forceLogout } from "@/api/monitor/online";
import { reactive, ref, onMounted, toRaw } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useRole() {
  const form = reactive({
    userName: "",
    ipaddr: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      minWidth: 60
    },
    {
      label: "会话编号",
      prop: "tokenId",
      minWidth: 60
    },
    {
      label: "登录名称",
      prop: "userName",
      minWidth: 100
    },
    {
      label: "所属部门",
      prop: "deptName",
      minWidth: 100
    },
    {
      label: "主机",
      prop: "ipaddr",
      minWidth: 140
    },
    {
      label: "登录地点",
      prop: "loginLocation",
      minWidth: 140
    },
    {
      label: "操作系统",
      prop: "os",
      minWidth: 100
    },
    {
      label: "浏览器类型",
      prop: "browser",
      minWidth: 100
    },
    {
      label: "登录时间",
      prop: "loginTime",
      minWidth: 180,
      formatter: ({ loginTime }) =>
        dayjs(loginTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function handleOffline(row) {
    forceLogout(row.tokenId).then(res => {
      if (res.code == 200) {
        message(`${row.userName}已被强制下线`, { type: "success" });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  async function onSearch() {
    loading.value = true;
    const { rows, total } = await getOnlineLogsList(toRaw(form));
    dataList.value = rows;
    pagination.total = total;
    // pagination.pageSize = data.pageSize;
    // pagination.currentPage = data.currentPage;

    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleOffline,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
