import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 查询在线用户列表
export const getOnlineLogsList = query => {
  return http.request("get", baseUrlApi("monitor/online/list"), {
    params: query
  });
};

// 强退用户
export const forceLogout = tokenId => {
  return http.request("delete", baseUrlApi(`monitor/online/${tokenId}`));
};
