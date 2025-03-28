import dayjs from "dayjs";
import editForm from "../form/selectUser.vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import route from "@/router";
import {
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
  authUserSelectAll
} from "@/api/system/role";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";
import { ElMessageBox } from "element-plus";

export function useAuthUser(tableRef: Ref, paramsRoleId: number) {
  const form = reactive({
    userName: "",
    phonenumber: "",
    roleId: paramsRoleId,
    pageNum: 1,
    pageSize: 10
  });
  const { tagStyle } = usePublicHooks();
  const curRow = ref();
  const dataList = ref([]);
  const selectedNum = ref(0);
  const ids = ref([]);
  const isShow = ref(false);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
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
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === "0" ? "启用" : "停用"}
        </el-tag>
      ),
      minWidth: 90
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

  function handleSizeChange(val: number) {
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.pageNum = val;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    ids.value = val.map(item => item.userId);
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    ids.value = [];
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  async function onSearch() {
    loading.value = true;
    const { rows, total } = await allocatedUserList(toRaw(form));
    dataList.value = rows;
    pagination.total = total;
    pagination.currentPage = form.pageNum;
    pagination.pageSize = form.pageSize;

    loading.value = false;
  }
  function cancelAuthUserAll() {
    const roleId = form.roleId;
    const uIds = ids.value.join(",");
    authUserCancelAll({ roleId: roleId, userIds: uIds }).then(res => {
      if (res.code == 200) {
        message("取消用户角色成功", { type: "success" });
        onSearch();
      }
    });
  }
  function cancelAuthUser(row) {
    ElMessageBox.confirm(
      `确认要取消该用户${row.userName}的角色吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        authUserCancel({ userId: row.userId, roleId: form.roleId }).then(
          res => {
            if (res.code == 200) {
              message("取消用户角色成功", { type: "success" });
              onSearch();
            }
          }
        );
      })
      .catch();
  }
  function handleClose() {
    const obj = { path: "/role" };
    route.push(obj);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function openDialog() {
    // 创建对话框引用存储
    const dialogRef = ref<{
      selectedUserIds: number[];
    }>();
    addDialog({
      title: `新增用户`,
      props: {
        roleId: form.roleId
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: el => (dialogRef.value = el as any),
          roleId: form.roleId // 传递roleId参数
        }),
      beforeSure: done => {
        if (!dialogRef.value?.selectedUserIds?.length) {
          message("请先选择要授权的用户", { type: "warning" });
          return done(false);
        }
        authUserSelectAll({
          roleId: form.roleId,
          userIds: dialogRef.value.selectedUserIds.join(",")
        })
          .then(res => {
            if (res.code === 200) {
              message("用户授权成功", { type: "success" });
              done();
              onSearch();
            }
          })
          .catch(() => done(false));
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

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    selectedNum,
    isShow,
    loading,
    columns,
    rowStyle,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    onSelectionCancel,
    cancelAuthUserAll,
    handleClose,
    cancelAuthUser,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
