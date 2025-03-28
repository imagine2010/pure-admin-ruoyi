import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询部门列表
export const listDept = (query: object) => {
  return http.request<ResponseType>("get", baseUrlApi("system/dept/list"), {
    params: query
  });
};

// 查询部门列表（排除节点）
export const listDeptExcludeChild = deptId => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`system/dept/list/exclude/${deptId}`)
  );
};

// 查询部门详细
export const getDept = deptId => {
  return http.request<ResponseType>("get", baseUrlApi(`system/dept/${deptId}`));
};

// 新增部门
export const addDept = data => {
  return http.request<ResponseType>("post", baseUrlApi("system/dept"), {
    data
  });
};

// 修改部门
export const updateDept = data => {
  return http.request<ResponseType>("put", baseUrlApi("system/dept"), { data });
};

// 删除部门
export const delDept = deptId => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`system/dept/${deptId}`)
  );
};
