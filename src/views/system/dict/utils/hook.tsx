import dayjs from "dayjs";
import editForm from "../form.vue";
// import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
// import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { addDateRange } from "@/utils/date";
import { useRouter } from "vue-router";

import {
  listType,
  // getType,
  delType,
  addType,
  updateType
  // refreshCache
} from "@/api/system/dict/type";

import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useDict() {
  const form = reactive({
    dictName: "",
    dictType: "",
    status: "",
    pageNum: 1,
    pageSize: 10,
    daterange: [] as any[]
  });
  const { tagStyle } = usePublicHooks();
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const router = useRouter();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "字典编号",
      prop: "dictId"
    },
    {
      label: "字典名称",
      prop: "dictName"
    },
    {
      label: "字典类型",
      prop: "dictType",
      cellRenderer: ({ row }) => (
        <el-button
          type="text"
          onClick={() => handleDictTypeClick(row.dictType)}
        >
          {row.dictType}
        </el-button>
      )
    },
    {
      label: "状态",
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === "0" ? "启用" : "停用"}
        </el-tag>
      ),
      minWidth: 90
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 160
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    delType(row.dictId).then(res => {
      if (res.code == 200) {
        message(`您删除了字典名称为${row.dictName} 的这条数据`, {
          type: "success"
        });
        onSearch();
      } else {
        message(res.msg, { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.pageNum = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  // 添加处理 dictType 点击的函数
  function handleDictTypeClick(dictType) {
    router.push({ name: "DictTypeDetail", params: { dictType } }); // 跳转到详情页面
  }

  async function onSearch() {
    loading.value = true;
    const { rows, total } = await listType(
      addDateRange(toRaw(form), form.daterange)
    );
    dataList.value = rows;
    pagination.total = total;
    pagination.currentPage = form.pageNum;
    pagination.pageSize = form.pageSize;

    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title} 字典`,
      props: {
        formInline: {
          dictName: row?.dictName ?? "",
          dictId: row?.dictId ?? "",
          remark: row?.remark ?? "",
          status: row?.status ?? "",
          dictType: row?.dictType ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          formInline: null
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了字典名称为${curData.dictName} 的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              addType(curData).then(res => {
                if (res.code == 200) {
                  chores();
                } else {
                  message(res.msg, { type: "error" });
                }
              });
            } else {
              updateType(curData).then(res => {
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

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }
  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    pagination,
    handleDictTypeClick,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    transformI18n,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
