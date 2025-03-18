import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type LoginResult = {
  code: number;
  msg: string;
  token: string;
};
export type UserResult = {
  code: number;
  msg: string;
  permissions: Array<string>;
  roles: Array<string>;
  user: any;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<LoginResult>("post", baseUrlApi("login"), { data });
};
/** 获取用户信息 */
export const getInfo = () => {
  return http.request<UserResult>("get", baseUrlApi("getInfo"));
};

/** 退出登录 */
export const logout = () => {
  return http.request("post", baseUrlApi("logout"));
};
