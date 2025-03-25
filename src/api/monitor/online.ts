import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
type ResponseType = {
  code: number;
  rows?: Array<any>;
  total?: number;
  data?: any;
  msg: string;
};
// 查询在线用户列表
export const getOnlineLogsList = query => {
  return http.request<ResponseType>("get", baseUrlApi("monitor/online/list"), {
    params: query
  });
};

// 强退用户
export const forceLogout = tokenId => {
  return http.request<ResponseType>(
    "delete",
    baseUrlApi(`monitor/online/${tokenId}`)
  );
};
