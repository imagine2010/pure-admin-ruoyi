import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
type roleMenuTreeselectType = {
  code: number;
  checkedKeys?: Array<any>;
  total?: number;
  menus?: Array<any>;
  msg?: string;
};
// 查询菜单列表
export const getMenuList = (query?: object) => {
  return http.request<ResponseType>("get", baseUrlApi("system/menu/list"), {
    params: query
  });
};

// 查询菜单详细
export const getMenu = (menuId: string) => {
  return http.request<ResponseType>("get", baseUrlApi(`system/menu/${menuId}`));
};

// 查询菜单下拉树结构
export const treeselect = () => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi("system/menu/treeselect")
  );
};

// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId: string) => {
  return http.request<roleMenuTreeselectType>(
    "get",
    baseUrlApi(`system/menu/roleMenuTreeselect/${roleId}`)
  );
};

// 新增菜单
export const addMenu = (data: object) => {
  return http.request<ResponseType>("post", baseUrlApi("system/menu"), {
    data
  });
};

// 修改菜单
export const updateMenu = (data: object) => {
  return http.request<ResponseType>("put", baseUrlApi("system/menu"), {
    data
  });
};

// 删除菜单
export const delMenu = (menuId: string) => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`system/menu/${menuId}`)
  );
};
