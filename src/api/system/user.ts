import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
type ResponseType = {
  code: number;
  data?: any;
  msg: string;
  rows?: Array<any>;
  total?: number;
};

// 查询用户列表
export const listUser = (query: object) => {
  return http.request<ResponseType>("get", baseUrlApi("system/user/list"), {
    params: query
  });
};

// 查询用户详细
export const getUser = (userId: string | number) => {
  return http.request<ResponseType>("get", baseUrlApi(`system/user/${userId}`));
};

// 新增用户
export const addUser = (data?: object) => {
  return http.request<ResponseType>("post", baseUrlApi("system/user"), {
    data
  });
};

// 修改用户
export const updateUser = (data?: object) => {
  return http.request<ResponseType>("put", baseUrlApi("system/user"), { data });
};

// 删除用户
export const delUser = (userId: string | number) => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`system/user/${userId}`)
  );
};

// 用户密码重置
export const resetUserPwd = (userId: number, password: string) => {
  const data = {
    userId,
    password
  };
  return http.request<ResponseType>("put", baseUrlApi("system/user/resetPwd"), {
    data
  });
};

// 用户状态修改
export const changeUserStatus = (userId: number, status: string) => {
  const data = {
    userId,
    status
  };
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/user/changeStatus"),
    { data }
  );
};

// 查询用户个人信息
export const getUserProfile = () => {
  return http.request<ResponseType>("get", baseUrlApi("system/user/profile"));
};

// 修改用户个人信息
export const updateUserProfile = (data?: object) => {
  return http.request<ResponseType>("put", baseUrlApi("system/user/profile"), {
    data
  });
};

// 用户密码重置
export const updateUserPwd = (oldPassword: string, newPassword: string) => {
  const data = {
    oldPassword,
    newPassword
  };
  return http.request<ResponseType>(
    "put",
    baseUrlApi("system/user/profile/updatePwd"),
    {
      data
    }
  );
};

// 用户头像上传
export const uploadAvatar = (data: FormData) => {
  return http.request<ResponseType>(
    "post",
    baseUrlApi("system/user/profile/avatar"),
    {
      data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );
};

// 查询授权角色
export const getAuthRole = (userId: number) => {
  return http.request<ResponseType>(
    "get",
    baseUrlApi(`system/user/authRole/${userId}`)
  );
};

// 保存授权角色
export const updateAuthRole = (data?: object) => {
  return http.request<ResponseType>("put", baseUrlApi("system/user/authRole"), {
    data
  });
};

// 查询部门下拉树结构
export const deptTreeSelect = () => {
  return http.request<ResponseType>("get", baseUrlApi("system/user/deptTree"));
};
