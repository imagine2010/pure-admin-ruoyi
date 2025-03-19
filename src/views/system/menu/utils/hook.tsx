import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { getMenuList, delMenu, addMenu, updateMenu } from "@/api/system/menu";
// import { transformI18n } from "@/plugins/i18n";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

export function useMenu() {
  const form = reactive({
    menuName: ""
  });
  const { tagStyle } = usePublicHooks();

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const getMenuType = (type, text = false) => {
    switch (type) {
      case "M":
        return text ? "目录" : "primary";
      case "F":
        return text ? "功能项" : "danger";
      case "C":
        return text ? "菜单" : "info";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "menuName",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.menuName}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menuType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.menuType)}
          effect="plain"
        >
          {getMenuType(row.menuType, true)}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "权限标识",
      prop: "perms"
    },
    {
      label: "排序",
      prop: "orderNum",
      width: 100
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === "0" ? "启用" : "停用"}
        </el-tag>
      ),
      width: 100
    },
    {
      label: "隐藏",
      prop: "visible",
      formatter: ({ visible }) => (visible == "0" ? "显示" : "隐藏"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuList(form);
    let newData = data;
    newData = newData.map(item => {
      item.id = item.menuId;
      return item;
    });
    dataList.value = handleTree(newData); // 处理成树结构
    loading.value = false;
  }

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].menuName = treeList[i].menuName;
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          menuType: row?.menuType ?? "M",
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          menuId: row?.menuId ?? 0,
          menuName: row?.menuName ?? "",
          path: row?.path ?? "",
          component: row?.component ?? "",
          orderNum: row?.orderNum ?? 99,
          icon: row?.icon ?? "",
          activePath: row?.activePath ?? "",
          perms: row?.perms ?? "",
          status: row?.status ?? "0",
          visible: row?.visible ?? "0",
          isFrame: row?.isFrame ?? "0",
          isCache: row?.isCache ?? "0",
          routeName: row?.routeName ?? "",
          query: row?.query ?? ""
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了菜单名称为${curData.menuName}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              addMenu(curData).then(res => {
                if (res.code == 200) {
                  chores();
                } else {
                  message(res.msg, {
                    type: "error"
                  });
                }
              });
            } else {
              updateMenu(curData).then(res => {
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
  }

  function handleDelete(row) {
    delMenu(row.menuId).then(res => {
      if (res.code == 200) {
        message(`您删除了菜单名称为${row.title}的这条数据`, {
          type: "success"
        });
        onSearch();
      } else {
        message(res.msg, {
          type: "error"
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSelectionChange
  };
}
