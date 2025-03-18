import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询部门列表
export const getDeptList = query => {
  return http.request("get", baseUrlApi("system/dept/list"), query);
};

// 查询部门列表（排除节点）
export const listDeptExcludeChild = deptId => {
  return http.request("get", baseUrlApi(`system/dept/list/exclude/${deptId}`));
};

// 查询部门详细
export const getDept = deptId => {
  return http.request("get", baseUrlApi(`system/dept/${deptId}`));
};

// 新增部门
export const addDept = data => {
  return http.request("post", baseUrlApi("system/dept"), { data });
};

// 修改部门
export const updateDept = data => {
  return http.request("put", baseUrlApi("system/dept"), { data });
};

// 删除部门
export const delDept = deptId => {
  return http.request("delete", baseUrlApi(`system/dept/${deptId}`));
};
