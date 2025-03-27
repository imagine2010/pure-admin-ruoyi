import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import importForm from "../form/import.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import { addDateRange } from "@/utils/date";
import {
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection,
  downloadByData
} from "@pureadmin/utils";
import { getToken } from "@/utils/auth";
import {
  listUser,
  getUser,
  uploadAvatar,
  deptTreeSelect,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  getAuthRole,
  updateAuthRole,
  exportUser,
  importTemplate
} from "@/api/system/user";
import { listRole } from "@/api/system/role";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import type {
  UploadProgressEvent,
  UploadFile,
  UploadFiles
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    userName: "",
    phonenumber: "",
    status: "",
    pageNum: 1,
    pageSize: 10,
    daterange: [] as any[]
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const deptOptions = ref();
  const roleOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const ids = ref([]);
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
      label: "用户编号",
      prop: "userId",
      width: 90
    },
    {
      label: "用户头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "用户名称",
      prop: "userName",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickName",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === "1" ? "danger" : null}
          effect="plain"
        >
          {row.sex === "1" ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "部门",
      prop: "dept.deptName",
      minWidth: 90
    },
    {
      label: "手机号码",
      prop: "phonenumber",
      minWidth: 90,
      formatter: ({ phonenumber }) =>
        hideTextAtIndex(phonenumber, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"0"}
          inactive-value={"1"}
          active-text="启用"
          inactive-text="停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
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
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();

  function onChange({ row }) {
    ElMessageBox.confirm(
      `确认要<strong> ${row.status === "1" ? "停用" : "启用"}</strong><strong style='color:var(--el-color-primary)'>${row.userName}</strong>用户吗?`,
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
        const id = +row.userId;
        const status = row.status === "0" ? "1" : "0";
        changeUserStatus(id, status).then(res => {
          if (res?.code == 200) {
            message(res.msg, {
              type: "success"
            });
          } else {
            message(res.msg, {
              type: "error"
            });
          }
        });
      })
      .catch(() => {
        row.status = row.status === "1" ? "0" : "1";
      });
  }

  function handleDelete(row) {
    const userIds = row.userId || ids.value;
    if (userIds == null || userIds == undefined || userIds == "") {
      message("请先选择需要删除的用户", {
        type: "warning"
      });
      return;
    }
    delUser(userIds).then(res => {
      if (res?.code == 200) {
        message(`您删除了用户编号为${userIds}的这条数据`, {
          type: "success"
        });
        onSearch();
      }
    });
  }

  function handleExport() {
    exportUser(toRaw(form)).then(res => {
      downloadByData(res as Blob, `user_${new Date().getTime()}.xlsx`);
    });
  }

  async function handleImport() {
    // 上传配置信息
    const uploadConfig = {
      url: import.meta.env.VITE_BASE_API + "/system/user/importData",
      headers: { Authorization: "Bearer " + getToken().accessToken }
    };
    const uploadState = reactive({
      updateSupport: false,
      isUploading: false
    });

    let uploadRef = null;

    const handleFileProgress = (
      // 参数仅为占位符
      _evt: UploadProgressEvent,
      _uploadFile: UploadFile,
      _uploadFiles: UploadFiles
    ) => {
      uploadState.isUploading = true;
    };

    const handleFileSuccess = (
      response: any,
      _uploadFile: UploadFile,
      _uploadFiles: UploadFiles
    ) => {
      uploadState.isUploading = false;
      ElMessageBox.alert(
        `<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>${response.msg}</div>`,
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
    };

    const handleImportTemplate = () => {
      importTemplate().then(res => {
        downloadByData(
          res as Blob,
          `user_template_${new Date().getTime()}.xlsx`
        );
      });
    };
    addDialog({
      title: "导入用户",
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(
          importForm,
          {
            // 传递上传配置和回调
            ref: ref => {
              uploadRef = ref;
            },
            uploadConfig,
            updateSupport: uploadState.updateSupport,
            onFileProgress: handleFileProgress,
            onFileSuccess: handleFileSuccess,
            "onUpdate:updateSupport": val => {
              uploadState.updateSupport = val;
            }
          },
          {
            "template-download": () =>
              h(
                "el-link",
                {
                  type: "primary",
                  underline: false,
                  style:
                    "font-size: 12px; vertical-align: baseline;color: var(--el-color-primary);",
                  onClick: handleImportTemplate
                },
                "下载模板"
              )
          }
        ),
      beforeSure: async done => {
        if (uploadRef && uploadRef.submit) {
          try {
            await uploadRef.submit();
            message("文件上传成功", { type: "success" });
            done();
            onSearch();
          } catch (error) {
            console.error(error);
            message("文件上传失败", { type: "error" });
          }
        } else {
          message("未选择文件", { type: "warning" });
        }
      }
    });
  }

  function handleSizeChange(val: number) {
    form.pageSize = val;
    onSearch();
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    form.pageNum = val;
    onSearch();
    console.log(`current page: ${val}`);
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
    const res = await listUser(addDateRange(toRaw(form), form.daterange));
    dataList.value = res.rows;
    pagination.total = res.total;
    pagination.currentPage = form.pageNum;
    pagination.pageSize = form.pageSize;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
  }

  // function formatHigherDeptOptions(treeList) {
  //   // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示
  //   if (!treeList || !treeList.length) return;
  //   const newTreeList = [];
  //   for (let i = 0; i < treeList.length; i++) {
  //     treeList[i].disabled = treeList[i].status === 0 ? true : false;
  //     formatHigherDeptOptions(treeList[i].children);
  //     newTreeList.push(treeList[i]);
  //   }
  //   return newTreeList;
  // }

  async function openDialog(title = "新增", row?: FormItemProps) {
    const resData = ref();
    const resRoleOptions = ref();
    const resRoleIds = ref();

    try {
      const res =
        title === "新增" ? await getUser() : await getUser(row.userId);
      if (res.code === 200) {
        resData.value = res.data;
        resRoleOptions.value = res.roles;
        resRoleIds.value = res.roleIds ?? [];

        // 确保数据加载完成后再调用 addDialog
        addDialog({
          title: `${title}用户`,
          props: {
            formInline: {
              title,
              deptOptions: deptOptions.value,
              roleOptions: resRoleOptions.value ?? roleOptions.value,
              deptId: row?.deptId ?? 0,
              roleIds: resRoleIds.value, // 确保此时 roleIds 已有值
              nickName: row?.nickName ?? "",
              userName: row?.userName ?? "",
              password: row?.password ?? "",
              phonenumber: row?.phonenumber ?? "",
              email: row?.email ?? "",
              sex: row?.sex ?? "",
              status: row?.status ?? 1,
              remark: row?.remark ?? ""
            }
          },
          width: "46%",
          draggable: true,
          fullscreen: deviceDetection(),
          fullscreenIcon: true,
          closeOnClickModal: false,
          contentRenderer: () =>
            h(editForm, { ref: formRef, formInline: null }),
          beforeSure: (done, { options }) => {
            const FormRef = formRef.value.getRef();
            const curData = options.props.formInline as FormItemProps;
            function chores() {
              message(`您${title}了用户名称为${curData.userName}的这条数据`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
            FormRef.validate(valid => {
              if (valid) {
                if (title === "新增") {
                  addUser(curData).then(res => {
                    if (res.code == 200) {
                      chores();
                    } else {
                      message(res.msg, {
                        type: "error"
                      });
                    }
                  });
                } else {
                  curData.userId = row.userId;
                  updateUser(curData).then(res => {
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
      } else {
        message(res.msg, {
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message("获取用户数据失败", {
        type: "error"
      });
    }
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        uploadAvatar(avatarInfo.value).then(res => {
          if (res.code == 200) {
            message(`您上传了用户头像`, {
              type: "success"
            });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.userName} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            resetUserPwd(+row.userId, pwdForm.newPwd).then(res => {
              if (res.code == 200) {
                message(`已成功重置 ${row.userName} 用户的密码`, {
                  type: "success"
                });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                message(res.msg, {
                  type: "error"
                });
              }
            });
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表(bug:后台没有返回当前用户的role，无法回显)
    const ids = (await getAuthRole(row.userId)).data ?? [];
    addDialog({
      title: `分配 ${row.userName} 用户的角色`,
      props: {
        formInline: {
          userName: row?.userName ?? "",
          nickName: row?.nickName ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        updateAuthRole({ userId: row.userId, roleIds: curData.ids }).then(
          res => {
            if (res.code == 200) {
              message(`已成功分配 ${row.userName} 用户的角色`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } else {
              message(res.msg, {
                type: "error"
              });
            }
          }
        );
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await deptTreeSelect();

    deptOptions.value = data;
    treeData.value = data;
    treeLoading.value = false;

    // 角色列表
    roleOptions.value = (await listRole())?.rows;
  });

  return {
    form,
    ids,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    handleExport,
    handleImport,
    openDialog,
    onTreeSelect,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
