import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询角色列表
export const listRole = (query?: object) => {
  return http.request<ResponseType>("get", baseUrlApi("system/role/list"), {
    params: query
  });
};

// 查询角色详细
export const getRole = (roleId?: string) => {
  return http.request<ResponseType>("get", baseUrlApi(`system/role/${roleId}`));
};

// 新增角色
export const addRole = (data: object) => {
  return http.request<ResponseType>("post", baseUrlApi("system/role"), {
    data
  });
};

// 修改角色
export const updateRole = (data: object) => {
  return http.request<ResponseType>("put", baseUrlApi("system/role"), {
    data
  });
};

// 角色数据权限
export const dataScope = (data: object) => {
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/role/dataScope"),
    {
      data
    }
  );
};

// 删除角色
export const delRole = (roleId: number) => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`system/role/${roleId}`)
  );
};

// 查询角色已授权用户列表
export const allocatedUserList = (query: object) => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi("system/role/authUser/allocatedList"),
    {
      params: query
    }
  );
};

// 查询角色未授权用户列表
export const unallocatedUserList = (query: object) => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi("system/role/authUser/unallocatedList"),
    {
      params: query
    }
  );
};

// 取消用户授权角色
export const authUserCancel = (data: object) => {
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/role/authUser/cancel"),
    {
      data
    }
  );
};

// 批量取消用户授权角色
export const authUserCancelAll = (data: object) => {
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/role/authUser/cancelAll"),
    {
      data
    }
  );
};

// 授权用户选择
export const authUserSelect = (data: object) => {
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/role/authUser/select"),
    {
      data
    }
  );
};

// 根据角色ID查询部门树结构
export const deptTreeSelect = (roleId: string) => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`system/role/deptTree/${roleId}`)
  );
};

// 导出角色列表
export const exportRole = (query?: object) => {
  return http.request("post", baseUrlApi("system/role/export"), {
    params: query,
    responseType: "blob"
  });
};
