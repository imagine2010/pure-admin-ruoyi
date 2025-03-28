import dayjs from "dayjs";
import editForm from "../form/index.vue";
// import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, downloadByData } from "@pureadmin/utils";
import { addDateRange } from "@/utils/date";

import {
  listRole,
  getRole,
  addRole,
  updateRole,
  delRole,
  exportRole
} from "@/api/system/role";
import { treeselect, roleMenuTreeselect } from "@/api/system/menu";

import { type Ref, reactive, ref, onMounted, h, toRaw, computed } from "vue";
import router from "@/router";

export function useRole(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    roleName: "",
    roleKey: "",
    status: "",
    pageNum: 1,
    pageSize: 10,
    daterange: [] as any[]
  });
  const { tagStyle } = usePublicHooks();
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const selectedNum = ref(0);
  const ids = ref([]);
  const treeIds = ref([]);
  const treeData = ref([]);
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
      label: "角色编号",
      prop: "roleId"
    },
    {
      label: "角色名称",
      prop: "roleName"
    },
    {
      label: "角色标识",
      prop: "roleKey"
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
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function handleDelete(row) {
    const roleIds = row.roleId || ids.value;
    if (roleIds == null || roleIds == undefined || roleIds == "") {
      message("请先选择需要删除的角色", {
        type: "warning"
      });
      return;
    }
    delRole(roleIds).then(res => {
      if (res?.code == 200) {
        message(`您删除了用户编号为${roleIds}的这条数据`, {
          type: "success"
        });
        onSearch();
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

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    ids.value = val.map(item => item.roleId);
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
    const { rows, total } = await listRole(
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

  function handleExport() {
    exportRole(toRaw(form)).then(res => {
      downloadByData(res as Blob, `role_${new Date().getTime()}.xlsx`);
    });
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    const resData = ref();
    const resMenuIds = ref();
    try {
      let res;
      if (title === "新增") {
        res = await treeselect();
        if (res.code !== 200) {
          message(res.msg || "获取菜单树失败", { type: "error" });
          return;
        }
        treeData.value = res.data;
        treeIds.value = res.data.map(item => item.id);
      } else {
        const [roleRes, menuRes] = await Promise.all([
          getRole(row.roleId), // 获取角色基础信息
          roleMenuTreeselect(row.roleId) // 获取菜单树及选中项
        ]);
        if (roleRes.code !== 200 || menuRes.code !== 200) {
          message(
            roleRes.code !== 200
              ? roleRes.msg
              : menuRes.msg || "获取角色数据失败",
            { type: "error" }
          );
          return;
        }
        resData.value = roleRes.data;
        treeData.value = menuRes.menus;
        treeIds.value = menuRes.menus.map(item => item.id);
        resMenuIds.value = menuRes.checkedKeys;
      }
      addDialog({
        title: `${title}角色`,
        props: {
          formInline: {
            roleName: row?.roleName ?? "",
            roleId: row?.roleId ?? "",
            roleKey: row?.roleKey ?? "",
            remark: row?.remark ?? "",
            status: row?.status ?? "",
            menuIds: title == "新增" ? [] : resMenuIds.value,
            menuCheckStrictly: row?.menuCheckStrictly ?? true,
            roleSort: row?.roleSort ?? 0
          },
          treeData: treeData.value,
          treeIds: treeIds.value
        },
        width: "46%",
        draggable: true,
        fullscreen: deviceDetection(),
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () =>
          h(editForm, {
            ref: formRef,
            formInline: null,
            treeData: treeData.value,
            treeIds: treeIds.value
          }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline as FormItemProps;
          function chores() {
            message(`您${title}了角色名称为${curData.roleName}的这条数据`, {
              type: "success"
            });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
          FormRef.validate(valid => {
            if (valid) {
              curData.menuIds = formRef.value.getTreeRef().getCheckedKeys();
              if (title === "新增") {
                addRole(curData).then(res => {
                  if (res.code == 200) {
                    chores();
                  } else {
                    message(res.msg, {
                      type: "error"
                    });
                  }
                });
              } else {
                updateRole(curData).then(res => {
                  if (res.code == 200) {
                    chores();
                  } else {
                    message(res.msg, {
                      type: "error"
                    });
                  }
                });
              }
            }
          });
        }
      });
    } catch (error) {
      console.error("Error fetching role data:", error);
      message("获取角色数据失败", {
        type: "error"
      });
    }
  }

  /** 分配用户 */
  async function handleAuthUser(row?: any) {
    const { roleId } = row;
    if (roleId) {
      router.push({
        path: `/system/user-auth/${roleId}`
      });
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { id, name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(id, treeRef.value.getCheckedKeys());
    message(`角色名称为${name}的菜单权限修改成功`, {
      type: "success"
    });
  }

  /** 数据权限  */
  function handleDatabase() {
    console.log("handleDatabase");
  }

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    selectedNum,
    // ids,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    treeData,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleAuthUser,
    handleSave,
    handleDelete,
    handleExport,
    onSelectionCancel,
    filterMethod,
    transformI18n,
    onQueryChanged,
    handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
