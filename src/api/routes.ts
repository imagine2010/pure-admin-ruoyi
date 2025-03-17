import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type RouterResult = {
  code: number;
  msg: string;
  data: Array<any>;
};
/** 获取路由信息 */
export const getRouters = () => {
  return http.request<RouterResult>("get", baseUrlApi("getRouters"));
};
