import Detail from "../detail.vue";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import { getKeyList } from "@pureadmin/utils";
import { deviceDetection } from "@pureadmin/utils";

import {
  listJob,
  getJob,
  addJob,
  updateJob,
  delJob
  // runJob
} from "@/api/monitor/job";
export function useRole(tableRef: Ref) {
  const form = reactive({
    jobName: "",
    jobGroup: "",
    status: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "任务编号",
      prop: "jobId",
      minWidth: 90
    },
    {
      label: "任务名称",
      prop: "jobName",
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: "任务组名",
      prop: "jobGroup",
      minWidth: 140
    },
    {
      label: "调用目标字符串",
      prop: "invokeTarget",
      minWidth: 100
    },
    {
      label: "cron执行表达式",
      prop: "cronExpression",
      minWidth: 140
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 250,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除序号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  /** 清空日志 */
  function clearAll() {
    // 根据实际业务，调用接口删除所有日志数据
    message("已删除所有日志数据", {
      type: "success"
    });
    onSearch();
  }
  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}任务`,
      props: {
        formInline: {
          jobName: row?.jobName ?? "",
          jobGroup: row?.jobGroup ?? "",
          invokeTarget: row?.invokeTarget ?? "",
          cronExpression: row?.cronExpression ?? "",
          status: row?.status ?? "",
          misfirePolicy: row?.misfirePolicy ?? "",
          concurrent: row?.concurrent ?? "",
          jobId: row?.jobId ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了任务名称为${curData.jobName}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            if (title === "新增") {
              addJob(curData).then(res => {
                if (res.code == 200) {
                  chores();
                } else {
                  message(res.msg, { type: "error" });
                }
              });
            } else {
              updateJob(curData).then(res => {
                if (res.code == 200) {
                  chores();
                } else {
                  message(res.msg, { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    delJob(row.jobId).then(res => {
      if (res.code == 200) {
        message(`您删除了任务名称为${row.jobName}的这条数据`, {
          type: "success"
        });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }
  function onDetail(row) {
    getJob({ id: row.id }).then(res => {
      addDialog({
        title: "系统日志详情",
        fullscreen: true,
        hideFooter: true,
        contentRenderer: () => Detail,
        props: {
          data: [res]
        }
      });
    });
  }

  async function onSearch() {
    loading.value = true;
    const { rows, total } = await listJob(toRaw(form));
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
    selectedNum,
    onSearch,
    onDetail,
    clearAll,
    resetForm,
    onbatchDel,
    openDialog,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
